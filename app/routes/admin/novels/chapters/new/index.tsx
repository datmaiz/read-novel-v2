import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'

import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'

import type { Novel } from '@/lib/types'
import { ChapterForm } from '@/components/chapter-form'
import { NewChapterLoading } from './loading'

type PageData = {
	novel: Pick<Novel, 'id' | 'title' | 'slug'>
	suggested: number
}

async function fetchPageData(novelId: string): Promise<PageData> {
	const [{ data: novel }, { data: last }] = await Promise.all([
		supabase
			.from('novels')
			.select('id,title,slug')
			.eq('id', novelId)
			.maybeSingle<Pick<Novel, 'id' | 'title' | 'slug'>>(),

		supabase
			.from('chapters')
			.select('chapter_number')
			.eq('novel_id', novelId)
			.order('chapter_number', {
				ascending: false,
			})
			.limit(1)
			.maybeSingle<{ chapter_number: number }>(),
	])

	if (!novel) {
		throw new Error('Novel not found')
	}

	return {
		novel,
		suggested: (last?.chapter_number ?? 0) + 1,
	}
}

export default function NewChapterPage() {
	const { id: novelId = '' } = useParams()

	const [data, setData] = useState<PageData | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<Error | null>(null)

	useEffect(() => {
		if (!novelId) return
		let cancelled = false

		;(async () => {
			try {
				setLoading(true)

				const result = await fetchPageData(novelId)

				if (!cancelled) {
					setData(result)
				}
			} catch (err) {
				if (!cancelled) {
					setError(err as Error)
				}
			} finally {
				if (!cancelled) {
					setLoading(false)
				}
			}
		})()

		return () => {
			cancelled = true
		}
	}, [novelId])

	if (loading) {
		return <NewChapterLoading />
	}

	if (error) {
		throw error
	}

	if (!data) {
		return null
	}

	const { novel, suggested } = data

	return (
		<div className='mx-auto max-w-3xl'>
			<Button
				asChild
				variant='ghost'
				size='sm'
				className='-ml-2 mb-4'
			>
				<Link to={`/admin/novels/${novelId}?page=1`}>
					<ArrowLeft
						className='mr-1 h-4 w-4'
						aria-hidden='true'
					/>
					Back to {novel.title}
				</Link>
			</Button>

			<h1 className='font-serif text-3xl font-semibold tracking-tight'>New chapter</h1>

			<p className='mt-1 text-sm text-muted-foreground'>Adding to {novel.title}</p>

			<div className='mt-8'>
				<ChapterForm
					novelId={novelId}
					suggestedNumber={suggested}
				/>
			</div>
		</div>
	)
}

import { Link, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import { ChapterForm } from '@/components/chapter-form'
import { supabase } from '@/lib/supabase/client'
import type { Chapter, Novel } from '@/lib/types'
import { EditChapterLoading } from './loading'
import { useGetChapterByIdQuery, useGetNovelByIdQuery } from '@/queries'

type PageData = {
	novel: Pick<Novel, 'id' | 'title'>
	chapter: Chapter
}

async function fetchPageData(novelId: string, chapterId: string): Promise<PageData> {
	const [{ data: novel }, { data: chapter }] = await Promise.all([
		supabase.from('novels').select('id,title').eq('id', novelId).maybeSingle<Pick<Novel, 'id' | 'title'>>(),

		supabase.from('chapters').select('*').eq('id', chapterId).maybeSingle<Chapter>(),
	])

	if (!novel) {
		throw new Error('Novel is not found')
	}

	if (!chapter) {
		throw new Error('Chapter is not found')
	}

	return {
		novel,
		chapter,
	}
}

export default function EditChapterPage() {
	const { id: novelId = '', chapterId = '' } = useParams()

	const {
		data: novelData,
		isLoading: novelLoading,
		error: novelError,
	} = useGetNovelByIdQuery({ id: novelId, select: 'id,title' })
	const {
		data: chapterData,
		isLoading: chapterLoading,
		error: chapterError,
	} = useGetChapterByIdQuery({ novelId, chapterId, select: '*' })

	if (novelLoading || chapterLoading) {
		return <EditChapterLoading />
	}

	if (novelError || chapterError) {
		throw novelError || chapterError
	}

	if (!novelData?.data || !chapterData?.data) {
		return null
	}

	const novel = novelData.data
	const chapter = chapterData.data

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

			<h1 className='font-serif text-3xl font-semibold tracking-tight'>Edit chapter</h1>

			<p className='mt-1 text-sm text-muted-foreground'>
				Chapter {chapter.chapter_number} · {novel.title}
			</p>

			<div className='mt-8'>
				<ChapterForm
					novelId={novelId}
					chapter={chapter}
				/>
			</div>
		</div>
	)
}

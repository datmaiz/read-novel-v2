import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { supabase } from '@/lib/supabase/client'
import { BookmarkAccordion } from './bookmark-accordion'
import { FeaturedChaptersLoading } from './loading'
import { useGetBookmarkedChapters } from '@/queries'
import { useAuthStore } from '@/zustand/auth'
import type { Route } from './+types'

type BookmarkRow = {
	created_at: string
	chapters: {
		id: string
		chapter_number: number
		title: string
		novels: {
			id: string
			title: string
			slug: string
		}
	}
}

type Grouped = {
	novel: BookmarkRow['chapters']['novels']
	chapters: BookmarkRow[]
}

export function meta({}: Route.MetaArgs) {
	return [{ title: 'Inkwell - Featured Chapter' }, { name: 'description', content: 'This is your bookmarked chapters' }]
}

export default function FeaturedChaptersPage() {
	const session = useAuthStore((s) => s.session)

	const {
		data: bookmarkedChaptersData,
		isFetching: isLoading,
		error,
	} = useGetBookmarkedChapters({ userId: session?.user?.id || '' })

	const rows = (bookmarkedChaptersData?.data ?? []) as unknown as BookmarkRow[]

	const groups = Object.values(
		rows.reduce((acc: Record<string, Grouped>, item) => {
			const novel = item.chapters.novels

			if (!acc[novel.id]) {
				acc[novel.id] = {
					novel,
					chapters: [],
				}
			}

			acc[novel.id].chapters.push(item)

			return acc
		}, {}),
	)

	if (isLoading) return <FeaturedChaptersLoading />

	return (
		<main className='mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-6 md:py-12'>
			<div className='mb-8'>
				<h1 className='text-3xl font-bold'>Marked Chapters</h1>
				<p className='text-muted-foreground mt-2'>The chapters you want to read again later</p>
			</div>

			{error && (
				<div className='rounded-md bg-red-50 p-4'>
					<div className='flex'>
						<AlertCircle className='h-5 w-5 text-red-400' />
						<div className='ml-3'>
							<h3 className='text-sm font-medium text-red-800'>Error loading marked chapters</h3>
							<p className='mt-2 text-sm text-red-700'>{error.message}</p>
						</div>
					</div>
				</div>
			)}

			{!isLoading && !error && <BookmarkAccordion groups={groups} />}
		</main>
	)
}

import { ArrowLeft } from 'lucide-react'
import { useEffect, useMemo } from 'react'
import { Link, useParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { ChapterReader } from './chapter-reader'
import { ReaderLoading } from './loading'

import { checkAdminEmail } from '@/lib/utils'
import {
	QUERY_KEYS,
	useChapterByChapterNumberQuery,
	useChapterPaginationAndCountQuery,
	useGetNovelBySlugQuery,
	useUpdateHistoryMutation,
} from '@/queries'
import { useAuthStore } from '@/zustand/auth'
import type { Chapter } from '@/lib/types'
import { useQueryClient } from '@tanstack/react-query'
import { useTitle } from '@/hooks/useTitle'

const INITIAL_CHAPTERS_RANGE = 30

export default function ReaderPage() {
	const { slug = '', number } = useParams()

	const chapterNumber = Number(number)

	const startChapter = useMemo(() => Math.max(1, chapterNumber - INITIAL_CHAPTERS_RANGE), [chapterNumber])
	const endChapter = useMemo(() => chapterNumber + INITIAL_CHAPTERS_RANGE, [chapterNumber])

	const session = useAuthStore((state) => state.session)
	const client = useQueryClient()

	const novelQuery = useGetNovelBySlugQuery({
		slug,
		select: `id,
        title,
        slug,
        author`,
	})
	const chapterByChapterNumberQuery = useChapterByChapterNumberQuery(novelQuery?.data?.data?.id || '', chapterNumber)
	const chapterPaginationAndCountQuery = useChapterPaginationAndCountQuery({
		novelId: novelQuery?.data?.data?.id || '',
		startChapter,
		endChapter,
	})
	const updateHistoryMutaion = useUpdateHistoryMutation()

	useChapterByChapterNumberQuery(novelQuery?.data?.data?.id || '', chapterNumber + 1)

	useEffect(() => {
		if (!session?.user?.id) return
		if (!novelQuery.data?.data || !chapterByChapterNumberQuery.data?.data?.id) return

		updateHistoryMutaion.mutate(
			{
				userId: session?.user.id ?? '',
				novelId: novelQuery?.data?.data?.id ?? '',
				chapterId: chapterByChapterNumberQuery?.data?.data?.id ?? '',
			},
			{
				onSuccess: () => {
					client.invalidateQueries({
						queryKey: QUERY_KEYS.getHistories,
					})
				},
			},
		)
	}, [session?.user.id, novelQuery.data?.data?.id, chapterByChapterNumberQuery.data?.data?.id])

	useTitle({
		title: `${novelQuery.data?.data?.title} - Chapter ${chapterByChapterNumberQuery.data?.data?.chapter_number}`,
	})

	if (novelQuery.isLoading || chapterByChapterNumberQuery.isLoading) {
		return (
			<>
				{/* {novelQuery.isLoading && <p>Novel Loading</p>}
				{chapterByChapterNumberQuery.isLoading && <p>Chapter Loading Loading</p>} */}
				<ReaderLoading />
			</>
		)
	}

	if (novelQuery.error) {
		throw novelQuery.error
	}
	if (chapterByChapterNumberQuery.error) throw chapterByChapterNumberQuery.error
	if (chapterPaginationAndCountQuery.error) throw chapterPaginationAndCountQuery.error

	if (!novelQuery.data?.data || !chapterByChapterNumberQuery.data?.data) {
		return <p>Not found</p>
	}

	const novel = novelQuery.data.data
	const chapter = chapterByChapterNumberQuery.data.data
	const chapters = (chapterPaginationAndCountQuery.data?.chapters.data ?? []) as unknown as Chapter[]
	const chapterCount = chapterPaginationAndCountQuery.data?.countResult.count ?? 0

	const idx = chapters.findIndex((c) => c.chapter_number === chapter.chapter_number)

	const prev = idx > 0 ? chapters[idx - 1] : null

	const next = idx >= 0 && idx < chapters.length - 1 ? chapters[idx + 1] : null

	return (
		<main className='mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-6 md:py-10'>
			<Button
				asChild
				variant='ghost'
				size='sm'
				className='-ml-2'
			>
				<Link to={`/novels/${novel.slug}?page=1`}>
					<ArrowLeft className='mr-1 h-4 w-4' />
					{novel.title}
				</Link>
			</Button>

			<ChapterReader
				key={chapter.id}
				novel={novel}
				chapter={chapter}
				initialChapters={chapters}
				prev={prev}
				next={next}
				chapterCount={chapterCount}
				isAdmin={checkAdminEmail(session?.user.email || '')}
			/>
		</main>
	)
}

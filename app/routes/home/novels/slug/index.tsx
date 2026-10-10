import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import type { Chapter, Novel } from '@/lib/types'
import { Link, useParams, useSearchParams } from 'react-router'
import { ArrowLeft, BookOpen, Calendar } from 'lucide-react'
import { useEffect, useState } from 'react'
import { NovelChaptersPagination } from '../chapter-pagination'
import { ExpandableDescription } from '../expandable-description'
import { useChapterPaginationAndCountQuery, useGetHistoryByNovelIdQuery, useGetNovelBySlugQuery } from '@/queries'
import { ChapterListSkeleton, NovelHeaderSkeleton } from './loadings'

const CHAPTERS_PER_PAGE = 20

type NovelData = Pick<Novel, 'id' | 'slug' | 'title' | 'author' | 'status' | 'genres' | 'description' | 'cover_url'>
type ChapterRow = Pick<Chapter, 'id' | 'novel_id' | 'chapter_number' | 'title' | 'created_at'>

interface ContinueReading {
	chapter_id: string
	last_read_at: string
	novel_id: string
	user_id: string
	progress: number
	chapter: {
		chapter_number: number
	}
}

export default function NovelPage() {
	const { slug = '' } = useParams()

	const [params] = useSearchParams()

	const currentPage = Number(params.get('page') ?? 1)

	const { data: novelData, isFetching: isLoadingNovel } = useGetNovelBySlugQuery({
		slug,
		select: 'id, slug, title, author, status, genres, description, cover_url',
	})
	const { data: chapterData, isFetching: isLoadingChapter } = useChapterPaginationAndCountQuery({
		novelId: novelData?.data?.id || '',
		startChapter: (currentPage - 1) * CHAPTERS_PER_PAGE + 1,
		endChapter: currentPage * CHAPTERS_PER_PAGE,
		select: 'id, novel_id, chapter_number, title, created_at',
	})
	const { data: continueReadingData } = useGetHistoryByNovelIdQuery({ novelId: novelData?.data?.id || '' })

	const novel = novelData?.data as Novel
	const chapters = (chapterData?.chapters.data || []) as unknown as Chapter[]
	const continueReading = continueReadingData?.data as unknown as ContinueReading
	const count = chapterData?.countResult.count || 0
	const totalPages = Math.ceil(count / CHAPTERS_PER_PAGE)

	useEffect(() => {
		if (!novel) return
		document.title = `Inkwell - ${novel.title}`
	}, [slug, currentPage])

	const firstChapter = chapters?.[0]

	const error = novelData?.error || chapterData?.chapters.error || chapterData?.countResult.error
	const isLoading = isLoadingNovel || isLoadingChapter

	return (
		<main className='mx-auto w-full max-w-4xl flex-1 px-4 py-8 md:px-6 md:py-12'>
			<Button
				asChild
				variant='ghost'
				size='sm'
				className='mb-6 -ml-2'
			>
				<Link to='/'>
					<ArrowLeft className='mr-1 h-4 w-4' />
					Back to library
				</Link>
			</Button>

			{error ? (
				<p className='rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive'>
					{error.message}
				</p>
			) : isLoading ? (
				<>
					<NovelHeaderSkeleton />
					<section className='mt-12'>
						<div className='h-8 w-32 animate-pulse rounded-md bg-muted' />
						<ChapterListSkeleton />
					</section>
				</>
			) : novel ? (
				<>
					<div className='grid gap-8 md:grid-cols-[220px_1fr]'>
						<div className='aspect-3/4 overflow-hidden rounded-lg border border-border bg-muted'>
							{novel.cover_url ? (
								<img
									src={novel.cover_url}
									alt={`Cover of ${novel.title}`}
									className='h-full w-full object-cover'
								/>
							) : (
								<div className='flex h-full w-full items-center justify-center bg-linear-to-br from-accent to-secondary'>
									<BookOpen className='h-12 w-12 text-muted-foreground' />
								</div>
							)}
						</div>

						<div className='flex flex-col gap-3'>
							{novel.status && (
								<span className='inline-flex w-fit rounded-full bg-secondary px-2.5 py-0.5 text-xs font-medium capitalize text-secondary-foreground'>
									{novel.status}
								</span>
							)}

							<h1 className='text-balance font-serif text-3xl font-semibold leading-tight tracking-tight md:text-4xl'>
								{novel.title}
							</h1>

							{novel.author && <p className='text-muted-foreground'>by {novel.author}</p>}

							{(novel.genres?.length ?? 0) > 0 && (
								<div className='flex flex-wrap gap-1.5'>
									{novel.genres?.map((genre: string) => (
										<span
											key={genre}
											className='rounded-full bg-accent px-2.5 py-0.5 text-xs text-accent-foreground'
										>
											{genre}
										</span>
									))}
								</div>
							)}

							{novel.description && <ExpandableDescription>{novel.description}</ExpandableDescription>}

							<div className='mt-4 flex flex-wrap items-center gap-3'>
								{continueReading && (
									<Button
										asChild
										size={'lg'}
									>
										<Link to={`/novels/${novel.slug}/chapters/${continueReading.chapter.chapter_number}`}>
											Continue Reading
											<BookOpen className='ml-1 h-4 w-4' />
										</Link>
									</Button>
								)}
								{firstChapter ? (
									<Button
										asChild
										size='lg'
									>
										<Link to={`/novels/${novel.slug}/chapters/${firstChapter.chapter_number}`}>
											Start reading
											<BookOpen className='ml-1 h-4 w-4' />
										</Link>
									</Button>
								) : (
									<Button
										disabled
										size='lg'
									>
										No chapters yet
									</Button>
								)}

								<span className='text-sm text-muted-foreground'>{count} chapters</span>
							</div>
						</div>
					</div>

					<section className='mt-12'>
						<h2 className='font-serif text-2xl font-semibold tracking-tight'>Chapters</h2>

						{chapters.length === 0 ? (
							<p className='mt-4 rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground'>
								No chapters have been published yet.
							</p>
						) : (
							<ol className='mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card'>
								{chapters.map((chapter) => (
									<li key={chapter.id}>
										<Link
											to={`/novels/${novel.slug}/chapters/${chapter.chapter_number}`}
											className='flex items-center justify-between gap-4 px-4 py-3 hover:bg-accent/40'
										>
											<div className='flex min-w-0 items-center gap-3'>
												<span className='flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-secondary text-sm font-medium'>
													{chapter.chapter_number}
												</span>
												<span className='truncate font-serif'>{chapter.title}</span>
											</div>

											<span className='hidden items-center gap-1 text-xs text-muted-foreground sm:flex'>
												<Calendar className='h-3.5 w-3.5' />
												{new Date(chapter.created_at).toLocaleDateString()}
											</span>
										</Link>
									</li>
								))}
							</ol>
						)}

						{totalPages > 1 && (
							<NovelChaptersPagination
								currentPage={currentPage}
								totalPages={totalPages}
								slug={slug}
							/>
						)}
					</section>
				</>
			) : null}
		</main>
	)
}

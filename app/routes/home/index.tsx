import { formatDistanceToNow } from 'date-fns'
import { ArrowRight, BookMarked, Feather, Library } from 'lucide-react'
import { Suspense } from 'react'
import { Link } from 'react-router'

import { NovelCard } from '@/components/nove-card'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import type { Novel } from '@/lib/types'
import { useGetHistoriesPaginationQuery, useGetNovelsPagination, useGetRecentUpdatesNovelPagination } from '@/queries'
import { useAuthStore } from '@/zustand/auth'
import HomeLoading from './loading'
import { useTitle } from '@/hooks/useTitle'

const NOVELS_PER_PAGE = 24

type HistoryItem = {
	user_id: string
	novel_id: string
	novel: { slug: string; title: string; cover_url: string }
	chapter: { chapter_number: number; title: string }
	last_read_at: string
}

type RecentUpdateNovel = {
	id: string
	title: string
	description: string
	slug: string
	cover_url: string | null
	latest_chapter_number: number
	latest_chapter_title: string
	latest_chapter_at: string
}

export default function HomePage() {
	const session = useAuthStore((state) => state.session)

	const novelOffset = 0

	const {
		data: novelsData,
		isFetching: isNovelLoading,
		error: novelsError,
	} = useGetNovelsPagination({
		novelsPerPage: NOVELS_PER_PAGE,
		offset: novelOffset,
	})
	const {
		data: recentUpdatesData,
		isFetching: isRecentUpdateLoading,
		error: recentUpdatesError,
	} = useGetRecentUpdatesNovelPagination({
		novelsPerPage: 5,
		offset: 0,
	})
	const {
		data: readingHistoriesData,
		isFetching: isHistoryLoading,
		error: historyError,
	} = useGetHistoriesPaginationQuery({
		userId: session?.user.id || '',
		from: 0,
		to: 5,
	})

	const novels = novelsData?.data as unknown as Novel[]
	const recentUpdates = recentUpdatesData?.data as unknown as RecentUpdateNovel[]
	const readingHistories = readingHistoriesData?.data as unknown as HistoryItem[]

	if (novelsError || recentUpdatesError || historyError) {
		return (
			<div className='container py-10'>
				<h1 className='text-xl font-semibold'>Something went wrong</h1>

				<p>{novelsError?.message || recentUpdatesError?.message || historyError?.message}</p>
			</div>
		)
	}

	useTitle({ title: 'Inkwell — A Quiet Place to Read' })

	return (
		<Suspense fallback={<HomeLoading />}>
			<main className='flex-1'>
				{/* Hero */}
				<section className='border-b border-border bg-linear-to-b from-accent/40 to-background'>
					<div className='mx-auto flex w-full max-w-6xl flex-col items-start gap-6 px-4 py-16 md:px-6 md:py-24'>
						<span className='inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground'>
							<Feather
								className='h-3.5 w-3.5'
								aria-hidden='true'
							/>
							An unhurried place to read
						</span>

						<h1 className='max-w-3xl text-balance font-serif text-4xl font-semibold leading-tight tracking-tight md:text-6xl'>
							Stories worth your evening, chapter by chapter.
						</h1>

						<p className='max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground md:text-lg'>
							Inkwell is a small, well-lit library for serialized fiction. Browse the shelves, pick up where you left
							off, and lose an hour the way you used to.
						</p>

						<div className='flex flex-wrap items-center gap-3'>
							<Button
								asChild
								size='lg'
							>
								<a href='#library'>
									Browse the library
									<ArrowRight
										className='ml-1 h-4 w-4'
										aria-hidden='true'
									/>
								</a>
							</Button>

							{!session?.user && (
								<Button
									asChild
									size='lg'
									variant='outline'
								>
									<Link to='/login'>Sign in</Link>
								</Button>
							)}
						</div>
					</div>
				</section>

				{/* Features */}
				<section className='mx-auto w-full max-w-6xl px-4 py-12 md:px-6'>
					<div className='grid gap-6 md:grid-cols-3'>
						<FeatureCard
							icon={
								<Library
									className='h-5 w-5'
									aria-hidden='true'
								/>
							}
							title='Curated shelves'
							description='A handpicked library of novels and serials, organized for slow discovery.'
						/>
						<FeatureCard
							icon={
								<BookMarked
									className='h-5 w-5'
									aria-hidden='true'
								/>
							}
							title='Chapter by chapter'
							description='Navigate with arrow keys, jump via the chapter list, and copy a chapter in one click.'
						/>
						<FeatureCard
							icon={
								<Feather
									className='h-5 w-5'
									aria-hidden='true'
								/>
							}
							title='Made for readers'
							description='No accounts to read. Just open a book and begin.'
						/>
					</div>
				</section>

				{/* Continue Reading */}
				{isHistoryLoading ? (
					<section className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
						<div className='grid gap-6 md:grid-cols-3'>
							{Array.from({ length: 3 }).map((_, i) => (
								<div
									key={i}
									className='rounded-lg border p-6'
								>
									<Skeleton className='h-10 w-10 rounded-md bg-secondary' />
									<Skeleton className='mt-4 h-6 w-32 bg-secondary' />
									<Skeleton className='mt-2 h-4 w-full bg-secondary' />
									<Skeleton className='mt-2 h-4 w-5/6 bg-secondary' />
								</div>
							))}
						</div>
					</section>
				) : (
					session?.user &&
					readingHistories.length > 0 && (
						<section className='mx-auto w-full max-w-6xl px-4 py-12 md:px-6'>
							<div className='mb-6 flex items-end justify-between'>
								<div>
									<h2 className='font-serif text-3xl font-semibold tracking-tight'>Continue Reading</h2>
									<p className='mt-1 text-sm text-muted-foreground'>Pick up where you left off.</p>
								</div>
								<Button
									asChild
									variant='ghost'
								>
									<Link to='/history?page=1'>
										View all
										<ArrowRight className='ml-1 h-4 w-4' />
									</Link>
								</Button>
							</div>

							<div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
								{readingHistories.map((history) => (
									<Link
										key={`${history.user_id}-${history.novel_id}`}
										to={`/novels/${history.novel.slug}/chapters/${history.chapter.chapter_number}`}
										className='group rounded-lg border bg-card transition-colors hover:bg-accent/40'
									>
										<div className='flex gap-4 p-4'>
											<img
												src={history.novel.cover_url || '/placeholder.svg?height=120&width=80'}
												alt={history.novel.title}
												className='h-28 w-20 rounded-md object-cover'
											/>
											<div className='min-w-0 flex-1'>
												<h3 className='line-clamp-2 font-medium group-hover:text-primary'>{history.novel.title}</h3>
												<p className='mt-2 text-sm text-muted-foreground'>Chapter {history.chapter.chapter_number}</p>
												<p className='line-clamp-1 text-sm text-muted-foreground'>{history.chapter.title}</p>
												<div className='mt-4 text-xs text-muted-foreground'>
													Last read {new Date(history.last_read_at).toLocaleDateString()}
												</div>
											</div>
										</div>
									</Link>
								))}
							</div>
						</section>
					)
				)}

				{/* Recently Updated */}
				<section className='mx-auto w-full max-w-6xl px-4 py-12 md:px-6'>
					<div className='mb-6 flex items-end justify-between'>
						<div>
							<h2 className='font-serif text-3xl font-semibold tracking-tight'>Recently Updated</h2>
							<p className='mt-1 text-sm text-muted-foreground'>Fresh chapters from ongoing stories.</p>
						</div>
						<Button
							asChild
							variant='ghost'
						>
							<Link to='/recently-updates?page=1'>
								View all
								<ArrowRight className='ml-1 h-4 w-4' />
							</Link>
						</Button>
					</div>

					<div className='grid gap-4 md:grid-cols-2'>
						{isRecentUpdateLoading ? (
							<>
								{Array.from({ length: 4 }).map((_, i) => (
									<div
										key={i}
										className='flex gap-4 rounded-lg border p-4'
									>
										<Skeleton className='h-24 w-16 rounded-md bg-secondary' />

										<div className='flex-1 space-y-2'>
											<Skeleton className='h-5 w-2/3 bg-secondary' />
											<Skeleton className='h-4 w-24 bg-secondary' />
											<Skeleton className='h-4 w-full bg-secondary' />
											<Skeleton className='h-4 w-5/6 bg-secondary' />
											<Skeleton className='h-3 w-24 bg-secondary' />
										</div>
									</div>
								))}
							</>
						) : (
							recentUpdates.map((novel) => (
								<Link
									key={novel.id}
									to={`/novels/${novel.slug}/chapters/${novel.latest_chapter_number}`}
									className='group rounded-lg border bg-card p-4 transition-colors hover:bg-accent/40'
								>
									<div className='flex gap-4'>
										<img
											src={novel.cover_url || '/placeholder.svg?height=120&width=80'}
											alt={novel.title}
											className='h-24 w-16 rounded-md object-cover'
										/>
										<div className='min-w-0 flex-1'>
											<h3 className='line-clamp-1 font-medium group-hover:text-primary'>{novel.title}</h3>
											<p className='mt-2 text-sm text-muted-foreground'>
												Chapter {novel.latest_chapter_number} - <b>{novel.latest_chapter_title}</b>
											</p>
											<p className='mt-1 line-clamp-2 text-sm text-muted-foreground'>{novel.description}</p>
											<div className='mt-3 text-xs text-muted-foreground'>
												Updated{' '}
												{formatDistanceToNow(new Date(novel.latest_chapter_at), {
													addSuffix: true,
												})}
											</div>
										</div>
									</div>
								</Link>
							))
						)}
					</div>
				</section>

				{/* Library */}
				<section
					id='library'
					className='mx-auto w-full max-w-6xl px-4 pb-20 md:px-6'
				>
					<div className='mb-8 flex items-end justify-between gap-4'>
						<div>
							<h2 className='font-serif text-3xl font-semibold tracking-tight md:text-4xl'>The library</h2>
							<p className='mt-1 text-sm text-muted-foreground'>{novels?.length || 0} novels on the shelf</p>
						</div>
					</div>

					<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
						{isNovelLoading ? (
							<>
								{Array.from({ length: 6 }).map((_, i) => (
									<div
										key={i}
										className='rounded-lg border p-4'
									>
										<Skeleton className='aspect-3/4 w-full rounded-md bg-secondary' />
										<Skeleton className='mt-4 h-5 w-3/4 bg-secondary' />
										<Skeleton className='mt-2 h-4 w-full bg-secondary' />
										<Skeleton className='mt-1 h-4 w-5/6 bg-secondary' />
									</div>
								))}
							</>
						) : (
							novels.map((novel) => (
								<NovelCard
									key={novel.id}
									novel={novel}
								/>
							))
						)}
					</div>
				</section>
			</main>
		</Suspense>
	)
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
	return (
		<div className='rounded-lg border border-border bg-card p-6'>
			<div className='flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary'>{icon}</div>
			<h3 className='mt-4 font-serif text-lg font-semibold'>{title}</h3>
			<p className='mt-1 text-sm leading-relaxed text-muted-foreground'>{description}</p>
		</div>
	)
}

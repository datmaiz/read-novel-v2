import { Link, useSearchParams } from 'react-router'
import { formatDistanceToNow } from 'date-fns'

import { Button } from '@/components/ui/button'
import { useGetRecentUpdatesNovelPagination } from '@/queries'
import { UpdatesLoading } from './loading'
import type { Route } from './+types'

const PAGE_SIZE = 5

type RecentlyUpdatedNovel = {
	id: string
	slug: string
	title: string
	description: string | null
	cover_url: string | null
	latest_chapter_number: number
	latest_chapter_title: string
	latest_chapter_at: string
}

export function meta({}: Route.MetaArgs) {
	return [
		{ title: 'Inkwell - Recently Updates Novels' },
		{ name: 'description', content: 'Novels that have been updated recently' },
	]
}

export default function UpdatesPage() {
	const [params] = useSearchParams()

	const currentPage = Math.max(Number(params.get('page') || '1'), 1)
	const offset = (currentPage - 1) * PAGE_SIZE

	const {
		data: response,
		isPending: isLoading,
		error,
	} = useGetRecentUpdatesNovelPagination({
		novelsPerPage: PAGE_SIZE,
		offset,
	})

	if (isLoading) {
		return <UpdatesLoading />
	}

	if (error) {
		throw error
	}

	const novels = (response?.data ?? ([] as unknown)) as RecentlyUpdatedNovel[]
	const totalPages = Math.ceil((response?.count ?? 0) / PAGE_SIZE)

	return (
		<main className='mx-auto w-full max-w-6xl px-4 py-10 md:px-6'>
			<div className='mb-8'>
				<h1 className='font-serif text-4xl font-semibold'>Recently Updated</h1>

				<p className='mt-2 text-muted-foreground'>
					Page {currentPage} of {Math.max(totalPages, 1)}
				</p>
			</div>

			<div className='grid gap-4 md:grid-cols-2'>
				{novels.map((novel) => (
					<Link
						key={novel.id}
						to={`/novels/${novel.slug}/chapters/${novel.latest_chapter_number}`}
						className='group rounded-lg border bg-card p-4 transition-colors hover:bg-accent/40'
					>
						<div className='flex gap-4'>
							<img
								src={novel.cover_url ?? '/placeholder.svg'}
								alt={novel.title}
								className='h-24 w-16 rounded-md object-cover'
							/>

							<div className='min-w-0 flex-1'>
								<h2 className='line-clamp-1 font-medium group-hover:text-primary'>{novel.title}</h2>

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
				))}
			</div>

			{totalPages > 1 && (
				<div className='mt-10 flex items-center justify-center gap-2'>
					<Button
						asChild
						variant='outline'
						disabled={currentPage <= 1}
					>
						<Link to={`/recently-updates?page=${currentPage - 1}`}>Previous</Link>
					</Button>

					<span className='px-4 text-sm text-muted-foreground'>
						{currentPage} / {totalPages}
					</span>

					<Button
						asChild
						variant='outline'
						disabled={currentPage >= totalPages}
					>
						<Link to={`/recently-updates?page=${currentPage + 1}`}>Next</Link>
					</Button>
				</div>
			)}
		</main>
	)
}

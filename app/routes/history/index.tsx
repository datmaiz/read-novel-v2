import { Link, useNavigate, useSearchParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { useGetHistoriesPaginationQuery } from '@/queries'
import { useAuthStore } from '@/zustand/auth'
import HistoryLoading from './loading'
import type { Route } from './+types'

type HistoryItem = {
	user_id: string
	novel_id: string
	last_read_at: string
	novel: {
		slug: string
		title: string
		cover_url: string | null
	}
	chapter: {
		chapter_number: number
		title: string
	}
}

const PAGE_SIZE = 5

export function meta({}: Route.MetaArgs) {
	return [{ title: 'Inkwell - History Reading' }, { name: 'description', content: 'This is your reading history' }]
}

export default function HistoryPage() {
	const session = useAuthStore((state) => state.session)
	const [params] = useSearchParams()

	const currentPage = Math.max(Number(params.get('page') || '1'), 1)
	const from = (currentPage - 1) * PAGE_SIZE
	const to = from + PAGE_SIZE - 1

	const {
		data: response,
		isPending: isLoading,
		error,
	} = useGetHistoriesPaginationQuery({
		userId: session?.user.id || '',
		from,
		to,
	})

	if (isLoading) {
		return <HistoryLoading />
	}

	if (error) {
		throw error
	}

	const histories = (response?.data ?? ([] as unknown)) as HistoryItem[]
	const totalPages = Math.ceil((response?.count ?? 0) / PAGE_SIZE)

	return (
		<main className='mx-auto w-full max-w-6xl flex-1 px-4 py-10 md:px-6'>
			<div className='mb-8'>
				<h1 className='font-serif text-4xl font-semibold'>Reading History</h1>

				<p className='mt-2 text-muted-foreground'>
					Page {currentPage} of {Math.max(totalPages, 1)}
				</p>
			</div>

			<div className='space-y-4'>
				{histories.map((history) => (
					<Link
						key={`${history.user_id}-${history.novel_id}`}
						to={`/novels/${history.novel.slug}/chapters/${history.chapter.chapter_number}`}
						className='group block rounded-lg border bg-card hover:bg-accent/40'
					>
						<div className='flex gap-4 p-4'>
							<img
								src={history.novel.cover_url ?? '/placeholder.svg'}
								alt={history.novel.title}
								className='h-32 w-24 rounded-md object-cover'
							/>

							<div className='flex-1'>
								<h2 className='font-medium group-hover:text-primary'>{history.novel.title}</h2>

								<p className='mt-2 text-sm text-muted-foreground'>Chapter {history.chapter.chapter_number}</p>

								<p className='text-sm text-muted-foreground'>{history.chapter.title}</p>

								<p className='mt-3 text-xs text-muted-foreground'>{new Date(history.last_read_at).toLocaleString()}</p>
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
						<Link to={`/history?page=${currentPage - 1}`}>Previous</Link>
					</Button>

					<span className='px-4 text-sm text-muted-foreground'>
						{currentPage} / {totalPages}
					</span>

					<Button
						asChild
						variant='outline'
						disabled={currentPage >= totalPages}
					>
						<Link to={`/history?page=${currentPage + 1}`}>Next</Link>
					</Button>
				</div>
			)}
		</main>
	)
}

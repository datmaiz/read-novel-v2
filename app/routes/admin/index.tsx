import { BookOpen, FileText, Plus } from 'lucide-react'
import { Link } from 'react-router'

import { NovelsPagination } from '@/components/admin/novel-pagination'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

import type { Novel } from '@/lib/types'
import { useGetNovelWithCountRPCPagination, useNovelCount } from '@/queries'
import { useSearchParams } from 'react-router'
import { AdminLoading } from './admin-loading'

const NOVELS_PER_PAGE = 20

type NovelWithCount = Novel & {
	count: number
}
export default function AdminPage() {
	const [search] = useSearchParams()

	const currentPage = Number(search.get('page') || '1')
	const offset = (currentPage - 1) * NOVELS_PER_PAGE

	const { data: novelCount, isPending: isCountLoading, error: countError } = useNovelCount()
	const {
		data: novels,
		isPending: isNovelLoading,
		error: novelError,
	} = useGetNovelWithCountRPCPagination({ novelsPerPage: NOVELS_PER_PAGE, offset })

	if (isCountLoading || isNovelLoading) {
		return <AdminLoading />
	}

	if (countError || novelError) {
		return <p>Error: {countError?.message || novelError?.message}</p>
	}

	if (!novels.data) {
		return null
	}

	const totalPages = Math.ceil((novelCount?.count ?? 0) / NOVELS_PER_PAGE)
	const list = novels.data as NovelWithCount[]

	return (
		<div>
			<header className='mb-8 flex flex-wrap items-end justify-between gap-4'>
				<div>
					<h1 className='font-serif text-3xl font-semibold tracking-tight md:text-4xl'>Admin</h1>

					<p className='mt-1 text-sm text-muted-foreground'>Manage novels and chapters in your library.</p>
				</div>

				<Button asChild>
					<Link to='/admin/novels/new'>
						<Plus className='mr-1 h-4 w-4' />
						New novel
					</Link>
				</Button>
			</header>

			{list.length === 0 ? (
				<Card>
					<CardContent className='flex flex-col items-center gap-3 py-16 text-center'>
						<BookOpen className='h-10 w-10 text-muted-foreground' />

						<h2 className='font-serif text-xl'>No novels yet</h2>

						<p className='max-w-sm text-sm text-muted-foreground'>
							Add your first novel to start building your library.
						</p>

						<Button
							asChild
							className='mt-2'
						>
							<Link to='/admin/novels/new'>
								<Plus className='mr-1 h-4 w-4' />
								Create novel
							</Link>
						</Button>
					</CardContent>
				</Card>
			) : (
				<div className='max-h-125 overflow-y-auto rounded-lg border bg-card'>
					<table className='min-w-150 w-full text-sm'>
						<thead className='border-b bg-muted/40 text-left'>
							<tr>
								<th className='px-4 py-3 font-medium'>Title</th>
								<th className='px-4 py-3 font-medium'>Author</th>
								<th className='px-4 py-3 font-medium'>Status</th>
								<th className='px-4 py-3 font-medium'>Chapters</th>
								<th className='px-4 py-3 text-right font-medium'>Actions</th>
							</tr>
						</thead>

						<tbody className='divide-y'>
							{list.map((novel) => (
								<tr key={novel.id}>
									<td className='px-4 py-3 font-serif'>{novel.title}</td>

									<td className='px-4 py-3 text-muted-foreground'>{novel.author ?? '—'}</td>

									<td className='px-4 py-3 capitalize text-muted-foreground'>{novel.status ?? '—'}</td>

									<td className='px-4 py-3 text-muted-foreground'>
										<span className='inline-flex items-center gap-1'>
											<FileText className='h-3.5 w-3.5' />
											{novel.count}
										</span>
									</td>

									<td className='px-4 py-3 text-right'>
										<Button
											asChild
											size='sm'
											variant='ghost'
										>
											<Link to={`/admin/novels/${novel.id}?page=1`}>Manage</Link>
										</Button>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			)}

			<NovelsPagination
				currentPage={currentPage}
				totalPages={totalPages}
			/>
		</div>
	)
}

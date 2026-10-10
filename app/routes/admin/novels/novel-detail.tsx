import { ArrowLeft, ExternalLink, Pencil, Plus } from 'lucide-react'
import { Link, useParams, useSearchParams } from 'react-router'

import { Button } from '@/components/ui/button'
import { ChaptersTable } from './chapter-table'
import { DeleteNovelButton } from './delete-button'
import { ManageNovelLoading } from './novel-detail-loading'

import type { Chapter, Novel } from '@/lib/types'
import { useChapterPaginationAndCountQuery, useGetNovelByIdQuery } from '@/queries'
import { ChaptersPagination } from './chapter-pagination'

const CHAPTERS_PER_PAGE = 20

export default function ManageNovelPage() {
	const { id: novelId } = useParams()
	const [searchParams] = useSearchParams()

	const page = Number(searchParams.get('page') || '1')

	const {
		data: chaptersData,
		isFetching: isChaptersFetching,
		error: chaptersError,
	} = useChapterPaginationAndCountQuery({
		startChapter: (page - 1) * CHAPTERS_PER_PAGE + 1,
		endChapter: (page - 1) * CHAPTERS_PER_PAGE + CHAPTERS_PER_PAGE,
		novelId: novelId || '',
		select: 'id,chapter_number,title,updated_at',
	})
	const {
		data: novelData,
		isFetching: isNovelFetching,
		error: novelError,
	} = useGetNovelByIdQuery({
		id: novelId || '',
		select: '*',
	})

	if (isChaptersFetching || isNovelFetching) {
		return <ManageNovelLoading />
	}

	if (chaptersError || novelError) {
		throw chaptersError || novelError
	}

	if (!chaptersData?.chapters.data || !novelData?.data) {
		return null
	}

	const totalPages = Math.ceil((chaptersData.countResult.count ?? 0) / CHAPTERS_PER_PAGE)
	const novel = novelData.data as unknown as Novel
	const chapters = chaptersData.chapters.data as unknown as Chapter[]

	if (!novel) {
		return null
	}

	return (
		<div>
			<Button
				asChild
				variant='ghost'
				size='sm'
				className='-ml-2 mb-4'
			>
				<Link to='/admin?search=1'>
					<ArrowLeft className='mr-1 h-4 w-4' />
					Back to admin
				</Link>
			</Button>

			<header className='flex flex-wrap items-start justify-between gap-4'>
				<div>
					<h1 className='font-serif text-3xl font-semibold tracking-tight'>{novel.title}</h1>

					<p className='mt-1 text-sm text-muted-foreground'>
						{novel.author ? `by ${novel.author} · ` : ''}
						/novels/{novel.slug}
					</p>
				</div>

				<div className='flex flex-wrap items-center gap-2'>
					<Button
						asChild
						variant='outline'
						size='sm'
					>
						<Link
							to={`/novels/${novel.slug}?page=1`}
							target='_blank'
						>
							<ExternalLink className='mr-1 h-4 w-4' />
							View
						</Link>
					</Button>

					<Button
						asChild
						variant='outline'
						size='sm'
					>
						<Link to={`/admin/novels/${novel.id}/edit`}>
							<Pencil className='mr-1 h-4 w-4' />
							Edit details
						</Link>
					</Button>

					<DeleteNovelButton novelId={novel.id} />
				</div>
			</header>

			<section className='mt-10'>
				<div className='mb-4 flex items-end justify-between'>
					<h2 className='font-serif text-2xl font-semibold tracking-tight'>Chapters</h2>

					<Button
						asChild
						size='sm'
					>
						<Link to={`/admin/novels/${novel.id}/chapters/new`}>
							<Plus className='mr-1 h-4 w-4' />
							Add chapter
						</Link>
					</Button>
				</div>

				<ChaptersTable
					novelId={novel.id}
					chapters={chapters}
				/>

				<ChaptersPagination
					currentPage={page}
					totalPages={totalPages}
					novelId={novel.id}
				/>
			</section>
		</div>
	)
}

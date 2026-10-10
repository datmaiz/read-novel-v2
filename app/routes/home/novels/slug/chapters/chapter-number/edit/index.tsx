import { ArrowLeft } from 'lucide-react'
import { Link, useParams } from 'react-router'

import { ChapterForm } from '@/components/chapter-form'
import { Button } from '@/components/ui/button'
import { EditChapterLoading } from './loading'

import { useChapterByChapterNumberQuery, useGetNovelBySlugQuery } from '@/queries'

export default function EditChapterPage() {
	const { slug = '', number } = useParams()

	const chapterNumber = Number(number)

	const { data: novelData, isFetching: isLoadingNovelData } = useGetNovelBySlugQuery({
		slug,
		select: `id,
        title,
        slug,
        author`,
	})
	const { data: chapterData, isFetching: isLoadingChapterData } = useChapterByChapterNumberQuery(
		novelData?.data?.id || '',
		chapterNumber,
	)

	const novel = novelData?.data
	const chapter = chapterData?.data

	if (!novel || !chapter || isLoadingNovelData || isLoadingChapterData) {
		return <EditChapterLoading />
	}

	if (!novel) {
		throw new Error('Novel not found')
	}

	return (
		<main className='mx-auto w-full max-w-4xl flex-1 px-4 py-6 md:px-6 md:py-10'>
			<Button
				asChild
				variant='ghost'
				size='sm'
				className='-ml-2 mb-4'
			>
				<Link to={`/novels/${novel.slug}/chapters/${chapter.chapter_number}`}>
					<ArrowLeft
						className='mr-1 h-4 w-4'
						aria-hidden='true'
					/>
					Back to reading
				</Link>
			</Button>

			<div className='mb-6'>
				<h1 className='font-serif text-3xl font-semibold tracking-tight'>Edit Chapter</h1>

				<p className='mt-1 text-sm text-muted-foreground'>
					{novel.title} · Chapter {chapter.chapter_number}
				</p>
			</div>

			<ChapterForm
				novelId={novel.id}
				chapter={chapter}
			/>
		</main>
	)
}

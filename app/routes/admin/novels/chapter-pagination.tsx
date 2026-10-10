import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { generatePageNumbers } from '@/lib/pagination'
import { useNavigate } from 'react-router'

interface ChaptersPaginationProps {
	currentPage: number
	totalPages: number
	novelId: string
}

const NUMBER_OF_SIBLINGS = 3 // Number of sibling pages to show on each side of current page

export function ChaptersPagination({ currentPage, totalPages, novelId }: ChaptersPaginationProps) {
	const navigate = useNavigate()

	const pageNumbers = generatePageNumbers(currentPage, totalPages, NUMBER_OF_SIBLINGS)

	const handlePageChange = (page: number) => {
		navigate(`/admin/novels/${novelId}?page=${page}`)
	}

	if (totalPages <= 1) return null

	return (
		<div className='mt-6 flex items-center justify-center gap-1'>
			{/* Previous Button */}
			<Button
				variant='ghost'
				size='sm'
				onClick={() => handlePageChange(currentPage - 1)}
				disabled={currentPage === 1}
				className='gap-1 px-2.5 sm:pl-2.5'
			>
				<ChevronLeftIcon />
				<span className='hidden sm:block'>Previous</span>
			</Button>

			{/* Page Numbers */}
			{pageNumbers.map((page, index) => {
				if (page === null) {
					return (
						<div
							key={`ellipsis-${index}`}
							className='px-1'
						>
							<MoreHorizontalIcon className='h-4 w-4 text-muted-foreground' />
						</div>
					)
				}

				return (
					<Button
						key={page}
						variant={page === currentPage ? 'outline' : 'ghost'}
						size='sm'
						onClick={() => handlePageChange(page)}
						aria-current={page === currentPage ? 'page' : undefined}
					>
						{page}
					</Button>
				)
			})}

			{/* Next Button */}
			<Button
				variant='ghost'
				size='sm'
				onClick={() => handlePageChange(currentPage + 1)}
				disabled={currentPage === totalPages}
				className='gap-1 px-2.5 sm:pr-2.5'
			>
				<span className='hidden sm:block'>Next</span>
				<ChevronRightIcon />
			</Button>
		</div>
	)
}

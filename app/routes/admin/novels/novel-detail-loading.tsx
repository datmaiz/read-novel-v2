import { DeleteNovelButton } from './delete-button'
import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import { ArrowLeft, ExternalLink, Loader, Pencil, Plus } from 'lucide-react'

export function ManageNovelLoading() {
	return (
		<div>
			<Button
				asChild
				variant='ghost'
				size='sm'
				className='-ml-2 mb-4'
			>
				<Link to='/admin?page=1'>
					<ArrowLeft
						className='mr-1 h-4 w-4'
						aria-hidden='true'
					/>
					Back to admin
				</Link>
			</Button>

			<header className='flex flex-wrap items-start justify-between gap-4'>
				<div>
					<div className='h-8 w-80 animate-pulse rounded-md bg-muted' />
					<div className='mt-2 h-4 w-72 animate-pulse rounded-md bg-muted' />
				</div>
				<div className='flex flex-wrap items-center gap-2'>
					<Button
						asChild
						variant='outline'
						size='sm'
					>
						<Link
							to={`/`}
							target='_blank'
						>
							<ExternalLink
								className='mr-1 h-4 w-4'
								aria-hidden='true'
							/>
							View
						</Link>
					</Button>
					<Button
						asChild
						variant='outline'
						size='sm'
					>
						<Link to={`/`}>
							<Pencil
								className='mr-1 h-4 w-4'
								aria-hidden='true'
							/>
							Edit details
						</Link>
					</Button>
					<DeleteNovelButton novelId={''} />
				</div>
			</header>

			<section className='mt-10'>
				<div className='mb-4 flex items-end justify-between'>
					<h2 className='font-serif text-2xl font-semibold tracking-tight'>Chapters</h2>
					<Button
						asChild
						size='sm'
					>
						<Link to={`/admin`}>
							<Plus
								className='mr-1 h-4 w-4'
								aria-hidden='true'
							/>
							Add chapter
						</Link>
					</Button>
				</div>

				<div className='overflow-hidden rounded-lg border border-border bg-card max-h-125 overflow-y-auto'>
					<table className='w-full text-sm max-h-100'>
						<thead className='border-b border-border bg-muted/40 text-left'>
							<tr>
								<th className='w-16 px-4 py-3 font-medium'>#</th>
								<th className='px-4 py-3 font-medium'>Title</th>
								<th className='hidden px-4 py-3 font-medium md:table-cell'>Updated</th>
								<th className='px-4 py-3 text-right font-medium'>Actions</th>
							</tr>
						</thead>
						<tbody className='divide-y divide-border'>
							<tr>
								<td
									colSpan={5}
									className='px-4 py-3 font-serif text-center w-full'
								>
									<Loader className='animate-spin inline-flex justify-center' />
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</section>
		</div>
	)
}

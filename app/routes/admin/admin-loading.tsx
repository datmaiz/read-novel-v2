import { Button } from '@/components/ui/button'
import { Link } from 'react-router'
import { Loader, Plus } from 'lucide-react'

export function AdminLoading() {
	return (
		<div>
			<header className='mb-8 flex flex-wrap items-end justify-between gap-4'>
				<div>
					<h1 className='font-serif text-3xl font-semibold tracking-tight md:text-4xl'>Admin</h1>
					<p className='mt-1 text-sm text-muted-foreground'>Manage novels and chapters in your library.</p>
				</div>
				<Button asChild>
					<Link to='/admin/novels/new'>
						<Plus
							className='mr-1 h-4 w-4'
							aria-hidden='true'
						/>
						New novel
					</Link>
				</Button>
			</header>

			<div className='overflow-hidden rounded-lg border border-border bg-card'>
				<table className='w-full text-sm'>
					<thead className='border-b border-border bg-muted/40 text-left'>
						<tr>
							<th className='px-4 py-3 font-medium'>Title</th>
							<th className='px-4 py-3 font-medium'>Author</th>
							<th className='px-4 py-3 font-medium'>Status</th>
							<th className='px-4 py-3 font-medium'>Chapters</th>
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
		</div>
	)
}

import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import type { Chapter } from '@/lib/types'
import { useDeleteChapterByIdMutation } from '@/queries'
import { useAuthStore } from '@/zustand/auth'
import { Pencil, Trash2 } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'

export function ChaptersTable({ novelId, chapters }: { novelId: string; chapters: Chapter[] }) {
	const [pendingId, setPendingId] = useState<string | null>(null)

	const tableRef = useRef<HTMLDivElement>(null)

	const params = new URLSearchParams(window.location.search)
	const currentPage = parseInt(params.get('page') || '1')

	const session = useAuthStore((s) => s.session)
	const deleteChapterMutation = useDeleteChapterByIdMutation()

	useLayoutEffect(() => {
		tableRef.current?.scrollTo({ top: 0 })
	}, [currentPage])

	const onDelete = async (id: string) => {
		if (!session?.user.id) return
		setPendingId(id)
		await deleteChapterMutation.mutateAsync({ id, userId: session?.user.id })
		setPendingId(null)
		if (deleteChapterMutation.error) {
			toast.error(deleteChapterMutation.error.message)
			return
		}
		toast.success('Chapter deleted')
	}

	if (chapters.length === 0) {
		return (
			<div className='rounded-lg border border-dashed border-border p-10 text-center'>
				<p className='text-sm text-muted-foreground'>No chapters yet. Add the first one to begin.</p>
			</div>
		)
	}

	return (
		<div
			ref={tableRef}
			className='rounded-lg border border-border bg-card max-h-125 overflow-auto'
		>
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
					{chapters.map((c) => (
						<tr key={c.id}>
							<td className='px-4 py-3 text-muted-foreground'>{c.chapter_number}</td>
							<td className='px-4 py-3 font-serif'>{c.title}</td>
							<td className='hidden px-4 py-3 text-muted-foreground md:table-cell'>
								{new Date(c.updated_at).toLocaleDateString()}
							</td>
							<td className='px-4 py-3'>
								<div className='flex justify-end gap-1'>
									<Button
										asChild
										size='sm'
										variant='ghost'
									>
										<Link to={`/admin/novels/${novelId}/chapters/${c.id}`}>
											<Pencil
												className='h-4 w-4'
												aria-hidden='true'
											/>
											<span className='sr-only'>Edit</span>
										</Link>
									</Button>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button
												size='sm'
												variant='ghost'
												className='text-destructive hover:text-destructive'
											>
												<Trash2
													className='h-4 w-4'
													aria-hidden='true'
												/>
												<span className='sr-only'>Delete</span>
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>Delete chapter {c.chapter_number}?</AlertDialogTitle>
												<AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel
													size={'default'}
													variant={'outline'}
													disabled={pendingId === c.id}
												>
													Cancel
												</AlertDialogCancel>
												<AlertDialogAction
													size={'default'}
													variant={'destructive'}
													onClick={() => onDelete(c.id)}
													disabled={pendingId === c.id}
												>
													{pendingId === c.id ? 'Deleting...' : 'Delete'}
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	)
}

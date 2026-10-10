import { Trash2 } from 'lucide-react'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'

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
import { useDeleteNovelMutation } from '@/queries'
import { useAuthStore } from '@/zustand/auth'

export function DeleteNovelButton({ novelId }: { novelId: string }) {
	const navigate = useNavigate()
	const session = useAuthStore((s) => s.session)

	const { mutateAsync, isPending, error } = useDeleteNovelMutation({ userId: session?.user.id || '' })

	const onDelete = async () => {
		if (!session?.user.id) return

		await mutateAsync({ novelId })

		if (error) {
			toast.error(error.message)
			return
		}
		toast.success('Novel deleted')
		navigate('/admin?page=1')
	}

	return (
		<AlertDialog>
			<AlertDialogTrigger asChild>
				<Button
					variant='outline'
					size='sm'
					className='text-destructive hover:text-destructive bg-transparent'
				>
					<Trash2
						className='mr-1 h-4 w-4'
						aria-hidden='true'
					/>
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Delete this novel?</AlertDialogTitle>
					<AlertDialogDescription>
						This will permanently remove the novel and all of its chapters. This action cannot be undone.
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel
						variant={'outline'}
						size={'default'}
						disabled={isPending}
					>
						Cancel
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={onDelete}
						disabled={isPending}
						className='bg-destructive text-destructive-foreground'
					>
						{isPending ? 'Deleting...' : 'Delete novel'}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	)
}

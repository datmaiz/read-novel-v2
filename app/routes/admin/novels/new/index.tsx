import { Link } from 'react-router'
import { ArrowLeft } from 'lucide-react'

import { NovelForm } from '@/components/admin/novel-form'
import { Button } from '@/components/ui/button'

export default function NewNovelPage() {
	return (
		<div className='mx-auto max-w-2xl'>
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

			<h1 className='font-serif text-3xl font-semibold tracking-tight'>New novel</h1>

			<p className='mt-1 text-sm text-muted-foreground'>Add a new novel to the library.</p>

			<div className='mt-8'>
				<NovelForm />
			</div>
		</div>
	)
}

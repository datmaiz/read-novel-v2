import { BookOpen, Loader2 } from 'lucide-react'
import { useEffect } from 'react'
import { useNavigate } from 'react-router'

import { useAuthStore } from '@/zustand/auth'

export default function Callback() {
	const navigate = useNavigate()

	useEffect(() => {
		async function handleCallback() {
			const session = useAuthStore((state) => state.session)

			if (!session?.user) {
				navigate('/login', { replace: true })
				return
			}

			navigate('/')
		}

		handleCallback()
	}, [navigate])

	return (
		<div className='flex min-h-svh items-center justify-center bg-background'>
			<div className='flex max-w-md flex-col items-center text-center'>
				<div className='relative mb-8'>
					<BookOpen className='h-14 w-14 text-primary' />
					<Loader2 className='absolute -right-2 -bottom-2 h-5 w-5 animate-spin text-muted-foreground' />
				</div>

				<h1 className='font-serif text-3xl font-semibold'>Welcome back</h1>

				<p className='mt-3 text-muted-foreground'>Opening your library and restoring your reading session...</p>
			</div>
		</div>
	)
}

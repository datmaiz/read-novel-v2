import { useAuthStore } from '@/zustand/auth'
import { BookOpen } from 'lucide-react'
import { Navigate, Outlet } from 'react-router'
import { checkAdminEmail } from '@/lib/utils'

export function meta() {
	return [{ title: 'Inkwell - Admin' }]
}

export default function AdminLayout() {
	const session = useAuthStore((state) => state.session)
	const loading = useAuthStore((state) => state.loading)

	if (loading) {
		return (
			<div className='flex min-h-svh items-center justify-center bg-linear-to-b from-accent/30 to-background'>
				<div className='w-full max-w-sm rounded-2xl border bg-card/80 p-10 shadow-lg backdrop-blur'>
					<div className='flex flex-col items-center text-center'>
						<div className='relative'>
							<div className='flex h-20 w-20 items-center justify-center rounded-full border bg-background shadow-sm'>
								<BookOpen className='h-10 w-10 text-primary' />
							</div>
							Ø
						</div>

						<h1 className='mt-8 font-serif text-3xl font-semibold'>Opening your library</h1>

						<p className='mt-3 text-sm leading-relaxed text-muted-foreground'>
							Authenticating your account and restoring your reading progress.
						</p>

						<div className='mt-8 flex gap-1'>
							<span className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]' />
							<span className='h-2 w-2 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]' />
							<span className='h-2 w-2 animate-bounce rounded-full bg-primary' />
						</div>
					</div>
				</div>
			</div>
		)
	}

	if (!session?.user || !checkAdminEmail(session.user.email || '')) {
		return (
			<Navigate
				to='/'
				replace
			/>
		)
	}

	return (
		<main className='mx-auto w-full max-w-6xl flex-1 px-4 py-8 md:px-6 md:py-12'>
			<Outlet />
		</main>
	)
}

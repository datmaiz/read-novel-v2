import { BookOpen } from 'lucide-react'

import { LogoutButton } from '@/components/logout-button'
import { Button } from '@/components/ui/button'
import { checkAdminEmail } from '@/lib/utils'
import { MobileNav } from './mobile-nav'
import { useAuthStore } from '@/zustand/auth'
import { Link } from 'react-router'
import { ThemeToggle } from './theme-toggle'

export function SiteHeader() {
	const session = useAuthStore(state => state.session)

	return (
		<header className='top-0 z-50 border-b bg-background/80 backdrop-blur'>
			<div className='mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6'>
				<Link
					to='/'
					className='flex items-center gap-2'
				>
					<span className='flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground'>
						<BookOpen className='h-5 w-5' />
					</span>
					<span className='hidden font-serif text-xl font-semibold sm:block'>Inkwell</span>
				</Link>

				{/* Desktop */}
				<nav className='hidden items-center gap-2 md:flex'>
					<ThemeToggle />
					<Button
						asChild
						variant='ghost'
						size='sm'
					>
						<Link to='/'>Library</Link>
					</Button>

					{session?.user && checkAdminEmail(session.user.email || '') && (
						<Button
							asChild
							variant='ghost'
							size='sm'
						>
							<Link to='/admin?page=1'>Admin</Link>
						</Button>
					)}

					{session?.user ? (
						<>
							<Button
								asChild
								variant='ghost'
								size='sm'
							>
								<Link to='/novels/featured-chapters'>Featured chapters</Link>
							</Button>
							<LogoutButton />
						</>
					) : (
						<Button
							asChild
							variant='ghost'
							size='sm'
						>
							<Link to='/login'>Sign in</Link>
						</Button>
					)}
				</nav>

				{/* Mobile */}
				<div className='md:hidden'>
					<MobileNav user={session?.user} />
				</div>
			</div>
		</header>
	)
}

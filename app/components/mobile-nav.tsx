import { Menu } from 'lucide-react'

import { checkAdminEmail } from '@/lib/utils'
import { LogoutButton } from './logout-button'
import { Button } from './ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'
import { Link } from 'react-router'
import { ThemeToggle } from './theme-toggle'

export const MobileNav = ({ user }: { user: any }) => {
	return (
		<Sheet>
			<SheetTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
				>
					<Menu className='h-5 w-5' />
				</Button>
			</SheetTrigger>

			<SheetContent side='right'>
				<SheetTitle></SheetTitle>
				<nav className='mt-8 flex flex-col gap-2'>
					<div className='flex items-center justify-between rounded-md border bg-muted/30 px-3 py-2'>
						<span className='text-sm font-medium'>Color theme</span>
						<ThemeToggle />
					</div>
					<Button
						asChild
						variant='ghost'
					>
						<Link to='/'>Library</Link>
					</Button>

					{user && checkAdminEmail(user.email || '') && (
						<Button
							asChild
							variant='ghost'
						>
							<Link to='/admin'>Admin</Link>
						</Button>
					)}

					{user ? (
						<>
							<Button
								asChild
								variant='ghost'
							>
								<Link to='/novels/featured-chapters'>Featured chapters</Link>
							</Button>

							<LogoutButton />
						</>
					) : (
						<Button
							asChild
							variant='ghost'
						>
							<Link to='/login'>Sign in</Link>
						</Button>
					)}
				</nav>
			</SheetContent>
		</Sheet>
	)
}

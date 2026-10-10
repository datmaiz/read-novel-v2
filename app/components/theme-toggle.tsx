import { Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export function ThemeToggle() {
	const { theme, setTheme } = useTheme()
	const [mounted, setMounted] = useState(false)

	useEffect(() => setMounted(true), [])

	const Icon = !mounted || theme === 'system' ? Monitor : theme === 'dark' ? Moon : Sun

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant='ghost'
					size='icon'
					aria-label='Choose color theme'
				>
					<Icon className='h-4 w-4' />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align='end'>
				<DropdownMenuLabel>Color theme</DropdownMenuLabel>
				<DropdownMenuRadioGroup
					value={mounted ? theme : 'system'}
					onValueChange={setTheme}
				>
					<DropdownMenuRadioItem value='light'>
						<Sun />
						Light
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value='dark'>
						<Moon />
						Dark
					</DropdownMenuRadioItem>
					<DropdownMenuRadioItem value='system'>
						<Monitor />
						Auto
					</DropdownMenuRadioItem>
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	)
}

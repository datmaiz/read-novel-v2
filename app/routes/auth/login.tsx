import { BookOpen } from 'lucide-react'
import { useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { supabase } from '@/lib/supabase/client'

export default function LoginPage() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const handleLogin = async (e: SyntheticEvent) => {
		e.preventDefault()
		setIsLoading(true)
		setError(null)
		try {
			const { error: signInError } = await supabase.auth.signInWithPassword({
				email,
				password,
			})
			if (signInError) throw signInError
			navigate('/', { replace: true })
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Could not sign in')
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<div className='flex min-h-svh w-full items-center justify-center bg-linear-to-b from-accent/40 to-background p-6'>
			<Card className='w-full max-w-sm'>
				<CardHeader className='text-center'>
					<div className='mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground'>
						<BookOpen
							className='h-5 w-5'
							aria-hidden='true'
						/>
					</div>
					<CardTitle className='mt-2 font-serif text-2xl'>Sign in</CardTitle>
					<CardDescription>Sign in to manage novels and chapters</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={handleLogin}
						className='flex flex-col gap-5'
					>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='user@example.com'
								required
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								autoComplete='email'
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='password'>Password</Label>
							<Input
								id='password'
								type='password'
								placeholder='********'
								required
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete='current-password'
							/>
						</div>
						{error && <p className='text-sm text-destructive'>{error}</p>}
						<Button
							type='submit'
							disabled={isLoading}
							onClick={handleLogin}
						>
							{isLoading ? 'Signing in...' : 'Sign in'}
						</Button>
						<div className='flex items-center justify-between text-sm text-muted-foreground'>
							<Link
								to='/'
								className='underline underline-offset-4 hover:text-foreground'
							>
								Back to library
							</Link>
							<Link
								to='/sign-up'
								className='underline underline-offset-4 hover:text-foreground'
							>
								Create account
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

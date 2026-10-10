import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/lib/supabase/client'
import { BookOpen } from 'lucide-react'
import { Label } from '@/components/ui/label'
import { useState, type SyntheticEvent } from 'react'
import { useNavigate, Link } from 'react-router'

export default function SignUpPage() {
	const navigate = useNavigate()
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [confirm, setConfirm] = useState('')
	const [error, setError] = useState<string | null>(null)
	const [isLoading, setIsLoading] = useState(false)

	const onSubmit = async (e: SyntheticEvent) => {
		e.preventDefault()
		setError(null)
		if (password !== confirm) {
			setError('Passwords do not match')
			return
		}
		setIsLoading(true)
		try {
			const { data, error: signUpError } = await supabase.auth.signUp({
				email: email.trim(),
				password,
				options: {
					emailRedirectTo: `${window.location.origin}/callback`,
				},
			})

			if (signUpError) {
				console.error('SIGN_UP_ERROR:', {
					code: signUpError.code,
					message: signUpError.message,
					status: signUpError.status,
				})

				throw signUpError
			}

			console.log('SIGN_UP_SUCCESS:', {
				userId: data.user?.id,
				hasSession: Boolean(data.session),
				identitiesCount: data.user?.identities?.length,
			})

			navigate('/sign-up-success')
		} catch (err: unknown) {
			setError(err instanceof Error ? err.message : 'Could not sign up')
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
					<CardTitle className='mt-2 font-serif text-2xl'>Create account</CardTitle>
					<CardDescription>For managing novels and chapters</CardDescription>
				</CardHeader>
				<CardContent>
					<form
						onSubmit={onSubmit}
						className='flex flex-col gap-5'
					>
						<div className='grid gap-2'>
							<Label htmlFor='email'>Email</Label>
							<Input
								id='email'
								type='email'
								placeholder='Enter email....'
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
								placeholder='*********'
								required
								minLength={6}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								autoComplete='new-password'
							/>
						</div>
						<div className='grid gap-2'>
							<Label htmlFor='confirm'>Confirm password</Label>
							<Input
								id='confirm'
								type='password'
								placeholder='*********'
								required
								minLength={6}
								value={confirm}
								onChange={(e) => setConfirm(e.target.value)}
								autoComplete='new-password'
							/>
						</div>
						{error && <p className='text-sm text-destructive'>{error}</p>}
						<Button
							type='submit'
							disabled={isLoading}
						>
							{isLoading ? 'Creating...' : 'Create account'}
						</Button>
						<p className='text-center text-sm text-muted-foreground'>
							Already have an account?{' '}
							<Link
								to='/login'
								className='underline underline-offset-4 hover:text-foreground'
							>
								Sign in
							</Link>
						</p>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}

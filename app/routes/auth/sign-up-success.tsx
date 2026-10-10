import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { MailCheck } from 'lucide-react'
import { Link } from 'react-router'

export default function SignUpSuccessPage() {
	return (
		<div className='flex min-h-svh w-full items-center justify-center bg-linear-to-b from-accent/40 to-background p-6'>
			<Card className='w-full max-w-sm'>
				<CardHeader className='text-center'>
					<div className='mx-auto flex h-11 w-11 items-center justify-center rounded-md bg-primary/10 text-primary'>
						<MailCheck
							className='h-5 w-5'
							aria-hidden='true'
						/>
					</div>
					<CardTitle className='mt-2 font-serif text-2xl'>Check your inbox</CardTitle>
					<CardDescription>We sent a confirmation link. Open it to activate the account.</CardDescription>
				</CardHeader>
				<CardContent className='text-center'>
					<Button asChild>
						<Link to='/login'>Back to sign in</Link>
					</Button>
				</CardContent>
			</Card>
		</div>
	)
}

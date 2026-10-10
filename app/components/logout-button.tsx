import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase/client'
import { useNavigate } from 'react-router'

export function LogoutButton() {
	const navigate = useNavigate()

	const handleLogout = async () => {
		await supabase.auth.signOut()
		navigate('/', { replace: true })
	}

	return (
		<Button
			variant='ghost'
			size='sm'
			onClick={handleLogout}
		>
			Sign out
		</Button>
	)
}

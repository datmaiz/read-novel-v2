import { useAuthStore } from '@/zustand/auth'
import { Navigate, Outlet } from 'react-router'

export default function AuthLayout() {
	const session = useAuthStore((state) => state.session)

	if (session?.user) return <Navigate to={'/'} />

	return <Outlet />
}

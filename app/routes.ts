import { type RouteConfig, index, layout, prefix, route } from '@react-router/dev/routes'

export default [
	layout('layouts/main-layout.tsx', [
		index('routes/home/index.tsx'),
		route('history', 'routes/history/index.tsx'),
		route('recently-updates', 'routes/recently-updates/index.tsx'),
		...prefix('novels', [
			route('featured-chapters', 'routes/home/novels/featured-chapters/index.tsx'),
			route(':slug', 'routes/home/novels/slug/index.tsx'),
			route(':slug/chapters/:number', 'routes/home/novels/slug/chapters/chapter-number/index.tsx'),
			route(':slug/chapters/:number/edit', 'routes/home/novels/slug/chapters/chapter-number/edit/index.tsx'),
		]),
		layout('layouts/admin-layout.tsx', [
			...prefix('admin', [
				index('routes/admin/index.tsx'),
				route('novels/new', 'routes/admin/novels/new/index.tsx'),
				route('novels/:id', 'routes/admin/novels/novel-detail.tsx'),
				route('novels/:id/edit', 'routes/admin/novels/edit/index.tsx'),
				route('novels/:id/chapters/:chapterId', 'routes/admin/novels/chapters/id/index.tsx'),
				route('novels/:id/chapters/new', 'routes/admin/novels/chapters/new/index.tsx'),
			]),
		]),
	]),
	layout('layouts/auth-layout.tsx', [
		route('login', 'routes/auth/login.tsx'),
		route('sign-up', 'routes/auth/sign-up.tsx'),
		route('sign-up-success', 'routes/auth/sign-up-success.tsx'),
		route('callback', 'routes/auth/callback.tsx'),
	]),
] satisfies RouteConfig

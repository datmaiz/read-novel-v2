import { Skeleton } from '@/components/ui/skeleton'

export default function HomeLoading() {
	return (
		<main className='flex-1'>
			{/* Hero */}
			<section className='border-b'>
				<div className='mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24'>
					<Skeleton className='mb-6 h-8 w-48 rounded-full bg-secondary' />

					<Skeleton className='mb-4 h-14 w-full max-w-3xl bg-secondary' />
					<Skeleton className='mb-2 h-14 w-2/3 max-w-2xl bg-secondary' />

					<div className='mt-6 space-y-2'>
						<Skeleton className='h-5 w-full max-w-2xl bg-secondary' />
						<Skeleton className='h-5 w-5/6 max-w-xl bg-secondary' />
					</div>

					<div className='mt-8 flex gap-3'>
						<Skeleton className='h-11 w-40 bg-secondary' />
						<Skeleton className='h-11 w-28 bg-secondary' />
					</div>
				</div>
			</section>

			{/* Features */}
			<section className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
				<div className='grid gap-6 md:grid-cols-3'>
					{Array.from({ length: 3 }).map((_, i) => (
						<div
							key={i}
							className='rounded-lg border p-6'
						>
							<Skeleton className='h-10 w-10 rounded-md bg-secondary' />
							<Skeleton className='mt-4 h-6 w-32 bg-secondary' />
							<Skeleton className='mt-2 h-4 w-full bg-secondary' />
							<Skeleton className='mt-2 h-4 w-5/6 bg-secondary' />
						</div>
					))}
				</div>
			</section>

			{/* Recently Updated */}
			<section className='mx-auto max-w-6xl px-4 py-12 md:px-6'>
				<Skeleton className='mb-2 h-10 w-64 bg-secondary' />
				<Skeleton className='mb-6 h-4 w-56 bg-secondary' />

				<div className='grid gap-4 md:grid-cols-2'>
					{Array.from({ length: 4 }).map((_, i) => (
						<div
							key={i}
							className='flex gap-4 rounded-lg border p-4'
						>
							<Skeleton className='h-24 w-16 rounded-md bg-secondary' />

							<div className='flex-1 space-y-2'>
								<Skeleton className='h-5 w-2/3 bg-secondary' />
								<Skeleton className='h-4 w-24 bg-secondary' />
								<Skeleton className='h-4 w-full bg-secondary' />
								<Skeleton className='h-4 w-5/6 bg-secondary' />
								<Skeleton className='h-3 w-24 bg-secondary' />
							</div>
						</div>
					))}
				</div>
			</section>

			{/* Library */}
			<section className='mx-auto max-w-6xl px-4 pb-20 md:px-6'>
				<Skeleton className='mb-2 h-10 w-48 bg-secondary' />
				<Skeleton className='mb-8 h-4 w-32 bg-secondary' />

				<div className='grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3'>
					{Array.from({ length: 6 }).map((_, i) => (
						<div
							key={i}
							className='rounded-lg border p-4'
						>
							<Skeleton className='aspect-3/4 w-full rounded-md bg-secondary' />
							<Skeleton className='mt-4 h-5 w-3/4 bg-secondary' />
							<Skeleton className='mt-2 h-4 w-full bg-secondary' />
							<Skeleton className='mt-1 h-4 w-5/6 bg-secondary' />
						</div>
					))}
				</div>
			</section>
		</main>
	)
}

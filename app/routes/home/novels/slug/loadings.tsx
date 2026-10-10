export function NovelHeaderSkeleton() {
	return (
		<div className='grid gap-8 md:grid-cols-[220px_1fr]'>
			<div className='aspect-3/4 animate-pulse rounded-lg bg-muted' />
			<div className='flex flex-col gap-3'>
				<div className='h-5 w-16 animate-pulse rounded-full bg-muted' />
				<div className='h-10 w-3/4 animate-pulse rounded-md bg-muted' />
				<div className='h-4 w-24 animate-pulse rounded-md bg-muted' />
				<div className='flex gap-1.5'>
					{[1, 2, 3].map((i) => (
						<div
							key={i}
							className='h-5 w-16 animate-pulse rounded-full bg-muted'
						/>
					))}
				</div>
				<div className='mt-2 space-y-2'>
					<div className='h-4 w-full animate-pulse rounded-md bg-muted' />
					<div className='h-4 w-5/6 animate-pulse rounded-md bg-muted' />
					<div className='h-4 w-4/6 animate-pulse rounded-md bg-muted' />
				</div>
				<div className='mt-4 flex gap-3'>
					<div className='h-11 w-36 animate-pulse rounded-md bg-muted' />
					<div className='h-11 w-24 animate-pulse rounded-md bg-muted' />
				</div>
			</div>
		</div>
	)
}

export function ChapterListSkeleton() {
	return (
		<ol className='mt-4 divide-y divide-border overflow-hidden rounded-lg border border-border bg-card'>
			{Array.from({ length: 8 }).map((_, i) => (
				<li
					key={i}
					className='flex items-center justify-between gap-4 px-4 py-3'
				>
					<div className='flex min-w-0 items-center gap-3'>
						<div className='h-8 w-8 shrink-0 animate-pulse rounded-md bg-muted' />
						<div className='h-4 w-48 animate-pulse rounded-md bg-muted' />
					</div>
					<div className='hidden h-4 w-20 animate-pulse rounded-md bg-muted sm:block' />
				</li>
			))}
		</ol>
	)
}

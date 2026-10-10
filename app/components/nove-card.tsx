import { BookOpen } from 'lucide-react'
import type { Novel } from '@/lib/types'
import { Link } from 'react-router'

function getColorsForStatus(status: string) {
	switch (status.toLowerCase()) {
		case 'ongoing':
			return 'bg-yellow-300 text-black'
		case 'completed':
			return 'bg-green-300 text-blue-800'
		case 'hiatus':
			return 'bg-red-300 text-yellow-800'
	}
}

export function NovelCard({ novel }: { novel: Novel }) {
	return (
		<Link
			to={`/novels/${novel.slug}`}
			className='group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-colors hover:border-primary/40'
		>
			<div className='relative aspect-3/4 w-full overflow-hidden bg-muted'>
				{novel.cover_url ? (
					<img
						src={novel.cover_url || '/placeholder.svg'}
						alt={`Cover of ${novel.title}`}
						className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
					/>
				) : (
					<div className='flex h-full w-full items-center justify-center bg-linear-to-br from-accent to-secondary'>
						<BookOpen
							className='h-12 w-12 text-muted-foreground'
							aria-hidden='true'
						/>
					</div>
				)}
				{novel.status && (
					<span
						className={`absolute left-3 top-3 rounded-full bg-background/90 px-2 py-0.5 text-xs font-medium capitalize text-foreground backdrop-blur ${getColorsForStatus(novel.status)}`}
					>
						{novel.status}
					</span>
				)}
			</div>
			<div className='flex flex-1 flex-col gap-2 p-4'>
				<h3 className='line-clamp-2 font-serif text-lg font-semibold leading-snug'>{novel.title}</h3>
				{novel.author && <p className='text-sm text-muted-foreground'>by {novel.author}</p>}
				{novel.description && (
					<p className='mt-1 line-clamp-3 text-sm leading-relaxed text-muted-foreground'>{novel.description}</p>
				)}
				{novel.genres && novel.genres.length > 0 && (
					<div className='mt-auto flex flex-wrap gap-1.5 pt-2'>
						{novel.genres.slice(0, 3).map((g) => (
							<span
								key={g}
								className='rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground'
							>
								{g}
							</span>
						))}
					</div>
				)}
			</div>
		</Link>
	)
}

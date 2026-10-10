import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ExpandableDescriptionProps {
	children: string
	maxLines?: number
}

export function ExpandableDescription({ children, maxLines = 3 }: ExpandableDescriptionProps) {
	const [isExpanded, setIsExpanded] = useState(false)
	const lineCount = (children.match(/\n/g) || []).length + 1
	const shouldTruncate = lineCount > maxLines

	if (!shouldTruncate) {
		return (
			<p className='max-w-prose text-pretty leading-relaxed text-muted-foreground whitespace-pre-wrap'>{children}</p>
		)
	}

	return (
		<div className='space-y-2'>
			<p
				className={`max-w-prose text-pretty leading-relaxed text-muted-foreground whitespace-pre-wrap ${
					isExpanded ? '' : `line-clamp-${maxLines}`
				}`}
				style={
					isExpanded
						? {}
						: {
								display: '-webkit-box',
								WebkitLineClamp: maxLines,
								WebkitBoxOrient: 'vertical',
								overflow: 'hidden',
							}
				}
			>
				{children}
			</p>
			<Button
				variant='ghost'
				size='sm'
				onClick={() => setIsExpanded(!isExpanded)}
				className='h-auto p-0 text-xs'
			>
				{isExpanded ? (
					<>
						<ChevronUp
							className='mr-1 h-3.5 w-3.5'
							aria-hidden='true'
						/>
						Show less
					</>
				) : (
					<>
						<ChevronDown
							className='mr-1 h-3.5 w-3.5'
							aria-hidden='true'
						/>
						Show more
					</>
				)}
			</Button>
		</div>
	)
}

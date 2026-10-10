import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

import { Badge } from '@/components/ui/badge'
import { Link, useSearchParams } from 'react-router'

import { BookOpen } from 'lucide-react'

interface Props {
	groups: {
		novel: {
			id: string
			title: string
			slug: string
		}
		chapters: any[]
	}[]
}

export function BookmarkAccordion({ groups }: Props) {
	const [params, setParams] = useSearchParams()

	const defaultValue = params.get('novel_id') ?? groups[0].novel.id

	return (
		<Accordion
			type='multiple'
			className='space-y-4'
			onValueChange={(value) => {
				if (value.length > 0) {
					setParams({ novel_id: value[value.length - 1] }, { replace: true })
				} else {
					setParams({}, { replace: true })
				}
			}}
			defaultValue={[defaultValue]}
		>
			{groups.map((group) => (
				<AccordionItem
					key={group.novel.id}
					value={group.novel.id}
					className='rounded-lg border px-4'
				>
					<AccordionTrigger>
						<div className='flex items-center gap-3'>
							<BookOpen className='size-4' />

							<span className='font-semibold'>{group.novel.title}</span>

							<Badge variant='secondary'>{group.chapters.length}</Badge>
						</div>
					</AccordionTrigger>

					<AccordionContent>
						<div className='space-y-2'>
							{group.chapters
								.sort((a, b) => a.chapters.chapter_number - b.chapters.chapter_number)
								.map((item) => (
									<Link
										key={item.chapters.id}
										to={`/novels/${group.novel.slug}/chapters/${item.chapters.chapter_number}`}
										className='block rounded-md p-3 transition hover:bg-muted'
									>
										<div className='font-medium'>Chương {item.chapters.chapter_number}</div>

										<div className='text-sm text-muted-foreground'>{item.chapters.title}</div>
									</Link>
								))}
						</div>
					</AccordionContent>
				</AccordionItem>
			))}
		</Accordion>
	)
}

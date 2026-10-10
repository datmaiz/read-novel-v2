import { useEffect, useState } from 'react'
import { Link, Route, useParams } from 'react-router'
import { ArrowLeft } from 'lucide-react'

import { Button } from '@/components/ui/button'

import type { Novel } from '@/lib/types'
import { supabase } from '@/lib/supabase/client'
import { NovelForm } from '@/components/admin/novel-form'
import { EditNovelLoading } from './loading'
import { useGetNovelByIdQuery } from '@/queries'

export default function EditNovelPage() {
	const { id: novelId } = useParams()
	const { data: novelData, isLoading, error } = useGetNovelByIdQuery({ id: novelId || '', select: `*` })

	if (isLoading) {
		return <EditNovelLoading />
	}

	if (error) {
		throw error
	}

	const novel = novelData?.data as Novel | undefined

	return (
		<div className='mx-auto max-w-2xl'>
			<Button
				asChild
				variant='ghost'
				size='sm'
				className='-ml-2 mb-4'
			>
				<Link to={`/admin/novels/${novelId}?page=1`}>
					<ArrowLeft
						className='mr-1 h-4 w-4'
						aria-hidden='true'
					/>
					Back
				</Link>
			</Button>

			<h1 className='font-serif text-3xl font-semibold tracking-tight'>Edit novel</h1>

			<div className='mt-8'>
				<NovelForm novel={novel} />
			</div>
		</div>
	)
}

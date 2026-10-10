import type { Novel } from '../types'
import { supabase } from './client'

export const getNovelBySlug = async ({ slug, select }: { slug: string; select?: string }) => {
	return supabase
		.from('novels')
		.select(
			select ??
				`
        id,
        title,
        slug,
        author
      `,
		)
		.eq('slug', slug)
		.maybeSingle<Pick<Novel, 'id' | 'title' | 'slug' | 'author'>>()
}

export const getNovelById = async ({ id, select }: { id: string; select?: string }) => {
	return supabase
		.from('novels')
		.select(
			select ??
				`
        id,
        title,
        slug,
        author
      `,
		)
		.eq('id', id)
		.maybeSingle<Pick<Novel, 'id' | 'title' | 'slug' | 'author'>>()
}

export const getNovels = async ({
	novelsPerPage,
	offset,
	select = '*',
}: {
	novelsPerPage: number
	offset: number
	select?: string
}) => {
	return await supabase
		.from('novels')
		.select(select)
		.order('created_at', { ascending: false })
		.range(offset, offset + novelsPerPage - 1)
}

export const insertNovel = async ({ payload, select }: { payload: Partial<Novel>; select?: string }) => {
	return await supabase
		.from('novels')
		.insert(payload)
		.select(select ?? '*')
		.maybeSingle()
}

export const updateNovel = async ({
	payload,
	novelId,
	select,
}: {
	payload: Partial<Novel>
	novelId: string
	select?: string
}) => {
	return await supabase
		.from('novels')
		.update(payload)
		.eq('id', novelId)
		.select(select ?? '*')
		.maybeSingle()
}

export const deleteNovel = async ({ novelId }: { novelId: string }) => {
	return await supabase.rpc('delete_novel', {
		p_novel_id: novelId,
	})
}

export const countNovels = async () => {
	return await supabase.from('novels').select('*', {
		count: 'exact',
		head: true,
	})
}

export const getNovelWithCountsRPC = async ({ novelsPerPage, offset }: { novelsPerPage: number; offset: number }) => {
	return await supabase.rpc('get_novels_with_counts', {
		p_limit: novelsPerPage,
		p_offset: offset,
	})
}

export const getRecentUpdatesPagination = async ({
	novelsPerPage = 5,
	offset = 0,
	select = '*',
}: {
	novelsPerPage?: number
	offset?: number
	select?: string
}) => {
	return await supabase
		.from('recently_updated_novels')
		.select(select, { count: 'exact' })
		.order('latest_chapter_at', { ascending: false })
		.range(offset, offset + novelsPerPage - 1)
}

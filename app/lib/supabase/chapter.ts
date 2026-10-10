import type { Chapter } from '../types'
import { supabase } from './client'

export const countChapters = async (novelId: string) => {
	return supabase
		.from('chapters')
		.select('*', {
			count: 'exact',
			head: true,
		})
		.eq('novel_id', novelId)
}

export const getChapterPagination = async (
	novelId: string,
	startChapter: number,
	endChapter: number,
	select: string = 'chapter_number, title',
) => {
	const response = await supabase
		.from('chapters')
		.select(select || 'chapter_number, title')
		.eq('novel_id', novelId)
		.gte('chapter_number', startChapter)
		.lte('chapter_number', endChapter)
		.order('chapter_number', { ascending: true })

	return response
}

export const getChapterByChapterNumber = async (novelId: string, chapterNumber: number, select?: string) => {
	return await supabase
		.from('chapters')
		.select(
			select ||
				`
        id,
        novel_id,
        chapter_number,
        title,
        content,
        created_at
      `,
		)
		.eq('novel_id', novelId)
		.eq('chapter_number', chapterNumber)
		.maybeSingle<Chapter>()
}

export const getChapterById = async ({
	novelId,
	chapterId,
	select,
}: {
	novelId: string
	chapterId: string
	select?: string
}) => {
	return await supabase
		.from('chapters')
		.select(
			select ||
				`
        id,
        novel_id,
        chapter_number,
        title,
        content,
        created_at
      `,
		)
		.eq('novel_id', novelId)
		.eq('id', chapterId)
		.maybeSingle<Chapter>()
}

export const getChapterPaginationAndCount = async ({
	startChapter,
	endChapter,
	novelId,
	select,
}: {
	startChapter: number
	endChapter: number
	novelId: string
	select?: string
}) => {
	const [countResult, chapters] = await Promise.all([
		countChapters(novelId),
		getChapterPagination(novelId, startChapter, endChapter, select),
	])

	return {
		countResult,
		chapters,
	}
}

export const updateChapterByChapterNumber = async ({
	novelId,
	chapterNumber,
	payload,
}: {
	novelId: string
	chapterNumber: number
	payload: Partial<Chapter>
}) => {
	return await supabase
		.from('chapters')
		.update(payload)
		.eq('novel_id', novelId)
		.eq('chapter_number', chapterNumber)
		.select()
		.maybeSingle()
}

export const createChapter = async ({ payload, select }: { payload: Partial<Chapter>; select?: string }) => {
	return await supabase
		.from('chapters')
		.insert(payload)
		.select(select ?? '*')
		.maybeSingle<Chapter>()
}

export const deleteChapter = async (id: string) => {
	return await supabase.from('chapters').delete().eq('id', id).maybeSingle<Chapter>()
}

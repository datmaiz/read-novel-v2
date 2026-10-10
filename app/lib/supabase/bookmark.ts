import { supabase } from './client'

export const getBookmarkedChapters = async ({ select }: { select?: string }) => {
	return await supabase
		.from('chapter_bookmarks')
		.select(
			select ??
				`
          created_at,
          chapters (
            id,
            chapter_number,
            title,
            novels (
              id,
              title,
              slug
            )
          )
        `,
		)
		.order('created_at', { ascending: false })
}

export const deleteBookmark = async (userId: string, chapterId: string) => {
	return await supabase.from('chapter_bookmarks').delete().eq('user_id', userId).eq('chapter_id', chapterId)
}

export const updateBookmark = async (userId: string, chapterId: string) => {
	return await supabase.from('chapter_bookmarks').upsert({
		user_id: userId,
		chapter_id: chapterId,
	})
}

export const checkIsBookmarked = async (userId: string, chapterId: string) => {
	const { data, error } = await supabase
		.from('chapter_bookmarks')
		.select('chapter_id')
		.eq('user_id', userId)
		.eq('chapter_id', chapterId)
		.maybeSingle()

	if (error) return false
	return !!data
}

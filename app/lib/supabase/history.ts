import { supabase } from './client'

export const getHistories = async ({
	userId,
	from,
	to,
	select,
}: {
	userId: string
	from: number
	to: number
	select?: string
}) => {
	return await supabase
		.from('reading_history')
		.select(
			select ??
				`
        *,
        novel:novels(
          slug,
          title,
          cover_url
        ),
        chapter:chapters(
          chapter_number,
          title
        )
      `,
			{
				count: 'exact',
			},
		)
		.eq('user_id', userId)
		.order('last_read_at', {
			ascending: false,
		})
		.range(from, to)
}

export const getHistoryByNovelId = async ({ novelId, select }: { novelId: string; select?: string }) => {
	return await supabase
		.from('reading_history')
		.select(
			select ||
				`
			*,
			chapter:chapters(
				chapter_number
			)
    `,
		)
		.eq('novel_id', novelId)
		.maybeSingle()
}

export const updateHistory = async ({
	userId,
	novelId,
	chapterId,
}: {
	userId: string
	novelId: string
	chapterId: string
}) => {
	return await supabase.from('reading_history').upsert(
		{
			user_id: userId,
			novel_id: novelId,
			chapter_id: chapterId,
			last_read_at: new Date().toISOString(),
		},
		{
			onConflict: 'user_id,novel_id',
		},
	)
}

import { checkIsBookmarked, deleteBookmark, getBookmarkedChapters, updateBookmark } from '@/lib/supabase/bookmark'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from './keys'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

export const useGetBookmarkedChapters = ({ userId, select }: { userId: string; select?: string }) => {
	return useQuery({
		queryKey: QUERY_KEYS.getBookmarkedChapters({ userId }),
		queryFn: () => getBookmarkedChapters({ select }),
		enabled: !!userId,
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useCheckIsBookmarkedQuery = (userId: string, chapterId: string) => {
	return useQuery({
		queryKey: QUERY_KEYS.checkIsBookmarked(userId, chapterId),
		queryFn: () => checkIsBookmarked(userId, chapterId),
		enabled: !!userId && !!chapterId,
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useUpdateBookmarkMutation = () => {
	const client = useQueryClient()

	return useMutation({
		mutationFn: ({ userId, chapterId }: { userId: string; chapterId: string }) => updateBookmark(userId, chapterId),
		onMutate: async ({ userId, chapterId }) => {
			const previous = client.getQueryData(QUERY_KEYS.checkIsBookmarked(userId, chapterId))

			client.setQueryData(QUERY_KEYS.checkIsBookmarked(userId, chapterId), true)

			return { previous }
		},
	})
}

export const useDeleteBookmarkMutation = () => {
	const client = useQueryClient()

	return useMutation({
		mutationFn: ({ userId, chapterId }: { userId: string; chapterId: string }) => deleteBookmark(userId, chapterId),
		onMutate: async ({ userId, chapterId }) => {
			const previous = client.getQueryData(QUERY_KEYS.checkIsBookmarked(userId, chapterId))

			client.setQueryData(QUERY_KEYS.checkIsBookmarked(userId, chapterId), false)

			return { previous }
		},
	})
}

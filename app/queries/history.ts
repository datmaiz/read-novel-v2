import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from './keys'
import { getHistories, getHistoryByNovelId, updateHistory } from '@/lib/supabase/history'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

export const useGetHistoriesPaginationQuery = ({ userId, from, to }: { userId: string; from: number; to: number }) => {
	return useQuery({
		queryKey: QUERY_KEYS.getHistoriesPagination({ userId, from, to }),
		queryFn: () => getHistories({ userId, from, to }),
		enabled: !!userId,
		staleTime: MINUTE * 5,
		refetchOnWindowFocus: false,
	})
}

export const useUpdateHistoryMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: { userId: string; novelId: string; chapterId: string }) => updateHistory(data),
		onSuccess: (_, data) => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.getHistoriesPagination({
					userId: data.userId,
					from: 0,
					to: 10,
				}),
			})
		},
	})
}

export const useGetHistoryByNovelIdQuery = ({ novelId, select }: { novelId: string; select?: string }) => {
	return useQuery({
		queryKey: QUERY_KEYS.getHistoryByNovelId({ novelId, select }),
		queryFn: () => getHistoryByNovelId({ novelId, select }),
		enabled: !!novelId,
		staleTime: MINUTE * 5,
		refetchOnWindowFocus: false,
	})
}

import {
	deleteChapter,
	getChapterByChapterNumber,
	getChapterById,
	getChapterPagination,
	getChapterPaginationAndCount,
	updateChapterByChapterNumber,
} from '@/lib/supabase/chapter'
import type { Chapter } from '@/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from './keys'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

export const useChapterPaginationQuery = (novelId: string, startChapter: number, endChapter: number) => {
	return useQuery({
		queryKey: QUERY_KEYS.getChapterPagination(novelId, startChapter, endChapter),
		queryFn: () => getChapterPagination(novelId, startChapter, endChapter),
		enabled: !!novelId,
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useChapterByChapterNumberQuery = (novelId: string, chapterNumber: number) => {
	return useQuery({
		queryKey: QUERY_KEYS.getChapterByChapterNumber(novelId, chapterNumber),
		queryFn: () => getChapterByChapterNumber(novelId, chapterNumber),
		enabled: !!novelId && !!chapterNumber,
		staleTime: HOUR * 10,
		refetchOnWindowFocus: false,
	})
}

export const useGetChapterByIdQuery = ({
	novelId,
	chapterId,
	select,
}: {
	novelId: string
	chapterId: string
	select?: string
}) => {
	return useQuery({
		queryKey: QUERY_KEYS.getChapterById(novelId, chapterId),
		queryFn: () => getChapterById({ novelId, chapterId, select }),
		enabled: !!novelId && !!chapterId,
		staleTime: HOUR * 10,
		refetchOnWindowFocus: false,
	})
}

export const useChapterPaginationAndCountQuery = ({
	novelId,
	startChapter,
	endChapter,
	select,
}: {
	novelId: string
	startChapter: number
	endChapter: number
	select?: string
}) => {
	return useQuery({
		queryKey: QUERY_KEYS.getChapterPaginationAndCount(startChapter, endChapter, novelId),
		queryFn: () => getChapterPaginationAndCount({ startChapter, endChapter, novelId, select }),
		enabled: !!novelId,
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useUpdateChapterByChapterNumberMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({
			novelId,
			chapterNumber,
			payload,
		}: {
			novelId: string
			chapterNumber: number
			payload: Partial<Chapter>
		}) => updateChapterByChapterNumber({ novelId, chapterNumber, payload }),
		onSuccess: (data, { chapterNumber, novelId, payload }) => {
			if (!data.data) {
				return
			}

			const chapter = queryClient.getQueryData(QUERY_KEYS.getChapterByChapterNumber(novelId, chapterNumber))

			queryClient.setQueryData(QUERY_KEYS.getChapterByChapterNumber(novelId, chapterNumber), { ...data, ...payload })
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getChapters })
		},
	})
}

export const useDeleteChapterByIdMutation = () => {
	const client = useQueryClient()

	return useMutation({
		mutationFn: ({ id }: { id: string; userId: string }) => deleteChapter(id),
		onSuccess: (_, { userId }) => {
			client.invalidateQueries({ queryKey: QUERY_KEYS.getChapters })
			client.invalidateQueries({ queryKey: QUERY_KEYS.getBookmarkedChapters({ userId }) })
			client.invalidateQueries({ queryKey: QUERY_KEYS.getNovels })
			client.invalidateQueries({ queryKey: QUERY_KEYS.getHistories })
		},
	})
}

import {
	countNovels,
	deleteNovel,
	getNovelById,
	getNovelBySlug,
	getNovels,
	getNovelWithCountsRPC,
	getRecentUpdatesPagination,
	insertNovel,
	updateNovel,
} from '@/lib/supabase/novel'
import type { Novel } from '@/lib/types'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from './keys'
import { createChapter } from '@/lib/supabase/chapter'

const SECOND = 1000
const MINUTE = SECOND * 60
const HOUR = MINUTE * 60
const DAY = HOUR * 24
const WEEK = DAY * 7

export const useGetNovelWithCountRPCPagination = ({
	novelsPerPage,
	offset,
}: {
	novelsPerPage: number
	offset: number
}) => {
	return useQuery({
		queryKey: QUERY_KEYS.getNovelWithCountRPCPagination({ novelsPerPage, offset }),
		queryFn: () => getNovelWithCountsRPC({ novelsPerPage, offset }),
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useGetNovelsPagination = ({
	novelsPerPage,
	offset,
	select,
}: {
	novelsPerPage: number
	offset: number
	select?: string
}) => {
	return useQuery({
		queryKey: QUERY_KEYS.getNovelPagination({ novelsPerPage, offset }),
		queryFn: () => getNovels({ novelsPerPage, offset, select }),
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useGetRecentUpdatesNovelPagination = ({
	novelsPerPage,
	offset,
}: {
	novelsPerPage: number
	offset: number
}) => {
	return useQuery({
		queryKey: QUERY_KEYS.getRecentUpdatesNovelPagination({ novelsPerPage, offset }),
		queryFn: () => getRecentUpdatesPagination({ novelsPerPage, offset }),
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useGetNovelBySlugQuery = ({ slug, select }: { slug: string; select?: string }) => {
	return useQuery({
		queryKey: QUERY_KEYS.getNovelBySlug(slug, select),
		queryFn: () => getNovelBySlug({ slug, select }),
		enabled: !!slug,
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useGetNovelByIdQuery = ({ id, select }: { id: string; select?: string }) => {
	return useQuery({
		queryKey: QUERY_KEYS.getNovelById(id, select),
		queryFn: () => getNovelById({ id, select }),
		enabled: !!id,
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useNovelCount = () => {
	return useQuery({
		queryKey: QUERY_KEYS.getNovelCount,
		queryFn: () => countNovels(),
		staleTime: HOUR * 5,
		refetchOnWindowFocus: false,
	})
}

export const useUpdateNovelMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: (data: { novelId: string; payload: Partial<Novel> }) => updateNovel(data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.getNovels,
			})
		},
	})
}

export const useCreateNewChapterMutation = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ payload, select }: { payload: Partial<Novel>; select?: string }) =>
			createChapter({ payload, select }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.getNovels,
			})
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getChapters })
		},
	})
}

export const useDeleteNovelMutation = ({ userId }: { userId: string }) => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationFn: ({ novelId }: { novelId: string }) => deleteNovel({ novelId }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: QUERY_KEYS.getNovels,
			})
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getBookmarkedChapters({ userId }) })
			queryClient.invalidateQueries({ queryKey: QUERY_KEYS.getHistories })
		},
	})
}

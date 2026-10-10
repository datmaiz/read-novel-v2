export const QUERY_KEYS = {
	// Chapter
	getChapters: ['GET_CHAPTERS'],
	getChapterPagination: (novelId: string, startChapter: number, endChapter: number) => [
		'GET_CHAPTERS',
		{ novelId, startChapter, endChapter },
	],
	getChapterByChapterNumber: (novelId: string, chapterNumber: number, select?: string) => [
		'GET_CHAPTERS',
		'BY_CHAPTER_NUMBER',
		{ novelId, chapterNumber, select },
	],
	getChapterById: (novelId: string, chapterNumber: string, select?: string) => [
		'GET_CHAPTERS',
		'BY_CHAPTER_NUMBER',
		{ novelId, chapterNumber, select },
	],
	getChapterPaginationAndCount: (startChapter: number, endChapter: number, novelId: string) => [
		'GET_CHAPTERS',
		{ startChapter, endChapter, novelId },
	],

	// Bookmark
	checkIsBookmarked: (userId: string, chapterId: string) => ['CHECK_IS_BOOKMARKED', { userId, chapterId }],
	getBookmarkedChapters: ({ userId }: { userId: string }) => ['GET_BOOKMARKED_CHAPTERS', { userId }],

	// Novel
	getNovelBySlug: (slug: string, select?: string) => ['GET_NOVELS', 'BY_SLUG', { slug, select }],
	getNovelById: (id: string, select?: string) => ['GET_NOVELS', 'BY_ID', { id, select }],
	getNovels: ['GET_NOVELS'],
	getNovelCount: ['GET_NOVELS', 'COUNT'],
	getNovelPagination: ({ novelsPerPage, offset }: { novelsPerPage: number; offset: number }) => [
		'GET_NOVELS',
		{ novelsPerPage, offset },
	],
	getNovelWithCountRPCPagination: ({
		novelsPerPage,
		offset,
		select,
	}: {
		novelsPerPage: number
		offset: number
		select?: string
	}) => ['GET_NOVELS', 'WITH_COUNT', 'RPC', { novelsPerPage, offset, select }],
	getRecentUpdatesNovelPagination: ({
		novelsPerPage,
		offset,
		select,
	}: {
		novelsPerPage: number
		offset: number
		select?: string
	}) => ['GET_NOVELS', 'RECENT_UPDATES', { novelsPerPage, offset, select }],

	// History
	getHistories: ['GET_HISTORIES'],
	getHistoriesPagination: ({ userId, from, to }: { userId: string; from: number; to: number }) => [
		'GET_HISTORIES',
		{ userId, from, to },
	],
	getHistoryByNovelId: ({ novelId, select }: { novelId: string; select?: string }) => [
		'GET_HISTORIES',
		'BY_NOVEL_ID',
		{ novelId, select },
	],
}

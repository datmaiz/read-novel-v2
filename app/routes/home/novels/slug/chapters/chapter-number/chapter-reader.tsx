import {
	ArrowUp,
	Bookmark,
	Check,
	ChevronLeft,
	ChevronRight,
	Copy,
	List,
	Loader2,
	Minus,
	Pencil,
	Plus,
	Search,
	Type,
} from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { getChapterPagination } from '@/lib/supabase/chapter'
import type { Chapter } from '@/lib/types'
import { QUERY_KEYS, useCheckIsBookmarkedQuery, useDeleteBookmarkMutation, useUpdateBookmarkMutation } from '@/queries'
import { useAuthStore } from '@/zustand/auth'
import { useQueryClient } from '@tanstack/react-query'

type Mini = Pick<Chapter, 'chapter_number' | 'title'>

const NUMBER_OF_LOADING_CHAPTERS = 50 // Number of chapters to load when user clicks "Load more" or "Load previous"

export function ChapterReader({
	novel,
	chapter,
	initialChapters,
	prev,
	next,
	chapterCount,
	isAdmin,
}: {
	novel: { slug: string; title: string; author: string | null; id?: string }
	chapter: Chapter
	initialChapters: Mini[]
	prev: Mini | null
	next: Mini | null
	chapterCount: number
	isAdmin?: boolean
}) {
	const navigate = useNavigate()
	const [copied, setCopied] = useState(false)
	const [open, setOpen] = useState(false)
	const [chapters, setChapters] = useState<Mini[]>(initialChapters)
	const [minChapterNumber, setMinChapterNumber] = useState(
		initialChapters.length > 0 ? initialChapters[0].chapter_number : 0,
	)
	const [maxChapterNumber, setMaxChapterNumber] = useState(
		initialChapters.length > 0 ? initialChapters[initialChapters.length - 1].chapter_number : 0,
	)
	const [loadingPrevious, setLoadingPrevious] = useState(false)
	const [loadingMore, setLoadingMore] = useState(false)
	const [_, setHasPrevious] = useState(minChapterNumber > 1)
	const [hasMore, setHasMore] = useState(false)
	const [jumpInput, setJumpInput] = useState('')
	const [isSpeaking, setIsSpeaking] = useState(false)
	const [isPaused, setIsPaused] = useState(false)
	const [speechRate, setSpeechRate] = useState(1)
	const [speechProgress, setSpeechProgress] = useState(0)
	const [fontSize, setFontSize] = useState(18)

	const session = useAuthStore((state) => state.session)

	// Load font size from localStorage on mount
	useEffect(() => {
		const saved = localStorage.getItem('reader-font-size')
		if (saved) {
			const parsed = parseInt(saved, 10)
			if (!isNaN(parsed) && parsed >= 14 && parsed <= 28) {
				setFontSize(parsed)
			}
		}
	}, [])

	const changeFontSize = (newSize: number) => {
		setFontSize(newSize)
		localStorage.setItem('reader-font-size', newSize.toString())
	}

	const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

	const activeChapterRef = useRef<HTMLButtonElement | null>(null)
	const contentRef = useRef<HTMLDivElement | null>(null)
	const chaptersListRef = useRef<HTMLDivElement | null>(null)
	const sheetContentRef = useRef<HTMLDivElement | null>(null)
	const paragraphRefs = useRef<(HTMLParagraphElement | null)[]>([])
	const [activeParagraph, setActiveParagraph] = useState(-1)

	const paragraphs = useMemo(() => chapter.content.split(/\n{2,}/), [chapter.content])

	const paragraphBoundaries = useMemo(() => {
		let offset = 0

		return paragraphs.map((text) => {
			const start = offset

			offset += text.length + 2

			return {
				start,
				end: offset,
			}
		})
	}, [paragraphs])

	const client = useQueryClient()
	const { data: isBookmarked, isLoading: isBookmarkLoading } = useCheckIsBookmarkedQuery(
		session?.user.id || '',
		chapter.id || '',
	)

	const deleteBookmarkMutation = useDeleteBookmarkMutation()
	const createBookmarkMutation = useUpdateBookmarkMutation()

	// Stop speech synthesis when chapter changes
	useEffect(() => {
		speechSynthesis.cancel()

		setIsSpeaking(false)
		setIsPaused(false)

		return () => {
			speechSynthesis.cancel()
		}
	}, [chapter.id])

	// Check if there are more chapters available
	useEffect(() => {
		const checkMoreChapters = async () => {
			try {
				if (!novel.id) return
				const { data, error } = await getChapterPagination(novel.id, maxChapterNumber + 1, maxChapterNumber + 1)
				if (error) return
				if (data?.length) setHasMore(true)
			} catch (error) {
				console.error('Error checking for more chapters:', error)
			}
		}
		checkMoreChapters()
	}, [maxChapterNumber, novel.slug])

	const handleBookmark = async () => {
		if (!session?.user) return

		if (isBookmarked) {
			await deleteBookmarkMutation.mutateAsync(
				{ userId: session.user.id, chapterId: chapter.id },
				{
					onSuccess: () => {
						client.setQueryData(QUERY_KEYS.checkIsBookmarked(session.user.id, chapter.id), false)
						client.invalidateQueries({ queryKey: QUERY_KEYS.getBookmarkedChapters({ userId: session.user.id }) })
					},
				},
			)
			toast.success('Bookmark removed')
			return
		}

		await createBookmarkMutation.mutateAsync(
			{ userId: session.user.id, chapterId: chapter.id },
			{
				onSuccess: () => {
					client.setQueryData(QUERY_KEYS.checkIsBookmarked(session.user.id, chapter.id), true)
					client.invalidateQueries({ queryKey: QUERY_KEYS.getBookmarkedChapters({ userId: session.user.id }) })
				},
			},
		)
		toast.success('Bookmark added')
	}

	const handleRead = () => {
		if (!('speechSynthesis' in window)) {
			toast.error('Your browser does not support TTS')
			return
		}

		speechSynthesis.cancel()

		const utterance = new SpeechSynthesisUtterance(`${chapter.title}. ${chapter.content}`)

		utterance.lang = 'vi-VN'
		utterance.rate = 1
		utterance.pitch = 1
		utterance.rate = speechRate

		const voices = speechSynthesis.getVoices()

		const vietnameseVoice = voices.find((voice) => voice.lang === 'vi-VN' && voice.name.includes('Google Tiếng Việt'))

		if (vietnameseVoice) {
			utterance.voice = vietnameseVoice
		}

		utterance.onstart = () => {
			setIsSpeaking(true)
			setIsPaused(false)
		}

		utterance.onend = () => {
			setIsSpeaking(false)
			setIsPaused(false)
		}

		utterance.onerror = () => {
			setIsSpeaking(false)
			setIsPaused(false)
			setActiveParagraph(-1)
		}

		utterance.onboundary = (event) => {
			const charIndex = event.charIndex

			const paragraphIndex = paragraphBoundaries.findIndex((p) => charIndex >= p.start && charIndex < p.end)

			if (paragraphIndex === -1) return

			setActiveParagraph(paragraphIndex)

			paragraphRefs.current[paragraphIndex]?.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
			})

			setSpeechProgress(Math.round((event.charIndex / chapter.content.length) * 100))
		}

		utteranceRef.current = utterance

		speechSynthesis.speak(utterance)
	}

	const handlePause = () => {
		speechSynthesis.pause()

		setIsPaused(true)
	}

	const handleStop = () => {
		speechSynthesis.cancel()

		setIsSpeaking(false)
		setIsPaused(false)
	}

	const handleResume = () => {
		speechSynthesis.resume()

		setIsPaused(false)
	}

	const loadPreviousChapters = async () => {
		if (loadingPrevious || minChapterNumber <= 1) return
		if (!novel.id) return

		setLoadingPrevious(true)

		const container = chaptersListRef.current

		// Lưu trạng thái trước khi prepend
		const previousScrollTop = container?.scrollTop ?? 0
		const previousScrollHeight = container?.scrollHeight ?? 0

		try {
			const startChapter = Math.max(1, minChapterNumber - NUMBER_OF_LOADING_CHAPTERS)

			const endChapter = minChapterNumber - 1

			const { data, error } = await getChapterPagination(novel.id, startChapter, endChapter)

			if (error) {
				throw new Error('Failed to load chapters')
			}

			const newChapters = data as unknown as Mini[]

			setChapters((previous) => [...newChapters, ...previous])

			setMinChapterNumber(startChapter)
			setHasPrevious(startChapter > 1)

			// Chờ React render xong
			requestAnimationFrame(() => {
				const containerEl = chaptersListRef.current

				if (!containerEl) return

				const newScrollHeight = containerEl.scrollHeight

				containerEl.scrollTop = previousScrollTop + (newScrollHeight - previousScrollHeight)
			})
		} catch (error) {
			toast.error('Failed to load previous chapters')
			console.error(error)
		} finally {
			setLoadingPrevious(false)
		}
	}

	const loadMoreChapters = async () => {
		if (loadingMore || !hasMore) return
		if (!novel.id) return

		setLoadingMore(true)
		const scrollPosition = chaptersListRef.current?.scrollTop || 0

		try {
			const startChapter = maxChapterNumber + 1
			const endChapter = maxChapterNumber + NUMBER_OF_LOADING_CHAPTERS

			const { data, error } = await getChapterPagination(novel.id, startChapter, endChapter)
			if (error) throw new Error('Failed to load chapters')
			const newChapters = data as unknown as Mini[]

			setChapters((previous) => [...previous, ...newChapters])
			setMaxChapterNumber(endChapter)
			setHasMore(newChapters.length >= NUMBER_OF_LOADING_CHAPTERS)

			// Restore scroll position to prevent jumping
			setTimeout(() => {
				if (chaptersListRef.current) {
					chaptersListRef.current.scrollTop = scrollPosition
				}
			}, 0)
		} catch (error) {
			toast.error('Failed to load more chapters')
			console.error(error)
		} finally {
			setLoadingMore(false)
		}
	}

	useEffect(() => {
		setChapters(initialChapters)
		if (initialChapters.length > 0) {
			setMinChapterNumber(initialChapters[0].chapter_number)
			setMaxChapterNumber(initialChapters[initialChapters.length - 1].chapter_number)
		}
	}, [initialChapters])

	useEffect(() => {
		document.body.scrollIntoView()
	}, [chapter.id])

	// Auto scroll to current chapter when sheet opens
	useEffect(() => {
		if (!open) return

		const timer = setTimeout(() => {
			activeChapterRef.current?.scrollIntoView({
				block: 'center',
				behavior: 'instant',
			})
		}, 150)

		return () => clearTimeout(timer)
	}, [open])

	// Keyboard navigation: ← previous, → next
	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			const target = e.target as HTMLElement | null
			if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
				return
			}
			if (e.key === 'ArrowLeft' && prev) {
				navigate(`/novels/${novel.slug}/chapters/${prev.chapter_number}`)
			} else if (e.key === 'ArrowRight' && next) {
				navigate(`/novels/${novel.slug}/chapters/${next.chapter_number}`)
			}
		}
		window.addEventListener('keydown', onKey)
		return () => window.removeEventListener('keydown', onKey)
	}, [novel.slug, prev, next])

	const handleCopy = async () => {
		try {
			const text = `${chapter.content}`
			await navigator.clipboard.writeText(text)
			setCopied(true)
			toast.success('Chapter copied to clipboard')
			setTimeout(() => setCopied(false), 2000)
		} catch {
			toast.error('Could not copy. Try selecting the text manually.')
		}
	}

	const handleJump = (n: number) => {
		setOpen(false)
		navigate(`/novels/${novel.slug}/chapters/${n}`)
	}

	const handleJumpToChapter = () => {
		const chapterNum = parseInt(jumpInput, 10)
		if (isNaN(chapterNum)) {
			toast.error('Please enter a valid chapter number')
			return
		}
		if (chapterNum < 1 || chapterNum > chapterCount) {
			toast.error(`Chapter must be between 1 and ${chapterCount}`)
			return
		}
		setJumpInput('')
		handleJump(chapterNum)
	}

	return (
		<article className={`mt-4 ${isSpeaking ? 'pb-24' : ''}`}>
			{/* Scroll To Top Button */}
			<Button
				size='sm'
				onClick={() => document.body.scrollIntoView({ behavior: 'smooth' })}
				className='fixed bottom-10 right-4 z-40 rounded-full p-7 w-auto aspect-square'
			>
				<ArrowUp className='h-4 w-4' />
			</Button>

			{isSpeaking && (
				<div className='fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur'>
					<div className='container mx-auto flex items-center justify-between gap-3 p-3'>
						<div className='min-w-0 flex-1'>
							<p className='truncate text-sm font-medium'>Chapter {chapter.chapter_number}</p>

							<p className='truncate text-xs text-muted-foreground'>{chapter.title}</p>
						</div>

						<div className='flex items-center gap-2'>
							<div className='w-32'>
								<div className='h-2 overflow-hidden rounded bg-muted'>
									<div
										className='h-full bg-primary transition-all'
										style={{
											width: `${speechProgress}%`,
										}}
									/>
								</div>
							</div>
							{isPaused ? (
								<Button
									size='sm'
									onClick={handleResume}
								>
									▶ Resume
								</Button>
							) : (
								<Button
									size='sm'
									variant='outline'
									onClick={handlePause}
								>
									⏸ Pause
								</Button>
							)}

							<Button
								size='sm'
								variant='destructive'
								onClick={handleStop}
							>
								⏹ Stop
							</Button>

							<select
								value={speechRate}
								onChange={(e) => {
									const rate = Number(e.target.value)
									setSpeechRate(rate)
								}}
								className='h-9 rounded border px-2 text-sm'
							>
								<option value={0.75}>0.75x</option>
								<option value={1}>1x</option>
								<option value={1.25}>1.25x</option>
								<option value={1.5}>1.5x</option>
								<option value={1.75}>1.75x</option>
								<option value={2}>2x</option>
							</select>
						</div>
					</div>
				</div>
			)}
			<header className='border-b border-border pb-6'>
				<p className='text-sm uppercase tracking-wider text-muted-foreground'>Chapter {chapter.chapter_number}</p>
				<h1 className='mt-2 text-balance font-serif text-3xl font-semibold leading-tight md:text-4xl'>
					{chapter.title}
				</h1>
				<div className='flex flex-wrap items-center gap-2'>
					<div className='flex items-center gap-1 rounded-lg border border-border bg-muted/50 p-1 backdrop-blur-sm transition-all hover:bg-muted'>
						<Button
							variant='ghost'
							size='icon'
							className='h-7 w-7 rounded-md hover:bg-background hover:text-foreground transition-all duration-200'
							onClick={() => changeFontSize(Math.max(14, fontSize - 2))}
							disabled={fontSize <= 14}
							title='Giảm kích thước chữ'
						>
							<Minus className='h-3.5 w-3.5' />
						</Button>
						<span className='flex items-center gap-1.5 px-2.5 text-xs font-semibold select-none text-muted-foreground min-w-17.5 justify-center'>
							<Type className='h-3.5 w-3.5 text-muted-foreground/75' />
							<span>{fontSize}px</span>
						</span>
						<Button
							variant='ghost'
							size='icon'
							className='h-7 w-7 rounded-md hover:bg-background hover:text-foreground transition-all duration-200'
							onClick={() => changeFontSize(Math.min(28, fontSize + 2))}
							disabled={fontSize >= 28}
							title='Tăng kích thước chữ'
						>
							<Plus className='h-3.5 w-3.5' />
						</Button>
					</div>

					{chapters.length > 0 && (
						<Sheet
							open={open}
							onOpenChange={setOpen}
						>
							<SheetTrigger asChild>
								<Button
									variant='outline'
									size='sm'
									disabled={false}
								>
									<List
										className='mr-1 h-4 w-4'
										aria-hidden='true'
									/>
									Chapters
								</Button>
							</SheetTrigger>
							<SheetContent
								side='right'
								className='w-full sm:max-w-md'
								ref={sheetContentRef}
							>
								<SheetHeader>
									<SheetTitle className='font-serif'>{novel.title}</SheetTitle>
									<SheetDescription>{chapterCount} chapters</SheetDescription>
								</SheetHeader>
								<div className='mt-4 flex gap-2'>
									<Input
										type='number'
										placeholder='Jump to...'
										value={jumpInput}
										onChange={(e) => setJumpInput(e.target.value)}
										onKeyDown={(e) => {
											if (e.key === 'Enter') {
												handleJumpToChapter()
											}
										}}
										min='1'
										max={chapterCount}
										className='flex-1'
									/>
									<Button
										onClick={handleJumpToChapter}
										size='sm'
										variant='outline'
									>
										<Search className='h-4 w-4' />
									</Button>
								</div>
								{chapters[0].chapter_number > 1 && (
									<Button
										onClick={loadPreviousChapters}
										disabled={loadingPrevious}
										className='mt-4 w-full'
									>
										{loadingPrevious ? (
											<>
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
												Loading...
											</>
										) : (
											'Load previous chapters'
										)}
									</Button>
								)}
								<div
									ref={chaptersListRef}
									className='h-full overflow-y-auto'
								>
									<ol className='divide-y divide-border'>
										{chapters.map((c) => {
											const active = c.chapter_number === chapter.chapter_number
											return (
												<li key={c.chapter_number}>
													<button
														ref={active ? activeChapterRef : null}
														type='button'
														onClick={() => handleJump(c.chapter_number)}
														className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-accent/50 ${
															active ? 'bg-accent' : ''
														}`}
													>
														<span
															className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-xs font-medium ${
																active ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'
															}`}
														>
															{c.chapter_number}
														</span>
														<span className='truncate font-serif text-sm'>{c.title}</span>
													</button>
												</li>
											)
										})}
									</ol>
								</div>
								{chapters[chapters.length - 1].chapter_number < chapterCount && (
									<Button
										onClick={loadMoreChapters}
										disabled={loadingMore}
										className='w-full mt-auto'
									>
										{loadingMore ? (
											<>
												<Loader2 className='mr-2 h-4 w-4 animate-spin' />
												Loading...
											</>
										) : (
											'Load more chapters'
										)}
									</Button>
								)}
							</SheetContent>
						</Sheet>
					)}

					<Button
						variant='outline'
						size='sm'
						onClick={handleCopy}
					>
						{copied ? (
							<>
								<Check
									className='mr-1 h-4 w-4'
									aria-hidden='true'
								/>
								Copied
							</>
						) : (
							<>
								<Copy
									className='mr-1 h-4 w-4'
									aria-hidden='true'
								/>
								Copy chapter
							</>
						)}
					</Button>
					<Button
						variant={'outline'}
						onClick={handleBookmark}
						disabled={deleteBookmarkMutation.isPending || createBookmarkMutation.isPending || isBookmarkLoading}
						className={isBookmarked ? 'text-green-500' : ''}
					>
						<Bookmark color={isBookmarked ? 'green' : 'black'} /> {isBookmarked ? 'Bookmarked' : 'Bookmark'}
					</Button>
					{!isSpeaking ? (
						<Button
							variant='outline'
							size='sm'
							onClick={handleRead}
						>
							▶ Read Aloud
						</Button>
					) : (
						<>
							{isPaused ? (
								<Button
									variant='outline'
									size='sm'
									onClick={handleResume}
								>
									▶ Resume
								</Button>
							) : (
								<Button
									variant='outline'
									size='sm'
									onClick={handlePause}
								>
									⏸ Pause
								</Button>
							)}

							<Button
								variant='outline'
								size='sm'
								onClick={handleStop}
							>
								⏹ Stop
							</Button>
						</>
					)}
					{isAdmin && novel.id && (
						<Button
							asChild
							variant='outline'
							size='sm'
						>
							<Link to={`/novels/${novel.slug}/chapters/${chapter.chapter_number}/edit`}>
								<Pencil
									className='mr-1 h-4 w-4'
									aria-hidden='true'
								/>
								Edit
							</Link>
						</Button>
					)}
				</div>
				<nav className='mt-12 flex items-center justify-between gap-3 flex-wrap'>
					{prev ? (
						<Button
							asChild
							variant='outline'
							className='max-w-[48%] flex-1 justify-start bg-transparent'
						>
							<Link to={`/novels/${novel.slug}/chapters/${prev.chapter_number}`}>
								<ChevronLeft
									className='mr-1 h-4 w-4 shrink-0'
									aria-hidden='true'
								/>
								<span className='flex min-w-0 flex-col items-start'>
									<span className='text-xs text-muted-foreground'>Previous</span>
									<span className='w-full truncate text-sm'>
										{prev.chapter_number}. {prev.title}
									</span>
								</span>
							</Link>
						</Button>
					) : (
						<span className='flex-1' />
					)}

					{next ? (
						<Button
							asChild
							className='max-w-[48%] flex-1 justify-end'
						>
							<Link to={`/novels/${novel.slug}/chapters/${next.chapter_number}`}>
								<span className='flex min-w-0 flex-col items-end'>
									<span className='text-xs opacity-80'>Next</span>
									<span className='w-full truncate text-right text-sm'>
										{next.chapter_number}. {next.title}
									</span>
								</span>
								<ChevronRight
									className='ml-1 h-4 w-4 shrink-0'
									aria-hidden='true'
								/>
							</Link>
						</Button>
					) : (
						<Button
							disabled
							variant='outline'
							className='max-w-[48%] flex-1 justify-end bg-transparent'
						>
							End of chapters
						</Button>
					)}
				</nav>
				<div className='flex items-center gap-8 mt-4'></div>
			</header>

			<div
				ref={contentRef}
				className='prose-reader font-serif leading-8'
			>
				{paragraphs.map((para, i) => (
					<p
						key={i}
						ref={(el) => {
							paragraphRefs.current[i] = el
						}}
						className={`select-none
							${activeParagraph === i ? 'rounded text-blue-500 transition-colors' : ''}
						`}
						style={{ fontSize: `${fontSize}px`, lineHeight: 1.8 }}
					>
						{para}
					</p>
				))}
			</div>

			<nav className='mt-12 flex items-center flex-wrap justify-between gap-3 border-t border-border pt-6 sm:flex-row'>
				{prev ? (
					<Button
						asChild
						variant='outline'
						className='max-w-[48%] flex-1 justify-start bg-transparent sm:flex-1'
					>
						<Link to={`/novels/${novel.slug}/chapters/${prev.chapter_number}`}>
							<ChevronLeft
								className='mr-1 h-4 w-4 shrink-0'
								aria-hidden='true'
							/>
							<span className='flex min-w-0 flex-col items-start'>
								<span className='text-xs text-muted-foreground'>Previous</span>
								<span className='w-full truncate text-sm'>
									{prev.chapter_number}. {prev.title}
								</span>
							</span>
						</Link>
					</Button>
				) : (
					<span className='flex-1' />
				)}

				{next ? (
					<Button
						asChild
						className='max-w-[48%] flex-1 justify-end'
					>
						<Link to={`/novels/${novel.slug}/chapters/${next.chapter_number}`}>
							<span className='flex min-w-0 flex-col items-end'>
								<span className='text-xs opacity-80'>Next</span>
								<span className='w-full truncate text-right text-sm'>
									{next.chapter_number}. {next.title}
								</span>
							</span>
							<ChevronRight
								className='ml-1 h-4 w-4 shrink-0'
								aria-hidden='true'
							/>
						</Link>
					</Button>
				) : (
					<Button
						disabled
						variant='outline'
						className='max-w-[48%] flex-1 justify-end bg-transparent'
					>
						End of chapters
					</Button>
				)}
			</nav>

			<p className='mt-4 text-center text-xs text-muted-foreground'>Tip: use ← and → arrow keys to flip pages.</p>
		</article>
	)
}

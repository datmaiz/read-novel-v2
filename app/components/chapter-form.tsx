import type { SyntheticEvent } from 'react'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

import { supabase } from '@/lib/supabase/client'
import type { Chapter } from '@/lib/types'
import { useNavigate } from 'react-router'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion'
import { useCreateNewChapterMutation, useUpdateChapterByChapterNumberMutation } from '@/queries'
import { RULES } from '@/lib/contants'

export function ChapterForm({
	novelId,
	chapter,
	suggestedNumber,
}: {
	novelId: string
	chapter?: Chapter
	suggestedNumber?: number
}) {
	const [chapterNumber, setChapterNumber] = useState<string>(
		chapter ? String(chapter.chapter_number) : suggestedNumber ? String(suggestedNumber) : '1',
	)

	const [title, setTitle] = useState(chapter?.title ?? '')
	const [content, setContent] = useState(chapter?.content ?? '')
	const [selectedCharacters, setSelectedCharacters] = useState(0)

	const [formatOpen, setFormatOpen] = useState(false)
	const [replaceRules, setReplaceRules] = useState(RULES)
	const [formatMode, setFormatMode] = useState<'text' | 'regex'>('text')

	const updateChapterMutation = useUpdateChapterByChapterNumberMutation()
	const createNewChapterMutation = useCreateNewChapterMutation()

	const navigate = useNavigate()

	const handleFormat = () => {
		const rules = replaceRules
			.split('\n')
			.map(line => line.trim())
			.filter(Boolean)

		if (rules.length === 0) {
			toast.error('Vui lòng nhập ít nhất một quy tắc')
			return
		}

		let result = content.trim()
		let totalReplaced = 0
		let invalidRules = 0

		for (const rule of rules) {
			const separatorIndex = rule.indexOf('=>')

			if (separatorIndex === -1) {
				invalidRules++
				continue
			}

			const pattern = rule.slice(0, separatorIndex).trim()
			const replacement = rule
				.slice(separatorIndex + 2)
				.trim()
				.replace(/\\n/g, '\n')
				.replace(/\\t/g, '\t')

			if (!pattern) continue

			try {
				if (formatMode === 'text') {
					const matches = result.split(pattern).length - 1

					totalReplaced += matches
					result = result.split(pattern).join(replacement)
				} else {
					const regex = new RegExp(pattern, 'g')
					const matches = result.match(regex)

					totalReplaced += matches?.length ?? 0
					result = result.replace(regex, replacement)
				}
			} catch {
				invalidRules++
			}
		}

		setContent(result)
		setSelectedCharacters(0)

		if (invalidRules > 0) {
			toast.warning(`Đã áp dụng ${rules.length - invalidRules}/${rules.length} quy tắc (${totalReplaced} lần thay thế)`)
		} else {
			toast.success(`Đã áp dụng ${rules.length} quy tắc (${totalReplaced} lần thay thế)`)
		}

		setFormatOpen(false)
		setReplaceRules('')
	}

	const onSubmit = async (e: SyntheticEvent) => {
		e.preventDefault()

		const num = Number.parseInt(chapterNumber, 10)

		if (Number.isNaN(num) || num < 1) {
			toast.error('Chapter number must be a positive integer')
			return
		}

		const payload = {
			novel_id: novelId,
			chapter_number: num,
			title: title.trim(),
			content,
			updated_at: new Date().toISOString(),
		}

		if (chapter) {
			await updateChapterMutation.mutateAsync({ novelId, chapterNumber: +chapterNumber, payload })

			if (updateChapterMutation.error) {
				toast.error(updateChapterMutation.error.message)
				return
			}

			toast.success('Chapter updated')
			navigate(-1)
		} else {
			await createNewChapterMutation.mutateAsync({ payload })

			if (createNewChapterMutation.error) {
				toast.error(createNewChapterMutation.error.message)
				return
			}

			toast.success('Chapter added')
			navigate(`/admin/novels/${novelId}`)
		}
	}

	return (
		<>
			<form
				onSubmit={onSubmit}
				className='flex flex-col gap-5'
			>
				<div className='grid gap-5 md:grid-cols-[140px_1fr]'>
					<div className='grid gap-2'>
						<Label htmlFor='num'>Chapter #</Label>
						<Input
							id='num'
							type='number'
							min={1}
							required
							value={chapterNumber}
							onChange={e => setChapterNumber(e.target.value)}
						/>
					</div>

					<div className='grid gap-2'>
						<Label htmlFor='title'>Title</Label>
						<Input
							id='title'
							required
							autoFocus
							placeholder='Enter chapter title'
							value={title}
							onChange={e => setTitle(e.target.value)}
						/>
					</div>
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='content'>Content</Label>

					<Textarea
						id='content'
						required
						value={content}
						onChange={e => {
							setContent(e.target.value)
							setSelectedCharacters(e.currentTarget.selectionEnd - e.currentTarget.selectionStart)
						}}
						onSelect={e => setSelectedCharacters(e.currentTarget.selectionEnd - e.currentTarget.selectionStart)}
						rows={20}
						className='max-h-dvh font-serif md:text-xl leading-relaxed'
						placeholder='Paste or write the chapter text here. Separate paragraphs with a blank line.'
					/>

					<div className='flex flex-wrap items-center justify-between gap-x-4 gap-y-1 text-xs text-muted-foreground'>
						<p>Separate paragraphs with a blank line — they will be rendered as separate paragraphs.</p>
						<p
							aria-live='polite'
							className='shrink-0 tabular-nums'
						>
							{content.length.toLocaleString()} characters · {selectedCharacters.toLocaleString()} selected
						</p>
					</div>
				</div>

				<div className='flex justify-end gap-2'>
					<Button
						type='button'
						variant='outline'
						onClick={() => navigate(-1)}
					>
						Cancel
					</Button>

					<Button
						type='button'
						variant='outline'
						onClick={() => setFormatOpen(true)}
					>
						Format
					</Button>

					<Button
						type='submit'
						disabled={updateChapterMutation.isPending || createNewChapterMutation.isPending}
					>
						{updateChapterMutation.isPending
							? 'Saving...'
							: createNewChapterMutation.isPending
								? 'Adding...'
								: chapter
									? 'Save changes'
									: 'Add chapter'}
					</Button>
				</div>
			</form>

			<Dialog
				open={formatOpen}
				onOpenChange={setFormatOpen}
			>
				<DialogContent className='sm:max-w-xl h-[90dvh] overflow-y-auto'>
					<DialogHeader>
						<DialogTitle>Batch Replace</DialogTitle>

						<DialogDescription>
							Mỗi dòng là một quy tắc theo dạng nguồn =&gt; thay thế.
							<br />
							Chọn Regex để dùng biểu thức chính quy hoặc Text để tìm đúng chuỗi văn bản.
							<br />
							<code>source =&gt; replacement</code>
							<br />
							<br />
							Ví dụ:
							<br />
							<code>\s+, =&gt; ,</code>
							<br />
							Sẽ biến:
							<br />
							<code>Xin chào , thế giới</code>
							<br />
							thành:
							<br />
							<code>Xin chào, thế giới</code>
						</DialogDescription>
					</DialogHeader>

					<RadioGroup
						value={formatMode}
						onValueChange={value => setFormatMode(value as 'text' | 'regex')}
						className='grid-cols-2 gap-2'
					>
						<label className='flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm has-checked:border-primary has-checked:bg-primary/5'>
							<RadioGroupItem value='text' />
							<span>
								<span className='block font-medium'>Text to text</span>
								<span className='text-xs text-muted-foreground'>Tìm đúng chuỗi</span>
							</span>
						</label>
						<label className='flex cursor-pointer items-center gap-2 rounded-md border p-3 text-sm has-checked:border-primary has-checked:bg-primary/5'>
							<RadioGroupItem value='regex' />
							<span>
								<span className='block font-medium'>Regex</span>
								<span className='text-xs text-muted-foreground'>Dùng mẫu nâng cao</span>
							</span>
						</label>
					</RadioGroup>

					<Textarea
						value={replaceRules}
						onChange={e => setReplaceRules(e.target.value)}
						rows={10}
						placeholder={`\\s+, => ,
\\s+\\. => .
\\s+\\? => ?
\\s+! => !
\\n{3,} => \\n\\n`}
						onKeyDown={e => {
							if (e.ctrlKey && e.key === 'Enter') {
								e.preventDefault()
								handleFormat()
							}
						}}
					/>

					<div className='rounded-md border bg-muted/50 p-3 text-xs'>
						<p className='font-medium'>
							{formatMode === 'text' ? 'Ví dụ thay thế văn bản:' : 'Ví dụ thường dùng cho Regex:'}
						</p>

						<pre className='mt-2 overflow-x-auto whitespace-pre-wrap font-mono'>
							{formatMode === 'text'
								? `Xin chào ,=>Xin chào,
old title=>new title
foo=>bar`
								: `\\s+,=>,
\\s+\\.=>.
\\s+\\?=>?
\\s+!=>!
								\\s{2,}=> 
\\n{3,}=>\\n\\n`}
						</pre>
					</div>

					{formatMode === 'regex' && (
						<Accordion
							type='single'
							collapsible={true}
						>
							<AccordionItem
								value='regex-cheatsheet'
								className='rounded-lg border'
							>
								<AccordionTrigger className='px-4'>Regex Cheatsheet</AccordionTrigger>

								<AccordionContent>
									<div className='overflow-x-auto'>
										<table className='w-full text-left text-xs'>
											<thead>
												<tr className='border-b'>
													<th className='p-2'>Regex</th>
													<th className='p-2'>Ý nghĩa</th>
													<th className='p-2'>Ví dụ</th>
												</tr>
											</thead>

											<tbody>
												<tr className='border-b'>
													<td className='p-2 font-mono'>\s+,</td>
													<td className='p-2'>Xóa khoảng trắng trước dấu phẩy</td>
													<td className='p-2 font-mono'>Xin chào , → Xin chào,</td>
												</tr>

												<tr className='border-b'>
													<td className='p-2 font-mono'>\s+\.</td>
													<td className='p-2'>Xóa khoảng trắng trước dấu chấm</td>
													<td className='p-2 font-mono'>Xin chào . → Xin chào.</td>
												</tr>

												<tr className='border-b'>
													<td className='p-2 font-mono'>\s+\?</td>
													<td className='p-2'>Xóa khoảng trắng trước dấu hỏi</td>
													<td className='p-2 font-mono'>Bạn khỏe không ? → Bạn khỏe không?</td>
												</tr>

												<tr className='border-b'>
													<td className='p-2 font-mono'>\s+!</td>
													<td className='p-2'>Xóa khoảng trắng trước dấu !</td>
													<td className='p-2 font-mono'>Thật sao ! → Thật sao!</td>
												</tr>

												<tr className='border-b'>
													<td className='p-2 font-mono'>\s{'{2,}'}</td>
													<td className='p-2'>Nhiều khoảng trắng liên tiếp</td>
													<td className='p-2 font-mono'>Hello_____world</td>
												</tr>

												<tr className='border-b'>
													<td className='p-2 font-mono'>\n{'{3,}'}</td>
													<td className='p-2'>3 dòng trống trở lên</td>
													<td className='p-2 font-mono'>Thu gọn thành 2 dòng</td>
												</tr>

												<tr>
													<td className='p-2 font-mono'>$1</td>
													<td className='p-2'>Capture Group đầu tiên</td>
													<td className='p-2 font-mono'>(.*?)=&gt;$1</td>
												</tr>
											</tbody>
										</table>
									</div>
								</AccordionContent>
							</AccordionItem>
						</Accordion>
					)}

					<DialogFooter>
						<Button
							variant='outline'
							onClick={() => setFormatOpen(false)}
						>
							Hủy
						</Button>

						<Button onClick={handleFormat}>Apply Rules</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	)
}

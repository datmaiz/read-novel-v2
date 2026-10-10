import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Upload, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { slugify, type Novel } from '@/lib/types'
import { useNavigate } from 'react-router'
import { supabase } from '@/lib/supabase/client'
import { insertNovel, updateNovel } from '@/lib/supabase/novel'
import { useQueryClient } from '@tanstack/react-query'
import { QUERY_KEYS } from '@/queries'

export function NovelForm({ novel }: { novel?: Novel }) {
	const fileInputRef = useRef<HTMLInputElement>(null)
	const [title, setTitle] = useState(novel?.title ?? '')
	const [slug, setSlug] = useState(novel?.slug ?? '')
	const [author, setAuthor] = useState(novel?.author ?? '')
	const [description, setDescription] = useState(novel?.description ?? '')
	const [coverUrl, setCoverUrl] = useState(novel?.cover_url ?? '')
	const [coverPreview, setCoverPreview] = useState<string | null>(novel?.cover_url ?? null)
	const [genres, setGenres] = useState((novel?.genres ?? []).join(', '))
	const [status, setStatus] = useState(novel?.status ?? 'ongoing')
	const [submitting, setSubmitting] = useState(false)
	const [uploading, setUploading] = useState(false)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const navigate = useNavigate()
	const client = useQueryClient()

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (!file) return

		// Validate file
		if (!file.type.startsWith('image/')) {
			toast.error('Please select an image file')
			return
		}

		if (file.size > 5 * 1024 * 1024) {
			toast.error('File size must be less than 5MB')
			return
		}

		// Create preview
		const reader = new FileReader()
		reader.onload = (event) => {
			setCoverPreview(event.target?.result as string)
		}
		reader.readAsDataURL(file)

		// Store file for later upload
		setSelectedFile(file)
		toast.success('Image selected. Click Save to upload and publish.')
	}

	const uploadCoverImage = async (): Promise<string | null> => {
		if (!selectedFile) return coverUrl || null

		setUploading(true)

		try {
			const formData = new FormData()
			formData.append('file', selectedFile)
			formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET)

			const response = await fetch(
				`https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
				{
					method: 'POST',
					body: formData,
				},
			)

			const data = await response.json()

			if (!response.ok) {
				throw new Error(data.error?.message || 'Upload failed')
			}

			toast.success('Image uploaded successfully')

			return data.secure_url
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Upload failed')
			throw error
		} finally {
			setUploading(false)

			if (fileInputRef.current) {
				fileInputRef.current.value = ''
			}
		}
	}

	const onSubmit = async (e: React.SyntheticEvent) => {
		e.preventDefault()
		setSubmitting(true)

		try {
			// Upload image if new file is selected
			let finalCoverUrl = coverUrl
			if (selectedFile) {
				finalCoverUrl = (await uploadCoverImage()) || ''
			}

			const finalSlug = slug.trim() ? slugify(slug) : slugify(title)
			const payload = {
				title: title.trim(),
				slug: finalSlug,
				author: author.trim() || null,
				description: description.trim() || null,
				cover_url: finalCoverUrl.trim() || null,
				genres: genres
					.split(',')
					.map((g) => g.trim())
					.filter(Boolean),
				status: status || 'ongoing',
				updated_at: new Date().toISOString(),
			}

			if (novel) {
				const { error } = await updateNovel({ payload, novelId: novel.id })
				if (error) {
					toast.error(error.message)
					return
				}
				client.invalidateQueries({ queryKey: QUERY_KEYS.getNovels })
				toast.success('Novel updated')
				setSelectedFile(null)
				navigate(-1)
				return
			}

			const { error } = await insertNovel({ payload })
			if (error) {
				toast.error(error.message)
				return
			}
			client.invalidateQueries({ queryKey: QUERY_KEYS.getNovels })
			toast.success('Novel created')
			setSelectedFile(null)
			navigate(-1)
		} catch (error) {
			toast.error(error instanceof Error ? error.message : 'Failed to save novel')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<form
			onSubmit={onSubmit}
			className='flex flex-col gap-5'
		>
			<div className='grid gap-2'>
				<Label htmlFor='title'>Title</Label>
				<Input
					id='title'
					required
					value={title}
					onChange={(e) => {
						setTitle(e.target.value)
						if (!novel) setSlug(slugify(e.target.value))
					}}
				/>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='slug'>Slug</Label>
				<Input
					id='slug'
					value={slug}
					onChange={(e) => setSlug(e.target.value)}
					placeholder='auto-generated-from-title'
				/>
				<p className='text-xs text-muted-foreground'>URL: /novels/{slug || 'your-slug'}</p>
			</div>
			<div className='grid gap-2 md:grid-cols-2 md:gap-5'>
				<div className='grid gap-2'>
					<Label htmlFor='author'>Author</Label>
					<Input
						id='author'
						value={author}
						onChange={(e) => setAuthor(e.target.value)}
					/>
				</div>
				<div className='grid gap-2'>
					<Label htmlFor='status'>Status</Label>
					<select
						id='status'
						className='h-9 rounded-md border border-input bg-transparent px-3 text-sm shadow-xs'
						value={status}
						onChange={(e) => setStatus(e.target.value)}
					>
						<option value='ongoing'>Ongoing</option>
						<option value='completed'>Completed</option>
						<option value='hiatus'>Hiatus</option>
					</select>
				</div>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='cover'>Cover image</Label>
				{coverPreview && (
					<div className='relative w-full max-w-xs'>
						<img
							src={coverPreview}
							alt='Cover preview'
							className='h-auto w-full rounded-lg border border-border object-cover'
						/>
						<button
							type='button'
							onClick={() => {
								setCoverPreview(null)
								setCoverUrl('')
								setSelectedFile(null)
								if (fileInputRef.current) {
									fileInputRef.current.value = ''
								}
							}}
							className='absolute -right-2 -top-2 rounded-full bg-destructive p-1 text-destructive-foreground hover:bg-destructive/90'
						>
							<X className='h-4 w-4' />
						</button>
					</div>
				)}
				<div className='flex gap-2'>
					<Input
						ref={fileInputRef}
						id='cover-upload'
						type='file'
						accept='image/*'
						onChange={handleFileChange}
						disabled={uploading}
						className='hidden'
					/>
					<Button
						type='button'
						variant='outline'
						onClick={() => fileInputRef.current?.click()}
						disabled={uploading || submitting}
						className='gap-2'
					>
						<Upload className='h-4 w-4' />
						Select image
					</Button>
				</div>
				<p className='text-xs text-muted-foreground'>Or paste URL below</p>
				<Input
					id='cover'
					value={coverUrl}
					onChange={(e) => {
						setCoverUrl(e.target.value)
						if (!e.target.value) setCoverPreview(null)
					}}
					placeholder='https://...'
					type='url'
				/>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='genres'>Genres</Label>
				<Input
					id='genres'
					value={genres}
					onChange={(e) => setGenres(e.target.value)}
					placeholder='fantasy, mystery, romance'
				/>
				<p className='text-xs text-muted-foreground'>Comma-separated</p>
			</div>
			<div className='grid gap-2'>
				<Label htmlFor='description'>Description</Label>
				<Textarea
					id='description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					rows={5}
					placeholder='A short summary of the novel'
					className='max-h-100 text-2xl'
				/>
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
					type='submit'
					disabled={submitting}
				>
					{submitting ? 'Saving...' : novel ? 'Save changes' : 'Create novel'}
				</Button>
			</div>
		</form>
	)
}

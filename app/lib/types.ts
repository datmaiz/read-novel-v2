export type Novel = {
  id: string
  title: string
  slug: string
  author: string | null
  description: string | null
  cover_url: string | null
  genres: string[] | null
  status: string | null
  created_at: string
  updated_at: string
}

export type User = {
  id: string
  email: string
  created_at: string
  updated_at: string
}

export type Chapter = {
  id: string
  novel_id: string
  chapter_number: number
  title: string
  content: string
  created_at: string
  updated_at: string
}

export type ChapterBookmark = {
  user_id: string
  chapter_id: string
  created_at: string
  updated_at: string
}

export type ReadingHistory = {
  user_id: string
  novel_id: string
  chapter_id: string
  progress: number
  last_read_at: string
}

const VIETNAMESE_MAP: Record<string, string> = {
  à: 'a',
  á: 'a',
  ả: 'a',
  ã: 'a',
  ạ: 'a',
  ă: 'a',
  ằ: 'a',
  ắ: 'a',
  ẳ: 'a',
  ẵ: 'a',
  ặ: 'a',
  â: 'a',
  ầ: 'a',
  ấ: 'a',
  ẩ: 'a',
  ẫ: 'a',
  ậ: 'a',
  è: 'e',
  é: 'e',
  ẻ: 'e',
  ẽ: 'e',
  ẹ: 'e',
  ê: 'e',
  ề: 'e',
  ế: 'e',
  ể: 'e',
  ễ: 'e',
  ệ: 'e',
  ì: 'i',
  í: 'i',
  ỉ: 'i',
  ĩ: 'i',
  ị: 'i',
  ò: 'o',
  ó: 'o',
  ỏ: 'o',
  õ: 'o',
  ọ: 'o',
  ô: 'o',
  ồ: 'o',
  ố: 'o',
  ổ: 'o',
  ỗ: 'o',
  ộ: 'o',
  ơ: 'o',
  ờ: 'o',
  ớ: 'o',
  ở: 'o',
  ỡ: 'o',
  ợ: 'o',
  ù: 'u',
  ú: 'u',
  ủ: 'u',
  ũ: 'u',
  ụ: 'u',
  ư: 'u',
  ừ: 'u',
  ứ: 'u',
  ử: 'u',
  ữ: 'u',
  ự: 'u',
  ỳ: 'y',
  ý: 'y',
  ỷ: 'y',
  ỹ: 'y',
  ỵ: 'y',
  đ: 'd',
}

const VIETNAMESE_REGEX = new RegExp(Object.keys(VIETNAMESE_MAP).join('|'), 'g')

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .replace(VIETNAMESE_REGEX, (char) => VIETNAMESE_MAP[char] ?? char)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

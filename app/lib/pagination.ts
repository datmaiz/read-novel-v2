/**
 * Generates pagination page numbers with smart ellipsis
 * Example: 20 total pages, current page 10
 * Returns: [1, 2, 3, null, 8, 9, 10, 11, 12, null, 18, 19, 20]
 * (null represents ellipsis)
 */
export function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
): (number | null)[] {
  if (totalPages <= 9) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const array = Array.from({ length: totalPages })

  const result: (number | null)[] = []

  array.forEach((_, i) => {
    const current = i + 1
    if (current <= 3 || current >= totalPages - 2) {
      return result.push(current)
    }
    if (
      current <= currentPage + siblingCount &&
      current >= currentPage - siblingCount
    ) {
      return result.push(current)
    }
    if (result[result.length - 1]) {
      return result.push(null)
    }
  })

  return result
}

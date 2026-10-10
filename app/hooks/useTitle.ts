import { useEffect } from 'react'

interface Props {
	title: string
}

export const useTitle = ({ title }: Props) => {
	useEffect(() => {
		document.title = title
	}, [title])
}

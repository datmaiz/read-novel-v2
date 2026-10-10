import { supabase } from './client'

export const getSession = async () => {
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  return { session, error }
}

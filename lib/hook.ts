
'use client'
import { useEffect, useState } from 'react'
import {supabase} from "@lib/superbase";
import {Session} from "@supabase/supabase-js";

export function useAuthSession() {
    const [session, setSession] = useState<Session | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession().then(({ data }) => {
            setSession(data.session)
            setLoading(false)
        })

        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })

        return () => authListener.subscription.unsubscribe()
    }, [])

    return { session, loading }
}

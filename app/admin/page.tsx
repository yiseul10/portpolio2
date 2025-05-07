'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Admin() {
    const router = useRouter()

    useEffect(() => {
        const key = new URLSearchParams(window.location.search).get('key')
        const validKey = process.env.NEXT_PUBLIC_MYKEY

        if (key !== validKey) {
            router.replace('/not-found')
        }
    }, [])

    return (
        <section>
            <h1 className="font-semibold text-2xl mb-8 tracking-tighter">Admin</h1>
        </section>
    )
}

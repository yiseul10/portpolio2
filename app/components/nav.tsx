'use client'
import Link from 'next/link'
import {Button} from "@/components/ui/button";
import { useEffect, useState } from 'react'

import type { Session } from '@supabase/supabase-js'
import {supabase} from "@lib/superbase";

const navItems = {
  '/': {
    name: 'Home',
    authOnly: false,
  },
  '/blog': {
    name: 'Blog',
    authOnly: false,
  },
  '/resume': {
    name: 'Resume',
    authOnly: true,
  },
}

export function Navbar() {
  const [session, setSession] = useState<Session | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return (
    <aside className="-ml-[8px] mb-16 tracking-tight print:hidden">
      <div className="lg:sticky lg:top-20">
        <nav
          className="flex flex-row justify-between relative px-0 pb-0 fade md:overflow-auto scroll-pr-6 md:relative"
          id="nav"
        >
          <div className="flex flex-row space-x-0 pr-10">
            {Object.entries(navItems).map(([path, { name, authOnly }]) => {
              if (authOnly && !session) return null
              return (
                <Link
                  key={path}
                  href={path}
                  className="transition-all hover:text-neutral-800 dark:hover:text-neutral-200 flex align-middle relative py-1 px-2 m-1"
                >
                 <span className="text-xs font-semibold tracking-wider text-neutral-800 dark:text-neutral-200">{name.toLocaleUpperCase()}</span>
                </Link>
              )
            })}
          </div>
          <div className="flex justify-end">
            {session ? (
              <Button variant="link" onClick={() => supabase.auth.signOut()}>
                <span className="text-xs">Logout</span>
              </Button>
            ) : (
              <Button variant="link">
                <Link href="/login">
                  <div className="text-xs">Login</div>
                </Link>
              </Button>
            )}
          </div>
        </nav>
      </div>
    </aside>
  )
}

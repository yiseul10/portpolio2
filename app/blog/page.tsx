'use client'
import { BlogPosts } from 'app/components/posts'

import {Button} from "@/components/ui/button";
import {Plus} from "lucide-react";
import {useAuthSession} from "@lib/hook";
import Link from "next/link";

export default function Page() {
 const { session, loading } = useAuthSession();

  return (
      <div className="flex w-full flex-col">
        <div className="flex items-center justify-between h-[80px] w-full">
          <h1 className="font-semibold text-3xl text-neutral-800">Blog</h1>
            {session &&
                <Button variant="secondary" size="icon">
                    <Link href="/blog/add"><Plus className="w-6 h-6 stroke-3 text-neutral-700"/></Link>
                </Button>
            }
        </div>
        <section>
          <BlogPosts  />
        </section>
      </div>
  )
}

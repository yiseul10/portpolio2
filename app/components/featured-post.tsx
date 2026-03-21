'use client'

import Link from 'next/link'
import { NetworkGraph } from '@/app/components/icons/network-graph'
import {useEffect, useState} from "react";
import {LinkedInIcon} from "@/app/components/icons/linkedin";
import {Mail} from "lucide-react";

export function FeaturedPost() {
    const [mousePosition, setMousePosition] = useState({
        x: 0,
        y: 0,
    });
    const [isHovering, setIsHovering] = useState(false);
    const [keywords, setKeywords] = useState<string[]>([]);

    useEffect(() => {
        const fetchKeywords = async () => {
            try {
                const res = await fetch('/api/resume')
                const { data } = await res.json()
                if (data?.keywords) {
                    setKeywords(data.keywords)
                }
            } catch (e) {
                console.error('Keywords fetch error:', e)
            }
        }
        fetchKeywords()
    }, []);

    const handleMouseMove = (
        e: React.MouseEvent<HTMLDivElement>,
    ) => {
        const rect = e.currentTarget.getBoundingClientRect();
        setMousePosition({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    };

  return (
    <div className="w-full relative">
      <div className="absolute right-0 top-0 bottom-0 w-[40%] md:w-[30%] flex items-center justify-end pr-6">
        <NetworkGraph className="max-w-[180px] w-full h-auto object-contain text-neutral-500 dark:text-neutral-600" />
      </div>

    <article
      className="w-full bg-[rgba(249,248,246,0.65)]/10 border border-[rgba(243,244,246,0.6)] shadow-sm backdrop-blur-[2px] dark:bg-[rgba(38,38,38,0.6)] dark:border-[rgba(63,63,70,0.4)] dark:shadow-[0_1px_4px_0_rgba(0,0,0,0.2)] rounded-xl p-6 relative overflow-hidden"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <div className="flex justify-between items-start relative z-10">
        <div className="w-[60%] md:w-[70%]">
          <h2 className="text-3xl font-bold  font-serif">
            <a href="mailto:yiseul10@gmail.com" className="hover:underline">
              Kim Yiseul
            </a>
          </h2>
            <span className="font-serif text-base text-neutral-700 mt-2">Frontend engineer · 4+ years · seoul</span>

          <p className={`my-1 leading-relaxed text-sm transition-colors duration-300 ${isHovering ? 'text-gray-950 dark:text-neutral-100' : 'text-gray-800 dark:text-neutral-300'}`}>
            사용자 중심의 확장 가능한 UI를 만듭니다.
            <br />
            문제의 본질을 빠르게 파악하고 비즈니스 가치로 이어지는 솔루션을 지향합니다.
          </p>
          {/*<span className={`text-[14px] leading-relaxed font-serif font-medium transition-colors duration-300 ${isHovering ? 'text-gray-700 dark:text-neutral-300' : 'text-gray-400 dark:text-neutral-500'}`}>*/}
          {/*  Building user-centered, scalable interfaces that drive business value.*/}
          {/*</span>*/}



            {/* keywords */}
            {keywords.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {keywords.map((kw, i) => (
                  <span
                    key={i}
                    className={`text-xs px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-400 transition-colors duration-500  hover:bg-neutral-200 `}
                  >
                    #{kw}
                  </span>
                ))}
              </div>
            )}

            {/* sns */}
            <div className="flex gap-1 mt-3 items-center">
            <a
                aria-label="LinkedIn"
                className=" text-gray-800 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
                rel="noopener noreferrer"
                target="_blank"
                href="https://www.linkedin.com/in/yiseul10"
            >
                <LinkedInIcon className="w-5 h-5" />
            </a>

                {/*<a href="mailto:yiseul10@gmail.com"*/}
                {/*   className=" text-gray-800 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"*/}
                {/*   >*/}
                {/*    <div className="flex items-center gap-1 h-[21px] px-1 rounded-[4px] bg-orange-300 hover:bg-orange-600">*/}
                {/*    <Mail className="w-4 h-4 stroke-2 text-white"/>*/}
                {/*    <span className="text-white text-xs font-bold">MAIL ME</span>*/}
                {/*    </div>*/}
                {/*  */}
                {/*</a>*/}
            </div>
        </div>
        <div className="absolute right-1 top-0 bottom-0 w-[40%] md:w-[30%] flex justify-end">
          <NetworkGraph className="max-w-[180px] w-full h-auto object-contain text-neutral-700 dark:text-neutral-600" />
        </div>
      </div>
      <div
        className="absolute inset-0 pointer-events-none rounded-xl z-20 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(250, 204, 21, 0.22), rgba(239, 228, 187, 0.2) 50%, transparent 70%)`,
        }}
      />
    </article>
    </div>
  )
}

import { LinkedInIcon } from '@/app/components/icons/linkedin'

export default function Footer() {
  return (
    <footer className="w-full  pt-8 flex flex-col items-center  text-neutral-500 dark:text-neutral-500 print:hidden">
      {/*<div*/}
      {/*  className=" rounded-sm mb-4 bg-gray-800 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"*/}

      {/*>*/}
      {/*    <div className="w-5 h-5 text-white font-black" >Y</div>*/}
      {/*</div>*/}
      <span className="pb-8 text-xs font-serif">
        © {new Date().getFullYear()} Yiseul. This blog is MIT licensed.
      </span>
    </footer>
  )
}

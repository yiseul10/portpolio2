import { LinkedInIcon } from '@/app/components/icons/linkedin'

export default function Footer() {
  return (
    <footer className="w-full  pt-8 flex flex-col items-center  text-gray-500 dark:text-neutral-500 print:hidden">
      <a
        aria-label="LinkedIn"
        className="mb-4 text-gray-800 dark:text-neutral-300 hover:text-black dark:hover:text-white transition-colors"
        rel="noopener noreferrer"
        target="_blank"
        href="https://www.linkedin.com/in/yiseul10"
      >
        <LinkedInIcon className="w-5 h-5" />
      </a>
      <span className="pb-8 text-sm">
        © {new Date().getFullYear()} Yiseul. This blog is MIT licensed.
      </span>
    </footer>
  )
}

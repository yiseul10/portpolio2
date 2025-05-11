import { Linkedin } from 'lucide-react'

function ArrowIcon() {
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="mb-20">
      <ul className="font-sm mt-8 flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
        {/*<li>*/}
        {/*  <a*/}
        {/*    className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"*/}
        {/*    rel="noopener noreferrer"*/}
        {/*    target="_blank"*/}
        {/*    href="https://github.com/vercel/next.js"*/}
        {/*  >*/}
        {/*    <ArrowIcon />*/}
        {/*    <p className="ml-2 h-7">github</p>*/}
        {/*  </a>*/}
        {/*</li>*/}
        <li>
          <a
            className="flex items-center transition-all hover:text-[#0077B5] text-neutral-600 dark:text-neutral-300"
            rel="noopener noreferrer"
            target="_blank"
            href="https://www.linkedin.com/in/yiseul10"
          >
            <div className="flex gap-2 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 fill-[#0077B5]" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.762 2.239 5 5 5h14c2.762 0 5-2.238 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76s.784-1.76 1.75-1.76 1.75.79 1.75 1.76-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.337-.026-3.065-1.867-3.065-1.868 0-2.154 1.46-2.154 2.965v5.7h-3v-10h2.885v1.367h.041c.402-.761 1.383-1.564 2.847-1.564 3.045 0 3.607 2.005 3.607 4.617v5.58z"/>
            </svg>
            </div>

          </a>
        </li>
      </ul>
      <p className="mt-8 text-neutral-500 dark:text-neutral-300 text-sm">
        © {new Date().getFullYear()} Yiseul. This blog is MIT licensed.
      </p>
    </footer>
  )
}

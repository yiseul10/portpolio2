import Image from 'next/image'

export function ChatAvatar() {
  return (
    <div className="w-8 h-8 bg-neutral-200/80 dark:bg-zinc-700 rounded-full flex-shrink-0 overflow-hidden flex items-center justify-center">
      <Image
        src="/images/avatar.png"
        alt="이슬"
        width={32}
        height={32}
        className="object-contain"
      />
    </div>
  )
}

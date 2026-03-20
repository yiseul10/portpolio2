import Link from 'next/link'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import { highlight } from 'sugar-high'
import React from 'react'

/** 연속 빈 줄(3개 이상 개행)을 <br/> 스페이서로 변환하여 의도한 간격 유지 */
function preserveSpacing(source: string): string {
  return source.replace(/\n{3,}/g, (match) => {
    const extraBreaks = match.length - 2
    const spacers = Array(extraBreaks).fill('<br/>').join('\n')
    return '\n\n' + spacers + '\n\n'
  })
}

function Table({ data }) {
  let headers = data.headers.map((header, index) => (
    <th key={index}>{header}</th>
  ))
  let rows = data.rows.map((row, index) => (
    <tr key={index}>
      {row.map((cell, cellIndex) => (
        <td key={cellIndex}>{cell}</td>
      ))}
    </tr>
  ))

  return (
    <table>
      <thead>
        <tr>{headers}</tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  )
}

function slugify(str) {
  return str
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/&/g, '-and-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}

function createHeading(level) {
  const Heading = ({ children }) => {
    let slug = slugify(String(children))
    return React.createElement(
      `h${level}`,
      { id: slug },
      [
        React.createElement('a', {
          href: `#${slug}`,
          key: `link-${slug}`,
          className: 'anchor',
        }),
      ],
      children
    )
  }
  Heading.displayName = `Heading${level}`
  return Heading
}

const components = {
  h1: createHeading(1),
  h2: createHeading(2),
  h3: createHeading(3),
  h4: createHeading(4),
  h5: createHeading(5),
  h6: createHeading(6),
  img: (props) => <Image alt={props.alt || ''} className="rounded-lg" width={800} height={450} {...props} />,
  a: ({ href, children, ...props }) => {
    if (!href) return <a {...props}>{children}</a>
    if (href.startsWith('/')) return <Link href={href} {...props}>{children}</Link>
    if (href.startsWith('#')) return <a href={href} {...props}>{children}</a>
    return <a href={href} target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
  },
  pre: ({ children, ...props }) => {
    const codeChild = React.Children.toArray(children).find(
      (child) => React.isValidElement(child) && (child as React.ReactElement<any>).props?.className?.startsWith('language-')
    )
    const lang = React.isValidElement(codeChild)
      ? ((codeChild as React.ReactElement<any>).props.className as string)?.replace('language-', '') || ''
      : ''
    return (
      <div className="code-block-wrapper">
        {lang && <div className="code-block-lang">{lang}</div>}
        <pre {...props}>{children}</pre>
      </div>
    )
  },
  code: ({ children, className, ...props }) => {
    const isInline = !className
    if (isInline) {
      return <code className="inline-code" {...props}>{children}</code>
    }
    const codeHTML = highlight(String(children).replace(/\n$/, ''))
    return <code className={className} dangerouslySetInnerHTML={{ __html: codeHTML }} {...props} />
  },
}

export function CustomMDX({ source, components: extraComponents }: { source: string, components?: Record<string, any> }) {
  const processed = preserveSpacing(source || '')
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{ ...components, ...(extraComponents || {}) } as any}
    >
      {processed}
    </ReactMarkdown>
  )
}

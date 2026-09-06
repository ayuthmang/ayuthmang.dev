import Link from 'next/link'
import React from 'react'
import MaxWidthWrapper from '../max-width-wrapper'
import { PROFILE_LINKS, ROUTES } from '@/constants'

const linkClassName =
  'rounded-sm transition-colors hover:text-foreground focus-visible:ring-ring focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none'

type FooterLinkProps = {
  href: string
  external?: boolean
  children: React.ReactNode
}

function FooterLink({ href, external = false, children }: FooterLinkProps) {
  if (external) {
    return (
      <a className={linkClassName} href={href} target="_blank" rel="noreferrer">
        {children}
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    )
  }

  return (
    <Link className={linkClassName} href={href}>
      {children}
    </Link>
  )
}

function Footer() {
  return (
    <MaxWidthWrapper>
      <footer className="text-muted-foreground border-border mt-16 border-t py-8 text-sm">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2022–present Ayuth Mangmesap. All rights reserved.</p>
          <nav aria-label="Footer">
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              <li>
                <FooterLink href={ROUTES.BLOG}>Blog</FooterLink>
              </li>
              <li>
                <FooterLink href={ROUTES.ABOUT}>About</FooterLink>
              </li>
              <li>
                <FooterLink href={ROUTES.FEED}>RSS</FooterLink>
              </li>
              <li aria-hidden className="text-border hidden sm:block">
                |
              </li>
              <li>
                <FooterLink external href={PROFILE_LINKS.GITHUB}>
                  GitHub
                </FooterLink>
              </li>
              <li>
                <FooterLink external href={PROFILE_LINKS.MEDIUM}>
                  Medium
                </FooterLink>
              </li>
              <li>
                <FooterLink external href={PROFILE_LINKS.DEV}>
                  DEV
                </FooterLink>
              </li>
              <li>
                <FooterLink external href={PROFILE_LINKS.LINKEDIN}>
                  LinkedIn
                </FooterLink>
              </li>
            </ul>
          </nav>
        </div>
      </footer>
    </MaxWidthWrapper>
  )
}

export default Footer

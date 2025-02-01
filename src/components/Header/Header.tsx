'use client'
import MaxWidthWrapper from '@/components/MaxWidthWrapper'
import MobileMenu from '@/components/MobileMenu'
import UnstyledButton from '@/components/UnstyledButton'
import VisuallyHidden from '@/components/VisuallyHidden'
import { PROFILE_LINKS } from '@/constants'
import { cn } from '@/utils'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { default as NextLink } from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import React from 'react'

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)

  return (
    <div className="z-1 sticky left-0 right-0 top-0 isolate">
      <MainHeader>
        <HomeLink href="/">AYUTH</HomeLink>
        <DesktopNav>
          <DesktopActions>
            <NavLink href="/about">About</NavLink>
          </DesktopActions>
          <Filler />
          <DesktopActions>
            <NavLink href={PROFILE_LINKS.GITHUB} target="_blank">
              GitHub
            </NavLink>
            <NavLink href={PROFILE_LINKS.MEDIUM} target="_blank">
              Medium
            </NavLink>
            <NavLink href={PROFILE_LINKS.DEV} target="_blank">
              Dev
            </NavLink>
          </DesktopActions>
        </DesktopNav>
        <MobileNav>
          <MobileMenu
            isOpen={showMobileMenu}
            onOpenChange={(open) => setShowMobileMenu(open)}
          >
            <UnstyledButton>
              <VisuallyHidden>Open menu</VisuallyHidden>
              <HamburgerMenuIcon width={24} height={24} />
            </UnstyledButton>
          </MobileMenu>
        </MobileNav>
      </MainHeader>
    </div>
  )
}

function MainHeader({
  children,
  ...props
}: React.ComponentPropsWithoutRef<'header'>) {
  return (
    <MaxWidthWrapper
      className="flex justify-between py-4 backdrop-blur md:items-center"
      {...props}
    >
      {children}
    </MaxWidthWrapper>
  )
}

function DesktopNav({ children }: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav className="hidden flex-1 items-center justify-between md:flex md:gap-6 md:pl-6">
      {children}
    </nav>
  )
}

function DesktopActions({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className="flex items-center gap-6">{children}</div>
}

function Filler({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className="flex-1">{children}</div>
}

function NavLink({
  children,
  href,
  ...props
}: React.ComponentProps<typeof NextLink>) {
  const pathname = usePathname()
  const isActive = pathname === href

  return (
    <NextLink
      className={cn(
        'cursor-pointer font-semibold text-gray-100 text-inherit opacity-75 transition-opacity duration-200 ease-in-out hover:opacity-100',
        { 'opacity-100': isActive },
      )}
      href={href}
      {...props}
    >
      {children}
    </NextLink>
  )
}

function HomeLink({
  children,
  ...props
}: React.ComponentProps<typeof NextLink>) {
  return (
    <NextLink className="font-header font-bold uppercase" {...props}>
      {children}
    </NextLink>
  )
}

function MobileNav({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className="block md:hidden">{children}</div>
}

export default Header

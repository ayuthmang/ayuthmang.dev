'use client'

import { default as NextLink } from 'next/link'
import React from 'react'
import Icon from '~/components/Icon'
import MobileMenu from '~/components/MobileMenu'
import MaxWidthWrapper from '~/components/MaxWidthWrapper'
import UnstyledButton from '~/components/UnstyledButton'
import VisuallyHidden from '~/components/VisuallyHidden'
import { PROFILE_LINKS } from '~/constants'

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)

  return (
    <Wrapper>
      <MainHeader>
        <HomeLink href="/">AYUTHMANG.DEV</HomeLink>
        <DesktopNav>
          <DesktopActions>
            <NavLink href="/about">About</NavLink>
          </DesktopActions>
          <Filler />
          <DesktopActions>
            <NavLink href={PROFILE_LINKS.GITHUB}>GitHub</NavLink>
            <NavLink href={PROFILE_LINKS.MEDIUM}>Medium</NavLink>
            <NavLink href={PROFILE_LINKS.DEV}>Dev</NavLink>
          </DesktopActions>
        </DesktopNav>
        <MobileNav>
          <MobileMenu
            isOpen={showMobileMenu}
            onOpenChange={(open) => setShowMobileMenu(open)}
          >
            <UnstyledButton>
              <VisuallyHidden>Open menu</VisuallyHidden>
              <Icon id="menu" size={24} />
            </UnstyledButton>
          </MobileMenu>
        </MobileNav>
      </MainHeader>
    </Wrapper>
  )
}

function Wrapper({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className="sticky left-0 right-0 top-0 font-sans">{children}</div>
}

function MainHeader({
  children,
  ...delegated
}: React.ComponentPropsWithoutRef<'header'>) {
  return (
    <MaxWidthWrapper
      className="flex justify-between py-4 backdrop-blur md:items-center"
      {...delegated}
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
  ...delegated
}: React.ComponentProps<typeof NextLink>) {
  return (
    <NextLink
      className="cursor-pointer font-semibold text-gray-100 text-inherit opacity-75 transition-opacity duration-200 ease-in-out hover:opacity-100"
      {...delegated}
    >
      {children}
    </NextLink>
  )
}

function HomeLink({
  children,
  ...delegated
}: React.ComponentProps<typeof NextLink>) {
  return (
    <NextLink className="font-bold uppercase" {...delegated}>
      {children}
    </NextLink>
  )
}

function MobileNav({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className="block md:hidden">{children}</div>
}

export default Header

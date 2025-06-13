'use client'

import NextLink from 'next/link'
import MobileMenu from '@/components/mobile-menu'
import MaxWidthWrapper from '@/components/max-width-wrapper'
import UnstyledButton from '@/components/unstyled-button'
import VisuallyHidden from '@/components/visually-hidden'
import { PROFILE_LINKS } from '@/constants'
import { cn } from '@/utils'
import { HamburgerMenuIcon } from '@radix-ui/react-icons'
import { usePathname } from 'next/navigation'
import React from 'react'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu'
import { ModeToggle } from '../mode-toggle'

export function Header() {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)

  return (
    <>
      <MainHeader>
        <HomeLink href="/">AYUTH</HomeLink>
        <DesktopNav>
          <DesktopActions>
            {/* <NavLink href="/about">About</NavLink> */}
            <BlogsNavMenu />
          </DesktopActions>
          <Filler />
          <DesktopActions>
            <ModeToggle />
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

      {/* Sticky Spacer */}
      <div className="h-(--navbar-height) block" />
    </>
  )
}

function MainHeader({
  children,
  ...props
}: React.ComponentPropsWithoutRef<'header'>) {
  return (
    <MaxWidthWrapper
      className="h-(--navbar-height) fixed left-0 right-0 top-0 isolate z-10 flex justify-between py-4 backdrop-blur md:items-center"
      {...props}
    >
      {children}
    </MaxWidthWrapper>
  )
}

function DesktopNav({ children }: React.ComponentPropsWithoutRef<'nav'>) {
  return (
    <nav className="hidden h-[--navbar-height] flex-1 items-center justify-between md:flex md:gap-6 md:pl-6">
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
    <NextLink
      className="font-header font-bold uppercase transition-all duration-300 ease-in-out hover:scale-110"
      {...props}
    >
      {children}
    </NextLink>
  )
}

export function BlogsNavMenu() {
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>Blogs</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[200px] gap-4">
              <li>
                <NavigationMenuLink asChild>
                  <NavLink
                    href={PROFILE_LINKS.GITHUB}
                    className="flex-row items-center gap-2"
                  >
                    <GitHubIcon />
                    GitHub
                  </NavLink>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <NavLink
                    href={PROFILE_LINKS.MEDIUM}
                    className="flex-row items-center gap-2"
                  >
                    <MediumIcon />
                    Medium
                  </NavLink>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <NavLink
                    href={PROFILE_LINKS.DEV}
                    className="flex-row items-center gap-2"
                  >
                    <DevIcon />
                    Dev
                  </NavLink>
                </NavigationMenuLink>
              </li>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  )
}

function MobileNav({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return <div className="block md:hidden">{children}</div>
}

function MediumIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={800}
      height={800}
      preserveAspectRatio="xMidYMid"
      viewBox="0 -55 256 256"
      {...props}
    >
      <path d="M72.2 0c39.877 0 72.2 32.549 72.2 72.696 0 40.148-32.326 72.694-72.2 72.694-39.872 0-72.2-32.546-72.2-72.694C0 32.55 32.325 0 72.2 0Zm115.3 4.258c19.938 0 36.101 30.638 36.101 68.438h.003c0 37.791-16.163 68.438-36.1 68.438-19.939 0-36.101-30.647-36.101-68.438 0-37.79 16.16-68.438 36.098-68.438Zm55.803 7.129c7.011 0 12.697 27.449 12.697 61.31 0 33.85-5.684 61.31-12.697 61.31-7.013 0-12.694-27.452-12.694-61.31 0-33.859 5.684-61.31 12.694-61.31Z" />
    </svg>
  )
}

function GitHubIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={800}
      height={800}
      viewBox="0 0 73 73"
      {...props}
    >
      <title>{'team-collaboration/version-control/github'}</title>
      <g fill="none" fillRule="nonzero" transform="translate(2 2)">
        <rect
          width={71}
          height={71}
          x={-1}
          y={-1}
          fill="#000"
          stroke="#000"
          strokeWidth={2}
          rx={14}
        />
        <path
          fill="#FFF"
          d="M58.307 21.428c-2.411-4.13-5.682-7.401-9.812-9.812C44.364 9.206 39.854 8 34.96 8c-4.891 0-9.402 1.205-13.533 3.616-4.13 2.41-7.401 5.681-9.812 9.812C9.206 25.56 8 30.07 8 34.961c0 5.875 1.714 11.158 5.143 15.85 3.429 4.693 7.858 7.94 13.287 9.742.632.117 1.1.035 1.405-.246.304-.28.456-.632.456-1.052l-.018-1.896a313.522 313.522 0 0 1-.018-3.124l-.807.14c-.515.094-1.164.134-1.949.123a14.845 14.845 0 0 1-2.44-.246 5.452 5.452 0 0 1-2.351-1.053 4.454 4.454 0 0 1-1.545-2.158l-.35-.808c-.235-.538-.603-1.135-1.107-1.79-.503-.656-1.012-1.1-1.527-1.334l-.245-.176a2.577 2.577 0 0 1-.457-.422 1.926 1.926 0 0 1-.315-.491c-.07-.164-.013-.299.175-.405.188-.105.526-.157 1.018-.157l.702.105c.468.094 1.047.374 1.738.843a5.666 5.666 0 0 1 1.702 1.825c.539.96 1.188 1.69 1.949 2.194.76.503 1.527.755 2.299.755s1.439-.059 2-.175a6.982 6.982 0 0 0 1.58-.527c.211-1.569.785-2.774 1.72-3.616-1.333-.14-2.533-.352-3.598-.632-1.064-.282-2.164-.738-3.3-1.37-1.135-.632-2.077-1.416-2.826-2.352-.748-.936-1.363-2.165-1.842-3.686-.48-1.522-.72-3.277-.72-5.266 0-2.832.925-5.243 2.774-7.232-.866-2.13-.785-4.517.245-7.161.679-.211 1.686-.053 3.02.473 1.333.527 2.31.978 2.93 1.352.621.374 1.118.691 1.493.948a24.928 24.928 0 0 1 6.74-.912c2.317 0 4.564.304 6.741.912l1.334-.842c.912-.562 1.99-1.077 3.23-1.545 1.24-.468 2.188-.597 2.844-.386 1.053 2.645 1.147 5.032.28 7.161 1.849 1.99 2.774 4.4 2.774 7.232 0 1.99-.24 3.75-.72 5.283-.48 1.534-1.099 2.762-1.86 3.687-.76.924-1.709 1.703-2.844 2.334-1.135.632-2.235 1.088-3.3 1.37-1.065.28-2.264.492-3.598.632 1.217 1.053 1.825 2.715 1.825 4.985v7.407c0 .42.146.772.44 1.052.292.28.754.363 1.386.246 5.43-1.802 9.86-5.05 13.288-9.742 3.428-4.692 5.142-9.975 5.142-15.85 0-4.89-1.207-9.401-3.616-13.532Z"
        />
      </g>
    </svg>
  )
}

function DevIcon(props: React.ComponentProps<'svg'>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" {...props}>
      <path d="M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z" />
    </svg>
  )
}

export default Header

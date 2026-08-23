import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import UnstyledButton from '@/components/unstyled-button'
import styles from './mobile-menu.module.css'
import clsx from 'clsx'
import { PROFILE_LINKS, ROUTES } from '@/constants'
import { Cross1Icon } from '@radix-ui/react-icons'
import { ModeToggle } from '../mode-toggle'
import NextLink from 'next/link'
import { GitHubIcon, MediumIcon, DevIcon } from '../header/header'

export type MobileMenuProps = {
  isOpen?: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export function MobileMenu({
  isOpen = false,
  onOpenChange,
  children,
}: MobileMenuProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-(--color-backdrop) opacity-25 backdrop-blur-sm">
          {children}
        </Dialog.Overlay>
        <div className="fixed inset-0 z-50 flex justify-end bg-(--color-backdrop)">
          <Content>
            <Dialog.Title className="sr-only">Mobile Menu</Dialog.Title>
            <Backdrop />
            <InnerWrapper>
              <Dialog.Close asChild>
                <CloseButton>
                  <Cross1Icon width={32} height={32} />
                </CloseButton>
              </Dialog.Close>
              <Filler />
              <Nav>
                <NavLink href="/" onClick={() => onOpenChange(false)}>Home</NavLink>
                <NavLink href={ROUTES.BLOG} onClick={() => onOpenChange(false)}>Blog</NavLink>
                <NavLink href={ROUTES.ABOUT} onClick={() => onOpenChange(false)}>About</NavLink>
              </Nav>
              <Filler />
              <div className="flex items-center justify-between border-t border-border pt-6">
                <div className="flex items-center gap-4">
                  <a
                    href={PROFILE_LINKS.GITHUB}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground transition-all duration-300 hover:text-foreground hover:-rotate-6 hover:scale-110"
                    aria-label="GitHub"
                  >
                    <GitHubIcon className="h-6 w-6 fill-current" />
                  </a>
                  <a
                    href={PROFILE_LINKS.MEDIUM}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground transition-all duration-300 hover:text-foreground hover:-rotate-6 hover:scale-110"
                    aria-label="Medium"
                  >
                    <MediumIcon className="h-6 w-6 fill-current" />
                  </a>
                  <a
                    href={PROFILE_LINKS.DEV}
                    target="_blank"
                    rel="noreferrer"
                    className="text-muted-foreground transition-all duration-300 hover:text-foreground hover:-rotate-6 hover:scale-110"
                    aria-label="Dev.to"
                  >
                    <DevIcon className="h-6 w-6 fill-current" />
                  </a>
                </div>
                <ModeToggle />
              </div>
            </InnerWrapper>
          </Content>
        </div>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Backdrop({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className={clsx(
        'absolute top-0 right-0 bottom-0 left-0 bg-(--color-background)',
      )}
      style={{
        animation: `${styles.fadeIn} 500ms`,
      }}
    >
      {children}
    </div>
  )
}

function Content({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <Dialog.Content
      className={clsx(
        'relative z-50 flex h-full w-[calc(300px+var(--overfill))] flex-col bg-background p-6',
      )}
      style={
        {
          '--overfill': '16px',
          animation: `${styles.slideIn} 500ms both cubic-bezier(0, 0.6, 0.32, 1.06)`,
          animationDelay: '200ms',
        } as React.CSSProperties
      }
    >
      {children}
    </Dialog.Content>
  )
}

function InnerWrapper({ children }: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div
      className="flex h-full flex-col"
      style={{
        animation: `${styles.fadeIn} 600ms both`,
        animationDelay: '400ms',
      }}
    >
      {children}
    </div>
  )
}

function Nav({ children }: React.ComponentPropsWithoutRef<'nav'>) {
  return <nav className="flex flex-col gap-6">{children}</nav>
}

function NavLink({
  children,
  href,
  onClick,
  ...delegated
}: Omit<React.ComponentPropsWithoutRef<typeof NextLink>, 'href'> & { href: string; onClick?: () => void }) {
  return (
    <NextLink
      href={href}
      onClick={onClick}
      className="text-4xl font-bold tracking-tight text-foreground/75 transition-colors duration-200 hover:text-foreground"
      {...delegated}
    >
      {children}
    </NextLink>
  )
}

function Filler() {
  return <div className="flex-1" />
}

function CloseButton({
  children,
  ...delegated
}: React.ComponentPropsWithoutRef<typeof UnstyledButton>) {
  return (
    <UnstyledButton
      className="absolute top-2.5 right-[var(--overfill)] p-4"
      {...delegated}
    >
      {children}
    </UnstyledButton>
  )
}

export default MobileMenu

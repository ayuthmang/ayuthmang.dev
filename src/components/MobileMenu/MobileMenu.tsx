import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import Icon from '~/components/Icon'
import UnstyledButton from '~/components/UnstyledButton'
import styles from './MobileMenu.module.css'
import clsx from 'clsx'
import { PROFILE_LINKS } from '~/constants'
import {Cross1Icon} from '@radix-ui/react-icons'

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
        <Dialog.Overlay className="fixed bottom-0 left-0 right-0 top-0 bg-[var(--color-backdrop)] opacity-25 backdrop-blur">
          {children}
        </Dialog.Overlay>
        <div className="fixed bottom-0 left-0 right-0 top-0 flex justify-end bg-[var(--color-backdrop)]">
          <Content>
            <Dialog.Title>Mobile Menu</Dialog.Title>
            <Backdrop />
            <InnerWrapper>
              <Dialog.Close asChild>
                <CloseButton>
                  <Cross1Icon width={32} height={32} />
                </CloseButton>
              </Dialog.Close>
              <Filler />
              <Nav>
                <NavLink href="/">Home</NavLink>
                <NavLink href={PROFILE_LINKS.GITHUB}>GitHub</NavLink>
                <NavLink href={PROFILE_LINKS.MEDIUM}>Medium</NavLink>
                <NavLink href={PROFILE_LINKS.DEV}>Dev</NavLink>
              </Nav>
              <Filler />
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
        'absolute bottom-0 left-0 right-0 top-0 bg-[var(--color-background)]',
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
        'relative flex h-full w-[calc(300px+var(--overfill))] flex-col bg-[color:var(--color-background)] p-6',
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
  return <nav className="flex flex-col gap-4">{children}</nav>
}

function NavLink({
  children,
  ...delegated
}: React.ComponentPropsWithoutRef<'a'>) {
  return (
    <a
      className="cursor-pointer font-semibold text-gray-100 text-inherit opacity-75 transition-opacity duration-200 ease-in-out hover:opacity-100"
      style={{
        transition: 'opacity 0.2s ease-in-out 0s',
      }}
      {...delegated}
    >
      {children}
    </a>
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
      className="absolute right-[var(--overfill)] top-2.5 p-4"
      {...delegated}
    >
      {children}
    </UnstyledButton>
  )
}

export default MobileMenu

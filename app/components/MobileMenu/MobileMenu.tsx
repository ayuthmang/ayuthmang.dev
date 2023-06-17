import * as Dialog from '@radix-ui/react-dialog'
import React from 'react'
import styled, { keyframes } from 'styled-components'
import Icon from '~/app/components/Icon'
import UnstyledButton from '~/app/components/UnstyledButton'

type MobileMenuProps = {
  isOpen?: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen = false,
  onOpenChange,
  children,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onOpenChange}>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Portal>
        <Overlay />
        <Wrapper>
          <Content>
            <Backdrop />
            <InnerWrapper>
              <Dialog.Close asChild>
                <CloseButton>
                  <Icon id="x" size={32} />
                </CloseButton>
              </Dialog.Close>
              <Filler />
              <Nav>
                <NavLink href="/">Home</NavLink>
                <NavLink href="/">GitHub</NavLink>
                <NavLink href="/">Medium</NavLink>
                <NavLink href="/">Dev</NavLink>
              </Nav>
              <Filler />
            </InnerWrapper>
          </Content>
        </Wrapper>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const slideIn = keyframes`
  from {
    transform: translate(100%);
  }
  to {
    transform: translate(0%);
  }
`

const Overlay = styled(Dialog.Overlay)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-backdrop);
  backdrop-filter: blur(5px);
  opacity: 0.25;
`

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-background);
  animation: ${fadeIn} 500ms;
`

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: flex-end;
  background: var(--color-backdrop);
  font-family: var(--font-family-header);
`

const Content = styled(Dialog.Content)`
  --overfill: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: calc(300px + var(--overfill));
  padding: 24px 32px;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${slideIn} 500ms both cubic-bezier(0, 0.6, 0.32, 1.06);
    animation-delay: 200ms;
  }
`

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: ${fadeIn} 600ms both;
  animation-delay: 400ms;
`

const Nav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const NavLink = styled.a`
  font-size: 1.125rem;
  font-weight: var(--font-weight-medium);
  text-decoration: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.75;
  transition: opacity 0.2s ease-in-out 0s;

  &:hover {
    opacity: 1;
  }
`

const Filler = styled.div`
  flex: 1;
`

const CloseButton = styled(UnstyledButton)`
  position: absolute;
  top: 10px;
  right: var(--overfill);
  padding: 16px;
`

export default MobileMenu

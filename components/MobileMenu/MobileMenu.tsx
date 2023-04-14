import React from 'react'
import styled, { keyframes } from 'styled-components'
import Icon from '../Icon'
import * as Dialog from '@radix-ui/react-dialog'
import UnstyledButton from 'components/UnstyledButton'

type MobileMenuProps = {
  isOpen?: boolean
  onDismiss: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({
  isOpen = false,
  onDismiss,
}) => {
  return (
    <Dialog.Root open={isOpen} onOpenChange={onDismiss}>
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
  animation: ${fadeIn} 500ms;
`

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: gray; // debug
`

const Wrapper = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  /* background: var(--color-backdrop,); */
  display: flex;
  justify-content: flex-end;
  animation: ${slideIn} 500ms;
`

const Content = styled.div`
  --overfill: 16px;
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  width: 300px;
  padding: 24px 32px;
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
  text-transform: uppercase;
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

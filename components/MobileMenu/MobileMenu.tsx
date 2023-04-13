import React from 'react'
import styled, { keyframes } from 'styled-components'
import { DialogOverlay, DialogContent } from '@reach/dialog'
import Icon from '../Icon'

type MobileMenuProps = {
  isOpen?: boolean
  onDismiss: () => void
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen = false, onDismiss }) => {
  return (
    <Wrapper isOpen={isOpen} onDismiss={onDismiss}>
      <InnerWrapper>
        <Icon id="x" size={32} />
      </InnerWrapper>
    </Wrapper>
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

const Wrapper = styled(DialogOverlay)`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: var(--color-backdrop);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: flex-end;
  animation: ${fadeIn} 500ms;
`

const Backdrop = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: peachpuff;
`

const InnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  animation: ${fadeIn} 600ms both;
  animation-delay: 400ms;
  margin: 16px;
`

export default MobileMenu

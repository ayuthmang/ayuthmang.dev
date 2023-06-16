import { NextPage } from 'next'
import { default as NextLink } from 'next/link'
import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { QUERIES } from '~/app/constants'
import Icon from '~/app/components/Icon'
import MobileMenu from '~/app/components/MobileMenu'
import MaxWidthWrapper from '~/app/components/MaxWidthWrapper'
import UnstyledButton from '~/app/components/UnstyledButton'
import VisuallyHidden from '~/app/components/VisuallyHidden'

const Header: NextPage = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <Wrapper>
      <MainHeader>
        <DesktopNav>
          <LeftNav>
            <HomeLink href="/">AYUTHMANG.DEV</HomeLink>
          </LeftNav>
          <RightNav>
            <NavLink href="https://github.com/ayuthmang">GitHub</NavLink>
            <NavLink href="https://medium.com/@ayuthmang">Medium</NavLink>
            <NavLink href="https://dev.to/ayuthmang">Dev</NavLink>
          </RightNav>
          <MobileNav>
            <MobileMenu
              isOpen={showMobileMenu}
              onOpenChange={(open) => setShowMobileMenu(open)}
            >
              <UnstyledButton onClick={() => setShowMobileMenu(true)}>
                <VisuallyHidden>Open menu</VisuallyHidden>
                <Icon id="menu" size={24} />
              </UnstyledButton>
            </MobileMenu>
          </MobileNav>
        </DesktopNav>
      </MainHeader>
    </Wrapper>
  )
}

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
  font-family: var(--font-family-header);
`

const MainHeader = styled(MaxWidthWrapper)`
  background: var(--background-color);
  padding-top: 16px;
  padding-bottom: 16px;
  backdrop-filter: blur(10px);
`

const DesktopNav = styled.nav`
  display: flex;
  justify-content: space-between;
`

const NavLink = styled(NextLink)`
  font-weight: var(--font-weight-semi-bold);
  text-decoration: none;
  cursor: pointer;
  color: inherit;
  opacity: 0.75;
  transition: opacity 0.2s ease-in-out 0s;

  &:hover {
    opacity: 1;
  }
`

const dropIn = keyframes`
  from {
    transform: rotate(-30deg) translateY(-100%);
    opacity: 0;
  }

  to {
    transform: rotate(0deg) translateY(0);
    opacity: 1;
  }
`

const blinkCaret = keyframes`
  from, to {
    border-inline-end: 0.1em solid var(--caret-color);
    border-color: transparent;
  }

  50% {
    border-color: var(--caret-color);
  }
`

const HomeLink = styled(NavLink)`
  --caret-color: var(--color-gray-100);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
  animation: ${dropIn} 2s, ${blinkCaret} 1s infinite 3s;

  @media (prefers-reduced-motion) {
    animation: none;
  }
`

const LeftNav = styled.div`
  display: flex;
  align-items: flex-start;
`

const RightNav = styled.div`
  display: flex;
  align-items: baseline;
  gap: 24px;

  @media ${QUERIES.phoneAndSmaller} {
    display: none;
  }
`

const MobileNav = styled.div`
  display: none;

  @media ${QUERIES.phoneAndSmaller} {
    display: block;
  }
`

export default Header

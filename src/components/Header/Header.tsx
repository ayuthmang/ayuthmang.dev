'use client'
import { default as NextLink } from 'next/link'
import React from 'react'
import styled from 'styled-components'
import { QUERIES } from '~/constants'
import Icon from '~/components/Icon'
import MobileMenu from '~/components/MobileMenu'
import MaxWidthWrapper from '~/components/MaxWidthWrapper'
import UnstyledButton from '~/components/UnstyledButton'
import VisuallyHidden from '~/components/VisuallyHidden'

const Header: React.FC = () => {
  const [showMobileMenu, setShowMobileMenu] = React.useState(false)

  return (
    <Wrapper>
      <MainHeader as="header">
        <HomeLink href="/">AYUTHMANG.DEV</HomeLink>
        <DesktopNav>
          <DesktopActions>
            <NavLink href="/about">About</NavLink>
          </DesktopActions>
          <Filler />
          <DesktopActions>
            <NavLink href="https://github.com/ayuthmang">GitHub</NavLink>
            <NavLink href="https://medium.com/@ayuthmang">Medium</NavLink>
            <NavLink href="https://dev.to/ayuthmang">Dev</NavLink>
          </DesktopActions>
        </DesktopNav>
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
      </MainHeader>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  font-family: var(--font-family-header);
`

const MainHeader = styled(MaxWidthWrapper)`
  display: flex;
  align-items: center;
  background: var(--background-color);
  padding-top: 16px;
  padding-bottom: 16px;
  backdrop-filter: blur(10px);

  @media ${QUERIES.phoneAndSmaller} {
    justify-content: space-between;
  }
`

const DesktopNav = styled.nav`
  display: flex;
  align-items: center;
  flex: 1;
  justify-content: space-between;
  gap: 24px;
  padding-left: 24px;

  @media ${QUERIES.phoneAndSmaller} {
    display: none;
  }
`

const DesktopActions = styled.div`
  display: flex;
  align-items: center;
  gap: 24px;
`

const Filler = styled.div`
  flex: 1;
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

const HomeLink = styled(NavLink)`
  --caret-color: var(--color-gray-100);
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
`

const RightNav = styled.div`
  display: flex;
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

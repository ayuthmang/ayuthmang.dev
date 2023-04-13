import { NextPage } from 'next'
import React, { useState } from 'react'
import styled from 'styled-components'
import { QUERIES } from '../../constants'
import Icon from '../Icon'
import MobileMenu from '../MobileMenu'
import { default as NextLink } from 'next/link'
import MaxWidthWrapper from '../MaxWidthWrapper'
import type {} from 'styled-components/cssprop'

const Header: NextPage = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  return (
    <Wrapper>
      <MainHeader>
        <DesktopNav>
          <HomeLink href="/">Ayuth</HomeLink>
          <RightNav>
            <NavLink href="https://github.com/ayuthmang">GitHub</NavLink>
            <NavLink href="https://medium.com/@ayuthmang">Medium</NavLink>
            <NavLink href="https://dev.to/ayuthmang">Dev</NavLink>
          </RightNav>
          <MobileNav>
            <UnstyledButton>
              <Icon id="menu" onClick={() => setShowMobileMenu(true)} />
            </UnstyledButton>
          </MobileNav>
        </DesktopNav>
        <MobileMenu
          isOpen={showMobileMenu}
          onDismiss={() => setShowMobileMenu(false)}
        />
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
`

const MainHeader = styled(MaxWidthWrapper)`
  background: rgba(21, 17, 24, 0.5);
  padding-top: 16px;
  padding-bottom: 16px;
  backdrop-filter: blur(10px);
`

const DesktopNav = styled.nav`
  display: flex;
  justify-content: space-between;
`

const NavLink = styled(NextLink)`
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
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
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

type UnstyledButtonProps = {
  display?: React.CSSProperties['display']
}
const UnstyledButton = styled.button<UnstyledButtonProps>`
  display: ${(props) => props.display || 'block'};
  margin: 0;
  padding: 0;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  font: inherit;
  color: inherit;

  &:focus {
    outline-offset: 2px;
  }

  &:focus:not(:focus-visible) {
    outline: none;
  }
`

export default Header

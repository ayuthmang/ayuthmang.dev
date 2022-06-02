import { NextPage } from 'next'
import Image from 'next/image'
import styled from 'styled-components'
import github from './svgs/github.svg'

const Header: NextPage = () => {
  return (
    <MaxWidthWrapper>
      <Wrapper>
        <LeftNav>
          <HomeLink>Ayuth</HomeLink>
        </LeftNav>

        <RightNav>
          <NavLink href="https://github.com/ayuthmang">GitHub</NavLink>
          <NavLink href="https://medium.com/@ayuthmang">Medium</NavLink>
        </RightNav>
      </Wrapper>
    </MaxWidthWrapper>
  )
}

const MaxWidthWrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  background: rgba(21, 17, 24, 0.5);
  backdrop-filter: blur(10px);
`

const Wrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;

  width: 100%;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 32px;
  padding-right: 32px;

  color: #ffffff;
  padding: 16px 32px;
`

const NavLink = styled.a`
  text-decoration: none;
  cursor: pointer;
  color: inherit;
`

const HomeLink = styled(NavLink)`
  font-weight: var(--font-weight-bold);
  text-transform: uppercase;
`

const LeftNav = styled.div`
  display: flex;
`

const RightNav = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`

export default Header

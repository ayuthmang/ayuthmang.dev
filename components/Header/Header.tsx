import { NextPage } from 'next'
import styled from 'styled-components'

const Header: NextPage = () => {
  return (
    <Wrapper>
      <InnerWrapper>
        <LeftNav>
          <HomeLink>Ayuth</HomeLink>
        </LeftNav>
        <RightNav>
          <NavLink href="https://github.com/ayuthmang">GitHub</NavLink>
          <NavLink href="https://medium.com/@ayuthmang">Medium</NavLink>
          <NavLink href="https://dev.to/ayuthmang">Dev</NavLink>
        </RightNav>
      </InnerWrapper>
    </Wrapper>
  )
}

const Wrapper = styled.header`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  background: rgba(21, 17, 24, 0.5);
  backdrop-filter: blur(10px);
  /* border-bottom: 1px solid gray; */
`

const InnerWrapper = styled.div`
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
  opacity: 0.75;
  transition: opacity 400ms ease 0s;

  &:hover {
    opacity: 1;
  }
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
  gap: 24px;
`

export default Header

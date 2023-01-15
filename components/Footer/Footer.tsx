import { NextPage } from 'next'
import styled from 'styled-components'
import MaxWidthWrapper from '../MaxWidthWrapper'

const Footer: NextPage = () => {
  return (
    <footer>
      <Wrapper>
        <div>© 2020-present Ayuth Mangmesap.</div>
        <div>All Rights Reserved.</div>
      </Wrapper>
    </footer>
  )
}

const Wrapper = styled(MaxWidthWrapper)`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
`

export default Footer

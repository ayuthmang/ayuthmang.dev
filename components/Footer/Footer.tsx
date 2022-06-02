import { NextPage } from 'next'
import styled from 'styled-components'

const Footer: NextPage = () => {
  return (
    <Wrapper>
      <div>© 2020-present Ayuth Mangmesap.</div>
      <div>All Rights Reserved.</div>
    </Wrapper>
  )
}

const Wrapper = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 32px;
`

export default Footer

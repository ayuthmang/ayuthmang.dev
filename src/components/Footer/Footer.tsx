'use client'
import styled from 'styled-components'
import MaxWidthWrapper from '../MaxWidthWrapper'

const Footer = () => {
  return (
    <Wrapper as="footer">
      <p>© 2020-present Ayuth Mangmesap.</p>
      <p>All Rights Reserved.</p>
    </Wrapper>
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

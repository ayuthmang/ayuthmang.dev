import React from 'react'
import styled from 'styled-components'

type TagProps = {}

function Tag({ children }: React.PropsWithChildren<TagProps>): JSX.Element {
  return <Wrapper>{children}</Wrapper>
}

const Wrapper = styled.span`
  display: inline-block;
  padding: 4px 8px;
  background: var(--color-gray-300);
  color: var(--color-gray-800);
  font-size: 0.875rem;
  font-weight: var(--font-weight-semi-bold);

  &:not(:last-of-type) {
    margin-right: 8px;
  }
`

export default Tag

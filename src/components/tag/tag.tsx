import React from 'react'
import styled from 'styled-components'

function Tag({ children }: { children: React.ReactNode }) {
  return <Wrapper className="whitespace-nowrap">{children}</Wrapper>
}

const Wrapper = styled.span`
  @apply font-semibold;
  display: inline-block;
  padding: 4px 12px;
  background: var(--color-gray-300);
  border-radius: 8px;
  color: var(--color-gray-800);
  font-size: 0.875rem;

  &:not(:last-of-type) {
    margin-right: 8px;
  }
`

export default Tag

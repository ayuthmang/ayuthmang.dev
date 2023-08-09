import React from 'react'
import styled from 'styled-components'
import MaxWidthWrapper from '~/components/MaxWidthWrapper'

const MainContent = ({ children }: { children: React.ReactNode }) => {
  return <Main>{children}</Main>
}

const Main = styled(MaxWidthWrapper)`
  /* isolation: isolate; */
`

export default MainContent

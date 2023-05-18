import React from 'react'
import styled from 'styled-components'
import MaxWidthWrapper from '~/components/MaxWidthWrapper'

type MainContentProps = React.PropsWithChildren<{}>

const MainContent = ({ children }: MainContentProps) => {
  return <Main as="main">{children}</Main>
}

const Main = styled(MaxWidthWrapper)``

export default MainContent

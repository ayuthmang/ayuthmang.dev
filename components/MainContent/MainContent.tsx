import MaxWidthWrapper from 'components/MaxWidthWrapper/MaxWidthWrapper'
import React from 'react'
import styled from 'styled-components'

const MainContent = ({ children }: React.PropsWithChildren<{}>) => {
  return <Main>{children}</Main>
}

const Main = styled(MaxWidthWrapper)``

export default MainContent

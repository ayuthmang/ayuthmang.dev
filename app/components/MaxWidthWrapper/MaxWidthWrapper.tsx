import styled from 'styled-components'
import { QUERIES } from '~/app/constants'

const MaxWidthWrapper = styled.div`
  width: 100%;
  max-width: 1100px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 32px;
  padding-right: 32px;

  @media (${QUERIES.phoneAndSmaller}) {
    padding-left: 16px;
    padding-right: 16px;
  }
`

export default MaxWidthWrapper

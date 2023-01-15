import Link from 'next/link'
import styled from 'styled-components'
import Footer from '../components/Footer'

function FourOFour() {
  return (
    <>
      <Wrapper>
        <EmojiText>{'(๑ > ᴗ < ๑)'}</EmojiText>
        <Text>Page does not exist</Text>
        <LinkText href="/">🛖 Bring me home</LinkText>
      </Wrapper>
    </>
  )
}

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
`

const EmojiText = styled.p`
  font-size: 13vw;
`

const Text = styled.p`
  font-size: 3vw;
`

const LinkText = styled(Link)`
  text-decoration: none;
  color: white;
  opacity: 0.75;
  transition: opacity 400ms ease 0s;
  font-size: 3vw;

  &:hover {
    text-decoration: underline;
    opacity: 1;
  }
`

export default FourOFour

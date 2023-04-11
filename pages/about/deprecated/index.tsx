import styled from 'styled-components'
import MaxWidthWrapper from 'components/MaxWidthWrapper'
import Head from 'next/head'
// import * as Exp from './experience.mdx'

// console.log(Exp.default)

const lorem =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo odio placeat suscipit asperiores illum vitae dolor itaque, excepturi alias omnis. Aliquam consequuntur fugiat architecto quas expedita quos ut rem quo.'

function Profile() {
  return (
    <Wrapper>
      <Head>
        <title>About me</title>
      </Head>
      {/* <SectionWrapper>
        <SectionTitleWrapper>
          <SectionTitle>👨‍💻 Experience</SectionTitle>
          <SectionSubtitle>My working experience</SectionSubtitle>
        </SectionTitleWrapper>
        <SectionContent> awkelfjlk</SectionContent>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitleWrapper>
          <SectionTitle>🎓 Education</SectionTitle>
          <SectionSubtitle>My education</SectionSubtitle>
        </SectionTitleWrapper>
        <SectionContent>{lorem}</SectionContent>
      </SectionWrapper>
      <SectionWrapper>
        <SectionTitleWrapper>
          <SectionTitle>🫶 Contribution</SectionTitle>
          <SectionSubtitle>Recent Contributions</SectionSubtitle>
        </SectionTitleWrapper>
        <SectionContent>
          <p style={{ marginBottom: '1.5rem' }}>
            I love the Open Source projects. The way I can contribute back to
            the community is by contributing Open Source projects back if
            possible.
          </p>
        </SectionContent>
      </SectionWrapper> */}

      <SectionWrapper>
        <SectionTitleWrapper>
          <SectionTitle>✏️ Projects</SectionTitle>
          <SectionSubtitle>Collection of my projects</SectionSubtitle>
        </SectionTitleWrapper>
        <SectionContent>ฟำดไฟำด</SectionContent>
      </SectionWrapper>
    </Wrapper>
  )
}

const Wrapper = styled(MaxWidthWrapper)`
  height: 100%;
`

const SectionWrapper = styled.div`
  display: flex;
  align-items: baseline;
  padding: 16px 32px;
  gap: 16px;

  &:last-of-type {
    margin-bottom: 100vh;
    /* background-color: red; */
  }

  /* debug */
  height: 75%;
`

const SectionTitleWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  min-width: 250px;
  position: sticky;
  top: 0;
`

const SectionTitle = styled.h2`
  margin-top: 0;
`
const SectionSubtitle = styled.p``
const SectionContent = styled.p`
  flex: 1;
`

const MyBlogs = styled``

export default Profile

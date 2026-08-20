import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql, withPrefix } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledAboutSection = styled.section`
  max-width: 900px;

  .inner {
    display: grid;
    grid-template-columns: 3fr 2fr;
    grid-gap: 50px;

    @media (max-width: 768px) {
      display: block;
    }
  }
`;

const StyledText = styled.div`
  ul.skills-list {
    display: grid;
    grid-template-columns: repeat(2, minmax(140px, 200px));
    grid-gap: 0 10px;
    padding: 0;
    margin: 20px 0 0 0;
    overflow: hidden;
    list-style: none;

    li {
      position: relative;
      margin-bottom: 10px;
      padding-left: 20px;
      font-family: var(--font-mono);
      font-size: var(--fz-xs);

      &:before {
        content: '▹';
        position: absolute;
        left: 0;
        color: var(--green);
        font-size: var(--fz-sm);
        line-height: 12px;
      }
    }
  }
`;

const StyledPic = styled.div`
  position: relative;
  max-width: 300px;

  @media (max-width: 768px) {
    margin: 50px auto 0;
    width: 70%;
  }

  .wrapper {
    ${({ theme }) => theme.mixins.boxShadow};
    display: block;
    position: relative;
    width: 100%;
    border-radius: var(--border-radius);
    background-color: var(--green);

    &:hover,
    &:focus {
      outline: 0;
      transform: translate(-4px, -4px);

      &:after {
        transform: translate(8px, 8px);
      }

      .img {
        filter: none;
        mix-blend-mode: normal;
      }
    }

    .img {
      display: block;
      width: 100%;
      height: auto;
      position: relative;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1);
      transition: var(--transition);
    }

    &:before,
    &:after {
      content: '';
      display: block;
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius);
      transition: var(--transition);
    }

    &:before {
      top: 0;
      left: 0;
      background-color: var(--navy);
      mix-blend-mode: screen;
    }

    &:after {
      border: 2px solid var(--green);
      top: 14px;
      left: 14px;
      z-index: -1;
    }
  }
`;

const prefixAssetPath = url => {
  if (!url) {
    return url;
  }

  const pathPrefix = withPrefix('/').replace(/\/$/, '');
  const isLocalRootPreview =
    typeof window !== 'undefined' && pathPrefix && !window.location.pathname.startsWith(pathPrefix);

  if (isLocalRootPreview && url.startsWith(`${pathPrefix}/static/`)) {
    return url.replace(pathPrefix, '');
  }

  return url.startsWith('/static/') ? withPrefix(url) : url;
};

const About = () => {
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  const data = useStaticQuery(graphql`
    {
      portrait: file(relativePath: { eq: "me.jpg" }) {
        publicURL
      }
    }
  `);
  const portrait = prefixAssetPath(data.portrait?.publicURL);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  const skills = [
    'Network Security',
    'System Administration',
    'Virtualization',
    'VLANs & VPNs',
    'Linux & Windows',
    'Risk & Compliance',
  ];

  return (
    <StyledAboutSection id="about" ref={revealContainer}>
      <h2 className="numbered-heading">About Me</h2>

      <div className="inner">
        <StyledText>
          <div>
            <p>
              Hello! I’m Edwin. I’m a Cybersecurity and Network Engineering student at Purdue
              University with an interest in network security, systems administration,
              infrastructure, and governance.
            </p>

            <p>
              Most of my experience comes from hands-on work across school, technical support,
              teaching, and project-based cybersecurity work. I’ve worked with{' '}
              <a href="https://sinapsis.tech" target="_blank" rel="noreferrer">
                a startup
              </a>
              ,{' '}
              <a href="https://www.purdue.edu" target="_blank" rel="noreferrer">
                a university
              </a>
              , and in{' '}
              <a
                href="https://polytechnic.purdue.edu/academics/computer-and-information-technology"
                target="_blank"
                rel="noreferrer">
                teaching and academic support
              </a>
              environments while building experience with security documentation, networking,
              systems, and technical problem solving.
            </p>

            <p>
              Right now, I’m focused on building a strong technical foundation across cybersecurity,
              networking, and systems administration while improving how I document, explain, and
              organize my work. My goal is to turn what I learn into practical projects that show
              real progress.
            </p>

            <p>Here are a few areas I’ve been working in recently:</p>
          </div>

          <ul className="skills-list">
            {skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </StyledText>

        <StyledPic>
          <div className="wrapper">
            <img src={portrait} className="img" alt="Portrait of Edwin Sixtos Ruiz" />
          </div>
        </StyledPic>
      </div>
    </StyledAboutSection>
  );
};

export default About;

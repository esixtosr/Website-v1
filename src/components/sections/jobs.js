import React, { useEffect, useRef } from 'react';
import { useStaticQuery, graphql } from 'gatsby';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { usePrefersReducedMotion } from '@hooks';

const StyledJobsSection = styled.section`
  max-width: 1000px;

  .inner {
    display: grid;
    gap: 18px;
  }
`;

const StyledJobCard = styled.article`
  position: relative;
  padding: 22px 24px 22px 28px;
  border-left: 2px solid var(--green);
  background-color: rgba(17, 34, 64, 0.35);
  border-radius: var(--border-radius);

  ul {
    ${({ theme }) => theme.mixins.fancyList};
    margin: 14px 0 0;
    font-size: var(--fz-md);

    li {
      margin-bottom: 8px;
      padding-left: 24px;
    }
  }

  h3 {
    margin: 0;
    font-size: clamp(var(--fz-lg), 2vw, var(--fz-xl));
    font-weight: 600;
    line-height: 1.3;

    .company {
      color: var(--green);
    }
  }

  .range {
    margin: 6px 0 0;
    color: var(--light-slate);
    font-family: var(--font-mono);
    font-size: var(--fz-xxs);
  }
`;

const StyledJobHeader = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  gap: 16px;
  align-items: baseline;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 8px;
  }
`;

const StyledJobMeta = styled.div`
  color: var(--light-slate);
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);
  text-align: right;
  white-space: nowrap;

  @media (max-width: 768px) {
    text-align: left;
    white-space: normal;
  }
`;

const StyledSkillTags = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  padding: 0;
  margin: 14px 0 0;
  list-style: none;
  font-family: var(--font-mono);
  font-size: var(--fz-xxs);

  li {
    margin: 0;
    padding-left: 0;
    color: var(--green);

    &:before {
      display: none;
    }
  }
`;

const Jobs = () => {
  const data = useStaticQuery(graphql`
    query {
      jobs: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/jobs/" } }
        sort: { fields: [frontmatter___date], order: DESC }
      ) {
        edges {
          node {
            frontmatter {
              title
              company
              location
              range
              url
              skills {
                name
                level
              }
            }
            html
          }
        }
      }
    }
  `);

  const jobsData = data.jobs.edges;
  const revealContainer = useRef(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealContainer.current, srConfig());
  }, [prefersReducedMotion]);

  return (
    <StyledJobsSection id="jobs" ref={revealContainer}>
      <h2 className="numbered-heading">Experience</h2>

      <div className="inner">
        {jobsData &&
          jobsData.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { title, url, company, location, range, skills } = frontmatter;

            return (
              <StyledJobCard key={i}>
                <StyledJobHeader>
                  <div>
                    <h3>
                      <span>{title}</span>
                      <span className="company">
                        &nbsp;@&nbsp;
                        <a href={url} className="inline-link" target="_blank" rel="noreferrer">
                          {company}
                        </a>
                      </span>
                    </h3>
                    <p className="range">{range}</p>
                  </div>

                  <StyledJobMeta>{location}</StyledJobMeta>
                </StyledJobHeader>

                <div dangerouslySetInnerHTML={{ __html: html }} />

                {skills && skills.length > 0 && (
                  <StyledSkillTags aria-label={`${title} key skills`}>
                    {skills.map(({ name }) => (
                      <li key={name}>{name}</li>
                    ))}
                  </StyledSkillTags>
                )}
              </StyledJobCard>
            );
          })}
      </div>
    </StyledJobsSection>
  );
};

export default Jobs;

import React, { useRef, useEffect, useState } from 'react';
import { graphql } from 'gatsby';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Layout } from '@components';
import { usePrefersReducedMotion } from '@hooks';

const StyledTableContainer = styled.div`
  margin: 100px -20px;

  @media (max-width: 768px) {
    margin: 50px -10px;
  }

  table {
    width: 100%;
    border-collapse: collapse;

    .hide-on-mobile {
      @media (max-width: 768px) {
        display: none;
      }
    }

    tbody tr {
      &:hover,
      &:focus {
        background-color: var(--light-navy);
      }

      &.year-divider {
        &:hover,
        &:focus {
          background-color: transparent;
        }

        td {
          padding-top: 48px;
          padding-bottom: 16px;
        }

        &:first-child td {
          padding-top: 10px;
        }
      }
    }

    .year-heading {
      display: flex;
      align-items: center;
      gap: 18px;
      color: var(--green);
      font-family: var(--font-mono);
      font-size: var(--fz-xl);
      line-height: 1;

      &:after {
        content: '';
        display: block;
        flex: 1;
        height: 1px;
        background-color: var(--lightest-navy);
      }
    }

    th,
    td {
      padding: 10px;
      text-align: left;

      &:first-child {
        padding-left: 20px;

        @media (max-width: 768px) {
          padding-left: 10px;
        }
      }
      &:last-child {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
        }
      }

      svg {
        width: 20px;
        height: 20px;
      }
    }

    tr {
      cursor: default;

      td:first-child {
        border-top-left-radius: var(--border-radius);
        border-bottom-left-radius: var(--border-radius);
      }
      td:last-child {
        border-top-right-radius: var(--border-radius);
        border-bottom-right-radius: var(--border-radius);
      }
    }

    td {
      &.year {
        padding-right: 20px;

        @media (max-width: 768px) {
          padding-right: 10px;
          font-size: var(--fz-sm);
        }
      }

      &.title {
        padding-top: 15px;
        padding-right: 20px;
        font-size: var(--fz-xl);
        line-height: 1.25;

        button {
          padding: 0;
          border: 0;
          color: var(--lightest-slate);
          background: transparent;
          font: inherit;
          font-weight: 600;
          line-height: inherit;
          text-align: left;
          cursor: pointer;
          transition: var(--transition);

          &:hover,
          &:focus {
            color: var(--green);
            outline: none;
          }

          &:focus-visible {
            outline: 2px solid rgba(100, 255, 218, 0.75);
            outline-offset: 5px;
            border-radius: 2px;
          }
        }
      }

      &.focus {
        font-size: var(--fz-lg);
        white-space: nowrap;
      }

      &.tech {
        font-size: var(--fz-xxs);
        font-family: var(--font-mono);
        line-height: 1.5;
        .separator {
          margin: 0 5px;
        }
        span {
          display: inline-block;
        }
      }
    }
  }
`;

const StyledArchiveDetail = styled.div`
  @keyframes detailEnter {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.98);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  position: fixed;
  inset: 0;
  z-index: 99;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px;
  background-color: rgba(2, 6, 23, 0.88);
  cursor: zoom-out;

  @media (max-width: 768px) {
    padding: 20px;
  }

  .detail-card {
    ${({ theme }) => theme.mixins.boxShadow};
    width: min(100%, 680px);
    max-height: min(760px, 85vh);
    overflow: auto;
    padding: clamp(28px, 5vw, 44px);
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    animation: detailEnter 180ms ease-out;
    cursor: default;
  }

  .detail-eyebrow {
    margin: 0 0 12px;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
  }

  .detail-title {
    margin: 0 0 18px;
    color: var(--lightest-slate);
    font-size: clamp(24px, 5vw, 32px);
  }

  .detail-description {
    color: var(--light-slate);
    font-size: var(--fz-lg);

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .detail-tech-list {
    display: flex;
    flex-wrap: wrap;
    gap: 10px 16px;
    padding: 0;
    margin: 24px 0 0;
    list-style: none;

    li {
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
    }
  }

  .detail-links {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-top: 30px;

    a,
    button {
      ${({ theme }) => theme.mixins.smallButton};
    }

    button {
      color: var(--green);
      cursor: pointer;
    }
  }

  .detail-close {
    ${({ theme }) => theme.mixins.smallButton};
    margin-top: 30px;
    color: var(--green);
    cursor: pointer;
  }
`;

const ArchivePage = ({ location, data }) => {
  const getTerm = ({ date, company, term }) => {
    if (term) {
      return term;
    }

    const month = new Date(date).getMonth() + 1;

    if (company === 'Personal Lab') {
      return 'Project';
    }

    if (month <= 5) {
      return 'Spring';
    }

    if (month <= 8) {
      return 'Summer';
    }

    return 'Fall';
  };
  const getTermRank = term => {
    const rank = {
      Spring: 1,
      Summer: 2,
      Fall: 3,
      Project: 4,
    };

    return rank[term] || 5;
  };
  const projects = [...data.allMarkdownRemark.edges].sort((a, b) => {
    const aFrontmatter = a.node.frontmatter;
    const bFrontmatter = b.node.frontmatter;
    const aYear = new Date(aFrontmatter.date).getFullYear();
    const bYear = new Date(bFrontmatter.date).getFullYear();

    if (aYear !== bYear) {
      return aYear - bYear;
    }

    const aTermRank = getTermRank(getTerm(aFrontmatter));
    const bTermRank = getTermRank(getTerm(bFrontmatter));

    if (aTermRank !== bTermRank) {
      return aTermRank - bTermRank;
    }

    return (aFrontmatter.order || 0) - (bFrontmatter.order || 0);
  });
  const [openProject, setOpenProject] = useState(null);
  const revealTitle = useRef(null);
  const revealTable = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealTable.current, srConfig(200, 0));
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 10)));
  }, []);

  const openProjectDetail = node => {
    const { frontmatter, html } = node;
    setOpenProject({
      ...frontmatter,
      html,
    });
  };

  return (
    <Layout location={location}>
      <Helmet title="Technical Learning Archive" />

      <main>
        <header ref={revealTitle}>
          <h1 className="big-heading">Technical Learning Archive</h1>
          <p className="subtitle">
            A timeline of Purdue CIT coursework, labs, and independent technical builds.
          </p>
        </header>

        <StyledTableContainer ref={revealTable}>
          <table>
            <thead>
              <tr>
                <th>Term</th>
                <th>Course / Build</th>
                <th className="hide-on-mobile">Focus Area</th>
                <th className="hide-on-mobile">Skills Practiced</th>
              </tr>
            </thead>
            <tbody>
              {projects.length > 0 &&
                projects.map(({ node }, i) => {
                  const { date, title, tech, company, focus } = node.frontmatter;
                  const projectYear = new Date(date).getFullYear();
                  const previousProject = projects[i - 1]?.node;
                  const previousYear = previousProject
                    ? new Date(previousProject.frontmatter.date).getFullYear()
                    : null;
                  const isNewYear = projectYear !== previousYear;
                  const term = getTerm(node.frontmatter);

                  return (
                    <React.Fragment key={title}>
                      {isNewYear && (
                        <tr className="year-divider">
                          <td colSpan="4">
                            <div className="year-heading">{projectYear}</div>
                          </td>
                        </tr>
                      )}

                      <tr ref={el => (revealProjects.current[i] = el)}>
                        <td className="overline year">{term}</td>

                        <td className="title">
                          <button
                            type="button"
                            aria-label={`Read more about ${title}`}
                            onClick={() => openProjectDetail(node)}>
                            {title}
                          </button>
                        </td>

                        <td className="focus hide-on-mobile">
                          {focus || company ? <span>{focus || company}</span> : <span>—</span>}
                        </td>

                        <td className="tech hide-on-mobile">
                          {tech?.length > 0 &&
                            tech.map((item, i) => (
                              <span key={i}>
                                {item}
                                {''}
                                {i !== tech.length - 1 && (
                                  <span className="separator">&middot;</span>
                                )}
                              </span>
                            ))}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                })}
            </tbody>
          </table>
        </StyledTableContainer>

        {openProject && (
          <StyledArchiveDetail
            role="presentation"
            onClick={event => {
              if (event.target === event.currentTarget) {
                setOpenProject(null);
              }
            }}
            onKeyDown={({ key }) => {
              if (key === 'Escape') {
                setOpenProject(null);
              }
            }}>
            <article
              className="detail-card"
              role="dialog"
              aria-modal="true"
              aria-labelledby="archive-detail-title">
              <p className="detail-eyebrow">{openProject.focus || openProject.company}</p>
              <h2 className="detail-title" id="archive-detail-title">
                {openProject.title}
              </h2>
              <div
                className="detail-description"
                dangerouslySetInnerHTML={{ __html: openProject.html }}
              />

              {openProject.tech && (
                <ul className="detail-tech-list">
                  {openProject.tech.map((tech, i) => (
                    <li key={i}>{tech}</li>
                  ))}
                </ul>
              )}

              <div className="detail-links">
                {openProject.github && (
                  <a href={openProject.github} target="_blank" rel="noreferrer">
                    GitHub
                  </a>
                )}
                {openProject.external && (
                  <a href={openProject.external} target="_blank" rel="noreferrer">
                    Visit
                  </a>
                )}
                <button type="button" onClick={() => setOpenProject(null)}>
                  Close
                </button>
              </div>
            </article>
          </StyledArchiveDetail>
        )}
      </main>
    </Layout>
  );
};
ArchivePage.propTypes = {
  location: PropTypes.object.isRequired,
  data: PropTypes.object.isRequired,
};

export default ArchivePage;

export const pageQuery = graphql`
  {
    allMarkdownRemark(
      filter: { fileAbsolutePath: { regex: "/content/projects/" } }
      sort: { fields: [frontmatter___date, frontmatter___order], order: [ASC, ASC] }
    ) {
      edges {
        node {
          frontmatter {
            date
            title
            tech
            company
            focus
            term
            order
            github
            external
          }
          html
        }
      }
    }
  }
`;

import React, { useState, useEffect, useRef } from 'react';
import { Link, useStaticQuery, graphql } from 'gatsby';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled from 'styled-components';
import { srConfig } from '@config';
import sr from '@utils/sr';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsSection = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;

  h2 {
    margin-bottom: 12px;
    font-size: clamp(24px, 5vw, var(--fz-heading));
  }

  .section-intro {
    max-width: 560px;
    margin: 0 0 18px;
    color: var(--slate);
    text-align: center;
    font-size: var(--fz-lg);
  }

  .archive-link {
    ${({ theme }) => theme.mixins.smallButton};
    margin-top: 4px;
  }

  .projects-grid {
    ${({ theme }) => theme.mixins.resetList};
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    grid-gap: 15px;
    position: relative;
    margin-top: 60px;

    @media (max-width: 1080px) {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    }
  }

  .more-button {
    ${({ theme }) => theme.mixins.button};
    margin: 80px auto 0;
  }
`;

const StyledProject = styled.li`
  position: relative;
  cursor: pointer;
  transition: var(--transition);

  @media (prefers-reduced-motion: no-preference) {
    &:hover,
    &:focus-within {
      .project-inner {
        transform: translateY(-7px);
      }
    }
  }

  &:hover,
  &:focus {
    .project-title {
      color: var(--green);
    }
  }

  &:focus {
    outline: 2px solid rgba(100, 255, 218, 0.75);
    outline-offset: 6px;
  }

  a {
    position: relative;
    z-index: 1;
  }

  .project-inner {
    ${({ theme }) => theme.mixins.boxShadow};
    ${({ theme }) => theme.mixins.flexBetween};
    flex-direction: column;
    align-items: flex-start;
    position: relative;
    height: 100%;
    padding: 2rem 1.75rem;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    transition: var(--transition);
    overflow: auto;
  }

  .project-top {
    ${({ theme }) => theme.mixins.flexBetween};
    margin-bottom: 35px;

    .folder {
      color: var(--green);

      svg {
        width: 40px;
        height: 40px;
      }
    }

    .project-links {
      display: flex;
      align-items: center;
      margin-right: -10px;
      color: var(--light-slate);

      a {
        ${({ theme }) => theme.mixins.flexCenter};
        padding: 5px 7px;

        &.external {
          svg {
            width: 22px;
            height: 22px;
            margin-top: -4px;
          }
        }

        svg {
          width: 20px;
          height: 20px;
        }
      }
    }
  }

  .project-title {
    margin: 0 0 10px;
    color: var(--lightest-slate);
    font-size: var(--fz-xxl);
    transition: var(--transition);
  }

  .project-description {
    color: var(--light-slate);
    font-size: 17px;

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }
  }

  .project-tech-list {
    display: flex;
    align-items: flex-end;
    flex-grow: 1;
    flex-wrap: wrap;
    padding: 0;
    margin: 20px 0 0 0;
    list-style: none;

    li {
      font-family: var(--font-mono);
      font-size: var(--fz-xxs);
      line-height: 1.75;

      &:not(:last-of-type) {
        margin-right: 15px;
      }
    }
  }
`;

const StyledProjectDetail = styled.div`
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
`;

const Projects = () => {
  const data = useStaticQuery(graphql`
    query {
      projects: allMarkdownRemark(
        filter: {
          fileAbsolutePath: { regex: "/content/projects/" }
          frontmatter: { showInProjects: { ne: false } }
        }
      ) {
        edges {
          node {
            frontmatter {
              title
              tech
              github
              external
              icon
              date
              order
              highlightOrder
            }
            excerpt(pruneLength: 155)
            html
          }
        }
      }
    }
  `);

  const [showMore, setShowMore] = useState(false);
  const [openProject, setOpenProject] = useState(null);
  const revealTitle = useRef(null);
  const revealArchiveLink = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    sr.reveal(revealArchiveLink.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  const GRID_LIMIT = 6;
  const projects = data.projects.edges
    .filter(({ node }) => node)
    .sort((a, b) => {
      const aFrontmatter = a.node.frontmatter;
      const bFrontmatter = b.node.frontmatter;
      const aOrder = aFrontmatter.highlightOrder || aFrontmatter.order || 999;
      const bOrder = bFrontmatter.highlightOrder || bFrontmatter.order || 999;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      return new Date(bFrontmatter.date) - new Date(aFrontmatter.date);
    });
  const firstSix = projects.slice(0, GRID_LIMIT);
  const projectsToShow = showMore ? projects : firstSix;

  const projectInner = node => {
    const { frontmatter, excerpt } = node;
    const { github, external, title, tech, icon } = frontmatter;

    return (
      <div className="project-inner">
        <header>
          <div className="project-top">
            <div className="folder">
              <Icon name={icon || 'Folder'} />
            </div>
            <div className="project-links">
              {github && (
                <a
                  href={github}
                  aria-label="GitHub Link"
                  target="_blank"
                  rel="noreferrer"
                  onClick={event => event.stopPropagation()}>
                  <Icon name="GitHub" />
                </a>
              )}
              {external && (
                <a
                  href={external}
                  aria-label="External Link"
                  className="external"
                  target="_blank"
                  rel="noreferrer"
                  onClick={event => event.stopPropagation()}>
                  <Icon name="External" />
                </a>
              )}
            </div>
          </div>

          <h3 className="project-title">{title}</h3>

          <p className="project-description">{excerpt}</p>
        </header>

        <footer>
          {tech && (
            <ul className="project-tech-list">
              {tech.map((tech, i) => (
                <li key={i}>{tech}</li>
              ))}
            </ul>
          )}
        </footer>
      </div>
    );
  };

  const openProjectDetail = node => {
    const { frontmatter, html } = node;
    setOpenProject({
      ...frontmatter,
      html,
    });
  };

  const handleProjectKeyDown = (event, node) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openProjectDetail(node);
    }
  };

  return (
    <StyledProjectsSection>
      <h2 ref={revealTitle}>Selected Learning Highlights</h2>
      <p className="section-intro">
        A few stronger highlights are shown here. The archive keeps the full coursework and build
        timeline.
      </p>

      <Link className="archive-link" to="/archive" ref={revealArchiveLink}>
        View Full Learning Archive
      </Link>

      <ul className="projects-grid">
        {prefersReducedMotion ? (
          <>
            {projectsToShow &&
              projectsToShow.map(({ node }, i) => (
                <StyledProject
                  key={i}
                  role="button"
                  tabIndex="0"
                  aria-label={`Read more about ${node.frontmatter.title}`}
                  onClick={() => openProjectDetail(node)}
                  onKeyDown={event => handleProjectKeyDown(event, node)}>
                  {projectInner(node)}
                </StyledProject>
              ))}
          </>
        ) : (
          <TransitionGroup component={null}>
            {projectsToShow &&
              projectsToShow.map(({ node }, i) => (
                <CSSTransition
                  key={i}
                  classNames="fadeup"
                  timeout={i >= GRID_LIMIT ? (i - GRID_LIMIT) * 300 : 300}
                  exit={false}>
                  <StyledProject
                    key={i}
                    role="button"
                    tabIndex="0"
                    aria-label={`Read more about ${node.frontmatter.title}`}
                    ref={el => (revealProjects.current[i] = el)}
                    onClick={() => openProjectDetail(node)}
                    onKeyDown={event => handleProjectKeyDown(event, node)}
                    style={{
                      transitionDelay: `${i >= GRID_LIMIT ? (i - GRID_LIMIT) * 100 : 0}ms`,
                    }}>
                    {projectInner(node)}
                  </StyledProject>
                </CSSTransition>
              ))}
          </TransitionGroup>
        )}
      </ul>

      <button className="more-button" onClick={() => setShowMore(!showMore)}>
        Show {showMore ? 'Less' : 'More'}
      </button>

      {openProject && (
        <StyledProjectDetail
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
            aria-labelledby="project-detail-title">
            <p className="detail-eyebrow">Learning highlight</p>
            <h3 className="detail-title" id="project-detail-title">
              {openProject.title}
            </h3>
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
        </StyledProjectDetail>
      )}
    </StyledProjectsSection>
  );
};

export default Projects;

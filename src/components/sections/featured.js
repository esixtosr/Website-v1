import React, { useEffect, useRef, useState } from 'react';
import { useStaticQuery, graphql, withPrefix } from 'gatsby';
import styled from 'styled-components';
import sr from '@utils/sr';
import { srConfig } from '@config';
import { Icon } from '@components/icons';
import { usePrefersReducedMotion } from '@hooks';

const StyledProjectsGrid = styled.ul`
  ${({ theme }) => theme.mixins.resetList};

  a {
    position: relative;
    z-index: 1;
  }
`;

const StyledProject = styled.li`
  position: relative;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(12, 1fr);
  align-items: center;

  @media (max-width: 768px) {
    ${({ theme }) => theme.mixins.boxShadow};
  }

  &:not(:last-of-type) {
    margin-bottom: 100px;

    @media (max-width: 768px) {
      margin-bottom: 70px;
    }

    @media (max-width: 480px) {
      margin-bottom: 30px;
    }
  }

  &:nth-of-type(odd) {
    .project-content {
      grid-column: 7 / -1;
      text-align: right;

      @media (max-width: 1080px) {
        grid-column: 5 / -1;
      }
      @media (max-width: 768px) {
        grid-column: 1 / -1;
        padding: 40px 40px 30px;
        text-align: left;
      }
      @media (max-width: 480px) {
        padding: 25px 25px 20px;
      }
    }
    .project-tech-list {
      justify-content: flex-end;

      @media (max-width: 768px) {
        justify-content: flex-start;
      }

      li {
        margin: 0 0 5px 20px;

        @media (max-width: 768px) {
          margin: 0 10px 5px 0;
        }
      }
    }
    .project-links {
      justify-content: flex-end;
      margin-left: 0;
      margin-right: -10px;

      @media (max-width: 768px) {
        justify-content: flex-start;
        margin-left: -10px;
        margin-right: 0;
      }
    }
    .project-image {
      grid-column: 1 / 8;

      @media (max-width: 768px) {
        grid-column: 1 / -1;
      }
    }
  }

  .project-content {
    position: relative;
    grid-column: 1 / 7;
    grid-row: 1 / -1;

    @media (max-width: 1080px) {
      grid-column: 1 / 9;
    }

    @media (max-width: 768px) {
      display: flex;
      flex-direction: column;
      justify-content: center;
      height: 100%;
      grid-column: 1 / -1;
      padding: 40px 40px 30px;
      z-index: 5;
    }

    @media (max-width: 480px) {
      padding: 30px 25px 20px;
    }
  }

  .project-overline {
    margin: 10px 0;
    color: var(--green);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    font-weight: 400;
  }

  .project-title {
    color: var(--lightest-slate);
    font-size: clamp(24px, 5vw, 28px);

    @media (min-width: 768px) {
      margin: 0 0 20px;
    }

    @media (max-width: 768px) {
      color: var(--white);

      a {
        position: static;

        &:before {
          content: '';
          display: block;
          position: absolute;
          z-index: 0;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
        }
      }
    }
  }

  .project-description {
    ${({ theme }) => theme.mixins.boxShadow};
    position: relative;
    z-index: 2;
    padding: 25px;
    border-radius: var(--border-radius);
    background-color: var(--light-navy);
    color: var(--light-slate);
    font-size: var(--fz-lg);

    @media (max-width: 768px) {
      padding: 20px 0;
      background-color: transparent;
      box-shadow: none;

      &:hover {
        box-shadow: none;
      }
    }

    a {
      ${({ theme }) => theme.mixins.inlineLink};
    }

    strong {
      color: var(--white);
      font-weight: normal;
    }
  }

  .project-tech-list {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    z-index: 2;
    margin: 25px 0 10px;
    padding: 0;
    list-style: none;

    li {
      margin: 0 20px 5px 0;
      color: var(--light-slate);
      font-family: var(--font-mono);
      font-size: var(--fz-xs);
      white-space: nowrap;
    }

    @media (max-width: 768px) {
      margin: 10px 0;

      li {
        margin: 0 10px 5px 0;
        color: var(--lightest-slate);
      }
    }
  }

  .project-links {
    display: flex;
    align-items: center;
    position: relative;
    margin-top: 10px;
    margin-left: -10px;
    color: var(--lightest-slate);

    a {
      ${({ theme }) => theme.mixins.flexCenter};
      padding: 10px;

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

    .cta {
      ${({ theme }) => theme.mixins.smallButton};
      margin: 10px;
    }
  }

  .project-image {
    ${({ theme }) => theme.mixins.boxShadow};
    grid-column: 6 / -1;
    grid-row: 1 / -1;
    position: relative;
    z-index: 1;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      height: 100%;
      opacity: 0.25;
    }

    a {
      width: 100%;
      height: 100%;
      background-color: var(--green);
      border-radius: var(--border-radius);
      vertical-align: middle;

      &:hover,
      &:focus {
        background: transparent;
        outline: 0;

        &:before,
        .img {
          background: transparent;
          filter: none;
        }
      }

      &:before {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 3;
        transition: var(--transition);
        background-color: var(--navy);
        mix-blend-mode: screen;
      }

      &:after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 4;
        border-radius: var(--border-radius);
        box-shadow: inset 0 0 0 1px var(--navy);
        pointer-events: none;
      }

      &.is-gif-previewing {
        display: block;
        overflow: hidden;
        background: transparent;

        &:before,
        &:after {
          opacity: 0;
        }
      }
    }

    .img {
      display: block;
      width: 100%;
      height: auto;
      border-radius: var(--border-radius);
      mix-blend-mode: multiply;
      filter: grayscale(100%) contrast(1) brightness(90%);

      @media (max-width: 768px) {
        object-fit: cover;
        width: auto;
        height: 100%;
        filter: grayscale(100%) contrast(1) brightness(50%);
      }
    }

    .gif-preview {
      position: absolute;
      inset: -12px;
      z-index: 2;
      width: calc(100% + 24px);
      height: calc(100% + 24px);
      max-width: none;
      max-height: none;
      object-fit: cover;
      object-position: center;
      border-radius: 0;
      mix-blend-mode: normal;
      filter: none;
    }
  }
`;

const StyledPreviewModal = styled.div`
  @keyframes previewEnter {
    from {
      opacity: 0;
      transform: translateY(18px) scale(0.96);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  inset: 0;
  z-index: 99;
  padding: 50px;
  background-color: rgba(2, 6, 23, 0.88);
  cursor: zoom-out;

  @media (max-width: 768px) {
    padding: 25px;
  }

  .modal-preview-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    max-width: min(92vw, 1200px);
    max-height: 85vh;
    margin: 0;
    padding: 0;
    border: 0;
    background: transparent;
    animation: previewEnter 200ms ease-out;
    cursor: pointer;
  }

  .modal-preview-button:focus {
    outline: 2px solid var(--green);
    outline-offset: 4px;
  }

  .modal-image {
    display: block;
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    border-radius: var(--border-radius);
    box-shadow: 0 20px 30px -15px var(--navy-shadow);
  }

  .modal-arrow {
    ${({ theme }) => theme.mixins.flexCenter};
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: clamp(42px, 5vw, 56px);
    height: clamp(42px, 5vw, 56px);
    padding: 0;
    border: 0;
    border-radius: 50%;
    background: transparent !important;
    box-shadow: none;
    color: var(--green);
    cursor: pointer;
    appearance: none;

    &:before,
    &:after {
      display: none;
    }

    svg {
      width: 100%;
      height: 100%;
      display: block;
      fill: none;
      transition: var(--transition);

      path {
        fill: none;
      }
    }

    &:hover,
    &:focus {
      color: var(--lightest-slate);
      outline: 0;
    }
  }

  .modal-arrow-left {
    left: clamp(16px, 4vw, 56px);
  }

  .modal-arrow-right {
    right: clamp(16px, 4vw, 56px);
  }

  @media (max-width: 768px) {
    .modal-arrow {
      top: auto;
      bottom: 25px;
      transform: none;
      width: 44px;
      height: 44px;
    }

    .modal-arrow-left {
      left: calc(50% - 56px);
    }

    .modal-arrow-right {
      right: calc(50% - 56px);
    }
  }
`;

const ArrowLeftIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 21a9 9 0 1 0 0 -18a9 9 0 0 0 0 18" />
    <path d="M8 12l4 4" />
    <path d="M8 12h8" />
    <path d="M12 8l-4 4" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true">
    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
    <path d="M12 3a9 9 0 1 0 0 18a9 9 0 0 0 0 -18" />
    <path d="M16 12l-4 -4" />
    <path d="M16 12h-8" />
    <path d="M12 16l4 -4" />
  </svg>
);

const getUniqueSlides = slides =>
  slides.filter(
    (slide, index) => slide?.src && slides.findIndex(item => item?.src === slide.src) === index,
  );

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

const Featured = () => {
  const [hoveredProject, setHoveredProject] = useState(null);
  const [hoveredSlideCount, setHoveredSlideCount] = useState(0);
  const [hoveredSlideIndex, setHoveredSlideIndex] = useState(0);
  const [openProject, setOpenProject] = useState(null);

  const data = useStaticQuery(graphql`
    {
      featured: allMarkdownRemark(
        filter: { fileAbsolutePath: { regex: "/content/featured/" } }
        sort: { fields: [frontmatter___date], order: ASC }
      ) {
        edges {
          node {
            frontmatter {
              title
              cover {
                publicURL
              }
              gif {
                publicURL
              }
              gallery {
                publicURL
              }
              tech
              github
              external
              cta
              featured
            }
            html
          }
        }
      }
    }
  `);

  const featuredProjects = data.featured.edges.filter(
    ({ node }) => node && node.frontmatter.featured !== false,
  );
  const revealTitle = useRef(null);
  const revealProjects = useRef([]);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    sr.reveal(revealTitle.current, srConfig());
    revealProjects.current.forEach((ref, i) => sr.reveal(ref, srConfig(i * 100)));
  }, []);

  useEffect(() => {
    if (!hoveredProject || hoveredSlideCount < 2) {
      return;
    }

    const interval = setInterval(() => {
      setHoveredSlideIndex(index => (index + 1) % hoveredSlideCount);
    }, 1200);

    return () => clearInterval(interval);
  }, [hoveredProject, hoveredSlideCount]);

  return (
    <section id="projects">
      <h2 className="numbered-heading" ref={revealTitle}>
        Some Things I’ve Built
      </h2>

      <StyledProjectsGrid>
        {featuredProjects &&
          featuredProjects.map(({ node }, i) => {
            const { frontmatter, html } = node;
            const { external, title, tech, github, cover, gif, gallery, cta } = frontmatter;
            const projectUrl = external || github || '#';
            const hasProjectUrl = projectUrl !== '#';
            const coverUrl = prefixAssetPath(cover?.publicURL);
            const gifUrl = prefixAssetPath(gif?.publicURL);
            const gallerySlides = (gallery || [])
              .filter(Boolean)
              .map(({ publicURL }) => ({
                src: prefixAssetPath(publicURL),
                alt: `${title} preview`,
              }))
              .filter(({ src }) => Boolean(src));
            const slides = getUniqueSlides([
              { src: coverUrl, alt: `${title} cover` },
              ...(gallerySlides || []),
              { src: gifUrl, alt: `${title} animated preview` },
            ]);
            const projectKey = `${title}-${i}`;
            const isGifHovered = hoveredProject === projectKey && gifUrl;
            const hoverGallerySlide =
              hoveredProject === projectKey && !gifUrl && gallerySlides?.length
                ? gallerySlides[hoveredSlideIndex % gallerySlides.length]
                : null;
            const isPreviewHovered = isGifHovered || hoverGallerySlide;

            const handleImageClick = event => {
              if (!slides.length) {
                return;
              }

              event.preventDefault();
              setOpenProject({
                title,
                destination: projectUrl,
                slides,
                activeSlide: gifUrl ? slides.findIndex(({ src }) => src === gifUrl) : 0,
              });
            };

            return (
              <StyledProject key={i} ref={el => (revealProjects.current[i] = el)}>
                <div className="project-content">
                  <div>
                    <p className="project-overline">Featured Project</p>

                    <h3 className="project-title">
                      {hasProjectUrl ? <a href={projectUrl}>{title}</a> : <span>{title}</span>}
                    </h3>

                    <div
                      className="project-description"
                      dangerouslySetInnerHTML={{ __html: html }}
                    />

                    {tech.length && (
                      <ul className="project-tech-list">
                        {tech.map((tech, i) => (
                          <li key={i}>{tech}</li>
                        ))}
                      </ul>
                    )}

                    <div className="project-links">
                      {cta && (
                        <a href={cta} aria-label="Course Link" className="cta">
                          Learn More
                        </a>
                      )}
                      {github && (
                        <a href={github} aria-label="GitHub Link">
                          <Icon name="GitHub" />
                        </a>
                      )}
                      {external && !cta && (
                        <a href={external} aria-label="External Link" className="external">
                          <Icon name="External" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="project-image">
                  <a
                    href={projectUrl}
                    className={isPreviewHovered ? 'is-gif-previewing' : undefined}
                    onClick={handleImageClick}
                    onMouseEnter={() => {
                      if (!gifUrl && !gallerySlides?.length) {
                        return;
                      }

                      setHoveredSlideIndex(0);
                      setHoveredSlideCount(gifUrl ? 0 : gallerySlides.length);
                      setHoveredProject(projectKey);
                    }}
                    onMouseLeave={() => {
                      setHoveredProject(null);
                      setHoveredSlideCount(0);
                      setHoveredSlideIndex(0);
                    }}>
                    <img src={coverUrl} alt={title} className="img" />
                    {isGifHovered && (
                      <img src={gifUrl} alt="" aria-hidden="true" className="img gif-preview" />
                    )}
                    {hoverGallerySlide && (
                      <img
                        src={hoverGallerySlide.src}
                        alt=""
                        aria-hidden="true"
                        className="img gif-preview"
                      />
                    )}
                  </a>
                </div>
              </StyledProject>
            );
          })}
      </StyledProjectsGrid>

      {openProject && (
        <StyledPreviewModal
          role="presentation"
          onClick={() => setOpenProject(null)}
          onKeyDown={({ key }) => {
            if (key === 'Escape') {
              setOpenProject(null);
            }
          }}>
          {openProject.slides.length > 1 && (
            <button
              type="button"
              className="modal-arrow modal-arrow-left"
              aria-label="Previous preview"
              onClick={event => {
                event.stopPropagation();
                setOpenProject(project => ({
                  ...project,
                  activeSlide:
                    (project.activeSlide - 1 + project.slides.length) % project.slides.length,
                }));
              }}>
              <ArrowLeftIcon />
            </button>
          )}

          <button
            type="button"
            className="modal-preview-button"
            aria-label={`Open ${openProject.title} project`}
            onClick={event => {
              event.stopPropagation();
              if (openProject.destination && openProject.destination !== '#') {
                window.open(openProject.destination, '_blank', 'noopener,noreferrer');
              }
            }}>
            <img
              src={openProject.slides[openProject.activeSlide].src}
              alt={openProject.slides[openProject.activeSlide].alt}
              className="modal-image"
            />
          </button>

          {openProject.slides.length > 1 && (
            <button
              type="button"
              className="modal-arrow modal-arrow-right"
              aria-label="Next preview"
              onClick={event => {
                event.stopPropagation();
                setOpenProject(project => ({
                  ...project,
                  activeSlide: (project.activeSlide + 1) % project.slides.length,
                }));
              }}>
              <ArrowRightIcon />
            </button>
          )}
        </StyledPreviewModal>
      )}
    </section>
  );
};

export default Featured;

import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'gatsby';
import PropTypes from 'prop-types';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import styled, { css } from 'styled-components';
import { navLinks } from '@config';
import { loaderDelay } from '@utils';
import { useScrollDirection, usePrefersReducedMotion } from '@hooks';
import { Menu } from '@components';
import { IconLogo, IconHex } from '@components/icons';

const StyledHeader = styled.header`
  ${({ theme }) => theme.mixins.flexBetween};
  position: fixed;
  top: 0;
  z-index: 11;
  padding: 0 50px;
  width: 100%;
  height: var(--nav-height);
  background-color: var(--background);
  filter: none !important;
  pointer-events: auto !important;
  user-select: auto !important;
  backdrop-filter: blur(10px);
  transition: var(--transition);

  @media (max-width: 1080px) {
    padding: 0 40px;
  }

  @media (max-width: 768px) {
    padding: 0 25px;
  }

  @media (prefers-reduced-motion: no-preference) {
    ${props =>
    props.scrollDirection === 'up' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(0);
        background-color: var(--background);
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};

    ${props =>
    props.scrollDirection === 'down' &&
      !props.scrolledToTop &&
      css`
        height: var(--nav-scroll-height);
        transform: translateY(calc(var(--nav-scroll-height) * -1));
        box-shadow: 0 10px 30px -10px var(--navy-shadow);
      `};
  }
`;

const StyledNav = styled.nav`
  position: relative;
  width: 100%;
  height: 100%;
  color: var(--text-heading);
  font-family: var(--font-mono);
  z-index: 12;

  .logo {
    ${({ theme }) => theme.mixins.flexCenter};
    position: absolute;
    left: 0;
    top: 50%;
    transform: translateY(-50%);

    a {
      color: var(--green);
      width: 42px;
      height: 42px;
      position: relative;
      z-index: 1;

      .hex-container {
        position: absolute;
        top: 0;
        left: 0;
        z-index: -1;

        @media (prefers-reduced-motion: no-preference) {
          transition: var(--transition);
        }
      }

      .logo-container {
        position: relative;
        z-index: 1;

        svg {
          fill: none;
          user-select: none;

          @media (prefers-reduced-motion: no-preference) {
            transition: var(--transition);
          }

          polygon {
            fill: var(--background);
          }
        }
      }

      &:hover,
      &:focus {
        outline: 0;
        transform: translate(-4px, -4px);

        .hex-container {
          transform: translate(4px, 3px);
        }
      }
    }
  }

  .mobile-menu-wrapper {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    align-items: center;
  }
`;

const StyledLinks = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;

  @media (max-width: 768px) {
    display: none;
  }

  ol {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
    margin: 0;
    list-style: none;

    li {
      margin: 0 14px;
      position: relative;
      font-size: var(--fz-sm);

      a {
        ${({ theme }) => theme.mixins.link};
        padding: 10px;
        color: var(--text-main);

        &:hover,
        &:focus {
          color: var(--green);
        }
      }
    }
  }

  .actions {
    position: absolute;
    right: 0;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
  }

  .theme-menu-wrapper {
    position: relative;
  }

  .theme-menu-button {
    ${({ theme }) => theme.mixins.smallButton};
    font-size: var(--fz-sm);
  }

  .theme-dropdown {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    min-width: 145px;
    padding: 5px;
    border-radius: var(--border-radius);
    background-color: var(--card-bg);
    box-shadow: 0 10px 30px -15px var(--navy-shadow);
    z-index: 20;
  }

  .theme-option {
    width: 100%;
    padding: 10px 14px;
    border: 0;
    background: transparent;
    color: var(--text-main);
    font-family: var(--font-mono);
    font-size: var(--fz-xs);
    text-align: left;
    border-radius: var(--border-radius);
    transition: var(--transition);

    &:hover,
    &:focus {
      background-color: var(--light-navy);
      color: var(--green);
    }

    &.active {
      color: var(--green);
      background-color: var(--green-tint);
    }
  }
`;

const Nav = ({ isHome }) => {
  const [isMounted, setIsMounted] = useState(!isHome);
  const scrollDirection = useScrollDirection('down');
  const [scrolledToTop, setScrolledToTop] = useState(true);
  const prefersReducedMotion = usePrefersReducedMotion();

  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [themeMode, setThemeMode] = useState('system');
  const themeMenuRef = useRef(null);

  const handleScroll = () => {
    if (typeof window !== 'undefined') {
      setScrolledToTop(window.pageYOffset < 50);
    }
  };

  const applyTheme = mode => {
    if (typeof window === 'undefined') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
    let resolvedTheme = 'dark';

    if (mode === 'light') {
      resolvedTheme = 'light';
    } else if (mode === 'dark') {
      resolvedTheme = 'dark';
    } else {
      resolvedTheme = mediaQuery.matches ? 'light' : 'dark';
    }

    document.documentElement.setAttribute('data-theme', resolvedTheme);
  };

  const handleThemeChange = mode => {
    if (typeof window === 'undefined') {
      return;
    }

    setThemeMode(mode);
    localStorage.setItem('theme-mode', mode);
    applyTheme(mode);
    setThemeMenuOpen(false);
  };

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const savedTheme = localStorage.getItem('theme-mode') || 'system';
    setThemeMode(savedTheme);
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');

    const handleSystemThemeChange = () => {
      const currentMode = localStorage.getItem('theme-mode') || 'system';
      if (currentMode === 'system') {
        applyTheme('system');
      }
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
      mediaQuery.addListener(handleSystemThemeChange);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener('change', handleSystemThemeChange);
      } else {
        mediaQuery.removeListener(handleSystemThemeChange);
      }
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = event => {
      if (themeMenuRef.current && !themeMenuRef.current.contains(event.target)) {
        setThemeMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const timeoutId = setTimeout(() => {
      setIsMounted(true);
    }, 100);

    window.addEventListener('scroll', handleScroll);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('scroll', handleScroll);
    };
  }, [prefersReducedMotion]);

  const timeout = isHome ? loaderDelay : 0;
  const fadeClass = isHome ? 'fade' : '';
  const fadeDownClass = isHome ? 'fadedown' : '';

  const Logo = (
    <div className="logo" tabIndex="-1">
      {isHome ? (
        <a href="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </a>
      ) : (
        <Link to="/" aria-label="home">
          <div className="hex-container">
            <IconHex />
          </div>
          <div className="logo-container">
            <IconLogo />
          </div>
        </Link>
      )}
    </div>
  );

  const ThemeMenu = (
    <div className="theme-menu-wrapper" ref={themeMenuRef}>
      <button
        className="theme-menu-button"
        type="button"
        onClick={() => setThemeMenuOpen(prev => !prev)}>
        Theme
      </button>

      {themeMenuOpen && (
        <div className="theme-dropdown">
          <button
            type="button"
            className={`theme-option ${themeMode === 'dark' ? 'active' : ''}`}
            onClick={() => handleThemeChange('dark')}>
            Dark
          </button>

          <button
            type="button"
            className={`theme-option ${themeMode === 'light' ? 'active' : ''}`}
            onClick={() => handleThemeChange('light')}>
            Light
          </button>

          <button
            type="button"
            className={`theme-option ${themeMode === 'system' ? 'active' : ''}`}
            onClick={() => handleThemeChange('system')}>
            System
          </button>
        </div>
      )}
    </div>
  );

  return (
    <StyledHeader scrollDirection={scrollDirection} scrolledToTop={scrolledToTop}>
      <StyledNav>
        {prefersReducedMotion ? (
          <>
            {Logo}

            <StyledLinks>
              <ol>
                {navLinks &&
                  navLinks.map(({ url, name }, i) => (
                    <li key={i}>
                      <Link to={url}>{name}</Link>
                    </li>
                  ))}
              </ol>

              <div className="actions">{ThemeMenu}</div>
            </StyledLinks>

            <div className="mobile-menu-wrapper">
              <Menu />
            </div>
          </>
        ) : (
          <>
            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <>{Logo}</>
                </CSSTransition>
              )}
            </TransitionGroup>

            <StyledLinks>
              <ol>
                <TransitionGroup component={null}>
                  {isMounted &&
                    navLinks &&
                    navLinks.map(({ url, name }, i) => (
                      <CSSTransition key={i} classNames={fadeDownClass} timeout={timeout}>
                        <li style={{ transitionDelay: `${isHome ? i * 100 : 0}ms` }}>
                          <Link to={url}>{name}</Link>
                        </li>
                      </CSSTransition>
                    ))}
                </TransitionGroup>
              </ol>

              <TransitionGroup component={null}>
                {isMounted && (
                  <CSSTransition classNames={fadeDownClass} timeout={timeout}>
                    <div
                      className="actions"
                      style={{ transitionDelay: `${isHome ? navLinks.length * 100 : 0}ms` }}>
                      {ThemeMenu}
                    </div>
                  </CSSTransition>
                )}
              </TransitionGroup>
            </StyledLinks>

            <TransitionGroup component={null}>
              {isMounted && (
                <CSSTransition classNames={fadeClass} timeout={timeout}>
                  <div className="mobile-menu-wrapper">
                    <Menu />
                  </div>
                </CSSTransition>
              )}
            </TransitionGroup>
          </>
        )}
      </StyledNav>
    </StyledHeader>
  );
};

Nav.propTypes = {
  isHome: PropTypes.bool,
};

export default Nav;

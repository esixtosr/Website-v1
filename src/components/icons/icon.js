import React from 'react';
import PropTypes from 'prop-types';

import IconAppStore from './appstore';
import IconBookmark from './bookmark';
import IconBraces from './braces';
import IconBug from './bug';
import IconCable from './cable';
import IconCloud from './cloud';
import IconCodepen from './codepen';
import IconCyber from './cyber';
import IconEthernetPort from './ethernetport';
import IconExternal from './external';
import IconFingerprintPattern from './fingerprintpattern';
import IconFolder from './folder';
import IconFork from './fork';
import IconGitHub from './github';
import IconGraduationCap from './graduationcap';
import IconHardDrive from './harddrive';
import IconInstagram from './instagram';
import IconLinkedin from './linkedin';
import IconLoader from './loader';
import IconLogo from './logo';
import IconNetwork from './network';
import IconPlayStore from './playstore';
import IconRouter from './router';
import IconServer from './server';
import IconShieldLock from './shieldlock';
import IconStar from './star';
import IconTerminal from './terminal';
import IconTwitter from './twitter';
import IconWaypoints from './waypoints';
import IconHex from './hex';

const Icon = ({ name }) => {
  switch (name) {
    case 'AppStore':
      return <IconAppStore />;
    case 'Bookmark':
      return <IconBookmark />;
    case 'Braces':
      return <IconBraces />;
    case 'Bug':
      return <IconBug />;
    case 'Cable':
      return <IconCable />;
    case 'Cloud':
      return <IconCloud />;
    case 'Codepen':
      return <IconCodepen />;
    case 'Cyber':
      return <IconCyber />;
    case 'EthernetPort':
      return <IconEthernetPort />;
    case 'External':
      return <IconExternal />;
    case 'FingerprintPattern':
      return <IconFingerprintPattern />;
    case 'Folder':
      return <IconFolder />;
    case 'Fork':
      return <IconFork />;
    case 'GitHub':
      return <IconGitHub />;
    case 'GraduationCap':
      return <IconGraduationCap />;
    case 'HardDrive':
      return <IconHardDrive />;
    case 'Hex':
      return <IconHex />;
    case 'Instagram':
      return <IconInstagram />;
    case 'Linkedin':
      return <IconLinkedin />;
    case 'Loader':
      return <IconLoader />;
    case 'Logo':
      return <IconLogo />;
    case 'Network':
      return <IconNetwork />;
    case 'PlayStore':
      return <IconPlayStore />;
    case 'Router':
      return <IconRouter />;
    case 'Server':
      return <IconServer />;
    case 'ShieldLock':
      return <IconShieldLock />;
    case 'Star':
      return <IconStar />;
    case 'Terminal':
      return <IconTerminal />;
    case 'Twitter':
      return <IconTwitter />;
    case 'Waypoints':
      return <IconWaypoints />;
    default:
      return <IconExternal />;
  }
};

Icon.propTypes = {
  name: PropTypes.string.isRequired,
};

export default Icon;

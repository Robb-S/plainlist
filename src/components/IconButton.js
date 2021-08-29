/**
 * Render an icon with a caption.  Call with a config object containing either a link
 * or a procudure to call.  Set caption='' to show only icon.  
 * 
 * For non-link icons, set width='wide' to produce an extra-wide icon with caption
 * all on one line, to save vertical space. Set disabled=true to display a greyed-out
 * version with onClick disabled.
 * 
 * Examples of config object:
 * 
 * const linkConfig1 = {
 *   caption: 'settings',
 *   title: 'go to settings page',
 *   iconType: 'settings',
 *   buttonLink: `/set/`,
 * };
 * const procConfig2 = {
 *   caption: 'add category',
 *   title: 'add a new category',
 *   iconType: 'add',
 *   callProc: setupAdd,
 *   disabled: false,
 *   width: 'wide',
 * };
 * <IconButton config={ myconfig } />
 */

import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';
import '../css/iconButton.css';
// import { GrDrag } from 'react-icons/gr';
import { VscCheck, VscCircleSlash, VscSettingsGear, VscEmptyWindow, VscEdit,
  VscReferences, VscSettings, VscTrash, VscHome, VscGripper, VscRefresh,
  VscQuestion } from 'react-icons/vsc';
import { FiLogIn, FiLogOut, FiUserPlus } from 'react-icons/fi';
import { CgMoreR } from 'react-icons/cg';
import { GiSpinalCoil } from 'react-icons/gi';


const IconButton = ({ config }) => {
  const { caption, title, iconType, buttonLink, callProc, width, disabled } = config;
  const iconCaption = caption==null ? '' : caption;
  const iconTitle = title==null ? caption : title;
  const iconDisabled = disabled==null ? false : disabled;
  const isLinkButton = buttonLink!=null; // catches null or undefined

  const getIbClass = () => {
    let ibClass;
    if (width==='wide') {
      ibClass='iconButtonWide';
    } else if (iconCaption==='') {
      ibClass='iconButtonNarrow';
    } else {
      ibClass='iconButton';
    }
    if (iconDisabled) {
      ibClass = ibClass + ' iconButtonDisabled';
    }
    return ibClass;
  };

  let TheIcon;
  switch (iconType) {
    case 'spin':
      TheIcon=GiSpinalCoil; break;
    case 'add':
      TheIcon=VscEmptyWindow; break;
    case 'cancel':
      TheIcon=VscCircleSlash; break;
    case 'confirm':
      TheIcon=VscCheck; break;
    case 'delete':
      TheIcon=VscTrash; break;
    case 'help':
      TheIcon=VscQuestion; break;
    case 'edit':
      TheIcon=VscEdit; break;
    case 'login':
      TheIcon=FiLogIn; break;
    case 'logout':
      TheIcon=FiLogOut; break;
    case 'logout':
      TheIcon=FiUserPlus; break;
    case 'more':
      TheIcon=CgMoreR; break;
    case 'move':
      TheIcon=VscReferences; break;
    case 'refresh':
      TheIcon=VscRefresh; break;
    case 'settings':
      TheIcon=VscSettingsGear; break;
    case 'genSet':
      TheIcon=VscSettings; break;
    case 'top':
      TheIcon=VscHome; break;
    default:
      throw 'bad call to IconButton';
  }

  /**
   * show button in lighter grey, leave out title and onClick(), cursor='not-allowed'
   */
  const makeDisabledButton = () => {
    return (
      <div className={ getIbClass() } >
        <div className='theIcon'><TheIcon size='24' color='#bbbbbb' /></div>
        <div className='iconCaption iconCaptionDisabled'> {iconCaption} </div>
      </div>
    );
  };

  const makeEnabledButton = () => {
    return (
      <div className={ getIbClass() }  onClick={ () => callProc() } title={ iconTitle } >
        <div className='theIcon'><TheIcon size='24' color='#555555' /></div>
        <div className='iconCaption'> {iconCaption} </div>
      </div>
    );
  };

  const makeLinkButton = () => {
    return (
      <div className={ getIbClass() } title={ iconTitle }>
      <Link className='iconButtonLink' to={ buttonLink }>
        <TheIcon size='24' color='#555555' />
      </Link>
      <Link className='iconButtonLink' to={ buttonLink }>
        <div className='iconLinkCaption'> {iconCaption} </div>
      </Link>
    </div>
    );
  };

  return (
    <Fragment>
      { isLinkButton && makeLinkButton() }
      { !isLinkButton && iconDisabled && makeDisabledButton() }
      { !isLinkButton && !iconDisabled && makeEnabledButton() }
    </Fragment>
  );
};

const MakeSettingsButton = ( caption='' ) => {
  const settingsConfig = {
    caption: caption,
    title: 'go to settings page',
    iconType: 'settings',
    buttonLink: `/set/`,
  };
  return (
    <IconButton config={ settingsConfig } />
  );
};

const MakeSpinButton = ( caption='' ) => {
  const theConfig = {
    caption: caption,
    title: 'go for a spin',
    iconType: 'spin',
    buttonLink: `/load/`,
  };
  return (
    <IconButton config={ theConfig } />
  );
};

const MakeHomeButton = ( caption='' ) => {
  const theConfig = {
    caption: caption,
    title: 'go to top page',
    iconType: 'top',
    buttonLink: `/`,
  };
  return (
    <IconButton config={ theConfig } />
  );
};

const MakeHelpButton = ( caption='' ) => {
  const theConfig = {
    caption: caption,
    title: 'about',
    iconType: 'help',
    buttonLink: `/about/`,
  };
  return (
    <IconButton config={ theConfig } />
  );
};

const MakeDragIcon = () => {
  return (
    <VscGripper title='drag to change order' size='16' color='#888888' />
  );
};

export { IconButton, MakeSettingsButton, MakeHomeButton, MakeDragIcon,
  MakeHelpButton, MakeSpinButton };

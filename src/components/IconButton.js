/**
 * Render an icon with a caption.  Call with a config object containing either a link
 * or a procudure to call.  Set caption='' to show only icon.  Examples of config object:
 * 
 * const linkConfig1 = {
 *  caption: 'settings',
 *  title: 'go to settings page',
 *  iconType: 'settings',
 *  buttonLink: `/set/`,
 * };
 * const procConfig2 = {
 *   caption: 'add category',
 *   title: 'add a new category',
 *   iconType: 'add',
 *   callProc: setupAdd,
 * };
 */

import React from 'react';
import { Link } from 'react-router-dom';
import '../css/iconButton.css';
// import { GrDrag } from 'react-icons/gr';
import { VscCheck, VscCircleSlash, VscSettingsGear, VscEmptyWindow, VscEdit, VscReferences,
  VscTrash, VscHome, VscGripper } from 'react-icons/vsc';
import { FiLogIn, FiLogOut } from 'react-icons/fi';
const IconButton = ({ config }) => {
  const { caption, title, iconType, buttonLink, callProc, width } = config;
  const iconCaption = caption==null ? '' : caption;
  const iconTitle = title==null ? caption : title;
  const isLinkButton = buttonLink!=null; // catches null or undefined
  let ibClass = iconCaption==='' ? 'iconButtonNarrow' : 'iconButton';
  if (width==='wide') { ibClass='iconButtonWide'; }

  let TheIcon;
  switch (iconType) {
    case 'settings':
      TheIcon=VscSettingsGear;
      break;
    case 'top':
      TheIcon=VscHome;
      break;
    case 'add':
      TheIcon=VscEmptyWindow;
      break;
    case 'edit':
      TheIcon=VscEdit;
      break;
    case 'move':
      TheIcon=VscReferences;
      break;
    case 'confirm':
      TheIcon=VscCheck;
      break;
    case 'cancel':
      TheIcon=VscCircleSlash;
      break;
    case 'delete':
      TheIcon=VscTrash;
      break;
    case 'login':
      TheIcon=FiLogIn;
      break;
    case 'logout':
      TheIcon=FiLogOut;
      break;
    default:
      throw 'bad call to IconButton';
  }

  if (isLinkButton) {
    return (
      <div className={ ibClass } title={ iconTitle }>
      <Link className='iconButtonLink' to={ buttonLink }>
        <TheIcon size='24' color='#555555' />
      </Link>
      <Link className='iconButtonLink' to={ buttonLink }>
        <div className='iconLinkCaption'> {iconCaption} </div>
      </Link>
    </div>
    );
  }
  return (
    <div className={ ibClass }  onClick={ () => callProc() } title={ iconTitle } >
      <div className='theIcon'><TheIcon size='24' color='#555555' /></div>
      <div className='iconCaption'> {iconCaption} </div>
    </div>
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

const MakeTopButton = ( caption='' ) => {
  const topConfig = {
    caption: caption,
    title: 'go to top page',
    iconType: 'top',
    buttonLink: `/`,
  };
  return (
    <IconButton config={ topConfig } />
  );
};

const MakeDragIcon = () => {
  return (
    <VscGripper title='drag to change order' size='22' color='#ffffff' />
  );
};

export { IconButton, MakeSettingsButton, MakeTopButton, MakeDragIcon };

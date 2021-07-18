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
import { GrDrag } from 'react-icons/gr';
import { VscCheck, VscCircleSlash, VscSettingsGear, VscEmptyWindow, VscEdit, VscReferences,
  VscTrash } from 'react-icons/vsc';

const IconButton = ({ config }) => {
  const { caption, title, iconType, buttonLink, callProc } = config;
  const iconCaption = caption==null ? '' : caption;
  const iconTitle = title==null ? caption : title;
  const isLinkButton = buttonLink!=null; // catches null or undefined
  const ibClass = iconCaption==='' ? 'iconButtonNarrow' : 'iconButton';

  let TheIcon;
  switch (iconType) {
    case 'settings':
      TheIcon=VscSettingsGear;
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

const MakeDragIcon = () => {
  return (
    <GrDrag title='drag to change order' size='20' color='#ffffff' />
  );
};

export { IconButton, MakeSettingsButton, MakeDragIcon };

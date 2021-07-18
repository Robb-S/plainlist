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
import { VscSettingsGear, VscEmptyWindow } from 'react-icons/vsc';

const IconButton = ({ config }) => {
  const { caption, title, iconType, buttonLink, callProc } = config;
  const iconCaption = caption==null ? '' : caption;
  const iconTitle = title==null ? caption : title;
  const isLinkButton = buttonLink!=null; // catches null or undefined

  let TheIcon;
  switch (iconType) {
    case 'settings':
      TheIcon=VscSettingsGear;
      break;
    case 'add':
      TheIcon=VscEmptyWindow;
      break;
    default:
      throw 'bad call to IconButton';
  }

  if (isLinkButton) {
    return (
      <div className='iconButton' title={ iconTitle }>
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
    <div className='iconButton'  onClick={ () => callProc() } title={ iconTitle } >
      <TheIcon size='24' color='#555555' />
      <div className='iconCaption'> {iconCaption} </div>
    </div>
  );
};

export default IconButton;

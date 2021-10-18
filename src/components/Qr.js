import React, { Fragment } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { MakeButtonForLink } from './IconButton';

const Qr = () => {
  const { state } = useStore();
  const isLoggedIn = state.loggedIn;
  const vnum = 'version '+ process.env.REACT_APP_VERSION_NUM;

  const qrBody = () => {
    return (
      <Fragment>
        <div className='helpPara'>
          Welcome to "Cross It Off the List" - a simple, no-frills app for your shopping lists, to-do lists and other personal list needs.
        </div>
        <div className='helpHeader'>
          Starting out
        </div>
        <div className='helpPara'>
          Pick a user name and an optional nickname, and enter these along with your email address on the new-user registration page.  We will start you off with a couple of default starter lists, which you can change whenever you wish.
        </div>

      </Fragment>
    );
  };

  const headingArea = () => {
    return (
      <div className='headingZone helpHeading'>
        <div className='headingNameArea'>
          Share App with QR Code
        </div>
        <div className='headingIcons'>
        {isLoggedIn &&
          MakeButtonForLink('home', 'home')
        }
        {!isLoggedIn &&
          MakeButtonForLink('login', 'log in')
        }
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        { headingArea() }
        { qrBody() }
      </div>
    </Fragment>
  );
};

export default Qr;

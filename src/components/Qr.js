import React, { Fragment } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { MakeButtonForLink } from './IconButton';

const Qr = () => {
  const { state } = useStore();
  const isLoggedIn = state.loggedIn;

  const qrBody = () => {
    return (
      <Fragment>
        <div className='helpPara'>
          Scan the QR code below to access the top page of the Cross It Off the List app.
        </div>
        <div className='qrcodeimg'>
          <img src="https://crossitoffthelist.com/pix/qrcode1.png"
            alt="qr code for let's dot cross it off the list dot com" />
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
          MakeButtonForLink('home')
        }
        {!isLoggedIn &&
          MakeButtonForLink('login')
        }
        { MakeButtonForLink('help') }
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

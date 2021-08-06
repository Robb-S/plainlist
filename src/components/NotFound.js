import React, { Fragment } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { IconButton, MakeHomeButton } from './IconButton';
import { Link } from 'react-router-dom';

const NotFound = () => {
  const { state } = useStore();
  const isLoggedIn = state.loggedIn;

  const helpBody = () => {
    return (
      <Fragment>
        <div className='helpPara'>
          Sorry, we couldn't access that page.  Please try
          our <Link to={{ pathname: '/' }}>home page</Link>.
        </div>
      </Fragment>
    );
  };

  const headingArea = () => {
    const loginConfig = {
      caption: 'log in',
      title: 'go to login page',
      iconType: 'login',
      buttonLink: `/login/`,
    };
    return (
      <div className='headingZone helpHeading'>
        <div className='headingNameArea'>
          Not Found 404
        </div>
        <div className='headingIcons'>
        {isLoggedIn &&
          MakeHomeButton('home')
        }
        {!isLoggedIn &&
          <IconButton config={ loginConfig } />
        }
        </div>
      </div>
    );
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='topLogo'>- Cross It Off the List -</div>
        { headingArea() }
        { helpBody() }
      </div>
    </Fragment>
  );
};

export default NotFound;

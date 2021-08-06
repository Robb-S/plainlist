import React, { Fragment } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { IconButton, MakeHomeButton } from './IconButton';
import { Link, useHistory } from 'react-router-dom';
import { handleLogout } from '../store/handlersUser';

const NotFound = () => {
  const { state, dispatch } = useStore();
  const history = useHistory();
  const isLoggedIn = state.loggedIn;

  const textBody = () => {
    return (
      <Fragment>
        <div className='helpPara'>
          Sorry, we couldn't access that page.  Please try
          our <Link to={{ pathname: '/' }}>home page</Link>.
        </div>
      </Fragment>
    );
  };

  const onLogout = async () => {
    await handleLogout(dispatch);
    history.push('/login/');
  };

  const headingArea = () => {
    const loginConfig = {
      caption: 'log in',
      title: 'go to login page',
      iconType: 'login',
      buttonLink: `/login/`,
    };
    const logoutConfig = {
      caption:'log out', title:'log out', iconType:'logout', callProc:onLogout,
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
        {isLoggedIn &&
          <IconButton config={ logoutConfig } />
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
        { textBody() }
      </div>
    </Fragment>
  );
};

export default NotFound;

import React, { Fragment } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { IconButton, MakeHomeButton } from './IconButton';

const Help = () => {
  const { state } = useStore();
  const isLoggedIn = state.loggedIn;

  const helpBody = () => {
    return (
      <Fragment>
        <div className='helpPara'>
          Welcome to "Cross It Off the List" - a simple, no-frills app for your shopping lists, to-do lists and other personal list needs.
        </div>
        <div className='helpHeader'>
          Starting out
        </div>
        <div className='helpPara'>
          Pick a user name and an optional nickname, and enter these along with your email address on the new-user registration page.  (We will not share your email, but will only use it for password-change confirmation.)
        </div>
        <div className='helpHeader'>
          How lists are organized
        </div>
        <div className='helpPara'>
          You can organize your lists in two different ways - either by category ("hierarchical") or with no categories ("flat").  For example you might find it useful to have separate categories such as "to do" for multiple to-do lists, "shopping" for multiple shopping lists and "books" for lists of books you want to read in different genres.  Or, if you have only a few lists you may find it easier to use a flat layout, with all your lists visible at once.
        </div>
        <div className='helpPara'>
          When you first start using the app your lists will be organized in Hierarchical mode, with two starter categories ("Shopping" and "To do") and one starter list in each category.  You can rename any of these, and add or delete categories and lists as you wish.
        </div>
        <div className='helpHeader'>
          Switching between Hierarchical and Flat modes
        </div>
        <div className='helpPara'>
          You can switch between Hierarchical and Flat modes at any time by going to the Settings page.  (Press the "cog" icon from any other page to reach the Settings page.)
        </div>
        <div className='helpHeader'>
          Reordering collections of categories, collections of lists and lists of items
        </div>
        <div className='helpPara'>
          If you want to change the order of categories, lists or items, grab the six-dot icon to the left of the text and drag it to the position you want, either with the mouse (on desktop) or with your finger (on a touch device).
        </div>
        <div className='helpHeader'>
          Switching categories for a list
        </div>
        <div className='helpPara'>
          When you are on the page for a particular list, you can change the category of that list by pressing the "Change Category" icon and selecting a different category.
        </div>
        <div className='helpPara'>
          This can be useful if you have added a new list when in "Flat" mode, but have switched back to "Hierarchical" mode, as the new list will have been placed in an "Uncategorized" category.  Simply move it to whichever other category you prefer, or create a new category. (Note that the "Change Category" icon will not appear if there are no other categories to switch to.)
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
          About Cross It Off the List
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

export default Help;

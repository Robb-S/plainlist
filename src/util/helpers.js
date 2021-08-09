import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';

/**
 * Make unique string ID.  Currently using uuid.  Used to provide IDs in demo
 * mode, when there's no back-end API to supply the IDs automatically.
 */
const makeStringID = () => {
  return uuidv4();
};

/**
 * Simple helper to return array position at which attribute is found.
 * Accepts an array of objects.  Returns the position in that array where
 * the object has an attribute equal to the specified value.
 * Used when manipulating array items that are being reordered with drag and drop.
 * 
 * @returns position, or -1 if not found
 */
const findPosWithAttr = (array, attr, value) => {
  for(let i = 0; i < array.length; i += 1) {
      if(array[i][attr] === value) {
          return i;
      }
  }
  return -1;
};

/**
 * Find element with highest value of numericAttr (e.g. sortOrder) 
 * in objects in array, and add 1.  Used to provide new, highest sortOrder value so 
 * that a newly added element sticks to the top of the list.
 */
 const makeHighestNumericAttribute = (theArray, numericAttr) => {
  return Math.max(...theArray.map(o => o.sortOrder), 0) + 1;
};

/**
 * Confirmation dialog - displays question, returns true or false. 
 * Ready for visual upgrade.
 */
const confirmQuest = (cQuestion) => {
  return window.confirm(cQuestion);
};

/**
 * Compares two objects to see if they have same value via JSON.stringify.
 * May cause occasional unnecessary rewrites if somehow the attributes are 
 * in different order, but it doesn't matter.
 */
const AreObjectsDifferent = (a, b) => {
  return JSON.stringify(a) !== JSON.stringify(b);
};

/**
 * Sets the axios default header once an autorization token is available.
 */
const setAxiosAuthToken = token => {
  // setAxiosCache();
  // axios.defaults.headers.get['Cache-Control'] = 'no-cache';
  if (typeof token !== 'undefined' && token) {
    axios.defaults.headers.common['Authorization'] = 'Token ' + token;
    // axios.defaults.headers.common["Content-Type"] = 'application/json';
  } else { // Delete auth header    
    delete axios.defaults.headers.common['Authorization'];
  }
};

/**
 * Unsets the axios default header.
 */
 const unsetAxiosAuthToken = () => {
  delete axios.defaults.headers.common['Authorization'];
};

/**
 * Helper to debounce input from text fields before using it.  Use with UseEffect.
 * From useHooks.com.
 */
function useDebounce(value, delay) {
  // State and setters for debounced value (from UseHooks.com)
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

/**
 * Helper to return properly formed number+noun.
 */
function pluralize(theAmt, singularNoun, pluralNoun) {
  if (theAmt===1 || theAmt==='1') return theAmt + ' ' + singularNoun;
  return theAmt + ' ' + pluralNoun;
}

/**
 * Allow escape key to trigger cancel (and other) functions.
 * Usage: useEscape(() => setIsOpen(false));
 */
const useEscape = (onEscape) => {
  useEffect(() => {
      const handleEsc = (event) => {
          if (event.keyCode === 27)
              onEscape();
      };
      window.addEventListener('keydown', handleEsc);
      return () => {
          window.removeEventListener('keydown', handleEsc);
      };
  }, []);
};

/**
 * Simple sleep function for testing async problems.
 * Usage: await sleepy(2000); will wait two seconds
 */
function sleepy(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Test minimum and maximum length; display toast and return false if too short or too long.
 * Tests trimmed version (stripped of whitespace) to avoid errors with blank spaces.
 * @param {string} text to validate 
 * @param {integer} minLength 0 if not required, 1 if required, other number if different minimum
 * @param {integer} maxLength
 * @param {string} fieldName (optional)
 * @returns 
 */
const validateLength = (theText, minLength, maxLength, fieldName='') => {
  const toastStyle = {
    backgroundColor: '#263238',
    color: '#ffffff',
  };
  const topt = {
    duration: 3000,
    position: 'top-center',
    icon: '⚠️',
    style: toastStyle,
  };
  const toastRequired = () => {
    if (fieldName.length<1) return toast('Please enter text for required field.', topt);
    return toast(`Please enter text for ${fieldName}`, topt);
  };
  const toastTooShort = () => {
    if (fieldName.length<1) return toast(`Minimum length is ${minLength} characters.`, topt);
    return toast(`Minimum length for ${fieldName} is ${minLength} characters.`, topt);
  };
  const toastTooLong = () => {
    if (fieldName.length<1) return toast(`Maximum length is ${maxLength} characters.`, topt);
    return toast(`Maximum length for ${fieldName} is ${maxLength} characters.`, topt);
  };
  if (minLength===1 && theText.trim().length<minLength) {
    toastRequired();
    return false;
  }
  if (minLength>1 && theText.trim().length<minLength) {
    toastTooShort();
    return false;
  }
  if (theText.length>maxLength) {
    toastTooLong();
    return false;
  }
  return true;
};

export {
  makeStringID,
  findPosWithAttr,
  makeHighestNumericAttribute,
  confirmQuest,
  AreObjectsDifferent,
  setAxiosAuthToken,
  useDebounce,
  pluralize,
  useEscape,
  sleepy,
  unsetAxiosAuthToken,
  validateLength,
};

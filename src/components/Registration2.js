import React, { Fragment, useState, useEffect } from 'react';
import '../css/lists.css';
import '../css/settings.css';
import { useStore } from '../store/StoreContext';
import { handleReg } from '../store/handlersUser';
import { useDebounce } from '../util/helpers';
import { useHistory, Link } from 'react-router-dom';
import { userExistsAPI } from '../store/apiCalls';
import * as api from '../util/constants';
import { FormLabel } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { MakeHelpButton } from './IconButton';
import { IconButton as CrossIconButton } from './IconButton';  // alias needed
import IconButton from '@material-ui/core/IconButton';    // same name as local component
import { useFormik } from 'formik';
import * as yup from 'yup';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import InputAdornment from '@material-ui/core/InputAdornment';
import OutlinedInput from '@material-ui/core/OutlinedInput';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';

const Registration2 = () => {
  const { dispatch } = useStore();
  const history = useHistory();
  const [regMsg, setRegMsg] = useState('Please fill out the fields below.');
  const [uNameMsg, setUNameMsg] = useState('');
  const [uNameValid, setUNameValid] = useState(false);
  const [showPassword, setShowPassword ] = useState(true);

  async function checkUserName(debouncedUserName) {
    if (debouncedUserName.length>2) {
      const { userExists, status } = await userExistsAPI(debouncedUserName);
      if (status===api.OK && userExists) {
        setUNameMsg('* ' + api.WARN_USER_EXISTS + ' *');
        setUNameValid(false);
      } else {
        setUNameMsg(api.MSG_USER_AVAILABLE);
        setUNameValid(true);
      }
    } else {
      setUNameMsg(' ');
    }
  }

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexWrap: 'wrap',
    },
    margin: {
      margin: theme.spacing(0),
    },
    withoutLabel: {
      marginTop: theme.spacing(3),
    },
    textField: {
      width: '100%',
    },
  }));

  const processForm = async (values) => {
    const { userName, userPwd, userPwd2, userEmail, userNickname } = values;
    if (!uNameValid) {
      setRegMsg('Please pick another user name.');
      return;
    } else {
      setRegMsg('');
    }
    const userInfo = { username: userName, password: userPwd,
      password2: userPwd2, email: userEmail, nickname: userNickname };
    console.log(values);
    console.log(userInfo);
    const regResult = await handleReg(userInfo, dispatch);
    console.log(regResult);
    if (regResult===api.OK) { history.push('/'); }
    else setRegMsg(regResult);
  };

  const headingArea = () => {
    return (
      <div className='headingZone loginHeading'>
        <div className='headingNameArea'>
          Register new user
        </div>
        <div className='headingIcons headingIconsSmaller'>
          { MakeHelpButton() }
        </div>
      </div>
    );
  };
  
  const validationSchema = yup.object({
    userEmail: yup
      .string('Enter your email')
      .email('Enter a valid email')
      .max(60, 'Email should be a maximum of 60 characters in length')
      .required('Email is required'),
    userName: yup
      .string('Enter a user name')
      .min(3, 'User name should be a minimum of 3 characters in length')
      .max(60, 'User name should be a maximum of 60 characters in length')
      .required('User name is required'),
    userPwd: yup
      .string('Enter a password')
      .min(8, 'Password should be a minimum of 8 characters in length')
      .max(60, 'Password should be a maximum of 60 characters in length')
      .required('Password is required'),
    userPwd2: yup
      .string('Repeat the password')
      .min(8, 'Password should be a minimum of 8 characters in length')
      .max(60, 'Password should be a maximum of 60 characters in length')
      .oneOf([yup.ref('userPwd')], 'Passwords do not match.')
      .required('Password is required'),
    userNickname: yup
      .string('Enter a nickname (optional)')
      .max(60, 'Nickname should be a maximum of 60 characters in length'),
  });

  const formik = useFormik({
    initialValues: {
      userName: '',
      userEmail: '',
      userPwd: '',
      userPwd2: '',
      userNickname: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      console.log(JSON.stringify(values, null, 2));
      processForm(values);
    },
  });

  const debouncedUserName = useDebounce(formik.values.userName, 300);

  // Effect for API call
  useEffect(() => {
    checkUserName(debouncedUserName);
    },
    [debouncedUserName], // Only call effect if debounced search term changes
  );

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const regForm = () => {
    const regIconConfig = {
      caption:'register', title:'register new user data', iconType:'login',
      callProc:formik.handleSubmit,
    };
    const classes = useStyles();

    return (
      <Fragment>
        <form className='regForm' onSubmit={formik.handleSubmit}>
          <FormLabel component="legend"><div className='formlabel'>
          Please enter the fields below
            or <Link to={{ pathname: '/login/' }}>log in (for existing users)</Link>
          </div>
          </FormLabel>
          <div className='regFormMessage'>
            {regMsg}
          </div>
          <div className='regbox'>
            <TextField
              required
              fullWidth
              label="User name (3-60 char)"
              id='userName'
              name='userName'
              value={formik.values.userName}
              onChange={formik.handleChange}
              error={formik.touched.userName && Boolean(formik.errors.userName)}
              helperText={formik.touched.userName && formik.errors.userName}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off', autoComplete:'new-password' }}
            />
          </div>
          <div className='regFormMessage'>
            {uNameMsg}
          </div>
          <div className='regbox'>
            <FormControl className={clsx(classes.textField)} variant='outlined' margin='dense' >
            <InputLabel htmlFor='userPwd'>Password (8-60 char) *</InputLabel>
              <OutlinedInput
                labelWidth={167}
                required
                id='userPwd'
                name='userPwd'
                type={showPassword ? 'text' : 'password'}
                value={formik.values.userPwd}
                onChange={formik.handleChange}
                autoComplete='new-password'
                inputProps={{
                  autoCapitalize: 'off',
                  autoComplete:'new-password',
                }}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {!showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                }
              />
            </FormControl>
          </div>
          <div className='regbox'>
            <TextField
              required
              fullWidth
              id='userPwd2'
              type={showPassword ? 'text' : 'password'}
              name='userPwd2'
              label='Repeat password:'
              value={formik.values.userPwd2}
              onChange={formik.handleChange}
              error={formik.touched.userPwd2 && Boolean(formik.errors.userPwd2)}
              helperText={formik.touched.userPwd2 && formik.errors.userPwd2}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off', autoComplete:'off' }}
            />
          </div>
          <div className='regbox'>
            <TextField
              required
              fullWidth
              id='userEmail'
              name='userEmail'
              label='Email:'
              value={formik.values.userEmail}
              onChange={formik.handleChange}
              error={formik.touched.userEmail && Boolean(formik.errors.userEmail)}
              helperText={formik.touched.userEmail && formik.errors.userEmail}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off' }}
            />
          </div>
          <div className='reg regbox'>
            <TextField
              fullWidth
              id='userNickname'
              name='userNickname'
              label='Nickname (optional, max. 60 char):'
              value={formik.values.userNickname}
              onChange={formik.handleChange}
              error={formik.touched.userNickname && Boolean(formik.errors.userNickname)}
              helperText={formik.touched.userNickname && formik.errors.userNickname}
              variant='outlined'
              margin='dense'
              inputProps={{ autoCapitalize: 'off' }}
            />
          </div>
          <div className='regButton'><CrossIconButton config={ regIconConfig } /></div>
          <input type="submit" className="hidden" />
        </form>
      </Fragment>
    );
  };

  return (
    <Fragment>
      <div className='mainContainer'>
        <div className='topLogo'>- Cross It Off the List -</div>
        { headingArea() }
        { regForm() }
      </div>
    </Fragment>
  );
};

export default Registration2;

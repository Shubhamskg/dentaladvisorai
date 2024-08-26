// import React, { useReducer, useState } from 'react'
// import { GptIcon, Google, Microsoft } from '../../assets'
// import { Link, useNavigate } from 'react-router-dom'
// import FormField from './FormField'
// import { useGoogleLogin } from '@react-oauth/google'
// import { useDispatch } from 'react-redux'
// import { insertUser } from '../../redux/user'
// import instance from '../../config/instance'
// import './style.scss'

// const reducer = (state, { type, status }) => {
//     switch (type) {
//         case 'filled':
//             return { filled: status }
//         case 'error':
//             return { error: status, filled: state.filled }
//         default: return state
//     }
// }

// const LoginComponent = () => {
//     const IMAGES = {
//         image : new URL('../../../public/favicon.png', import.meta.url).href
//     }

//     const dispatch = useDispatch()
//     const navigate = useNavigate()

//     const [state, stateAction] = useReducer(reducer, {
//         filled: false,
//         error: false
//     })

//     const [formData, setFormData] = useState({
//         email: '',
//         pass: '',
//         manual: true
//     })

//     const handleInput = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         })
//     }

//     const googleAuth = useGoogleLogin({
//         onSuccess: response => 
        
//         {
//             formHandle(null, {
//                 manual: false,
//                 token: response.access_token
                
//             })
           
//         }
//     })

//     const formHandle = async (e, googleData) => {
//         e?.preventDefault()
//         let res = null
//         try {
//             res = await instance.get('/api/user/login', {
//                 params: googleData || formData
//             })
//         } catch (err) {
//             if (err?.response?.data?.status === 422) {
//                 stateAction({ type: 'error', status: true })
//                 // alert("Wrong Email Id or Password")
//                 // navigate('/signup')
//             }
//         } finally {
//             if (res?.data) {
//                 stateAction({ type: 'error', status: false })
//                 dispatch(insertUser(res.data.data))
//                 navigate('/')
//             }
//         }
//     }

//     return (
//         <div className='Contain'>
//             <div className='icon'>
//                 {/* <GptIcon /> */}
//                 <img src={IMAGES.image} alt='first image'/>

//             </div>

//             <div>
//                 {!state.filled ? <h1>Welcome back</h1>
//                     : <h1>Enter your password</h1>}

//             </div>

//             {
//                 !state.filled ? (
//                     <div className='options'>
//                         <form className="manual" onSubmit={(e) => {
//                             e.preventDefault()
//                             stateAction({ type: 'filled', status: true })
//                         }}>
//                             <div>

//                                 <FormField
//                                     value={formData.email}
//                                     name={'email'}
//                                     label={"Email address"}
//                                     type={"email"}
//                                     handleInput={handleInput}
//                                 />
//                             </div>
//                             <div>
//                                 <button type='submit' >Continue</button>
//                             </div>
//                         </form>

//                         <div data-for="acc-sign-up-login">
//                             <span>Don't have an account?</span>
//                             <Link to={'/signup'}>Sign up</Link>
//                         </div>

//                         <div className="extra">
//                             <div className="divide">
//                                 <span>OR</span>
//                             </div>

//                             <div className="btns">
//                                 <button onClick={googleAuth} ><Google /> Continue with Google</button>
//                                 {/* <button><Microsoft /> Continue with Microsoft Account</button> */}
//                             </div>

//                         </div>
//                     </div>
//                 ) : (
//                     <form className='Form' onSubmit={formHandle}>
//                         <div>
//                             <div className="email">
//                                 <button type='button' onClick={() => {
//                                     stateAction({ type: 'filled', status: false })
//                                 }} >Edit</button>

//                                 <FormField
//                                     value={formData.email}
//                                     name={'email'}
//                                     type={"email"}
//                                     isDisabled />

//                             </div>

//                             <div className="password">

//                                 <FormField
//                                     value={formData.pass}
//                                     name={'pass'}
//                                     label={"Password"}
//                                     type={"password"}
//                                     handleInput={handleInput}
//                                     error={state?.error}
//                                 />

//                             </div>

//                             <div>
//                                 {state?.error && <div className='error'><div>!</div> Email or password wrong.</div>}
//                             </div>

//                             <button type='submit'>Continue</button>

//                             <div className='forgot' >
//                                 <Link to={'/forgot'} >Forgot password?</Link>
//                             </div>
//                         </div>
//                         <div data-for="acc-sign-up-login">
//                             <span>Don't have an account?</span>
//                             <Link to={'/signup'}>Sign up</Link>
//                         </div>
//                     </form>
//                 )
//             }
//         </div >
//     )
// }

// export default LoginComponent

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GptIcon, Tick, Google, Microsoft, Mail, } from '../../assets'
import { useDispatch } from 'react-redux';
import { insertUser } from '../../redux/user'
import { useGoogleLogin } from '@react-oauth/google';
import instance from '../../config/instance';
import './LoginComponent.scss';

const LoginComponent = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [step, setStep] = useState('email');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const googleAuth = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await instance.get('/api/user/login', {
          params: { token: response.access_token, manual: false }
        });
        if (res?.data) {
          dispatch(insertUser(res.data.data));
          navigate('/');
        }
      } catch (err) {
        setError('Google login failed. Please try again. '+err);
      }
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (step === 'email') {
      setStep('password');
    } else {
      try {
        const res = await instance.get('/api/user/login', {
          params: { ...formData, manual: true }
        });
        if (res?.data) {
          dispatch(insertUser(res.data.data));
          navigate('/');
        }
      } catch (err) {
        setError('Invalid email or password. Please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>{step === 'email' ? 'Welcome back' : 'Enter your password'}</h2>

        <form onSubmit={handleSubmit}>
          {step === 'email' ? (
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInput}
                required
                placeholder="Enter your email"
              />
            </div>
          ) : (
            <>
              <div className="email-display">
                <span>{formData.email}</span>
                <button type="button" onClick={() => setStep('email')}>Edit</button>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="password-input">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInput}
                    required
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? '👁️' : '👁️‍🗨️'}
                  </button>
                </div>
              </div>
            </>
          )}
          <button type="submit" className="btn-primary">
            {step === 'email' ? 'Continue' : 'Log in'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {step === 'email' && (
          <>
            <div className="divider">
              <span>OR</span>
            </div>
            <button  onClick={googleAuth} className="btn-google">
            <Google />
             Continue with Google
            </button>
          </>
        )}

        <div className="login-footer">
          {step === 'password' && (
            <a href="/forgot" className="forgot-password">Forgot password?</a>
          )}
          <p className="signup-link">
            Don't have an account? <a href="/signup">Sign up</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginComponent;
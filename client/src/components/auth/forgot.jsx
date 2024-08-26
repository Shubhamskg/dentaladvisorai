// import React, { Fragment, useCallback, useReducer, useState } from 'react'
// import { GptIcon, Tick, Mail } from '../../assets'
// import { useNavigate } from 'react-router-dom'
// import FormField from './FormField'
// import instance from '../../config/instance'
// import './style.scss'

// const reducer = (state, { type, status }) => {
//     switch (type) {
//         case 'mail':
//             return { mail: status }
//         case 'error':
//             return { error: status }
//         default: return state
//     }
// }

// const ForgotComponent = ({ isRequest, userId, secret }) => {
//     const [state, stateAction] = useReducer(reducer, {
//         mail: false
//     })

//     const navigate = useNavigate()

//     const passwordClass = useCallback((remove, add) => {
//         document.querySelector(remove).classList?.remove('active')
//         document.querySelector(add).classList?.add('active')
//     }, [])

//     const [formData, setFormData] = useState({
//         email: '',
//         newPass: '',
//         reEnter: ''
//     })

//     const handleInput = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         })
//     }

//     const formHandleMail = async (e) => {
//         if (e) { e.preventDefault() }
//         let res = null
//         try {
//             res = await instance.post('/api/user/forgot-request', {
//                 email: formData.email
//             })
//         } catch (err) {
//             if (err?.response?.data?.status === 422) {
//                 stateAction({ type: 'error', status: true })
//             }
//         } finally {
//             if (res?.data?.status === 208) {
//                 navigate('/')
//             } else if (res) {
//                 stateAction({ type: 'mail', status: true })
//             }
//         }
//     }

//     const formHandleReset = async (e) => {
//         e.preventDefault()
//         if (userId && secret && formData?.newPass.length >= 8) {
//             if (formData?.newPass === formData?.reEnter) {
//                 stateAction({ type: 'error', status: false })

//                 let res = null
//                 try {
//                     res = await instance.put('/api/user/forgot-finish', {
//                         userId,
//                         secret,
//                         newPass: formData.newPass,
//                         reEnter: formData.reEnter
//                     })
//                 } catch (err) {
//                     alert(err)
//                     navigate('/forgot')
//                 } finally {
//                     if (res) {
//                         navigate('/login')
//                     }
//                 }
//             } else {
//                 stateAction({ type: 'error', status: true })
//             }
//         }
//     }

//     return (
//         <div className='Contain'>
//             <div className='icon'>
//                 <GptIcon />
//             </div>

//             {
//                 isRequest ? (
//                     <Fragment>
//                         {
//                             !state.mail ? (
//                                 <Fragment>
//                                     <div>
//                                         <h1>Reset your password</h1>

//                                         <p>Enter your email address and we will send you instructions to reset your password.</p>
//                                     </div>

//                                     <form className='Form' onSubmit={formHandleMail}>
//                                         <div>
//                                             <div className="emailForgot">

//                                                 <FormField
//                                                     value={formData.email}
//                                                     name={'email'}
//                                                     label={"Email address"}
//                                                     type={"email"}
//                                                     handleInput={handleInput}
//                                                     error={state?.error}
//                                                 />

//                                                 {state?.error && <div className='error'><div>!</div> The user not exists.</div>}
//                                             </div>

//                                             <button type='submit'>Continue</button>

//                                             <div>
//                                                 <button type='button' onClick={() => {
//                                                     navigate('/login/auth')
//                                                 }} className='back'>Back to Apps Client</button>
//                                             </div>
//                                         </div>
//                                     </form>
//                                 </Fragment>
//                             )
//                                 : (
//                                     <div className='mail'>
//                                         <div className='icon'>
//                                             <Mail />
//                                         </div>

//                                         <div>
//                                             <h3>Check Your Email</h3>
//                                         </div>

//                                         <div>
//                                             <p>Please check the email address {formData?.email} for instructions to reset your password.</p>
//                                         </div>

//                                         <button onClick={() => formHandleMail(null)}>Resend Mail</button>
//                                     </div >
//                                 )
//                         }
//                     </Fragment>
//                 ) : (
//                     <Fragment>
//                         <div>
//                             <h1>Enter your password</h1>
//                             <p>Enter a new password below to change your password.</p>
//                         </div>
//                         <form className='Form' onSubmit={formHandleReset}>
//                             <div>
//                                 <div className="password">

//                                     <FormField
//                                         value={formData.newPass}
//                                         name={'newPass'}
//                                         label={"New password"}
//                                         type={"password"}
//                                         handleInput={handleInput}
//                                         passwordClass={passwordClass}
//                                         error={state?.error}
//                                     />

//                                 </div>

//                                 <div className="password">

//                                     <FormField
//                                         value={formData.reEnter}
//                                         name={'reEnter'}
//                                         label={"Re-enter new password"}
//                                         type={"password"}
//                                         handleInput={handleInput}
//                                         error={state?.error}
//                                     />

//                                 </div>

//                                 {state?.error && <div className='error'><div>!</div> Password not match.</div>}

//                                 <div id='alertBox'>
//                                     Your password must contain:

//                                     <p id='passAlertError' className='active'>
//                                         <span>&#x2022;</span>
//                                         &nbsp;
//                                         At least 8 characters
//                                     </p>

//                                     <p id='passAlertDone' className='active'>
//                                         <span><Tick /></span>
//                                         &nbsp;
//                                         At least 8 characters
//                                     </p>
//                                 </div>

//                                 <button type='submit'>Reset password</button>
//                             </div>
//                         </form>
//                     </Fragment>
//                 )
//             }

//         </div >
//     )
// }

// export default ForgotComponent
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import instance from '../../config/instance';
import { Mail, Tick } from '../../assets';
import './forgot.scss';

const ForgotComponent = ({ isRequest, userId, secret }) => {
  const navigate = useNavigate();
  const [state, setState] = useState({
    mail: false,
    error: false
  });

  const [formData, setFormData] = useState({
    email: '',
    newPass: '',
    reEnter: ''
  });

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setState(prev => ({ ...prev, error: false }));
  };

  const formHandleMail = async (e) => {
    e?.preventDefault();
    try {
      const res = await instance.post('/api/user/forgot-request', {
        email: formData.email
      });
      if (res?.data?.status === 208) {
        navigate('/');
      } else {
        setState(prev => ({ ...prev, mail: true }));
      }
    } catch (err) {
      if (err?.response?.data?.status === 422) {
        setState(prev => ({ ...prev, error: true }));
      }
    }
  };

  const formHandleReset = async (e) => {
    e.preventDefault();
    if (userId && secret && formData?.newPass.length >= 8 && formData?.newPass === formData?.reEnter) {
      try {
        const res = await instance.put('/api/user/forgot-finish', {
          userId,
          secret,
          newPass: formData.newPass,
          reEnter: formData.reEnter
        });
        if (res) {
          navigate('/login');
        }
      } catch (err) {
        alert(err);
        navigate('/forgot');
      }
    } else {
      setState(prev => ({ ...prev, error: true }));
    }
  };

  const passwordClass = useCallback((remove, add) => {
    document.querySelector(remove)?.classList.remove('active');
    document.querySelector(add)?.classList.add('active');
  }, []);

  return (
    <div className='forgot-container'>
      <div className='forgot-content'>
        {isRequest ? (
          !state.mail ? (
            <>
              <h1>Reset your password</h1>
              <p>Enter your email address and we will send you instructions to reset your password.</p>
              <form onSubmit={formHandleMail}>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInput}
                    required
                  />
                </div>
                {state.error && <div className='error-message'>The user does not exist.</div>}
                <button type='submit' className="btn-primary">Continue</button>
                <button type='button' onClick={() => navigate('/login')} className='btn-secondary'>
                  Back to Login
                </button>
              </form>
            </>
          ) : (
            <div className='mail-sent'>
              <Mail />
              <h2>Check Your Email</h2>
              <p>Please check the email address {formData.email} for instructions to reset your password.</p>
              <button onClick={formHandleMail} className="btn-primary">Resend Email</button>
            </div>
          )
        ) : (
          <>
            <h1>Enter your new password</h1>
            <p>Enter a new password below to change your password.</p>
            <form onSubmit={formHandleReset}>
              <div className="form-group">
                <label htmlFor="newPass">New password</label>
                <input
                  type="password"
                  id="newPass"
                  name="newPass"
                  value={formData.newPass}
                  onChange={handleInput}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="reEnter">Re-enter new password</label>
                <input
                  type="password"
                  id="reEnter"
                  name="reEnter"
                  value={formData.reEnter}
                  onChange={handleInput}
                  required
                />
              </div>
              {state.error && <div className='error-message'>Passwords do not match.</div>}
              <div className='password-requirements'>
                Your password must contain:
                <p className={formData.newPass.length >= 8 ? 'requirement-met' : ''}>
                  {formData.newPass.length >= 8 ? <Tick /> : '•'} At least 8 characters
                </p>
              </div>
              <button type='submit' className="btn-primary">Reset password</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ForgotComponent;

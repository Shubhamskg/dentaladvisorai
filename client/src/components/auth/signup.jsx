// import React, { Fragment, useCallback, useReducer, useState } from 'react'
// import { GptIcon, Tick, Google, Microsoft, Mail, } from '../../assets'
// import { Link, useNavigate } from 'react-router-dom'
// import { useGoogleLogin } from '@react-oauth/google'
// import FormField from './FormField'
// import axios from 'axios'
// import instance from '../../config/instance'
// import './style.scss'

// const reducer = (state, { type, status }) => {
//   switch (type) {
//     case 'filled':
//       return { filled: status }
//     case 'error':
//       return { error: status, filled: state.filled }
//     case 'mail':
//       return { mail: status, error: !status }
//     default: return state
//   }
// }

// const SignupComponent = () => {

//   const navigate = useNavigate()

//   const [state, stateAction] = useReducer(reducer, {
//     filled: false,
//     error: false
//   })

//   const [formData, setFormData] = useState({
//     email: '',
//     pass: '',
//     manual: false
//   })

//   const handleInput = (e) => {
//     setFormData({
//       ...formData,
//       [e.target.name]: e.target.value
//     })
//   }

//   const formHandle = async (e) => {
//     e?.preventDefault()
//     if (formData?.pass.length >= 8) {
//       let res = null
//       try {
//         res = await instance.post('/api/user/signup', formData)
//       } catch (err) {
//         if (err?.response?.data.message?.exists) {
//           stateAction({ type: 'error', status: true })
//         } else {
//           stateAction({ type: 'error', status: false })
//         }

//       } finally {
//         if (res?.data?.status === 208) {
//           navigate('/')
//         } else if (res?.['data']?.data?.manual) {
//           stateAction({ type: 'mail', status: true })
//         } else if (res) {
//           stateAction({ type: 'error', status: false })
//           if (res['data']?.data?._id) navigate(`pending/${res?.['data']?.data._id}`)
//         }
//       }
//     }
//   }

//   const googleAuth = useGoogleLogin({
//     onSuccess: async response => {
//       let res = null
//       try {
//         res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
//           headers: {
//             "Authorization": `Bearer ${response.access_token}`
//           }
//         })
//       } catch (err) {
//       } finally {
//         if (res?.data?.email_verified) {
//           setFormData({
//             ...formData,
//             manual: false,
//             email: res.data.email,
//             token: response.access_token
//           })

//           stateAction({ type: 'filled', status: true })
//         }
//       }

//     }
//   })

//   const passwordClass = useCallback((remove, add) => {
//     document.querySelector(remove).classList?.remove('active')
//     document.querySelector(add).classList?.add('active')
//   }, [])
//   const IMAGES = {
//     image : new URL('../../../public/favicon.png', import.meta.url).href
// }
//   return (
//     <div className='Contain'>
//       <div className='icon'>
//         <img src={IMAGES.image} alt='first image'/>
//       </div>

//       {
//         !state.mail ? (
//           <Fragment>
//             <div>
//               <h1>Create your account</h1>

//               <p>Please note that phone verification is required for signup. Your number will only be used to verify your identity for security purposes.</p>

//             </div>

//             {
//               !state.filled ? (
//                 <div className='options'>
//                   <form className="manual" onSubmit={(e) => {
//                     e.preventDefault()
//                     setFormData({ ...formData, manual: true })
//                     stateAction({ type: 'filled', status: true })
//                   }}>
//                     <div>

//                       <FormField
//                         value={formData.email}
//                         name={'email'}
//                         label={"Email address"}
//                         type={"email"}
//                         handleInput={handleInput}
//                       />
//                     </div>
//                     <div>
//                       <button type='submit' >Continue</button>
//                     </div>
//                   </form>

//                   <div data-for="acc-sign-up-login">
//                     <span>Already have an account?</span>
//                     <Link to={'/login/auth'}>Log in</Link>
//                   </div>

//                   <div className="extra">
//                     <div className="divide">
//                       <span>OR</span>
//                     </div>

//                     <div className="btns" id='options'>
//                       <button onClick={googleAuth}><Google /> Continue with Google</button>
//                       {/* <button><Microsoft /> Continue with Microsoft Account</button> */}
//                     </div>

//                   </div>
//                 </div>
//               ) : (
//                 <form className='Form' onSubmit={formHandle}>
//                   <div>
//                     <div className="email">
//                       <button type='button' onClick={() => {
//                         stateAction({ type: 'filled', status: false })
//                       }} >Edit</button>

//                       <FormField
//                         value={formData.email}
//                         name={'email'}
//                         type={"email"}
//                         isDisabled
//                         error={state?.error} />
//                     </div>

//                     <div>
//                       {state?.error && <div className='error'><div>!</div> The user already exists.</div>}
//                     </div>

//                     <div className="password">

//                       <FormField
//                         value={formData.pass}
//                         name={'pass'}
//                         label={"Password"}
//                         type={"password"}
//                         passwordClass={passwordClass}
//                         handleInput={handleInput}
//                       />

//                     </div>

//                     <div id='alertBox'>
//                       Your password must contain:

//                       <p id='passAlertError' className='active'>
//                         <span>&#x2022;</span>
//                         &nbsp;
//                         At least 8 characters
//                       </p>

//                       <p id='passAlertDone' className='active'>
//                         <span><Tick /></span>
//                         &nbsp;
//                         At least 8 characters
//                       </p>
//                     </div>

//                     <button type='submit'>Continue</button>

//                   </div>
//                   <div data-for="acc-sign-up-login">
//                     <span>Already have an account?</span>
//                     <Link to={'/login/auth'}>Log in</Link>
//                   </div>
//                 </form>
//               )
//             }
//           </Fragment>
//         ) : (
//           <div className='mail'>
//             <div className='icon'>
//               <Mail />
//             </div>

//             <div>
//               <h3>Check Your Email</h3>
//             </div>

//             <div>
//               <p>Please check the email address {formData.email} for instructions to signup.</p>
//             </div>

//             <button onClick={() => formHandle(null)}>Resend Mail</button>
//           </div >
//         )
//       }
//     </div >
//   )
// }

// export default SignupComponent
import React, { useReducer, useState, useCallback } from 'react'
import { Google, Mail, Tick } from '../../assets'
import { Link, useNavigate } from 'react-router-dom'
import { useGoogleLogin } from '@react-oauth/google'
import FormField from './FormField'
import axios from 'axios'
import instance from '../../config/instance'
import './SignupComponent.scss'

const reducer = (state, { type, status }) => {
  switch (type) {
    case 'filled':
      return { ...state, filled: status }
    case 'error':
      return { ...state, error: status }
    case 'mail':
      return { ...state, mail: status, error: !status }
    default: return state
  }
}

const SignupComponent = () => {
  const navigate = useNavigate()
  const [state, stateAction] = useReducer(reducer, {
    filled: false,
    error: false,
    mail: false
  })

  const [formData, setFormData] = useState({
    email: '',
    pass: '',
    manual: false
  })

  const handleInput = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const formHandle = async (e) => {
    e?.preventDefault()
    if (formData?.pass.length >= 8) {
      try {
        const res = await instance.post('/api/user/signup', formData)
        if (res?.data?.status === 208) {
          navigate('/')
        } else if (res?.data?.data?.manual) {
          stateAction({ type: 'mail', status: true })
        } else if (res?.data?.data?._id) {
          navigate(`pending/${res.data.data._id}`)
        }
      } catch (err) {
        if (err?.response?.data.message?.exists) {
          stateAction({ type: 'error', status: true })
        } else {
          stateAction({ type: 'error', status: false })
        }
      }
    }
  }

  const googleAuth = useGoogleLogin({
    onSuccess: async response => {
      try {
        const res = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { "Authorization": `Bearer ${response.access_token}` }
        })
        if (res?.data?.email_verified) {
          setFormData({
            ...formData,
            manual: false,
            email: res.data.email,
            token: response.access_token
          })
          stateAction({ type: 'filled', status: true })
        }
      } catch (err) {
        console.error(err)
      }
    }
  })

  const passwordClass = useCallback((remove, add) => {
    document.querySelector(remove)?.classList.remove('active')
    document.querySelector(add)?.classList.add('active')
  }, [])

  if (state.mail) {
    return (
      <div className='signup-form mail'>
        <div className='icon'>
          <Mail />
        </div>
        <h3>Check Your Email</h3>
        <p>Please check the email address {formData.email} for instructions to signup.</p>
        <button onClick={() => formHandle(null)} className="btn-primary">Resend Mail</button>
      </div>
    )
  }

  return (
    <div className='signup-form'>
      <h1>Create your account</h1>
      <p className="signup-info">Please note that phone verification is required for signup. Your number will only be used to verify your identity for security purposes.</p>

      {!state.filled ? (
        <>
          <form onSubmit={(e) => {
            e.preventDefault()
            setFormData({ ...formData, manual: true })
            stateAction({ type: 'filled', status: true })
          }}>
            <div className="form-group">
              <FormField
                value={formData.email}
                name={'email'}
                label={"Email address"}
                type={"email"}
                handleInput={handleInput}
              />
            </div>
            <button type='submit' className="btn-primary">Continue</button>
          </form>

          <div className="divider">OR</div>

          <button onClick={googleAuth} className="btn-google">
            <Google /> Continue with Google
          </button>
        </>
      ) : (
        <form onSubmit={formHandle}>
          <div className="email-display">
            <span>{formData.email}</span>
            <button type='button' onClick={() => stateAction({ type: 'filled', status: false })}>
              Edit
            </button>
          </div>

          {state.error && <div className='error-message'>The user already exists.</div>}

          <div className="form-group password-input">
            <FormField
              value={formData.pass}
              name={'pass'}
              label={"Password"}
              type={"password"}
              passwordClass={passwordClass}
              handleInput={handleInput}
            />
            <button type="button" className="toggle-password">👁️</button>
          </div>

          <div className="password-requirements">
            Your password must contain:
            <ul>
              <li id='passAlertError' className={formData.pass.length < 8 ? 'active' : ''}>
                At least 8 characters
              </li>
              <li id='passAlertDone' className={formData.pass.length >= 8 ? 'active' : ''}>
                <Tick /> At least 8 characters
              </li>
            </ul>
          </div>

          <button type='submit' className="btn-primary">Create account</button>
        </form>
      )}

      <div className="login-link">
        <span>Already have an account?</span>
        <Link to='/login/auth'>Log in</Link>
      </div>

      <div className="terms-privacy">
        <Link to="/terms">Terms of use</Link>
        <Link to="/privacy">Privacy Policy</Link>
      </div>

      <div className="company">
        Trajectory Health Limited
      </div>
    </div>
  )
}

export default SignupComponent
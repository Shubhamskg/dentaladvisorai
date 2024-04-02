import React from 'react'
import './success.scss'; 
import { useNavigate } from 'react-router-dom'
function Success() {
    const navigate = useNavigate()
    const success=async()=>{
    const session = await fetch(`/session_status?session_id=${session_id}`)
if (session.status == 'open') {
  // Remount embedded Checkout
} else if (session.status == 'complete') {
  // Show success page
  // Optionally use session.payment_status or session.customer_email
  // to customize the success page
}
    }
  return (
    <div className="success-container">
    <i className="fas fa-check-circle success-icon"></i> 
    <h2 className="success-message">Payment Successful!</h2>
    <div className="order-details">{/* ... */}</div> 
    <button onClick={()=>{
        navigate('/')
    }} className="success-button">Go back to HomePage</button>
  </div>
  )
}

export default Success
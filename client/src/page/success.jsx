import './success.scss'; 
import { useNavigate } from 'react-router-dom'
import React, { useCallback, useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate
} from "react-router-dom";


function Success() {
  const [status, setStatus] = useState(null);
  const [customerEmail, setCustomerEmail] = useState('');

  useEffect(() => {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const sessionId = urlParams.get('session_id');
    console.log("sessionId",sessionId)
    fetch(`/api/session_status?session_id=${sessionId}`)
    .then((res) => res.json())
    .then((data) => {
      setStatus(data.status);
      setCustomerEmail(data.customer_email);
    });
}, []);
if (status === 'open') {
  return (
    <Navigate to="/checkout" />
  )
}
if (status === 'complete') {
  return (
    <section id="success">
      <p>
        We appreciate your business! A confirmation email will be sent to {customerEmail}.

        If you have any questions, please email <a href="mailto:dentaladvisor.ai">dentaladvisor.ai</a>.
      </p>
    </section>
  )
}

return null;


}

export default Success
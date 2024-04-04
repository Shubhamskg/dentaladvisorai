import { Router } from "express";
import jwt from 'jsonwebtoken'
import Stripe from 'stripe';
import payment from "../helpers/payment.js";

let router = Router()
const stripe = new Stripe(process.env.VITE_SERVER_STRIPE_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    ui_mode: 'embedded',
    line_items: [{
      price_data: {
        currency: 'gbp',
        product_data: {
          name: 'Plus Membership',
        },
        unit_amount: 3000,
      },
      quantity: 1,
    }],
    mode: 'payment',
    return_url: 'http://localhost:5173/return?session_id={CHECKOUT_SESSION_ID}'
  });
  // console.log("session: ",session)
  res.send({clientSecret: session.client_secret});
});
router.get('/session_status', async (req, res) => {
  let response = {}
  // const {userId} = req.body
  const userId=123
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id)
    console.log("session: ",session)
    res.send({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details.email
    });
    const {id,currency,created,payment_status,customer_details,status}=session
    response.db = await payment.newPayment(id,userId,currency,created,payment_status,customer_details,status)
    if(response.db){
      console.log("payment successful",response.db)
    }
  });
export default router
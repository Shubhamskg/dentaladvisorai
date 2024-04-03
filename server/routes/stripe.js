import { Router } from "express";
import jwt from 'jsonwebtoken'
import Stripe from 'stripe';

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
    return_url: 'https://dentaladvisor.ai/return?session_id={CHECKOUT_SESSION_ID}'
  });

  res.send({clientSecret: session.client_secret});
});
router.get('/session_status', async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.query.session_id);
    
    res.send({
      status: session.status,
      payment_status: session.payment_status,
      customer_email: session.customer_details.email
    });
  });
export default router
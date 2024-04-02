import { Router } from "express";
import jwt from 'jsonwebtoken'

let router = Router()
const CheckUser = async (req, res, next) => {
    jwt.verify(req.cookies?.userToken, process.env.JWT_PRIVATE_KEY, async (err, decoded) => {
        if (decoded) {
            let userData = null

            try {
                userData = await user.checkUserFound(decoded)
            } catch (err) {
                if (err?.notExists) {
                    res.clearCookie('userToken')
                        .status(405).json({
                            status: 405,
                            message: err?.text
                        })
                } else {
                    res.status(500).json({
                        status: 500,
                        message: err
                    })
                }
            } finally {
                if (userData) {
                    req.body.userId = userData._id
                    next()
                }
            }

        } else {
            res.status(405).json({
                status: 405,
                message: 'Not Logged'
            })
        }
    })
}
import Stripe from 'stripe';
const stripe = new Stripe(process.env.VITE_SERVER_STRIPE_KEY);

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    line_items: [{
      price_data: {
        currency: 'inr',
        product_data: {
          name: 'Plus Membership',
        },
        unit_amount: 3000,
      },
      quantity: 1,
    }],
    mode: 'payment',
    ui_mode: 'embedded',
    return_url: 'https://dentaladvisor.ai/checkout/return?session_id={CHECKOUT_SESSION_ID}'
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
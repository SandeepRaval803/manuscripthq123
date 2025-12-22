import Stripe from 'stripe';

const stripe = new Stripe(
  process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY ||
    "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"
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { priceId, successUrl, cancelUrl } = req.body;

    if (!priceId) {
      return res.status(400).json({ message: 'Price ID is required' });
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: (successUrl || `${req.headers.origin}/dashboard/subscription?success=true`) + 
        `&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${req.headers.origin}/dashboard/subscription`,
      customer_email: req.body.email, // Optional: if you want to pre-fill email
      billing_address_collection: 'auto',
      allow_promotion_codes: true,
    });

    res.status(200).json({ url: session.url });
  } catch (error) {
    console.error('Stripe checkout session error:', error);
    res.status(500).json({ message: 'Failed to create checkout session' });
  }
}

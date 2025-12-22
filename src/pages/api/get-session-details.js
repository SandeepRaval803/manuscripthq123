import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_51RVZq0QUj8ZoemtOWekA9kntd9w9pWhd8foZcPfjqoTxIOHfWq1D8ZaIFC15l1xDDrmYHvwC1Mw7KBPvDdTZDF1A00KOt4PHnP');

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { sessionId } = req.query;

    if (!sessionId) {
      return res.status(400).json({ message: 'Session ID is required' });
    }

    // Retrieve the checkout session
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['subscription', 'customer']
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    // Extract customer and subscription IDs
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    res.status(200).json({
      customerId: typeof customerId === 'string' ? customerId : customerId?.id,
      subscriptionId: typeof subscriptionId === 'string' ? subscriptionId : subscriptionId?.id,
      session: session
    });
  } catch (error) {
    console.error('Error retrieving session details:', error);
    res.status(500).json({ message: 'Failed to retrieve session details' });
  }
}

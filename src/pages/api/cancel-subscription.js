import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { token } = req.headers;
    
    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    // Get user's subscription ID from your backend
    const userResponse = await fetch('https://apis.manuscripthq.com/api/user/profile', {
      method: 'GET',
      headers: {
        'auth-token': token
      }
    });

    if (!userResponse.ok) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    const userData = await userResponse.json();
    const subscriptionId = userData.subscriptionId; // Adjust based on your API response structure

    if (!subscriptionId) {
      return res.status(400).json({ message: 'No active subscription found' });
    }

    // Cancel the subscription in Stripe
    const subscription = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true
    });

    // Update user's subscription status in your backend
    const updateResponse = await fetch('https://apis.manuscripthq.com/api/user/update-subscription', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'auth-token': token
      },
      body: JSON.stringify({
        subscription: 'Free',
        subscriptionId: null
      })
    });

    if (!updateResponse.ok) {
      console.warn('Failed to update user subscription status in backend');
    }

    return res.status(200).json({ 
      message: 'Subscription cancelled successfully',
      subscription: subscription
    });

  } catch (error) {
    console.error('Error cancelling subscription:', error);
    return res.status(500).json({ 
      message: 'Failed to cancel subscription',
      error: error.message 
    });
  }
}

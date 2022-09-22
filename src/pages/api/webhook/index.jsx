import { PrismaClient } from '@prisma/client';

import { buffer } from 'micro';
import Cors from 'micro-cors';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2022-08-01',
});

// Stripe requires the raw body to construct the event.
export const config = {
  api: {
    bodyParser: false,
  },
};

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

const webhookHandler = async (req, res) => {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature'];

    let event;

    try {
      event = stripe.webhooks.constructEvent(
        buf.toString(),
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      // On error, log and return the error message.
      console.log(`❌ Error message: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Successfully constructed event.
    console.log('✅ Success:', event.id);

	if ( event.type === 'checkout.session.completed' ) {
		const id = event.data.object.client_reference_id;
		const prisma = new PrismaClient();
		const payment = await prisma.entranceFeeRecord.update({
			where: {
				id: id
			},
			data: {
				session: event.data.object.id,
				completed: true
			}
		});
	} else {
		console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
	}

    // Return a response to acknowledge receipt of the event.
    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
};

export default cors(webhookHandler);

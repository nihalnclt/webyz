import { FastifyReply, FastifyRequest } from "fastify";

export const checkoutController = async (req, reply) => {
  const userId = req.user.id;
  const { planId } = req.body;

  const url = await billing.createCheckoutSession(userId, planId);
  reply.send({ url });
};

export const portalController = async (req, reply) => {
  const url = await billing.createBillingPortal(req.user.id);
  reply.send({ url });
};

export const cancelController = async (req, reply) => {
  await billing.cancelSubscription(req.user.id);
  reply.send({ success: true });
};

export const resumeController = async (req, reply) => {
  await billing.resumeSubscription(req.user.id);
  reply.send({ success: true });
};

export const mySubController = async (req, reply) => {
  const data = await billing.getMySubscription(req.user.id);
  reply.send(data);
};

export const stripeWebhookController = async (req, reply) => {
  const sig = req.headers["stripe-signature"];

  const event = stripe.webhooks.constructEvent(
    req.rawBody,
    sig,
    process.env.STRIPE_WEBHOOK_SECRET,
  );

  await handleStripeWebhook(event);

  reply.send({ received: true });
};

// fastify.post("/billing/checkout", { preHandler: [fastify.authenticate] }, checkoutController);

//   fastify.get("/billing/portal", { preHandler: [fastify.authenticate] }, portalController);

//   fastify.post("/billing/cancel", { preHandler: [fastify.authenticate] }, cancelController);

//   fastify.post("/billing/resume", { preHandler: [fastify.authenticate] }, resumeController);

//   fastify.get("/billing/me", { preHandler: [fastify.authenticate] }, mySubController);

// fastify.post("/stripe/webhook", stripeWebhookController);
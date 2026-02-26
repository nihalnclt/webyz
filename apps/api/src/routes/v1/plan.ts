export default async function (fastify: any) {
  fastify.get("/plans", getPlansController);

  fastify.get(
    "/plans/me",
    { preHandler: [fastify.authenticate] },
    getCurrentUserPlanController,
  );

  fastify.post("/plans", createPlanController);
  fastify.put("/plans/:id", updatePlanController);
  fastify.delete("/plans/:id", deactivatePlanController);
  fastify.get("/plans/:id", getPlanController);
}

import { FastifyReply, FastifyRequest } from "fastify";

export const createPlanController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const plan = await createPlan(req.body as any);
    return reply.send(plan);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
};

export const updatePlanController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { id } = req.params as { id: string };
    const plan = await planService.updatePlan(id, req.body as any);
    return reply.send(plan);
  } catch (err: any) {
    return reply.status(400).send({ error: err.message });
  }
};

export const getPlansController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const plans = await planService.getAllActivePlans();
  return reply.send(plans);
};

export const getPlanController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = req.params as { id: string };
  const plan = await planService.getPlanById(id);

  if (!plan) return reply.status(404).send({ error: "Plan not found" });

  return reply.send(plan);
};

export const deactivatePlanController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const { id } = req.params as { id: string };
  const plan = await planService.deactivatePlan(id);
  return reply.send(plan);
};

export const getCurrentUserPlanController = async (
  req: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = (req as any).user.id;
  const user = await planService.getUserPlan(userId);

  return reply.send(user?.plan);
};

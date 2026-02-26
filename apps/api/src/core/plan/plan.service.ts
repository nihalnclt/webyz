interface CreatePlanInput {
  name: string;
  description?: string;
  monthlyPrice: number;
  yearlyPrice: number;
  eventLimit: number;
  extraPricePer100k?: number;
  stripePriceMonthlyId?: string;
  stripePriceYearlyId?: string;
  isFree?: boolean;
}

export const createPlan = async (data: CreatePlanInput) => {
  if (data.isFree) {
    const existingFree = await prisma.plan.findFirst({
      where: { isFree: true },
    });
    if (existingFree) {
      throw new Error("Free plan already exists");
    }
  }

  return prisma.plan.create({ data });
};

export const updatePlan = async (planId: string, data: Partial<CreatePlanInput>) => {
  return prisma.plan.update({
    where: { id: planId },
    data,
  });
};

export const getAllActivePlans = async () => {
  return prisma.plan.findMany({
    where: { isActive: true },
    orderBy: { monthlyPrice: "asc" },
  });
};

export const getPlanById = async (planId: string) => {
  return prisma.plan.findUnique({
    where: { id: planId },
  });
};

export const deactivatePlan = async (planId: string) => {
  return prisma.plan.update({
    where: { id: planId },
    data: { isActive: false },
  });
};

export const getUserPlan = async (userId: string) => {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { plan: true },
  });
};

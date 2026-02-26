import { AppContext } from "../context.js";

interface CreateWebsiteInput {
  name: string;
  domain: string;
  timezone: string;
}

export const createWebsite = async (
  { prisma }: AppContext,
  userId: string,
  input: CreateWebsiteInput,
) => {
  const website = await prisma.website.create({
    data: {
      name: input.name,
      domain: input.domain,
      timezone: input.timezone,
      userId,
    },
  });

  return website;
};

export const listWebsites = async ({ prisma }: AppContext, userId: string) => {
  return prisma.website.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
  });
};

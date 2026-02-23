import { createWebsiteQuery } from "../../db/clickhouse/website.js";
import { AppContext } from "../context.js";

interface CreateWebsiteInput {
  name: string;
  domain: string;
  timezone: string;
}

export const createWebsite = async (
  { prisma, clickhouse }: AppContext,
  input: CreateWebsiteInput,
) => {
  const website = await prisma.website.create({
    data: {
      name: input.name,
      domain: input.domain,
      timezone: input.timezone,
    },
  });

  // await createWebsiteQuery(
  //   clickhouse,
  //   website.id,
  //   website.domain,
  //   website.timezone,
  // );

  return website;
};

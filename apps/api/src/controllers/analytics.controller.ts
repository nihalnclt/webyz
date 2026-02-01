import { FastifyReply, FastifyRequest } from "fastify";

import { resolvePeriod } from "../core/analytics/period.js";
import { getBrowsersStats } from "../core/analytics/browsers.js";

export const getBrowsersStatsController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  try {
    const { siteId } = request.params as { siteId: string };
    const {
      period,
      date,
      from,
      to,
      limit = 10,
      page = 1,
      detailed = "false",
    } = request.query as {
      period: string;
      date: string;
      from?: string;
      to?: string;
      limit?: number;
      page?: number;
      detailed?: string;
    };

    console.log("range");

    const range = resolvePeriod({ period, date, from, to });

    console.log("range", range);

    const data = await getBrowsersStats({
      request,
      websiteId: siteId,
      from: range.from,
      to: range.to,
      limit: Number(limit),
      page: Number(page),
      detailed: detailed === "true",
    });

    return reply.send(data);
  } catch (error) {
    console.log(error)
    reply.status(500).send({ error: "Internal Server Error" });
  }
};

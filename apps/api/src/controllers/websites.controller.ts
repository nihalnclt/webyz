import { FastifyReply, FastifyRequest } from "fastify";

import { createWebsite } from "../core/website/create-website.js";
import { sendResponse } from "../http/helper/send-response.js";

export const createWebsiteController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const body = request.body as {
    name: string;
    domain: string;
    timezone: string;
  };

  const website = await createWebsite(request.ctx, body);

  sendResponse(reply, website);
};

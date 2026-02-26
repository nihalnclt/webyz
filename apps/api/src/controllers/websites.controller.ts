import { FastifyReply, FastifyRequest } from "fastify";

import { createWebsite } from "../core/website/create-website.js";
import { sendResponse } from "../http/helper/send-response.js";
import { listWebsites } from "../core/website/list-website.js";

export const createWebsiteController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const body = request.body as {
    name: string;
    domain: string;
    timezone: string;
  };

  const userId = request.session.userId;

  const website = await createWebsite(request.ctx, userId, body);

  sendResponse(reply, website);
};

export const listWebsitesController = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const userId = request.session.userId;

  const websites = await listWebsites(request.ctx, userId);

  sendResponse(reply, websites);
};

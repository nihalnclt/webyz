export const createWebsiteBodySchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 120,
    },
    domain: {
      type: "string",
      minLength: 3,
      maxLength: 255,
    },
    timezone: {
      type: "string",
      minLength: 2,
      maxLength: 64,
      default: "UTC",
    },
  },

  required: ["name", "domain"],
  additionalProperties: false,
};

export const websiteParamsSchema = {
  type: "object",
  properties: {
    id: { type: "string", minLength: 10 },
  },
  required: ["id"],
};

export const updateWebsiteBodySchema = {
  type: "object",
  properties: {
    name: {
      type: "string",
      minLength: 1,
      maxLength: 120,
    },
    domain: {
      type: "string",
      minLength: 3,
      maxLength: 255,
    },
    timezone: {
      type: "string",
      minLength: 2,
      maxLength: 64,
    },
  },

  additionalProperties: false,
};

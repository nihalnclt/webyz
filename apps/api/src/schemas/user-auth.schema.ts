export const signupUserBodySchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 8 },
    name: { type: "string", minLength: 1, maxLength: 100 },
  },
  required: ["email", "password", "name"],
  additionalProperties: false,
};

export const loginUserBodySchema = {
  type: "object",
  required: ["email", "password"],
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string" },
  },
  additionalProperties: false,
};

export const changePassBodySchema = {
  type: "object",
  required: ["currentPassword", "newPassword"],
  properties: {
    currentPassword: { type: "string" },
    newPassword: { type: "string", minLength: 8 },
  },
  additionalProperties: false,
};


export const logoutQuerySchema = {
  type: "object",
  properties: {
    all: { type: "string", enum: ["true", "false"] },
  },
  additionalProperties: false,
};

export const browsersStatsQuerySchema = {
  type: "object",
  properties: {
    period: { type: "string", enum: [""] },
    date: { type: "string", format: "date" },
    from: { type: "string", format: "date" },
    to: { type: "string", format: "date" },

    limit: {
      type: "integer",
      minimum: 1,
      maximum: 100,
      default: 10,
    },
    page: {
      type: "integer",
      minimum: 1,
      default: 1,
    },

    detailed: { type: "string", enum: ["true", "false"], default: "false" },
  },
  required: ["period"],
  allOf: [
    {
      if: {
        properties: { period: { const: "custom" } },
      },
      then: {
        required: ["from", "to"],
      },
    },
  ],
};

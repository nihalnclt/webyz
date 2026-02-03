import { Static, Type } from "@sinclair/typebox";

export const trackingSchema = Type.Object(
  {
    t: Type.Union([Type.Literal("pageview"), Type.Literal("event")]),
    sid: Type.String({ minLength: 1, maxLength: 100 }),
    vid: Type.String({ minLength: 1 }),
    ssid: Type.String({ minLength: 1 }),
    pid: Type.Optional(Type.String()),
    url: Type.Optional(Type.String({ maxLength: 2048 })),
    path: Type.Optional(Type.String({ maxLength: 1024 })),
    ref: Type.Optional(Type.String({ maxLength: 2048 })),
    title: Type.Optional(Type.String({ maxLength: 500 })),
    lang: Type.Optional(Type.String({ maxLength: 10 })),
    screen: Type.Optional(Type.String({ pattern: "^[0-9]+x[0-9]+$" })),
    ts: Type.Number(),
    new_visitor: Type.Optional(Type.Union([Type.Literal(0), Type.Literal(1)])),
    new_session: Type.Optional(Type.Union([Type.Literal(0), Type.Literal(1)])),
    name: Type.Optional(Type.String({ maxLength: 100 })),
  },
  { additionalProperties: true },
);

export type TrackingRequest = Static<typeof trackingSchema>;

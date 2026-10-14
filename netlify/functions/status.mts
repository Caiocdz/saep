import type { Config } from "@netlify/functions";

export default async () => {
  return Response.json({ mensagem: "API funcionando" });
};

export const config: Config = {
  path: "/api/status",
};

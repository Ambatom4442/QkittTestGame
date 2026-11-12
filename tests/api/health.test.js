import { describe, expect, it } from "vitest";
import { buildServer } from "../../server/src/buildServer.js";

describe("api health", () => {
  it("returns 200 from /api/health", async () => {
    const server = buildServer({ logger: false });

    try {
      const response = await server.inject({ method: "GET", url: "/api/health" });
      expect(response.statusCode).toBe(200);
      expect(response.json()).toEqual({ status: "ok" });
    } finally {
      await server.close();
    }
  });
});

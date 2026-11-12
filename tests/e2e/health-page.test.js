import { describe, expect, it } from "vitest";
import { buildServer } from "../../server/src/buildServer.js";

describe("health-page", () => {
  it("serves built client and health endpoint", async () => {
    const server = buildServer({ logger: false });

    try {
      await server.listen({ host: "127.0.0.1", port: 0 });
      const address = server.server.address();
      if (!address || typeof address === "string") {
        throw new Error("Failed to resolve server port");
      }

      const rootResponse = await fetch(`http://127.0.0.1:${address.port}/`);
      expect(rootResponse.status).toBe(200);
      await expect(rootResponse.text()).resolves.toContain("Q-Game");

      const healthResponse = await fetch(`http://127.0.0.1:${address.port}/api/health`);
      expect(healthResponse.status).toBe(200);
      await expect(healthResponse.json()).resolves.toEqual({ status: "ok" });
    } finally {
      await server.close();
    }
  });
});

import { describe, expect, it } from "vitest";
import { buildServer } from "../../server/src/buildServer.js";

describe("test-mode-hook", () => {
  it("serves boot assets and test-mode client config", async () => {
    const server = buildServer({ logger: false, testModeEnabled: true });

    try {
      await server.listen({ host: "127.0.0.1", port: 0 });
      const address = server.server.address();
      if (!address || typeof address === "string") {
        throw new Error("Failed to resolve server port");
      }

      const configResponse = await fetch(`http://127.0.0.1:${address.port}/api/client-config`);
      expect(configResponse.status).toBe(200);
      await expect(configResponse.json()).resolves.toEqual({ testModeEnabled: true });

      const pageResponse = await fetch(`http://127.0.0.1:${address.port}/?test=1`);
      expect(pageResponse.status).toBe(200);
      await expect(pageResponse.text()).resolves.toContain('/client.boot.js');

      const bootScriptResponse = await fetch(`http://127.0.0.1:${address.port}/client.boot.js`);
      expect(bootScriptResponse.status).toBe(200);
      await expect(bootScriptResponse.text()).resolves.toContain("bootClient");

      const threeResponse = await fetch(`http://127.0.0.1:${address.port}/vendor/three.module.js`);
      expect(threeResponse.status).toBe(200);
      await expect(threeResponse.text()).resolves.toContain("THREE.WebGLRenderer");
    } finally {
      await server.close();
    }
  });
});

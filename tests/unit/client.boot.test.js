import { describe, expect, it } from "vitest";
import { bootClient } from "../../client/build/client.boot.core.js";

class FakeScene {
  constructor() {
    this.children = [];
    this.background = null;
  }

  add(value) {
    this.children.push(value);
  }
}

class FakePerspectiveCamera {
  constructor() {
    this.position = {
      x: 0,
      y: 0,
      z: 0,
      set: (x, y, z) => {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
      }
    };
    this.rotation = { y: 0 };
  }
}

class FakeDirectionalLight {
  constructor(color, intensity) {
    this.color = color;
    this.intensity = intensity;
    this.position = {
      x: 0,
      y: 0,
      z: 0,
      set: (x, y, z) => {
        this.position.x = x;
        this.position.y = y;
        this.position.z = z;
      }
    };
  }
}

class FakeWebGLRenderer {
  constructor({ canvas }) {
    this.canvas = canvas;
    this.pixelRatio = null;
    this.size = null;
    this.renderCalls = 0;
  }

  setPixelRatio(value) {
    this.pixelRatio = value;
  }

  setSize(width, height, updateStyle) {
    this.size = { width, height, updateStyle };
  }

  render() {
    this.renderCalls += 1;
  }
}

const fakeThree = {
  AmbientLight: class FakeAmbientLight {
    constructor(color, intensity) {
      this.color = color;
      this.intensity = intensity;
    }
  },
  BoxGeometry: class FakeBoxGeometry {
    constructor(width, height, depth) {
      this.width = width;
      this.height = height;
      this.depth = depth;
    }
  },
  Color: class FakeColor {
    constructor(value) {
      this.value = value;
    }
  },
  DirectionalLight: FakeDirectionalLight,
  Mesh: class FakeMesh {
    constructor(geometry, material) {
      this.geometry = geometry;
      this.material = material;
    }
  },
  MeshStandardMaterial: class FakeMaterial {
    constructor(options) {
      this.options = options;
    }
  },
  PerspectiveCamera: FakePerspectiveCamera,
  Scene: FakeScene,
  WebGLRenderer: FakeWebGLRenderer
};

function createEnvironment(search = "") {
  const canvas = { width: 960, height: 540 };
  const documentRef = {
    getElementById: (id) => (id === "qgame-canvas" ? canvas : null)
  };
  const windowRef = {
    location: { search },
    innerWidth: 960,
    innerHeight: 540,
    devicePixelRatio: 1.5
  };

  return { canvas, documentRef, windowRef };
}

describe("client.boot", () => {
  it("boots a Three.js scene and renders one frame", async () => {
    const { documentRef, windowRef } = createEnvironment();

    const result = await bootClient({
      THREE: fakeThree,
      windowRef,
      documentRef,
      fetchConfig: async () => ({ testModeEnabled: false })
    });

    expect(result.scene.children).toHaveLength(3);
    expect(result.camera.position).toMatchObject({ x: 0, y: 1.6, z: 3 });
    expect(result.renderer.renderCalls).toBe(1);
    expect(result.state).toMatchObject({
      sceneId: "boot-scene",
      testMode: false,
      player: {
        position: { x: 0, y: 1.6, z: 3 },
        yaw: 0
      }
    });
    expect(Object.prototype.hasOwnProperty.call(windowRef, "__qgame")).toBe(false);
  });

  it("enables window.__qgame in server-approved test mode", async () => {
    const { documentRef, windowRef } = createEnvironment("?test=1");

    await bootClient({
      THREE: fakeThree,
      windowRef,
      documentRef,
      fetchConfig: async () => ({ testModeEnabled: true })
    });

    expect(windowRef.__qgame.state()).toMatchObject({
      sceneId: "boot-scene",
      testMode: true,
      lastSpawnId: null,
      skippedAnimations: 0,
      player: {
        position: { x: 0, y: 1.6, z: 3 },
        yaw: 0
      }
    });
    expect(windowRef.__qgame.teleport("spawn-a")).toBe("spawn-a");
    expect(windowRef.__qgame.interact("bell-pull", "pull")).toEqual({ objectId: "bell-pull", action: "pull" });
    expect(windowRef.__qgame.moveTo(2, -1.5)).toMatchObject({ x: 2, y: 1.6, z: -1.5 });
    expect(windowRef.__qgame.skipAnimations()).toBe(1);
    expect(windowRef.__qgame.fps()).toBe(60);
    expect(windowRef.__qgame.state()).toMatchObject({
      lastSpawnId: "spawn-a",
      lastInteraction: { objectId: "bell-pull", action: "pull" },
      skippedAnimations: 1,
      player: {
        position: { x: 2, y: 1.6, z: -1.5 },
        yaw: 0
      }
    });
  });

  it("moves with WASD and blocks movement through room bounds", async () => {
    const { documentRef, windowRef } = createEnvironment();

    const result = await bootClient({
      THREE: fakeThree,
      windowRef,
      documentRef,
      fetchConfig: async () => ({ testModeEnabled: false })
    });

    result.movement.pressKey("KeyW");
    result.movement.step(0.5);
    result.movement.releaseKey("KeyW");
    expect(result.state.player.position.z).toBeLessThan(3);

    result.state.player.position.z = -3.7;
    result.movement.pressKey("KeyW");
    result.movement.step(1);
    result.movement.releaseKey("KeyW");
    expect(result.state.player.position.z).toBeGreaterThanOrEqual(-3.75);
  });

  it("supports click-to-move while preventing entry into blockers", async () => {
    const { documentRef, windowRef } = createEnvironment();

    const result = await bootClient({
      THREE: fakeThree,
      windowRef,
      documentRef,
      fetchConfig: async () => ({ testModeEnabled: false })
    });

    result.movement.clickToMove(2.5, -2.5);
    expect(result.state.player.position).toMatchObject({ x: 2.5, z: -2.5 });

    result.movement.clickToMove(0, 0);
    expect(result.state.player.position).not.toMatchObject({ x: 0, z: 0 });
  });
});


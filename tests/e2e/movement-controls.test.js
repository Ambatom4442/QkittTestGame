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
  }

  setPixelRatio() {}

  setSize() {}

  render() {}
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

function createEventTarget(base = {}) {
  const listeners = new Map();

  return {
    ...base,
    addEventListener(type, listener) {
      const handlers = listeners.get(type) ?? [];
      handlers.push(listener);
      listeners.set(type, handlers);
    },
    removeEventListener(type, listener) {
      const handlers = listeners.get(type) ?? [];
      listeners.set(
        type,
        handlers.filter((candidate) => candidate !== listener)
      );
    },
    dispatchEvent(type, event = {}) {
      const handlers = listeners.get(type) ?? [];
      for (const handler of handlers) {
        handler(event);
      }
    }
  };
}

function createEnvironment(search = "") {
  const canvas = createEventTarget({ width: 960, height: 540 });
  const documentRef = {
    getElementById: (id) => (id === "qgame-canvas" ? canvas : null)
  };
  const windowRef = createEventTarget({
    location: { search },
    innerWidth: 960,
    innerHeight: 540,
    devicePixelRatio: 1.5
  });

  return { canvas, documentRef, windowRef };
}

describe("movement-controls", () => {
  it("handles first-person movement, collision bounds, and click-to-move markers", async () => {
    const { canvas, documentRef, windowRef } = createEnvironment();

    const result = await bootClient({
      THREE: fakeThree,
      windowRef,
      documentRef,
      fetchConfig: async () => ({ testModeEnabled: false })
    });

    const startZ = result.state.player.position.z;

    windowRef.dispatchEvent("keydown", { code: "KeyW" });
    result.movement.step(0.5);
    windowRef.dispatchEvent("keyup", { code: "KeyW" });
    expect(result.state.player.position.z).toBeLessThan(startZ);

    result.state.player.position.z = -3.7;
    windowRef.dispatchEvent("keydown", { code: "KeyW" });
    result.movement.step(1.0);
    windowRef.dispatchEvent("keyup", { code: "KeyW" });
    expect(result.state.player.position.z).toBeGreaterThanOrEqual(-3.75);

    canvas.dispatchEvent("click", {
      target: {
        dataset: {
          floorMarker: "1",
          x: "2.25",
          z: "-2.25"
        }
      }
    });

    expect(result.state.player.position).toMatchObject({ x: 2.25, z: -2.25 });

    canvas.dispatchEvent("click", {
      target: {
        dataset: {
          floorMarker: "1",
          x: "0",
          z: "0"
        }
      }
    });

    expect(result.state.player.position).not.toMatchObject({ x: 0, z: 0 });

    result.movement.dispose();
  });
});


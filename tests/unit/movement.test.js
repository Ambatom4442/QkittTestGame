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

  return { documentRef, windowRef };
}

describe("movement", () => {
  it("moves forward and collides with room bounds", async () => {
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
    result.movement.step(1.0);
    result.movement.releaseKey("KeyW");
    expect(result.state.player.position.z).toBeGreaterThanOrEqual(-3.75);
  });

  it("moves to click markers while respecting blockers", async () => {
    const { documentRef, windowRef } = createEnvironment();

    const result = await bootClient({
      THREE: fakeThree,
      windowRef,
      documentRef,
      fetchConfig: async () => ({ testModeEnabled: false })
    });

    result.movement.clickToMove(3.2, -2.8);
    expect(result.state.player.position).toMatchObject({ x: 3.2, z: -2.8 });

    result.movement.clickToMove(0, 0);
    expect(result.state.player.position).not.toMatchObject({ x: 0, z: 0 });
  });
});


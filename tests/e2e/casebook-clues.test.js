import { mkdtempSync, rmSync } from "node:fs";
import { join } from "node:path";
import { tmpdir } from "node:os";
import { afterEach, describe, expect, it } from "vitest";
import { buildServer } from "../../server/src/buildServer.js";
import { closeDatabase, openDatabase } from "../../server/src/db/sqlite.js";
import { bootClient } from "../../client/build/client.boot.core.js";

const tempDirectories = [];

afterEach(() => {
  for (const directory of tempDirectories.splice(0, tempDirectories.length)) {
    rmSync(directory, { recursive: true, force: true });
  }
});

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
  constructor() {}

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

function createToggleElement() {
  let clickHandler = null;
  const attributes = new Map();

  return {
    dataset: {},
    addEventListener(type, handler) {
      if (type === "click") {
        clickHandler = handler;
      }
    },
    click() {
      if (clickHandler) {
        clickHandler();
      }
    },
    setAttribute(name, value) {
      attributes.set(name, String(value));
    },
    getAttribute(name) {
      return attributes.get(name) ?? null;
    }
  };
}

function createDocumentHarness() {
  const casebookList = {
    innerHTML: "",
    children: [],
    appendChild(child) {
      this.children.push(child);
    }
  };

  const interactablesList = {
    innerHTML: "",
    children: [],
    appendChild(child) {
      this.children.push(child);
    }
  };

  const casebookPanel = { hidden: true };
  const casebookToggle = createToggleElement();
  const canvas = { width: 960, height: 540 };

  const documentRef = {
    createElement: () => ({ dataset: {}, textContent: "" }),
    getElementById(id) {
      if (id === "qgame-canvas") {
        return canvas;
      }

      if (id === "qgame-interactables") {
        return interactablesList;
      }

      if (id === "qgame-casebook") {
        return casebookPanel;
      }

      if (id === "qgame-casebook-toggle") {
        return casebookToggle;
      }

      if (id === "qgame-casebook-clues") {
        return casebookList;
      }

      return null;
    }
  };

  return {
    canvas,
    casebookList,
    casebookPanel,
    casebookToggle,
    documentRef,
    interactablesList
  };
}

describe("casebook-clues", () => {
  it("opens casebook and lists collected clues exactly once", async () => {
    const tempDirectory = mkdtempSync(join(tmpdir(), "qgame-casebook-clues-"));
    tempDirectories.push(tempDirectory);

    const db = openDatabase({ dbPath: join(tempDirectory, "qgame.db") });
    const server = buildServer({ logger: false, db, testModeEnabled: true });

    try {
      const profileResponse = await server.inject({
        method: "POST",
        url: "/api/profiles",
        payload: { name: "Helen" }
      });
      const profile = profileResponse.json();

      const gameResponse = await server.inject({
        method: "POST",
        url: "/api/games",
        payload: { profileId: profile.id, slot: 1, caseId: "speckled-band" }
      });
      const game = gameResponse.json();

      const interactions = [
        { objectId: "barred-shutters", action: "inspect" },
        { objectId: "barred-shutters", action: "inspect" },
        { objectId: "ventilator", action: "inspect" },
        { objectId: "bed-frame", action: "inspect" }
      ];

      for (const interaction of interactions) {
        const response = await server.inject({
          method: "POST",
          url: `/api/games/${game.id}/interact`,
          payload: {
            sceneId: "L-06",
            objectId: interaction.objectId,
            action: interaction.action
          }
        });

        expect(response.statusCode).toBe(200);
      }

      const { casebookList, casebookPanel, casebookToggle, documentRef } = createDocumentHarness();
      const windowRef = {
        location: { search: `?test=1&game=${game.id}` },
        innerWidth: 960,
        innerHeight: 540,
        devicePixelRatio: 1.5
      };

      const client = await bootClient({
        THREE: fakeThree,
        windowRef,
        documentRef,
        fetchConfig: async () => ({ testModeEnabled: true }),
        fetchScene: async () => (await server.inject({ method: "GET", url: "/api/scenes/L-06" })).json(),
        fetchCasebook: async (gameId) => (await server.inject({ method: "GET", url: `/api/games/${gameId}/casebook` })).json(),
        gameId: game.id
      });

      const clueIds = client.state.casebookClues.map((clue) => clue.id);
      expect(clueIds).toEqual(["E-07", "E-10", "E-11"]);
      expect(casebookList.children).toHaveLength(3);

      expect(casebookPanel.hidden).toBe(true);
      casebookToggle.click();
      expect(casebookPanel.hidden).toBe(false);
      expect(casebookToggle.getAttribute("aria-expanded")).toBe("true");
    } finally {
      await server.close();
      closeDatabase(db);
    }
  });
});

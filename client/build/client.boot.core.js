function cloneState(state) {
  return {
    sceneId: state.sceneId,
    testMode: state.testMode,
    lastSpawnId: state.lastSpawnId,
    lastInteraction: state.lastInteraction,
    skippedAnimations: state.skippedAnimations
  };
}

function createTestHook(state) {
  return Object.freeze({
    state() {
      return Object.freeze(cloneState(state));
    },
    teleport(spawnId) {
      state.lastSpawnId = String(spawnId);
      return state.lastSpawnId;
    },
    interact(objectId, action) {
      state.lastInteraction = {
        objectId: String(objectId),
        action: String(action)
      };
      return Object.freeze({ ...state.lastInteraction });
    },
    skipAnimations() {
      state.skippedAnimations += 1;
      return state.skippedAnimations;
    },
    fps() {
      return 60;
    }
  });
}

function makeRenderer(THREE, canvas, windowRef) {
  if (!canvas || typeof canvas !== "object") {
    return null;
  }

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas
  });

  const width = Number(canvas.width) || Number(windowRef.innerWidth) || 960;
  const height = Number(canvas.height) || Number(windowRef.innerHeight) || 540;

  renderer.setPixelRatio(Number(windowRef.devicePixelRatio) || 1);
  renderer.setSize(width, height, false);

  return renderer;
}

function createScene(THREE) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x101820);

  const camera = new THREE.PerspectiveCamera(60, 16 / 9, 0.1, 100);
  camera.position.set(0, 1.6, 3);

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshStandardMaterial({ color: 0x1f7a8c })
  );
  scene.add(cube);

  const keyLight = new THREE.DirectionalLight(0xffffff, 1.25);
  keyLight.position.set(1.5, 2, 2);
  scene.add(keyLight);
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));

  return { camera, scene };
}

function isTestModeEnabled(search, serverConfig) {
  if (!serverConfig || serverConfig.testModeEnabled !== true) {
    return false;
  }

  const params = new URLSearchParams(search ?? "");
  return params.get("test") === "1";
}

export async function bootClient({ THREE, windowRef, documentRef, fetchConfig }) {
  const config = await fetchConfig();
  const { camera, scene } = createScene(THREE);
  const canvas = documentRef.getElementById("qgame-canvas");
  const renderer = makeRenderer(THREE, canvas, windowRef);

  if (renderer) {
    renderer.render(scene, camera);
  }

  const state = {
    sceneId: "boot-scene",
    testMode: isTestModeEnabled(windowRef.location?.search, config),
    lastSpawnId: null,
    lastInteraction: null,
    skippedAnimations: 0
  };

  if (state.testMode) {
    Object.defineProperty(windowRef, "__qgame", {
      value: createTestHook(state),
      configurable: true,
      enumerable: false,
      writable: false
    });
  } else if (Object.prototype.hasOwnProperty.call(windowRef, "__qgame")) {
    delete windowRef.__qgame;
  }

  return { camera, renderer, scene, state };
}

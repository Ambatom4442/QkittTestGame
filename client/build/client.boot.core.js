function cloneState(state) {
  return {
    sceneId: state.sceneId,
    testMode: state.testMode,
    lastSpawnId: state.lastSpawnId,
    lastInteraction: state.lastInteraction,
    skippedAnimations: state.skippedAnimations,
    player: {
      position: { ...state.player.position },
      yaw: state.player.yaw
    },
    interactables: state.interactables.map((interactable) => ({ ...interactable }))
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
    moveTo(x, z) {
      state.player.position.x = Number(x);
      state.player.position.z = Number(z);
      return Object.freeze({ ...state.player.position });
    },
    interactables() {
      return state.interactables.map((interactable) => Object.freeze({ ...interactable }));
    },
    fps() {
      return 60;
    }
  });
}

const PLAYER_RADIUS = 0.25;
const MOVE_SPEED_METERS_PER_SECOND = 3;
const ROOM_MIN = -4;
const ROOM_MAX = 4;
const BLOCKERS = [{ minX: -0.75, maxX: 0.75, minZ: -0.75, maxZ: 0.75 }];

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function isBlocked(x, z) {
  return BLOCKERS.some(
    (blocker) => x >= blocker.minX - PLAYER_RADIUS
      && x <= blocker.maxX + PLAYER_RADIUS
      && z >= blocker.minZ - PLAYER_RADIUS
      && z <= blocker.maxZ + PLAYER_RADIUS
  );
}

function resolveMovement(currentPosition, deltaX, deltaZ) {
  const next = { x: currentPosition.x, z: currentPosition.z };

  const targetX = clamp(next.x + deltaX, ROOM_MIN + PLAYER_RADIUS, ROOM_MAX - PLAYER_RADIUS);
  if (!isBlocked(targetX, next.z)) {
    next.x = targetX;
  }

  const targetZ = clamp(next.z + deltaZ, ROOM_MIN + PLAYER_RADIUS, ROOM_MAX - PLAYER_RADIUS);
  if (!isBlocked(next.x, targetZ)) {
    next.z = targetZ;
  }

  return next;
}

function parseMarkerTarget(target) {
  if (!target || typeof target !== "object") {
    return null;
  }

  const dataset = target.dataset;
  if (!dataset || dataset.floorMarker !== "1") {
    return null;
  }

  const x = Number(dataset.x);
  const z = Number(dataset.z);
  if (!Number.isFinite(x) || !Number.isFinite(z)) {
    return null;
  }

  return { x, z };
}

function createMovementController({ state, camera, windowRef, canvas }) {
  const pressedKeys = new Set();

  function syncCameraPosition() {
    if (camera?.position?.set) {
      camera.position.set(state.player.position.x, state.player.position.y, state.player.position.z);
    }

    if (camera?.rotation && typeof camera.rotation === "object") {
      camera.rotation.y = state.player.yaw;
    }
  }

  function applyStep(deltaSeconds) {
    const delta = Math.max(0, Number(deltaSeconds) || 0);
    if (delta === 0) {
      syncCameraPosition();
      return;
    }

    const moveForward = Number(pressedKeys.has("KeyW")) - Number(pressedKeys.has("KeyS"));
    const moveRight = Number(pressedKeys.has("KeyD")) - Number(pressedKeys.has("KeyA"));

    if (moveForward === 0 && moveRight === 0) {
      syncCameraPosition();
      return;
    }

    const yaw = state.player.yaw;
    const forwardX = Math.sin(yaw);
    const forwardZ = -Math.cos(yaw);
    const strafeX = Math.cos(yaw);
    const strafeZ = Math.sin(yaw);
    const distance = MOVE_SPEED_METERS_PER_SECOND * delta;
    const deltaX = (forwardX * moveForward + strafeX * moveRight) * distance;
    const deltaZ = (forwardZ * moveForward + strafeZ * moveRight) * distance;
    const resolved = resolveMovement(state.player.position, deltaX, deltaZ);

    state.player.position.x = resolved.x;
    state.player.position.z = resolved.z;
    syncCameraPosition();
  }

  function clickToMove(x, z) {
    if (!Number.isFinite(x) || !Number.isFinite(z)) {
      return Object.freeze({ ...state.player.position });
    }

    const resolved = resolveMovement(state.player.position, x - state.player.position.x, z - state.player.position.z);
    state.player.position.x = resolved.x;
    state.player.position.z = resolved.z;
    syncCameraPosition();
    return Object.freeze({ ...state.player.position });
  }

  function onKeyDown(event) {
    if (!event?.code) {
      return;
    }

    if (event.code === "ArrowLeft") {
      state.player.yaw -= 0.15;
      syncCameraPosition();
      return;
    }

    if (event.code === "ArrowRight") {
      state.player.yaw += 0.15;
      syncCameraPosition();
      return;
    }

    if (event.code === "KeyW" || event.code === "KeyA" || event.code === "KeyS" || event.code === "KeyD") {
      pressedKeys.add(event.code);
    }
  }

  function onKeyUp(event) {
    if (!event?.code) {
      return;
    }

    pressedKeys.delete(event.code);
  }

  function onCanvasClick(event) {
    const marker = parseMarkerTarget(event?.target);
    if (!marker) {
      return;
    }

    clickToMove(marker.x, marker.z);
  }

  if (typeof windowRef?.addEventListener === "function") {
    windowRef.addEventListener("keydown", onKeyDown);
    windowRef.addEventListener("keyup", onKeyUp);
  }

  if (canvas && typeof canvas.addEventListener === "function") {
    canvas.addEventListener("click", onCanvasClick);
  }

  syncCameraPosition();

  return {
    clickToMove,
    dispose() {
      if (typeof windowRef?.removeEventListener === "function") {
        windowRef.removeEventListener("keydown", onKeyDown);
        windowRef.removeEventListener("keyup", onKeyUp);
      }

      if (canvas && typeof canvas.removeEventListener === "function") {
        canvas.removeEventListener("click", onCanvasClick);
      }
    },
    pressKey(code) {
      if (code) {
        pressedKeys.add(code);
      }
    },
    releaseKey(code) {
      if (code) {
        pressedKeys.delete(code);
      }
    },
    step(deltaSeconds) {
      applyStep(deltaSeconds);
    }
  };
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

function normalizeSceneData(sceneData) {
  if (!sceneData || typeof sceneData !== "object") {
    return { id: "boot-scene", interactables: [] };
  }

  const sceneId = typeof sceneData.id === "string" && sceneData.id ? sceneData.id : "boot-scene";
  const interactables = Array.isArray(sceneData.interactables)
    ? sceneData.interactables
      .filter((entry) => entry && typeof entry === "object")
      .map((entry) => ({
        objectId: String(entry.objectId ?? ""),
        action: String(entry.action ?? ""),
        clueId: String(entry.clueId ?? ""),
        prompt: String(entry.prompt ?? "")
      }))
      .filter((entry) => entry.objectId.length > 0 && entry.action.length > 0)
    : [];

  return { id: sceneId, interactables };
}

function renderInteractables(documentRef, sceneData) {
  const host = documentRef?.getElementById?.("qgame-interactables");
  if (!host || typeof documentRef?.createElement !== "function") {
    return;
  }

  host.innerHTML = "";

  for (const interactable of sceneData.interactables) {
    const item = documentRef.createElement("li");
    item.dataset.objectId = interactable.objectId;
    item.dataset.action = interactable.action;
    item.textContent = interactable.prompt || `${interactable.action} ${interactable.objectId}`;
    host.appendChild(item);
  }
}
export async function bootClient({ THREE, windowRef, documentRef, fetchConfig, fetchScene }) {
  const config = await fetchConfig();
  const sceneData = normalizeSceneData(
    typeof fetchScene === "function" ? await fetchScene("L-06") : null
  );
  const { camera, scene } = createScene(THREE);
  const canvas = documentRef.getElementById("qgame-canvas");
  const renderer = makeRenderer(THREE, canvas, windowRef);

  if (renderer) {
    renderer.render(scene, camera);
  }

  const state = {
    sceneId: sceneData.id,
    testMode: isTestModeEnabled(windowRef.location?.search, config),
    lastSpawnId: null,
    lastInteraction: null,
    skippedAnimations: 0,
    player: {
      position: { x: 0, y: 1.6, z: 3 },
      yaw: 0
    },
    interactables: sceneData.interactables
  };
  renderInteractables(documentRef, sceneData);
  const movement = createMovementController({ state, camera, windowRef, canvas });

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

  return { camera, movement, renderer, scene, state };
}


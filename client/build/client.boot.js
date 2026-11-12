import * as THREE from "/vendor/three.module.js";
import { bootClient } from "./client.boot.core.js";

async function fetchConfig() {
  const response = await fetch("/api/client-config");
  if (!response.ok) {
    throw new Error(`Failed to load client config: ${response.status}`);
  }

  return response.json();
}
async function fetchScene(sceneId) {
  const response = await fetch(`/api/scenes/${encodeURIComponent(sceneId)}`);
  if (!response.ok) {
    throw new Error(`Failed to load scene ${sceneId}: ${response.status}`);
  }

  return response.json();
}
async function fetchCasebook(gameId) {
  const response = await fetch(`/api/games/${encodeURIComponent(gameId)}/casebook`);
  if (!response.ok) {
    throw new Error(`Failed to load casebook ${gameId}: ${response.status}`);
  }

  return response.json();
}

function parseGameId(windowRef) {
  const params = new URLSearchParams(windowRef.location?.search ?? "");
  const raw = Number.parseInt(params.get("game") ?? "", 10);
  return Number.isInteger(raw) && raw > 0 ? raw : null;
}

void bootClient({
  THREE,
  windowRef: window,
  documentRef: document,
  fetchConfig,
  fetchScene,
  fetchCasebook,
  gameId: parseGameId(window)
});


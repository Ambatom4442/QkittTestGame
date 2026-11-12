export function uniqueName(prefix) {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  return `${prefix}-${stamp}`;
}

export async function expectOk(response) {
  await response.body();
  if (!response.ok()) {
    throw new Error(`Expected OK response, got ${response.status()} ${response.statusText()}`);
  }
}

export async function createProfile(request, name) {
  const response = await request.post('/api/profiles', {
    data: { name }
  });
  await expectOk(response);
  return response.json();
}

export async function createGame(request, { profileId, slot, caseId = 'speckled-band' }) {
  const response = await request.post('/api/games', {
    data: { profileId, slot, caseId }
  });
  await expectOk(response);
  return response.json();
}

export async function interact(request, gameId, payload) {
  const response = await request.post(`/api/games/${gameId}/interact`, {
    data: payload
  });
  await expectOk(response);
  return response.json();
}

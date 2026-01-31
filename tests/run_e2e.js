#!/usr/bin/env node
const BASE = 'http://localhost:5000';

const fetchFn = globalThis.fetch;
if (!fetchFn) {
  console.error('global fetch is not available. Run this with Node 18+ or install node-fetch.');
  process.exit(1);
}

const fetch = fetchFn;

async function waitForServer() {
  for (let i = 0; i < 40; i++) {
    try {
      const r = await fetch(`${BASE}/ping`);
      if (r.ok) return;
    } catch (e) {
      // ignore
    }
    await new Promise(r => setTimeout(r, 200));
  }
  throw new Error('Server did not respond at ' + BASE + ' within timeout');
}

async function main() {
  console.log('Waiting for server...');
  await waitForServer();
  console.log('Server reachable. Running e2e tests...');

  // Signup
  const signupResp = await fetch(`${BASE}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: `e2e+${Date.now()}@example.com`, password: 'secret123' }),
  });
  const signupJson = await signupResp.json();
  console.log('SIGNUP:', signupResp.status, JSON.stringify(signupJson));

  if (!signupJson.token) {
    console.error('Signup did not return a token; aborting');
    process.exit(2);
  }

  const token = signupJson.token;

  // Create listing
  const createResp = await fetch(`${BASE}/listings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ title: 'E2E Test', description: 'desc', price: 123 }),
  });
  const createJson = await createResp.json();
  console.log('CREATE LISTING:', createResp.status, JSON.stringify(createJson));

  // Get my listings
  const myResp = await fetch(`${BASE}/listings/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });
  const myJson = await myResp.json();
  console.log('MY LISTINGS:', myResp.status, JSON.stringify(myJson));

  console.log('E2E tests completed');
}

main().catch(err => {
  console.error('E2E failed:', err);
  process.exit(1);
});

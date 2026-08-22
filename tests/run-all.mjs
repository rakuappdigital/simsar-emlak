// Runs every checked-in regression test in tests/ against a freshly
// started dev server, then reports a pass/fail summary. Intended to be run
// before every deploy.
//
// Usage: node tests/run-all.mjs
import { spawn, spawnSync } from "child_process";
import { setTimeout as sleep } from "timers/promises";

const TEST_FILES = ["smoke.mjs", "energy.mjs", "energy-minigames.mjs", "rpg-systems.mjs", "save-roundtrip.mjs", "mobile-viewport.mjs", "surprise-conversations.mjs"];
const BASE_URL = "http://localhost:5173";

console.log("Starting dev server...");
const server = spawn("npm", ["run", "dev"], { stdio: "ignore", detached: true });

async function waitForServer(retries = 30) {
  for (let i = 0; i < retries; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok) return true;
    } catch {
      // not up yet
    }
    await sleep(500);
  }
  return false;
}

const up = await waitForServer();
if (!up) {
  console.error("Dev server never came up.");
  process.kill(-server.pid);
  process.exit(1);
}
console.log("Dev server is up.\n");

const results = [];
for (const file of TEST_FILES) {
  console.log(`\n===== ${file} =====`);
  const res = spawnSync("node", [`tests/${file}`], { stdio: "inherit", env: { ...process.env, BASE_URL } });
  results.push({ file, ok: res.status === 0 });
}

try {
  process.kill(-server.pid);
} catch {
  // already gone
}

console.log("\n===== SUMMARY =====");
let allOk = true;
for (const { file, ok } of results) {
  console.log(`${ok ? "ok" : "FAIL"}: ${file}`);
  if (!ok) allOk = false;
}

process.exit(allOk ? 0 : 1);

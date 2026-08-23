import { spawnSync } from "node:child_process";
import { existsSync, mkdirSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const TAG = "PRIVACY-0.14.3-RC.0";
const REPO = "https://github.com/starkware-libs/starknet-privacy.git";
const backendRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const vendorDir = join(backendRoot, "vendor");
const cloneDir = join(vendorDir, "starknet-privacy");
const sdkDir = join(cloneDir, "sdk");

function run(command, args, cwd) {
  const result = spawnSync(command, args, { cwd, stdio: "inherit", shell: true });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function clonedTag() {
  const result = spawnSync("git", ["describe", "--tags", "--exact-match"], {
    cwd: cloneDir,
    encoding: "utf8",
    shell: true,
  });
  return result.status === 0 ? result.stdout.trim() : "";
}

if (existsSync(join(sdkDir, "package.json"))) {
  if (clonedTag() !== TAG) {
    rmSync(cloneDir, { recursive: true, force: true });
  } else {
    if (!existsSync(join(sdkDir, "dist", "index.js"))) {
      run("npm", ["install"], sdkDir);
      run("npm", ["run", "build"], sdkDir);
    }
    process.exit(0);
  }
}

mkdirSync(vendorDir, { recursive: true });
run("git", [
  "clone",
  "--depth",
  "1",
  "--branch",
  TAG,
  "--filter=blob:none",
  "--sparse",
  REPO,
  cloneDir,
]);
run("git", ["sparse-checkout", "set", "sdk"], cloneDir);

if (!existsSync(join(sdkDir, "package.json"))) {
  console.error(`clone succeeded but ${sdkDir}/package.json is missing`);
  process.exit(1);
}

run("npm", ["install"], sdkDir);
run("npm", ["run", "build"], sdkDir);

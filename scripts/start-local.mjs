import { execFileSync, spawn } from "node:child_process";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const project = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
let directory = project;
let mappedDrive;

// Webpack treats ! as a loader separator. A drive-root project also produces
// mismatched CSS manifest paths in Next 16.2.6; keep the project subdirectory.
if (process.platform === "win32" && project.includes("!")) {
  mappedDrive = "WVUTSRQPONMLKJIHG"
    .split("")
    .map((letter) => `${letter}:`)
    .find((drive) => !existsSync(`${drive}\\`));
  if (!mappedDrive) {
    throw new Error("로컬 실행에 사용할 빈 드라이브 문자가 없습니다.");
  }
  execFileSync("subst", [mappedDrive, path.dirname(project)], {
    windowsHide: true,
  });
  directory = path.join(`${mappedDrive}\\`, path.basename(project));
}

function cleanup() {
  if (!mappedDrive) return;
  try {
    execFileSync("subst", [mappedDrive, "/D"], { windowsHide: true });
  } catch {
    console.error(`임시 경로 정리가 필요합니다: subst ${mappedDrive} /D`);
  }
  mappedDrive = undefined;
}

process.on("exit", cleanup);
const server = spawn(
  process.execPath,
  [
    path.join(directory, "node_modules/next/dist/bin/next"),
    "dev",
    "--webpack",
    "--port",
    "5194",
    ...process.argv.slice(2),
  ],
  {
    cwd: directory,
    stdio: "inherit",
    env: { ...process.env, RESTORY_BUILD_DIRECTORY: ".next-community-local" },
    windowsHide: true,
  },
);

server.on("error", (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
server.on("exit", (code) => {
  process.exitCode = code ?? 1;
});
process.on("SIGINT", () => server.kill("SIGINT"));
process.on("SIGTERM", () => server.kill("SIGTERM"));

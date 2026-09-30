const path = require("path");
const { spawnSync } = require("child_process");

const postgresRoot = "C:\\Program Files\\PostgreSQL\\18";
const pgCtl = path.join(postgresRoot, "bin", "pg_ctl.exe");
const dataDirectory = path.join(postgresRoot, "data");
const logFile = path.join(dataDirectory, "server.log");

const status = spawnSync(pgCtl, ["status", "-D", dataDirectory], { stdio: "ignore" });

if (status.status === 0) {
  console.log("PostgreSQL is already running.");
  process.exit(0);
}

const result = spawnSync(pgCtl, ["start", "-D", dataDirectory, "-l", logFile], {
  stdio: "inherit",
});

process.exit(result.status ?? 1);

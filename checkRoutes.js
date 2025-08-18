import fs from "fs";
import path from "path";

const routesDir = path.resolve("./routes");

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, "utf-8");
  const lines = content.split("\n");

  lines.forEach((line, idx) => {
    // Look for router.get/post/put/delete with suspicious paths
    if (/router\.(get|post|put|delete)\(/.test(line)) {
      const match = line.match(/router\.(get|post|put|delete)\(([^,]+)/);
      if (match) {
        const rawPath = match[2].trim().replace(/['"`]/g, "");
        if (
          rawPath === "" ||
          rawPath === ":" ||
          rawPath.startsWith(":") ||
          rawPath.includes("::") ||
          rawPath.endsWith(":")
        ) {
          console.log(
            `⚠️  Suspicious route in ${filePath} at line ${idx + 1}: ${line.trim()}`
          );
        } else {
          console.log(
            `✅ Route in ${filePath} at line ${idx + 1}: ${rawPath}`
          );
        }
      }
    }
  });
}

// Scan all .js files in routes/
fs.readdirSync(routesDir).forEach((file) => {
  if (file.endsWith(".js")) {
    scanFile(path.join(routesDir, file));
  }
});

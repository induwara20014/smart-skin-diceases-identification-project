const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

function inferFromImage(imagePath) {
  return new Promise((resolve) => {
    const predictScript = process.env.MODEL_PREDICT_SCRIPT;
    if (!predictScript) {
      return resolve({ label: "Unknown", confidence: 0 });
    }
    if (!fs.existsSync(imagePath)) {
      return resolve({ label: "Unknown", confidence: 0 });
    }

    const absScript = path.join(__dirname, "..", "..", predictScript);
    if (!fs.existsSync(absScript)) {
      return resolve({ label: "Unknown", confidence: 0 });
    }

    const pythonBin = process.env.PYTHON_BIN || "python";
    const args = [absScript, imagePath];

    const child = spawn(pythonBin, args, { windowsHide: true });
    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (d) => {
      stdout += d.toString();
    });
    child.stderr.on("data", (d) => {
      stderr += d.toString();
    });

    child.on("error", () => {
      resolve({ label: "Unknown", confidence: 0 });
    });

    child.on("close", (code) => {
      if (code !== 0) {
        // eslint-disable-next-line no-console
        console.warn("Inference script failed:", stderr || `exit code ${code}`);
        return resolve({ label: "Unknown", confidence: 0 });
      }

      try {
        const jsonStart = stdout.indexOf("{");
        const json = jsonStart >= 0 ? stdout.slice(jsonStart) : stdout;
        const parsed = JSON.parse(json);
        resolve({
          label: parsed.label ?? "Unknown",
          confidence: typeof parsed.confidence === "number" ? parsed.confidence : 0
        });
      } catch (e) {
        resolve({ label: "Unknown", confidence: 0 });
      }
    });
  });
}

module.exports = { inferFromImage };


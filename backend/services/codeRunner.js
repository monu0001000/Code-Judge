const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const TMP_DIR = path.join(__dirname, "tmp");

// Create temp folder if it doesn't exist
if (!fs.existsSync(TMP_DIR)) {
  fs.mkdirSync(TMP_DIR);
}

function runCodeWithInput(userCode, input) {
  return new Promise((resolve, reject) => {
    // IMPORTANT: use JSON.stringify to safely pass string input
    const wrappedCode = `
${userCode}

try {
  const result = solve(${JSON.stringify(input)});
  
  if (result === undefined) {
    console.log("");
  } else {
    console.log(result);
  }

} catch (err) {
  console.error(err);
  process.exit(1);
}
`;

    const fileName = path.join(TMP_DIR, `temp_${Date.now()}.js`);

    fs.writeFileSync(fileName, wrappedCode);

    exec(`node "${fileName}"`, { timeout: 3000 }, (error, stdout, stderr) => {
      // Always delete temp file
      fs.unlink(fileName, () => {});

      if (error) {
        if (error.killed) {
          return reject({ type: "TLE" });
        }

        return reject({
          type: "RUNTIME_ERROR",
          error: stderr || error.message,
        });
      }

      resolve({
        type: "OK",
        output: stdout.trim(),
      });
    });
  });
}

module.exports = { runCodeWithInput };

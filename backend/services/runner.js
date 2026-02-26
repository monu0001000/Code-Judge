const { exec } = require("child_process");
const fs = require("fs");
const path = require("path");

exports.runUserCode = (userCode, input) => {
  return new Promise((resolve, reject) => {
    const tempFile = path.join(__dirname, `temp_${Date.now()}.js`);

    const wrapped = `
${userCode}
(async () => {
  try {
    const result = solve(${input});
    console.log(result);
  } catch (e) {
    console.error("RUNTIME_ERROR");
    process.exit(1);
  }
})();
`;

    fs.writeFileSync(tempFile, wrapped);

    exec(`node ${tempFile}`, { timeout: 2000 }, (err, stdout, stderr) => {
      fs.unlinkSync(tempFile);

      if (err) {
        if (err.killed) return reject({ type: "TLE" });
        return reject({ type: "RUNTIME_ERROR" });
      }

      resolve(stdout.trim());
    });
  });
};

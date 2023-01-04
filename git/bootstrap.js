const { exec } = require("child_process");

exec("git init", (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`${stdout}`);
});

exec("git config pull.rebase false", (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`${stdout}`);
});

exec("git remote add origin https://github.com/daelvn/haljr", (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`${stdout}`);
});

exec("git pull origin main", (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`${stdout}`);
});

const { exec } = require("child_process");

exec("git config pull.rebase false", (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`${stdout}`);
});

exec("git stash", (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`${stdout}`);
});

exec("git pull origin main --force", (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`${stdout}`);
});

exec("git stash drop", (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`);
    return;
  }
  console.log(`${stdout}`);
});

const { exec } = require('child_process');

exec("git pull origin main", (err, stdout, stderr) => {
    if (err) {
        console.error(`exec error: ${err}`);
        return;
    }
    console.log(`${stdout}`);
});
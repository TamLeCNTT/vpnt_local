const express = require('express');
const { exec } = require('child_process');
const cors = require('cors');  // Import thư viện cors

const app = express();
const port = 3001;

app.use(cors());  // Sử dụng cors để cho phép tất cả các yêu cầu CORS

app.get('/backup', (req, res) => {
    exec('node backup.js', (error, stdout, stderr) => {
        if (error) {
            console.error(`exec error: ${error}`);
            res.status(500).send(`exec error: ${error}`);
            return;
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            res.status(500).send(`stderr: ${stderr}`);
            return;
        }
        console.log(`stdout: ${stdout}`);
        res.send(stdout);
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const requestIp = require('request-ip');

const app = express();
const port = 3000;
const historyFilePath = path.join(__dirname, 'history.json');
const allowedIps = ['123.45.67.89', '98.76.54.32'];

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));

// Middleware to check IP
app.use((req, res, next) => {
    const clientIp = requestIp.getClientIp(req);
    if (allowedIps.includes(clientIp)) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied' });
    }
});

// Load history from file
function loadHistory() {
    if (fs.existsSync(historyFilePath)) {
        const data = fs.readFileSync(historyFilePath);
        return JSON.parse(data).history || [];
    }
    return [];
}

// Save history to file
function saveHistory(history) {
    fs.writeFileSync(historyFilePath, JSON.stringify({ history }));
}

app.get('/history', (req, res) => {
    res.json({ history: loadHistory() });
});

app.post('/history', (req, res) => {
    const { city } = req.body;
    if (city) {
        const history = loadHistory();
        if (!history.includes(city)) {
            history.push(city);
            saveHistory(history);
        }
    }
    res.status(200).send();
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

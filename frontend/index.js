const express = require('express');
const app = express();
const path = require('path');

const views = path.join(__dirname, 'views/');

app.get('/', (req, res) => {
    res.sendFile(path.join(views, 'index.html'));
});

app.listen(8080, () => {
    console.log('FRONTEND: Started');
});

const express = require('express');
const app = express();

const port = process.env.PORT || 5000;

const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer();

app.all('/api/*', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:3000' });
});

app.all('/*', (req, res) => {
    proxy.web(req, res, { target: 'http://localhost:8080' });
});

app.listen(port, () => {
    console.log('PROXY: Started');
});

const express = require('express');
const app = express();
const axios = require('axios');

app.get('/api/random/trivia', (req, res) => {
  axios.get('http://numbersapi.com/random/trivia')
    .then(response => {
      res.json(response.data);
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({ error: 'Erro ao conectar à API' });
    });
});

app.listen(3000, () => {
  console.log('Proxy server listening on port 3000');
});
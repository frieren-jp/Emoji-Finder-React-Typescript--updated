const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

const dataPath = path.join(__dirname, 'assets/emojis.json');

let emojisData = [];
try {
  const rawData = fs.readFileSync(dataPath, 'utf8');
  emojisData = JSON.parse(rawData);
  console.log(`Загружено ${emojisData.length} эмодзи.`);
} catch (error) {
  console.error('Ошибка чтения файла:', error.message);
  emojisData = [];
}


function searchEmojis(query, data) {
  if (!query || query.trim() === '') {
    return data;
  }

  const lowerQuery = query.toLowerCase();

  return data.filter((emoji) => {
    const matchesTitle = emoji.title.toLowerCase().includes(lowerQuery);
    
    const matchesKeywords = emoji.keywords.toLowerCase().includes(lowerQuery);

    return matchesTitle || matchesKeywords;
  });
}

app.get('/api/emojis', (req, res) => {
  const { q } = req.query; 
  

  let result = searchEmojis(q, emojisData);


  const limit = 20;
  result = result.slice(0, limit);

  res.json(result);
});

app.listen(PORT, () => {
  console.log(`Сервер запущен на http://localhost:${PORT}`);
  console.log('Примеры запросов:');
  console.log('  - Все эмодзи: http://localhost:3000/api/emojis');
  console.log('  - Поиск: http://localhost:3000/api/emojis?q=smile');
  console.log('  - По ключевому слову: http://localhost:3000/api/emojis?q=fire');
});

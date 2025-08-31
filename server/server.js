require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;


const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;
const AIRTABLE_TOKEN = process.env.AIRTABLE_TOKEN;
const AIRTABLE_URL = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/testTable`;



app.use(cors());
app.use(express.json());

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}...`);
});

app.get('/', (req, res) => {
  res.send('Server is working!');
});

app.get('/status', async (req, res) => {
  try {
    const response = await fetch(AIRTABLE_URL, {
      headers: {
        Authorization: `Bearer ${AIRTABLE_TOKEN}`
      }
    });
    
    if (!response.ok) {
      return res.status(500).json({ status: 'failed', message: 'Failed to fetch Airtable data' });
    }
    
    const data = await response.json();
    // If you want, you can check if data.records exists
    if (data.records) {
      return res.json({ status: 'success', message: 'Proxy connected to Airtable' });
    } else {
      return res.status(500).json({ status: 'failed', message: 'No records found' });
    }
  } catch (error) {
    return res.status(500).json({ status: 'failed', message: error.message });
  }
});


//initial connection test
async function getRecords() {
  const response = await fetch(AIRTABLE_URL, {
    headers: {
      Authorization: `Bearer ${AIRTABLE_TOKEN}`
    }
  });

  const data = await response.json();
  console.log(JSON.stringify(data, null, 2));
}
getRecords();
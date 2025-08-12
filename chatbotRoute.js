// const express = require('express');
// const router = express.Router();
// const axios = require('axios');

// const PYTHON_CHATBOT_URL = 'http://localhost:8000/chat';

// router.post('/', async (req, res) => {
//   const { message } = req.body;

//   if (!message) {
//     return res.status(400).json({ error: 'Message is required.' });
//   }

//   try {
//     const response = await axios.post(PYTHON_CHATBOT_URL, { message });
//     res.json({ reply: response.data.response });
//   } catch (error) {
//     console.error('Chatbot error:', error.message);
//     if (error.response) {
//       console.error('Chatbot response error:', error.response.data);
//     }
//     res.status(500).json({ error: 'Chatbot server error' });
//   }
// });

// module.exports = router;

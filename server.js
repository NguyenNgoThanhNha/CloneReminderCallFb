const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Verify Token để xác minh với Facebook
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'your_verify_token_here';

// Endpoint GET để xác minh webhook với Facebook
app.get('/webhook', (req, res) => {
    // Parse query params
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    console.log('Webhook verification request received:');
    console.log('Mode:', mode);
    console.log('Token:', token);
    console.log('Challenge:', challenge);

    // Kiểm tra mode và token
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
        console.log('Webhook verified successfully!');
        res.status(200).send(challenge);
    } else {
        console.log('Webhook verification failed!');
        res.sendStatus(403);
    }
});

// Endpoint POST để nhận messages từ Facebook Messenger
app.post('/webhook', (req, res) => {
    const body = req.body;

    // Kiểm tra đây có phải là page subscription không
    if (body.object === 'page') {
        // Lặp qua từng entry - có thể có nhiều entries nếu batched
        body.entry.forEach((entry) => {
            // Lấy webhook event
            const webhookEvent = entry.messaging[0];
            console.log('Received webhook event:', webhookEvent);

            // Xử lý message ở đây
            handleMessage(webhookEvent);
        });

        // Trả về '200 OK' cho Facebook
        res.status(200).send('EVENT_RECEIVED');
    } else {
        // Trả về '404 Not Found' nếu không phải page subscription
        res.sendStatus(404);
    }
});

// Hàm xử lý message
function handleMessage(event) {
    const senderId = event.sender.id;
    const message = event.message;

    console.log(`Received message from ${senderId}:`, message);

    // TODO: Xử lý logic bot ở đây
    // Ví dụ: phản hồi tin nhắn, xử lý reminder, etc.
}

// Health check endpoint
app.get('/', (_, res) => {
    res.json({
        status: 'OK',
        message: 'Facebook Messenger Bot is running!',
        timestamp: new Date().toISOString(),
    });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Webhook URL: http://localhost:${PORT}/webhook`);
    console.log(`Verify Token: ${VERIFY_TOKEN}`);
});

module.exports = app;

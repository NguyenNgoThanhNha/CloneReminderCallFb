# Facebook Messenger Bot - Remind Bot

Đây là một Facebook Messenger Bot được xây dựng bằng Node.js và Express để xử lý webhook verification và nhận tin nhắn từ Facebook.

## Cài đặt

1. Cài đặt dependencies:

```bash
npm install
```

2. Tạo file `.env` với nội dung:

```env
VERIFY_TOKEN=your_unique_verify_token_here
PORT=3000
```

3. Chạy server:

```bash
# Development mode
npm run dev

# Production mode
npm start
```

## Cấu hình Facebook App

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Tạo App mới và chọn "Business"
3. Thêm sản phẩm "Messenger" vào app
4. Trong phần Webhooks, thêm URL callback: `https://your-domain.com/webhook`
5. Nhập Verify Token (phải khớp với VERIFY_TOKEN trong file .env)
6. Chọn subscription fields: `messages`, `messaging_postbacks`

## Endpoints

### GET /webhook

-   Xử lý webhook verification từ Facebook
-   Kiểm tra `hub.verify_token` và trả về `hub.challenge` nếu khớp

### POST /webhook

-   Nhận tin nhắn từ Facebook Messenger
-   Xử lý các events từ người dùng

### GET /

-   Health check endpoint
-   Trả về trạng thái server

## Cấu trúc Project

```
remind-bot-fb/
├── server.js          # Main server file
├── package.json       # Dependencies và scripts
├── .env              # Environment variables (cần tạo)
├── healthcheck.js    # Health check script cho Docker
├── Dockerfile        # Docker configuration
├── docker-compose.yml # Docker Compose configuration
├── .dockerignore     # Docker ignore file
└── README.md         # Hướng dẫn này
```

## Docker

### Chạy với Docker Compose (Khuyến nghị)

```bash
# Build và chạy container
docker-compose up --build

# Chạy trong background
docker-compose up -d

# Xem logs
docker-compose logs -f

# Dừng container
docker-compose down
```

### Chạy với Docker commands

```bash
# Build image
docker build -t remind-bot-fb .

# Chạy container
docker run -p 3000:3000 --env-file .env remind-bot-fb

# Chạy với environment variables
docker run -p 3000:3000 -e VERIFY_TOKEN=your_token_here remind-bot-fb
```

## Ghi chú

-   Đảm bảo VERIFY_TOKEN trong file `.env` khớp với token trong Facebook App
-   Server mặc định chạy trên port 3000
-   Cần expose server ra internet (sử dụng ngrok cho development)
-   Docker image sử dụng Node.js 18 Alpine để tối ưu kích thước
-   Container chạy với non-root user để bảo mật

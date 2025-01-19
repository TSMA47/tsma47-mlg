# TSMA47 - MLG Trump AI Chat

An avant-garde interactive web application featuring a 3D digital representation of TSMA47, immersed in MLG (Major League Gaming) meme culture and dynamic multimedia experiences.

![TSMA47 Preview](preview.png)

## Features

- 🎮 Interactive 3D Trump model with MLG-style visuals
- 💬 Real-time chat interface with Trump-style responses
- 🗣️ Text-to-Speech using ElevenLabs API
- 📊 Dynamic meme-inspired UI elements
- 🌈 MLG-themed animations and visual effects
- 🎯 Interactive sniper scope overlay
- 📱 Responsive design for all devices

## Tech Stack

- **Frontend**
  - React
  - Three.js / React Three Fiber
  - TailwindCSS
  - Wouter for routing
  - Tanstack Query
  - Shadcn/ui components
  - Framer Motion

- **Backend**
  - Express
  - WebSocket for real-time communication
  - PostgreSQL with Drizzle ORM
  - ElevenLabs API integration

## Prerequisites

- Node.js 18+
- PostgreSQL database
- ElevenLabs API key for voice generation

## Environment Variables

```env
DATABASE_URL=your_postgresql_database_url
VITE_ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
```

## Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/tsma47-mlg
cd tsma47-mlg
```

2. Install dependencies
```bash
npm install
```

3. Setup database
```bash
npm run db:push
```

4. Start development server
```bash
npm run dev
```

## Development

The application uses a modern web development stack with:
- Vite for blazing fast builds
- TypeScript for type safety
- React Query for data fetching
- Three.js for 3D rendering
- Tailwind CSS for styling
- Shadcn UI components

### Project Structure

```
├── client/                # Frontend code
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── lib/          # Utility functions
│   │   └── pages/        # Page components
├── server/               # Backend code
│   ├── routes.ts        # API routes
│   └── index.ts         # Server entry
└── db/                  # Database schema and config
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- MLG meme culture
- Three.js community
- React ecosystem
- ElevenLabs for voice generation

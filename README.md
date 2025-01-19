# TSMA47 MLG

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

## Environment Variables

```env
DATABASE_URL=your_postgresql_database_url
VITE_ELEVEN_LABS_API_KEY=your_elevenlabs_api_key
```

## Development

Built with:
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

## License

MIT License

## Acknowledgments

- MLG meme culture
- Three.js community
- React ecosystem
- ElevenLabs for voice generation
Unsplash Gallery
A modern, responsive photo gallery application built with React, TypeScript, and Tailwind CSS that integrates with the Unsplash API.
Features

🏠 Home Page: Browse editorial photos from Unsplash

🎲 Random Photos: Generate random photos with customizable parameters

🔍 Search: Search for photos with advanced filtering options

📱 Responsive Design: Works seamlessly on desktop and mobile devices

⚡ Fast Loading: Optimized performance with efficient API calls

🎨 Beautiful UI: Clean, modern interface with smooth animations

Tech Stack

React 18 - UI library
TypeScript - Type safety
Tailwind CSS - Styling
Vite - Build tool
Lucide React - Icons
Unsplash API - Photo source

Project Structure
unsplash-gallery/
├── public/
│   ├── index.html
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── common/          # Shared components
│   │   ├── ui/              # UI-specific components
│   │   └── index.ts         # Component exports
│   ├── pages/               # Page components
│   ├── services/            # API services
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   ├── styles/              # Global styles
│   ├── App.tsx              # Main app component
│   └── main.tsx             # App entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
Getting Started
Prerequisites

Node.js (v18 or higher)
npm or yarn
Unsplash API access key

Installation

Clone the repository:

bashgit clone <repository-url>
cd unsplash-gallery

Install dependencies:

bashnpm install

Get your Unsplash API key:

Go to Unsplash Developers
Create a new application
Copy your Access Key


Configure the API key:

Open src/utils/constants.ts
Replace 'YOUR_ACCESS_KEY' with your actual Unsplash access key


Start the development server:

bashnpm run dev

Open your browser and navigate to http://localhost:5173

Available Scripts

npm run dev - Start development server
npm run build - Build for production
npm run preview - Preview production build
npm run lint - Run ESLint

API Integration
The application uses the Unsplash API with the following endpoints:

List Photos: Get editorial photos
Search Photos: Search with filters (query, color, orientation)
Random Photos: Generate random photos with parameters

Features Breakdown
Home Page

Displays curated editorial photos
Pagination support
Refresh functionality
Responsive grid layout

Random Photos

Generate 1-12 random photos
Filter by orientation (landscape, portrait, squarish)
One-click regeneration

Search

Full-text search
Advanced filters:

Sort by relevance or latest
Filter by orientation
Filter by color


Pagination with result count
No results handling

Customization
Styling

Modify tailwind.config.js for custom colors and themes
Update src/styles/index.css for global styles

API Configuration

Update src/utils/constants.ts for API settings
Modify src/services/unsplash.service.ts for additional endpoints

Components

All components are modular and reusable
Props are properly typed with TypeScript interfaces

Performance Optimizations

Lazy loading with React.lazy (can be implemented)
Optimized image loading with Unsplash's size parameters
Efficient state management with custom hooks
Memoized components to prevent unnecessary re-renders

Browser Support

Modern browsers (Chrome, Firefox, Safari, Edge)
Mobile browsers (iOS Safari, Chrome Mobile)

Contributing

Fork the repository
Create a feature branch
Make your changes
Add tests if applicable
Submit a pull request

License
This project is licensed under the MIT License.
Acknowledgments

Unsplash for providing the amazing photo API
Lucide for the beautiful icons
Tailwind CSS for the utility-first CSS framework

# Kanji Study <img src="public/images/kanji-study-logo.png" width="60" align="center" alt="Kanji Study Logo">

<div align="center">
  <img src="public/images/kanji-study-logo.png" width="200" alt="Kanji Study Logo">

  <p align="center">
    An interactive Japanese kanji learning platform built with Next.js
  </p>

  <div align="center">
    <img src="https://img.shields.io/badge/next.js-15.0.1-black" alt="Next.js">
    <img src="https://img.shields.io/badge/react-19.0.0-blue" alt="React">
    <img src="https://img.shields.io/badge/tailwindcss-3.4.1-38bdf8" alt="Tailwind CSS">
    <img src="https://img.shields.io/badge/firebase-latest-orange" alt="Firebase">
  </div>
</div>

## 🚀 Features

- 🔍 **Advanced Kanji Search**: Integrated with the Jisho API for comprehensive kanji lookup
- 📚 **Study Decks**: Create and manage custom study collections
- 💫 **Interactive Learning**: Flashcards and matching games for effective practice
- 🔐 **Google Authentication**: Secure user accounts and data
- 📱 **Responsive Design**: Optimized for both desktop and mobile devices
- ⚡ **Real-time Updates**: Instant synchronization of study progress and favorites

## 🛠️ Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS
- **Authentication**: Firebase Auth
- **API Integration**: Jisho API
- **State Management**: React Context
- **Styling**: Tailwind CSS with custom components

## 📥 Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/kanji-study.git
```

2. Install dependencies:

```bash
cd kanji-study
npm install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
```

Add your Firebase configuration to `.env.local`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
```

4. Run the development server:

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the app.

## 🏗️ Project Structure

```
src/
├── app/              # Next.js app directory
├── components/       # React components
│   ├── auth/        # Authentication components
│   ├── search/      # Search functionality
│   ├── study/       # Study tools
│   └── ui/          # Shared UI components
├── context/         # React context providers
├── hooks/           # Custom React hooks
├── lib/             # Utilities and services
└── styles/          # Global styles
```

## 📱 Core Components

### Search

- Real-time kanji search with Jisho API integration
- Detailed kanji information display
- Add to favorites or study decks

### Study Modes

- Flashcard system with spaced repetition
- Matching games for reading practice
- Progress tracking and statistics

### User Features

- Google authentication
- Custom study deck creation
- Progress synchronization
- Favorite kanji management

## 🔑 Authentication

The app uses Firebase Authentication with Google Sign-In. Users can:

- Sign in with their Google account
- Maintain persistent sessions
- Securely access their study data
- Manage their account settings

## 🎨 Styling

We use Tailwind CSS for styling with:

- Consistent design system
- Dark mode support
- Responsive layouts
- Custom animations
- Accessible components

## 📈 Future Enhancements

- [ ] Additional study modes
- [ ] Offline support
- [ ] Mobile app versions
- [ ] Advanced statistics
- [ ] Social features
- [ ] Custom deck sharing

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is proprietary software owned by StealthWork. All rights reserved.

### Usage Restrictions
- This software may not be used, copied, modified, or distributed without explicit written permission
- The source code and artwork are proprietary and may not be used without authorization
- Contact contact@stealthwork.app for usage permissions

### For Authorized Users
If you have been granted permission to use this software:
1. Maintain all copyright notices and attributions
2. Follow any additional terms specified in your authorization
3. Do not redistribute or share access without permission

See the [LICENSE.md](LICENSE.md) file for complete terms.

## 📬 Contact

Project Link: [https://github.com/yourusername/kanji-study](https://github.com/yourusername/kanji-study)

## 🙏 Acknowledgments

- [Jisho API](https://jisho.org/api) for kanji data
- [Firebase](https://firebase.google.com/) for authentication
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Next.js](https://nextjs.org/) for the framework

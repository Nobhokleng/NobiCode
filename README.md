# NobiCode 🚀

**An intelligent multilingual AI-powered code review tool that helps developers improve code quality through automated analysis and detailed feedback.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)

## ✨ Features

### 🤖 **Multiple AI Services**
- **Gemini AI Integration**: Direct integration with Google's Gemini API
  - Gemini 2.5 Flash Preview, Gemini 2.5 Pro Preview
  - Gemini 2.0 Flash, Gemini 1.5 Flash, Gemini 1.5 Pro
- **OpenRouter Integration**: Access to multiple AI models through OpenRouter
  - GPT-4o, GPT-4o Mini, Claude 3.5 Sonnet
  - Gemini 2.5 Flash (via OpenRouter), Llama 3.3 70B

### 🌐 **Multilingual Support**
- **UI Languages**: English, Khmer, Chinese, Japanese, Korean, Thai, Vietnamese, French, Spanish, German
- **AI Response Languages**: Code reviews can be provided in any supported language
- **Intelligent Localization**: Language-specific prompts and UI translations

### ⚡ **Real-time Streaming**
- **Live Response Streaming**: See code review results appear in real-time
- **Progressive Display**: Proper markdown rendering during streaming
- **Cancellable Requests**: Stop analysis at any time
- **Performance Optimized**: RequestAnimationFrame batching for smooth UX

### 💾 **Persistent History**
- **Local Storage**: Review history saved in browser storage
- **History Management**: View, delete, and clear review history
- **Export Functionality**: Export reviews as Markdown
- **Warning System**: Notifications when approaching storage limits

### 🎨 **Modern UI/UX**
- **Dark/Light Theme**: Comprehensive theme switching
- **Responsive Design**: Works on desktop and mobile devices
- **Sticky Header**: Smooth navigation experience
- **Accessibility**: Keyboard navigation and screen reader support

## 🛠️ **Technology Stack**

- **Frontend**: React 19, TypeScript, Vite
- **Styling**: Tailwind CSS with custom theme system
- **AI Integration**: Google Gemini API, OpenRouter API
- **Markdown**: React Markdown with syntax highlighting
- **State Management**: React hooks with local storage persistence

## 🚀 **Quick Start**

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/nobicode.git
   cd nobicode
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API keys**
   Create a `.env.local` file in the root directory:
   ```env
   GEMINI_API_KEY=your_gemini_api_key
   OPENROUTER_API_KEY=your_openrouter_api_key
   ```
   - You can use either service or both
   - **Security Note**: This is a client-side app for development/demo purposes. In production, consider using a backend proxy to protect your API keys.

4. **Run the application**
   ```bash
   npm run dev
   ```

5. **Build for production**
   ```bash
   npm run build
   ```

## 📋 **Use Cases**

- **Code Quality Assurance**: Automated detection of bugs, performance issues, and security vulnerabilities
- **Learning Tool**: Get detailed explanations and best practice suggestions
- **Team Reviews**: Consistent code review standards across development teams
- **Multi-language Projects**: Support for various programming languages and human languages
- **Educational**: Perfect for students learning programming best practices

## 🔧 **Configuration**

### AI Provider Setup

#### Gemini API
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add it to your `.env.local` file as `GEMINI_API_KEY`

#### OpenRouter API
1. Visit [OpenRouter](https://openrouter.ai/keys)
2. Create a new API key
3. Add it to your `.env.local` file as `OPENROUTER_API_KEY`

### Application Settings
- **Service Selection**: Choose between Gemini and OpenRouter
- **Model Configuration**: Select specific models for each provider
- **Language Preferences**: Set both UI and AI response languages
- **Streaming Options**: Enable/disable real-time response streaming

## 🌟 **Why NobiCode?**

- **Cost-Effective**: Choose from various AI models based on your budget and needs
- **Developer-Friendly**: Built by developers, for developers with intuitive UX
- **Privacy-Focused**: Client-side application with local storage - your code stays private
- **Extensible**: Easy to add new AI providers and languages
- **Open Source**: Transparent, customizable, and community-driven
- **Multi-Platform**: Works on any device with a modern web browser

## 📸 **Screenshots**

*Coming soon - Screenshots of the application interface*

## 🔄 **Development**

### Project Structure
```
nobicode/
├── src/
│   ├── components/          # React components
│   ├── services/           # AI service integrations
│   ├── constants/          # Configuration and translations
│   ├── types/              # TypeScript type definitions
│   ├── utils/              # Utility functions
│   └── contexts/           # React contexts
├── public/                 # Static assets
└── dist/                   # Build output
```

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### Contributing Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 🐛 **Troubleshooting**

### Common Issues

**API Key Not Working**
- Ensure your API keys are correctly set in `.env.local`
- Check that the API keys have the necessary permissions
- Verify the API key format is correct

**Streaming Not Working**
- Check your internet connection
- Ensure the selected AI service supports streaming
- Try disabling and re-enabling streaming mode

**UI Not Loading**
- Clear browser cache and local storage
- Check browser console for errors
- Ensure you're using a modern browser

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 **Contributing**

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

### Areas for Contribution
- Additional AI service integrations
- New language translations
- UI/UX improvements
- Performance optimizations
- Documentation improvements

## 📞 **Support**

- **Issues**: [GitHub Issues](https://github.com/yourusername/nobicode/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/nobicode/discussions)
- **Documentation**: Check this README and inline code comments

## 🙏 **Acknowledgments**

- Google Gemini AI for powerful code analysis capabilities
- OpenRouter for providing access to multiple AI models
- The React and TypeScript communities for excellent tooling
- All contributors who help improve this project

## 🔮 **Roadmap**

- [ ] Additional AI service integrations (Anthropic Claude, Cohere, etc.)
- [ ] Code diff analysis and comparison features
- [ ] Team collaboration features
- [ ] API rate limiting and usage analytics
- [ ] Plugin system for custom analyzers
- [ ] Desktop application (Electron)
- [ ] VS Code extension

---

**Made with ❤️ for the developer community**

*Star ⭐ this repository if you find it helpful!*

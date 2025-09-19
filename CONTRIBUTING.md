# Contributing to AI News Search Platform

Thank you for your interest in contributing to the AI News Search Platform! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/ai-news-search-platform.git
   cd ai-news-search-platform
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Set up environment variables**:
   ```bash
   cp .env.example .env
   # Add your API keys to .env
   ```
5. **Start the development server**:
   ```bash
   npm run dev
   ```

## 🛠️ Development Workflow

### Branch Naming Convention
- `feature/description` - for new features
- `fix/description` - for bug fixes
- `docs/description` - for documentation updates
- `refactor/description` - for code refactoring

### Making Changes

1. **Create a new branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** following the coding standards below

3. **Test your changes**:
   ```bash
   npm run lint
   npm run build
   ```

4. **Commit your changes**:
   ```bash
   git add .
   git commit -m "feat: add your feature description"
   ```

5. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request** on GitHub

## 📝 Coding Standards

### TypeScript
- Use TypeScript for all new code
- Define proper interfaces and types
- Avoid `any` type when possible
- Use meaningful variable and function names

### React Components
- Use functional components with hooks
- Follow the single responsibility principle
- Use proper prop types and interfaces
- Implement proper error boundaries where needed

### Styling
- Use Tailwind CSS classes
- Follow mobile-first responsive design
- Maintain consistent spacing and colors
- Use semantic HTML elements

### Code Organization
- Keep components small and focused
- Use custom hooks for reusable logic
- Organize imports (external libraries first, then internal)
- Use absolute imports when beneficial

## 🧪 Testing

Currently, the project uses ESLint for code quality. When adding new features:

1. Ensure your code passes linting:
   ```bash
   npm run lint
   ```

2. Test manually in the browser
3. Test responsive design on different screen sizes
4. Verify API integrations work correctly

## 📋 Pull Request Guidelines

### Before Submitting
- [ ] Code follows the project's coding standards
- [ ] Changes have been tested locally
- [ ] No console errors or warnings
- [ ] Responsive design works on mobile and desktop
- [ ] API integrations function correctly

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring

## Testing
- [ ] Tested locally
- [ ] Responsive design verified
- [ ] API functionality confirmed

## Screenshots (if applicable)
Add screenshots for UI changes
```

## 🐛 Bug Reports

When reporting bugs, please include:

1. **Description**: Clear description of the issue
2. **Steps to Reproduce**: Step-by-step instructions
3. **Expected Behavior**: What should happen
4. **Actual Behavior**: What actually happens
5. **Environment**: Browser, OS, device type
6. **Screenshots**: If applicable

## 💡 Feature Requests

For feature requests, please provide:

1. **Problem Statement**: What problem does this solve?
2. **Proposed Solution**: How should it work?
3. **Alternatives**: Other solutions considered
4. **Additional Context**: Any other relevant information

## 🎯 Areas for Contribution

We welcome contributions in these areas:

### High Priority
- **Testing**: Add unit and integration tests
- **Accessibility**: Improve ARIA labels and keyboard navigation
- **Performance**: Optimize bundle size and loading times
- **Error Handling**: Better error messages and recovery

### Medium Priority
- **Features**: New search filters and sorting options
- **UI/UX**: Design improvements and animations
- **Documentation**: Code comments and user guides
- **Internationalization**: Multi-language support

### Low Priority
- **Integrations**: Additional news sources
- **Analytics**: Usage tracking and insights
- **PWA**: Progressive Web App features
- **Dark Mode**: Theme switching capability

## 📚 Resources

- [React Documentation](https://reactjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Vite Documentation](https://vitejs.dev/guide)

## 🤝 Code of Conduct

- Be respectful and inclusive
- Provide constructive feedback
- Help others learn and grow
- Focus on the code, not the person

## 📞 Getting Help

If you need help:

1. Check existing issues and discussions
2. Create a new issue with the "question" label
3. Join our community discussions
4. Review the documentation

## 🙏 Recognition

Contributors will be recognized in:
- README.md contributors section
- Release notes for significant contributions
- GitHub contributors page

Thank you for contributing to the AI News Search Platform! 🚀
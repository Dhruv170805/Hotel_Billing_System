# Contributing to Hotel Billing System

Thank you for your interest in contributing to the Hotel Billing System! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Reporting Bugs
1. **Check existing issues** to avoid duplicates
2. **Use the bug report template** when creating an issue
3. **Provide detailed information**:
   - Steps to reproduce the bug
   - Expected vs actual behavior
   - Screenshots or videos if applicable
   - Browser and operating system details

### Suggesting Features
1. **Check existing feature requests** to avoid duplicates
2. **Use the feature request template** when creating an issue
3. **Clearly describe**:
   - The problem you're trying to solve
   - Your proposed solution
   - Alternative solutions considered
   - Additional context or screenshots

### Code Contributions

#### Prerequisites
- Node.js 16.0 or higher
- npm (comes with Node.js)
- Git
- Basic knowledge of React, JavaScript, and CSS

#### Getting Started
1. **Fork the repository**
   ```bash
   # Click "Fork" on the GitHub repository page
   ```

2. **Clone your fork**
   ```bash
   git clone https://github.com/yourusername/hotel-billing-system.git
   cd hotel-billing-system
   ```

3. **Add upstream remote**
   ```bash
   git remote add upstream https://github.com/original-owner/hotel-billing-system.git
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Start development server**
   ```bash
   npm start
   ```

#### Development Workflow
1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or for bug fixes
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**
   - Follow the existing code style and patterns
   - Add comments for complex logic
   - Update documentation if needed

3. **Test your changes**
   ```bash
   npm start  # Test in development mode
   npm run build  # Test production build
   ```

4. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add feature: your feature description"
   ```

5. **Push to your fork**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**
   - Go to your fork on GitHub
   - Click "New Pull Request"
   - Fill out the PR template completely
   - Link any related issues

## 📋 Development Guidelines

### Code Style
- **React Components**: Use functional components with hooks
- **File Naming**: Use PascalCase for components, camelCase for utilities
- **CSS Classes**: Use Tailwind utility classes, custom CSS for complex styling
- **Comments**: Add JSDoc comments for functions, inline comments for complex logic

### Project Structure
```
src/
├── components/     # React components
├── context/        # React context providers
├── hooks/          # Custom React hooks
├── data/          # Static data and configurations
├── utils/         # Utility functions
└── styles/        # CSS files
```

### Component Guidelines
- **Single Responsibility**: Each component should have one clear purpose
- **Props Validation**: Use PropTypes or TypeScript for type checking
- **Reusability**: Create reusable components when possible
- **Accessibility**: Follow WCAG guidelines for accessibility

### State Management
- **Context API**: Use React Context for global state
- **Custom Hooks**: Extract complex state logic into custom hooks
- **Local State**: Use useState for component-specific state

## 🧪 Testing Guidelines

### Manual Testing
- Test all user workflows end-to-end
- Test on different screen sizes (desktop, tablet, mobile)
- Test in different browsers (Chrome, Firefox, Safari)
- Test with different data scenarios

### What to Test
- **Payment Flow**: All 5 payment methods work correctly
- **Inventory Management**: Stock updates correctly with orders
- **Bill Printing**: Kitchen and customer bills generate properly
- **Analytics**: Data updates in real-time
- **Table Management**: Status updates work correctly

## 📖 Documentation

### Code Documentation
- **Component Props**: Document all props with types and descriptions
- **Function Parameters**: Use JSDoc format for function documentation
- **Complex Logic**: Add inline comments explaining the "why"

### README Updates
- Update feature lists when adding new functionality
- Update screenshots when UI changes significantly
- Update installation instructions if dependencies change

## 🔍 Pull Request Guidelines

### Before Submitting
- [ ] Code follows project style guidelines
- [ ] All tests pass (manual testing)
- [ ] Documentation is updated
- [ ] Commit messages are clear and descriptive
- [ ] PR description explains what and why

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Manual testing completed
- [ ] All features work as expected
- [ ] No regression issues found

## Screenshots
(If applicable)

## Related Issues
Fixes #(issue number)
```

### Review Process
1. **Automated Checks**: Ensure all checks pass
2. **Code Review**: Address reviewer feedback
3. **Testing**: Verify changes work correctly
4. **Merge**: Maintainer will merge when approved

## 🎯 Priority Areas

We're especially looking for contributions in these areas:

### High Priority
- **Bug fixes** - Any bugs in core functionality
- **Performance improvements** - Optimizations for better performance
- **Mobile responsiveness** - Better mobile experience
- **Accessibility** - WCAG compliance improvements

### Medium Priority
- **New payment methods** - Additional payment integrations
- **Enhanced reporting** - More detailed analytics and reports  
- **UI/UX improvements** - Better user experience
- **Documentation** - Improved guides and examples

### Future Enhancements
- **Multi-language support** - Internationalization (i18n)
- **Advanced features** - Customer loyalty, online ordering
- **Integration** - APIs for external systems
- **Testing framework** - Automated testing setup

## 📞 Getting Help

### Community Support
- **GitHub Discussions**: Ask questions and share ideas
- **Issues**: Report bugs and request features
- **Pull Requests**: Get help with code contributions

### Maintainer Contact
For urgent issues or security concerns, contact the maintainers directly through GitHub.

## 🏆 Recognition

Contributors will be recognized in:
- **README.md**: Contributors section
- **Release Notes**: Major contribution acknowledgments
- **GitHub**: Contributor graphs and statistics

## 📜 Code of Conduct

### Our Pledge
We are committed to providing a welcoming and inspiring community for all.

### Standards
- **Be respectful** and inclusive
- **Be collaborative** and constructive
- **Be patient** with newcomers
- **Be professional** in all interactions

### Unacceptable Behavior
- Harassment or discrimination
- Trolling or inflammatory comments
- Sharing private information
- Other unprofessional conduct

## 📝 License

By contributing to Hotel Billing System, you agree that your contributions will be licensed under the MIT License.

---

**Thank you for contributing to Hotel Billing System! 🎉**

Your contributions help make this project better for everyone in the hospitality industry.
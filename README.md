# Academic Portfolio Website

A clean, modern, and maintainable professor profile website built with Tailwind CSS. The site showcases academic information including bio, projects, courses, research, awards, and contact details.

## Features

- **Responsive Design**: Works on all devices (mobile, tablet, desktop)
- **Data-Driven**: All content managed via a single `data.json` file
- **Modern UI**: Flat design with professional academic styling
- **Easy Maintenance**: Organized code structure with separated concerns
- **Fast Loading**: Optimized performance with external CDNs

## File Structure

```text
├── index.html          # Main HTML structure
├── data.json          # All website content and data
├── css/
│   └── styles.css     # Custom CSS and style configurations
├── js/
│   └── portfolio.js   # JavaScript functionality and data handling
├── images/            # Image assets
│   └── profile/       # Profile photos
│       └── profile.jpg # Main profile image
└── README.md          # Documentation
```

## Architecture

### Clean Code Organization

The website follows a **separation of concerns** principle:

- **HTML (`index.html`)**: Pure structure and semantic markup
- **CSS (`css/styles.css`)**: Styling and visual presentation
- **JavaScript (`js/portfolio.js`)**: Data loading and DOM manipulation
- **Data (`data.json`)**: Content management

### JavaScript Architecture

The JavaScript is organized using a **class-based approach** with the `PortfolioManager` class:

#### Key Methods

- `init()`: Main initialization method
- `loadData()`: Handles data fetching with error handling
- `populateAllSections()`: Orchestrates content population
- `populateProfile()`, `populateProjects()`, etc.: Section-specific population
- Helper methods for common DOM operations

#### Benefits

- **Modular**: Each section has its own population method
- **Reusable**: Helper methods reduce code duplication
- **Maintainable**: Clear method names and organized structure
- **Error Handling**: Comprehensive error management
- **Extensible**: Easy to add new sections or modify existing ones
- **Easy Maintenance**: Add/remove/modify content without touching HTML/CSS/JS

## Content Management

### Updating Content

All website content is managed through `data.json`. Simply edit this file to update:

- Personal information and bio
- Academic background and research interests
- Research profile links (Scopus, Google Scholar, etc.)
- Projects, courses, publications
- Awards and community activities
- Contact information

### Example Updates

```json
{
  "profile": {
    "name": "Your Name",
    "title": "Your Title",
    "bio": "Your biography..."
    // ... other fields
  }
}
```

### Adding New Projects

```json
{
  "title": "Project Title",
  "description": "Project description",
  "year": "2024",
  "status": "Ongoing", // or "Completed"
  "collaborators": "Collaborator names",
  "funding": "Funding information"
}
```

### Adding New Sections

To add a new section:

1. Add the HTML structure to `index.html`
2. Add the data to `data.json`
3. Create a `populateNewSection()` method in `portfolio.js`
4. Call it from `populateAllSections()`

## Styling

The website uses **Tailwind CSS** for styling with custom academic colors:

- **Primary**: `#004080` (academic-blue)
- **Secondary**: `#0066cc` (academic-light)

### Design Philosophy

- **Flat Design**: No gradients, clean solid colors
- **Professional**: Academic-appropriate color scheme
- **Consistent**: Unified spacing and typography
- **Accessible**: Good contrast and readable fonts

## Development

### Local Development

1. Clone the repository
2. Serve the files using a local server (e.g., Live Server in VS Code)
3. Edit `data.json` to update content
4. Modify `js/portfolio.js` for functionality changes
5. Update `css/styles.css` for styling changes

### Deployment

The website is designed for **GitHub Pages** deployment:

1. Push all files to your GitHub repository
2. Enable GitHub Pages in repository settings
3. The site will be available at `https://username.github.io/repository-name`

## Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design for all screen sizes

## Performance

- **Fast Loading**: External CDNs for dependencies
- **Optimized**: Minimal custom code
- **Efficient**: Class-based JavaScript organization
- **Cached**: Static files cached by browser

## Maintenance

### Code Quality Features

- **Documented**: Comprehensive JSDoc comments
- **Organized**: Clear file and function organization
- **Error Handling**: Graceful error management
- **Extensible**: Easy to add new features
- **Readable**: Clean, well-structured code

### Best Practices Implemented

- Separation of concerns
- DRY (Don't Repeat Yourself) principle
- Error handling and fallbacks
- Semantic HTML structure
- Responsive design patterns
- Performance optimization

The website is now ready to use! Simply modify `data.json` with your actual information.

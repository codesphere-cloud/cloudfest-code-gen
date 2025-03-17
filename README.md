# App Collection

This repository contains a collection of useful web applications built with Next.js App Router.

## Project Structure

```
/app
├── src/                    # Source code directory
│   ├── app/                # Next.js App Router structure
│   │   ├── layout.tsx      # Root layout for all applications
│   │   ├── page.tsx        # Home page with app selection
│   │   ├── globals.css     # Global styles used across all apps
│   │   ├── todo/           # Todo List application
│   │   │   ├── page.tsx    # Todo app page component
│   │   │   └── styles.css  # Todo app specific styles
│   │   └── bmi-calculator/ # BMI Calculator application
│   │       ├── page.tsx    # BMI Calculator page component
│   │       └── styles.css  # BMI Calculator specific styles
├── public/                 # Static assets
├── next.config.js          # Next.js configuration
├── package.json            # Project dependencies
└── tsconfig.json           # TypeScript configuration
```

## Available Applications

1. **Todo App**: A feature-rich task manager that allows you to:
   - Add, complete, and delete tasks
   - Add descriptions to tasks
   - Organize tasks into groups
   - Filter tasks by group
   - Data is saved in your browser's local storage

2. **BMI Calculator**: Calculate your Body Mass Index (BMI) and get a weight category classification with:
   - Easy height and weight input
   - Instant BMI calculation
   - Visual category representation
   - Health information and context

## Getting Started

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Navigation

- The home page allows you to select which application you want to use
- Each application has navigation buttons to switch between apps or return to the home page
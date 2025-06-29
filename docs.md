# Task Manager User Documentation

## Introduction

Welcome to Task Manager, a web application for managing tasks and collaborating with teams.

## Getting Started

1. **Access the App**: Open your browser and navigate to the hosted URL (e.g., `http://localhost:4200`).
2. **Login**: Use your admin credentials to log in (see below).

## Troubleshooting

- If the theme doesn’t switch, refresh the page.

## Features

### Login

- **Purpose**: Authenticate to access the app.
- **Steps**:
  1. Navigate to the `/login` page.
  2. Enter your email and password.
  3. Click "Login". Only admins can access the app.
  4. Use the theme toggle icon in the header to switch between light and dark modes.
- **Notes**: If credentials are invalid or you’re not an admin, an error message will appear.

### Register

- **Purpose**: Create a new admin account.
- **Steps**:
  1. Navigate to the `/register` page (accessible without login).
  2. Enter your email, password, and username.
  3. Click "Register". Only admin registrations are allowed.
  4. Use the theme toggle icon in the header to switch between light and dark modes.
- **Notes**: If the email already exists or registration fails, an error message will appear. Successful registration redirects to the Tasks page.

### Dashboard

- **Purpose**: View task metrics, charts, and recent activities.
- **Steps**:
  1. Log in and navigate to the `/dashboard` page.
  2. View total, completed, and overdue tasks in metric cards.
  3. Check task distribution by status and priority in pie charts.
  4. Review recent activities (e.g., task creation, updates) in the timeline.
  5. Use the theme toggle icon in the header to switch between light and dark modes.
- **Notes**: Requires admin login. If data fails to load, use the "Retry" button.

### Task List

- **Purpose**: View, filter, and manage tasks.
- **Steps**:
  1. Log in and navigate to the `/tasks` page.
  2. Use filters (search, status, priority, category) to refine the task list.
  3. Sort tasks by clicking column headers.
  4. Admins can add, edit, or delete tasks using the action buttons.
  5. Click the comment icon to view task comments.
  6. Use the theme toggle icon in the header to switch between light and dark modes.
- **Notes**: Requires admin privileges for modifications. Overdue tasks are highlighted.

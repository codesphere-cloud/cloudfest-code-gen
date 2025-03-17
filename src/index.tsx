'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import './shared/styles/globals.css';

export default function Home() {
  const router = useRouter();

  return (
    <main className="container">
      <div className="header">
        <h1>Welcome to My Apps</h1>
        <p style={{ color: '#666', marginTop: '0.5rem' }}>
          Choose an application to get started
        </p>
      </div>
      
      <div className="app-cards">
        <div className="app-card">
          <div className="app-card-icon" style={{ backgroundColor: '#e6f7ff' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 5H7C5.89543 5 5 5.89543 5 7V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V7C19 5.89543 18.1046 5 17 5H15" stroke="#0070F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5C15 6.10457 14.1046 7 13 7H11C9.89543 7 9 6.10457 9 5Z" stroke="#0070F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M9 12L11 14L15 10" stroke="#0070F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2>Todo App</h2>
          <p>Manage your tasks with this simple and effective todo list application.</p>
          <ul>
            <li>Add, complete, and delete tasks</li>
            <li>Tasks persist in local storage</li>
            <li>Mark tasks as completed</li>
          </ul>
          <button 
            className="app-button"
            onClick={() => router.push('/apps/todo')}
          >
            Launch Todo App
          </button>
        </div>
        
        <div className="app-card">
          <div className="app-card-icon" style={{ backgroundColor: '#f0f9ff' }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 6L16 6M16 6L12 6M16 6L16 2M12 18L8 18M8 18L4 18M8 18L8 14" stroke="#0070F3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M12 10C12 13.3137 9.31371 16 6 16C2.68629 16 0 13.3137 0 10C0 6.68629 2.68629 4 6 4C9.31371 4 12 6.68629 12 10Z" stroke="#0070F3" strokeWidth="2"/>
              <path d="M24 14C24 17.3137 21.3137 20 18 20C14.6863 20 12 17.3137 12 14C12 10.6863 14.6863 8 18 8C21.3137 8 24 10.6863 24 14Z" stroke="#0070F3" strokeWidth="2"/>
            </svg>
          </div>
          <h2>BMI Calculator</h2>
          <p>Calculate your Body Mass Index (BMI) and find out your weight category.</p>
          <ul>
            <li>Enter height and weight</li>
            <li>Get instant BMI calculation</li>
            <li>View your weight category</li>
          </ul>
          <button 
            className="app-button"
            onClick={() => router.push('/apps/bmi-calculator')}
          >
            Launch BMI Calculator
          </button>
        </div>
      </div>
      
      <footer style={{ textAlign: 'center', marginTop: '4rem', color: '#666', fontSize: '0.9rem' }}>
        <p>© 2025 My App Collection. Built with Next.js</p>
      </footer>
    </main>
  );
}
'use client'

import { useRouter } from 'next/navigation'

export default function Home() {
  const router = useRouter()

  return (
    <main className="container">
      <div className="header">
        <h1>My Apps Collection</h1>
        <p style={{ fontSize: '1.2rem', color: 'var(--text-gray)' }}>
          Choose an application below to get started
        </p>
      </div>

      <div className="app-cards">
        <div className="app-card">
          <div className="app-card-icon" style={{ backgroundColor: '#e0f7fa' }}>
            📝
          </div>
          <h2>Todo App</h2>
          <p>A feature-rich todo application to help you stay organized and productive.</p>
          <p>Features:</p>
          <ul>
            <li>Add, complete, and delete tasks</li>
            <li>Add descriptions to tasks</li>
            <li>Organize tasks into groups</li>
            <li>Filter tasks by group</li>
            <li>Data is saved in your browser</li>
          </ul>
          <button 
            className="app-button" 
            style={{ width: '100%' }}
            onClick={() => router.push('/todo')}
          >
            Open Todo App
          </button>
        </div>

        <div className="app-card">
          <div className="app-card-icon" style={{ backgroundColor: '#f3e5f5' }}>
            ⚖️
          </div>
          <h2>BMI Calculator</h2>
          <p>Calculate your Body Mass Index (BMI) and check your weight category.</p>
          <p>Features:</p>
          <ul>
            <li>Easy height and weight input</li>
            <li>Instant BMI calculation</li>
            <li>Visual category representation</li>
            <li>Health information and context</li>
          </ul>
          <button 
            className="app-button" 
            style={{ width: '100%' }}
            onClick={() => router.push('/bmi-calculator')}
          >
            Open BMI Calculator
          </button>
        </div>

        <div className="app-card">
          <div className="app-card-icon" style={{ backgroundColor: '#e8f5e9' }}>
            📅
          </div>
          <h2>Booking App</h2>
          <p>Book a 10-minute slot during Cloud Fest (Tuesday-Thursday, 9AM-5PM).</p>
          <p>Features:</p>
          <ul>
            <li>Easy time slot selection</li>
            <li>Prevents double bookings</li>
            <li>Real-time availability</li>
            <li>Booking confirmation</li>
            <li>Data is saved in a CSV file and emailed</li>
          </ul>
          <button 
            className="app-button" 
            style={{ width: '100%' }}
            onClick={() => router.push('/booking')}
          >
            Open Booking App
          </button>
        </div>
      </div>
    </main>
  )
}
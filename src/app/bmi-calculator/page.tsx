'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import './styles.css'

export default function BMICalculator() {
  const [height, setHeight] = useState('')
  const [weight, setWeight] = useState('')
  const [bmi, setBMI] = useState<number | null>(null)
  const [category, setCategory] = useState('')
  const router = useRouter()

  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100
    const weightInKg = parseFloat(weight)
    
    if (isNaN(heightInMeters) || isNaN(weightInKg) || heightInMeters <= 0 || weightInKg <= 0) {
      alert('Please enter valid height and weight values')
      return
    }
    
    const bmiValue = weightInKg / (heightInMeters * heightInMeters)
    setBMI(parseFloat(bmiValue.toFixed(1)))
    
    // Determine BMI category
    if (bmiValue < 18.5) {
      setCategory('Underweight')
    } else if (bmiValue < 25) {
      setCategory('Normal weight')
    } else if (bmiValue < 30) {
      setCategory('Overweight')
    } else {
      setCategory('Obese')
    }
  }

  const resetForm = () => {
    setHeight('')
    setWeight('')
    setBMI(null)
    setCategory('')
  }

  const getCategoryClass = (categoryName: string) => {
    return category === categoryName ? 'bmi-category active' : 'bmi-category'
  }

  return (
    <main className="container">
      <div className="header">
        <h1>BMI Calculator</h1>
        <button 
          className="app-button app-button-danger" 
          style={{ marginTop: '1rem' }}
          onClick={() => router.push('/')}
        >
          Back to Home
        </button>
      </div>
      
      <div className="bmi-form">
        <div className="input-group">
          <label htmlFor="height">Height (cm)</label>
          <input
            id="height"
            type="number"
            className="app-input"
            placeholder="Enter your height in cm"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            min="0"
          />
        </div>
        
        <div className="input-group">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            id="weight"
            type="number"
            className="app-input"
            placeholder="Enter your weight in kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            min="0"
          />
        </div>
        
        <div className="button-group">
          <button 
            className="app-button" 
            onClick={calculateBMI}
            disabled={!height || !weight}
          >
            Calculate BMI
          </button>
          <button 
            className="app-button app-button-danger" 
            onClick={resetForm}
            disabled={!height && !weight && bmi === null}
          >
            Reset
          </button>
        </div>
      </div>
      
      {bmi !== null && (
        <div className="result">
          <h2>Your Results</h2>
          
          <div className="bmi-value">{bmi}</div>
          
          <p style={{ textAlign: 'center', fontSize: '1.2rem', marginBottom: '1.5rem' }}>
            Your BMI indicates you are <strong>{category}</strong>
          </p>
          
          <div className="bmi-scale">
            <div 
              className={getCategoryClass('Underweight')} 
              style={{ backgroundColor: '#8AC1FF' }}
            >
              Underweight<br/>(&lt;18.5)
            </div>
            <div 
              className={getCategoryClass('Normal weight')} 
              style={{ backgroundColor: '#7AD887' }}
            >
              Normal<br/>(18.5-24.9)
            </div>
            <div 
              className={getCategoryClass('Overweight')} 
              style={{ backgroundColor: '#FFD678' }}
            >
              Overweight<br/>(25-29.9)
            </div>
            <div 
              className={getCategoryClass('Obese')} 
              style={{ backgroundColor: '#FF7373' }}
            >
              Obese<br/>(≥30)
            </div>
          </div>
          
          <div style={{ marginTop: '2rem', fontSize: '0.9rem', color: '#666', lineHeight: '1.5' }}>
            <p><strong>Note:</strong> BMI is a simple calculation using height and weight. While it may be useful as a general indicator, it doesn't take into account factors like muscle mass, bone density, or overall body composition.</p>
            <p>For a more complete assessment of your health status, consult with a healthcare professional.</p>
          </div>
        </div>
      )}
    </main>
  )
}
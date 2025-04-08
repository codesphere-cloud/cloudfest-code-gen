'use client'

import { useState, useEffect } from 'react'
import './styles.css'

type TimeSlot = {
  day: string
  time: string
  booked: boolean
}

type Booking = {
  name: string
  email: string
  day: string
  time: string
}

export default function BookingApp() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [bookings, setBookings] = useState<Booking[]>([])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([])
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Fetch bookings from API (which reads from CSV)
  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      if (!response.ok) {
        throw new Error('Failed to fetch bookings')
      }
      const data = await response.json()
      return data.bookings as Booking[]
    } catch (error) {
      console.error('Error fetching bookings:', error)
      setError('Failed to load bookings. Please refresh the page.')
      return []
    }
  }

  // Generate time slots and load bookings
  useEffect(() => {
    const initializeApp = async () => {
      setIsLoading(true)
      const days = ['Tuesday', 'Wednesday', 'Thursday']
      const slots: TimeSlot[] = []

      days.forEach(day => {
        for (let hour = 9; hour < 17; hour++) {
          for (let minute = 0; minute < 60; minute += 10) {
            const formattedHour = hour % 12 || 12
            const period = hour < 12 ? 'AM' : 'PM'
            const formattedMinute = minute.toString().padStart(2, '0')
            const time = `${formattedHour}:${formattedMinute} ${period}`
            
            slots.push({
              day,
              time,
              booked: false
            })
          }
        }
      })

      // Load bookings from CSV via API
      try {
        const savedBookings = await fetchBookings()
        setBookings(savedBookings)
        
        // Mark booked slots
        savedBookings.forEach(booking => {
          const slotIndex = slots.findIndex(slot => 
            slot.day === booking.day && slot.time === booking.time
          )
          if (slotIndex !== -1) {
            slots[slotIndex].booked = true
          }
        })

        setTimeSlots(slots)
      } catch (error) {
        console.error('Error initializing app:', error)
        setError('Failed to initialize the booking app. Please refresh and try again.')
      } finally {
        setIsLoading(false)
      }
    }

    initializeApp()
  }, [])

  const handleSlotSelect = (slot: TimeSlot) => {
    if (!slot.booked) {
      setSelectedSlot(slot)
      setError('') // Clear any previous errors
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedSlot || !name || !email) return
    setIsLoading(true)
    setError('')

    const newBooking = {
      name,
      email,
      day: selectedSlot.day,
      time: selectedSlot.time
    }

    try {
      // Save booking to CSV via API
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newBooking),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to book appointment')
      }

      // Update UI on success
      const updatedSlots = timeSlots.map(slot => {
        if (slot.day === selectedSlot.day && slot.time === selectedSlot.time) {
          return { ...slot, booked: true }
        }
        return slot
      })

      // Update local state
      const updatedBookings = [...bookings, newBooking]
      setBookings(updatedBookings)
      setTimeSlots(updatedSlots)
      
      // Reset form
      setName('')
      setEmail('')
      setSelectedSlot(null)
      setSuccess(true)
      
      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)
    } catch (error) {
      console.error('Error submitting booking:', error)
      setError(error instanceof Error ? error.message : 'Failed to book appointment')
    } finally {
      setIsLoading(false)
    }
  }

  if (error && !isLoading) {
    return (
      <main className="container booking-container">
        <div className="booking-header">
          <h1>Cloud Fest Booking</h1>
        </div>
        <div className="error-message">
          <p>❌ {error}</p>
          <button 
            className="app-button" 
            onClick={() => window.location.reload()}
          >
            Refresh Page
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="container booking-container">
      <div className="booking-header">
        <h1>Cloud Fest Booking</h1>
        <p>Book a 10-minute appointment during Cloud Fest (Tuesday-Thursday, 9AM-5PM)</p>
        <p className="csv-note">All bookings are saved in a CSV file on the server and emailed to the organizer.</p>
      </div>

      {isLoading ? (
        <div className="loading-spinner">
          <p>Loading bookings...</p>
        </div>
      ) : (
        <div className="booking-content">
          <div className="time-slots-container">
            <h2>Available Time Slots</h2>
            <div className="days-navigation">
              {['Tuesday', 'Wednesday', 'Thursday'].map(day => (
                <button 
                  key={day} 
                  className="day-button"
                  onClick={() => {
                    document.getElementById(day)?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  {day}
                </button>
              ))}
            </div>

            <div className="time-slots">
              {['Tuesday', 'Wednesday', 'Thursday'].map(day => (
                <div key={day} id={day} className="day-slots">
                  <h3>{day}</h3>
                  <div className="slots-grid">
                    {timeSlots
                      .filter(slot => slot.day === day)
                      .map((slot, index) => (
                        <button
                          key={`${slot.day}-${slot.time}-${index}`}
                          className={`time-slot ${
                            slot.booked ? 'booked' : ''
                          } ${
                            selectedSlot?.day === slot.day && 
                            selectedSlot?.time === slot.time ? 'selected' : ''
                          }`}
                          disabled={slot.booked}
                          onClick={() => handleSlotSelect(slot)}
                        >
                          {slot.time}
                        </button>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="booking-form-container">
            <h2>Booking Information</h2>
            {success ? (
              <div className="success-message">
                <p>✅ Your appointment has been booked successfully!</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="booking-form">
                {error && <div className="form-error">{error}</div>}
                
                <div className="form-group">
                  <label htmlFor="name">Full Name*</label>
                  <input
                    type="text"
                    id="name"
                    className="app-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">Email Address*</label>
                  <input
                    type="email"
                    id="email"
                    className="app-input"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Selected Time Slot:</label>
                  <div className="selected-slot">
                    {selectedSlot ? (
                      <p>{selectedSlot.day} at {selectedSlot.time}</p>
                    ) : (
                      <p className="no-selection">Please select a time slot</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="app-button"
                  disabled={!selectedSlot || !name || !email || isLoading}
                >
                  {isLoading ? 'Booking...' : 'Book Appointment'}
                </button>
              </form>
            )}
            
            {bookings.length > 0 && (
              <div className="your-bookings">
                <h3>Current Bookings</h3>
                <ul>
                  {bookings.map((booking, index) => (
                    <li key={index}>
                      <strong>{booking.name}</strong> - {booking.day} at {booking.time}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
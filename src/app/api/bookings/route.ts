import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { promises as fsPromises } from 'fs';
import nodemailer from 'nodemailer';

const dataDir = path.join(process.cwd(), 'data');
const bookingsFile = path.join(dataDir, 'bookings.csv');

// Email configuration
const EMAIL_RECIPIENT = 'chris@codesphere.com';

type Booking = {
  name: string;
  email: string;
  day: string;
  time: string;
};

// Ensure the data directory exists
const ensureDataDir = async () => {
  try {
    await fsPromises.access(dataDir);
  } catch (error) {
    await fsPromises.mkdir(dataDir, { recursive: true });
  }

  try {
    await fsPromises.access(bookingsFile);
  } catch (error) {
    // Create file with headers if it doesn't exist
    await fsPromises.writeFile(bookingsFile, 'name,email,day,time\n');
  }
};

// Read all bookings from CSV
async function readBookings(): Promise<Booking[]> {
  await ensureDataDir();
  
  try {
    const data = await fsPromises.readFile(bookingsFile, 'utf8');
    const lines = data.split('\n').filter(line => line.trim() !== '');
    
    // Skip header row
    if (lines.length <= 1) {
      return [];
    }
    
    const bookings = lines.slice(1).map(line => {
      const [name, email, day, time] = line.split(',');
      return { name, email, day, time };
    });
    
    return bookings;
  } catch (error) {
    console.error('Error reading bookings:', error);
    return [];
  }
}

// Write a single booking to CSV
async function writeBooking(booking: Booking): Promise<void> {
  await ensureDataDir();
  
  const line = `${booking.name},${booking.email},${booking.day},${booking.time}\n`;
  
  try {
    await fsPromises.appendFile(bookingsFile, line);
  } catch (error) {
    console.error('Error writing booking:', error);
    throw error;
  }
}

// GET handler to fetch all bookings
export async function GET() {
  try {
    const bookings = await readBookings();
    return NextResponse.json({ bookings });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
}

// Function to send confirmation email
async function sendBookingEmail(booking: Booking) {
  // Create test account for demo purposes
  // In production, you'd use your actual SMTP configuration
  try {
    const testAccount = await nodemailer.createTestAccount();
    
    const transporter = nodemailer.createTransport({
      host: 'smtp.ethereal.email',
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    
    const mailOptions = {
      from: '"Cloud Fest Booking" <booking@cloudfest.com>',
      to: EMAIL_RECIPIENT,
      subject: `New Cloud Fest Booking - ${booking.day} at ${booking.time}`,
      text: `
New booking confirmation:

Name: ${booking.name}
Email: ${booking.email}
Day: ${booking.day}
Time: ${booking.time}

This is an automated message from the Cloud Fest Booking system.
      `,
      html: `
<h2>New Cloud Fest Booking</h2>
<p>A new appointment has been booked for Cloud Fest:</p>
<table border="0" cellpadding="5">
  <tr>
    <td><strong>Name:</strong></td>
    <td>${booking.name}</td>
  </tr>
  <tr>
    <td><strong>Email:</strong></td>
    <td>${booking.email}</td>
  </tr>
  <tr>
    <td><strong>Day:</strong></td>
    <td>${booking.day}</td>
  </tr>
  <tr>
    <td><strong>Time:</strong></td>
    <td>${booking.time}</td>
  </tr>
</table>
<p>This is an automated message from the Cloud Fest Booking system.</p>
      `,
    };
    
    const info = await transporter.sendMail(mailOptions);
    
    console.log('Email sent: %s', info.messageId);
    // For development: Preview URL
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Don't fail the booking if the email fails
    return false;
  }
}

// POST handler to add a new booking
export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    const { name, email, day, time } = data;
    
    if (!name || !email || !day || !time) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if slot is already booked
    const bookings = await readBookings();
    const isSlotBooked = bookings.some(
      booking => booking.day === day && booking.time === time
    );
    
    if (isSlotBooked) {
      return NextResponse.json(
        { error: 'This time slot is already booked' },
        { status: 409 }
      );
    }
    
    // Add new booking
    const newBooking = { name, email, day, time };
    await writeBooking(newBooking);
    
    // Send email notification
    sendBookingEmail(newBooking).catch(error => {
      console.error('Failed to send email notification:', error);
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

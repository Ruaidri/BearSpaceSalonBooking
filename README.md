# Salon Booking Voice Assistant

![image](https://github.com/user-attachments/assets/09734e73-5f43-4670-890a-7702d899650e)


Welcome to the **Salon Booking Voice Assistant**! 🎤💇‍♀️ This project allows users to book salon appointments using voice commands. It leverages **React**, **Node.js**, **Stripe** for payment processing, and **Wit.ai** for voice-to-text transcription and intent recognition.

Read the slots.js file to see the data table for the stylists and their offered services and times (They are available 9 to 3pm for 7 days from the current date)

---

## Features ✨

- **Voice Recording** 🎙️: Users can record their voice to book appointments.
- **AI-Powered Intent Recognition** 🤖: Uses **Wit.ai** to understand user intent and extract booking details.
- **Slot Matching** 📅: Matches user requests with available slots in the salon.
- **Stripe Integration** 💳: Secure payment processing for confirmed bookings.
- **Real-Time Feedback** ⏱️: Displays booking details and payment status to the user.

---

## Table of Contents 📚

1. [Technologies Used](#technologies-used)
2. [Project Structure](#project-structure)
3. [Setup and Installation](#setup-and-installation)
4. [Running the Application](#running-the-application)
5. [Environment Variables](#environment-variables)
6. [API Endpoints](#api-endpoints)
7. [How It Works](#how-it-works)
8. [Screenshots](#screenshots)
9. [Future Improvements](#future-improvements)

---

## Technologies Used 💻

### Frontend
- **React** ⚛️: For building the user interface.
- **React Media Recorder** 🎙️: For recording audio.
- **Stripe.js** 💳: For handling payments.
- **Tailwind CSS** 🌈: For styling.

### Backend
- **Node.js** 🟩: For server-side logic.
- **Express.js** 🚀: For building the API.
- **Stripe** 💳: For payment intent creation.
- **Wit.ai** 🧠: For voice-to-text transcription and intent recognition.

---

## Project Structure 🗂️

```plaintext
Packages/
    salon-booking/                  # Frontend React app
    │   ├── src/
    │   ├── public/
    │   └── package.json
    ├── server/                     # Backend Node.js server
    │   ├── routes/
    │   ├── controllers/
    │   ├── .env                    # Environment variables
    │   ├── server.js               # Server entry point
    │   └── package.json
    └── README.md                   # This file
```

## Setup and Installation 🔧
### Prerequisites 🧰

Node.js (v14 or higher)
npm or yarn
Stripe Account (for payment integration)
Wit.ai Account (for voice-to-text transcription)

### Steps 🏃‍♂️
##### Clone the Repository

bash
Copy
Edit
git clone https://github.com/your-repo/salon-booking.git
cd salon-booking
Install Dependencies

### For the frontend:

cd salon-booking
npm install

### For the backend:

cd server
npm install
Set Up Environment Variables

##### Create a .env file in the server/ directory with the following content:

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLIC_KEY=your_stripe_public_key
WIT_AI_ACCESS_TOKEN=your_wit_ai_access_token

Start the Backend Server

##### Navigate to the backend directory and start the server:

cd server
node server.js
Start the Frontend React Application

##### Navigate to the frontend directory and start the application:

cd frontend
npm start
Running the Application 🚀
Open your browser and navigate to http://localhost:3000.

Use the microphone button 🎤 to record your voice and book an appointment.

Confirm the booking details displayed on the screen 📝.

Proceed to payment using the Proceed to Payment button 💳.

Complete the payment and receive a confirmation ✅.

# Environment Variables 🔑
The following environment variables are required for the application to run:

Variable	Description
STRIPE_SECRET_KEY	Your Stripe secret key for handling payments.
STRIPE_PUBLIC_KEY	Your Stripe public key for frontend integration.
WIT_AI_ACCESS_TOKEN	Your Wit.ai access token for voice-to-text and intent recognition.

# API Endpoints 🌐
POST /api/voice-booking
Description: Handles voice booking requests.

Request: Audio file in .wav format.

Response: JSON with booking details (e.g., service, stylist, date, time).

# How It Works 🛠️
1. Voice Recording 🎙️
Users record their voice using the microphone button 🎤.

The audio is sent to the backend.

2. Wit.ai Integration 🤖
The backend sends the recorded audio to Wit.ai for transcription and intent recognition.

Extracted entities (such as date, time, service, stylist, and branch) are returned.

3. Slot Matching 📅
The backend matches the extracted booking details with available slots in the salon using a slot matching service.

4. Payment Intent Creation 💳
If a slot is available, a Stripe payment intent is created, and the clientSecret is sent to the frontend.

5. Payment Processing 💳
The user completes the payment using Stripe's secure payment form.

6. Confirmation ✅
After the payment is successful, the booking is finalized, and a confirmation message is displayed to the user.


# Future Improvements 🔮
Voice Feedback 🗣️: Add voice feedback to confirm booking details and payment status.

Multiple Payment Methods 💳: Support other payment methods (e.g., Google Pay, Apple Pay).

AI-Driven Slot Matching 🧠: Improve slot matching using machine learning to predict the most suitable appointment slots.

Mobile App 📱: Extend the app to mobile platforms for a more immersive experience.

Personalized Recommendations 💡: Use AI to recommend services based on previous bookings or user preferences.

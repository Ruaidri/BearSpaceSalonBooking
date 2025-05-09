import React, { useState, useEffect } from 'react';
import { ReactMediaRecorder } from 'react-media-recorder';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { Mic, Loader2, CheckCircle, XCircle } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import PaymentForm from './components/stripePayment'

const stripePromise = loadStripe('pk_test_klJRFwoljnK57pINirDY3SL0');

const ffmpeg = new FFmpeg();

export default function VoiceBookingRecorder() {
  const [blobUrl, setBlobUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [bookingInfo, setBookingInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [elapsed, setElapsed] = useState("00:00.00");
  const [clientSecret, setClientSecret] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  useEffect(() => {
    let timer;

    if (isRecording) {
      if (!startTime) {
        setStartTime(Date.now());
      }

      timer = setInterval(() => {
        const delta = Date.now() - startTime;
        const seconds = ((delta / 1000) % 60).toFixed(2).padStart(5, '0');
        const minutes = Math.floor(delta / 60000).toString().padStart(2, '0');
        setElapsed(`${minutes}:${seconds}`);
      }, 100);
    } else {
      clearInterval(timer);
      setStartTime(null);
      setElapsed("00:00.00");
    }

    return () => clearInterval(timer);
  }, [isRecording, startTime]);

  useEffect(() => {
    if (blobUrl) sendAudioToBackend(blobUrl);
  }, [blobUrl]);

  const convertWebMToWav = async (webmBlob) => {
    await ffmpeg.load();
    const data = await webmBlob.arrayBuffer();
    ffmpeg.writeFile('input.webm', new Uint8Array(data));
    await ffmpeg.exec(['-i', 'input.webm', 'output.wav']);
    const wavData = await ffmpeg.readFile('output.wav');
    return new Blob([wavData.buffer], { type: 'audio/wav' });
  };

  const sendAudioToBackend = async (url) => {
    setLoading(true);
    try {
      const response = await fetch(url);
      const webmBlob = await response.blob();
      const wavBlob = await convertWebMToWav(webmBlob);
      const formData = new FormData();
      formData.append("audio", wavBlob, "audio.wav");

      const res = await fetch("http://localhost:3001/api/voice-booking", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      setBookingInfo(data);

      if (data?.slot) {
        setClientSecret(data.clientSecret);
      }
    } catch (err) {
      console.error("❌ Error sending audio:", err.message);
      setBookingInfo({ message: "An error occurred.", error: err.message });
    }
    setLoading(false);
  };

  const handlePaymentSuccess = () => {
    setPaymentCompleted(true);
    setShowPaymentModal(false);
  };

const getInstructionText = () => {
  if (loading) return "🧠 Hang tight, analyzing your request...";
  
  if (paymentCompleted) return "✅ Payment successful! You're all booked in. See you soon!";
  
  if (showPaymentModal) return "💳 Almost there! Complete your payment to confirm your booking.";
  
  if (bookingInfo) {
    if (bookingInfo.slot?.slot) {
      return "🎉 Great! We’ve found a slot for you. Go ahead and confirm it.";
    } else {
      return `${bookingInfo.slot?.reason || bookingInfo.message || bookingInfo.error}`;
    }
  }

  if (isRecording) return "🎙️ Recording... Speak clearly to book your appointment.";

  return "🎤 Tap the mic and tell us how we can help you book.";
};


  return (
    <ReactMediaRecorder
      audio={{ channelCount: 1 }}
      onStop={(url) => setBlobUrl(url)}
      render={({ startRecording, stopRecording, mediaBlobUrl }) => (
        <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-700 flex items-center justify-center px-4">
          <div className="bg-white/20 backdrop-blur-xl rounded-3xl shadow-2xl p-6 w-full max-w-xs space-y-6 text-center">
            {/* Header */}
            <div className="flex justify-between items-center">
              <button className="bg-white rounded-full p-2 shadow">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16"></path></svg>
              </button>
              <h1 className="text-sm font-semibold text-white">Book Your Appointment</h1>
              <img src="https://i.pravatar.cc/100" className="w-8 h-8 rounded-full border" />
            </div>

            {/* Mic Button */}
            <div className="flex justify-center mt-2">
              <button
                onClick={() => {
                  if (!isRecording) {
                    setIsRecording(true);
                    setBlobUrl(null);
                    setBookingInfo(null);
                    startRecording();
                  } else {
                    setIsRecording(false);
                    stopRecording();
                  }
                }}
                className={`p-6 rounded-full shadow-lg transition-all duration-300 ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-gradient-to-br from-orange-400 to-red-500'
                  }`}
              >
                <Mic className="w-10 h-10 text-white" />
              </button>
            </div>

            {/* Timer */}
            <div className="text-2xl font-mono text-white">{elapsed}</div>

            {/* Audio & Result */}
            {mediaBlobUrl && (
              <audio src={mediaBlobUrl} controls className="w-full rounded-xl shadow-inner mt-4" />
            )}

            {loading && (
              <div className="flex items-center justify-center text-white space-x-2">
                <Loader2 className="animate-spin" />
                <span>Processing...</span>
              </div>
            )}

            {bookingInfo && (
              <div className="bg-white p-4 rounded-lg shadow space-y-2 text-sm text-gray-700">
                <p><strong>Transcript:</strong> {bookingInfo.transcript}</p>
                {bookingInfo.slot && bookingInfo.slot.slot ? (
                  <div className="text-green-600">
                    <CheckCircle className="inline mr-1" /> Booking Confirmed!
                    <p><strong>Service:</strong> {bookingInfo.slot.slot.service}</p>
                    <p><strong>Stylist:</strong> {bookingInfo.slot.slot.stylist}</p>
                    <p><strong>Branch:</strong> {bookingInfo.slot.slot.branch}</p>
                    <p><strong>Date/Time:</strong> {new Date(bookingInfo.slot.slot.datetime).toLocaleString()}</p>
                    {/* Show Payment Button */}
                    {!paymentCompleted && (
                      <button
                        onClick={() => setShowPaymentModal(true)}
                        className="mt-4 w-full py-2 bg-blue-500 text-white rounded-lg"
                      >
                        Proceed to Payment
                      </button>
                    )}
                  </div>
                ) : (
                  null
                )}
              </div>
            )}
          </div>

          {/* Payment Modal */}
          {showPaymentModal && clientSecret && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                <h2 className="text-xl font-semibold mb-4">Complete Your Payment</h2>
                <Elements stripe={stripePromise}>
                  <PaymentForm clientSecret={clientSecret} onPaymentSuccess={handlePaymentSuccess} />
                </Elements>
                <button
                  onClick={() => setShowPaymentModal(false)}
                  className="mt-4 w-full py-2 bg-red-500 text-white rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          )}

<div className="fixed bottom-6 inset-x-0 mx-auto bg-white text-gray-800 text-sm px-5 py-3 rounded-full shadow-lg border border-gray-300 backdrop-blur-md max-w-md text-center">
  {getInstructionText()}
</div>

        </div>
      )}
    />
  );
}
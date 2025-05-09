const fs = require('fs');
const axios = require('axios');
const { findMatchingSlot } = require('../services/slotService');
const { parseWitResponse } = require('../services/witService');
const sessionStore = require('../utils/sessionStore');

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handleVoiceBooking = async (req, res) => {
  try {
    const audioPath = req.file.path;
    const wavPath = `${audioPath}.wav`;
    fs.renameSync(audioPath, wavPath);

    const audioData = fs.readFileSync(wavPath);

    const witResponse = await axios.post('https://api.wit.ai/speech?v=20201022', audioData, {
      headers: {
        Authorization: `Bearer ${process.env.WIT_AI_ACCESS_TOKEN}`,
        'Content-Type': 'audio/wav',
      },
      responseType: 'text',
      timeout: 60000,
    });

    const { transcript, intent, entities } = parseWitResponse(witResponse.data);

    if (!transcript || !intent) {
      return res.status(400).json({ error: 'No valid transcription or understanding available.' });
    }

    const sessionId = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const previousSession = sessionStore.get(sessionId) || { transcript: '', intent: '', entities: {} };

    const mergedEntities = { ...previousSession.entities, ...entities };
    sessionStore.set(sessionId, { transcript, intent, entities: mergedEntities });

    const dateTimeEntity = mergedEntities['wit$datetime:datetime']?.[0]?.value;
    const stylistEntity = mergedEntities['wit_stylist:wit_stylist']?.[0]?.body;
    const serviceEntity = mergedEntities['service:service']?.[0]?.body;
    const branchEntity = mergedEntities['wit$location:location']?.[0]?.body;

    const missing = [];
    if (!dateTimeEntity) missing.push('date/time');
    if (!serviceEntity) missing.push('service');
    if (!branchEntity) missing.push('branch');

    if (intent === 'book_appointment') {
      if (missing.length > 0) {
        const parts = [];

        if (serviceEntity) {
          parts.push(`Ok, you want a ${serviceEntity}`);
        }

        if (stylistEntity) {
          parts.push(`with ${stylistEntity}`);
        }

        let message = parts.length > 0 ? `${parts.join(' ')}.` : `Got it. You're trying to make a booking.`;

        const needs = missing.map((m) => {
          if (m === 'date/time') return 'a time';
          if (m === 'branch') return 'a location';
          return m;
        });

        message += ` To confirm your booking, I still need ${needs.join(' and ')}.`;
        if (!stylistEntity) {
          message += ` You can also pick a stylist if you like.`;
        }

        return res.json({
          message,
          transcript,
          intent,
          entities: mergedEntities,
          slot: null,
        });
      }


const slot = findMatchingSlot({
  service: serviceEntity,
  stylist: stylistEntity || null,
  date: dateTimeEntity,
  branch: branchEntity
});

if (slot && slot.slot) {
  sessionStore.delete(sessionId);

        const amount = 5000;
        const currency = 'eur';

        try {
          const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            metadata: { bookingId: slot.slot.id },
          });

          sessionStore.delete(sessionId);

          return res.json({
            message: 'Booking confirmed! Please complete your payment.',
            transcript,
            intent,
            entities: mergedEntities,
            slot,
            clientSecret: paymentIntent.client_secret,
          });

        } catch (err) {
          console.error('🔥 Stripe Error:', err.message);
          return res.status(500).json({ error: 'Payment intent creation failed.', detail: err.message });
        }
      } else {
        const responseMessage = slot?.reason || 'That slot isn’t available.';

        return res.json({
          message: `${responseMessage}`,
          transcript,
          intent,
          entities: mergedEntities,
          slot: null,
        });
      }

    } else {
      return res.status(400).json({ error: 'Unknown intent.' });
    }
  } catch (err) {
    console.error('🔥 Error:', err.message);
    return res.status(500).json({ error: 'Server error', detail: err.message });
  }
};

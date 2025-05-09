exports.parseWitResponse = (responseData) => {
  const lines = responseData.split('\r\n').filter((line) => line.trim().length > 0);
  const parsedChunks = [];

  for (const line of lines) {
    try {
      const parsed = JSON.parse(line);
      parsedChunks.push(parsed);
    } catch (e) {
      console.warn('⚠️ Failed to parse line:', line);
    }
  }

  const finalTranscription = parsedChunks.find((c) => c.text);
  const finalUnderstanding = parsedChunks.find((c) => c.intents?.length > 0);

  return {
    transcript: finalTranscription?.text || null,
    intent: finalUnderstanding?.intents?.[0]?.name || null,
    entities: finalUnderstanding?.entities || {},
  };
};
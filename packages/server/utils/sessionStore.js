const sessionStore = {};

exports.get = (sessionId) => sessionStore[sessionId];
exports.set = (sessionId, data) => {
  sessionStore[sessionId] = data;
};
exports.delete = (sessionId) => {
  delete sessionStore[sessionId];
};
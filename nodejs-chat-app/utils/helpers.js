const crypto = require('crypto');

module.exports = {
  generateRandomToken: (length = 32) => {
    return crypto.randomBytes(length).toString('hex');
  },
  sanitizeUser: (user) => {
    if (!user) return null;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  getClientIp: (req) => {
    return req.ip || 
      req.headers['x-forwarded-for'] || 
      req.connection.remoteAddress;
  },
};
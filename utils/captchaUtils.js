function generateCaptcha() {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return captcha;
}

function generateUniqueId() {
  const epochTime = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  return `${epochTime}-${randomString}`;
}

module.exports = {
  generateCaptcha,
  generateUniqueId,
};

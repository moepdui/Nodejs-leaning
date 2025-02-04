const express = require('express');
const redisClient = require('../redisClient');
const { generateCaptcha, generateUniqueId } = require('../utils/captchaUtils');
const breaker = require('../utils/circuitBreaker');
const { captchaValidationRules, validate } = require('../utils/validation');
const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Generate a CAPTCHA
 *     description: Generate a CAPTCHA and return the form with the CAPTCHA text.
 *     responses:
 *       200:
 *         description: Returns the CAPTCHA form.
 *       500:
 *         description: Server error.
 */
router.get('/', async (req, res) => {
  try {
    const captchaId = generateUniqueId();
    const captchaText = generateCaptcha();

    // Use circuit breaker to set CAPTCHA in Redis
    await breaker.fire(redisClient, captchaId, captchaText, 300);

    res.render('index', { captchaId, captchaText });
  } catch (err) {
    console.error('Error in GET /:', err);
    res.status(500).send('Server error');
  }
});

/**
 * @swagger
 * /submit:
 *   post:
 *     summary: Validate CAPTCHA
 *     description: Validate the CAPTCHA input by the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               captchaId:
 *                 type: string
 *                 description: The unique ID of the CAPTCHA.
 *               captchaInput:
 *                 type: string
 *                 description: The user input for the CAPTCHA.
 *     responses:
 *       200:
 *         description: CAPTCHA validated successfully.
 *       422:
 *         description: Invalid CAPTCHA input.
 *       500:
 *         description: Server error.
 */
router.post('/submit', captchaValidationRules(), validate, async (req, res) => {
  try {
    const { captchaId, captchaInput } = req.body;

    const storedCaptcha = await redisClient.get(captchaId);

    if (storedCaptcha && storedCaptcha === captchaInput) {
      res.send('CAPTCHA validated successfully!');
    } else {
      res.send('Invalid CAPTCHA, please try again.');
    }
  } catch (err) {
    console.error('Error in POST /submit:', err);
    res.status(500).send('Server error');
  }
});

module.exports = router;

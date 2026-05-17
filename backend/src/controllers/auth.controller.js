const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res) => {
  try {
    const { user } = await authService.register(req.body);
    // OTP is logged server-side only — never returned to client
    return successResponse(res, 201, 'Doğrulama kodu e-postanıza gönderildi.', {
      requiresVerification: true,
      email: user.email,
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    const { token, user } = await authService.verifyEmail(email, code);
    return successResponse(res, 200, 'Hesabınız doğrulandı.', { token, user });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const ip = req.ip;
    const userAgent = req.headers['user-agent'];
    const { token, user } = await authService.login(email, password, ip, userAgent);
    return successResponse(res, 200, 'Giriş başarılı.', { token, user });
  } catch (error) {
    return errorResponse(res, 401, error.message);
  }
};

module.exports = { register, verifyEmail, login };

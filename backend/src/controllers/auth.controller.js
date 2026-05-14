const authService = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

const register = async (req, res, next) => {
  try {
    const { user, otp } = await authService.register(req.body);
    return successResponse(res, 201, 'Doğrulama kodu e-postanıza gönderildi.', {
      email: user.email,
      mockCode: otp,
    });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const { email, code } = req.body;
    const { token, user } = await authService.verifyEmail(email, code);
    return successResponse(res, 200, 'Hesabınız doğrulandı.', { token, user });
  } catch (error) {
    return errorResponse(res, 400, error.message);
  }
};

const login = async (req, res, next) => {
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

module.exports = {
  register,
  verifyEmail,
  login,
};

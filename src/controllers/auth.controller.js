const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { successResponse, errorResponse } = require('../utils/apiResponse');

const generateRefCode = (name) => {
    return name.substring(0, 3).toUpperCase() + Math.random().toString(36).substring(2, 8).toUpperCase();
};

const register = async (req, res, next) => {
    try {
        const { name, email, password, referralCode } = req.body;

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return errorResponse(res, 400, 'Email already in use.');
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        let refCode = generateRefCode(name);
        
        // Ensure unique refCode
        let codeExists = await prisma.user.findUnique({ where: { refCode } });
        while(codeExists) {
            refCode = generateRefCode(name);
            codeExists = await prisma.user.findUnique({ where: { refCode } });
        }

        let referredById = null;
        let grandReferredById = null;

        if (referralCode) {
            const referrer = await prisma.user.findUnique({ where: { refCode: referralCode } });
            if (referrer) {
                referredById = referrer.id;
                grandReferredById = referrer.referredById; // level 2
            }
        }

        // Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                refCode,
                referredById,
                grandReferredById,
                isVerified: false,
                verificationCode: otp
            }
        });

        // Mock Email Sending
        console.log(`\n=========================================`);
        console.log(`MOCK EMAIL SENT TO: ${email}`);
        console.log(`YOUR VERIFICATION CODE: ${otp}`);
        console.log(`=========================================\n`);

        return successResponse(res, 201, 'Doğrulama kodu e-postanıza gönderildi.', {
            requiresVerification: true,
            email: newUser.email,
            // For testing convenience, we return it in response as well
            mockCode: otp 
        });
    } catch (error) {
        next(error);
    }
};

const verifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        
        if (!user) {
            return errorResponse(res, 404, 'Kullanıcı bulunamadı.');
        }
        if (user.isVerified) {
            return errorResponse(res, 400, 'Hesap zaten doğrulanmış.');
        }
        if (user.verificationCode !== code) {
            return errorResponse(res, 400, 'Geçersiz doğrulama kodu.');
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { isVerified: true, verificationCode: null }
        });

        // Create Notification for Referrer
        if (updatedUser.referredById) {
            try {
                await prisma.notification.create({
                    data: {
                        userId: updatedUser.referredById,
                        type: 'referral',
                        title: 'Yeni Referans! 👤',
                        message: `${updatedUser.name} referans linkin ile aramıza katıldı.`
                    }
                });
            } catch (e) {
                console.error('Notification error:', e);
            }
        }

        const token = jwt.sign({ id: updatedUser.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        return successResponse(res, 200, 'Hesabınız başarıyla doğrulandı!', {
            token,
            user: {
                id: updatedUser.id,
                name: updatedUser.name,
                email: updatedUser.email,
                phone: updatedUser.phone,
                isPremium: updatedUser.isPremium
            }
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return errorResponse(res, 401, 'Invalid credentials.');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return errorResponse(res, 401, 'Invalid credentials.');
        }

        if (!user.isVerified) {
            return errorResponse(res, 403, 'Lütfen önce e-posta adresinizi doğrulayın. Kayıt olurken gönderdiğimiz kodu kullanın.');
        }

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Record Session
        const ua = req.headers['user-agent'] || 'Unknown';
        let device = 'Desktop';
        let browser = 'Other';

        if (/mobile/i.test(ua)) device = 'Mobile';
        else if (/tablet/i.test(ua)) device = 'Tablet';
        else if (/macintosh/i.test(ua)) device = 'MacBook';
        else if (/windows/i.test(ua)) device = 'Windows PC';

        if (/chrome/i.test(ua)) browser = 'Chrome';
        else if (/safari/i.test(ua)) browser = 'Safari';
        else if (/firefox/i.test(ua)) browser = 'Firefox';
        else if (/edge/i.test(ua)) browser = 'Edge';

        await prisma.session.create({
            data: {
                userId: user.id,
                device,
                browser,
                ip: req.ip || '127.0.0.1',
                active: true
            }
        });

        return successResponse(res, 200, 'Login successful', {
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                isPremium: user.isPremium
            }
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    register,
    verifyEmail,
    login
};

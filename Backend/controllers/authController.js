const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const cloudinary = require("../config/cloudinary");
const { Readable } = require("stream");

// ====================
// Google Apps Script Email Service
// ====================

const sendEmail = async ({ email, subject, html, message = "" }) => {
  if (!process.env.GOOGLE_SCRIPT_URL || !process.env.GOOGLE_SCRIPT_SECRET) {
    throw new Error("Google Email Service environment variables are missing");
  }

  const response = await fetch(process.env.GOOGLE_SCRIPT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      secret: process.env.GOOGLE_SCRIPT_SECRET,
      email,
      subject,
      message,
      html,
    }),
    redirect: "follow",
  });

  const result = await response.json();

  if (!response.ok || !result.success) {
    throw new Error(result.message || "Email sending failed");
  }

  return result;
};

// ====================
// Send Email OTP
// ====================

const sendVerificationEmail = async (email, otp) => {
  await sendEmail({
    email,
    subject: "Your Hishabio Verification Code",
    message: `Your Hishabio verification code is ${otp}. It expires in 5 minutes.`,

    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Verify Your Hishabio Account</title>
      </head>

      <body style="
        margin: 0;
        padding: 0;
        background-color: #f1f5f9;
        font-family: Arial, Helvetica, sans-serif;
      ">

        <table width="100%" cellpadding="0" cellspacing="0"
          style="background-color: #f1f5f9; padding: 35px 12px;">
          <tr>
            <td align="center">

              <table width="100%" cellpadding="0" cellspacing="0"
                style="
                  max-width: 560px;
                  background-color: #ffffff;
                  border-radius: 18px;
                  overflow: hidden;
                ">

                <tr>
                  <td align="center"
                    style="
                      padding: 35px 20px;
                      background-color: #4f46e5;
                      background-image: linear-gradient(135deg, #4f46e5, #7c3aed);
                    ">

                    <div style="
                      display: inline-block;
                      padding: 10px 14px;
                      background-color: rgba(255,255,255,0.15);
                      border-radius: 12px;
                      color: #ffffff;
                      font-size: 24px;
                      font-weight: 800;
                      letter-spacing: -1px;
                    ">
                      Hishabio
                    </div>

                    <p style="margin: 15px 0 0; color: #e0e7ff; font-size: 14px;">
                      Share Expenses. Simplify Life.
                    </p>

                  </td>
                </tr>

                <tr>
                  <td style="padding: 40px 30px 25px;">

                    <h1 style="
                      margin: 0 0 15px;
                      color: #111827;
                      font-size: 25px;
                      text-align: center;
                    ">
                      Verify Your Email
                    </h1>

                    <p style="
                      margin: 0 0 12px;
                      color: #475569;
                      font-size: 15px;
                      line-height: 1.8;
                      text-align: center;
                    ">
                      Welcome to Hishabio! We're excited to have you
                      on board.
                    </p>

                    <p style="
                      margin: 0 0 28px;
                      color: #475569;
                      font-size: 15px;
                      line-height: 1.8;
                      text-align: center;
                    ">
                      Use the verification code below to complete
                      your account registration.
                    </p>

                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center"
                          style="
                            padding: 25px 15px;
                            background-color: #eef2ff;
                            border: 1px solid #c7d2fe;
                            border-radius: 14px;
                          ">

                          <p style="
                            margin: 0 0 12px;
                            color: #64748b;
                            font-size: 12px;
                            font-weight: bold;
                            letter-spacing: 2px;
                            text-transform: uppercase;
                          ">
                            Your Verification Code
                          </p>

                          <h1 style="
                            margin: 0;
                            color: #4f46e5;
                            font-size: 38px;
                            font-weight: 800;
                            letter-spacing: 10px;
                          ">
                            ${otp}
                          </h1>

                        </td>
                      </tr>
                    </table>

                    <p style="
                      margin: 25px 0 10px;
                      color: #475569;
                      font-size: 14px;
                      text-align: center;
                      line-height: 1.7;
                    ">
                      This verification code will expire in
                      <strong style="color: #dc2626;">5 minutes</strong>.
                    </p>

                    <p style="
                      margin: 0;
                      color: #64748b;
                      font-size: 13px;
                      text-align: center;
                      line-height: 1.7;
                    ">
                      Please do not share this code with anyone.
                      Hishabio will never ask you for this code.
                    </p>

                  </td>
                </tr>

                <tr>
                  <td style="
                    padding: 22px 25px;
                    background-color: #f8fafc;
                    border-top: 1px solid #e2e8f0;
                  ">

                    <p style="
                      margin: 0 0 8px;
                      color: #475569;
                      font-size: 13px;
                      text-align: center;
                      line-height: 1.6;
                    ">
                      If you didn't create a Hishabio account,
                      you can safely ignore this email.
                    </p>

                    <p style="
                      margin: 15px 0 0;
                      color: #94a3b8;
                      font-size: 12px;
                      text-align: center;
                    ">
                      © ${new Date().getFullYear()} Hishabio. All rights reserved.
                    </p>

                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </body>
      </html>
    `,
  });
};

// ====================
// User Registration
// ====================

const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email and password",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid email address",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters",
      });
    }

    let user = await User.findOne({ email: normalizedEmail });

    if (user?.isVerified) {
      return res.status(409).json({
        success: false,
        message: "Email already registered. Please login.",
      });
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const hashedPassword = await bcrypt.hash(password, 10);
    const hashedOtp = await bcrypt.hash(otp, 10);

    if (user) {
      user.name = name.trim();
      user.password = hashedPassword;
      user.otpHash = hashedOtp;
      user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
    } else {
      user = new User({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
        otpHash: hashedOtp,
        otpExpires: new Date(Date.now() + 5 * 60 * 1000),
      });
    }

    await user.save();

    try {
      await sendVerificationEmail(normalizedEmail, otp);
    } catch (emailError) {
      console.error("OTP Email Error:", emailError.message);

      return res.status(500).json({
        success: false,
        message: "Unable to send verification email. Please try again.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully. Please verify your email.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Registration Error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Email already registered.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Registration failed",
    });
  }
};

// ====================
// Verify Email OTP
// ====================

const verifyEmail = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required",
      });
    }

    if (!/^\d{6}$/.test(String(otp))) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid 6-digit OTP",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+otpHash +otpExpires");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Registration not found. Please register again.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: "Email is already verified. Please login.",
      });
    }

    if (!user.otpHash || !user.otpExpires || user.otpExpires < new Date()) {
      return res.status(400).json({
        success: false,
        message: "OTP expired. Please register again.",
      });
    }

    const isOtpMatch = await bcrypt.compare(String(otp), user.otpHash);

    if (!isOtpMatch) {
      return res.status(400).json({
        success: false,
        message: "Incorrect OTP. Please try again.",
      });
    }

    user.isVerified = true;
    user.otpHash = undefined;
    user.otpExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully. You can now login.",
    });
  } catch (error) {
    console.error("OTP Verification Error:", error);

    return res.status(500).json({
      success: false,
      message: "Email verification failed",
    });
  }
};

// ====================
// User Login
// ====================

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password",
      });
    }

    const user = await User.findOne({
      email: email.trim().toLowerCase(),
    }).select("+password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    if (user.isVerified === false) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login.",
      });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Login Error:", error);

    return res.status(500).json({
      success: false,
      message: "Login failed",
    });
  }
};

// ====================
// Get Logged-in User
// ====================

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to get user profile",
    });
  }
};

// ====================
// Update User Profile
// ====================

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({
          success: false,
          message: "Name cannot be empty",
        });
      }

      user.name = name.trim();
    }

    if (phone !== undefined) {
      user.phone = phone.trim();
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

// ====================
// Update Profile Image
// ====================

const updateProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please select an image",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "hishabio/profile-images",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            return reject(error);
          }

          resolve(result);
        },
      );

      Readable.from([req.file.buffer]).pipe(uploadStream);
    });

    user.profileImage = uploadResult.secure_url;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    console.error("Profile Image Upload Error:", error);

    res.status(500).json({
      success: false,
      message: "Profile image upload failed",
      error: error.message,
    });
  }
};

// ====================
// Forgot Password
// ====================

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;

    await user.save({ validateBeforeSave: false });

    const resetURL = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: "Hishabio - Reset Your Password",
        message: `Reset your Hishabio password using this link: ${resetURL}`,

        html: `
          <div style="font-family: Arial; padding: 25px; max-width: 500px; margin: auto;">
            <h2 style="color: #6366f1;">Hishabio</h2>
            <h3>Password Reset Request</h3>
            <p>We received a request to reset your password.</p>
            <p>Click the button below to create a new password.</p>

            <a href="${resetURL}"
              style="display:inline-block; padding:12px 22px; background:#6366f1; color:white; text-decoration:none; border-radius:8px;">
              Reset Password
            </a>

            <p>This link expires in 15 minutes.</p>
            <p>If you did not request this, please ignore this email.</p>
          </div>
        `,
      });

      return res.status(200).json({
        success: true,
        message: "If the email exists, a reset link has been sent.",
      });
    } catch (emailError) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpires = undefined;

      await user.save({ validateBeforeSave: false });

      throw emailError;
    }
  } catch (error) {
    console.error("Forgot Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to send password reset email",
    });
  }
};

// ====================
// Reset Password
// ====================

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password || password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    }).select("+resetPasswordToken +resetPasswordExpires");

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired reset link",
      });
    }

    user.password = await bcrypt.hash(password, 10);

    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Password reset successful. Please login.",
    });
  } catch (error) {
    console.error("Reset Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to reset password",
    });
  }
};

// ====================
// Export Controllers
// ====================

module.exports = {
  registerUser,
  verifyEmail,
  loginUser,
  getMe,
  updateProfile,
  updateProfileImage,
  forgotPassword,
  resetPassword,
};

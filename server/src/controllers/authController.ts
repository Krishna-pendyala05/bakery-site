import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { AuthRequest } from '../middleware/authMiddleware';

// Send OTP
export const sendOtp = async (req: Request, res: Response): Promise<void> => {
  const { mobile } = req.body;

  if (!mobile) {
    res.status(400).json({ message: 'Mobile number is required' });
    return;
  }

  try {
    // Standardise number and generate OTP
    const otpCode = mobile === '+919999999999' 
      ? '1234' 
      : Math.floor(1000 + Math.random() * 9000).toString();
      
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes validity

    // Create or update user
    await prisma.user.upsert({
      where: { mobile },
      update: {
        otp: otpCode,
        otpExpiry,
      },
      create: {
        mobile,
        otp: otpCode,
        otpExpiry,
        verified: false,
      },
    });

    console.log(`[OTP Services] Sent OTP Code "${otpCode}" to phone "${mobile}"`);

    res.json({
      message: 'OTP sent successfully',
      // For easy frontend mock testing on dev environments
      otp: process.env.NODE_ENV === 'development' ? otpCode : undefined 
    });
  } catch (error: any) {
    console.error('Error in sendOtp:', error);
    res.status(500).json({ message: 'Internal server error occurred while sending OTP' });
  }
};

// Verify OTP
export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { mobile, otp } = req.body;

  if (!mobile || !otp) {
    res.status(400).json({ message: 'Mobile number and OTP code are required' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { mobile },
    });

    if (!user) {
      res.status(404).json({ message: 'User not found. Request a new OTP.' });
      return;
    }

    // Validate OTP and Expiry
    if (user.otp !== otp) {
      res.status(400).json({ message: 'Invalid OTP code entered.' });
      return;
    }

    if (user.otpExpiry && new Date() > user.otpExpiry) {
      res.status(400).json({ message: 'OTP has expired. Request a new one.' });
      return;
    }

    // Mark as verified & clear OTP
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: {
        verified: true,
        otp: null,
        otpExpiry: null,
      },
    });

    // Sign JWT Token
    const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkeyforlocaldevelopment123456';
    const token = jwt.sign(
      { id: updatedUser.id, mobile: updatedUser.mobile },
      jwtSecret,
      { expiresIn: '7d' }
    );

    res.json({
      message: 'Authentication successful',
      token,
      user: {
        id: updatedUser.id,
        mobile: updatedUser.mobile,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        verified: updatedUser.verified
      }
    });
  } catch (error: any) {
    console.error('Error in verifyOtp:', error);
    res.status(500).json({ message: 'Internal server error during verification' });
  }
};

// Get current user session
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized session' });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      res.status(404).json({ message: 'User profile not found' });
      return;
    }

    res.json({
      user: {
        id: user.id,
        mobile: user.mobile,
        name: user.name,
        email: user.email,
        address: user.address,
        verified: user.verified
      }
    });
  } catch (error: any) {
    console.error('Error in getMe:', error);
    res.status(500).json({ message: 'Internal server error fetching user data' });
  }
};

// Update User Profile (Register Name, Email, Address)
export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  if (!req.user) {
    res.status(401).json({ message: 'Unauthorized session' });
    return;
  }

  const { name, email, address, pincode } = req.body;

  if (!name || !email || !address || !pincode) {
    res.status(400).json({ message: 'All registration fields are required' });
    return;
  }

  // Validate Email Format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    res.status(400).json({ message: 'Please enter a valid email address' });
    return;
  }

  // Validate Pincode: Hyderabad pincodes start with 500 and are 6 digits
  const pincodeRegex = /^500\d{3}$/;
  if (!pincodeRegex.test(pincode)) {
    res.status(400).json({ message: 'We only deliver within Hyderabad (pincodes starting with 500)' });
    return;
  }

  // List of valid delivery pincodes within 5-10km range of Central Hyderabad
  const deliveryPincodes = new Set([
    '500001', '500002', '500003', '500004', '500007', '500008', '500012', 
    '500013', '500016', '500018', '500020', '500024', '500025', '500027', 
    '500028', '500029', '500030', '500034', '500035', '500036', '500038', 
    '500041', '500044', '500045', '500048', '500053', '500057', '500059', 
    '500060', '500063', '500064', '500065', '500068', '500072', '500073',
    '500074', '500075', '500076', '500079', '500080', '500081', '500082',
    '500084', '500085', '500089', '500090', '500095', '500097'
  ]);

  if (!deliveryPincodes.has(pincode)) {
    res.status(400).json({ message: 'This pincode is outside our 5-10 km delivery radius in Hyderabad.' });
    return;
  }

  const combinedAddress = `${address}, Hyderabad - ${pincode}`;

  try {
    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        name,
        email,
        address: combinedAddress,
      },
    });

    res.json({
      message: 'Profile registered successfully',
      user: {
        id: updatedUser.id,
        mobile: updatedUser.mobile,
        name: updatedUser.name,
        email: updatedUser.email,
        address: updatedUser.address,
        verified: updatedUser.verified
      }
    });
  } catch (error: any) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({ message: 'Internal server error updating registration profile' });
  }
};

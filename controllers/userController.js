import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

import userModal from '../models/user.js';

const secret = process.env.SECRETPASS;

export const signIn = async (req, res) => {
  const { email, password: userPassword } = req.body;

  try {
    const oldUser = await userModal.findOne({ email });

    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(userPassword, oldUser.password);

    if (!isPasswordCorrect)
      return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: '2h',
    });

    const { password, ...others } = oldUser._doc

    res.status(200).json({ result: others, token });
  } catch (err) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};

export const signUp = async (req, res) => {
  const { email, password: userPassword, firstName, lastName } = req.body;

  try {
    const oldUser = await userModal.findOne({ email });

    if (oldUser)
      return res.status(400).json({ message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(userPassword, 12);

    const result = await userModal.create({
      email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`,
    });

    const token = jwt.sign({ email: result.email, id: result._id }, secret, {
      expiresIn: '2h',
    });

    const { password, ...others } = result._doc

    res.status(201).json({ result: others, token });
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
};


//Update User Details
export const updateUser = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;
    
    const id = req.params.id;
    // const id = req.body.id;

    const hashedPassword = await bcrypt.hash(password, 13);
    
    const updatedUser = {
      email: email,
      password: hashedPassword,
      name: `${firstName} ${lastName}`
    };
    const options = { new: true };

    const data = await userModal.findByIdAndUpdate(id, updatedUser, options);
    const token = jwt.sign({ email: updatedUser.email, id: updatedUser._id }, secret, {
      expiresIn: '2h',
    });

    res.status(200).json({ message: 'updated successfully', data, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

//Delete account

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  // const password = req.body.password;
  const { email, password } = req.body;


  try {
    const oldUser = await userModal.findOne({ email });
    if (!oldUser)
      return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    await userModal.findByIdAndDelete(id);

    res.status(200).json('USER WAS DELETED SUCCESSULLY');
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}

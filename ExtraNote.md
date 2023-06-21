===> Backend comprises of
(a). server e.g Express.js+Node.js
(b). Database e.g MongoDB

Full Stack Development
MERN STACK

install packages

* npm install express cors mongoose morgan

// SIGN IN
export const signin = async (req, res) => {
	const { email, password } = req.body;

	const secret = 'testsecret123';

	try {
		const oldUser = await userModel.findOne({ email });

		if (!oldUser) {
			return res.status(404).json({ message: 'User Does not Exist' });
		}

		const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

		if (!isPasswordCorrect) {
			return res.status(400).json({ message: 'Invalid Credentials' });
		}

		const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, { expiresIn: '1h' });

		res.status(200).json({ result: oldUser, token });
	} catch (error) {
		res.status(500).json({ error: error.message });
	}
};

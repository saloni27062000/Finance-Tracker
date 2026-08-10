
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getUserByEmail } = require("../users/users.service");

module.exports.loginController = async (req, res, next) => {
    try {
        const userData = req.body;
        const { email } = userData;
        const existingUser = await getUserByEmail(email);
        if (!existingUser) {
            return res.status(404).json({
                message: "wrong email or password!!",
            });
        }
        const isPasswordValid = await bcrypt.compare(userData.password, existingUser.password);
        if (!isPasswordValid) {
            return res.status(404).json({
                message: "wrong email or password!!",
            });
        }
        console.log({ _id: existingUser._id, email: existingUser.email });
        const token = jwt.sign({ _id: existingUser._id, email: existingUser.email }, process.env.JWT_SECRET);

        const userResponse = existingUser.toObject();
        delete userResponse.password;

        res.status(200).json({
            message: "login successful!!",
            token,
            user: userResponse,
        });
    } catch (error) {
        next(error);
    }
};



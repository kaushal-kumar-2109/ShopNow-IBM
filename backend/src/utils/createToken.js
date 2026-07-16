const jwt = require("jsonwebtoken");

const CreateUserToken = async (id,name, email, role = "USER") => {
    const userPayload = {
        role,
        name,
        email,
        id
    };
    try {
        // Generate the token
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(userPayload, secretKey, { expiresIn: '7d' });
        return ({ status: true, message: "Token created successfully ", token: token });
    } catch (err) {
        console.log("Error in creating Token => ", err);
        return ({ status: false, message: "Error in creating token ", error: err });
    }
}

const CreateDeviceToken = async (data) => {
    const devicePayload = data;
    try {
        const secretKey = process.env.JWT_SECRET;
        const token = jwt.sign(devicePayload, secretKey);
        return ({ status: true, message: "Token created successfully ", token: token });
    } catch (err) {
        console.log("Error in creating device token => ", err);
        return ({ status: false, message: "Error in creating token ", error: err });
    }
}

module.exports = { CreateUserToken, CreateDeviceToken };
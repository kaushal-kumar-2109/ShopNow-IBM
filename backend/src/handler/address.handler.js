const Address = require("../../db/models/address.model.js");
const User = require("../../db/models/user.model.js");

/* ── helper to get current logged-in user ── */
const getLoggedInUser = async (email) => {
    return await User.findOne({ email });
};

// Fetch all addresses for the logged-in user
const GetAddresses = async (req, res) => {
    try {
        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        const addresses = await Address.find({ user_id: user._id }).sort({ default: -1, createdAt: -1 });
        return res.status(200).json({ message: "Addresses fetched", data: addresses });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

// Add a new address for the logged-in user
const AddAddress = async (req, res) => {
    try {
        const { reciver, addressLine1, addressLine2 = "", city, state, country, pincode, phone, addressType = "HOME", isDefault = false } = req.body;
        
        if (!reciver || !addressLine1 || !city || !state || !country || !pincode || !phone) {
            return res.status(400).json({ message: "All required fields must be provided" });
        }

        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        // Check if matching address already exists for this user
        const existing = await Address.findOne({
            user_id: user._id,
            reciver: reciver.trim(),
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2.trim(),
            city: city.trim(),
            state: state.trim(),
            country: country.trim(),
            pincode: pincode.trim(),
            phone: phone.trim()
        });

        if (existing) {
            return res.status(200).json({ message: "Address already exists", data: existing });
        }

        // If this address is set as default, unset other defaults
        if (isDefault) {
            await Address.updateMany({ user_id: user._id }, { default: false });
        }

        const address = await Address.create({
            user_id: user._id,
            reciver: reciver.trim(),
            addressLine1: addressLine1.trim(),
            addressLine2: addressLine2.trim(),
            city: city.trim(),
            state: state.trim(),
            country: country.trim(),
            pincode: pincode.trim(),
            phone: phone.trim(),
            addressType,
            default: isDefault
        });

        return res.status(201).json({ message: "Address added successfully", data: address });
    } catch (err) {
        console.error(err);
        if (err.code === 11000) {
            return res.status(400).json({ message: "This address already exists" });
        }
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

// Update an address
const UpdateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const { reciver, addressLine1, addressLine2, city, state, country, pincode, phone, addressType, isDefault } = req.body;

        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        const address = await Address.findOne({ _id: id, user_id: user._id });
        if (!address) return res.status(404).json({ message: "Address not found" });

        // If changing default to true, clear other defaults
        if (isDefault && !address.default) {
            await Address.updateMany({ user_id: user._id }, { default: false });
        }

        address.reciver = reciver ?? address.reciver;
        address.addressLine1 = addressLine1 ?? address.addressLine1;
        address.addressLine2 = addressLine2 !== undefined ? addressLine2 : address.addressLine2;
        address.city = city ?? address.city;
        address.state = state ?? address.state;
        address.country = country ?? address.country;
        address.pincode = pincode ?? address.pincode;
        address.phone = phone ?? address.phone;
        address.addressType = addressType ?? address.addressType;
        address.default = isDefault !== undefined ? isDefault : address.default;
        address.updated_at = Date.now();

        await address.save();
        return res.status(200).json({ message: "Address updated successfully", data: address });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

// Delete an address
const DeleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await getLoggedInUser(req.email);
        if (!user) return res.status(401).json({ message: "User not found" });

        const result = await Address.deleteOne({ _id: id, user_id: user._id });
        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Address not found" });
        }

        return res.status(200).json({ message: "Address deleted successfully" });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Internal server error", error: err });
    }
};

module.exports = {
    GetAddresses,
    AddAddress,
    UpdateAddress,
    DeleteAddress,
};

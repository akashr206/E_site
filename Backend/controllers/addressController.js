const Address = require("../models/Adress");

const getAddress = async (req, res) => {
    try {
        if (!req.user || !req.user.uId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User not authenticated" });
        }

        const userId = req.user.uId;

        if (typeof userId !== "string" || userId.trim() === "") {
            return res.status(400).json({ message: "Invalid user ID" });
        }

        const addresses = await Address.find({ userId });
        
        res.json(addresses);
    } catch (error) {
        console.error("Error fetching addresses:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const deleteAddress = async (req, res) => {
    try {
        const addressId = req.body.id;

        if (
            !addressId ||
            typeof addressId !== "string" ||
            addressId.trim() === ""
        ) {
            return res
                .status(400)
                .json({ message: "Missing or invalid address ID" });
        }

        const result = await Address.findByIdAndDelete(addressId);
        if (!result) {
            return res.status(404).json({ message: "Address not found" });
        }

        res.json({ message: "Successfully deleted" });
    } catch (error) {
        console.error("Error deleting address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const addAddress = async (req, res) => {
    try {
        if (!req.user || !req.user.uId) {
            return res
                .status(401)
                .json({ message: "Unauthorized: User not authenticated" });
        }

        const userId = req.user.uId;
        const { address } = req.body;

        if (!address || typeof address !== "object") {
            return res
                .status(400)
                .json({ message: "Missing or invalid address data" });
        }

        const requiredFields = ["street", "city", "state", "postalCode"];
        const missingFields = requiredFields.filter(
            (field) => !address[field]?.trim()
        );
        if (missingFields.length > 0) {
            return res.status(400).json({
                message: `Missing required fields: ${missingFields.join(", ")}`,
            });
        }

        await Address.create({ ...address, userId });
        res.json({ message: "Address added successfully" });
    } catch (error) {
        console.error("Error adding address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

const updateAddress = async (req, res) => {
    try {
        const { _id, __v, ...updatedValues } = req.body.update;
        if (!req.body.update || typeof req.body.update !== "object") {
            return res
                .status(400)
                .json({ message: "Missing or invalid update data" });
        }

        if (!_id || typeof _id !== "string" || _id.trim() === "") {
            return res
                .status(400)
                .json({ message: "Missing or invalid address ID" });
        }

        if (Object.keys(updatedValues).length === 0) {
            return res
                .status(400)
                .json({ message: "No fields provided to update" });
        }

        const result = await Address.findByIdAndUpdate(
            _id,
            { ...updatedValues },
            { new: true }
        );
        if (!result) {
            return res.status(404).json({ message: "Address not found" });
        }
        res.status(200).json({ message: "Address updated successfully" });
    } catch (error) {
        console.error("Error updating address:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { getAddress, addAddress, deleteAddress, updateAddress };
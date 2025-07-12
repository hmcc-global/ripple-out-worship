"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userSchema = new mongoose_1.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    accessType: { type: String },
    groupIds: [{ type: mongoose_1.Types.ObjectId, ref: 'Group' }],
    setlistIds: [{ type: mongoose_1.Types.ObjectId, ref: 'Setlist' }],
});
const User = mongoose_1.models.User || (0, mongoose_1.model)('User', userSchema);
exports.default = User;

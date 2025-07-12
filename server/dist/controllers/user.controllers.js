"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUser = exports.updateUser = exports.getUser = exports.createUser = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const sendResponse = (res, statusCode, payload) => {
    return res.status(statusCode).json(payload);
};
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const toCreate = __rest(req.body, []);
    if (Object.keys(toCreate).length > 0) {
        try {
            const data = yield user_model_1.default.create(toCreate);
            if (data) {
                sendResponse(res, 200, data);
            }
            else {
                sendResponse(res, 404, { error: 'User not created' });
            }
        }
        catch (error) {
            sendResponse(res, 500, { error: error.message });
        }
    }
    else {
        sendResponse(res, 400, { error: 'Missing required fields' });
    }
});
exports.createUser = createUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.params;
    if (userId) {
        try {
            const data = yield user_model_1.default.findOne({ _id: userId }).exec();
            if (data) {
                sendResponse(res, 200, data);
            }
            else {
                sendResponse(res, 404, { error: 'User not found' });
            }
        }
        catch (error) {
            sendResponse(res, 500, { error: error.message });
        }
    }
    else {
        try {
            const data = yield user_model_1.default.find().exec();
            if (data) {
                sendResponse(res, 200, data);
            }
            else {
                sendResponse(res, 404, { error: 'Users not found' });
            }
        }
        catch (error) {
            sendResponse(res, 500, { error: error.message });
        }
    }
});
exports.getUser = getUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _a = req.body, { id: userId } = _a, toUpdate = __rest(_a, ["id"]);
    if (userId && Object.keys(toUpdate).length > 0) {
        try {
            const updatedUser = yield user_model_1.default.findOneAndUpdate({ _id: userId }, toUpdate, {
                upsert: true,
                new: true,
            });
            if (updatedUser) {
                sendResponse(res, 200, updatedUser);
            }
            else {
                sendResponse(res, 404, { error: 'User not found' });
            }
        }
        catch (error) {
            sendResponse(res, 500, { error: error.message });
        }
    }
    else {
        sendResponse(res, 400, { error: 'Missing required fields' });
    }
});
exports.updateUser = updateUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: userId } = req.params;
    if (userId) {
        try {
            const data = yield user_model_1.default.findOneAndDelete({ _id: userId });
            if (data) {
                sendResponse(res, 200, data);
            }
            else {
                sendResponse(res, 404, { error: 'User not found' });
            }
        }
        catch (error) {
            sendResponse(res, 500, { error: error.message });
        }
    }
    else {
        sendResponse(res, 400, { error: 'Missing required fields' });
    }
});
exports.deleteUser = deleteUser;

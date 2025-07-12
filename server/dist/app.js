"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = require("./mongoose");
const routes_1 = require("./routes");
const app = (0, express_1.default)();
const dev_port = 1337;
// TODO-YY: Remove
app.get('/', (req, res) => {
    res.send('Hello World!');
});
app.use(express_1.default.json());
app.use('/api', (0, routes_1.getRoutes)());
// Starts the server after connecting to the database
(0, mongoose_1.connectToDB)()
    .then(() => {
    app.listen(dev_port, () => {
        console.log(`Server is running on port ${dev_port}.`);
    });
})
    .catch(() => {
    console.log('Server failed to start.');
});

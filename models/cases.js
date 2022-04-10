const { Schema, model } = require("mongoose");

module.exports = model("cases", new Schema({
    userID: { type: String, default: "" },
    moderatorID: { type: String, default: "" },
    caseID: { type: String, default: "" },
    type: { type: String, default: "" },
    reason: { type: String, default: "" },
    time: { type: Number, default: Date.now() },
}));
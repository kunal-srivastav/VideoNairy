const mongoose = require("mongoose");

const subscriptionSchema = mongoose.Schema(
    {
        subscriber: {
            type: mongoose.Schema.Types.ObjectId, // one who is subscribing
            ref: "User"
        },
        channel: {
            type: mongoose.Schema.Types.ObjectId, // one whom "subscriber" is subscribing
            ref: "User"
        }
    },
    {timestamps: true}
);

module.exports = mongoose.model("Subscription", subscriptionSchema);
const mongoose = require('mongoose');

// Define a utility for HEX and DEC conversions
class UidUtils {
    static toDec(hex) {
        return hex
            .split(" ")
            .map(h => parseInt(h, 16))
            .join(" ");
    }

    static toHex(dec) {
        return dec
            .split(" ")
            .map(d => parseInt(d).toString(16).padStart(2, "0"))
            .join(" ");
    }
}

// Define the schema for a card
const cardSchema = new mongoose.Schema({
    uid: {
        hex: { type: String, required: true },
        dec: { type: String, required: true },
    },
    cardType: { type: String, required: true },
    owner: {type: String, required: true}, //{type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true}, // Reference to the User model
    authorized: { type: Boolean, required: true },
    accessLevel: { type: String, enum: ["admin", "guest", "restricted"], required: true },
    issued: { type: Date, required: true }, 
    expiresAt: { type: Date },
});

// Add virtuals for dynamic HEX and DEC conversion
cardSchema.virtual('uidHex')
    .get(function () {
        return this.uid.hex;
    })
    .set(function (hexValue) {
        this.uid.hex = hexValue;
        this.uid.dec = UidUtils.toDec(hexValue);
    });

cardSchema.virtual('uidDec')
    .get(function () {
        return this.uid.dec;
    })
    .set(function (decValue) {
        this.uid.dec = decValue;
        this.uid.hex = UidUtils.toHex(decValue);
    });

// Ensure virtual fields are included when converting to JSON or Object
cardSchema.set('toJSON', { virtuals: true });
cardSchema.set('toObject', { virtuals: true });

const Card = mongoose.model('Card', cardSchema);

module.exports = Card;
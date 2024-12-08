const Card = require("../models/card");


//CRUD operations for card

const createCard = async (req, res) => {
    try {
        const newCard = await Card.create(req.body);
        res.status(201).json(newCard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const getCards = async (req, res) => {
    try {
        const cards = await Card.find();
        res.status(200).json(cards);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getCardByHex = async (req, res) => {
    try {
        const { uidHex } = req.params;
        const card = await Card.findOne({ "uid.hex": uidHex });
        res.status(200).json(card);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const getCardByDec = async (req, res) => {
    try {
        const { uidDec } = req.params;
        const card = await Card.findOne({ "uid.dec": uidDec });
        res.status(200).json(card);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const getCard = async (req, res) => {
    try {
        const { id } = req.params;
        const card = await Card.findById(id);
        res.status(200).json(card);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedCard = await Card.findByIdAndUpdate(id, req.body , { new: true });
        res.status(200).json(updatedCard);
    }
    catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const deleteCard = async (req, res) => {
    try {
        const { id } = req.params;
        await Card.findByIdAndDelete(id);
        res.status(200).json({ message: 'Card deleted successfully' });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};


module.exports = { createCard, getCards, getCard, updateCard, deleteCard, getCardByHex, getCardByDec };
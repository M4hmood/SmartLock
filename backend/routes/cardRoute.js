const express = require('express');
const router = express.Router(); // Initialize the router
const cardController = require('../controllers/cardController');


// Card Crud routes

// http://localhost:3000/Cards
router.route('/')
    .get(cardController.getCards)
    .post(cardController.createCard);

// http://localhost:3000/Cards/:uid
router.route('/:id')
    .get(cardController.getCard)
    .put(cardController.updateCard)
    .delete(cardController.deleteCard);

// http://localhost:3000/Cards/Hex/:uidHex
router.route('/Hex/:uidHex')
    .get(cardController.getCardByHex);

// http://localhost:3000/Cards/Dec/:uidDec
router.route('/Dec/:uidDec')
    .get(cardController.getCardByDec);

// OR by req.params.uidHex
// http://localhost:3000/Cards?uidHex=xxxxx
// router.route('/')
//     .get(cardController.getCardByHex);
    
module.exports = router;
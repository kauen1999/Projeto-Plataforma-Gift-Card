const express = require('express');
const router = express.Router();

const requireAuth = require('../middlewares/auth');
const { createGiftCardValidator, 
        activateGiftCardValidator, 
        useGiftCardValidator,
        transferGiftCardValidator,
        refundGiftCardValidator,
        getGiftCardLogsValidator } = require('../validators/giftCardValidator');


const wallet = require('../controllers/giftCards/createFromWallet');
const activate = require('../controllers/giftCards/activate');
const use = require('../controllers/giftCards/use');
const transfer = require('../controllers/giftCards/transfer');
const refund = require('../controllers/giftCards/refund');
const logs = require('../controllers/giftCards/logs');
const getAssignedGiftCards = require('../controllers/giftCards/List');

router.use(requireAuth);

router.get('/', requireAuth, getAssignedGiftCards);
router.post('/wallet', createGiftCardValidator, wallet);
router.patch('/activate', activateGiftCardValidator, activate);
router.patch('/use', useGiftCardValidator, use);
router.patch('/transfer', transferGiftCardValidator, transfer);
router.patch('/refund', refundGiftCardValidator, refund);
router.get('/:giftcard_id/logs', getGiftCardLogsValidator, logs);



module.exports = router;

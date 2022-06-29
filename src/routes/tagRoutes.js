const tagController = require('../controllers/tagController');
const express = require('express');
const router = express.Router();

router.get('/tags', tagController.getAll);
router.get('/tags/find/:id', tagController.findTagById);
router.post('/tags', tagController.addNewTag);
router.put('/tags/:id', tagController.updateTag);
router.delete('/tags/:id', tagController.deleteTag);
router.get('/tags/getcointags/:id', tagController.getCoinTags);

module.exports = router;
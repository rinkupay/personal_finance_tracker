"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const budgetControllers_1 = require("../controllers/budgetControllers");
const router = (0, express_1.Router)();
router.post('/setbudget', budgetControllers_1.setBudget);
router.get('/budget', budgetControllers_1.getBudget);
exports.default = router;

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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBudget = exports.setBudget = void 0;
const Budget_1 = __importDefault(require("../models/Budget"));
const setBudget = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { food, transportation, entertainment, utilities, other } = req.body;
    try {
        if ([food, transportation, entertainment, utilities, other].some(val => val === undefined)) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }
        const existingBudget = yield Budget_1.default.findOne();
        if (existingBudget) {
            Object.assign(existingBudget, { food, transportation, entertainment, utilities, other });
            yield existingBudget.save();
            return res.status(200).json({ success: true, message: 'Budget updated successfully' });
        }
        else {
            yield new Budget_1.default({ food, transportation, entertainment, utilities, other }).save();
            return res.status(201).json({ success: true, message: 'Budget created successfully' });
        }
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Error processing budget', error });
    }
});
exports.setBudget = setBudget;
const getBudget = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const budget = yield Budget_1.default.findOne();
        if (!budget)
            return res.status(404).json({ success: false, message: 'Budget not found' });
        return res.status(200).json({ success: true, budget });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: 'Failed to fetch budget' });
    }
});
exports.getBudget = getBudget;

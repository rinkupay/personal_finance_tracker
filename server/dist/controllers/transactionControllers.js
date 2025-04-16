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
exports.deleteTransaction = exports.updateTransaction = exports.addTransaction = exports.getTransactions = void 0;
const Transaction_1 = __importDefault(require("../models/Transaction"));
const getTransactions = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const transactions = yield Transaction_1.default.find();
        res.status(200).json(transactions);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching transactions', error });
    }
});
exports.getTransactions = getTransactions;
const addTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { description, amount, category, date } = req.body;
    if (!description || !amount || !date) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    try {
        const newTransaction = new Transaction_1.default({ description, amount, category, date });
        const savedTransaction = yield newTransaction.save();
        res.status(201).json(savedTransaction);
    }
    catch (error) {
        res.status(500).json({ message: 'Error saving transaction', error });
    }
});
exports.addTransaction = addTransaction;
const updateTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { description, amount, category, date } = req.body;
    try {
        const updated = yield Transaction_1.default.findByIdAndUpdate(id, { description, amount, category, date }, { new: true });
        if (!updated)
            return res.status(404).json({ message: 'Transaction not found' });
        res.status(200).json(updated);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
exports.updateTransaction = updateTransaction;
const deleteTransaction = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        yield Transaction_1.default.findByIdAndDelete(id);
        res.status(200).json({ message: 'Transaction deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting transaction', error });
    }
});
exports.deleteTransaction = deleteTransaction;

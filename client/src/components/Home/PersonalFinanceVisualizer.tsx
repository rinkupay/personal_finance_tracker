import React,{ useState, useEffect, ChangeEvent } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from "recharts";
import axios from "axios";
import {
  List,
  PieChart as PieIcon,
  BarChart3,
  LineChart as LineIcon,
} from "lucide-react";
import EditDialog from "../dialog/EditDialog";
import toast from "react-hot-toast";

// Define TypeScript interfaces for Transaction and Budget
interface Transaction {
  _id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
}

interface Budget {
  [category: string]: number;
}

// Define some default categories and colors for charts
const predefinedCategories = [
  "Food",
  "Transportation",
  "Entertainment",
  "Utilities",
  "Other",
];
const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#d0ed57"];

const PersonalFinanceVisualizer: React.FC = () => {
  // States for transactions, form, budget, insights and dialogs
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [form, setForm] = useState<Omit<Transaction, "_id">>({
    description: "",
    amount: 0,
    date: "",
    category: "",
  });
  const [budgets, setBudgets] = useState<Budget>({});
  const [insights, setInsights] = useState<string>("");
  const [editOpen, setEditOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showBudgetForm, setShowBudgetForm] = useState(false);

  const base_URL = import.meta.env.VITE_API_URL;

  // Fetch budget from backend
  const fetchBudget = async () => {
    try {
      const { data } = await axios.get(`${base_URL}/budget`);
      setBudgets(data.budget);
      console.log(data)
    } catch (error) {
      toast.error("Failed to fetch budget");
    }
  };

  // Fetch budget on component mount
  useEffect(() => {
    fetchBudget();
  }, []);

  // Fetch all transactions on component mount
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Fetch transaction records
  const fetchTransactions = async () => {
    try {
      const { data } = await axios.get(`${base_URL}/api/transactions`);
      setTransactions(Array.isArray(data) ? data : []);
    } catch (err) {
      toast.error("Failed to fetch transactions:");
    }
  };

  // Handle form input changes for both transaction and budget forms
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "amount" ? parseFloat(value) : value });
  };

  // Handle change in budget input fields
  const changeBudgetValue = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBudgets((prev) => ({
      ...prev,
      [name.toLowerCase()]: parseFloat(value),
    }));
  };

  // Add a new transaction to the list
  const addTransaction = async () => {
    if (!form.description || !form.amount || !form.date || !form.category) {
      toast.error("All fields are required");
      return;
    }
    try {
      const { data } = await axios.post(`${base_URL}/api/transactions`, form);
      setTransactions([...transactions, data]);
      setForm({ description: "", amount: 0, date: "", category: "" });
    } catch (err) {
      toast.error("Failed to add transaction");
    }
  };

  // Delete transaction by ID
  const deleteTransaction = async (id: string) => {
    try {
      await axios.delete(`${base_URL}/api/transactions/${id}`);
      setTransactions(transactions.filter((t) => t._id !== id));
      toast.success("Deleted successfully");
    } catch (err) {
      toast.error("Failed to delete transaction");
    }
  };

  // Open the edit dialog with selected transaction
  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setEditOpen(true);
  };

  // Submit updated budget to backend
  const handleSetBudget = async () => {
    try {
      await axios.post(`${base_URL}/api/setbudget`, budgets);
      toast.success("Budget is set");
    } catch (error: any) {
      toast.error(error);
    }
  };

  // Update a transaction (after editing)
  const handleUpdateTransaction = async (updated: Transaction) => {
    try {
      const { data } = await axios.patch(
        `${base_URL}/api/transactions/${updated._id}`,
        updated
      )
      
   
      setTransactions((prev) =>
        prev.map((t) => (t._id === data._id ? data : t))
      );
      toast.success("Updated successfully")
    } catch (err: any) {
      toast.error("Failed to update transaction:", err);
    }
  };

  // Update budget value for a category
  const updateBudget = (category: string, amount: string) => {
    setBudgets({ ...budgets, [category]: parseFloat(amount) });
  };

  // Get current month's transactions
  const getCurrentMonthTransactions = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    return transactions.filter((t) => {
      const tDate = new Date(t.date);
      return (
        tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear
      );
    });
  };

  // Calculate budget insights for overspending
  const calculateInsights = () => {
    const currentMonthTxns = getCurrentMonthTransactions();
  
    const overspent = Object.entries(budgets)
      .filter(([cat, budget]) => {
        const spent = currentMonthTxns
          .filter((t) => t.category.toLowerCase() === cat.toLowerCase())
          .reduce((acc, t) => acc + Number(t.amount), 0);
  
        // console.log(`Category: ${cat} | Spent: ${spent} | Budget: ${budget}`);
        return spent > Number(budget);
      })
      .map(([cat]) => cat);
  
    setInsights(
       overspent.length > 0
        ? `⚠️ Over budget this month: ${overspent.join(", ")}`
        : "✅ You are within your monthly budget!"
    );
  }

  // Filter transactions for current month
  const currentMonthTxns = getCurrentMonthTransactions();

  // Aggregate expenses per month for chart
  const monthlyExpenses = transactions.reduce<Record<string, number>>(
    (acc, t) => {
      const month = new Date(t.date).toLocaleString("default", {
        month: "short",
      });
      acc[month] = (acc[month] || 0) + t.amount;
      return acc;
    },
    {}
  );

  // Aggregate expenses by category for chart
  const categoryExpenses = transactions.reduce<Record<string, number>>(
    (acc, t) => {
      const cat = t.category || "Uncategorized";
      acc[cat] = (acc[cat] || 0) + t.amount;
      return acc;
    },
    {}
  );


  return (
    <div className="p-4 sm:p-6 space-y-10 max-w-7xl mx-auto w-full">
      <div className="flex flex-col lg:flex-row gap-6 w-full">
        {/* Form Card */}
        <Card className="w-full lg:w-1/2 shadow-md">
          <CardContent className="py-6">
            <div className="flex gap-2 mb-4">
              <button
                className={`${
                  !showBudgetForm ? "bg-blue-600 text-white" : "bg-blue-100"
                } px-4 py-2 rounded`}
                onClick={() => setShowBudgetForm(false)}
              >
                Add Transaction
              </button>
              <button
                className={`${
                  showBudgetForm ? "bg-blue-600 text-white" : "bg-blue-100"
                } px-4 py-2 rounded`}
                onClick={() => setShowBudgetForm(true)}
              >
                Set Budget
              </button>
            </div>

            {!showBudgetForm ? (
              <div className="grid sm:grid-cols-2 gap-4">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleInputChange}
                  className="border rounded px-3 py-2"
                >
                  <option value="">Select Category</option>
                  {predefinedCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <Input
                  name="amount"
                  type="number"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={handleInputChange}
                />
                <Input
                  name="date"
                  type="date"
                  value={form.date}
                  onChange={handleInputChange}
                />
                <Input
                  name="description"
                  placeholder="Description"
                  value={form.description}
                  onChange={handleInputChange}
                />
                <Button onClick={addTransaction} className="sm:col-span-2">
                  Add
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {predefinedCategories.map((category) => (
                  <div key={category} className="flex items-center gap-3">
                    <span className="w-32">{category}</span>
                    <Input
                      type="number"
                      name={category}
                      placeholder="Budget"
                      value={budgets[category.toLowerCase()] || ""}
                      onChange={changeBudgetValue}
                    />
                  </div>
                ))}
                <Button onClick={handleSetBudget}>Save</Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Transaction List */}
        <Card className="w-full lg:w-1/2 shadow-md max-h-[500px] overflow-auto">
          <CardContent className="py-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <List /> Transactions
            </h2>
            <div className="space-y-3">
              {transactions.map((t) => (
                <div
                  key={t._id}
                  className="flex flex-row justify-between sm:flex-row sm:justify-between sm:items-center border-b pb-2"
                >
                  <div>
                    <p className="font-medium">{t.description}</p>
                    <p className="text-sm text-gray-500">
                      ₹{t.amount} • {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2 mt-2 sm:mt-0">
                    <Button size="sm" onClick={() => handleEditClick(t)}>
                      Edit
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteTransaction(t._id)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md overflow-x-auto">
          <CardContent className="py-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="text-purple-600" /> Monthly Expenses
            </h2>
            <BarChart
              width={480}
              height={300}
              data={Object.entries(monthlyExpenses).map(([month, amount]) => ({
                month,
                amount,
              }))}
            >
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="amount" fill="#8884d8" />
            </BarChart>
          </CardContent>
        </Card>

        <Card className="shadow-md overflow-x-auto">
          <CardContent className="py-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <PieIcon className="text-yellow-600" /> Category Breakdown
            </h2>
            <PieChart width={400} height={300}>
              <Pie
                data={Object.entries(categoryExpenses).map(([name, value]) => ({
                  name,
                  value,
                }))}
                dataKey="value"
                outerRadius={120}
                label
              >
                {Object.keys(categoryExpenses).map((_, idx) => (
                  <Cell key={idx} fill={colors[idx % colors.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </CardContent>
        </Card>
      </div>

      {/* Insights and Budget vs Actual */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="shadow-md">
          <CardContent className="py-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LineIcon className="text-pink-600" /> Budgeting Overview
            </h2>
            <div className="space-y-4">
              {predefinedCategories.map((category) => {
                const actual = currentMonthTxns
                  .filter((t) => t.category === category)
                  .reduce((acc, t) => acc + t.amount, 0);
                return (
                  <div
                    key={category}
                    className="flex flex-col sm:flex-row sm:items-center gap-3"
                  >
                    <span className="w-32">{category}</span>
                    <Input
  className="w-[50%]"
  type="number"
  value={budgets[category?.toLowerCase()] || 0} // Default to 0 if undefined
  onChange={(e) => updateBudget(category, e.target.value)}
/>
                    <span className="text-sm text-gray-500">
                      Spent: ₹{actual.toFixed(2)}
                    </span>
                  </div>
                );
              })}
              <Button onClick={calculateInsights}>Get Insights</Button>
              {insights && <p className="text-red-600 mt-2">{insights}</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-md overflow-x-auto">
          <CardContent className="py-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <LineIcon className="text-indigo-600" /> Budget vs Actual (This
              Month)
            </h2>
            <LineChart
              width={550}
              height={300}
              data={predefinedCategories.map((category) => ({
                category,
                budget: budgets[category.toLowerCase()] || 0,
                actual: currentMonthTxns
                  .filter((t) => t.category === category)
                  .reduce((acc, t) => acc + t.amount, 0),
              }))}
            >
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="budget"
                stroke="#8884d8"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="actual"
                stroke="#82ca9d"
                strokeWidth={2}
              />
            </LineChart>
          </CardContent>
        </Card>
      </div>

      <EditDialog
        open={editOpen}
        onOpenChange={setEditOpen}
        selectedTransaction={selectedTransaction}
        onSave={handleUpdateTransaction}
      />
    </div>
  );
};

export default PersonalFinanceVisualizer;

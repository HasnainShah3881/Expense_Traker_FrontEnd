import React, { useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { ArrowDownRight, Download, Plus, X } from "lucide-react";
import { useAppContext } from "../context/context";
import axios from "axios";
import base_url from "../URLS/base_url";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Expenses = () => {
  const { internalActiveSection, transactions, settransactions, Profile } =
    useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newExpense, setNewExpense] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "💸",
  });
  const [errors, setErrors] = useState({
    source: false,
    amount: false,
    date: false,
  });
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter only expense data
  const expenseData = transactions
    .filter((t) => t.amount < 0)
    .map((t) => ({
      date: t.date,
      amount: Math.abs(t.amount),
    }));

  const CustomDot = (props) => {
    const { cx, cy } = props;
    return (
      <circle
        cx={cx}
        cy={cy}
        r={4}
        fill="#f43f5e"
        stroke="#f43f5e"
        strokeWidth={2}
      />
    );
  };

  // Add Expense Function with Validation
  const handleAddExpense = async () => {
    const { source, amount, date } = newExpense;
    const newErrors = {
      source: !source.trim(),
      amount: !amount,
      date: !date,
    };

    setErrors(newErrors);

    if (newErrors.source || newErrors.amount || newErrors.date) {
      toast.error("Please fill all required fields!");
      return;
    }

    setLoading(true);
    const newTransaction = {
      id: Date.now(),
      name: newExpense.source,
      date: newExpense.date,
      amount: -Math.abs(parseFloat(newExpense.amount)),
      icon: newExpense.icon,
    };

    try {
      const res = await axios.post(
        `${base_url}/Data/addData`,
        {
          name: "expense",
          source: newTransaction.name,
          email: Profile?.email,
          date: newTransaction.date,
          amount: newTransaction.amount,
          icon: newTransaction.icon,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Expense added successfully!");
        settransactions((prev) => [...prev, newTransaction]);
        setIsModalOpen(false);
        setNewExpense({ source: "", amount: "", date: "", icon: "💸" });
        setErrors({ source: false, amount: false, date: false });
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }
    } catch (err) {
      toast.error("Failed to add expense");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Download Excel Function
  const handleDownloadExcel = () => {
    const expenseList = transactions
      .filter((t) => t.amount < 0)
      .map((t) => ({
        Source: t.source || t.name,
        Amount: Math.abs(t.amount),
        Date: t.date,
        Icon: t.icon || "💸",
      }));

    const worksheet = XLSX.utils.json_to_sheet(expenseList);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "Expenses.xlsx");
  };

  return (
    <section
      className={`mb-20 flex-col ${
        internalActiveSection === "Expenses" ? "flex" : "hidden"
      }`}
    >
      {/* Chart Section */}
      <div className="w-full bg-gray-50 p-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <div className="flex items-start justify-between mb-8">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-1">
                Expense Overview
              </h1>
              <p className="text-sm text-gray-500">
                Track your spending trends and gain insights into where your
                money goes.
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center cursor-pointer gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
            >
              <Plus size={16} />
              Add Expense
            </button>
          </div>

          {/* Chart */}
          <div className="w-full min-h-[300px]">
            <ResponsiveContainer width="100%" aspect={2}>
              <AreaChart
                data={expenseData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#9ca3af", fontSize: 12 }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm text-sm">
                          <p className="font-semibold text-gray-800">
                            {data.date}
                          </p>
                          <p className="text-gray-600">
                            Expense: ${data.amount.toLocaleString()}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="amount"
                  stroke="#f43f5e"
                  strokeWidth={2.5}
                  fill="url(#colorExpense)"
                  dot={<CustomDot />}
                  activeDot={{ r: 5, fill: "#f43f5e" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Expense List */}
      <div className="flex-1 bg-white rounded-2xl m-8 p-5 shadow hover:shadow-md transition">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">All Expenses</h3>
          <button
            onClick={handleDownloadExcel}
            className="text-sm text-gray-600 border border-gray-400 cursor-pointer px-2 rounded-md hover:border-purple-600 hover:text-purple-600 flex items-center transition-colors gap-1"
          >
            Download <Download size={16} />
          </button>
        </div>

        <ul className="space-y-4 flex flex-wrap px-5 justify-between gap-5">
          {transactions
            .filter((t) => t.amount < 0)
            .map((t, index) => (
              <li
                key={t._id || index}
                className="flex justify-between items-center hover:bg-gray-50 rounded-lg p-2 transition w-full sm:w-[48%]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.icon || "💸"}</span>
                  <div>
                    <p className="font-medium text-gray-800">
                      {t.source || t.name}
                    </p>
                    <p className="text-sm text-gray-500">{t.date}</p>
                  </div>
                </div>
                <p className="text-red-500 bg-red-100 rounded-lg px-2 font-medium flex items-center gap-1">
                  -${Math.abs(t.amount).toLocaleString()}{" "}
                  <ArrowDownRight size={14} />
                </p>
              </li>
            ))}
        </ul>
      </div>

      {/* Modal for Adding Expense */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-[#00000029] bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-96 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={18} />
            </button>
            <h2 className="text-lg font-semibold mb-4">Add New Expense</h2>

            <div className="space-y-3">
              {/* Source */}
              <div>
                <label className="text-sm text-gray-700">Source</label>
                <input
                  type="text"
                  value={newExpense.source}
                  onChange={(e) => {
                    setNewExpense({ ...newExpense, source: e.target.value });
                    setErrors((prev) => ({ ...prev, source: false }));
                  }}
                  className={`w-full border rounded-md px-3 py-2 text-sm ${
                    errors.source ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter expense source"
                />
                {errors.source && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter a source.
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm text-gray-700">Amount</label>
                <input
                  type="number"
                  value={newExpense.amount}
                  onChange={(e) => {
                    setNewExpense({ ...newExpense, amount: e.target.value });
                    setErrors((prev) => ({ ...prev, amount: false }));
                  }}
                  className={`w-full border rounded-md px-3 py-2 text-sm ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1">
                    Please enter an amount.
                  </p>
                )}
              </div>

              {/* Date */}
              <div>
                <label className="text-sm text-gray-700">Date</label>
                <input
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => {
                    setNewExpense({ ...newExpense, date: e.target.value });
                    setErrors((prev) => ({ ...prev, date: false }));
                  }}
                  className={`w-full border rounded-md px-3 py-2 text-sm ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="text-xs text-red-500 mt-1">
                    Please select a date.
                  </p>
                )}
              </div>

              {/* Emoji Picker */}
              <div className="relative">
                <label className="text-sm text-gray-700">Icon</label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="border rounded-md px-3 py-2 text-2xl"
                  >
                    {newExpense.icon}
                  </button>
                </div>

                {showEmojiPicker && (
                  <div className="absolute z-50 top-14">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setNewExpense({ ...newExpense, icon: e.emoji });
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Submit */}
              <button
                onClick={handleAddExpense}
                disabled={loading}
                className={`w-full mt-4 ${
                  loading
                    ? "bg-purple-400"
                    : "bg-purple-600 hover:bg-purple-700"
                } text-white rounded-md py-2 transition`}
              >
                {loading ? "Adding..." : "Add Expense"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default React.memo(Expenses);

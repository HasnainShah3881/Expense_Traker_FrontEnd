import React, { useEffect, useState } from "react";
import { Bar, BarChart, Tooltip, XAxis, YAxis, Bar as BarComponent } from "recharts";
import { useAppContext } from "../context/context";
import { ArrowUpRight, Download, Plus, X } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import axios from "axios";
import base_url from "../URLS/base_url";
import toast from "react-hot-toast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Income = ({ showPage }) => {
  const { internalActiveSection, transactions, settransactions, Profile } =
    useAppContext();

  const [data, setData] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    source: false,
    amount: false,
    date: false,
  });

  const [newIncome, setNewIncome] = useState({
    source: "",
    amount: "",
    date: "",
    icon: "💰",
  });

  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const incomeTransactions = transactions.filter((t) => t.amount > 0);

      const grouped = incomeTransactions.reduce((acc, curr) => {
        const existing = acc.find(
          (item) => item.name === (curr.source || curr.name)
        );
        if (existing) existing.Amount += curr.amount;
        else acc.push({ name: curr.source || curr.name, Amount: curr.amount });
        return acc;
      }, []);

      setData(grouped);
    } else {
      setData([]);
    }
  }, [transactions]);

  const handleAddIncome = async () => {
    const { source, amount, date } = newIncome;
    // if(amount <= 0){
    //   return toast.error("please only add income")
    // }
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
    try {
      const res = await axios.post(
        `${base_url}/Data/addData`,
        {
          name: "income",
          source: newIncome.source,
          email: Profile?.email,
          date: newIncome.date,
          amount: parseFloat(newIncome.amount),
          icon: newIncome.icon,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(res.data.message || "Income added successfully!");
        settransactions((prev) => [
          ...prev,
          {
            _id: Date.now(),
            name: "income",
            source: newIncome.source,
            date: newIncome.date,
            amount: parseFloat(newIncome.amount),
            icon: newIncome.icon,
          },
        ]);
      } else {
        toast.error(res.data.message || "Something went wrong!");
      }

      setIsModalOpen(false);
      setNewIncome({ source: "", amount: "", date: "", icon: "💰" });
      setErrors({ source: false, amount: false, date: false });
    } catch (err) {
      toast.error("Failed to add income");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target.id === "modalBackdrop") setIsModalOpen(false);
  };

  const handleDownload = () => {
    const incomeData = transactions
      .filter((t) => t.amount > 0)
      .map((t) => ({
        Source: t.source || t.name,
        Amount: t.amount,
        Date: t.date,
        Icon: t.icon,
      }));

    const worksheet = XLSX.utils.json_to_sheet(incomeData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Income");

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, "Income.xlsx");
  };

  return (
    <section
      className={`mb-20 flex-col ${internalActiveSection === "Income" ? "flex" : "hidden"}`}
    >
      <div className="bg-white shadow-md overflow-hidden rounded-2xl m-8 p-8 transition flex-col justify-center">
        <div className="flex justify-between">
          <div>
            <h1 className="text-start font-semibold text-lg">Income Overview</h1>
            <p className="text-gray-500 mb-4 text-sm">
              Track your earnings over time and analyze your income trends.
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex h-max items-center cursor-pointer gap-2 px-4 py-2 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-100 transition-colors font-medium text-sm"
          >
            <Plus size={16} />
            Add Income
          </button>
        </div>

        <BarChart
          width={600}
          height={300}
          data={data}
          margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
        >
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const d = payload[0].payload;
                return (
                  <div className="bg-white p-2 border border-gray-200 rounded-md shadow-sm text-sm">
                    <p className="font-semibold text-gray-800">{d.name}</p>
                    <p className="text-gray-600">Amount: ${d.Amount}</p>
                  </div>
                );
              }
              return null;
            }}
          />
          <BarComponent dataKey="Amount" fill="#8b5cf6" radius={[8, 8, 0, 0]} />
        </BarChart>
      </div>

      <div className="flex-1 bg-white rounded-2xl m-8 p-5 shadow hover:shadow-md transition">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-lg">Income Sources</h3>
          <button
            onClick={handleDownload}
            className="text-sm text-gray-600 border border-gray-400 cursor-pointer px-2 rounded-md hover:border-purple-600 hover:text-purple-600 flex items-center transition-colors gap-1"
          >
            Download <Download size={16} />
          </button>
        </div>

        <ul className="space-y-4 flex flex-wrap px-5 justify-between gap-5">
          {transactions
            .filter((t) => t.amount > 0)
            .map((t) => (
              <li
                key={t._id || t.id}
                className="flex justify-between items-center hover:bg-gray-50 rounded-lg p-2 transition w-full sm:w-[48%]"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{t.icon}</span>
                  <div>
                    <p className="font-medium text-gray-800">{t.source || t.name}</p>
                    <p className="text-sm text-gray-500">{t.date}</p>
                  </div>
                </div>
                <p className="text-green-600 bg-green-100 rounded-lg px-2 font-medium flex items-center gap-1">
                  +${t.amount.toLocaleString()} <ArrowUpRight size={14} />
                </p>
              </li>
            ))}
        </ul>
      </div>

      {isModalOpen && (
        <div
          id="modalBackdrop"
          onClick={handleBackdropClick}
          className="fixed inset-0 bg-[#00000066] flex justify-center items-center z-50"
        >
          <div
            className="bg-white rounded-xl shadow-lg p-6 w-96 relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
            >
              <X size={18} />
            </button>

            <h2 className="text-lg font-semibold mb-4">Add New Income</h2>

            <div className="space-y-3">
              <div>
                <label className="text-sm text-gray-700">Source</label>
                <input
                  type="text"
                  value={newIncome.source}
                  onChange={(e) => {
                    setNewIncome({ ...newIncome, source: e.target.value });
                    setErrors((prev) => ({ ...prev, source: false }));
                  }}
                  className={`w-full border rounded-md px-3 py-2 text-sm ${
                    errors.source ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter income source"
                />
                {errors.source && (
                  <p className="text-xs text-red-500 mt-1">Please enter a source.</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-700">Amount</label>
                <input
                  type="number"
                  value={newIncome.amount}
                  onChange={(e) => {
                    setNewIncome({ ...newIncome, amount: e.target.value });
                    setErrors((prev) => ({ ...prev, amount: false }));
                  }}
                  className={`w-full border rounded-md px-3 py-2 text-sm ${
                    errors.amount ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter amount"
                />
                {errors.amount && (
                  <p className="text-xs text-red-500 mt-1">Please enter an amount.</p>
                )}
              </div>

              <div>
                <label className="text-sm text-gray-700">Date</label>
                <input
                  type="date"
                  value={newIncome.date}
                  onChange={(e) => {
                    setNewIncome({ ...newIncome, date: e.target.value });
                    setErrors((prev) => ({ ...prev, date: false }));
                  }}
                  className={`w-full border rounded-md px-3 py-2 text-sm ${
                    errors.date ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.date && (
                  <p className="text-xs text-red-500 mt-1">Please select a date.</p>
                )}
              </div>

              <div className="relative">
                <label className="text-sm text-gray-700">Icon</label>
                <div className="flex items-center gap-2 mt-1">
                  <button
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="border rounded-md px-3 py-2 text-2xl"
                  >
                    {newIncome.icon}
                  </button>
                </div>

                {showEmojiPicker && (
                  <div className="absolute z-50 top-14">
                    <EmojiPicker
                      onEmojiClick={(e) => {
                        setNewIncome({ ...newIncome, icon: e.emoji });
                        setShowEmojiPicker(false);
                      }}
                    />
                  </div>
                )}
              </div>

              <button
                onClick={handleAddIncome}
                disabled={loading}
                className={`w-full mt-4 ${
                  loading ? "bg-purple-400" : "bg-purple-600 hover:bg-purple-700"
                } text-white rounded-md py-2 transition`}
              >
                {loading ? "Adding..." : "Add Income"}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Income;

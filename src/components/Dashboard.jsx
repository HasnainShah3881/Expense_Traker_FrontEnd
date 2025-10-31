import React, { useEffect, useCallback, useMemo, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Bar,
} from "recharts";
import {
  ArrowUpRight,
  ArrowDownRight,
  HandCoins,
  WalletMinimal,
  CreditCard,
} from "lucide-react";
import { useAppContext } from "../context/context";
import axios from "axios";
import base_url from "../URLS/base_url";
import toast from "react-hot-toast";

const Dashboard = ({ showPage }) => {
  const {
    internalActiveSection,
    setInternalActiveSection,
    transactions,
    settransactions,
  } = useAppContext();

  const [showAllTransactions, setShowAllTransactions] = useState(false);

  const getData = useCallback(async () => {
    try {
      const res = await axios.get(`${base_url}/Data/getAlldata`, {
        withCredentials: true,
      });
      if (res.data.success === true) {
        toast.success(res.data.message);
        settransactions(res.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, [settransactions]);

  useEffect(() => {
    getData();
  }, [getData]);

  const { totalIncome, totalExpenses, totalBalance } = useMemo(() => {
    const income =
      transactions
        ?.filter((t) => t.amount > 0)
        .reduce((acc, t) => acc + t.amount, 0) || 0;
    const expenses =
      transactions
        ?.filter((t) => t.amount < 0)
        .reduce((acc, t) => acc + Math.abs(t.amount), 0) || 0;
    const balance = income - expenses;
    return {
      totalIncome: income,
      totalExpenses: expenses,
      totalBalance: balance,
    };
  }, [transactions]);

  const data = useMemo(
    () => [
      { name: "Total Balance", value: totalBalance, color: "#6B46C1" },
      { name: "Total Expenses", value: totalExpenses, color: "#EF4444" },
      { name: "Total Income", value: totalIncome, color: "#F97316" },
    ],
    [totalBalance, totalExpenses, totalIncome]
  );

  const data2 = useMemo(
    () => [
      { name: "Shopping", Amount: 430 },
      { name: "Travel", Amount: 670 },
      { name: "Electricity Bill", Amount: 200 },
      { name: "Loan Repayment", Amount: 600 },
    ],
    []
  );

  const data3 = useMemo(
    () => [
      { name: "Salary", value: 1200, color: "#6B46C1" },
      { name: "Interest from Savings", value: 70, color: "#EF4444" },
      { name: "E-commerce Sales", value: 180, color: "#F97316" },
      { name: "Graphing Design", value: 200, color: "#e1e433" },
      { name: "Affiliate Marketing", value: 600, color: "#6dbe5e" },
    ],
    []
  );

  return (
    <div
      className={`w-full mb-210 h-180 flex-col lg:flex-row bg-gray-50 ${
        internalActiveSection === "Dashboard" ? "flex" : "hidden"
      }`}
    >
      <div className="flex-1 flex flex-col">
        <main className="p-6 max-sm:px-2 flex flex-col gap-6">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[250px] bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-600 text-white rounded-xl">
                  <CreditCard />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Balance</p>
                  <h2 className="text-xl font-semibold">
                    ${totalBalance.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[250px] bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-orange-500 text-white rounded-xl">
                  <WalletMinimal />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Income</p>
                  <h2 className="text-xl font-semibold">
                    ${totalIncome.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
            <div className="flex-1 min-w-[250px] bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-red-500 text-white rounded-xl">
                  <HandCoins />
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Total Expenses</p>
                  <h2 className="text-xl font-semibold">
                    ${totalExpenses.toLocaleString()}
                  </h2>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Recent Transactions</h3>
                <button
                  onClick={() => setShowAllTransactions((prev) => !prev)}
                  className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1"
                >
                  {showAllTransactions ? (
                    <>
                      See Less <ArrowDownRight size={16} />
                    </>
                  ) : (
                    <>
                      See All <ArrowUpRight size={16} />
                    </>
                  )}
                </button>
              </div>
              <ul className="space-y-4">
                {(showAllTransactions
                  ? transactions
                  : transactions?.slice(0, 5)
                ).map((t, index) => (
                  <li
                    key={t._id || index}
                    className="flex justify-between items-center hover:bg-gray-50 rounded-lg p-2 transition"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <p className="font-medium text-gray-800">{t.source}</p>
                        <p className="text-sm text-gray-500">{t.date}</p>
                      </div>
                    </div>
                    <div>
                      {t.amount > 0 ? (
                        <p className="text-green-600 bg-green-100 rounded-lg px-2 font-medium flex items-center gap-1">
                          +${t.amount.toLocaleString()}{" "}
                          <ArrowUpRight size={14} />
                        </p>
                      ) : (
                        <p className="text-red-500 bg-red-100 rounded-lg px-2 font-medium flex items-center gap-1">
                          -${Math.abs(t.amount).toLocaleString()}{" "}
                          <ArrowDownRight size={14} />
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition flex flex-col items-center justify-center">
              <h1 className="font-semibold text-lg mb-4">Financial Overview</h1>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.map((v, i) => (
                      <Cell key={`cell-${i}`} fill={v.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
              <p className="text-center mt-2 text-gray-600 font-medium">
                Total Balance:{" "}
                <span className="text-black">
                  ${totalBalance.toLocaleString()}
                </span>
              </p>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Expenses</h3>
                <button
                  onClick={() => setInternalActiveSection("Expenses")}
                  className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1"
                >
                  See All <ArrowUpRight size={16} />
                </button>
              </div>
              <ul className="space-y-4">
                {transactions
                  ?.filter((t) => t.name?.toLowerCase().includes("expense"))
                  .slice(0, 10)
                  .map((t, index) => (
                    <li
                      key={t._id || index}
                      className="flex justify-between items-center hover:bg-gray-50 rounded-lg p-2 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {t.source}
                          </p>
                          <p className="text-sm text-gray-500">{t.date}</p>
                        </div>
                      </div>
                      <div>
                        {t.amount > 0 ? (
                          <p className="text-green-600 bg-green-100 rounded-lg px-2 font-medium flex items-center gap-1">
                            +${t.amount.toLocaleString()}{" "}
                            <ArrowUpRight size={14} />
                          </p>
                        ) : (
                          <p className="text-red-500 bg-red-100 rounded-lg px-2 font-medium flex items-center gap-1">
                            -${Math.abs(t.amount).toLocaleString()}{" "}
                            <ArrowDownRight size={14} />
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>

            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition flex flex-col items-center justify-center">
              <h1 className="text-start font-semibold text-lg mb-4">
                Last 30 Days Expenses
              </h1>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart
                  data={data2}
                  margin={{ top: 20, right: 0, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="Amount" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition flex flex-col items-center justify-center">
              <h1 className="font-semibold text-lg mb-4">
                Last 60 Days Income
              </h1>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={data3}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data3.map((v, i) => (
                      <Cell key={`cell3-${i}`} fill={v.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 bg-white rounded-2xl p-5 shadow hover:shadow-md transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Income</h3>
                <button
                  onClick={() => setInternalActiveSection("Income")}
                  className="text-sm text-gray-600 hover:text-purple-600 flex items-center gap-1"
                >
                  See All <ArrowUpRight size={16} />
                </button>
              </div>
              <ul className="space-y-4">
                {transactions
                  ?.filter((t) => t.name?.toLowerCase().includes("income"))
                  .slice(0, 10)
                  .map((t, index) => (
                    <li
                      key={t._id || index}
                      className="flex justify-between items-center hover:bg-gray-50 rounded-lg p-2 transition"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{t.icon}</span>
                        <div>
                          <p className="font-medium text-gray-800">
                            {t.source}
                          </p>
                          <p className="text-sm text-gray-500">{t.date}</p>
                        </div>
                      </div>
                      <div>
                        {t.amount > 0 ? (
                          <p className="text-green-600 bg-green-100 rounded-lg px-2 font-medium flex items-center gap-1">
                            +${t.amount.toLocaleString()}{" "}
                            <ArrowUpRight size={14} />
                          </p>
                        ) : (
                          <p className="text-red-500 bg-red-100 rounded-lg px-2 font-medium flex items-center gap-1">
                            -${Math.abs(t.amount).toLocaleString()}{" "}
                            <ArrowDownRight size={14} />
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);

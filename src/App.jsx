import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  PieChart as PieChartIcon, Settings, Wallet, Calendar, Plus, Trash2, Edit2, Check, X,
  ListPlus, Coffee, Utensils, ArrowUp, ArrowDown, Menu, ChevronRight, TrendingUp, CreditCard,
  Banknote, Flame, ShieldCheck, Receipt, User, History, PiggyBank, Palette, Sparkles, ShoppingBag,
  Home, Tv, ShoppingCart, Gamepad2, Gift, Plane, Book, Cat, Sofa, MonitorPlay, Zap, Car, Bus, 
  Train, Smartphone, Wifi, Headphones, Scissors, Shirt, Music, Heart, HeartPulse, Activity, 
  Briefcase, Landmark, Camera, Film, Mic, Wrench, Hammer, Umbrella, Crosshair, Circle, CircleDashed,
  Dumbbell, Pill, Stethoscope, Droplets, Pizza, Beer, Wine, Martini, CupSoda, UtensilsCrossed, 
  ChefHat, Apple, Carrot, Croissant, IceCream, Soup, Cake, Beef, Salad, Sandwich, Popcorn, Milk, 
  GlassWater, Truck, Package, Store, Map, Compass, Navigation, Bike, Anchor, Ship, Fuel
} from 'lucide-react';

// --- Icons Mapping ---
const AVAILABLE_ICONS = {
  Home, Tv, User, ShoppingCart, PiggyBank, ShoppingBag, Gamepad2, Gift, Plane, Book, Cat, 
  Sofa, Coffee, MonitorPlay, Zap, Car, Bus, Train, Smartphone, Wifi, Headphones, Scissors, 
  Shirt, Music, Heart, HeartPulse, Activity, Briefcase, Landmark, Camera, Film, Mic, Wrench, 
  Hammer, Umbrella, Crosshair, Circle, CircleDashed, Utensils, Dumbbell, Pill, Stethoscope, 
  Droplets, Pizza, Beer, Wine, Martini, CupSoda, UtensilsCrossed, ChefHat, Apple, Carrot, 
  Croissant, IceCream, Soup, Cake, Beef, Salad, Sandwich, Popcorn, Milk, GlassWater, Truck, 
  Package, Store, Map, Compass, Navigation, Bike, Anchor, Ship, Fuel
};

// --- Constants ---
const INITIAL_CATEGORIES = [
  { name: "Rent & Utilities", color: "#3b82f6", icon: "Home" },
  { name: "Entertainment", color: "#8b5cf6", icon: "Tv" },
  { name: "Personal Care", color: "#ec4899", icon: "Heart" },
  { name: "Groceries", color: "#10b981", icon: "ShoppingCart" },
  { name: "Savings", color: "#f59e0b", icon: "PiggyBank" },
  { name: "Shopping", color: "#06b6d4", icon: "ShoppingBag" },
  { name: "Hobbies", color: "#f43f5e", icon: "Gamepad2" },
  { name: "Gifts", color: "#d946ef", icon: "Gift" },
  { name: "Travel", color: "#0ea5e9", icon: "Plane" },
  { name: "Education", color: "#6366f1", icon: "Book" },
  { name: "Pets", color: "#84cc16", icon: "Cat" },
  { name: "Household Goods", color: "#14b8a6", icon: "Sofa" },
  { name: "Daily Expenses", color: "#eab308", icon: "Coffee" },
  { name: "Eating out", color: "#f97316", icon: "UtensilsCrossed" },
  { name: "Ordering food", color: "#fb923c", icon: "Pizza" },
  { name: "Drinking out", color: "#fcd34d", icon: "Beer" },
  { name: "Subscriptions", color: "#64748b", icon: "MonitorPlay" },
  { name: "Other", color: "#94a3b8", icon: "CircleDashed" }
];

const DEFAULT_SCENARIOS = [
  { id: 1, month: "Full-Time", netto25: 1483, brutto25: 2100, netto30: 1750, brutto30: 2500 },
];

const FREQUENCIES = { "Weekly": 4.33, "Every other week": 2.16, "Monthly": 1, "Every other month": 0.5, "Quarterly": 0.333, "Every 6 months": 0.166, "Yearly": 0.083 };
const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// --- UI Components ---

const AppLogo = () => (
  <div className="flex items-center gap-4">
    <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
      <Wallet className="text-white" size={24} />
    </div>
    <span className="text-2xl font-black text-white leading-none tracking-tighter">Wallet</span>
  </div>
);

const CustomPieChart = ({ data, categoryMap }) => {
  const size = 650; 
  const radius = size / 2.3; 
  const center = size / 2;
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeValue = 0;

  if (total === 0) return (
    <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 min-h-[250px]"><PieChartIcon size={48} className="opacity-20" /></div>
  );

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg viewBox={`-220 -220 ${size + 440} ${size + 440}`} className="w-full max-w-[850px] h-auto drop-shadow-2xl overflow-visible">
        {data.map((slice) => {
          const startAngle = (cumulativeValue / total) * Math.PI * 2;
          cumulativeValue += slice.value;
          const endAngle = (cumulativeValue / total) * Math.PI * 2;
          const isLargeArc = endAngle - startAngle > Math.PI ? 1 : 0;
          const startX = center + radius * Math.cos(startAngle - Math.PI / 2);
          const startY = center + radius * Math.sin(startAngle - Math.PI / 2);
          const endX = center + radius * Math.cos(endAngle - Math.PI / 2);
          const endY = center + radius * Math.sin(endAngle - Math.PI / 2);
          const pathData = `M ${center} ${center} L ${startX} ${startY} A ${radius} ${radius} 0 ${isLargeArc} 1 ${endX} ${endY} Z`;
          const midAngle = startAngle + (endAngle - startAngle) / 2;
          const textX = center + (radius + 85) * Math.cos(midAngle - Math.PI / 2);
          const textY = center + (radius + 85) * Math.sin(midAngle - Math.PI / 2);
          const textAnchor = textX > center ? "start" : "end";
          const percent = ((slice.value / total) * 100).toFixed(1);
          return (
            <g key={slice.name} className="transition-all duration-300 cursor-pointer group">
              <path d={pathData} fill={categoryMap[slice.name] || '#cbd5e1'} stroke="#ffffff" strokeWidth="4" className="group-hover:scale-105 origin-center transition-transform duration-300" />
              <g className="pointer-events-none transition-all duration-300 group-hover:scale-110 origin-center">
                <text x={textX} y={textY} textAnchor={textAnchor} alignmentBaseline="middle" className="text-[32px] md:text-[24px] font-black fill-slate-900 drop-shadow-sm">{slice.name}</text>
                <text x={textX} y={textY + 40} textAnchor={textAnchor} alignmentBaseline="middle" className="text-[28px] md:text-[20px] font-bold fill-blue-600">{percent}%</text>
              </g>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

const CustomBarChart = ({ data }) => {
  const padding = 60;
  const width = Math.max(800, data.length * 120); 
  const height = 350;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 1.5;
  const maxVal = Math.max(...data.flatMap(d => [d.netto25 || 0, d.netto30 || 0]), 1000);
  const scale = maxVal > 0 ? chartHeight / maxVal : 1;
  const groupWidth = data.length > 0 ? chartWidth / data.length : chartWidth;
  const barWidth = groupWidth * 0.15;

  return (
    <div className="w-full overflow-x-auto pb-4 custom-scrollbar">
      <div className="min-w-[800px] px-4">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto overflow-visible">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const y = height - padding - (maxVal * ratio * scale);
            return (
              <g key={ratio}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#f1f5f9" strokeWidth="1" />
                <text x={padding - 12} y={y + 4} textAnchor="end" className="text-[11px] font-bold fill-slate-300">€{Math.round(maxVal * ratio)}</text>
              </g>
            );
          })}
          {data.map((d, i) => {
            const xBase = padding + i * groupWidth + (groupWidth * 0.1);
            const hNetto25 = (d.netto25 || 0) * scale;
            const hNetto30 = (d.netto30 || 0) * scale;
            return (
              <g key={d.id}>
                <text x={padding + i * groupWidth + groupWidth / 2} y={height - padding + 30} textAnchor="middle" className="text-xs font-black fill-slate-600">{d.month}</text>
                <rect x={xBase} y={height - padding - hNetto25} width={barWidth} height={hNetto25} fill="#10b981" rx={4} />
                <rect x={xBase + (barWidth * 1.5)} y={height - padding - hNetto30} width={barWidth} height={hNetto30} fill="#3b82f6" rx={4} />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState("May");

  const [categories, setCategories] = useState(() => JSON.parse(localStorage.getItem('wallet_categories')) || INITIAL_CATEGORIES);
  const [incomeScenarios, setIncomeScenarios] = useState(() => JSON.parse(localStorage.getItem('wallet_scenarios')) || DEFAULT_SCENARIOS);
  const [newCategoryIcon, setNewCategoryIcon] = useState("Home");
  const [monthlyData, setMonthlyData] = useState(() => JSON.parse(localStorage.getItem('wallet_monthlyData')) || { "May": { income: 0, expenses: [], trackers: [] } });

  useEffect(() => { localStorage.setItem('wallet_categories', JSON.stringify(categories)); }, [categories]);
  useEffect(() => { localStorage.setItem('wallet_scenarios', JSON.stringify(incomeScenarios)); }, [incomeScenarios]);
  useEffect(() => { localStorage.setItem('wallet_monthlyData', JSON.stringify(monthlyData)); }, [monthlyData]);

  const categoryColorMap = useMemo(() => categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.color }), {}), [categories]);
  const categoryIconMap = useMemo(() => categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.icon }), {}), [categories]);
  const currentMonthData = useMemo(() => monthlyData[selectedMonth] || { income: 0, expenses: [], trackers: [] }, [monthlyData, selectedMonth]);

  const processedExpenses = useMemo(() => (currentMonthData.expenses || []).map(exp => ({ ...exp, monthlyAmount: exp.amount * (FREQUENCIES[exp.frequency] || 1) })), [currentMonthData.expenses]);
  const totalMonthlyBurn = useMemo(() => {
    const fixedTotal = processedExpenses.reduce((sum, exp) => sum + exp.monthlyAmount, 0);
    const trackerOutflow = (currentMonthData.trackers || []).reduce((sum, t) => sum + (t.entries || []).filter(e => !e.fromSavings).reduce((s, e) => s + e.amount, 0), 0);
    return fixedTotal + trackerOutflow;
  }, [processedExpenses, currentMonthData.trackers]);

  const safeToSpend = useMemo(() => currentMonthData.income - totalMonthlyBurn, [currentMonthData.income, totalMonthlyBurn]);

  const totalSavingsAccount = useMemo(() => {
    let balance = 0;
    Object.values(monthlyData).forEach(month => {
      (month.expenses || []).forEach(exp => { if (exp.category === "Savings") balance += (exp.amount * (FREQUENCIES[exp.frequency] || 1)); });
      (month.trackers || []).forEach(tracker => { (tracker.entries || []).forEach(entry => { if (entry.fromSavings) balance -= entry.amount; }); });
    });
    return balance;
  }, [monthlyData]);

  const pieChartData = useMemo(() => {
    const totals = {};
    processedExpenses.forEach(exp => totals[exp.category] = (totals[exp.category] || 0) + exp.monthlyAmount);
    (currentMonthData.trackers || []).forEach(t => totals[t.category] = (totals[t.category] || 0) + (t.entries || []).reduce((s, e) => s + e.amount, 0));
    return Object.entries(totals).map(([name, value]) => ({ name, value })).filter(i => i.value > 0).sort((a, b) => b.value - a.value);
  }, [processedExpenses, currentMonthData.trackers]);

  // Handlers
  const updateMonthlyData = (newData) => setMonthlyData(prev => ({ ...prev, [selectedMonth]: { ...currentMonthData, ...newData } }));
  
  const addExpense = (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const newExp = { id: Date.now(), name: fd.get('name'), category: fd.get('category'), amount: parseFloat(fd.get('amount')) || 0, frequency: fd.get('frequency') };
    updateMonthlyData({ expenses: [...(currentMonthData.expenses || []), newExp] });
    e.target.reset();
  };

  const deleteExpense = (id) => updateMonthlyData({ expenses: currentMonthData.expenses.filter(e => e.id !== id) });

  const addTracker = (cat) => {
    const newT = { id: Date.now(), category: cat, title: 'Event Log', detailLabel: 'Who / Where', entries: [] };
    updateMonthlyData({ trackers: [...(currentMonthData.trackers || []), newT] });
  };

  const deleteTracker = (id) => updateMonthlyData({ trackers: currentMonthData.trackers.filter(t => t.id !== id) });

  const addTrackerEntry = (tid, e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const entry = { id: Date.now(), date: fd.get('date'), occasion: fd.get('occasion'), details: fd.get('details'), amount: parseFloat(fd.get('amount')) || 0, fromSavings: fd.get('fromSavings') === 'on' };
    updateMonthlyData({ trackers: currentMonthData.trackers.map(t => t.id === tid ? { ...t, entries: [...(t.entries || []), entry] } : t) });
    e.target.reset();
  };

  const deleteTrackerEntry = (tid, eid) => updateMonthlyData({ trackers: currentMonthData.trackers.map(t => t.id === tid ? { ...t, entries: t.entries.filter(e => e.id !== eid) } : t) });

  const addCategory = (e) => {
    e.preventDefault();
    const name = e.target.categoryName.value.trim();
    if (name && !categories.some(c => c.name === name)) setCategories([...categories, { name, color: e.target.categoryColor.value, icon: newCategoryIcon }]);
    e.target.reset();
  };

  const updateCategoryColor = (name, color) => setCategories(categories.map(c => c.name === name ? { ...c, color } : c));
  const removeCategory = (name) => { if(window.confirm(`Remove "${name}"?`)) setCategories(categories.filter(c => c.name !== name)); };

  const updateIncomeScenario = (id, field, value) => setIncomeScenarios(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s));
  const addIncomeScenario = () => setIncomeScenarios([...incomeScenarios, { id: Date.now(), month: "New Phase", netto25: 0, brutto25: 0, netto30: 0, brutto30: 0 }]);
  const deleteIncomeScenario = (id) => setIncomeScenarios(incomeScenarios.filter(s => s.id !== id));
  const moveIncomeScenario = (index, dir) => {
    const arr = [...incomeScenarios];
    const target = index + dir;
    if(target < 0 || target >= arr.length) return;
    [arr[index], arr[target]] = [arr[target], arr[index]];
    setIncomeScenarios(arr);
  };

  // --- Views ---

  const renderMonthView = () => (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-xl border border-slate-100 p-4 md:p-8 flex flex-col items-center justify-center relative max-w-3xl mx-auto">
        <CustomPieChart data={pieChartData} categoryMap={categoryColorMap} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-24 h-24 md:w-32 md:h-32 bg-white rounded-full shadow-inner flex flex-col items-center justify-center border-[4px] md:border-[6px] border-slate-50">
            <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">Burn</p>
            <p className="text-xl md:text-2xl font-black text-slate-900 leading-none mt-1">€{totalMonthlyBurn.toFixed(0)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center gap-3 bg-slate-50/50">
           <div className="p-2 bg-blue-600 text-white rounded-lg shadow-md"><CreditCard size={18} /></div>
           <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight">Recurring Obligations</h2>
        </div>
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm min-w-[320px]">
            <thead className="bg-slate-100/50 text-slate-500 uppercase tracking-[0.2em] text-[8px] font-black border-b border-slate-100">
              <tr>
                <th className="px-4 md:px-6 py-3">Expense</th>
                <th className="px-4 md:px-6 py-3">Category</th>
                <th className="hidden sm:table-cell px-4 md:px-6 py-3 text-right">Amount</th>
                <th className="px-4 md:px-6 py-3 text-right">Monthly</th>
                <th className="px-4 md:px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedExpenses.map((exp) => {
                const Icon = AVAILABLE_ICONS[categoryIconMap[exp.category] || "Circle"];
                return (
                  <tr key={exp.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-4 md:px-6 py-3 font-bold text-slate-900 text-xs">{exp.name}</td>
                    <td className="px-4 md:px-6 py-3">
                      <span className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-[9px] md:text-[10px] font-black bg-white border border-slate-200 text-slate-700 shadow-sm whitespace-nowrap">
                        <Icon size={14} style={{ color: categoryColorMap[exp.category] }} className="flex-shrink-0" />
                        {exp.category}
                      </span>
                    </td>
                    <td className="hidden sm:table-cell px-4 md:px-6 py-3 text-right text-slate-400 italic text-[11px]">€{exp.amount.toFixed(2)}</td>
                    <td className="px-4 md:px-6 py-3 text-right font-black text-slate-900 text-xs md:text-sm">€{exp.monthlyAmount.toFixed(2)}</td>
                    <td className="px-4 md:px-6 py-3 text-center">
                      <button onClick={() => deleteExpense(exp.id)} className="p-1.5 text-slate-300 hover:text-red-500"><Trash2 size={14} /></button>
                    </td>
                  </tr>
                );
              })}
              <tr className="bg-blue-50/30">
                <td colSpan="5" className="px-4 md:px-6 py-4">
                  <form onSubmit={addExpense} className="flex flex-wrap gap-2 items-center">
                    <input name="name" required placeholder="Name" className="flex-1 min-w-[80px] px-3 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500" />
                    <select name="category" required className="flex-1 min-w-[100px] px-2 py-1.5 text-[10px] border border-slate-200 rounded-lg outline-none bg-white">
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <input name="amount" type="number" step="0.01" required placeholder="€" className="w-14 md:w-16 px-2 py-1.5 text-xs border border-slate-200 rounded-lg outline-none focus:border-blue-500 font-bold" />
                    <select name="frequency" required className="w-20 md:w-28 px-2 py-1.5 text-[10px] border border-slate-200 rounded-lg outline-none bg-white">
                      {Object.keys(FREQUENCIES).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <button type="submit" className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md"><Plus size={18} /></button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-3 px-2">
          <div>
            <h2 className="text-base md:text-lg font-black text-slate-800 tracking-tight">Event Activity</h2>
            <p className="text-slate-400 text-[10px] md:text-sm mt-0.5 italic">Track your daily out-of-pocket spending.</p>
          </div>
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm w-full sm:w-auto">
            <select id="newTrackerCategory" className="flex-1 sm:flex-none px-3 py-1 text-xs md:text-sm border-none bg-transparent font-bold focus:ring-0 outline-none">
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <button onClick={() => addTracker(document.getElementById('newTrackerCategory').value)} className="px-4 py-1.5 bg-slate-900 text-white text-[10px] md:text-xs font-bold rounded-lg shadow-md flex items-center gap-2"><History size={14}/> Feed</button>
          </div>
        </div>

        <div className="flex flex-col gap-6 md:gap-8">
          {(currentMonthData.trackers || []).map(tracker => {
            const Icon = AVAILABLE_ICONS[categoryIconMap[tracker.category] || "Circle"];
            const color = categoryColorMap[tracker.category];
            const total = (tracker.entries || []).reduce((s, e) => s + e.amount, 0);
            return (
              <div key={tracker.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-white border border-slate-200 shadow-sm"><Icon size={20} style={{ color }} /></div>
                    <div>
                      <h3 className="font-black text-sm md:text-base text-slate-800">{tracker.category}</h3>
                      <p className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase tracking-widest">Feed stream</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-black text-rose-600 text-sm md:text-base">- €{total.toFixed(2)}</span>
                    <button onClick={() => deleteTracker(tracker.id)} className="text-slate-300 hover:text-red-500"><Trash2 size={16} /></button>
                  </div>
                </div>
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full min-w-[320px]">
                    <thead className="bg-slate-50 text-slate-400 text-[8px] font-black uppercase tracking-widest border-b border-slate-100">
                      <tr><th className="px-4 md:px-6 py-3">Date</th><th className="px-4 md:px-6 py-3">Occasion</th><th className="hidden xs:table-cell px-4 md:px-6 py-3 text-center">Fund</th><th className="px-4 md:px-6 py-3 text-right">Sum</th><th className="px-4 md:px-6 py-3 text-center">Action</th></tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {(tracker.entries || []).map(e => (
                        <tr key={e.id} className={`text-[10px] md:text-xs ${e.fromSavings ? 'bg-amber-50/20' : ''}`}>
                          <td className="px-4 md:px-6 py-2.5 text-slate-400 font-bold whitespace-nowrap">{new Date(e.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}</td>
                          <td className="px-4 md:px-6 py-2.5 font-black text-slate-900">{e.occasion}</td>
                          <td className="hidden xs:table-cell px-4 md:px-6 py-2.5 text-center">{e.fromSavings && <span className="px-2 py-0.5 bg-amber-100 text-amber-800 text-[7px] md:text-[8px] rounded-full font-black uppercase shadow-sm">Savings</span>}</td>
                          <td className="px-4 md:px-6 py-2.5 text-right font-black text-rose-600 whitespace-nowrap">- €{e.amount.toFixed(2)}</td>
                          <td className="px-4 md:px-6 py-2.5 text-center"><button onClick={() => deleteTrackerEntry(tracker.id, e.id)} className="text-slate-200 hover:text-red-500"><X size={14}/></button></td>
                        </tr>
                      ))}
                      <tr className="bg-slate-50/50">
                        <td colSpan="5" className="px-3 md:px-4 py-4">
                          <form onSubmit={(e) => addTrackerEntry(tracker.id, e)} className="flex flex-wrap gap-2 md:gap-3 items-center">
                            <input name="date" type="date" required className="flex-[0.5] min-w-[90px] px-2 py-1.5 text-[9px] md:text-[10px] border-2 border-white rounded-lg shadow-sm font-bold" />
                            <input name="occasion" placeholder="Occasion" required className="flex-1 min-w-[100px] px-2 py-1.5 text-[9px] md:text-[10px] border-2 border-white rounded-lg shadow-sm font-bold" />
                            <div className="flex items-center gap-1.5 px-2 bg-white border-2 border-white rounded-lg shadow-sm py-1.5"><input type="checkbox" name="fromSavings" className="w-3 h-3 text-amber-500 rounded border-slate-300"/><span className="text-[7px] md:text-[8px] font-black text-slate-400 uppercase">Save</span></div>
                            <input name="amount" type="number" step="0.01" required placeholder="€" className="w-16 md:w-20 px-2 py-1.5 text-[9px] md:text-[10px] border-2 border-white rounded-lg shadow-sm font-black text-rose-600" />
                            <button type="submit" className="h-7 w-7 md:h-8 md:w-8 bg-blue-600 text-white rounded-lg flex items-center justify-center shadow-md"><Plus size={16} strokeWidth={3} /></button>
                          </form>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderIncomeScenarios = () => (
    <div className="space-y-6 md:space-y-10 animate-in fade-in duration-700 pb-10">
      <div className="bg-white rounded-3xl p-6 md:p-12 shadow-xl border border-slate-100 text-center">
        <h2 className="text-2xl md:text-4xl font-black mb-3 tracking-tight">Salary Scenarios</h2>
        <p className="text-slate-400 text-xs md:text-base italic mb-10">Project future capacity across employment models.</p>
        <CustomBarChart data={incomeScenarios} />
        <div className="flex justify-center gap-6 mt-6 text-[10px] font-black uppercase tracking-widest">
           <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full" /> 25H Netto</div>
           <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full" /> 30H Netto</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="w-full overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm table-auto min-w-[500px]">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-widest text-[9px] font-black border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Phase Description</th>
                <th className="px-6 py-4 text-center">25H Netto</th>
                <th className="hidden md:table-cell px-6 py-4 text-center text-slate-300">25H Brutto</th>
                <th className="px-6 py-4 text-center">30H Netto</th>
                <th className="hidden md:table-cell px-6 py-4 text-center text-slate-300">30H Brutto</th>
                <th className="px-6 py-4 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incomeScenarios.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/50 group transition-colors">
                  <td className="px-6 py-4 font-black text-slate-800">
                    <input type="text" value={row.month} onChange={(e) => updateIncomeScenario(row.id, 'month', e.target.value)} className="bg-transparent border-none p-0 w-full focus:ring-0 font-black text-sm md:text-base tracking-tighter" />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <input type="number" value={row.netto25} onChange={(e) => updateIncomeScenario(row.id, 'netto25', Number(e.target.value))} className="text-emerald-700 font-black bg-emerald-50 rounded-xl py-2 px-3 w-24 text-center focus:ring-0 border-none" />
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-slate-300 italic text-center font-bold text-sm">€{row.brutto25}</td>
                  <td className="px-6 py-4 text-center">
                    <input type="number" value={row.netto30} onChange={(e) => updateIncomeScenario(row.id, 'netto30', Number(e.target.value))} className="text-blue-700 font-black bg-blue-50 rounded-xl py-2 px-3 w-24 text-center focus:ring-0 border-none" />
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 text-slate-300 italic text-center font-bold text-sm">€{row.brutto30}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <button onClick={() => moveIncomeScenario(index, -1)} disabled={index === 0} className="p-2 text-slate-300 hover:text-blue-500 disabled:opacity-10"><ArrowUp size={16}/></button>
                      <button onClick={() => moveIncomeScenario(index, 1)} disabled={index === incomeScenarios.length - 1} className="p-2 text-slate-300 hover:text-blue-500 disabled:opacity-10"><ArrowDown size={16}/></button>
                      <button onClick={() => deleteIncomeScenario(row.id)} className="p-2 text-slate-300 hover:text-red-500 ml-1"><Trash2 size={16}/></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex justify-center">
            <button onClick={addIncomeScenario} className="flex items-center gap-3 px-10 py-4 text-xs font-black text-blue-600 bg-white border border-blue-100 rounded-2xl shadow-sm hover:bg-blue-50 transition-all uppercase tracking-widest"><Plus size={18}/> Add phase</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 overflow-x-hidden">
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-[60] md:hidden" onClick={() => setIsSidebarOpen(false)}></div>}
      <aside className={`fixed md:relative inset-y-0 left-0 z-[70] bg-slate-900 text-slate-400 shadow-2xl transition-all duration-500 transform ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden'}`}>
        <div className="flex flex-col h-full w-72">
          <div className="p-8 flex justify-between items-center"><AppLogo /><button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-2 text-slate-400"><X size={24} /></button></div>
          <nav className="px-6 space-y-4 mt-8 flex-1">
            {['monthly', 'scenarios', 'settings'].map(tab => (
              <button key={tab} onClick={() => { setActiveTab(tab); setIsSidebarOpen(false); }} className={`flex items-center justify-between w-full px-6 py-4 rounded-2xl text-sm font-black transition-all ${activeTab === tab ? 'bg-blue-600 text-white shadow-xl' : 'hover:bg-slate-800'}`}>
                <div className="flex items-center gap-3">{tab === 'monthly' ? <Calendar size={20} /> : tab === 'scenarios' ? <TrendingUp size={20} /> : <Settings size={20} />} <span className="capitalize">{tab === 'monthly' ? 'Daily Tracking' : tab === 'scenarios' ? 'Salary Scenarios' : 'Configuration'}</span></div><ChevronRight size={16} />
              </button>
            ))}
          </nav>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <header className="flex flex-col bg-white border-b border-slate-200 sticky top-0 z-50 flex-shrink-0">
          <div className="h-16 md:h-20 flex items-center justify-between px-4 md:px-12">
            <div className="flex items-center gap-4">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-50 rounded-xl"><Menu size={24} /></button>
              <div className="flex flex-col">
                <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-xl md:text-3xl font-black text-slate-900 bg-transparent border-none p-0 focus:ring-0 appearance-none cursor-pointer">{MONTHS.map(m => <option key={m} value={m}>{m}</option>)}</select>
                <span className="text-[7px] md:text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Dashboard</span>
              </div>
            </div>
            <div className="bg-slate-900 rounded-xl p-1.5 pl-3 flex items-center gap-3 md:gap-3 border border-slate-800 shadow-lg">
              <div className="flex flex-col items-end">
                <p className="text-[7px] font-black text-amber-500 uppercase leading-none mb-0.5">Savings</p>
                <p className="text-sm md:text-lg font-black text-white leading-none">€{totalSavingsAccount.toLocaleString()}</p>
              </div>
              <div className="p-2 md:p-2.5 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20"><PiggyBank size={20} /></div>
            </div>
          </div>

          {activeTab === 'monthly' && (
            <div className="grid grid-cols-3 py-3 bg-slate-50 border-t border-slate-100 shadow-inner px-2">
              <div className="flex items-center justify-center gap-2 border-r border-slate-200">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg"><Banknote size={20}/></div>
                <div className="flex flex-col">
                   <p className="text-[7px] font-black text-slate-400 uppercase leading-none mb-1">Income</p>
                   <input type="number" value={currentMonthData.income} onChange={(e) => updateMonthlyData({ income: parseFloat(e.target.value) || 0 })} className="text-[11px] md:text-sm font-black text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-14 md:w-20" />
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 border-r border-slate-200">
                <div className="p-1.5 bg-rose-100 text-rose-600 rounded-lg"><Flame size={20}/></div>
                <div className="flex flex-col">
                   <p className="text-[7px] font-black text-slate-400 uppercase leading-none mb-1">Burn</p>
                   <p className="text-[11px] md:text-sm font-black text-rose-600">€{totalMonthlyBurn.toFixed(0)}</p>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <div className="p-1.5 bg-emerald-100 text-emerald-600 rounded-lg"><ShieldCheck size={20}/></div>
                <div className="flex flex-col">
                   <p className="text-[7px] font-black text-slate-400 uppercase leading-none mb-1">Safe</p>
                   <p className={`text-[11px] md:text-sm font-black ${safeToSpend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>€{safeToSpend.toFixed(0)}</p>
                </div>
              </div>
            </div>
          )}
        </header>

        <main className="flex-1 p-3 md:p-14 overflow-y-auto overflow-x-auto custom-scrollbar">
          <div className="max-w-6xl mx-auto">
            {activeTab === 'monthly' && renderMonthView()}
            {activeTab === 'scenarios' && renderIncomeScenarios()}
            {activeTab === 'settings' && (
              <div className="max-w-4xl mx-auto space-y-6 md:space-y-8 animate-in fade-in duration-700">
                <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-slate-100">
                  <h2 className="text-2xl md:text-3xl font-black mb-6 md:mb-8">Setup</h2>
                  <form onSubmit={addCategory} className="flex flex-wrap gap-4 items-end mb-6 md:mb-8">
                    <div className="flex-1 min-w-[150px] md:min-w-[200px]"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Category Name</label><input type="text" name="categoryName" required className="w-full p-3 md:p-4 bg-slate-50 rounded-xl md:rounded-2xl border-none font-bold text-sm md:text-base" /></div>
                    <div className="w-16 md:w-20"><label className="text-[10px] font-black text-slate-400 uppercase ml-1">Color</label><input type="color" name="categoryColor" className="w-full h-12 md:h-14 p-1 bg-white rounded-xl md:rounded-2xl" defaultValue="#3b82f6" /></div>
                    <button type="submit" className="px-6 md:px-8 py-3 md:py-4 bg-blue-600 text-white font-black rounded-xl md:rounded-2xl text-sm md:text-base">Add</button>
                  </form>
                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-3 md:p-4 bg-slate-50 rounded-2xl h-40 overflow-y-auto mb-6 md:mb-8 custom-scrollbar">
                    {Object.entries(AVAILABLE_ICONS).map(([name, Icon]) => (
                      <button key={name} type="button" onClick={() => setNewCategoryIcon(name)} className={`p-2 md:p-2.5 rounded-xl border-2 transition-all ${newCategoryIcon === name ? 'border-blue-500 bg-white text-blue-600 scale-110' : 'border-transparent text-slate-400 hover:bg-white'}`}><Icon size={18} /></button>
                    ))}
                  </div>
                  <div className="flex flex-wrap gap-2 md:gap-3">
                    {categories.map(c => {
                      const Icon = AVAILABLE_ICONS[c.icon] || AVAILABLE_ICONS["Circle"];
                      return (
                        <div key={c.name} className="flex items-center gap-2 md:gap-3 px-3 md:px-4 py-2 md:py-2.5 bg-white rounded-xl border border-slate-100 shadow-sm">
                          <Icon size={16} style={{ color: c.color }} />
                          <span className="text-[10px] md:text-xs font-black text-slate-700 uppercase tracking-tighter">{c.name}</span>
                          <button onClick={() => removeCategory(c.name)} className="text-slate-300 hover:text-red-500"><X size={16}/></button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

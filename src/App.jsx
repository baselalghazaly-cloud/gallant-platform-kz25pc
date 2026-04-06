import React, { useState, useMemo, useRef, useEffect } from 'react';
import { 
  PieChart as PieChartIcon, 
  Settings, 
  Wallet, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X,
  ListPlus,
  Coffee,
  Utensils,
  ArrowUp,
  ArrowDown,
  Menu,
  ChevronRight,
  TrendingUp,
  CreditCard,
  Banknote,
  Flame,
  ShieldCheck,
  Receipt,
  User,
  History,
  PiggyBank,
  Palette,
  Sparkles,
  ShoppingBag,
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

// --- Constants & Initial Data ---

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

const FREQUENCIES = {
  "Weekly": 4.33,
  "Every other week": 2.16,
  "Monthly": 1,
  "Every other month": 0.5,
  "Quarterly": 0.333,
  "Every 6 months": 0.166,
  "Yearly": 0.083
};

const INITIAL_INCOME_SCENARIOS = [
  { id: 1, month: "April", netto25: 1465, brutto25: 2006, netto30: 1719, brutto30: 2408 },
  { id: 2, month: "May", netto25: 2488, brutto25: 3762, netto30: 2897, brutto30: 4515 },
  { id: 3, month: "June", netto25: 2488, brutto25: 3762, netto30: 2897, brutto30: 4515 },
  { id: 4, month: "July (Est. +3%)", netto25: 2550, brutto25: 3875, netto30: 2960, brutto30: 4650 },
  { id: 5, month: "August", netto25: 2550, brutto25: 3875, netto30: 2960, brutto30: 4650 },
  { id: 6, month: "September", netto25: 2550, brutto25: 3875, netto30: 2960, brutto30: 4650 },
  { id: 7, month: "October", netto25: 2550, brutto25: 3875, netto30: 2960, brutto30: 4650 },
  { id: 8, month: "November", netto25: 2550, brutto25: 3875, netto30: 2960, brutto30: 4650 },
  { id: 9, month: "December", netto25: 2550, brutto25: 3875, netto30: 2960, brutto30: 4650 },
];

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

// --- UI Components ---

const AppLogo = () => (
  <div className="flex items-center gap-4">
    <div className="p-2.5 bg-blue-600 rounded-xl shadow-lg shadow-blue-500/30">
      <Wallet className="text-white" size={28} />
    </div>
    <span className="text-3xl font-black text-white leading-none tracking-tighter">Wallet</span>
  </div>
);

const CustomPieChart = ({ data, categoryMap }) => {
  const size = 650; 
  const radius = size / 2.3; 
  const center = size / 2;
  
  const total = data.reduce((sum, item) => sum + item.value, 0);
  let cumulativeValue = 0;

  if (total === 0) return (
    <div className="flex flex-col items-center justify-center w-full h-full text-slate-400 min-h-[300px]">
      <PieChartIcon size={64} className="opacity-20" />
    </div>
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
              <title>{slice.name}: €{slice.value.toFixed(2)} ({percent}%)</title>
              <path 
                d={pathData} 
                fill={categoryMap[slice.name] || '#cbd5e1'} 
                stroke="#ffffff" 
                strokeWidth="4" 
                className="group-hover:scale-105 origin-center transition-transform duration-300" 
              />
              <g className="pointer-events-none transition-all duration-300 group-hover:scale-110 origin-center">
                <text 
                  x={textX} 
                  y={textY} 
                  textAnchor={textAnchor} 
                  alignmentBaseline="middle"
                  className="text-[24px] font-black fill-slate-900 drop-shadow-sm"
                >
                  {slice.name}
                </text>
                <text 
                  x={textX} 
                  y={textY + 32} 
                  textAnchor={textAnchor} 
                  alignmentBaseline="middle"
                  className="text-[20px] font-bold fill-blue-600"
                >
                  {percent}%
                </text>
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
  const width = Math.max(800, data.length * 100); 
  const height = 350;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 1.5;

  const maxVal = Math.max(...data.flatMap(d => [d.netto25 || 0, d.brutto25 || 0, d.netto30 || 0, d.brutto30 || 0]), 1000);
  const scale = maxVal > 0 ? chartHeight / maxVal : 1;
  const groupWidth = chartWidth / data.length;
  const barWidth = groupWidth * 0.15;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="min-w-[800px]">
        <div className="flex flex-wrap justify-center gap-6 mb-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> 25H Netto</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-200 rounded-sm"></div> 25H Brutto</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-sm"></div> 30H Netto</div>
          <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-200 rounded-sm"></div> 30H Brutto</div>
        </div>
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto">
          {[0, 0.25, 0.5, 0.75, 1].map(ratio => {
            const y = height - padding - (maxVal * ratio * scale);
            return (
              <g key={ratio}>
                <line x1={padding} y1={y} x2={width - padding} y2={y} stroke="#e2e8f0" strokeDasharray="4 4" />
                <text x={padding - 10} y={y + 4} textAnchor="end" className="text-[10px] fill-slate-400">€{Math.round(maxVal * ratio)}</text>
              </g>
            );
          })}
          
          {data.map((d, i) => {
            const xBase = padding + i * groupWidth + (groupWidth * 0.1);
            const hNetto25 = (d.netto25 || 0) * scale;
            const hBrutto25 = (d.brutto25 || 0) * scale;
            const hNetto30 = (d.netto30 || 0) * scale;
            const hBrutto30 = (d.brutto30 || 0) * scale;
            
            return (
              <g key={d.id}>
                <text x={padding + i * groupWidth + groupWidth / 2} y={height - padding + 25} textAnchor="middle" className="text-xs font-semibold fill-slate-700">
                  {d.month}
                </text>
                <rect x={xBase} y={height - padding - hNetto25} width={barWidth} height={hNetto25} fill="#10b981" rx={2} className="transition-all hover:opacity-80 cursor-pointer" />
                <rect x={xBase + barWidth + 2} y={height - padding - hBrutto25} width={barWidth} height={hBrutto25} fill="#a7f3d0" rx={2} className="transition-all hover:opacity-80 cursor-pointer" />
                <rect x={xBase + (barWidth + 2) * 2} y={height - padding - hNetto30} width={barWidth} height={hNetto30} fill="#3b82f6" rx={2} className="transition-all hover:opacity-80 cursor-pointer" />
                <rect x={xBase + (barWidth + 2) * 3} y={height - padding - hBrutto30} width={barWidth} height={hBrutto30} fill="#bfdbfe" rx={2} className="transition-all hover:opacity-80 cursor-pointer" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};


// --- Main Application Component ---

export default function App() {
  const [activeTab, setActiveTab] = useState('monthly');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("May");

  // 1. Initialize states from LocalStorage or Defaults
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('wallet_categories');
    return saved ? JSON.parse(saved) : INITIAL_CATEGORIES;
  });

  const [newCategoryIcon, setNewCategoryIcon] = useState("Home");

  const categoryColorMap = useMemo(() => {
    return categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.color }), {});
  }, [categories]);

  const categoryIconMap = useMemo(() => {
    return categories.reduce((acc, cat) => ({ ...acc, [cat.name]: cat.icon }), {});
  }, [categories]);

  const [incomeScenarios, setIncomeScenarios] = useState(() => {
    const saved = localStorage.getItem('wallet_scenarios');
    return saved ? JSON.parse(saved) : INITIAL_INCOME_SCENARIOS;
  });

  const [monthlyData, setMonthlyData] = useState(() => {
    const saved = localStorage.getItem('wallet_monthlyData');
    return saved ? JSON.parse(saved) : {
      "May": {
        income: 1483,
        expenses: [],
        trackers: []
      }
    };
  });

  // 2. Sync changes back to LocalStorage whenever they change
  useEffect(() => {
    localStorage.setItem('wallet_categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('wallet_scenarios', JSON.stringify(incomeScenarios));
  }, [incomeScenarios]);

  useEffect(() => {
    localStorage.setItem('wallet_monthlyData', JSON.stringify(monthlyData));
  }, [monthlyData]);

  // 3. Progressive Web App (PWA) Setup
  useEffect(() => {
    const setupPWA = () => {
      // Dynamic Web Manifest for Installation
      const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><rect width="512" height="512" rx="112" fill="#2563EB"/><path d="M448 256v-106.667H106.667a42.667 42.667 0 0 1 0-85.333h298.666v85.333M64 106.667v298.666A42.667 42.667 0 0 0 106.667 448H448v-106.667M384 256a42.667 42.667 0 0 0 0 85.333h85.333V256Z" fill="none" stroke="#ffffff" stroke-width="32" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
      const iconUrl = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svgIcon);

      const manifest = {
        name: "Wallet Smart Studio",
        short_name: "Wallet",
        description: "Personal Finance Tracker",
        start_url: ".",
        display: "standalone",
        background_color: "#F8FAFC",
        theme_color: "#2563EB",
        icons: [{ src: iconUrl, sizes: "512x512", type: "image/svg+xml", purpose: "any maskable" }]
      };
      
      const manifestBlob = new Blob([JSON.stringify(manifest)], { type: 'application/json' });
      const manifestURL = URL.createObjectURL(manifestBlob);
      
      let manifestLink = document.querySelector('link[rel="manifest"]');
      if (!manifestLink) {
        manifestLink = document.createElement('link');
        manifestLink.rel = 'manifest';
        document.head.appendChild(manifestLink);
      }
      manifestLink.href = manifestURL;
      
      // Removed Service Worker registration since Blob URLs are not supported for SW scripts in this environment.
    };
    
    setupPWA();
  }, []);

  const currentMonthData = useMemo(() => monthlyData[selectedMonth] || { income: 0, expenses: [], trackers: [] }, [monthlyData, selectedMonth]);
  
  const processedExpenses = useMemo(() => {
    return (currentMonthData.expenses || []).map(exp => {
      const multiplier = FREQUENCIES[exp.frequency] || 1;
      const monthlyAmount = exp.amount * multiplier;
      return { ...exp, monthlyAmount };
    });
  }, [currentMonthData.expenses]);

  const totalMonthlyBurn = useMemo(() => {
    const fixedTotal = processedExpenses.reduce((sum, exp) => sum + exp.monthlyAmount, 0);
    const trackerOutflow = currentMonthData.trackers.reduce((sum, t) => 
      sum + t.entries.filter(e => !e.fromSavings).reduce((s, e) => s + e.amount, 0), 0);
    return fixedTotal + trackerOutflow;
  }, [processedExpenses, currentMonthData.trackers]);

  const safeToSpend = useMemo(() => currentMonthData.income - totalMonthlyBurn, [currentMonthData.income, totalMonthlyBurn]);

  const totalSavingsAccount = useMemo(() => {
    let balance = 0; 
    Object.values(monthlyData).forEach(month => {
      month.expenses.forEach(exp => {
        if (exp.category === "Savings") {
          const multiplier = FREQUENCIES[exp.frequency] || 1;
          balance += (exp.amount * multiplier);
        }
      });
      month.trackers.forEach(tracker => {
        tracker.entries.forEach(entry => {
          if (entry.fromSavings) balance -= entry.amount;
        });
      });
    });
    return balance;
  }, [monthlyData]);

  const pieChartData = useMemo(() => {
    const categoryTotals = {};
    processedExpenses.forEach(exp => {
      if (!categoryTotals[exp.category]) categoryTotals[exp.category] = 0;
      categoryTotals[exp.category] += exp.monthlyAmount;
    });
    currentMonthData.trackers.forEach(tracker => {
      if (!categoryTotals[tracker.category]) categoryTotals[tracker.category] = 0;
      categoryTotals[tracker.category] += tracker.entries.reduce((sum, e) => sum + e.amount, 0);
    });
    return Object.entries(categoryTotals)
      .map(([name, value]) => ({ name, value }))
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [processedExpenses, currentMonthData.trackers]);

  // Handlers
  const updateMonthlyData = (newData) => {
    setMonthlyData(prev => ({
      ...prev,
      [selectedMonth]: { ...currentMonthData, ...newData }
    }));
  };

  const addExpense = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newExpense = {
      id: Date.now(),
      name: formData.get('name'),
      category: formData.get('category'),
      amount: parseFloat(formData.get('amount')) || 0,
      frequency: formData.get('frequency'),
    };
    updateMonthlyData({ expenses: [...(currentMonthData.expenses || []), newExpense] });
    e.target.reset();
  };

  const deleteExpense = (id) => {
    updateMonthlyData({ expenses: currentMonthData.expenses.filter(exp => exp.id !== id) });
  };

  const addTracker = (category) => {
    let detailLabel = "Specifics";
    if(category.includes("Daily") || category.includes("Eating") || category.includes("Drinking") || category.includes("Ordering") || category.includes("Entertainment")) detailLabel = "Who / Where";
    if(category.includes("Shopping") || category.includes("Groceries")) detailLabel = "Store / Brand";
    const newTracker = {
      id: Date.now(),
      category: category,
      title: `Event Log`,
      detailLabel: detailLabel,
      entries: []
    };
    updateMonthlyData({ trackers: [...(currentMonthData.trackers || []), newTracker] });
  };

  const deleteTracker = (trackerId) => {
    updateMonthlyData({ trackers: currentMonthData.trackers.filter(t => t.id !== trackerId) });
  };

  const addTrackerEntry = (trackerId, e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newEntry = {
      id: Date.now(),
      date: formData.get('date'),
      occasion: formData.get('occasion'),
      details: formData.get('details'),
      amount: parseFloat(formData.get('amount')) || 0,
      fromSavings: formData.get('fromSavings') === 'on'
    };
    updateMonthlyData({
      trackers: currentMonthData.trackers.map(t => t.id === trackerId ? { ...t, entries: [...t.entries, newEntry] } : t)
    });
    e.target.reset();
  };

  const deleteTrackerEntry = (trackerId, entryId) => {
    updateMonthlyData({
      trackers: currentMonthData.trackers.map(t => t.id === trackerId ? { ...t, entries: t.entries.filter(e => e.id !== entryId) } : t)
    });
  };

  const addCategory = (e) => {
    e.preventDefault();
    const newName = e.target.categoryName.value.trim();
    const newColor = e.target.categoryColor.value;
    if (newName && !categories.some(c => c.name === newName)) {
      setCategories([...categories, { name: newName, color: newColor, icon: newCategoryIcon }]);
    }
    e.target.reset();
  };

  const updateCategoryColor = (name, color) => {
    setCategories(categories.map(c => c.name === name ? { ...c, color } : c));
  };

  const removeCategory = (name) => {
    if(window.confirm(`Remove category "${name}"?`)) {
      setCategories(categories.filter(c => c.name !== name));
    }
  };

  const updateIncomeScenario = (id, field, value) => {
    setIncomeScenarios(prev => prev.map(scenario => scenario.id === id ? { ...scenario, [field]: value } : scenario));
  };

  const addIncomeScenario = () => {
    const newId = incomeScenarios.length > 0 ? Math.max(...incomeScenarios.map(s => s.id)) + 1 : 1;
    setIncomeScenarios(prev => [...prev, { id: newId, month: "New Phase", netto25: 0, brutto25: 0, netto30: 0, brutto30: 0 }]);
  };

  const deleteIncomeScenario = (id) => {
    setIncomeScenarios(prev => prev.filter(scenario => scenario.id !== id));
  };

  const moveIncomeScenario = (index, direction) => {
    const newScenarios = [...incomeScenarios];
    if (direction === 'up' && index > 0) {
      [newScenarios[index - 1], newScenarios[index]] = [newScenarios[index], newScenarios[index - 1]];
      setIncomeScenarios(newScenarios);
    } else if (direction === 'down' && index < newScenarios.length - 1) {
      [newScenarios[index + 1], newScenarios[index]] = [newScenarios[index], newScenarios[index + 1]];
      setIncomeScenarios(newScenarios);
    }
  };

  // --- Views ---
  const renderMonthView = () => (
    <div className="space-y-12 animate-in fade-in duration-700">
      
      {/* GIANT CENTER CHART BOX - COMPACT CONTAINER */}
      <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-2 md:p-8 flex flex-col items-center justify-center relative overflow-visible text-center max-w-4xl mx-auto">
          <div className="w-full flex items-center justify-center overflow-visible">
             <CustomPieChart data={pieChartData} categoryMap={categoryColorMap} />
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-40 h-40 bg-white rounded-full shadow-inner flex flex-col items-center justify-center border-[10px] border-slate-50/80 backdrop-blur-sm">
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Burn Rate</p>
                   <p className="text-3xl font-black text-slate-900 leading-none mt-1">€{totalMonthlyBurn.toFixed(0)}</p>
                </div>
             </div>
          </div>
      </div>

      {/* RECURRING OBLIGATIONS SECTION - COMPACT DENSITY */}
      <div className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 rounded-t-[1.5rem]">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-blue-600 text-white rounded-[0.7rem] shadow-lg shadow-blue-200">
                <CreditCard size={18} />
             </div>
             <h2 className="text-lg font-black text-slate-800 tracking-tight">Recurring Obligations</h2>
          </div>
        </div>
        
        <div className="w-full overflow-visible">
          <table className="w-full text-left text-sm table-auto border-collapse">
            <thead className="bg-slate-100/50 text-slate-500 uppercase tracking-[0.2em] text-[8px] font-black border-b border-slate-100">
              <tr>
                <th className="px-6 py-3">Expense</th>
                <th className="px-6 py-3">Category</th>
                <th className="px-6 py-3 text-right">Amount</th>
                <th className="px-6 py-3">Freq.</th>
                <th className="px-6 py-3 text-right">Monthly Amt</th>
                <th className="px-6 py-3 text-right">Share of Burn</th>
                <th className="px-6 py-3 text-right">Share of Income</th>
                <th className="px-6 py-3 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {processedExpenses.map((exp) => {
                const iconName = categoryIconMap[exp.category] || "Circle";
                const IconComponent = AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS["Circle"];
                const catColor = categoryColorMap[exp.category] || '#cbd5e1';

                return (
                  <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="px-6 py-2.5 text-slate-900 font-bold text-xs whitespace-nowrap">{exp.name}</td>
                    <td className="px-6 py-2.5 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[9px] font-black bg-white border border-slate-200 text-slate-700 shadow-sm">
                        <IconComponent size={12} style={{ color: catColor }} />
                        {exp.category}
                      </span>
                    </td>
                    <td className="px-6 py-2.5 text-right text-slate-500 font-medium italic text-[11px] whitespace-nowrap">€{exp.amount.toFixed(2)}</td>
                    <td className="px-6 py-2.5 text-slate-400 font-bold text-[8px] uppercase tracking-widest whitespace-nowrap">{exp.frequency}</td>
                    <td className="px-6 py-2.5 text-right font-black text-slate-900 text-sm whitespace-nowrap">€{exp.monthlyAmount.toFixed(2)}</td>
                    <td className="px-6 py-2.5 text-right whitespace-nowrap">
                      <div className="inline-block px-2 py-0.5 bg-rose-50 rounded-md text-rose-700 font-black text-[8px] border border-rose-100">
                        {totalMonthlyBurn > 0 ? ((exp.monthlyAmount / totalMonthlyBurn) * 100).toFixed(1) : 0}%
                      </div>
                    </td>
                    <td className="px-6 py-2.5 text-right whitespace-nowrap">
                      <div className="inline-block px-2 py-0.5 bg-blue-50 rounded-md text-blue-700 font-black text-[8px] border border-blue-100">
                        {currentMonthData.income > 0 ? ((exp.monthlyAmount / currentMonthData.income) * 100).toFixed(1) : 0}%
                      </div>
                    </td>
                    <td className="px-6 py-2.5 text-center whitespace-nowrap">
                      <button onClick={() => deleteExpense(exp.id)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-all opacity-0 group-hover:opacity-100">
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
              
              <tr className="bg-blue-600/5">
                <td colSpan="8" className="px-6 py-3 rounded-b-[1.5rem]">
                  <form onSubmit={addExpense} className="flex flex-wrap md:flex-nowrap gap-3 items-center">
                    <input name="name" required placeholder="New expense..." className="flex-1 min-w-[120px] px-3 py-1.5 text-xs border-2 border-slate-100 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none transition-all font-bold" />
                    <select name="category" required className="flex-1 min-w-[120px] px-3 py-1.5 text-xs border-2 border-slate-100 rounded-lg focus:border-blue-500 focus:outline-none bg-white font-bold">
                      {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                    </select>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px]">€</span>
                      <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-20 pl-6 pr-2 py-1.5 text-xs border-2 border-slate-100 rounded-lg focus:border-blue-500 focus:outline-none bg-white font-black" />
                    </div>
                    <select name="frequency" required className="w-32 px-3 py-1.5 text-xs border-2 border-slate-100 rounded-lg focus:border-blue-500 focus:outline-none bg-white font-bold text-[9px] uppercase tracking-tighter">
                      {Object.keys(FREQUENCIES).map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                    <button type="submit" className="px-5 py-1.5 bg-blue-600 text-white text-xs font-black rounded-lg hover:bg-blue-700 transition flex items-center gap-2 shadow-md shadow-blue-200 active:scale-95">
                      <Plus size={16} /> Add
                    </button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* EVENT ACTIVITY FEED - UNIFORM SIZE WITH OBLIGATIONS */}
      <div className="space-y-6">
        <div className="flex justify-between items-end px-2">
          <div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Event Activity</h2>
            <p className="text-slate-400 font-medium font-sans text-sm mt-1 tracking-tight italic">Detailed feed of your daily out-of-pocket spending.</p>
          </div>
          
          <div className="flex gap-2 items-center bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
            <select id="newTrackerCategory" className="px-3 py-1.5 text-sm border-none bg-transparent font-bold focus:ring-0 outline-none text-slate-700 cursor-pointer">
              {categories.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
            <button 
              onClick={() => addTracker(document.getElementById('newTrackerCategory').value)}
              className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-lg hover:bg-slate-800 transition flex items-center gap-2 shadow-md active:scale-95"
            >
              <History size={16} /> New Feed
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {(currentMonthData.trackers || []).map(tracker => {
            const trackerTotal = tracker.entries.reduce((sum, e) => sum + e.amount, 0);
            
            const iconName = categoryIconMap[tracker.category] || "Circle";
            const IconComponent = AVAILABLE_ICONS[iconName] || AVAILABLE_ICONS["Circle"];
            const catColor = categoryColorMap[tracker.category] || '#cbd5e1';

            return (
              <div key={tracker.id} className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col transition-all hover:shadow-xl hover:shadow-slate-200/50 group/card">
                {/* Tracker Header */}
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30 rounded-t-[1.5rem]">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-white border border-slate-200 shadow-sm">
                       <IconComponent size={18} style={{ color: catColor }} />
                    </div>
                    <div>
                       <h3 className="font-black text-xl text-slate-800 tracking-tight">{tracker.category}</h3>
                       <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Tracking stream</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="bg-rose-50 px-4 py-1.5 rounded-xl border-2 border-rose-100 shadow-sm shadow-rose-100/50">
                       <span className="font-black text-rose-600 text-lg tracking-tighter">- €{trackerTotal.toFixed(2)}</span>
                    </div>
                    <button onClick={() => deleteTracker(tracker.id)} className="text-slate-300 hover:text-red-500 transition-colors p-1 hover:bg-red-50 rounded-md">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>

                <div className="w-full overflow-visible">
                  <table className="w-full text-left text-sm table-auto border-collapse">
                    <thead className="bg-slate-100/30 text-slate-400 sticky top-0 uppercase tracking-widest text-[8px] font-black border-b border-slate-100">
                      <tr>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Occasion</th>
                        <th className="px-6 py-4">{tracker.detailLabel || "Details"}</th>
                        <th className="px-6 py-4 text-center">Funding</th>
                        <th className="px-6 py-4 text-right">Sum</th>
                        <th className="px-6 py-4 text-center">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {tracker.entries.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="py-10 text-center text-slate-300">
                             <div className="flex flex-col items-center opacity-40">
                                <Receipt size={32} className="mb-2" />
                                <p className="text-[10px] font-black uppercase tracking-widest">No entries recorded</p>
                             </div>
                          </td>
                        </tr>
                      ) : (
                        tracker.entries.map(entry => (
                          <tr key={entry.id} className={`group/row transition-colors hover:bg-slate-50/50 ${entry.fromSavings ? 'bg-amber-50/20' : ''}`}>
                            <td className="px-6 py-3 whitespace-nowrap text-slate-500 font-bold text-[10px] uppercase tracking-tighter">
                               {new Date(entry.date).toLocaleDateString(undefined, { day: '2-digit', month: 'short' })}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap font-black text-slate-900 text-xs">
                               {entry.occasion}
                            </td>
                            <td className="px-6 py-3 whitespace-nowrap text-slate-400 italic text-[10px]">
                               {entry.details || "—"}
                            </td>
                            <td className="px-6 py-3 text-center whitespace-nowrap">
                               {entry.fromSavings ? (
                                 <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 text-[8px] font-black uppercase tracking-tighter border border-amber-200">
                                    <PiggyBank size={10} /> Savings
                                 </span>
                               ) : (
                                 <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">Regular</span>
                               )}
                            </td>
                            <td className="px-6 py-3 text-right whitespace-nowrap font-black text-rose-600 text-base">
                               - €{entry.amount.toFixed(2)}
                            </td>
                            <td className="px-6 py-3 text-center whitespace-nowrap">
                               <button onClick={() => deleteTrackerEntry(tracker.id, entry.id)} className="p-1 text-slate-200 hover:text-red-500 transition-opacity">
                                  <X size={16} />
                               </button>
                            </td>
                          </tr>
                        ))
                      )}
                      
                      <tr className="bg-slate-50/50">
                        <td colSpan="6" className="px-6 py-4 border-t border-slate-100">
                          <form onSubmit={(e) => addTrackerEntry(tracker.id, e)} className="flex flex-wrap md:flex-nowrap gap-4 items-center">
                            <input name="date" type="date" required className="flex-[0.6] min-w-[120px] px-3 py-1.5 text-[10px] border-2 border-white rounded-lg shadow-sm focus:border-blue-400 outline-none transition-all font-bold" />
                            <input name="occasion" placeholder="Purpose..." required className="flex-1 min-w-[120px] px-3 py-1.5 text-[10px] border-2 border-white rounded-lg shadow-sm focus:border-blue-400 outline-none transition-all font-bold" />
                            <input name="details" placeholder={tracker.detailLabel || "Details..."} className="flex-1 min-w-[120px] px-3 py-1.5 text-[10px] border-2 border-white rounded-lg shadow-sm focus:border-blue-400 outline-none transition-all font-bold" />
                            
                            <div className="flex items-center gap-2 px-3 bg-white border-2 border-white rounded-lg shadow-sm py-1.5 group cursor-pointer">
                               <input type="checkbox" name="fromSavings" id={`savings-${tracker.id}`} className="rounded border-slate-300 text-amber-500 focus:ring-amber-500 w-3 h-3 cursor-pointer" />
                               <label htmlFor={`savings-${tracker.id}`} className="text-[8px] font-black text-slate-400 group-hover:text-amber-600 uppercase tracking-tighter transition-colors cursor-pointer whitespace-nowrap">Use Savings</label>
                            </div>

                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-black text-[10px]">€</span>
                              <input name="amount" type="number" step="0.01" required placeholder="0.00" className="w-20 pl-6 pr-2 py-1.5 text-[10px] border-2 border-white rounded-lg shadow-sm focus:border-blue-400 outline-none transition-all font-black text-rose-600 bg-white" />
                            </div>
                            
                            <button type="submit" className="h-[32px] w-[32px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-lg shadow-blue-200 active:scale-95 flex items-center justify-center flex-shrink-0">
                              <Plus size={18} strokeWidth={3} />
                            </button>
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
    <div className="space-y-12 animate-in fade-in duration-700">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 overflow-hidden text-center">
        <div className="p-16 border-b border-slate-50">
           <h2 className="text-5xl font-black text-slate-900 tracking-tighter mb-3">Salary Scenarios</h2>
           <p className="text-slate-400 text-lg font-medium whitespace-nowrap overflow-hidden text-ellipsis">Project your future financial capacity across different employment models.</p>
        </div>
        <div className="p-12 md:p-20">
          <CustomBarChart data={incomeScenarios} />
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm table-auto border-collapse">
            <thead className="bg-slate-50 text-slate-400 uppercase tracking-widest text-[9px] font-black border-b border-slate-100">
              <tr>
                <th className="px-6 py-4">Month / Phase</th>
                <th className="px-6 py-4 text-center">25 H Netto</th>
                <th className="px-6 py-4 text-center text-slate-300">25 H Brutto</th>
                <th className="px-6 py-4 text-center">30 H Netto</th>
                <th className="px-6 py-4 text-center text-slate-300">30 H Brutto</th>
                <th className="px-6 py-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {incomeScenarios.map((row, index) => (
                <tr key={row.id} className="hover:bg-slate-50/50 group transition-colors">
                  <td className="px-6 py-3 font-black text-slate-800">
                    <input 
                      type="text" 
                      value={row.month} 
                      onChange={(e) => updateIncomeScenario(row.id, 'month', e.target.value)}
                      className="bg-transparent border-none p-0 w-full focus:ring-0 font-black text-base tracking-tighter"
                    />
                  </td>
                  <td className="px-6 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 bg-emerald-50 py-1 rounded-lg border border-emerald-100 max-w-[120px] mx-auto">
                      <span className="text-emerald-500 font-black text-[10px]">€</span>
                      <input 
                        type="number" 
                        value={row.netto25} 
                        onChange={(e) => updateIncomeScenario(row.id, 'netto25', Number(e.target.value))}
                        className="text-emerald-700 font-black bg-transparent border-none p-0 w-16 focus:ring-0 text-sm text-center"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-300 italic text-center font-bold text-sm whitespace-nowrap">€{row.brutto25}</td>
                  <td className="px-6 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1 bg-blue-50 py-1 rounded-lg border border-blue-100 max-w-[120px] mx-auto">
                      <span className="text-blue-500 font-black text-[10px]">€</span>
                      <input 
                        type="number" 
                        value={row.netto30} 
                        onChange={(e) => updateIncomeScenario(row.id, 'netto30', Number(e.target.value))}
                        className="text-blue-700 font-black bg-transparent border-none p-0 w-16 focus:ring-0 text-sm text-center"
                      />
                    </div>
                  </td>
                  <td className="px-6 py-3 text-slate-300 italic text-center font-bold text-sm whitespace-nowrap">€{row.brutto30}</td>
                  <td className="px-6 py-3 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all">
                      <button onClick={() => moveIncomeScenario(index, 'up')} disabled={index === 0} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-20">
                        <ArrowUp size={16} />
                      </button>
                      <button onClick={() => moveIncomeScenario(index, 'down')} disabled={index === incomeScenarios.length - 1} className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg disabled:opacity-20">
                        <ArrowDown size={16} />
                      </button>
                      <button onClick={() => deleteIncomeScenario(row.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="p-6 border-t border-slate-100 bg-slate-50/20 text-center">
            <button 
              onClick={addIncomeScenario}
              className="flex items-center gap-3 px-8 py-2.5 text-sm font-black text-blue-600 bg-white border-2 border-blue-50 hover:border-blue-200 hover:bg-blue-50 rounded-xl transition-all shadow-xl active:scale-95 mx-auto"
            >
              <Plus size={20} strokeWidth={3} /> Add Scenario
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSettings = () => (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-700">
      <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-16">
        <h2 className="text-5xl font-black text-slate-900 mb-4 tracking-tighter">Budget Setup</h2>
        <p className="text-slate-400 font-medium mb-12 text-xl font-sans">Manage categories and their visual colors.</p>
        
        <form onSubmit={addCategory} className="flex flex-wrap md:flex-nowrap gap-6 mb-8 items-end">
          <div className="flex-1 w-full">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Name</label>
            <input 
              type="text" 
              name="categoryName" 
              placeholder="Tag name..." 
              className="w-full px-8 py-5 border-4 border-slate-50 bg-slate-50 rounded-[2rem] focus:border-blue-500 focus:bg-white focus:ring-8 focus:ring-blue-50 focus:outline-none transition-all text-xl font-black"
              required
            />
          </div>
          <div className="w-24">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-2 block">Color</label>
            <input 
              type="color" 
              name="categoryColor" 
              defaultValue="#3b82f6"
              className="w-full h-[68px] bg-white p-2 border-4 border-slate-50 rounded-[2rem] cursor-pointer"
            />
          </div>
          <button type="submit" className="px-12 py-5 bg-blue-600 text-white font-black rounded-[2rem] hover:bg-blue-700 transition flex items-center gap-3 shadow-2xl shadow-blue-200 active:scale-95 h-[68px]">
            <Plus size={32} strokeWidth={3} /> Register
          </button>
        </form>

        {/* Icon Picker */}
        <div className="w-full mb-12">
          <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1 mb-3 block">Category Icon</label>
          <div className="grid grid-cols-8 md:grid-cols-12 gap-3 p-4 bg-slate-50 border-4 border-slate-50 rounded-[2rem] h-48 overflow-y-auto custom-scrollbar">
            {Object.entries(AVAILABLE_ICONS).map(([name, IconComponent]) => (
              <button
                key={name}
                type="button"
                onClick={() => setNewCategoryIcon(name)}
                className={`flex items-center justify-center p-3 rounded-2xl border-2 transition-all ${newCategoryIcon === name ? 'border-blue-500 bg-white text-blue-600 shadow-md shadow-blue-100 scale-110 z-10' : 'border-transparent text-slate-400 hover:bg-white hover:shadow-sm'}`}
                title={name}
              >
                <IconComponent size={22} strokeWidth={newCategoryIcon === name ? 3 : 2} />
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-5">
          {categories.map(cat => {
            const IconComponent = AVAILABLE_ICONS[cat.icon] || AVAILABLE_ICONS["Circle"];
            return (
              <div key={cat.name} className="flex items-center gap-4 px-6 py-4 bg-white rounded-2xl border-2 border-slate-100 text-lg font-black shadow-sm transition-all hover:border-blue-500 hover:shadow-xl group relative">
                <div className="relative group/picker">
                  <input 
                    type="color" 
                    value={cat.color} 
                    onChange={(e) => updateCategoryColor(cat.name, e.target.value)}
                    className="w-8 h-8 rounded-full border-none cursor-pointer bg-transparent appearance-none shadow-sm"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="absolute inset-0 rounded-full border border-black/5 pointer-events-none" />
                </div>
                <IconComponent size={20} className="text-slate-400" />
                <span className="text-slate-800 uppercase tracking-tighter">{cat.name}</span>
                <button onClick={() => removeCategory(cat.name)} className="text-slate-200 hover:text-red-500 transition-colors ml-4 opacity-0 group-hover:opacity-100 p-1">
                  <X size={24} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex font-sans text-slate-900 relative overflow-x-hidden selection:bg-blue-100 selection:text-blue-900">
      
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-md z-40 md:hidden" onClick={() => setIsSidebarOpen(false)}></div>
      )}

      <aside className={`fixed md:relative inset-y-0 left-0 z-50 bg-slate-900 text-slate-400 shadow-2xl border-r border-slate-800 flex-shrink-0 transition-all duration-500 transform ${isSidebarOpen ? 'translate-x-0 w-80' : '-translate-x-full md:translate-x-0 md:w-0 overflow-hidden'}`}>
        <div className="flex flex-col h-full w-80">
          <div className="p-10 flex justify-between items-center">
            <AppLogo />
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden p-3 hover:bg-slate-800 rounded-2xl text-slate-400"><X size={28} /></button>
          </div>
          
          <nav className="px-6 space-y-4 mt-12 flex-1">
            <button onClick={() => setActiveTab('monthly')} className={`flex items-center justify-between w-full px-6 py-5 rounded-[1.5rem] text-[15px] font-black transition-all ${activeTab === 'monthly' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 scale-[1.02]' : 'hover:bg-slate-800 hover:text-white'}`}>
              <div className="flex items-center gap-4"><Calendar size={24} /><span>Daily Tracking</span></div><ChevronRight size={20} />
            </button>
            <button onClick={() => setActiveTab('scenarios')} className={`flex items-center justify-between w-full px-6 py-5 rounded-[1.5rem] text-[15px] font-black transition-all ${activeTab === 'scenarios' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 scale-[1.02]' : 'hover:bg-slate-800 hover:text-white'}`}>
              <div className="flex items-center gap-4"><TrendingUp size={24} /><span>Salary Scenarios</span></div><ChevronRight size={20} />
            </button>
            <button onClick={() => setActiveTab('settings')} className={`flex items-center justify-between w-full px-6 py-5 rounded-[1.5rem] text-[15px] font-black transition-all ${activeTab === 'settings' ? 'bg-blue-600 text-white shadow-2xl shadow-blue-600/30 scale-[1.02]' : 'hover:bg-slate-800 hover:text-white'}`}>
              <div className="flex items-center gap-4"><Settings size={24} /><span>Configuration</span></div><ChevronRight size={20} />
            </button>
          </nav>
          <div className="p-8 mt-auto">
             <button onClick={() => setIsSidebarOpen(false)} className="hidden md:flex items-center gap-4 w-full px-6 py-4 rounded-2xl text-xs font-black text-slate-500 hover:text-white hover:bg-slate-800 transition-all uppercase tracking-[0.2em]"><ArrowUp size={16} className="-rotate-90" />Fold</button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0 h-screen">
        <header className="h-24 flex items-center justify-between px-6 md:px-12 bg-white border-b border-slate-200 sticky top-0 z-30 flex-shrink-0">
          <div className="flex items-center gap-6 flex-1 min-w-[150px]">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-3 -ml-3 hover:bg-slate-50 rounded-2xl text-slate-900 transition-colors z-40">
              <Menu size={28} strokeWidth={3} />
            </button>
            <div className="flex flex-col">
              <select value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} className="text-3xl font-black text-slate-900 bg-transparent border-none p-0 focus:ring-0 cursor-pointer hover:text-blue-600 transition-colors tracking-tighter appearance-none">
                {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] leading-none mt-1">Month</span>
            </div>
          </div>

          {activeTab === 'monthly' && (
            <div className="hidden lg:flex items-center justify-center gap-8 flex-[4]">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Banknote size={18}/></div>
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5 tracking-widest leading-none">Income</p>
                   <div className="flex items-center">
                     <span className="text-base font-black text-slate-900">€</span>
                     <input 
                       type="number"
                       value={currentMonthData.income}
                       onChange={(e) => updateMonthlyData({ income: parseFloat(e.target.value) || 0 })}
                       className="text-base font-black text-slate-900 bg-transparent border-none p-0 focus:ring-0 w-24"
                     />
                   </div>
                </div>
              </div>
              <div className="w-px h-6 bg-slate-100" />
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Flame size={18}/></div>
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5 tracking-widest leading-none">Burn</p>
                   <p className="text-base font-black text-rose-600">€{totalMonthlyBurn.toLocaleString()}</p>
                </div>
              </div>
              <div className="w-px h-6 bg-slate-100" />
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><ShieldCheck size={18}/></div>
                <div>
                   <p className="text-[8px] font-black text-slate-400 uppercase mb-0.5 tracking-widest leading-none">Safe Spend</p>
                   <p className={`text-base font-black ${safeToSpend >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>€{safeToSpend.toLocaleString()}</p>
                </div>
              </div>
            </div>
          )}

          <div className="flex-1 flex justify-end min-w-[150px]">
             <div className="bg-slate-900 rounded-[1.2rem] p-2 pl-4 flex items-center gap-3 border border-slate-800 shadow-xl group cursor-help" title="Cumulative Savings account (Recurring Deposits - Variable Spending)">
                <div className="flex flex-col items-end">
                   <p className="text-[8px] font-black text-amber-500 uppercase tracking-widest leading-none mb-1">Savings</p>
                   <p className="text-lg font-black text-white tracking-tighter leading-none">€{totalSavingsAccount.toLocaleString()}</p>
                </div>
                <div className="p-2.5 bg-amber-500 text-white rounded-xl shadow-lg shadow-amber-500/20">
                   <PiggyBank size={18} />
                </div>
             </div>
          </div>
        </header>

        <main className="flex-1 p-8 md:p-14 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            {activeTab === 'monthly' && renderMonthView()}
            {activeTab === 'scenarios' && renderIncomeScenarios()}
            {activeTab === 'settings' && renderSettings()}
          </div>
        </main>
      </div>
    </div>
  );
}


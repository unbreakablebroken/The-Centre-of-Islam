import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calculator, 
  Coins, 
  HelpCircle, 
  Info, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  Wallet, 
  Scale, 
  ShieldCheck,
  ChevronDown,
  ChevronUp,
  Sparkles,
  TrendingDown,
  ArrowRight,
  Receipt
} from 'lucide-react';

export interface CurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  defaultGoldPerGram: number;
  defaultSilverPerGram: number;
}

export const SUPPORTED_CURRENCIES: CurrencyConfig[] = [
  { code: 'INR', name: 'Indian Rupee', symbol: '₹', defaultGoldPerGram: 7200, defaultSilverPerGram: 88 },
  { code: 'USD', name: 'US Dollar', symbol: '$', defaultGoldPerGram: 85, defaultSilverPerGram: 1.05 },
  { code: 'GBP', name: 'British Pound', symbol: '£', defaultGoldPerGram: 65, defaultSilverPerGram: 0.82 },
  { code: 'EUR', name: 'Euro', symbol: '€', defaultGoldPerGram: 78, defaultSilverPerGram: 0.95 },
  { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ', defaultGoldPerGram: 312, defaultSilverPerGram: 3.85 },
  { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼', defaultGoldPerGram: 318, defaultSilverPerGram: 3.93 },
  { code: 'PKR', name: 'Pakistani Rupee', symbol: '₨', defaultGoldPerGram: 23800, defaultSilverPerGram: 295 },
  { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳', defaultGoldPerGram: 10200, defaultSilverPerGram: 125 },
  { code: 'MYR', name: 'Malaysian Ringgit', symbol: 'RM', defaultGoldPerGram: 375, defaultSilverPerGram: 4.60 },
  { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp', defaultGoldPerGram: 1320000, defaultSilverPerGram: 16500 },
  { code: 'TRY', name: 'Turkish Lira', symbol: '₺', defaultGoldPerGram: 2900, defaultSilverPerGram: 35 },
  { code: 'ZAR', name: 'South African Rand', symbol: 'R', defaultGoldPerGram: 1540, defaultSilverPerGram: 19 },
  { code: 'NGN', name: 'Nigerian Naira', symbol: '₦', defaultGoldPerGram: 135000, defaultSilverPerGram: 1680 },
  { code: 'EGP', name: 'Egyptian Pound', symbol: 'E£', defaultGoldPerGram: 4150, defaultSilverPerGram: 52 },
];

export const ZakatCalculatorPage: React.FC = () => {
  // --- Currency Selector with Persistence ---
  const [selectedCurrencyCode, setSelectedCurrencyCode] = useState<string>(() => {
    try {
      const saved = localStorage.getItem('coi_zakat_currency');
      if (saved && SUPPORTED_CURRENCIES.some(c => c.code === saved)) {
        return saved;
      }
    } catch {
      // ignore
    }
    return 'USD';
  });

  const currency = useMemo(() => {
    return SUPPORTED_CURRENCIES.find(c => c.code === selectedCurrencyCode) || SUPPORTED_CURRENCIES[1]; // fallback USD
  }, [selectedCurrencyCode]);

  const handleCurrencyChange = (newCode: string) => {
    setSelectedCurrencyCode(newCode);
    try {
      localStorage.setItem('coi_zakat_currency', newCode);
    } catch {
      // ignore
    }
  };

  // --- SECTION 1: Assets (Zakatable Wealth) State ---
  const [goldSilverVal, setGoldSilverVal] = useState<string>('');
  const [cashAtHome, setCashAtHome] = useState<string>('');
  const [cashAtBank, setCashAtBank] = useState<string>('');
  const [investmentsShares, setInvestmentsShares] = useState<string>('');
  const [businessGoods, setBusinessGoods] = useState<string>('');
  const [moneyOwed, setMoneyOwed] = useState<string>('');
  const [rentalDeposits, setRentalDeposits] = useState<string>('');
  const [providentFund, setProvidentFund] = useState<string>('');
  const [dividendIncome, setDividendIncome] = useState<string>('');

  // --- SECTION 2: Liabilities (Deductions) ---
  const [debtsDueWithinYear, setDebtsDueWithinYear] = useState<string>('');

  // --- SECTION 3: Property / Land (Optional) ---
  const [ownsPropertyForResale, setOwnsPropertyForResale] = useState<boolean>(false);
  const [propertyMarketValue, setPropertyMarketValue] = useState<string>('');

  // --- SECTION 4: Nisab Standard ---
  // Default to Silver standard as widely recommended by majority of contemporary scholars for broader beneficiary reach
  const [nisabStandard, setNisabStandard] = useState<'gold' | 'silver'>('silver');
  const [customMetalPrice, setCustomMetalPrice] = useState<string>('');

  // When currency or standard changes, initialize suggested metal price if field is empty or matching default
  useEffect(() => {
    const defaultVal = nisabStandard === 'gold' ? currency.defaultGoldPerGram : currency.defaultSilverPerGram;
    setCustomMetalPrice(defaultVal.toString());
  }, [currency, nisabStandard]);

  // Expandable formula breakdown
  const [showFormulaBreakdown, setShowFormulaBreakdown] = useState<boolean>(false);

  // Helper to parse numbers safely
  const parseAmount = (val: string): number => {
    if (!val) return 0;
    const clean = val.replace(/,/g, '').trim();
    const num = parseFloat(clean);
    return isNaN(num) || num < 0 ? 0 : num;
  };

  // --- Calculation Rules (Exact Requirements) ---
  // STEP 1: Calculate Total Assets
  // Total Assets = Gold & Silver + Cash at Home + Cash at Bank + Investments & Shares + Business Goods & Property
  // + Money Owed to You + Rental Deposits + Provident Fund + Dividend Income (+ Property Market Value if checked)
  const totalBaseAssets = useMemo(() => {
    return (
      parseAmount(goldSilverVal) +
      parseAmount(cashAtHome) +
      parseAmount(cashAtBank) +
      parseAmount(investmentsShares) +
      parseAmount(businessGoods) +
      parseAmount(moneyOwed) +
      parseAmount(rentalDeposits) +
      parseAmount(providentFund) +
      parseAmount(dividendIncome)
    );
  }, [
    goldSilverVal,
    cashAtHome,
    cashAtBank,
    investmentsShares,
    businessGoods,
    moneyOwed,
    rentalDeposits,
    providentFund,
    dividendIncome
  ]);

  const propertyAddon = ownsPropertyForResale ? parseAmount(propertyMarketValue) : 0;
  const totalAssets = totalBaseAssets + propertyAddon;

  // STEP 2: Calculate Total Deductions
  // Total Deductions = Only "Debts due within the current year"
  const totalDeductions = parseAmount(debtsDueWithinYear);

  // STEP 3: Calculate Net Zakatable Wealth
  // Net Wealth = Total Assets - Total Deductions (If negative, treat as 0)
  const rawNetWealth = totalAssets - totalDeductions;
  const netZakatableWealth = rawNetWealth > 0 ? rawNetWealth : 0;

  // STEP 4: Calculate Nisab Threshold
  // If Gold selected: Nisab = 87.48 × gold price per gram
  // If Silver selected: Nisab = 612.36 × silver price per gram
  const metalPricePerGram = parseAmount(customMetalPrice);
  const nisabGrams = nisabStandard === 'gold' ? 87.48 : 612.36;
  const nisabThreshold = nisabGrams * metalPricePerGram;

  // STEP 5: Determine Zakat Status
  // If Net Wealth >= Nisab: Zakat is due; If Net Wealth < Nisab: No Zakat is due
  const isZakatDue = netZakatableWealth > 0 && nisabThreshold > 0 && netZakatableWealth >= nisabThreshold;

  // STEP 6: Calculate Zakat Amount
  // Zakat Due = Net Wealth × 0.025 (which is 2.5%)
  const zakatAmountDue = isZakatDue ? netZakatableWealth * 0.025 : 0;

  // Formatter for Currency
  const formatCurrency = (amount: number): string => {
    return `${currency.symbol} ${amount.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    })}`;
  };

  const handleReset = () => {
    setGoldSilverVal('');
    setCashAtHome('');
    setCashAtBank('');
    setInvestmentsShares('');
    setBusinessGoods('');
    setMoneyOwed('');
    setRentalDeposits('');
    setProvidentFund('');
    setDividendIncome('');
    setDebtsDueWithinYear('');
    setOwnsPropertyForResale(false);
    setPropertyMarketValue('');
    const defaultVal = nisabStandard === 'gold' ? currency.defaultGoldPerGram : currency.defaultSilverPerGram;
    setCustomMetalPrice(defaultVal.toString());
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white rounded-3xl p-6 sm:p-10 shadow-lg border border-emerald-900/40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#d4af37]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f3e5ab] text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
              <span>Third Pillar of Islam • الزكاة</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
              Zakat Calculator
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              Calculate your annual Zakat on wealth — based on Quran and Sunnah
            </p>
            <p className="text-xs text-[#d4af37] italic font-serif pt-1">
              "Take from their wealth a charity by which you purify them and cause them increase..." — Surah At-Tawbah (9:103)
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold backdrop-blur-sm border border-white/15 transition-all cursor-pointer shadow-xs active:scale-95"
              title="Reset all fields"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Values</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 0 — Currency Selector */}
      <div className="bg-white rounded-2xl p-5 sm:p-6 border border-stone-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-stone-900">Select Calculation Currency</h2>
            <p className="text-xs text-stone-500">
              All asset fields, liabilities, and Nisab thresholds will calculate in this currency.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <select
            id="currency-selector"
            value={selectedCurrencyCode}
            onChange={(e) => handleCurrencyChange(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 bg-stone-50 border-2 border-emerald-700/40 rounded-xl text-sm font-bold text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 cursor-pointer shadow-2xs"
          >
            {SUPPORTED_CURRENCIES.map((curr) => (
              <option key={curr.code} value={curr.code}>
                {curr.code} ({curr.symbol}) — {curr.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Inputs (Sections 1, 2, 3, 4) */}
        <div className="lg:col-span-7 space-y-6">

          {/* SECTION 1 — Assets (Zakatable Wealth) */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center font-bold">
                  1
                </div>
                <div>
                  <h2 className="text-base font-bold text-stone-900">Assets (Zakatable Wealth)</h2>
                  <p className="text-xs text-stone-500">Wealth in your possession held for 1 lunar year (Hawl)</p>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                {currency.symbol} {currency.code}
              </span>
            </div>

            <div className="space-y-3 pt-1">
              {/* 1. Value of Gold & Silver */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  1. Value of Gold & Silver
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={goldSilverVal}
                    onChange={(e) => setGoldSilverVal(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">
                  Jewelry (if held as investment/savings or per Hanafi school), coins, bars, and bullion.
                </p>
              </div>

              {/* 2. Cash at Home */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  2. Cash at Home
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={cashAtHome}
                    onChange={(e) => setCashAtHome(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Physical currency notes and coins kept in safes or lockers.</p>
              </div>

              {/* 3. Cash at Bank Accounts */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  3. Cash at Bank Accounts
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={cashAtBank}
                    onChange={(e) => setCashAtBank(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Checking, savings, current, and fixed deposit accounts.</p>
              </div>

              {/* 4. Investments & Shares */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  4. Investments & Shares
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={investmentsShares}
                    onChange={(e) => setInvestmentsShares(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Stocks, mutual funds, unit trusts, and trading portfolio value.</p>
              </div>

              {/* 5. Business Goods & Property */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  5. Business Goods & Property
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={businessGoods}
                    onChange={(e) => setBusinessGoods(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Wholesale / retail merchandise held for sale (inventory at current market price).</p>
              </div>

              {/* 6. Money Owed to You / Receivables */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  6. Money Owed to You / Receivables
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={moneyOwed}
                    onChange={(e) => setMoneyOwed(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Strong debts expected to be repaid by reliable debtors.</p>
              </div>

              {/* 7. Rental / Refundable Deposits */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  7. Rental / Refundable Deposits
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={rentalDeposits}
                    onChange={(e) => setRentalDeposits(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Security deposits with landlords or utilities that will be refunded to you.</p>
              </div>

              {/* 8. Provident Fund / Pension / Insurance */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  8. Provident Fund / Pension / Insurance
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={providentFund}
                    onChange={(e) => setProvidentFund(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Accessible / withdrawable portion of retirement or provident funds.</p>
              </div>

              {/* 9. Dividend Income */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  9. Dividend Income
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={dividendIncome}
                    onChange={(e) => setDividendIncome(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <p className="text-[11px] text-stone-400 mt-1">Payouts and accumulated profit shares from equity and partnerships.</p>
              </div>
            </div>
          </div>

          {/* SECTION 2 — Liabilities (Deductions) */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
                2
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Liabilities (Deductions)</h2>
                <p className="text-xs text-stone-500">Immediate and short-term debt obligations</p>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                10. Debts due within the current year
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                  {currency.symbol}
                </span>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="0.00"
                  value={debtsDueWithinYear}
                  onChange={(e) => setDebtsDueWithinYear(e.target.value)}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                />
              </div>
              <div className="mt-2 p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  <strong>Note:</strong> Only enter debts due now — credit card balances, unpaid rent, immediate utility bills, or installments due within the current lunar year. <strong>Do NOT enter full balance of long-term loans</strong> (such as a 20-year mortgage or future car loan principals).
                </p>
              </div>
            </div>
          </div>

          {/* SECTION 3 — Property / Land (Optional) */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#2d6a4f]/10 text-[#2d6a4f] flex items-center justify-center font-bold">
                3
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Property / Land (Optional)</h2>
                <p className="text-xs text-stone-500">Real estate rules based on ownership intention</p>
              </div>
            </div>

            <div className="space-y-3">
              <label className="flex items-start gap-3 p-3 bg-stone-50 hover:bg-stone-100/70 border border-stone-200 rounded-xl cursor-pointer transition-colors">
                <input
                  type="checkbox"
                  checked={ownsPropertyForResale}
                  onChange={(e) => setOwnsPropertyForResale(e.target.checked)}
                  className="mt-0.5 w-4 h-4 text-emerald-800 rounded focus:ring-emerald-700 border-stone-300 cursor-pointer"
                />
                <div>
                  <span className="text-xs sm:text-sm font-bold text-stone-900 block">
                    I own property or land held for resale / trading
                  </span>
                  <span className="text-xs text-stone-500 block mt-0.5">
                    Acquired with the primary intention of selling for a commercial profit (Urud at-Tijarah).
                  </span>
                </div>
              </label>

              {ownsPropertyForResale ? (
                <div className="p-3.5 bg-emerald-50/50 border border-emerald-200 rounded-xl space-y-1.5 animate-fadeIn">
                  <label className="block text-xs font-bold text-stone-800">
                    Market value of property / land
                  </label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                      {currency.symbol}
                    </span>
                    <input
                      type="number"
                      min="0"
                      step="any"
                      placeholder="0.00"
                      value={propertyMarketValue}
                      onChange={(e) => setPropertyMarketValue(e.target.value)}
                      className="w-full pl-9 pr-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                    />
                  </div>
                  <p className="text-[11px] text-emerald-900/80">
                    This market value will be added to your Total Assets.
                  </p>
                </div>
              ) : (
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-600 flex items-start gap-2">
                  <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    Personal property (your primary family home, personal vehicle, daily furniture) is <strong>not zakatable on its capital value</strong>. For rental properties, Zakat is only due on the net rental cash saved over the year, not the building's market value.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* SECTION 4 — Nisab Standard */}
          <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
              <div className="w-8 h-8 rounded-lg bg-[#d4af37]/20 text-amber-900 flex items-center justify-center font-bold">
                4
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Nisab Standard (النصاب)</h2>
                <p className="text-xs text-stone-500">The minimum qualifying threshold of wealth before Zakat is due</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Toggle: Gold vs Silver */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Choose Nisab Basis:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setNisabStandard('silver')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      nisabStandard === 'silver'
                        ? 'bg-emerald-50 border-emerald-700 text-emerald-950 ring-1 ring-emerald-700 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wide">Silver Nisab</span>
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                        Recommended
                      </span>
                    </div>
                    <div className="text-sm font-bold mt-1">612.36 grams</div>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                      Majority of contemporary scholars recommend silver as it benefits more poor beneficiaries.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setNisabStandard('gold')}
                    className={`p-3 rounded-xl border text-left transition-all cursor-pointer ${
                      nisabStandard === 'gold'
                        ? 'bg-emerald-50 border-emerald-700 text-emerald-950 ring-1 ring-emerald-700 shadow-xs'
                        : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold uppercase tracking-wide">Gold Nisab</span>
                      <Coins className="w-3.5 h-3.5 text-amber-600" />
                    </div>
                    <div className="text-sm font-bold mt-1">87.48 grams</div>
                    <p className="text-[10px] text-stone-500 mt-0.5 leading-snug">
                      Equivalent to 20 Mithqals (classical Dinar weight) for gold-based wealth.
                    </p>
                  </button>
                </div>
              </div>

              {/* Input: Price per gram in selected currency */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-stone-700">
                    Current {nisabStandard === 'gold' ? 'Gold' : 'Silver'} Price per Gram ({currency.code})
                  </label>
                  <span className="text-[11px] text-stone-400">
                    {nisabStandard === 'gold' ? '87.48g' : '612.36g'} standard
                  </span>
                </div>

                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-stone-500 pointer-events-none">
                    {currency.symbol}
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="0.00"
                    value={customMetalPrice}
                    onChange={(e) => setCustomMetalPrice(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-700"
                  />
                </div>
                <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1.5">
                  <span>
                    Calculated Nisab Threshold: <strong>{formatCurrency(nisabThreshold)}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      const def = nisabStandard === 'gold' ? currency.defaultGoldPerGram : currency.defaultSilverPerGram;
                      setCustomMetalPrice(def.toString());
                    }}
                    className="text-emerald-800 hover:underline font-semibold cursor-pointer"
                  >
                    Reset to default price
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: SECTION 5 — Results Card (Sticky on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-6">
          <div className="bg-white rounded-3xl border-2 border-emerald-900/20 shadow-xl overflow-hidden">
            {/* Results Header */}
            <div className="bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] p-6 text-white text-center relative">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-[#d4af37]/20 border border-[#d4af37]/40 flex items-center justify-center text-[#d4af37] mb-2 shadow-xs">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-extrabold uppercase tracking-wider text-[#f3e5ab]">
                Zakat Assessment
              </h3>
              <p className="text-xs text-emerald-100/80 mt-0.5">
                Calculated strictly per Classical Fiqh guidelines (2.5%)
              </p>
            </div>

            {/* Results Body */}
            <div className="p-6 space-y-5">
              {/* Status Badge */}
              <div
                className={`p-4 rounded-2xl border text-center transition-all ${
                  isZakatDue
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-stone-50 border-stone-200 text-stone-700'
                }`}
              >
                <div className="flex items-center justify-center gap-2 mb-1">
                  {isZakatDue ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-700" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-stone-400" />
                  )}
                  <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                    Assessment Status
                  </span>
                </div>
                <div className="text-base sm:text-lg font-extrabold">
                  {isZakatDue ? (
                    <span className="text-emerald-900">Zakat is due</span>
                  ) : (
                    <span className="text-stone-700">No Zakat — below Nisab</span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mt-1">
                  {isZakatDue
                    ? 'Your net zakatable wealth meets or exceeds the Nisab threshold.'
                    : netZakatableWealth === 0 && totalAssets === 0
                    ? 'Enter your asset details above to calculate your annual Zakat.'
                    : 'Your net wealth is below the Nisab threshold. No Zakat is obligated.'}
                </p>
              </div>

              {/* Breakdown List */}
              <div className="space-y-3 text-sm divide-y divide-stone-100">
                <div className="flex items-center justify-between pt-1">
                  <span className="text-stone-600 flex items-center gap-1.5 text-xs">
                    <Wallet className="w-3.5 h-3.5 text-emerald-700" />
                    Total Assets:
                  </span>
                  <span className="font-bold text-stone-900">{formatCurrency(totalAssets)}</span>
                </div>

                <div className="flex items-center justify-between pt-2.5">
                  <span className="text-stone-600 flex items-center gap-1.5 text-xs">
                    <TrendingDown className="w-3.5 h-3.5 text-rose-600" />
                    Total Deductions:
                  </span>
                  <span className="font-bold text-rose-700">
                    - {formatCurrency(totalDeductions)}
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2.5">
                  <span className="text-stone-700 font-bold text-xs">
                    Net Zakatable Wealth:
                  </span>
                  <span className="font-extrabold text-stone-900">{formatCurrency(netZakatableWealth)}</span>
                </div>

                <div className="flex items-center justify-between pt-2.5">
                  <span className="text-stone-500 text-xs">
                    Nisab Threshold ({nisabStandard}):
                  </span>
                  <span className="font-semibold text-stone-600">{formatCurrency(nisabThreshold)}</span>
                </div>
              </div>

              {/* Highlighted Zakat Due Box */}
              <div className="p-5 rounded-2xl bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white text-center shadow-md relative overflow-hidden border border-[#d4af37]/40">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#d4af37]/15 rounded-full blur-xl pointer-events-none"></div>
                <span className="text-xs uppercase font-extrabold tracking-widest text-[#f3e5ab] block mb-1">
                  Total Zakat Due (2.5%)
                </span>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {formatCurrency(zakatAmountDue)}
                </div>
                <span className="text-[11px] text-emerald-200/90 block mt-1">
                  {isZakatDue
                    ? `Payable to the 8 eligible Quranic categories (As-Sadaqat)`
                    : `No payment required at this time`}
                </span>
              </div>

              {/* Expandable Breakdown Button */}
              <button
                type="button"
                onClick={() => setShowFormulaBreakdown(!showFormulaBreakdown)}
                className="w-full py-2.5 px-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <HelpCircle className="w-3.5 h-3.5 text-[#2d6a4f]" />
                <span>How this is calculated</span>
                {showFormulaBreakdown ? (
                  <ChevronUp className="w-3.5 h-3.5" />
                ) : (
                  <ChevronDown className="w-3.5 h-3.5" />
                )}
              </button>

              {/* Formula Breakdown Panel */}
              {showFormulaBreakdown && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-stone-200 text-xs text-stone-700 space-y-2.5 animate-fadeIn">
                  <div className="font-bold text-stone-900 border-b border-stone-200 pb-1.5">
                    Plain-English Calculation Formulas:
                  </div>
                  <ul className="space-y-1.5 leading-relaxed text-[11px] text-stone-600">
                    <li>
                      <strong>1. Total Assets:</strong> Sum of all gold, cash, savings, stock investments, business merchandise, receivables, and optional resale property.
                    </li>
                    <li>
                      <strong>2. Total Deductions:</strong> Only immediate debts due within the current lunar year (long-term balances are not deducted).
                    </li>
                    <li>
                      <strong>3. Net Zakatable Wealth:</strong> Total Assets minus Deductions. (If negative, zero).
                    </li>
                    <li>
                      <strong>4. Nisab Threshold:</strong> {nisabStandard === 'gold' ? '87.48 grams × Gold price' : '612.36 grams × Silver price'}.
                    </li>
                    <li>
                      <strong>5. Zakat Obligation:</strong> If Net Wealth ≥ Nisab, Zakat is due; otherwise 0.
                    </li>
                    <li>
                      <strong>6. Rate:</strong> Net Wealth × 2.5% (1/40th of surplus wealth).
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </div>

          {/* Quick Fiqh Insight Card */}
          <div className="bg-amber-50/60 rounded-2xl p-4 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
            <div className="flex items-center gap-2 font-bold text-amber-900">
              <ShieldCheck className="w-4 h-4 text-amber-700" />
              <span>Who Receives Zakat? (Surah At-Tawbah 9:60)</span>
            </div>
            <p className="text-[11px] text-amber-900/85 leading-relaxed">
              Zakat is exclusively for the 8 categories decreed by Allah: the poor (Al-Fuqara), the needy (Al-Masakin), administrators of Zakat, those whose hearts are reconciled, freeing captives/slaves, those in crippling debt (Al-Gharimin), in the cause of Allah, and the stranded wayfarer.
            </p>
          </div>
        </div>
      </div>

      {/* Visible Disclaimer at Bottom */}
      <div className="p-4 rounded-2xl bg-stone-100/90 border border-stone-200/80 text-xs text-stone-600 text-center leading-relaxed">
        <p>
          <strong>Disclaimer:</strong> This calculator provides an estimate only. Zakat rules can vary based on your situation and madhab. Consult a qualified scholar for complex cases.
        </p>
      </div>
    </div>
  );
};

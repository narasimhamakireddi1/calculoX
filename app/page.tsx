'use client';

import { useState, useMemo, useRef, useEffect, type CSSProperties } from 'react';
import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import {
  IndianRupee, Heart, Wrench, ArrowLeftRight,
  Zap, ShieldCheck, Smartphone, Lock, Scale,
  Landmark, ReceiptText, Target,
} from 'lucide-react';
import { CalculatorCard } from "@/components/ui/CalculatorCard";
import { CalculatorSearch } from "@/components/ui/CalculatorSearch";
import { CategoryTabs, type CalculatorCategory } from "@/components/ui/CategoryTabs";
import { getActiveCalculators } from "@/config/calculators.config";

// ── Helpers ───────────────────────────────────────────────────────────────────
function formatINR(n: number): string {
  if (n >= 10_000_000) return `₹${(n / 10_000_000).toFixed(1)}Cr`;
  if (n >= 100_000)    return `₹${(n / 100_000).toFixed(1)}L`;
  return `₹${Math.round(n).toLocaleString('en-IN')}`;
}

function formatNum(n: number, dec = 2): string {
  if (n >= 10_000_000) return `${(n / 10_000_000).toFixed(dec)}Cr`;
  if (n >= 100_000)    return `${(n / 100_000).toFixed(dec)}L`;
  if (n >= 1_000)      return n.toLocaleString('en-IN', { maximumFractionDigits: dec });
  return n.toFixed(dec);
}

// ── Calc functions ─────────────────────────────────────────────────────────────
function calcEMI(principal: number, annualRate: number, years: number) {
  const n = years * 12;
  const r = annualRate / 12 / 100;
  if (r === 0) return { emi: principal / n, totalInterest: 0, totalAmount: principal };
  const pow = Math.pow(1 + r, n);
  const emi = (principal * r * pow) / (pow - 1);
  const totalAmount = emi * n;
  return { emi, totalInterest: totalAmount - principal, totalAmount };
}

function calcSIP(monthly: number, annualReturn: number, years: number) {
  const n = years * 12;
  const r = annualReturn / 12 / 100;
  if (r === 0) return { corpus: monthly * n, invested: monthly * n, returns: 0 };
  const corpus = monthly * ((Math.pow(1 + r, n) - 1) / r) * (1 + r);
  const invested = monthly * n;
  return { corpus, invested, returns: corpus - invested };
}

function calcFD(principal: number, annualRate: number, years: number) {
  const maturity = principal * Math.pow(1 + annualRate / 400, 4 * years);
  return { maturity, interest: maturity - principal };
}

function calcBMI(weight: number, heightCm: number) {
  const h = heightCm / 100;
  const bmi = weight / (h * h);
  if (bmi < 18.5) return { bmi, category: 'Underweight', color: 'text-amber-500',   bg: 'bg-amber-50 dark:bg-amber-900/20'     };
  if (bmi < 25)   return { bmi, category: 'Normal',      color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' };
  if (bmi < 30)   return { bmi, category: 'Overweight',  color: 'text-orange-500',  bg: 'bg-orange-50 dark:bg-orange-900/20'   };
  return            { bmi, category: 'Obese',       color: 'text-red-600',    bg: 'bg-red-50 dark:bg-red-900/20'         };
}

function calcRD(monthly: number, annualRate: number, years: number) {
  const n = years * 12;
  const r = annualRate / 12 / 100;
  if (r === 0) return { maturity: monthly * n, invested: monthly * n, returns: 0 };
  const maturity = monthly * ((Math.pow(1 + r, n) - 1) / r);
  const invested = monthly * n;
  return { maturity, invested, returns: maturity - invested };
}

function calcTax(annualIncome: number) {
  const taxable = Math.max(0, annualIncome - 75_000); // ₹75K standard deduction
  let tax = 0;
  if      (taxable > 1_500_000) tax = 140_000 + (taxable - 1_500_000) * 0.30;
  else if (taxable > 1_200_000) tax = 80_000  + (taxable - 1_200_000) * 0.20;
  else if (taxable > 1_000_000) tax = 50_000  + (taxable - 1_000_000) * 0.15;
  else if (taxable > 700_000)   tax = 20_000  + (taxable - 700_000)   * 0.10;
  else if (taxable > 300_000)   tax = (taxable - 300_000) * 0.05;
  if (taxable <= 700_000) tax = 0; // Rebate u/s 87A
  const totalTax = Math.round(tax * 1.04); // 4% cess
  const effectiveRate = annualIncome > 0 ? (totalTax / annualIncome) * 100 : 0;
  return { totalTax, effectiveRate, monthlyTax: totalTax / 12 };
}

function calcGST(amount: number, rate: number) {
  const gst = amount * rate / 100;
  return { gst, total: amount + gst };
}

function calcPercentage(value: number, percent: number) {
  const result = (value * percent) / 100;
  return { result, remaining: value - result };
}

function calcCAGR(invested: number, currentValue: number, years: number) {
  if (invested <= 0 || years <= 0) return { cagr: 0, totalReturn: 0, gain: 0 };
  const ratio = Math.max(currentValue, 0.01) / invested;
  const cagr = (Math.pow(ratio, 1 / years) - 1) * 100;
  const gain = currentValue - invested;
  return { cagr, totalReturn: (gain / invested) * 100, gain };
}

function calcSI(principal: number, rate: number, years: number) {
  const interest = principal * rate * years / 100;
  return { interest, total: principal + interest };
}

function calcRetirement(monthlyExpenses: number, yearsToRetirement: number, returnRate: number) {
  const corpus = monthlyExpenses * 12 * 25; // 4% safe-withdrawal rule
  const n = yearsToRetirement * 12;
  const r = returnRate / 12 / 100;
  const sipNeeded = r === 0 ? corpus / n : corpus * r / (Math.pow(1 + r, n) - 1);
  return { corpus, sipNeeded };
}

function calcHomeLoan(propertyValue: number, downPct: number, rate: number) {
  const loanAmount = propertyValue * (1 - downPct / 100);
  const { emi, totalInterest } = calcEMI(loanAmount, rate, 20);
  return { emi, loanAmount, totalInterest };
}

function calcProfitMargin(costPrice: number, sellingPrice: number) {
  const profit = sellingPrice - costPrice;
  const margin = sellingPrice > 0 ? (profit / sellingPrice) * 100 : 0;
  const markup = costPrice > 0 ? (profit / costPrice) * 100 : 0;
  return { profit, margin, markup };
}

function calcScientific(num: number) {
  return {
    sqrt:   num >= 0 ? Math.sqrt(num) : 0,
    square: num * num,
    log10:  num > 0 ? Math.log10(num) : 0,
  };
}

// ── CountUp (scroll-triggered) ────────────────────────────────────────────────
function CountUp({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const started = useRef(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started.current) {
        started.current = true;
        const t0 = performance.now();
        const dur = 1500;
        const tick = (now: number) => {
          const p = Math.min((now - t0) / dur, 1);
          setCount(Math.round((1 - Math.pow(1 - p, 3)) * to));
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      }
    }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [to]);
  return <div ref={ref}>{count.toLocaleString('en-IN')}{suffix}</div>;
}

// ── Tab config ────────────────────────────────────────────────────────────────
type QuickTab =
  | 'emi' | 'sip' | 'fd' | 'bmi'
  | 'rd' | 'tax' | 'gst' | 'percentage'
  | 'cagr' | 'si' | 'retirement' | 'homeloan'
  | 'profitmargin' | 'scientific';

const TAB_META: Record<QuickTab, {
  label: string; dot: string; headerText: string;
  border: string; sliderAccent: string;
  btnGrad: string; btnShadow: string;
  cta: string; href: string;
}> = {
  emi: {
    label: 'EMI', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'See Full Amortization Schedule →', href: '/emi-calculator',
  },
  sip: {
    label: 'SIP', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'See Year-by-Year Projection →', href: '/sip-calculator',
  },
  fd: {
    label: 'FD', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'See Compound Growth Breakdown →', href: '/fd-calculator',
  },
  bmi: {
    label: 'BMI', dot: 'bg-rose-500', headerText: 'text-rose-600 dark:text-rose-400',
    border: 'border-rose-200 dark:border-rose-800/60', sliderAccent: 'accent-rose-500',
    btnGrad: 'from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-700',
    btnShadow: 'hover:shadow-rose-500/25',
    cta: 'See Detailed Health Analysis →', href: '/bmi-calculator',
  },
  rd: {
    label: 'RD', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'See Full RD Projection →', href: '/rd-calculator',
  },
  tax: {
    label: 'Tax', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'Calculate Full Income Tax →', href: '/tax-calculator',
  },
  gst: {
    label: 'GST', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'See Full GST Breakdown →', href: '/gst-calculator',
  },
  percentage: {
    label: 'PCT', dot: 'bg-violet-500', headerText: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800/60', sliderAccent: 'accent-violet-600',
    btnGrad: 'from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800',
    btnShadow: 'hover:shadow-violet-500/25',
    cta: 'Try All 6 Percentage Tracks →', href: '/percentage-calculator',
  },
  cagr: {
    label: 'CAGR', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'Analyse Year-by-Year CAGR →', href: '/cagr-calculator',
  },
  si: {
    label: 'SI', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'Compare SI vs Compound Interest →', href: '/simple-interest-calculator',
  },
  retirement: {
    label: 'Retire', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'See Full Retirement Roadmap →', href: '/retirement-calculator',
  },
  homeloan: {
    label: 'Home', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'Compare Buy vs Rent →', href: '/home-loan-vs-rent',
  },
  profitmargin: {
    label: 'Profit', dot: 'bg-blue-500', headerText: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800/60', sliderAccent: 'accent-blue-600',
    btnGrad: 'from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800',
    btnShadow: 'hover:shadow-blue-500/25',
    cta: 'See Full Profit Analysis →', href: '/profit-margin-calculator',
  },
  scientific: {
    label: 'Sci', dot: 'bg-violet-500', headerText: 'text-violet-600 dark:text-violet-400',
    border: 'border-violet-200 dark:border-violet-800/60', sliderAccent: 'accent-violet-600',
    btnGrad: 'from-violet-600 to-violet-700 hover:from-violet-700 hover:to-violet-800',
    btnShadow: 'hover:shadow-violet-500/25',
    cta: 'Open Full Scientific Calculator →', href: '/scientific-calculator',
  },
};

// ── Floating motifs ───────────────────────────────────────────────────────────
const MOTIFS: Array<{ text: string; style: CSSProperties }> = [
  { text: 'EMI = P×r×(1+r)ⁿ',  style: { top: '7%',    left: '2%',   transform: 'rotate(-8deg)' } },
  { text: '₹20,00,000',          style: { top: '13%',   right: '3%',  transform: 'rotate(6deg)'  } },
  { text: '8.5% p.a.',           style: { top: '60%',   left: '1%',   transform: 'rotate(-4deg)' } },
  { text: '÷ [(1+r)ⁿ−1]',       style: { bottom: '24%',right: '2%',  transform: 'rotate(10deg)' } },
  { text: '= ₹17,356/mo',        style: { top: '42%',   left: '0.5%', transform: 'rotate(-6deg)' } },
  { text: '20 Years',            style: { bottom: '9%', left: '7%',   transform: 'rotate(4deg)'  } },
];

// ── Sample results for calculator cards ───────────────────────────────────────
const SAMPLE_RESULTS: Record<string, string> = {
  '/emi-calculator':          '₹20L · 8.5% · 20Y → ₹17,356/mo',
  '/sip-calculator':          '₹10K/mo · 12% · 15Y → ₹50.4L corpus',
  '/fd-calculator':           '₹5L · 7% · 3Y → ₹6.2L maturity',
  '/bmi-calculator':          '70 kg · 170 cm → BMI 24.2 (Normal)',
  '/rd-calculator':           '₹5K/mo · 7% · 3Y → ₹2.0L maturity',
  '/tax-calculator':          '₹12L income · New Regime → ₹90,000 tax',
  '/gst-calculator':          '₹10,000 + 18% GST → ₹11,800 total',
  '/percentage-calculator':   '₹800 → ₹1,000 → 25% increase',
  '/cagr-calculator':         '₹1L → ₹2.5L · 5Y → 20.1% CAGR',
  '/simple-interest-calculator': '₹1L · 8% · 3Y → ₹24,000 interest',
  '/retirement-calculator':   '₹30K/mo · 25Y · 10% → ₹3.96Cr corpus',
  '/home-loan-vs-rent':       '₹80L · 9% · 25Y — break-even: Yr 9',
  '/profit-margin-calculator':'Cost ₹800 · MRP ₹1,200 → 33.3% margin',
  '/scientific-calculator':   '√144 = 12 · log₁₀(1000) = 3',
};

// ── Real Scenarios ────────────────────────────────────────────────────────────
const REAL_SCENARIOS = [
  {
    Icon: Landmark,
    tag: 'Home Loan · Mumbai',
    inputs: 'Loan ₹60L · 8.75% p.a. · 20 Years',
    result: '₹53,000', sub: 'Total Interest paid: ₹67.2L',
    cta: 'Run Your Numbers', href: '/emi-calculator',
    color: 'text-blue-600 dark:text-blue-400',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    border: 'border-blue-100 dark:border-blue-800/50',
    accent: 'from-blue-500 to-blue-600',
  },
  {
    Icon: ReceiptText,
    tag: 'Home Loan · Bengaluru',
    inputs: 'Loan ₹80L · 9.0% p.a. · 25 Years',
    result: '₹67,120', sub: 'vs renting ₹35K/mo — break-even: Yr 9',
    cta: 'Compare EMI vs Rent', href: '/home-loan-vs-rent',
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    border: 'border-violet-100 dark:border-violet-800/50',
    accent: 'from-violet-500 to-violet-600',
  },
  {
    Icon: Target,
    tag: 'Car Loan · Delhi',
    inputs: 'Loan ₹8L · 10.5% p.a. · 5 Years',
    result: '₹17,200', sub: 'Total Interest: ₹2.3L over 60 months',
    cta: 'Calculate Car EMI', href: '/emi-calculator',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    border: 'border-emerald-100 dark:border-emerald-800/50',
    accent: 'from-emerald-500 to-emerald-600',
  },
] as const;

const categoryConfig: Record<string, { label: string; Icon: LucideIcon }> = {
  finance:    { label: 'Finance',    Icon: IndianRupee },
  health:     { label: 'Health',     Icon: Heart },
  utility:    { label: 'Utility',    Icon: Wrench },
  conversion: { label: 'Conversion', Icon: ArrowLeftRight },
};

// ── Reusable slider row ───────────────────────────────────────────────────────
function SliderRow({
  label, value, display, min, max, step, accent, onChange, minLabel, maxLabel,
}: {
  label: string; value: number; display: string;
  min: number; max: number; step: number;
  accent: string; onChange: (v: number) => void;
  minLabel: string; maxLabel: string;
}) {
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">{label}</label>
        <span className="text-sm font-bold text-gray-800 dark:text-gray-200">{display}</span>
      </div>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(+e.target.value)}
        className={`w-full h-2 rounded-full ${accent} cursor-pointer`}
      />
      <div className="flex justify-between text-[11px] text-gray-400 mt-1">
        <span>{minLabel}</span><span>{maxLabel}</span>
      </div>
    </div>
  );
}

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<CalculatorCategory | null>(null);
  const [activeTab, setActiveTab] = useState<QuickTab>('emi');

  // ── Per-tab state ──────────────────────────────────────────────────────────
  const [emiPrincipal, setEmiPrincipal] = useState(2_000_000);
  const [emiRate,      setEmiRate]      = useState(8.5);
  const [emiYears,     setEmiYears]     = useState(20);

  const [sipMonthly, setSipMonthly] = useState(10_000);
  const [sipReturn,  setSipReturn]  = useState(12);
  const [sipYears,   setSipYears]   = useState(15);

  const [fdPrincipal, setFdPrincipal] = useState(500_000);
  const [fdRate,      setFdRate]      = useState(7);
  const [fdYears,     setFdYears]     = useState(3);

  const [bmiWeight, setBmiWeight] = useState(70);
  const [bmiHeight, setBmiHeight] = useState(170);

  const [rdMonthly, setRdMonthly] = useState(5_000);
  const [rdRate,    setRdRate]    = useState(6.5);
  const [rdYears,   setRdYears]   = useState(5);

  const [taxIncome, setTaxIncome] = useState(800_000);

  const [gstBaseAmount, setGstBaseAmount] = useState(100_000);
  const [gstRate,       setGstRate]       = useState(18);

  const [pctValue,   setPctValue]   = useState(50_000);
  const [pctPercent, setPctPercent] = useState(30);

  const [cagrInvested,     setCagrInvested]     = useState(100_000);
  const [cagrCurrentValue, setCagrCurrentValue] = useState(250_000);
  const [cagrYears,        setCagrYears]        = useState(5);

  const [siPrincipal, setSiPrincipal] = useState(100_000);
  const [siRate,      setSiRate]      = useState(7);
  const [siYears,     setSiYears]     = useState(3);

  const [retireExpenses, setRetireExpenses] = useState(50_000);
  const [retireYears,    setRetireYears]    = useState(25);
  const [retireReturn,   setRetireReturn]   = useState(10);

  const [hlPropertyValue, setHlPropertyValue] = useState(5_000_000);
  const [hlDownPct,       setHlDownPct]       = useState(20);
  const [hlRate,          setHlRate]          = useState(8.5);

  const [pmCostPrice,    setPmCostPrice]    = useState(500_000);
  const [pmSellingPrice, setPmSellingPrice] = useState(750_000);

  const [sciNum, setSciNum] = useState(100);

  // ── Memoised results ───────────────────────────────────────────────────────
  const emiResult    = useMemo(() => calcEMI(emiPrincipal, emiRate, emiYears),          [emiPrincipal, emiRate, emiYears]);
  const sipResult    = useMemo(() => calcSIP(sipMonthly, sipReturn, sipYears),           [sipMonthly, sipReturn, sipYears]);
  const fdResult     = useMemo(() => calcFD(fdPrincipal, fdRate, fdYears),               [fdPrincipal, fdRate, fdYears]);
  const bmiResult    = useMemo(() => calcBMI(bmiWeight, bmiHeight),                      [bmiWeight, bmiHeight]);
  const rdResult     = useMemo(() => calcRD(rdMonthly, rdRate, rdYears),                 [rdMonthly, rdRate, rdYears]);
  const taxResult    = useMemo(() => calcTax(taxIncome),                                  [taxIncome]);
  const gstResult    = useMemo(() => calcGST(gstBaseAmount, gstRate),                    [gstBaseAmount, gstRate]);
  const pctResult    = useMemo(() => calcPercentage(pctValue, pctPercent),               [pctValue, pctPercent]);
  const cagrResult   = useMemo(() => calcCAGR(cagrInvested, cagrCurrentValue, cagrYears),[cagrInvested, cagrCurrentValue, cagrYears]);
  const siResult     = useMemo(() => calcSI(siPrincipal, siRate, siYears),               [siPrincipal, siRate, siYears]);
  const retireResult = useMemo(() => calcRetirement(retireExpenses, retireYears, retireReturn), [retireExpenses, retireYears, retireReturn]);
  const hlResult     = useMemo(() => calcHomeLoan(hlPropertyValue, hlDownPct, hlRate),   [hlPropertyValue, hlDownPct, hlRate]);
  const pmResult     = useMemo(() => calcProfitMargin(pmCostPrice, pmSellingPrice),      [pmCostPrice, pmSellingPrice]);
  const sciResult    = useMemo(() => calcScientific(sciNum),                              [sciNum]);

  const meta = TAB_META[activeTab];

  const allCalculators = getActiveCalculators().map(calc => ({
    title: calc.title,
    description: calc.description,
    href: calc.href,
    icon: calc.icon,
    category: calc.category,
    sampleResult: SAMPLE_RESULTS[calc.href],
  }));

  const filteredCalculators = selectedCategory
    ? allCalculators.filter(c => c.category.toLowerCase() === selectedCategory)
    : allCalculators;

  const groupedByCategory: Record<string, typeof allCalculators> = {};
  (selectedCategory ? filteredCalculators : allCalculators).forEach(calc => {
    const k = calc.category.toLowerCase();
    if (!groupedByCategory[k]) groupedByCategory[k] = [];
    groupedByCategory[k].push(calc);
  });

  return (
    <div className="space-y-12">

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section className="text-center py-12 md:py-16 space-y-8 relative">

        {/* Floating formula motifs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none select-none" aria-hidden="true">
          {MOTIFS.map((m, i) => (
            <span key={i} className="absolute font-mono text-blue-900/[0.06] dark:text-blue-200/[0.07] text-sm md:text-base font-bold" style={m.style}>
              {m.text}
            </span>
          ))}
        </div>

        {/* Search */}
        <div className="mb-8 relative z-10">
          <CalculatorSearch />
        </div>

        {/* Brand */}
        <div className="space-y-4 relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">calculox</span>
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            Results verified against SBI, HDFC, and ICICI official calculators
          </p>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Premium online calculators for your financial, health, and daily calculations.{' '}
            <span className="font-semibold text-gray-900 dark:text-white">Fast, accurate, and completely free.</span>
          </p>
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-4 pt-4 relative z-10">
          {['100% Free', 'No Registration', '14 Calculators'].map(label => (
            <div key={label} className="px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800/60 text-gray-700 dark:text-gray-300 text-sm font-semibold border border-gray-200 dark:border-gray-700">
              {label}
            </div>
          ))}
          <Link href="/compare" className="px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-semibold border border-blue-200 dark:border-blue-800/60 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5" strokeWidth={2} aria-hidden="true" />
            Compare Calculators
          </Link>
        </div>

        {/* ── Tabbed Quick Calculator Widget ── */}
        <div className={`relative z-10 max-w-2xl mx-auto mt-6 bg-white/90 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl border ${meta.border} shadow-xl p-6 md:p-8 text-left transition-colors duration-300`}>

          {/* Tab bar — scrollable for 14 tabs */}
          <div className="overflow-x-auto mb-6" style={{ scrollbarWidth: 'thin' }}>
            <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 w-max min-w-full">
              {(Object.keys(TAB_META) as QuickTab[]).map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    activeTab === tab
                      ? `bg-white dark:bg-gray-700 shadow-sm ${TAB_META[tab].headerText}`
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  {TAB_META[tab].label}
                </button>
              ))}
            </div>
          </div>

          {/* Widget header */}
          <div className="flex items-center gap-2 mb-5">
            <span className={`w-2 h-2 rounded-full ${meta.dot} animate-pulse`} />
            <span className={`text-[11px] font-bold uppercase tracking-widest ${meta.headerText}`}>
              {meta.label} Quick Calculator
            </span>
          </div>

          {/* ── Sliders — switch per tab ── */}
          <div className="space-y-5">

            {activeTab === 'emi' && <>
              <SliderRow label="Loan Amount" value={emiPrincipal} display={formatINR(emiPrincipal)}
                min={100_000} max={10_000_000} step={100_000} accent={meta.sliderAccent}
                onChange={setEmiPrincipal} minLabel="₹1L" maxLabel="₹1Cr" />
              <SliderRow label="Interest Rate" value={emiRate} display={`${emiRate.toFixed(1)}% p.a.`}
                min={5} max={18} step={0.1} accent={meta.sliderAccent}
                onChange={setEmiRate} minLabel="5%" maxLabel="18%" />
              <SliderRow label="Tenure" value={emiYears} display={`${emiYears} Years`}
                min={1} max={30} step={1} accent={meta.sliderAccent}
                onChange={setEmiYears} minLabel="1 Yr" maxLabel="30 Yrs" />
            </>}

            {activeTab === 'sip' && <>
              <SliderRow label="Monthly Investment" value={sipMonthly} display={formatINR(sipMonthly)}
                min={500} max={100_000} step={500} accent={meta.sliderAccent}
                onChange={setSipMonthly} minLabel="₹500" maxLabel="₹1L" />
              <SliderRow label="Expected Return" value={sipReturn} display={`${sipReturn.toFixed(1)}% p.a.`}
                min={1} max={30} step={0.5} accent={meta.sliderAccent}
                onChange={setSipReturn} minLabel="1%" maxLabel="30%" />
              <SliderRow label="Duration" value={sipYears} display={`${sipYears} Years`}
                min={1} max={40} step={1} accent={meta.sliderAccent}
                onChange={setSipYears} minLabel="1 Yr" maxLabel="40 Yrs" />
            </>}

            {activeTab === 'fd' && <>
              <SliderRow label="Principal Amount" value={fdPrincipal} display={formatINR(fdPrincipal)}
                min={10_000} max={5_000_000} step={10_000} accent={meta.sliderAccent}
                onChange={setFdPrincipal} minLabel="₹10K" maxLabel="₹50L" />
              <SliderRow label="Interest Rate" value={fdRate} display={`${fdRate.toFixed(1)}% p.a.`}
                min={3} max={9} step={0.1} accent={meta.sliderAccent}
                onChange={setFdRate} minLabel="3%" maxLabel="9%" />
              <SliderRow label="Tenure" value={fdYears} display={`${fdYears} ${fdYears === 1 ? 'Year' : 'Years'}`}
                min={1} max={10} step={1} accent={meta.sliderAccent}
                onChange={setFdYears} minLabel="1 Yr" maxLabel="10 Yrs" />
            </>}

            {activeTab === 'bmi' && <>
              <SliderRow label="Weight" value={bmiWeight} display={`${bmiWeight} kg`}
                min={30} max={150} step={1} accent={meta.sliderAccent}
                onChange={setBmiWeight} minLabel="30 kg" maxLabel="150 kg" />
              <SliderRow label="Height" value={bmiHeight} display={`${bmiHeight} cm`}
                min={100} max={220} step={1} accent={meta.sliderAccent}
                onChange={setBmiHeight} minLabel="100 cm" maxLabel="220 cm" />
            </>}

            {activeTab === 'rd' && <>
              <SliderRow label="Monthly Deposit" value={rdMonthly} display={formatINR(rdMonthly)}
                min={500} max={50_000} step={500} accent={meta.sliderAccent}
                onChange={setRdMonthly} minLabel="₹500" maxLabel="₹50K" />
              <SliderRow label="Interest Rate" value={rdRate} display={`${rdRate.toFixed(1)}% p.a.`}
                min={4} max={9} step={0.1} accent={meta.sliderAccent}
                onChange={setRdRate} minLabel="4%" maxLabel="9%" />
              <SliderRow label="Tenure" value={rdYears} display={`${rdYears} ${rdYears === 1 ? 'Year' : 'Years'}`}
                min={1} max={10} step={1} accent={meta.sliderAccent}
                onChange={setRdYears} minLabel="1 Yr" maxLabel="10 Yrs" />
            </>}

            {activeTab === 'tax' && <>
              <SliderRow label="Annual Income" value={taxIncome} display={formatINR(taxIncome)}
                min={300_000} max={5_000_000} step={10_000} accent={meta.sliderAccent}
                onChange={setTaxIncome} minLabel="₹3L" maxLabel="₹50L" />
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                New Regime (FY 2025-26) · ₹75K std. deduction · Rebate 87A ≤ ₹7L taxable
              </p>
            </>}

            {activeTab === 'gst' && <>
              <SliderRow label="Base Amount (excl. GST)" value={gstBaseAmount} display={formatINR(gstBaseAmount)}
                min={1_000} max={1_000_000} step={1_000} accent={meta.sliderAccent}
                onChange={setGstBaseAmount} minLabel="₹1K" maxLabel="₹10L" />
              <SliderRow label="GST Rate" value={gstRate} display={`${gstRate}%`}
                min={0} max={28} step={1} accent={meta.sliderAccent}
                onChange={setGstRate} minLabel="0%" maxLabel="28%" />
              <p className="text-[11px] text-gray-400 dark:text-gray-500">
                Common rates: 5% · 12% · 18% · 28%
              </p>
            </>}

            {activeTab === 'percentage' && <>
              <SliderRow label="Base Value" value={pctValue} display={formatINR(pctValue)}
                min={1_000} max={1_000_000} step={1_000} accent={meta.sliderAccent}
                onChange={setPctValue} minLabel="₹1K" maxLabel="₹10L" />
              <SliderRow label="Percentage" value={pctPercent} display={`${pctPercent}%`}
                min={1} max={100} step={1} accent={meta.sliderAccent}
                onChange={setPctPercent} minLabel="1%" maxLabel="100%" />
            </>}

            {activeTab === 'cagr' && <>
              <SliderRow label="Amount Invested" value={cagrInvested} display={formatINR(cagrInvested)}
                min={50_000} max={5_000_000} step={10_000} accent={meta.sliderAccent}
                onChange={setCagrInvested} minLabel="₹50K" maxLabel="₹50L" />
              <SliderRow label="Current Value" value={cagrCurrentValue} display={formatINR(cagrCurrentValue)}
                min={50_000} max={50_000_000} step={50_000} accent={meta.sliderAccent}
                onChange={setCagrCurrentValue} minLabel="₹50K" maxLabel="₹5Cr" />
              <SliderRow label="Years" value={cagrYears} display={`${cagrYears} ${cagrYears === 1 ? 'Year' : 'Years'}`}
                min={1} max={30} step={1} accent={meta.sliderAccent}
                onChange={setCagrYears} minLabel="1 Yr" maxLabel="30 Yrs" />
            </>}

            {activeTab === 'si' && <>
              <SliderRow label="Principal" value={siPrincipal} display={formatINR(siPrincipal)}
                min={10_000} max={5_000_000} step={10_000} accent={meta.sliderAccent}
                onChange={setSiPrincipal} minLabel="₹10K" maxLabel="₹50L" />
              <SliderRow label="Interest Rate" value={siRate} display={`${siRate.toFixed(1)}% p.a.`}
                min={1} max={15} step={0.1} accent={meta.sliderAccent}
                onChange={setSiRate} minLabel="1%" maxLabel="15%" />
              <SliderRow label="Tenure" value={siYears} display={`${siYears} ${siYears === 1 ? 'Year' : 'Years'}`}
                min={1} max={10} step={1} accent={meta.sliderAccent}
                onChange={setSiYears} minLabel="1 Yr" maxLabel="10 Yrs" />
            </>}

            {activeTab === 'retirement' && <>
              <SliderRow label="Monthly Expenses (today)" value={retireExpenses} display={formatINR(retireExpenses)}
                min={10_000} max={200_000} step={5_000} accent={meta.sliderAccent}
                onChange={setRetireExpenses} minLabel="₹10K" maxLabel="₹2L" />
              <SliderRow label="Years to Retirement" value={retireYears} display={`${retireYears} Years`}
                min={5} max={40} step={1} accent={meta.sliderAccent}
                onChange={setRetireYears} minLabel="5 Yrs" maxLabel="40 Yrs" />
              <SliderRow label="Expected Return" value={retireReturn} display={`${retireReturn.toFixed(1)}% p.a.`}
                min={6} max={15} step={0.5} accent={meta.sliderAccent}
                onChange={setRetireReturn} minLabel="6%" maxLabel="15%" />
            </>}

            {activeTab === 'homeloan' && <>
              <SliderRow label="Property Value" value={hlPropertyValue} display={formatINR(hlPropertyValue)}
                min={2_000_000} max={100_000_000} step={500_000} accent={meta.sliderAccent}
                onChange={setHlPropertyValue} minLabel="₹20L" maxLabel="₹10Cr" />
              <SliderRow label="Down Payment" value={hlDownPct} display={`${hlDownPct}%`}
                min={10} max={50} step={5} accent={meta.sliderAccent}
                onChange={setHlDownPct} minLabel="10%" maxLabel="50%" />
              <SliderRow label="Interest Rate" value={hlRate} display={`${hlRate.toFixed(1)}% p.a.`}
                min={7} max={14} step={0.1} accent={meta.sliderAccent}
                onChange={setHlRate} minLabel="7%" maxLabel="14%" />
            </>}

            {activeTab === 'profitmargin' && <>
              <SliderRow label="Cost Price" value={pmCostPrice} display={formatINR(pmCostPrice)}
                min={1_000} max={1_000_000} step={1_000} accent={meta.sliderAccent}
                onChange={setPmCostPrice} minLabel="₹1K" maxLabel="₹10L" />
              <SliderRow label="Selling Price" value={pmSellingPrice} display={formatINR(pmSellingPrice)}
                min={1_000} max={2_000_000} step={1_000} accent={meta.sliderAccent}
                onChange={setPmSellingPrice} minLabel="₹1K" maxLabel="₹20L" />
            </>}

            {activeTab === 'scientific' && <>
              <SliderRow label="Number" value={sciNum} display={sciNum.toLocaleString('en-IN')}
                min={1} max={10_000} step={1} accent={meta.sliderAccent}
                onChange={setSciNum} minLabel="1" maxLabel="10,000" />
            </>}

          </div>

          {/* ── Result panel ── */}
          <div className="mt-6 pt-5 border-t border-gray-100 dark:border-gray-800">

            {activeTab === 'emi' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {formatINR(emiResult.emi)}
                    <span className="text-base font-normal text-gray-400 ml-1">/mo</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">Monthly EMI</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-orange-500 dark:text-orange-400 tabular-nums">{formatINR(emiResult.totalInterest)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Total Interest</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{formatINR(emiResult.totalAmount)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Total Payment</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'sip' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {formatINR(sipResult.corpus)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">Final Corpus</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{formatINR(sipResult.invested)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Invested</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatINR(sipResult.returns)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Est. Returns</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'fd' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {formatINR(fdResult.maturity)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">Maturity Amount</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{formatINR(fdPrincipal)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Principal</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatINR(fdResult.interest)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Interest Earned</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'bmi' && (
              <>
                <div className="text-center mb-4">
                  <div className={`text-4xl font-extrabold tabular-nums ${bmiResult.color}`}>
                    {bmiResult.bmi.toFixed(1)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">Your BMI</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`${bmiResult.bg} rounded-xl px-4 py-3 text-center`}>
                    <div className={`text-lg font-bold ${bmiResult.color}`}>{bmiResult.category}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Category</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300">18.5 – 24.9</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Healthy Range</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'rd' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {formatINR(rdResult.maturity)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">Maturity Amount</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{formatINR(rdResult.invested)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Total Invested</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatINR(rdResult.returns)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Interest Earned</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'tax' && (
              <>
                <div className="text-center mb-4">
                  {taxResult.totalTax === 0 ? (
                    <>
                      <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">₹0</div>
                      <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1 font-semibold uppercase tracking-widest">Zero Tax (Rebate 87A)</p>
                    </>
                  ) : (
                    <>
                      <div className="text-3xl font-extrabold text-orange-500 dark:text-orange-400 tabular-nums">{formatINR(taxResult.totalTax)}</div>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">Annual Tax (New Regime)</p>
                    </>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{taxResult.effectiveRate.toFixed(2)}%</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Effective Rate</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-orange-500 dark:text-orange-400 tabular-nums">{formatINR(taxResult.monthlyTax)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Monthly Tax</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'gst' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {formatINR(gstResult.gst)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">GST Amount ({gstRate}%)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{formatINR(gstBaseAmount)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Base Amount</p>
                  </div>
                  <div className="bg-emerald-50 dark:bg-emerald-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">{formatINR(gstResult.total)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Total Amount</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'percentage' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 tabular-nums">
                    {formatINR(pctResult.result)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">
                    {pctPercent}% of {formatINR(pctValue)}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-violet-50 dark:bg-violet-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-violet-600 dark:text-violet-400 tabular-nums">{pctPercent}%</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Percentage Applied</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{formatINR(pctResult.remaining)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Remaining ({100 - pctPercent}%)</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'cagr' && (
              <>
                <div className="text-center mb-4">
                  <div className={`text-3xl font-extrabold tabular-nums ${cagrResult.cagr >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {cagrResult.cagr >= 0 ? '' : '−'}{Math.abs(cagrResult.cagr).toFixed(2)}%
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">CAGR (p.a.)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{cagrResult.totalReturn.toFixed(1)}%</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Total Return</p>
                  </div>
                  <div className={`${cagrResult.gain >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-red-50 dark:bg-red-900/10'} rounded-xl px-4 py-3 text-center`}>
                    <div className={`text-lg font-bold tabular-nums ${cagrResult.gain >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {cagrResult.gain >= 0 ? '' : '−'}{formatINR(Math.abs(cagrResult.gain))}
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{cagrResult.gain >= 0 ? 'Total Gain' : 'Total Loss'}</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'si' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-emerald-600 dark:text-emerald-400 tabular-nums">
                    {formatINR(siResult.interest)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">Simple Interest Earned</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{formatINR(siPrincipal)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Principal</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">{formatINR(siResult.total)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Total Amount</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'retirement' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {formatINR(retireResult.corpus)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">Corpus Needed (4% Rule)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-orange-500 dark:text-orange-400 tabular-nums">{formatINR(retireResult.sipNeeded)}<span className="text-xs font-normal text-gray-400 ml-0.5">/mo</span></div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Monthly SIP to Start</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{formatINR(retireExpenses * 12)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Annual Expenses</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'homeloan' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-blue-600 dark:text-blue-400 tabular-nums">
                    {formatINR(hlResult.emi)}
                    <span className="text-base font-normal text-gray-400 ml-1">/mo</span>
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">Monthly EMI (20 Yr Tenure)</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{formatINR(hlResult.loanAmount)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Loan Amount</p>
                  </div>
                  <div className="bg-orange-50 dark:bg-orange-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-orange-500 dark:text-orange-400 tabular-nums">{formatINR(hlResult.totalInterest)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Total Interest</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'profitmargin' && (
              <>
                <div className="text-center mb-4">
                  <div className={`text-3xl font-extrabold tabular-nums ${pmResult.profit >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {pmResult.profit >= 0 ? '' : '−'}{formatINR(Math.abs(pmResult.profit))}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">
                    {pmResult.profit >= 0 ? 'Gross Profit' : 'Loss'}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className={`${pmResult.margin >= 0 ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-red-50 dark:bg-red-900/10'} rounded-xl px-4 py-3 text-center`}>
                    <div className={`text-lg font-bold tabular-nums ${pmResult.margin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                      {pmResult.margin.toFixed(1)}%
                    </div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Profit Margin</p>
                  </div>
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">{pmResult.markup.toFixed(1)}%</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">Markup %</p>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'scientific' && (
              <>
                <div className="text-center mb-4">
                  <div className="text-3xl font-extrabold text-violet-600 dark:text-violet-400 tabular-nums">
                    {sciResult.sqrt.toFixed(4)}
                  </div>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 font-semibold uppercase tracking-widest">
                    √{sciNum.toLocaleString('en-IN')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-blue-600 dark:text-blue-400 tabular-nums">{formatNum(sciResult.square, 0)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">{sciNum}² (Square)</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <div className="text-lg font-bold text-gray-700 dark:text-gray-300 tabular-nums">{sciResult.log10.toFixed(4)}</div>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5">log₁₀({sciNum})</p>
                  </div>
                </div>
              </>
            )}

          </div>

          {/* Dynamic CTA */}
          <Link
            href={meta.href}
            className={`mt-5 block w-full text-center bg-gradient-to-r ${meta.btnGrad} text-white font-semibold py-3 rounded-xl shadow-lg ${meta.btnShadow} transition-all duration-200 hover:-translate-y-0.5 will-change-transform`}
          >
            {meta.cta}
          </Link>
        </div>

        {/* Count-Up Trust Bar */}
        <div className="relative z-10 mt-6 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6 md:p-8 border border-blue-100 dark:border-blue-800/50">
          <div className="grid grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400">
                <CountUp to={14} suffix="+" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Free Calculators</p>
            </div>
            <div className="text-center">
              <Lock className="w-8 h-8 mx-auto text-emerald-600 dark:text-emerald-400" strokeWidth={2} aria-hidden="true" />
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">No Data Stored</p>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-violet-600 dark:text-violet-400">
                <CountUp to={100} suffix="%" />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">Browser-Only</p>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CALCULATOR GRID
      ══════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-bold">Popular Calculators</h2>
          <p className="text-gray-600 dark:text-gray-400">
            {selectedCategory
              ? `Explore our ${categoryConfig[selectedCategory]?.label ?? selectedCategory} calculators`
              : 'Choose from our collection of powerful financial and health calculators'}
          </p>
        </div>

        <CategoryTabs selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />

        {selectedCategory ? (
          <div key={selectedCategory} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in">
            {filteredCalculators.map(calc => <CalculatorCard key={calc.href} {...calc} />)}
          </div>
        ) : (
          <div key="all" className="space-y-12 animate-fade-in">
            {Object.entries(groupedByCategory).map(([category, calcs]) => {
              const cfg = categoryConfig[category];
              const CategoryIcon = cfg?.Icon;
              return (
                <div key={category} className="space-y-4 relative">
                  {category === 'finance' && (
                    <div className="absolute -inset-x-4 -top-4 h-28 bg-gradient-to-b from-blue-100/60 via-blue-50/30 to-transparent dark:from-blue-500/10 dark:via-blue-950/5 rounded-t-2xl pointer-events-none" aria-hidden="true" />
                  )}
                  <div className="relative flex items-center gap-3 pb-4 border-b-2 border-gray-200 dark:border-gray-700">
                    <h3 className={`text-2xl font-bold flex items-center gap-2 ${
                      category === 'finance' ? 'text-blue-600 dark:text-blue-400' :
                      category === 'health'  ? 'text-rose-600 dark:text-rose-400' :
                      category === 'utility' ? 'text-violet-600 dark:text-violet-400' :
                      'text-teal-600 dark:text-teal-400'
                    }`}>
                      {CategoryIcon && <CategoryIcon className="w-6 h-6" strokeWidth={2} aria-hidden="true" />}
                      {cfg?.label ?? category}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      category === 'finance' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' :
                      category === 'health'  ? 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400' :
                      category === 'utility' ? 'bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400' :
                      'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
                    }`}>
                      {calcs.length} {calcs.length === 1 ? 'Calculator' : 'Calculators'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {calcs.map(calc => <CalculatorCard key={calc.href} {...calc} />)}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════
          REAL SCENARIOS
      ══════════════════════════════════════════ */}
      <section className="space-y-8">
        <div className="space-y-2 mb-8">
          <h2 className="text-4xl font-bold">Real Indian Scenarios</h2>
          <p className="text-gray-600 dark:text-gray-400">Actual numbers — try the calculator and see for yourself</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REAL_SCENARIOS.map(sc => (
            <div key={sc.tag} className={`relative overflow-hidden bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl border ${sc.border} shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 p-6`}>
              <span className={`absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${sc.accent} rounded-l-2xl`} />
              <div className={`inline-flex p-2.5 rounded-xl mb-3 ${sc.bg}`}>
                <sc.Icon className={`w-5 h-5 ${sc.color}`} strokeWidth={2} aria-hidden="true" />
              </div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{sc.tag}</p>
              <div className={`${sc.bg} rounded-xl p-4 mb-4 font-mono`}>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-1.5">{sc.inputs}</p>
                <p className={`text-2xl font-extrabold tabular-nums ${sc.color}`}>
                  {sc.result}<span className="text-sm font-medium text-gray-500 dark:text-gray-400 ml-1">/mo</span>
                </p>
                <p className="text-[11px] text-gray-400 mt-1">{sc.sub}</p>
              </div>
              <Link href={sc.href} className={`text-sm font-semibold ${sc.color} hover:underline`}>{sc.cta} →</Link>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 rounded-2xl p-8 md:p-16 border border-blue-100 dark:border-gray-700">
        <h2 className="text-4xl font-bold mb-12 text-center">Why Choose Our Calculators?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { Icon: Zap,         label: 'Fast & Accurate',  desc: 'Instant results with high-precision calculations powered by advanced algorithms', color: 'text-amber-500'  },
            { Icon: ShieldCheck, label: 'Secure & Private', desc: 'Your data is never stored or shared. All calculations happen securely in your browser', color: 'text-blue-600'  },
            { Icon: Smartphone,  label: 'Mobile Friendly',  desc: 'Works perfectly on any device — desktop, tablet, or phone with optimised responsive design', color: 'text-violet-600' },
          ].map(({ Icon, label, desc, color }) => (
            <div key={label} className="text-center p-6 rounded-2xl bg-white/80 dark:bg-gray-800/60 backdrop-blur-md shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-gray-100 dark:border-gray-700">
              <Icon className={`w-12 h-12 mx-auto mb-4 ${color}`} strokeWidth={1.75} aria-hidden="true" />
              <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">{label}</h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="space-y-8 pt-4">
        <div className="space-y-2">
          <h2 className="text-4xl font-bold">Frequently Asked Questions</h2>
          <p className="text-gray-600 dark:text-gray-400">Find answers to common questions about our calculators</p>
        </div>
        <div className="space-y-4">
          {[
            { q: 'Are these calculators free to use?', a: "Yes! All our calculators are completely free and don't require any registration or payment. We believe financial tools should be accessible to everyone." },
            { q: 'Is my data secure?',                 a: 'Yes. All calculations happen in your browser. We never store or transmit your personal data. Your privacy is our top priority.' },
            { q: 'Will you add more calculators?',     a: "Yes! We're constantly adding new calculators based on user feedback. Check back soon for more powerful tools to make your life easier." },
          ].map(({ q, a }) => (
            <details key={q} className="group bg-white/80 dark:bg-gray-900/60 backdrop-blur-md rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-lg hover:border-blue-200 dark:hover:border-blue-800 transition-all duration-300 cursor-pointer">
              <summary className="font-semibold text-lg text-gray-900 dark:text-white flex items-center justify-between group-open:text-blue-600 dark:group-open:text-blue-400 transition-colors">
                <span>{q}</span>
                <span className="transform group-open:rotate-180 transition-transform duration-300 text-xl">▾</span>
              </summary>
              <p className="mt-4 text-gray-600 dark:text-gray-400 leading-relaxed">{a}</p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

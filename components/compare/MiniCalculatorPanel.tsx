'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { calculateEMI } from '@/lib/calculators/emi';
import { calculateSIP } from '@/lib/calculators/sip';
import { calculateFD } from '@/lib/calculators/fd';
import { formatCurrency } from '@/lib/utils/format';
import { CalculatorIcon } from '@/components/ui/CalculatorIcon';

type CalculatorId = 'emi' | 'sip' | 'fd';
type AccentColor = 'blue' | 'purple';

interface MiniCalculatorPanelProps {
  calcId: CalculatorId;
  accentColor: AccentColor;
}

export function MiniCalculatorPanel({ calcId, accentColor }: MiniCalculatorPanelProps) {
  const borderColor = accentColor === 'blue' ? 'border-blue-500' : 'border-purple-500';
  const bgAccent = accentColor === 'blue' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-purple-50 dark:bg-purple-900/20';
  const textAccent = accentColor === 'blue' ? 'text-blue-700 dark:text-blue-300' : 'text-purple-700 dark:text-purple-300';

  // EMI state
  const [emiPrincipal, setEmiPrincipal] = useState(500000);
  const [emiRate, setEmiRate] = useState(8.5);
  const [emiYears, setEmiYears] = useState(5);
  const [emiResult, setEmiResult] = useState<any>(null);

  // SIP state
  const [sipMonthly, setSipMonthly] = useState(10000);
  const [sipReturn, setSipReturn] = useState(12);
  const [sipYears, setSipYears] = useState(10);
  const [sipResult, setSipResult] = useState<any>(null);

  // FD state
  const [fdPrincipal, setFdPrincipal] = useState(100000);
  const [fdRate, setFdRate] = useState(6.5);
  const [fdYears, setFdYears] = useState(2);
  const [fdResult, setFdResult] = useState<any>(null);

  // EMI calculation
  useEffect(() => {
    if (calcId !== 'emi') return;
    const timer = setTimeout(() => {
      try {
        const result = calculateEMI({
          principal: emiPrincipal,
          annualRate: emiRate,
          years: emiYears,
        });
        setEmiResult(result);
      } catch (error) {
        console.error('EMI calculation error:', error);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [emiPrincipal, emiRate, emiYears, calcId]);

  // SIP calculation
  useEffect(() => {
    if (calcId !== 'sip') return;
    const timer = setTimeout(() => {
      try {
        const result = calculateSIP({
          monthlyInvestment: sipMonthly,
          years: sipYears,
          annualReturn: sipReturn,
        });
        setSipResult(result);
      } catch (error) {
        console.error('SIP calculation error:', error);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [sipMonthly, sipReturn, sipYears, calcId]);

  // FD calculation
  useEffect(() => {
    if (calcId !== 'fd') return;
    const timer = setTimeout(() => {
      try {
        const result = calculateFD({
          principal: fdPrincipal,
          annualRate: fdRate,
          years: fdYears,
        });
        setFdResult(result);
      } catch (error) {
        console.error('FD calculation error:', error);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [fdPrincipal, fdRate, fdYears, calcId]);

  return (
    <div className={`card border-l-4 ${borderColor}`}>
      {calcId === 'emi' && (
        <>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textAccent}`}>
            <CalculatorIcon idOrHref="emi" className="w-5 h-5" /> EMI Calculator
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Principal (₹)
              </label>
              <input
                type="number"
                min="10000"
                max="100000000"
                step="10000"
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Annual Rate (%)
              </label>
              <input
                type="number"
                min="0.1"
                max="30"
                step="0.1"
                value={emiRate}
                onChange={(e) => setEmiRate(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tenure (Years)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                step="1"
                value={emiYears}
                onChange={(e) => setEmiYears(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {emiResult && (
            <div className={`${bgAccent} rounded-lg p-4 space-y-3 mb-4`}>
              <div>
                <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Monthly EMI</p>
                <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{formatCurrency(emiResult.emi)}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Total Amount</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{formatCurrency(emiResult.totalAmount)}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Total Interest</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{formatCurrency(emiResult.totalInterest)}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Duration</p>
                <p className="text-lg font-bold text-blue-700 dark:text-blue-300">{emiResult.numberOfMonths} months</p>
              </div>
            </div>
          )}

          <Link
            href="/emi-calculator"
            className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            Open Full Calculator →
          </Link>
        </>
      )}

      {calcId === 'sip' && (
        <>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textAccent}`}>
            <CalculatorIcon idOrHref="sip" className="w-5 h-5" /> SIP Calculator
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Monthly Investment (₹)
              </label>
              <input
                type="number"
                min="100"
                max="1000000"
                step="100"
                value={sipMonthly}
                onChange={(e) => setSipMonthly(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Annual Return (%)
              </label>
              <input
                type="number"
                min="1"
                max="30"
                step="0.5"
                value={sipReturn}
                onChange={(e) => setSipReturn(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Duration (Years)
              </label>
              <input
                type="number"
                min="1"
                max="40"
                step="1"
                value={sipYears}
                onChange={(e) => setSipYears(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>

          {sipResult && (
            <div className={`${bgAccent} rounded-lg p-4 space-y-3 mb-4`}>
              <div>
                <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Total Invested</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{formatCurrency(sipResult.totalInvestment)}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Future Value</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{formatCurrency(sipResult.futureValue)}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Gains</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{formatCurrency(sipResult.gainedAmount)}</p>
              </div>
            </div>
          )}

          <Link
            href="/sip-calculator"
            className="text-sm font-semibold text-purple-600 dark:text-purple-400 hover:underline flex items-center gap-1"
          >
            Open Full Calculator →
          </Link>
        </>
      )}

      {calcId === 'fd' && (
        <>
          <h2 className={`text-xl font-bold mb-4 flex items-center gap-2 ${textAccent}`}>
            <CalculatorIcon idOrHref="fd" className="w-5 h-5" /> FD Calculator
          </h2>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Principal (₹)
              </label>
              <input
                type="number"
                min="1000"
                max="100000000"
                step="1000"
                value={fdPrincipal}
                onChange={(e) => setFdPrincipal(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Interest Rate (%)
              </label>
              <input
                type="number"
                min="0.1"
                max="15"
                step="0.1"
                value={fdRate}
                onChange={(e) => setFdRate(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Tenure (Years)
              </label>
              <input
                type="number"
                min="1"
                max="10"
                step="1"
                value={fdYears}
                onChange={(e) => setFdYears(Number(e.target.value))}
                className="w-full px-3 py-2 border-2 border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-white font-bold text-right focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {fdResult && (
            <div className={`${bgAccent} rounded-lg p-4 space-y-3 mb-4`}>
              <div>
                <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Maturity Amount</p>
                <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{formatCurrency(fdResult.maturityAmount)}</p>
              </div>
              <div>
                <p className="text-xs uppercase font-semibold text-gray-600 dark:text-gray-400">Total Interest</p>
                <p className="text-lg font-bold text-purple-700 dark:text-purple-300">{formatCurrency(fdResult.totalInterest)}</p>
              </div>
            </div>
          )}

          <Link
            href="/fd-calculator"
            className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
          >
            Open Full Calculator →
          </Link>
        </>
      )}
    </div>
  );
}

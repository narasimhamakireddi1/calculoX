'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { MiniCalculatorPanel } from './MiniCalculatorPanel';
import { ArrowLeftRight, Lightbulb } from 'lucide-react';

type CalculatorId = 'emi' | 'sip' | 'fd';

const CALCULATORS: Array<{ id: CalculatorId; label: string }> = [
  { id: 'emi', label: 'EMI Calculator' },
  { id: 'sip', label: 'SIP Calculator' },
  { id: 'fd', label: 'FD Calculator' },
];

export function CompareClient() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [calc1Id, setCalc1Id] = useState<CalculatorId>('emi');
  const [calc2Id, setCalc2Id] = useState<CalculatorId>('sip');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const c1 = (searchParams.get('c1') as CalculatorId) || 'emi';
    const c2 = (searchParams.get('c2') as CalculatorId) || 'sip';

    if (CALCULATORS.some(cal => cal.id === c1)) {
      setCalc1Id(c1);
    }
    if (CALCULATORS.some(cal => cal.id === c2)) {
      setCalc2Id(c2);
    }
    setMounted(true);
  }, [searchParams]);

  const handleCalc1Change = (newId: CalculatorId) => {
    setCalc1Id(newId);
    router.replace(`/compare?c1=${newId}&c2=${calc2Id}`, { scroll: false });
  };

  const handleCalc2Change = (newId: CalculatorId) => {
    setCalc2Id(newId);
    router.replace(`/compare?c1=${calc1Id}&c2=${newId}`, { scroll: false });
  };

  const handleSwap = () => {
    const temp = calc1Id;
    setCalc1Id(calc2Id);
    setCalc2Id(temp);
    router.replace(`/compare?c1=${calc2Id}&c2=${temp}`, { scroll: false });
  };

  if (!mounted) {
    return <div className="py-12 text-center">Loading...</div>;
  }

  return (
    <div className="space-y-8 py-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-gradient inline-flex items-center gap-3">
          <ArrowLeftRight className="w-8 h-8 md:w-9 md:h-9 flex-shrink-0" strokeWidth={2} aria-hidden="true" />
          <span>Compare Calculators</span>
        </h1>
        <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
          Pick two calculators and see how they compare side-by-side. Run the same scenarios and spot the differences instantly.
        </p>
      </div>

      {/* Selector Controls */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center px-4 md:px-0">
        {/* Calc 1 Selector */}
        <div className="flex-1 max-w-xs md:max-w-none">
          <label className="block text-xs uppercase tracking-wide font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Calculator 1
          </label>
          <select
            value={calc1Id}
            onChange={(e) => handleCalc1Change(e.target.value as CalculatorId)}
            className="w-full px-4 py-3 rounded-lg border-2 border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
          >
            {CALCULATORS.map(cal => (
              <option key={cal.id} value={cal.id}>
                {cal.label}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <button
          onClick={handleSwap}
          className="hidden md:flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-r from-blue-500 to-violet-500 text-white hover:shadow-lg transition-all active:scale-95 mt-6"
          title="Swap calculators"
          aria-label="Swap calculators"
        >
          <ArrowLeftRight className="w-5 h-5" strokeWidth={2.5} aria-hidden="true" />
        </button>

        {/* Calc 2 Selector */}
        <div className="flex-1 max-w-xs md:max-w-none">
          <label className="block text-xs uppercase tracking-wide font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Calculator 2
          </label>
          <select
            value={calc2Id}
            onChange={(e) => handleCalc2Change(e.target.value as CalculatorId)}
            className="w-full px-4 py-3 rounded-lg border-2 border-violet-300 dark:border-violet-700 bg-violet-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
          >
            {CALCULATORS.map(cal => (
              <option key={cal.id} value={cal.id}>
                {cal.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Panel Grid */}
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-8 px-4 md:px-0">
        <MiniCalculatorPanel key={calc1Id} calcId={calc1Id} accentColor="blue" />
        <MiniCalculatorPanel key={calc2Id} calcId={calc2Id} accentColor="violet" />
      </div>

      {/* Footer Info */}
      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800 text-center text-sm text-gray-700 dark:text-gray-300">
        <p className="flex items-center justify-center gap-2">
          <Lightbulb className="w-4 h-4 flex-shrink-0 text-blue-500" strokeWidth={2} aria-hidden="true" />
          Tip: Bookmark this page to save your comparison. The URL updates automatically with your selections.
        </p>
      </div>
    </div>
  );
}

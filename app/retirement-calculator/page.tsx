'use client';

import { useForm } from 'react-hook-form';
import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { MemoizedPieChart } from '@/components/charts/MemoizedPieChart';
import ExportButton from '@/components/ui/ExportButton';
import { RelatedCalculators } from '@/components/ui/RelatedCalculators';

interface RetirementFormData {
  currentAge: number;
  retirementAge: number;
  lifeExpectancy: number;
  monthlyExpense: number;
  currentCorpus: number;
  annualReturn: number;
  inflationRate: number;
}

interface RetirementResults {
  yearsToRetirement: number;
  yearsInRetirement: number;
  adjustedMonthlyExpense: number;
  adjustedAnnualExpense: number;
  corpusNeeded: number;
  availableAtRetirement: number;
  corpusGap: number;
  monthlySIPNeeded: number;
  monthlyExpenseWithoutSIP: number;
  projectionData: Array<{
    year: number;
    age: number;
    annualSIP: number;
    corpusValue: number;
  }>;
  scenarios: Array<{
    name: string;
    return: number;
    monthlySIP: number;
    finalCorpus: number;
  }>;
}

export default function RetirementCalculator() {
  const { watch, setValue } = useForm<RetirementFormData>({
    defaultValues: {
      currentAge: 35,
      retirementAge: 60,
      lifeExpectancy: 85,
      monthlyExpense: 50000,
      currentCorpus: 500000,
      annualReturn: 10,
      inflationRate: 6,
    },
  });

  const watchValues = watch();

  const results = useMemo(() => {
    const {
      currentAge,
      retirementAge,
      lifeExpectancy,
      monthlyExpense,
      currentCorpus,
      annualReturn,
      inflationRate,
    } = watchValues;

    const yearsToRetirement = Math.max(0, retirementAge - currentAge);
    const yearsInRetirement = Math.max(0, lifeExpectancy - retirementAge);

    // Inflation-adjusted monthly expense at retirement
    const adjustedMonthlyExpense =
      monthlyExpense * Math.pow(1 + inflationRate / 100, yearsToRetirement);
    const adjustedAnnualExpense = adjustedMonthlyExpense * 12;

    // Corpus needed (25x annual expenses for safe withdrawal)
    const corpusNeeded = adjustedAnnualExpense * 25;

    // Available corpus at retirement (with growth)
    const availableAtRetirement =
      currentCorpus * Math.pow(1 + annualReturn / 100, yearsToRetirement);

    // Gap to fill with SIP
    const corpusGap = Math.max(0, corpusNeeded - availableAtRetirement);

    // Calculate monthly SIP needed using FV of annuity due formula
    const monthlyReturn = annualReturn / 100 / 12;
    const months = yearsToRetirement * 12;

    let monthlySIPNeeded = 0;
    if (monthlyReturn > 0) {
      monthlySIPNeeded =
        corpusGap /
        (Math.pow(1 + monthlyReturn, months) - 1) /
        monthlyReturn *
        (1 + monthlyReturn);
    } else {
      monthlySIPNeeded = corpusGap / months;
    }

    // Year-by-year projection
    const projectionData: RetirementResults['projectionData'] = [];
    let corpusValue = currentCorpus;

    for (let year = 0; year <= yearsToRetirement; year++) {
      const yearsSIPed = Math.max(0, year);
      const monthsInYear = yearsSIPed * 12;

      // Growth of initial corpus
      corpusValue = currentCorpus * Math.pow(1 + annualReturn / 100, year);

      // Growth of SIP
      if (monthlyReturn > 0 && monthsInYear > 0) {
        const sipGrowth =
          monthlySIPNeeded *
          (Math.pow(1 + monthlyReturn, monthsInYear) - 1) /
          monthlyReturn *
          (1 + monthlyReturn);
        corpusValue += sipGrowth;
      } else if (monthsInYear > 0) {
        corpusValue += monthlySIPNeeded * monthsInYear;
      }

      projectionData.push({
        year,
        age: currentAge + year,
        annualSIP: monthlySIPNeeded * 12,
        corpusValue: Math.max(0, corpusValue),
      });
    }

    // Scenario analysis
    const scenarios: RetirementResults['scenarios'] = [
      {
        name: 'Conservative (6% return)',
        return: 6,
        monthlySIP: 0,
        finalCorpus: 0,
      },
      {
        name: 'Moderate (10% return)',
        return: 10,
        monthlySIP: 0,
        finalCorpus: 0,
      },
      {
        name: 'Aggressive (14% return)',
        return: 14,
        monthlySIP: 0,
        finalCorpus: 0,
      },
    ];

    scenarios.forEach((scen) => {
      const monthlyRet = scen.return / 100 / 12;
      const availCorpus = currentCorpus * Math.pow(1 + scen.return / 100, yearsToRetirement);
      const gap = Math.max(0, corpusNeeded - availCorpus);

      if (monthlyRet > 0) {
        scen.monthlySIP =
          gap /
          (Math.pow(1 + monthlyRet, months) - 1) /
          monthlyRet *
          (1 + monthlyRet);
      } else {
        scen.monthlySIP = gap / months;
      }

      scen.finalCorpus = availCorpus + (scen.monthlySIP * months * (Math.pow(1 + monthlyRet, months) - 1) / monthlyRet * (1 + monthlyRet));
    });

    return {
      yearsToRetirement,
      yearsInRetirement,
      adjustedMonthlyExpense,
      adjustedAnnualExpense,
      corpusNeeded,
      availableAtRetirement,
      corpusGap,
      monthlySIPNeeded,
      monthlyExpenseWithoutSIP: monthlyExpense,
      projectionData,
      scenarios,
    };
  }, [watchValues]);

  const inputsData = useMemo(
    () => [
      { label: 'Current Age', value: `${watchValues.currentAge} years` },
      { label: 'Retirement Age', value: `${watchValues.retirementAge} years` },
      { label: 'Life Expectancy', value: `${watchValues.lifeExpectancy} years` },
      { label: 'Current Monthly Expenses', value: `₹${watchValues.monthlyExpense.toLocaleString('en-IN')}` },
      { label: 'Current Retirement Corpus', value: `₹${watchValues.currentCorpus.toLocaleString('en-IN')}` },
      { label: 'Expected Annual Return', value: `${watchValues.annualReturn}%` },
      { label: 'Expected Inflation', value: `${watchValues.inflationRate}%` },
    ],
    [watchValues]
  );

  const pieData = useMemo(
    () => [
      {
        name: 'Initial Corpus Growth',
        value: Math.max(0, results.availableAtRetirement),
      },
      {
        name: 'SIP Contribution + Growth',
        value: Math.max(0, results.corpusNeeded - results.availableAtRetirement),
      },
    ],
    [results]
  );

  return (
    <div className="space-y-8 py-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gradient">Retirement Corpus Calculator</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          Plan your retirement with precision. Calculate how much corpus you need and monthly SIP required.
        </p>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Input Section */}
        <div className="card space-y-4">
          <h2 className="text-xl font-semibold">Retirement Planning Details</h2>

          {/* Current Age */}
          <div>
            <label htmlFor="current-age" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Current Age
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="current-age"
                type="range"
                min="18"
                max="65"
                value={watchValues.currentAge ?? 0}
                onChange={(e) => setValue('currentAge', parseInt(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-blue-300 to-blue-600 rounded-lg appearance-none cursor-pointer accent-blue-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">yrs</span>
                <input
                  type="number"
                  value={watchValues.currentAge === 0 ? '' : watchValues.currentAge}
                  onChange={(e) => setValue('currentAge', parseInt(e.target.value) || 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">18 - 65 years</p>
          </div>

          {/* Retirement Age */}
          <div>
            <label htmlFor="retirement-age" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Retirement Age
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="retirement-age"
                type="range"
                min={watchValues.currentAge}
                max="80"
                value={watchValues.retirementAge ?? 0}
                onChange={(e) => setValue('retirementAge', parseInt(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-orange-300 to-orange-600 rounded-lg appearance-none cursor-pointer accent-orange-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-3 top-2.5 font-bold text-sm">yrs</span>
                <input
                  type="number"
                  value={watchValues.retirementAge === 0 ? '' : watchValues.retirementAge}
                  onChange={(e) => setValue('retirementAge', parseInt(e.target.value) || 0)}
                  className="w-full md:w-32 px-6 py-3 border-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Current age - 80 years</p>
          </div>

          {/* Life Expectancy */}
          <div>
            <label htmlFor="life-expectancy" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Life Expectancy
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="life-expectancy"
                type="range"
                min={watchValues.retirementAge}
                max="100"
                value={watchValues.lifeExpectancy ?? 0}
                onChange={(e) => setValue('lifeExpectancy', parseInt(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-green-300 to-green-600 rounded-lg appearance-none cursor-pointer accent-green-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-3 top-2.5 font-bold text-sm">yrs</span>
                <input
                  type="number"
                  value={watchValues.lifeExpectancy === 0 ? '' : watchValues.lifeExpectancy}
                  onChange={(e) => setValue('lifeExpectancy', parseInt(e.target.value) || 0)}
                  className="w-full md:w-32 px-6 py-3 border-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Retirement age - 100 years</p>
          </div>

          {/* Monthly Expense */}
          <div>
            <label htmlFor="monthly-expense" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Current Monthly Expenses (₹)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="monthly-expense"
                type="range"
                min="5000"
                max="500000"
                step="5000"
                value={watchValues.monthlyExpense ?? 0}
                onChange={(e) => setValue('monthlyExpense', parseInt(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-purple-300 to-purple-600 rounded-lg appearance-none cursor-pointer accent-purple-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute left-2.5 md:left-2 top-3 md:top-2.5 font-bold text-xs md:text-sm">₹</span>
                <input
                  type="number"
                  value={watchValues.monthlyExpense === 0 ? '' : watchValues.monthlyExpense}
                  onChange={(e) => setValue('monthlyExpense', parseInt(e.target.value) || 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹5,000 - ₹500,000</p>
          </div>

          {/* Current Corpus */}
          <div>
            <label htmlFor="current-corpus" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Current Retirement Corpus (₹)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="current-corpus"
                type="range"
                min="0"
                max="50000000"
                step="100000"
                value={watchValues.currentCorpus ?? 0}
                onChange={(e) => setValue('currentCorpus', parseInt(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-rose-300 to-rose-600 rounded-lg appearance-none cursor-pointer accent-rose-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute left-2 top-2.5 font-bold text-sm">₹</span>
                <input
                  type="number"
                  value={watchValues.currentCorpus === 0 ? '' : watchValues.currentCorpus}
                  onChange={(e) => setValue('currentCorpus', parseInt(e.target.value) || 0)}
                  className="w-full md:w-32 px-6 py-3 border-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">₹0 - ₹5,00,00,000</p>
          </div>

          {/* Annual Return */}
          <div>
            <label htmlFor="annual-return" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Expected Annual Return (%)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="annual-return"
                type="range"
                min="4"
                max="16"
                step="0.5"
                value={watchValues.annualReturn ?? 0}
                onChange={(e) => setValue('annualReturn', parseFloat(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-cyan-300 to-cyan-600 rounded-lg appearance-none cursor-pointer accent-cyan-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-2.5 md:right-3 top-3 md:top-2.5 font-bold text-xs md:text-sm">%</span>
                <input
                  type="number"
                  step="0.5"
                  value={watchValues.annualReturn === 0 ? '' : watchValues.annualReturn}
                  onChange={(e) => setValue('annualReturn', parseFloat(e.target.value) || 0)}
                  className="w-full md:w-32 px-7 md:px-6 py-3 border-2 rounded-lg text-right font-bold text-sm md:text-base focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">4% - 16%</p>
          </div>

          {/* Inflation Rate */}
          <div>
            <label htmlFor="inflation-rate" className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
              Expected Inflation (%)
            </label>
            <div className="flex flex-col md:flex-row gap-3 items-center md:items-center">
              <input
                id="inflation-rate"
                type="range"
                min="2"
                max="10"
                step="0.5"
                value={watchValues.inflationRate ?? 0}
                onChange={(e) => setValue('inflationRate', parseFloat(e.target.value))}
                className="w-full md:flex-1 h-3 bg-gradient-to-r from-amber-300 to-amber-600 rounded-lg appearance-none cursor-pointer accent-amber-600 transition-all"
              />
              <div className="w-full md:w-auto relative flex-shrink-0">
                <span className="absolute right-3 top-2.5 font-bold text-sm">%</span>
                <input
                  type="number"
                  step="0.5"
                  value={watchValues.inflationRate === 0 ? '' : watchValues.inflationRate}
                  onChange={(e) => setValue('inflationRate', parseFloat(e.target.value) || 0)}
                  className="w-full md:w-32 px-6 py-3 border-2 rounded-lg text-right font-bold focus:outline-none focus:ring-2 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all"
                />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">2% - 10%</p>
          </div>

          {/* Clear All Button */}
          <button
            type="button"
            onClick={() => {
              setValue('currentAge', 30);
              setValue('retirementAge', 60);
              setValue('lifeExpectancy', 85);
              setValue('monthlyExpense', 50000);
              setValue('currentCorpus', 500000);
              setValue('annualReturn', 10);
              setValue('inflationRate', 5);
            }}
            className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02]"
          >
            🗑️ Clear All
          </button>
        </div>

        {/* Results Section */}
        <div className="card space-y-6">
          <h2 className="text-xl font-semibold">Your Retirement Plan</h2>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Adjusted Monthly Expense at Retirement</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                ₹{results.adjustedMonthlyExpense.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                ₹{results.monthlyExpenseWithoutSIP.toLocaleString('en-IN')} adjusted for {results.yearsToRetirement} years @ {watchValues.inflationRate}% inflation
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/30 dark:to-green-800/30 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Total Corpus Needed (25x Rule)</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                ₹{results.corpusNeeded.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                For {results.yearsInRetirement} years of retirement
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/30 dark:to-purple-800/30 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Monthly SIP Needed</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                ₹{results.monthlySIPNeeded.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                @ {watchValues.annualReturn}% annual return
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/30 dark:to-orange-800/30 p-4 rounded-lg">
              <p className="text-sm text-gray-600 dark:text-gray-400">Corpus Gap to Fill</p>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                ₹{results.corpusGap.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Available at retirement: ₹{results.availableAtRetirement.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
              </p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-4">Corpus Growth Projection</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={results.projectionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="age" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `₹${(value / 10000000).toFixed(1)}Cr`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="corpusValue"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    name="Corpus Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h3 className="text-sm font-semibold mb-4">Corpus Composition</h3>
              <MemoizedPieChart
                data={pieData}
                colors={['#3b82f6', '#10b981']}
              />
            </div>
          </div>

          {/* Scenario Comparison */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Scenario Analysis (Different Return Rates)</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {results.scenarios.map((scen) => (
                <div
                  key={scen.name}
                  className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                >
                  <p className="font-semibold text-sm">{scen.name}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Monthly SIP Needed</p>
                  <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                    ₹{scen.monthlySIP.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">Final Corpus</p>
                  <p className="text-sm font-semibold text-green-600 dark:text-green-400">
                    ₹{scen.finalCorpus.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Year-by-Year Projection Table */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Year-by-Year Projection</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-3 py-2 text-left font-semibold">Year</th>
                    <th className="px-3 py-2 text-left font-semibold">Age</th>
                    <th className="px-3 py-2 text-right font-semibold">Annual SIP</th>
                    <th className="px-3 py-2 text-right font-semibold">Corpus Value</th>
                  </tr>
                </thead>
                <tbody>
                  {results.projectionData.slice(0, 10).map((row) => (
                    <tr key={row.year} className="border-b border-gray-200 dark:border-gray-700">
                      <td className="px-3 py-2">{row.year}</td>
                      <td className="px-3 py-2">{row.age}</td>
                      <td className="px-3 py-2 text-right">
                        ₹{row.annualSIP.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                      <td className="px-3 py-2 text-right font-semibold">
                        ₹{row.corpusValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Export Button */}
          <ExportButton
            fileName="retirement-corpus"
            calculatorName="Retirement Corpus Calculator"
            resultElementId="results-section"
            inputsData={inputsData}
          />
        </div>

        {/* Related Calculators */}
        <RelatedCalculators
          calculators={[
            { title: 'SIP Calculator', description: 'Calculate systematic investment plan returns', icon: '📊', href: '/sip-calculator' },
            { title: 'CAGR Calculator', description: 'Measure investment growth rate', icon: '📊', href: '/cagr-calculator' },
            { title: 'EMI Calculator', description: 'Calculate loan EMI and amortization', icon: '🏦', href: '/emi-calculator' },
          ]}
        />
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto mt-12">
        <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <details className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold">How is retirement corpus calculated?</summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              We use the 25x rule: multiply your adjusted annual expenses at retirement by 25. This ensures 25 years of retirement at a safe 4% withdrawal rate, protecting against inflation and longevity risk.
            </p>
          </details>

          <details className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold">Why does inflation matter in retirement planning?</summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Inflation erodes purchasing power. If inflation is 6%, your ₹50,000 monthly expense today becomes ₹80,000+ at retirement. We adjust your expenses to ensure your corpus covers future inflation.
            </p>
          </details>

          <details className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold">What if I already have a retirement corpus?</summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Enter your current corpus. We calculate how much it grows by retirement, then determine the SIP needed to bridge the gap to your target corpus.
            </p>
          </details>

          <details className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold">Can I retire early?</summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Yes! Set your retirement age lower. The calculator will show if your corpus is sufficient. Remember: longer retirement = larger corpus needed due to extended withdrawal period.
            </p>
          </details>

          <details className="border border-gray-200 dark:border-gray-700 p-4 rounded-lg cursor-pointer">
            <summary className="font-semibold">What return rate should I assume?</summary>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Conservative: 6% (FDs/bonds), Moderate: 10% (balanced funds), Aggressive: 14% (equity). Use scenario analysis to see monthly SIP under each rate.
            </p>
          </details>
        </div>
      </div>
    </div>
  );
}

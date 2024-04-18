import { JetBrains_Mono } from 'next/font/google';

const mono = JetBrains_Mono({ 
    subsets: ["latin"],
    weight: ['300']
});

const top = 10;

function generateRandomNumbers(count: number, max: number) {
  const numbers = new Set<number>();
  while (numbers.size < count) {
    numbers.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(numbers);
}

function generateScores(numbers: number[], minScore: number, maxScore: number) {
  return numbers.map(number => ({
    number,
    score: Math.floor(Math.random() * (maxScore - minScore + 1)) + minScore,
  }));
}

export default function Home() {
  const latestNumbers = generateRandomNumbers(top, 90);
  const latest = generateScores(latestNumbers, 85, 99).sort((a, b) => a.number - b.number);

  const winners = generateRandomNumbers(6, 90).sort((a, b) => a - b);

  const forecasts = generateScores(Array.from({length: 90}, (_, i) => i + 1), 0, 99)
    .sort((a, b) => b.score - a.score)
    .slice(0, top);

  return (
    <main>
      <h2>Forecast</h2>
      <small className='text-slate-500'>next lottery 2024.04.20</small>
      <div className="flex justify-center items-center gap-4 max-w-sm flex-wrap">
        {forecasts.map((forecast, index) => (
          <div key={index} className={mono.className}>
            <div className="flex gap-1 justify-center items-center">
              <p>{forecast.number.toString().padStart(2, '0')}</p>
              <small className="px-1 border border-slate-700 rounded-sm">{forecast.score.toString().padStart(2, '0')}</small>
            </div>
          </div>
        ))}
      </div>
      <h2>Latest</h2>
      <small className='text-slate-500'>2024.04.10</small>
      <h3>{winners.join(' - ')}</h3>
      <div className="flex justify-center items-center gap-4 max-w-sm flex-wrap">
        {latest.map((last, index) => (
          <div key={index} className={mono.className}>
            <div className="flex gap-1 justify-center items-center">
              <p className={winners.includes(last.number) ? 'winner' : 'loser'}>
                {last.number.toString().padStart(2, '0')}
              </p>
              <small className="px-1 border border-slate-700 rounded-sm">{last.score.toString().padStart(2, '0')}</small>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}

import { JetBrains_Mono } from 'next/font/google';

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ['300'] });

const top = 10;
const maxNumber = 90;

function getRandomSet(count: number, max: number) {
  const set = new Set<number>();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(set);
}

function getScoredNumbers(numbers: number[], maxScore: number) {
  return numbers.map(number => ({
    number,
    score: Math.floor(Math.random() * maxScore),
  }));
}

const NumberDisplay = ({ number, score, isHighlighted }: { number: number, score: number, isHighlighted?: boolean }) => (
  <div className={mono.className}>
    <div className="flex gap-1 justify-center items-center">
      <p className={isHighlighted ? 'winner' : ''}>{number.toString().padStart(2, '0')}</p>
      <small className="score">{score.toString().padStart(2, '0')}</small>
    </div>
  </div>
);

export default function Home() {
  const numbers = getRandomSet(top, maxNumber);
  const latest = getScoredNumbers(numbers, 100);
  const winners = getRandomSet(6, maxNumber).sort((a, b) => a - b);

  const forecasts = getScoredNumbers(Array.from({ length: maxNumber }, (_, i) => i + 1), 100)
    .sort((a, b) => b.score - a.score)
    .slice(0, top);

  return (
    <main>
      <h2>Forecast</h2>
      <small className='text-slate-500'>Next lottery: 2024.04.20</small>
      <div className="grid max-w-sm">
        {forecasts.map((forecast, index) => 
          <NumberDisplay key={index} number={forecast.number} score={forecast.score} />
        )}
      </div>
      <h2>Latest</h2>
      <small className='text-slate-500'>2024.04.10</small>
      <h3>{winners.join(' - ')}</h3>
      <div className="grid max-w-sm">
        {latest.map((item, index) => 
          <NumberDisplay key={index} number={item.number} score={item.score} isHighlighted={winners.includes(item.number)} />
        )}
      </div>
    </main>
  )
}

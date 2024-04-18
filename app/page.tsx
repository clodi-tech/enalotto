import { JetBrains_Mono } from 'next/font/google';

const mono = JetBrains_Mono({ 
    subsets: ["latin"],
    weight: ['300']
});

const top = 10;

export default function Home() {
  const latest = Array.from({length: top}, (_, i) => ({
    number: Math.floor(Math.random() * 90) + 1,
    score: Math.floor(Math.random() * 100),
  }));

  // generate an array of 6 random numbers
  const winners = Array.from({length: 6}, () => Math.floor(Math.random() * 90) + 1);
  winners.sort((a, b) => a - b);

  const forecasts = Array.from({length: 90}, (_, i) => ({
    number: i + 1,
    score: Math.floor(Math.random() * 100),
  }));

  const topForecasts = forecasts.sort((a, b) => b.score - a.score).slice(0, top);

  return (
    <main>
      <h2>Forecast</h2>
      <small className='text-slate-500'>next lottery 2024.04.20</small>
      <div className="flex justify-center items-center gap-4 max-w-sm flex-wrap">
        {topForecasts.map((forecast, index) => (
          <div key={index} className={mono.className}>
            <div className="flex gap-1 justify-center items-center">
              <p>{forecast.number.toString().padStart(2, '0')}</p>
              <small className="px-1 border border-slate-700 rounded-sm">{forecast.score.toString().padStart(2, '0')}</small>
            </div>
          </div>
        ))}
      </div>
      <h2>Latest</h2>
      <h3>{winners.join(' - ')}</h3>
      <small className='text-slate-500'>2024.04.10</small>
      <div className="flex justify-center items-center gap-4 max-w-sm flex-wrap">
        {latest.map((forecast, index) => (
          <div key={index} className={mono.className}>
            <div className="flex gap-1 justify-center items-center">
              <p>{forecast.number.toString().padStart(2, '0')}</p>
              <small className="px-1 border border-slate-700 rounded-sm">{forecast.score.toString().padStart(2, '0')}</small>
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}
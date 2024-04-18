export default function Home() {
  const forecasts = Array.from({length: 90}, (_, i) => ({
    number: i + 1,
    score: Math.floor(Math.random() * 101),
  }));

  const topForecasts = forecasts.sort((a, b) => b.score - a.score).slice(0, 10);

  return (
    <main>
      <h1>Forecast</h1>
      <h2>top 10 for the next lottery</h2>
      <small>2024.04.20</small>
      <div className="flex flex-col justify-center items-center gap-2">
        {topForecasts.map((forecast, index) => (
          <div key={index} className="flex gap-2 justify-center items-center">
            <small>{(index+1).toString().padStart(2, '0')}.</small>
            <p>{forecast.number.toString().padStart(2, '0')}</p>
            <small className="px-1 border border-slate-700 rounded-sm">{forecast.score.toString().padStart(2, '0')}</small>
          </div>
        ))}
      </div>
    </main>
  )
}
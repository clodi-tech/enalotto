export default function Home() {
  const numbers = Array.from({length: 10}, () => Math.floor(Math.random() * 90) + 1);

  return (
    <main>
      <h1>Forecast</h1>
      <h2>top 10 for the next lottery</h2>
      <small>2024.04.20</small>
      <div className="flex flex-col justify-center items-center gap-2">
        {numbers.map((number, index) => (
          <div key={index} className="flex gap-2 justify-center items-center">
            <small>{(index+1).toString().padStart(2, '0')}.</small>
            <p>{number.toString().padStart(2, '0')}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
import { JetBrains_Mono } from 'next/font/google';
import { sql } from '@vercel/postgres';

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

async function insertForecast(forecasts: { number: number, score: number }[]) {
  const response = await sql`
    INSERT INTO forecasts (
        num_1, score_1,
        num_2, score_2,
        num_3, score_3,
        num_4, score_4,
        num_5, score_5,
        num_6, score_6,
        num_7, score_7,
        num_8, score_8,
        num_9, score_9,
        num_10, score_10
    ) VALUES (
        ${forecasts[0].number}, ${forecasts[0].score},
        ${forecasts[1].number}, ${forecasts[1].score},
        ${forecasts[2].number}, ${forecasts[2].score},
        ${forecasts[3].number}, ${forecasts[3].score},
        ${forecasts[4].number}, ${forecasts[4].score},
        ${forecasts[5].number}, ${forecasts[5].score},
        ${forecasts[6].number}, ${forecasts[6].score},
        ${forecasts[7].number}, ${forecasts[7].score},
        ${forecasts[8].number}, ${forecasts[8].score},
        ${forecasts[9].number}, ${forecasts[9].score}
    )
  `;
  console.log('Forecast successfully inserted', response);
}

const NumberDisplay = ({ number, score, isHighlighted }: { number: number, score: number, isHighlighted?: boolean }) => (
  <div className={mono.className}>
    <div className="flex gap-1 justify-center items-center">
      <p className={isHighlighted ? 'winner' : ''}>{number.toString().padStart(2, '0')}</p>
      <small className="score">{score.toString().padStart(2, '0')}</small>
    </div>
  </div>
);

export default async function Home() {
  const numbers = getRandomSet(top, maxNumber);
  const latest = getScoredNumbers(numbers, 100)
    .sort((a, b) => a.number - b.number);
  
  const winners = getRandomSet(6, maxNumber).sort((a, b) => a - b);

  const forecasts = getScoredNumbers(Array.from({ length: maxNumber }, (_, i) => i + 1), 100)
    .sort((a, b) => b.score - a.score)
    .slice(0, top);

  async function handleSubmit(formData: FormData) {
    "use server"
    console.log(formData.get('i'));
    console.log(formData.get('ii'));
    console.log(formData.get('iii'));
    console.log(formData.get('iv'));
    console.log(formData.get('v'));
    console.log(formData.get('vi'));
  }

  return (
    <main>
      <div className='flex flex-col justify-center items-center gap-2 border border-slate-700 rounded-lg py-4'>
        <h2>Forecast</h2>
        <small className='text-slate-500'>Next lottery 2024.04.20</small>
        <div className="grid max-w-sm">
          {forecasts.map((forecast, index) => 
            <NumberDisplay key={index} number={forecast.number} score={forecast.score} />
          )}
        </div>
      </div>
      <div className={mono.className}>
        <form action={handleSubmit} className='flex gap-1'>
          <input name='i' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
          <input name='ii' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
          <input name='iii' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
          <input name='iv' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
          <input name='v' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
          <input name='vi' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
          <button type="submit" className='h-9 w-11 bg-white text-gray-900 rounded-md'>add</button>
        </form>
      </div>
      <div className='flex flex-col justify-center items-center gap-2 border border-slate-700 rounded-lg py-4'>
        <h2>Latest</h2>
        <small className='text-slate-500'>2024.04.10</small>
        <h3>{winners.join(' - ')}</h3>
        <div className="grid max-w-sm">
          {latest.map((item, index) => 
            <NumberDisplay key={index} number={item.number} score={item.score} isHighlighted={winners.includes(item.number)} />
          )}
        </div>
      </div>
    </main>
  )
}

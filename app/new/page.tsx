import { JetBrains_Mono } from 'next/font/google';
import { sql } from '@vercel/postgres';

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ['300'] });

const pin = process.env.PIN;

function getScoredNumbers(numbers: number[], maxScore: number) {
    return numbers.map(number => ({
      number,
      score: Math.floor(Math.random() * maxScore),
    }));
  }

function NextLottery({ lottery, forecast, indices}: { lottery: any, forecast: any, indices: number[] }) {
    return (
        <div className='flex flex-col justify-center items-center gap-2 border border-slate-700 rounded-lg py-4'>
            <h2>next lottery</h2>
            <small className='text-slate-500'>{lottery.id}</small>
            <div className="grid max-w-sm">
                {indices.map(index => (
                    <div key={index} className={mono.className}>
                        <div className="flex gap-1 justify-center items-center">
                            <p>{forecast[`num_${index}`].toString().padStart(2, '0')}</p>
                            <small className="score">{forecast[`score_${index}`].toString().padStart(2, '0')}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

async function handleSubmit(formData: FormData) {
    "use server"
    console.log(formData.get('i'));
    console.log(formData.get('ii'));
    console.log(formData.get('iii'));
    console.log(formData.get('iv'));
    console.log(formData.get('v'));
    console.log(formData.get('vi'));
    console.log(formData.get('j'));
    console.log(formData.get('ss'));
    console.log(formData.get('pin'));

    // generate new forecast
    const forecasts = getScoredNumbers(Array.from({ length: 90 }, (_, i) => i + 1), 100)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    
    // insert the forecast into the database
    const { rows } = await sql`
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
    console.log('Forecast successfully inserted', rows);

}

function FormWinners(){
    return (
        <div className={mono.className}>
            <form action={handleSubmit} className='flex flex-col justify-center items-center gap-4'>
                <div className='flex gap-3'>
                    <input name='i' type="text" maxLength={2} placeholder="i" />
                    <input name='ii' type="text" maxLength={2} placeholder="ii" />
                    <input name='iii' type="text" maxLength={2} placeholder="iii" />
                    <input name='iv' type="text" maxLength={2} placeholder="iv" />
                    <input name='v' type="text" maxLength={2} placeholder="v" />
                    <input name='vi' type="text" maxLength={2} placeholder="vi" />
                </div>
                <div className='flex gap-3'>
                    <input name='j' type="text" maxLength={2} placeholder="j" />
                    <input name='ss' type="text" maxLength={2} placeholder="ss" />
                    <input name='pin' type="password" maxLength={8} className='w-20' placeholder='pin' />
                    <button type="submit" className='h-9 w-11 bg-white text-gray-900 rounded-md'>add</button>
                </div>
            </form>
      </div>
    )
}

export default async function Page() {
    // get the next lottery and the forecast
    const { rows: [next] } = await sql`SELECT * FROM lottery WHERE forecast_id is not null AND winners_id is null`;
    const { rows: [forecast] } = await sql`SELECT * FROM forecasts WHERE id = ${next.forecast_id}`;

    // get the last lottery and the winners
    const { rows: [last] } = await sql`SELECT * FROM lottery WHERE forecast_id is not null AND winners_id is not null ORDER BY id DESC LIMIT 1`;
    // const { rows: [winners] } = await sql`SELECT * FROM winners WHERE id = ${last.winners_id}`;

    // setup the indices for the forecast pairs
    const indices = Array.from({ length: 10 }, (_, i) => i + 1);

    return(
        <main>
            <NextLottery lottery={next} forecast={forecast} indices={indices} />
            <FormWinners />
            {JSON.stringify(last)}
        </main>
    )
}
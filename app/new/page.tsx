import { JetBrains_Mono } from 'next/font/google';
import { sql } from '@vercel/postgres';

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ['300'] });

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

export default async function Page() {
    // get the forecast id from the next lottery
    const { rows: [lottery] } = await sql`SELECT * FROM lottery WHERE forecast_id is not null AND winners_id is null`;

    // get the forecast numbers
    const { rows: [forecast] } = await sql`SELECT * FROM forecasts WHERE id = ${lottery.forecast_id}`;

    // setup the indices for the forecast pairs
    const indices = Array.from({ length: 10 }, (_, i) => i + 1);

    return(
        <main>
            <NextLottery lottery={lottery} forecast={forecast} indices={indices} />
        </main>
    )
}
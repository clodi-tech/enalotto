import { JetBrains_Mono } from 'next/font/google';
import { sql } from '@vercel/postgres';

const mono = JetBrains_Mono({ subsets: ["latin"], weight: ['300'] });

const pin = process.env.PIN;

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
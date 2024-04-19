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
                <div className='flex gap-1'>
                    <input name='i' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
                    <input name='ii' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
                    <input name='iii' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
                    <input name='iv' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
                    <input name='v' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
                    <input name='vi' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
                </div>
                <div className='flex gap-1'>
                    <input name='j' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
                    <input name='ss' type="text" maxLength={2} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
                    <input name='pin' type="password" maxLength={8} className='h-9 w-11 border-b-2 border-gray-400 bg-transparent px-3 py-1 text-sm focus:border-none focus:outline-none focus:ring-0'/>
                    <button type="submit" className='h-9 w-11 bg-white text-gray-900 rounded-md'>add</button>
                </div>
            </form>
      </div>
    )
}

export default async function Page() {
    // get the forecast id from the next lottery
    const { rows: [next] } = await sql`SELECT * FROM lottery WHERE forecast_id is not null AND winners_id is null`;

    // get the last lottery
    const { rows: [last] } = await sql`SELECT * FROM lottery WHERE forecast_id is not null AND winners_id is not null ORDER BY id DESC LIMIT 1`;

    // get the forecast numbers
    const { rows: [forecast] } = await sql`SELECT * FROM forecasts WHERE id = ${next.forecast_id}`;

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
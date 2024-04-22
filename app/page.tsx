// Import necessary modules and styles
import { JetBrains_Mono } from 'next/font/google';
import { sql } from '@vercel/postgres';
import { revalidatePath } from 'next/cache';

// Set up a custom font using JetBrains Mono
const mono = JetBrains_Mono({ subsets: ["latin"], weight: ['300'] });

// Access a sensitive PIN from environment variables
const pin = process.env.PIN;

// Function to generate an array of scored numbers for the lottery
function getScoredNumbers(numbers: number[], maxScore: number) {
    return numbers.map(number => ({
      number,
      score: Math.floor(Math.random() * maxScore), 
    }));
}

// Unified Component to display lottery draw information
function LotteryDisplay({ title, lottery, forecast, indices, winners }: { title: string, lottery: any, forecast: any, indices: number[], winners?: any }) {
    // Create a set of winner numbers for easy comparison if winners are provided
    const winnerNumbers = winners ? new Set([
        winners.i, winners.ii, winners.iii, winners.iv,
        winners.v, winners.vi, winners.j, winners.ss
    ].map(String)) : new Set();

    // Determine if the number is a winning number
    const isWinner = (number: string) => winners && winnerNumbers.has(number);

    return (
        <div className='flex flex-col justify-center items-center gap-2 border border-slate-700 rounded-lg py-4'>
            <h2>{title}</h2>
            <small className='text-slate-500'>{lottery.id}</small>

            {/* Conditionally render the list of winners if available */}
            {winners && (
                <h3>
                    {winners.i} - {winners.ii} - {winners.iii} - {winners.iv} - {winners.v} - {winners.vi} - {winners.j} - {winners.ss}
                </h3>
            )}
                
            {/* Render the forecast numbers with their scores */}
            <div className="grid max-w-sm">
                {indices.map(index => (
                    <div key={index} className={mono.className}>
                        <div className="flex gap-1 justify-center items-center">
                            <p className={isWinner(forecast[`num_${index}`].toString()) ? 'winner' : ''}>
                                {forecast[`num_${index}`].toString().padStart(2, '0')}
                            </p>
                            <small className="score">{forecast[`score_${index}`].toString().padStart(2, '0')}</small>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Use the unified component for both scenarios
function NextLottery({ lottery, forecast, indices }: { lottery: any, forecast: any, indices: number[] }) {
    return <LotteryDisplay title="Next Lottery" lottery={lottery} forecast={forecast} indices={indices} />;
}

function LastLottery({ lottery, forecast, winners, indices }: { lottery: any, forecast: any, winners: any, indices: number[] }) {
    return <LotteryDisplay title="Last Lottery" lottery={lottery} forecast={forecast} winners={winners} indices={indices} />;
}

// Function to handle the submission of winners form data
async function handleSubmit(formData: FormData) {
    "use server"

    // Verify that the submitted PIN matches the expected one
    if(formData.get('pin') !== pin) return;

    // Get the form data
    const winners = {
        i: String(formData.get('i')),
        ii: String(formData.get('ii')),
        iii: String(formData.get('iii')),
        iv: String(formData.get('iv')),
        v: String(formData.get('v')),
        vi: String(formData.get('vi')),
        j: String(formData.get('j')),
        ss: String(formData.get('ss')),
    };
    
    // Insert the winners into the database and log the insertion
    const { rows: winners_rows } = await sql`
        INSERT INTO winners (
            i, ii, iii, iv, v, vi, j, ss
        ) VALUES (
            ${winners.i}, ${winners.ii}, ${winners.iii}, ${winners.iv},
            ${winners.v}, ${winners.vi}, ${winners.j}, ${winners.ss}
        ) RETURNING id;
    `;
    console.log('Winners successfully inserted', winners_rows);

    // Update the lottery table with the new winners and log the update
    const { rows: lottery_first } = await sql`
        UPDATE lottery
        SET winners_id = ${winners_rows[0].id}
        WHERE forecast_id is not null AND winners_id is null
        RETURNING *;
    `;
    console.log('Lottery successfully updated', lottery_first);

    // Generate new forecast numbers for the next lottery
    const forecasts = getScoredNumbers(Array.from({ length: 90 }, (_, i) => i + 1), 100)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    
    // Insert the new forecast into the database and log the action
    const { rows: forecasts_rows } = await sql`
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
        ) RETURNING id;
    `;
    console.log('Forecast successfully inserted', forecasts_rows);

    // Update the lottery table with the new forecast and log the action
    const { rows: lottery_second } = await sql`
        UPDATE lottery
        SET forecast_id = ${forecasts_rows[0].id}
        WHERE id = (
            SELECT id FROM lottery
            WHERE forecast_id IS NULL AND winners_id IS NULL
            ORDER BY id ASC
            LIMIT 1
        )
        RETURNING *;
    `;
    console.log('Lottery successfully updated', lottery_second);

    // Trigger a revalidation in Next.js to reflect the updated data
    revalidatePath('/');
}

// Form component for entering the lottery winners
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

// Main page function to render the lottery components
export default async function Page() {
    // Query the database for the next and last lottery details
    const { rows: [next] } = await sql`SELECT * FROM lottery WHERE forecast_id is not null AND winners_id is null`;
    const { rows: [forecast_next] } = await sql`SELECT * FROM forecasts WHERE id = ${next.forecast_id}`;

    const { rows: [last] } = await sql`SELECT * FROM lottery WHERE forecast_id is not null AND winners_id is not null ORDER BY id DESC LIMIT 1`;
    const { rows: [winners] } = await sql`SELECT * FROM winners WHERE id = ${last.winners_id}`;
    const { rows: [forecast_last] } = await sql`SELECT * FROM forecasts WHERE id = ${last.forecast_id}`;

    // Setup indices for displaying forecast pairs
    const indices = Array.from({ length: 10 }, (_, i) => i + 1);

    return(
        <main>
            <NextLottery lottery={next} forecast={forecast_next} indices={indices} />
            <FormWinners />
            <LastLottery lottery={last} forecast={forecast_last} winners={winners} indices={indices} />
        </main>
    )
}

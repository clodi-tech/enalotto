export default function Footer() {
    return (
        <footer className='p-4 gap-2 flex flex-col justify-center items-center'>
          <div className="gap-1 flex">
            <p>created by</p>
            <a className="underline underline-offset-2" href='https://clodi.tech' target='_blank' rel="noopener">clodi</a>
          </div>
          <p className='cursor-help'>© 2092</p>
        </footer>
    );
}
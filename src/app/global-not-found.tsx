import './globals.css'
import { Inter } from 'next/font/google'
import type { Metadata } from 'next'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
 
const inter = Inter({ subsets: ['latin'] })
 
export const metadata: Metadata = {
  title: '404 - Page Not Found',
  description: 'The page you are looking for does not exist.',
}
 
export default function GlobalNotFound() {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <div className="flex flex-col items-center justify-center min-h-[70vh] text-center space-y-4">
        
        <h1 className="text-4xl mt-30 font-semibold "><span className='text-red-500'>404</span> Page not found.</h1>
        <p className="text-gray-500">Browser our collections to find something you love!</p>
        <img
          src="/404notfound.png"
          alt="Empty Cart"
          className="w-100 h-100"
        />
        <Link href="/">
          <Button className="mt-3">Back to Home</Button>
        </Link>
      </div>
      </body>
    </html>
  )
}
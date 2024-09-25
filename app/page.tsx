import React from 'react'
import {Button} from '@/components/ui/button'
import Link from 'next/link'

export default function page() {
  return (
    <div className="flex space-x-4 bg-slate-600">
      <Link href="/Amali"> <Button className='bg-gray-950 p-12'>Amali</Button></Link>
      <Link href="/Piggy"> <Button className='bg-gray-950 p-12'>Piggy</Button></Link>
    </div>
  )
}

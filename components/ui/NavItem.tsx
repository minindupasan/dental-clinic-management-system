import Link from 'next/link'
import React from 'react'
import { Button } from './button'

export default function NavItem(
    {itemName, itemPath}: {itemName: string, itemPath: string}
) {
  return (
    <Link href={itemPath}> <Button className='bg-gray-950 p-12'>{itemName}</Button></Link>
  )
}

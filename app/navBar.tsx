import NavItem from '@/components/ui/NavItem'
import React from 'react'

const navItems = [
    {itemName: 'Amali', itemPath: '/Amali'},
    {itemName: 'Piggy', itemPath: '/Piggy'},
    {itemName: 'Moksha', itemPath: '/Moksha'},
    {itemName: 'Kosthapal', itemPath: '/Kosthapal'},
    {itemName: 'Nayantha', itemPath: '/Nayantha'},
]

export default function navBar() {
  return (

    <div className="flex space-x-4 bg-slate-600">
        {navItems.map((navItem) => (
            <NavItem itemName={navItem.itemName} itemPath={navItem.itemPath} key={navItem.itemName}/>
        ))}
  </div>
  )
}

'use client'
import { useState } from "react"
import Link from "next/link"
import { usePathname } from 'next/navigation'
import { SignOutButton } from "@/components/SignOutButton"

export default function DashboardLayout({ children }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false)
  const Links = [
    {
        name:"🏠 الرئيسية",
        path: "/dashboard"
    },
    {
        name:"📝 الطلبيات",
        path: "/dashboard/restaurants/orders"
    },
    {
        name:"🍔🍟 المطاعم والوجبات",
        path: "/dashboard/restaurants"
    },
    {
        name:"👷🏻‍♂️ إدارة المطاعم والوجبات",
        path: "/dashboard/restaurants/add"
    },
  ]
  const closeSidebar = () => {
    if (window.innerWidth < 768) {
      setIsOpen(false)
    }
  }
  
  return (
    <div dir="rtl" className="flex min-h-screen">
      
      
      <aside className={`fixed top-0 right-0 h-full w-64 bg-gray-800 text-white p-6 space-y-4 z-40 transform transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'} md:translate-x-0 md:sticky md:h-screen md:block`}>
        <h2 className="text-xl font-bold mb-6">لوحة التحكم</h2>
        <nav className="space-y-2">
          {
            Links.map((link,key) => {
              return <Link onClick={closeSidebar} key={key} href={link.path} className={`${link.path === pathname && "bg-gray-700"} block hover:bg-gray-700 px-3 py-2 rounded`}>{link.name}</Link>
            })
          }
          
          <SignOutButton />
        </nav>
      </aside>


      {/* Overlay background on small screens */}
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 backdrop-blur-xs bg-opacity-50 z-30 md:hidden" />}

      {/* Main content */}
      <div className="flex-1 p-6 bg-gray-50 overflow-auto h-screen">
        {/* Header with toggle button on small screens */}
        <button
          className="md:hidden mb-4 bg-gray-800 text-white px-4 py-2 rounded"
          onClick={() => setIsOpen(true)}
        >
          ☰ القائمة
        </button>

        {children}
      </div>
    </div>
  )
}

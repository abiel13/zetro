'use client'
import { sidebarLinks } from '@/constants/constants.index'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'

const Bottombar = () => {
const pathname = usePathname()

  return (
    <section className='bottombar'>
      <div className="bottombar_container">
      {sidebarLinks.map((item, i) => {
          const isActive =
            (pathname.includes(item.route) && item.route.length > 1) ||
            item.route == pathname;
          return (
            <Link
              className={`bottombar_link ${isActive && "bg-primary-500"}`}
              key={i}
              href={item.route}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={23}
                height={23}
              />

            </Link>
          );
        })}
      </div>
    </section>
  )
}

export default Bottombar

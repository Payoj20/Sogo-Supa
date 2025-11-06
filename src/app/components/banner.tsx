import Image from 'next/image'
import React from 'react'

const Banner = () => {
  return (
    <div className="relative w-screen left-1/2 right-1/2 -mx-[50vw] h-[180px] sm:h-[300px] md:h-[400px] lg:h-[400px] xl:h-[400px] flex justify-center items-center overflow-hidden mt-10 sm:mt-16">
      <a href="/products">
      <Image
        src="/banner5.png"
        alt="Ad Banner"
        fill
        className="object-contain object-center transition-transform duration-700 group-hover:scale-105"
        priority
        sizes="100vw"
        
      />
      </a>
      </div>
  )
}

export default Banner
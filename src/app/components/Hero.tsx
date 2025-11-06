"use client";

import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Image from "next/image";
import React from "react";
import Autoplay from "embla-carousel-autoplay";

const slides = [
  { src: "/banner1.png" },
  { src: "/banner2.png" },
  { src: "/banner3.png" },
  { src: "/banner4.png" },
  { src: "/banner5.png" },
  { src: "/banner6.png" },
];

const Hero = () => {
  const plugin = React.useRef(
    Autoplay({
      delay: 3000,
      stopOnInteraction: false,
    })
  );

  return (
    <section className="relative w-full overflow-hidden bg-gray-100 pt-14">
      <Carousel
        plugins={[plugin.current]}
        onMouseEnter={() => plugin.current.stop()}
        onMouseLeave={() => plugin.current.play()}
        className="w-full"
      >
        <CarouselContent>
          {slides.map((slide, index) => (
            <CarouselItem key={index} className="p-0">
              <div className="relative w-full h-[180px] sm:h-[300px] md:h-[400px] lg:h-[400px] xl:h-[400px]">
                <a href="/products">
                <Image
                  src={slide.src}
                  alt="banner"
                  fill
                  sizes="100vw"
                  className="object-contain" 
                  priority={index === 0}
                  unoptimized
                />
                </a>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </section>
  );
};

export default Hero;

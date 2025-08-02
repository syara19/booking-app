"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Navbar } from "@/components/ui/Navbar";
import { Hotel } from "@/lib/generated/prisma";
import { BedDouble,  MapPin, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Home() {
  const [hotels, setHotels] = useState<Hotel[]>([]);

  useEffect(() => {
    fetch("/api/hotels")
      .then((res) => res.json())
      .then((data) => setHotels(data));
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-grow">
        <div className="relative isolate pt-14">
          <Image
            src="/heroimg.jpg"
            alt="Luxury hotel lounge"
            data-ai-hint="hotel lounge"
            layout="fill"
            objectFit="cover"
            className="absolute inset-5 -z-10 h-56 w-full object-cover"
            aria-hidden="true"
          />
          <div className="absolute inset-0 -z-10 bg-black/50" aria-hidden="true" />

          <div className="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-headline">
                Find Your Next Perfect Stay
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-300 font-body">
                Discover and book exclusive hotels at the best prices. Your unforgettable journey starts here with StaySavvy.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Button className="bg-white/70 text-black dark:bg-black/70 dark:text-white hover:dark:bg-black/40 hover:bg-white/40" disabled asChild size="lg">
                  <Link href="/dashboard">
                    Get Started
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>

        <section className="py-20 sm:py-28 bg-background">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:mx-0">
              <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl font-headline">Featured Stays</h2>
              <p className="mt-4 text-lg leading-8 text-muted-foreground font-body">
                Explore our handpicked selection of top-rated hotels.
              </p>
            </div>
            <div className="mx-auto mt-10 grid  max-w-2xl grid-cols-1 gap-x-8 gap-y-16 border-t border-border pt-10 sm:mt-16 sm:pt-16 lg:mx-0 lg:max-w-none lg:grid-cols-4">
              {hotels.slice(0, 4).map((hotel) => (
                <Card key={hotel.id} className="flex p-0 flex-col overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
                  <div className="relative h-48 w-full">
                    <Image
                      src={hotel?.imageUrl ?? "https://placehold.co/1920x1080.png"}
                      alt={hotel.name}
                      data-ai-hint="hotel exterior"
                      fill
                      className="aspect-16/9 object-fill"
                    />
                  </div>
                  <CardContent className="flex-grow px-4 pt-0 pb-4 flex flex-col">
                    <div className="flex-grow">
                      <div className="flex items-center text-sm text-muted-foreground">
                        <MapPin className="mr-1.5 h-4 w-4" />
                        {hotel.city}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold leading-6 text-foreground font-headline">
                        {hotel.name}
                      </h3>
                      <div className="mt-2 flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`h-5 w-5 ${i < +hotel.starRating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" />
                          ))}
                        </div>
                      </div>
                      <p className="mt-3 text-base text-muted-foreground font-body line-clamp-2">{hotel.description}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-background border-t">
        <div className="mx-auto max-w-7xl overflow-hidden px-6 py-12 lg:px-8">
          <p className="mt-10 text-center text-xs leading-5 text-muted-foreground">
            Copyright&copy; {new Date().getFullYear()}.
          </p>
        </div>
      </footer>
    </>
  );
}

"use client";

import { useRef } from "react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../ui/carousel";
import { Quote, Star } from "lucide-react";

interface Testimonial {
  name: string;
  location: string;
  rating: number;
  review: string;
  date: string;
  image?: string;
}

const Testimonials: Testimonial[] = [
  {
    name: "Rajith Fernando",
    location: "Colombo",
    rating: 5,
    review:
      "Excellent service! Found the perfect Toyota Prius for my family. The online booking system made everything so convenient.",
    date: "2 weeks ago",
    image: "/professional-sri-lankan-businessman-customer-portr.jpg",
  },
  {
    name: "Nimal Perera",
    location: "Nugegoda",
    rating: 5,
    review:
      "Very professional team. They helped me understand every detail about the Honda Civic I purchased. Highly recommend!",
    date: "1 month ago",
    image: "/satisfied-male-customer-with-car-keys-smiling.jpg",
  },
  {
    name: "Samantha Silva",
    location: "Kandy",
    rating: 4,
    review:
      "Great experience overall. The consultation service was particularly helpful in making my decision. Will definitely come back.",
    date: "3 weeks ago",
    image: "/professional-woman-customer-happy-with-new-car.jpg",
  },
  {
    name: "Priya Wickramasinghe",
    location: "Galle",
    rating: 5,
    review:
      "Best car dealership I've dealt with! Transparent pricing, no hidden charges, and excellent after-sales support.",
    date: "1 week ago",
    image: "/happy-female-customer-in-front-of-dealership.jpg",
  },
  {
    name: "Kasun Jayawardena",
    location: "Colombo",
    rating: 5,
    review:
      "The technical specialist provided valuable insights. Found exactly what I was looking for within my budget.",
    date: "2 months ago",
    image: "/satisfied-young-man-with-new-car-showing-thumbs-up.jpg",
  },
];

export default function TestimonialsCarousel() {
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 4000,
    }),
  );

  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      plugins={[autoplayPlugin.current]}
      className="w-full fade-in-up delay-200"
    >
      <CarouselContent>
        {Testimonials.map((testimonial, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
            <div className="p-4">
              <div className="bg-card rounded-lg p-6 border border-border h-full flex flex-col">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary/20"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < testimonial.rating
                              ? "fill-yellow-500 text-yellow-500"
                              : "fill-gray-300 text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <p className="font-semibold text-foreground">
                      {testimonial.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.location}
                    </p>
                  </div>
                  <Quote className="h-8 w-8 text-primary/20 shrink-0" />
                </div>

                <p className="text-muted-foreground mb-4 grow leading-relaxed">
                  {testimonial.review}
                </p>

                <div className="pt-4 border-t border-border">
                  <span className="text-xs text-muted-foreground">
                    {testimonial.date}
                  </span>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="-left-4" />
      <CarouselNext className="-right-4" />
    </Carousel>
  );
}

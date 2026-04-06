interface Testimonial {
  name: string;
  location: string;
  rating: number;
  review: string;
  date: string;
  image?: string;
}

export const Testimonials: Testimonial[] = [
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
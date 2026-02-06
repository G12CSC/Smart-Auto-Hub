import { title } from "process";


export const adminHeaderMenuData = [
    { title: "Consultation Bookings", href: "/admin?tab=requests" },
    { title: "Vehicle Management", href: "/admin?tab=vehicles" },
    { title: "Video Reviews", href: "/admin?tab=videos" },
    { title: "Newsletter", href: "/admin?tab=newsletter" },
    { title: "Branch Inventory", href: "/admin?tab=branches" },
];

export const headerMenuData = [
    { title: "Home", href: "/" },
    { title: "Find a car", href: "/vehicles" },
    { title: "Book an Appointment", href: "/consultation" },
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },


];

export const advisorHeaderMenuData = [
    { title: "Bookings", href: "/advisor-dashboard" }, // Links to the main dashboard tab
    { title: "Availability", href: "/advisor-dashboard/availability" }, // Placeholder as requested
];

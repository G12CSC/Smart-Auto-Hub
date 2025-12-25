//Utilities for managing local storage

import { Grid } from "lucide-react";
import { vehicleAPI } from "../api/vehicles";

export const localStorageAPI = {
  //Favourites Management
  getFavourites: () => {
    if (typeof window === "undefined") return [];
    const favourites = localStorage.getItem("favourites");
    return favourites ? JSON.parse(favourites) : [];
  },

  addFavourite: (vehicleId) => {
    const favourites = localStorageAPI.getFavourites();
    if (!favourites.includes(vehicleId)) {
      favourites.push(vehicleId);
      localStorage.setItem("favourites", JSON.stringify(favourites));
    }
    return favourites;
  },

  removeFavourite: (vehicleId) => {
    const favourites = localStorageAPI.getFavourites();
    const updated = favourites.filter((id) => id !== vehicleId);
    localStorage.setItem("favourites", JSON.stringify(updated));
    return updated;
  },

  isFavourite: (vehicleId) => {
    const favourites = localStorageAPI.getFavourites();
    return favourites.includes(vehicleId);
  },

  //Search History Management
  getSearchHistory: () => {
    if (typeof window === "undefined") return [];
    const history = localStorage.getItem("searchHistory");
    return history ? JSON.parse(history) : [];
  },

  addSearchHistory: (searchTerm) => {
    if (!searchTerm || searchTerm.trim() === "") return;

    let history = localStorageAPI.getSearchHistory();
    //Remove if already exists to avoid duplicates
    history = history.filter((term) => term !== searchTerm);
    //Add to beginning
    history.unshift(searchTerm);
    //Keep only last 5 searches
    history = history.slice(0, 5);
    localStorage.setItem("searchHistory", JSON.stringify(history));
    return history;
  },

  clearSearchHistory: () => {
    localStorage.removeItem("searchHistory");
  },

  //Recently Viewed Vehicles
  getRecentlyViewed: () => {
    if (typeof window === "undefined") return [];
    const viewed = localStorage.getItem("recentlyViewed");
    return viewed ? JSON.parse(viewed) : [];
  },

  addRecentlyViewed: (vehicleId) => {
    let viewed = localStorageAPI.getRecentlyViewed();
    //Remove if already exists
    viewed = viewed.filter((id) => id !== vehicleId);
    //Add to beginning
    viewed.unshift(vehicleId);
    //Keep only last 6 vehicles
    viewed = viewed.slice(0, 6);
    localStorage.setItem("recentlyViewed", JSON.stringify(viewed));
    return viewed;
  },

  clearRecentlyViewed: () => {
    localStorage.removeItem("recentlyViewed");
  },

  //User Preferences
  getPreferences: () => {
    if (typeof window === "undefined") return { viewMode: "grid" };
    const prefs = localStorage.getItem("userPreferences");
    return prefs ? JSON.parse(prefs) : { viewMode: "grid" };
  },

  setPreference: (key, value) => {
    const prefs = localStorageAPI.getPreferences();
    prefs[key] = value;
    localStorage.setItem("userPreferences", JSON.stringify(prefs));
    return prefs;
  },

  // Vehicle Reviews Management
  getReviews: (vehicleId) => {
    if (typeof window === "undefined") return [];
    const allReviews = localStorage.getItem("vehicleReviews");
    const reviews = allReviews ? JSON.parse(allReviews) : {};
    return reviews[vehicleId] || [];
  },

  addReview: (vehicleId, review) => {
    const allReviews = localStorage.getItem("vehicleReviews");
    const reviews = allReviews ? JSON.parse(allReviews) : {};
    if (!reviews[vehicleId]) {
      reviews[vehicleId] = [];
    }

    // Add timestamp and unique ID to the review
    const newReview = {
      ...review,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
    };

    reviews[vehicleId].unshift(newReview); // Add new review to the beginning
    localStorage.setItem("vehicleReviews", JSON.stringify(reviews));
    return newReview;
  },

  getAverageRating: (vehicleId) => {
    const reviews = localStorageAPI.getReviews(vehicleId);
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  },

  //Vehicle Comparison Management
  getCompareList: () => {
    if (typeof window === "undefined") return [];
    const compareList = localStorage.getItem("compareList");
    return compareList ? JSON.parse(compareList) : [];
  },

  addToCompare: (vehicle) => {
    const compareList = localStorageAPI.getCompareList();

    // Check if vehicle is already in compare list
    if (compareList.find((v) => v.id === vehicle.id)) {
      return {
        success: false,
        message: "This vehicle is already in your comparison list",
      };
    }

    // Maximum 3 vehicles can be compared
    if (compareList.length >= 3) {
      return {
        success: false,
        message: "You can only compare up to 3 vehicles. Remove one first.",
      };
    }

    compareList.push(vehicle);
    localStorage.setItem("compareList", JSON.stringify(compareList));

    return {
      success: true,
      message: "Vehicle added to comparison",
      data: compareList,
    };
  },

  removeFromCompare: (vehicleId) => {
    const compareList = localStorageAPI.getCompareList();
    const updated = compareList.filter((v) => v.id !== vehicleId);
    localStorage.setItem("compareList", JSON.stringify(updated));
    return updated;
  },

  clearCompareList: () => {
    localStorage.removeItem("compareList");
    return [];
  },

  getNotifications: () => {
    if (typeof window === "undefined")
      return {
        dashboard: { appointments: 0, reviews: 0 },
        admin: { requests: 0, vehicles: 0, videos: 0, newsletter: 0 },
      };
    const notifications = localStorage.getItem("notifications");
    return notifications
      ? JSON.parse(notifications)
      : {
          dashboard: { appointments: 0, reviews: 0 },
          admin: { requests: 0, vehicles: 0, videos: 0, newsletter: 0 },
        };
  },

  setNotifications: (notifications) => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
    return notifications;
  },

  getTotalNotificationCount: () => {
    const notifications = localStorageAPI.getNotifications();
    const dashboardTotal = Object.values(notifications.dashboard).reduce(
      (a, b) => a + b,
      0
    );
    const adminTotal = Object.values(notifications.admin).reduce(
      (a, b) => a + b,
      0
    );
    return dashboardTotal + adminTotal;
  },

  incrementNotification: (panel, section) => {
    const notifications = localStorageAPI.getNotifications();
    if (
      notifications[panel] &&
      typeof notifications[panel][section] === "number"
    ) {
      notifications[panel][section]++;
      localStorageAPI.setNotifications(notifications);
    }
    return notifications;
  },

  clearNotification: (panel, section) => {
    const notifications = localStorageAPI.getNotifications();
    if (
      notifications[panel] &&
      typeof notifications[panel][section] === "number"
    ) {
      notifications[panel][section] = 0;
      localStorageAPI.setNotifications(notifications);
    }
    return notifications;
  },

  clearAllNotifications: () => {
    const notifications = {
      dashboard: { appointments: 0, reviews: 0 },
      admin: { requests: 0, vehicles: 0, videos: 0, newsletter: 0 },
    };
    localStorageAPI.setNotifications(notifications);
    return notifications;
  },
};

export const addToCompare = (vehicle) => {
  return localStorageAPI.addToCompare(vehicle);
};

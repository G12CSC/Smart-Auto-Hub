export default function Loading() {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-950 text-white flex-col gap-6">
      
      {/* 🚗 Car Animation */}
      <div className="relative w-80 h-10 overflow-hidden">
        <div className="absolute animate-car-move text-3xl">
          🚗
        </div>
      </div>

      {/* 🏷️ Company Name */}
      <h1 className="text-2xl md:text-4xl font-bold tracking-wide animate-fade-in">
        Sameera Auto Traders
      </h1>

      {/* 🔄 Loading Text */}
      <p className="text-gray-400 animate-pulse">
        Loading...
      </p>

    </div>
  );
}
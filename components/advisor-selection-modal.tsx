import { useState } from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { AlertCircle, Calendar, CheckCircle, Mail, Phone } from "lucide-react";

interface Advisor {
  id: string;
  name: string;
  image: string;
  rating: number;
  experience: string;
  specialization: string;
  email: string;
  phone: string;
  isAvailable: boolean;
  availableTimes: string[];
}

interface AdvisorSelectionModalProps {
  open: boolean;
  onClose: () => void;
  bookingSlot: string;
  onConfirm: (advisor: Advisor) => void;
}

const mockAdvisors: Advisor[] = [
  {
    id: "1",
    name: "Ahmed Hassan",
    image: "/images/professional-automotive-sales-manager-portrait-sri.jpg",
    rating: 4.9,
    experience: "12 years",
    specialization: "Luxury Vehicles",
    email: "ahmed.hassan@smartautohub.com",
    phone: "+94 701 234 567",
    isAvailable: true,
    availableTimes: ["10:00 AM", "2:00 PM", "4:30 PM"],
  },
  {
    id: "2",
    name: "Priya Sharma",
    image: "/images/professional-automotive-technical-consultant-femal.jpg",
    rating: 4.8,
    experience: "8 years",
    specialization: "Budget & Practical Cars",
    email: "priya.sharma@smartautohub.com",
    phone: "+94 702 234 567",
    isAvailable: false,
    availableTimes: ["11:00 AM Tomorrow", "3:00 PM Tomorrow"],
  },
  {
    id: "3",
    name: "Rajesh Kumar",
    image: "/images/professional-automotive-sales-executive-male-sri-l.jpg",
    rating: 4.7,
    experience: "10 years",
    specialization: "SUVs & Family Vehicles",
    email: "rajesh.kumar@smartautohub.com",
    phone: "+94 703 234 567",
    isAvailable: true,
    availableTimes: ["11:30 AM", "3:30 PM"],
  },
];

export default function AdvisorSelectionModal({
  open,
  onClose,
  bookingSlot,
  onConfirm,
}: AdvisorSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const filteredAdvisors = mockAdvisors.filter((advisor) =>
    advisor.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleSelectAdvisor = (advisor: Advisor) => {
    setSelectedAdvisor(advisor);
    setShowDetail(true);
  };

  const handleConfirm = () => {
    if (selectedAdvisor) {
      onConfirm(selectedAdvisor);
      toast.success(`Booking sent to ${selectedAdvisor.name}`);
      setSelectedAdvisor(null);
      setShowDetail(false);
      onClose();
    }
  };

  const handleReportIssue = () => {
    if (selectedAdvisor) {
      toast.info("Issue reported", {
        description: `Email sent to ${selectedAdvisor.name} about availability`,
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!showDetail ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl animate-text-reveal">
                Select an Advisor
              </DialogTitle>
              <DialogDescription>
                Choose an available advisor for the booking
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Search and Calendar */}
              <div className="flex gap-3">
                <Input
                  placeholder="Search by name"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="animate-slide-in-left"
                />
                <Button
                  variant="outline"
                  size="icon"
                  className="animate-pop-in bg-transparent"
                >
                  <Calendar className="w-4 h-4" />
                </Button>
              </div>

              {/* Trending Advisors */}
              <div className="animate-slide-in-down">
                <h3 className="text-lg font-semibold mb-4 pb-2 border-b-2 border-primary">
                  Available Advisors
                </h3>

                {filteredAdvisors.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {filteredAdvisors.map((advisor, index) => (
                      <div
                        key={advisor.id}
                        className="animate-bounce-in-scale cursor-pointer"
                        style={{
                          animationDelay: `${index * 100}ms`,
                        }}
                        onClick={() => handleSelectAdvisor(advisor)}
                      >
                        <div
                          className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-lg ${
                            advisor.isAvailable
                              ? "border-primary/20 hover:border-primary bg-card"
                              : "border-destructive/20 bg-destructive/5"
                          }`}
                        >
                          <img
                            src={advisor.image || "/placeholder.svg"}
                            alt={advisor.name}
                            className="w-full h-40 object-cover rounded mb-3"
                          />
                          <h4 className="font-semibold text-sm">
                            {advisor.name}
                          </h4>
                          <p className="text-xs text-muted-foreground mb-2">
                            {advisor.specialization}
                          </p>
                          <div className="flex items-center gap-1 mb-2">
                            <span className="text-xs font-medium">
                              ⭐ {advisor.rating}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({advisor.experience})
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-xs">
                            {advisor.isAvailable ? (
                              <CheckCircle className="w-3 h-3 text-green-500" />
                            ) : (
                              <AlertCircle className="w-3 h-3 text-destructive" />
                            )}
                            <span
                              className={
                                advisor.isAvailable
                                  ? "text-green-600 dark:text-green-400"
                                  : "text-destructive"
                              }
                            >
                              {advisor.isAvailable
                                ? "Available"
                                : "Not Available"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-8">
                    No advisors found matching your search
                  </p>
                )}
              </div>
            </div>
          </>
        ) : selectedAdvisor ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl animate-text-reveal">
                {selectedAdvisor.name}
              </DialogTitle>
              <DialogDescription>
                Review advisor details and availability
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 animate-pop-in">
              {/* Advisor Info and Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image and Name */}
                <div className="space-y-4">
                  <img
                    src={selectedAdvisor.image || "/placeholder.svg"}
                    alt={selectedAdvisor.name}
                    className="w-full h-64 object-cover rounded-lg border-2 border-primary/20"
                  />
                  <div className="space-y-2">
                    <p className="text-sm font-semibold text-muted-foreground">
                      Rating
                    </p>
                    <p className="text-2xl font-bold">
                      ⭐ {selectedAdvisor.rating}
                    </p>
                  </div>
                </div>

                {/* Available Times */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-muted-foreground mb-3">
                      Available Times
                    </p>
                    <div className="space-y-2">
                      {selectedAdvisor.availableTimes.map((time, index) => (
                        <div
                          key={index}
                          className="p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-center gap-2"
                        >
                          <Calendar className="w-4 h-4 text-primary" />
                          <span className="text-sm">{time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {!selectedAdvisor.isAvailable && (
                    <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800 flex gap-2">
                      <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-yellow-800 dark:text-yellow-200">
                        Showing this advisor not available at this moment
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Advisor Information */}
              <div className="space-y-4 p-4 rounded-lg border border-primary/20 bg-card">
                <h4 className="font-semibold">Advisor Information</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedAdvisor.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <span>{selectedAdvisor.phone}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-semibold text-muted-foreground">
                      Specialization:
                    </span>
                    <span>{selectedAdvisor.specialization}</span>
                  </div>
                  <div className="flex gap-3">
                    <span className="font-semibold text-muted-foreground">
                      Experience:
                    </span>
                    <span>{selectedAdvisor.experience}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-between pt-4">
                <Button
                  variant="destructive"
                  onClick={handleReportIssue}
                  className="animate-slide-in-left"
                >
                  Report Issue
                </Button>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDetail(false)}
                    className="animate-slide-in-right"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={!selectedAdvisor.isAvailable}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground animate-slide-in-right"
                  >
                    Send to Advisor
                  </Button>
                </div>
              </div>
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

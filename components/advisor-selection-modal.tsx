import { useState, useEffect } from "react";
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
import { AlertCircle, Calendar, CheckCircle, Mail, Phone, Loader2 } from "lucide-react";
import { getAvailableAdvisors } from "@/app/advisor-dashboard/actions";

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
  date: string | Date; // Added date prop
  bookingId?: string; // Added bookingId
  onConfirm: (advisor: Advisor) => void;
}

import { getBookingRejections } from "@/app/advisor-dashboard/actions"; // Import server action

export default function AdvisorSelectionModal({
  open,
  onClose,
  bookingSlot,
  date,
  bookingId,
  onConfirm,
}: AdvisorSelectionModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAdvisor, setSelectedAdvisor] = useState<Advisor | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(false);
  const [rejections, setRejections] = useState<any[]>([]);

  useEffect(() => {
    if (open && date && bookingSlot) {
      const fetchAdvisors = async () => {
        setLoading(true);
        const res = await getAvailableAdvisors(date, bookingSlot);
        if (res.success && res.data) {
          setAdvisors(res.data);
        } else {
          setAdvisors([]);
        }

        if (bookingId) {
          const rejectionRes = await getBookingRejections(bookingId);
          if (rejectionRes.success) {
            setRejections(rejectionRes.data);
          }
        }

        setLoading(false);
      };
      fetchAdvisors();
    }
  }, [open, date, bookingSlot, bookingId]);

  const filteredAdvisors = advisors.filter((advisor) =>
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



  const hasRejected = selectedAdvisor && rejections.some(r => r.advisorId === selectedAdvisor.id);


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
                Choose an available advisor for {bookingSlot} on {new Date(date).toLocaleDateString()}
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

                {loading ? (
                  <div className="flex justify-center py-10">
                    <Loader2 className="animate-spin h-8 w-8 text-primary" />
                  </div>
                ) : filteredAdvisors.length > 0 ? (
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
                          className={`relative p-4 rounded-lg border-2 transition-all hover:shadow-lg ${advisor.isAvailable
                            ? "border-primary/20 hover:border-primary bg-card"
                            : "border-destructive/20 bg-destructive/5"
                            }`}
                        >
                          <div className="h-40 w-full mb-3 bg-secondary rounded overflow-hidden flex items-center justify-center">
                            {advisor.image ? (
                              <img
                                src={advisor.image}
                                alt={advisor.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <CheckCircle className="h-12 w-12 text-muted-foreground opacity-20" />
                            )}
                          </div>
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
                    No advisors available for this time slot.
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
              {hasRejected && (
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/30 border border-orange-200 dark:border-orange-800 flex gap-2 items-center text-orange-800 dark:text-orange-200">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p className="font-medium text-sm">
                    Warning: {selectedAdvisor.name} previously rejected this booking.
                  </p>
                </div>
              )}
              {/* Advisor Info and Availability */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Image and Name */}
                <div className="space-y-4">
                  <div className="w-full h-64 bg-secondary rounded-lg border-2 border-primary/20 flex items-center justify-center overflow-hidden">
                    {selectedAdvisor.image ? (
                      <img
                        src={selectedAdvisor.image}
                        alt={selectedAdvisor.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <CheckCircle className="h-20 w-20 text-muted-foreground opacity-20" />
                    )}
                  </div>
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
                      Selected Slot
                    </p>
                    <div className="space-y-2">
                      <div
                        className="p-3 rounded-lg border border-primary/30 bg-primary/5 flex items-center gap-2"
                      >
                        <Calendar className="w-4 h-4 text-primary" />
                        <span className="text-sm">{bookingSlot}</span>
                      </div>
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

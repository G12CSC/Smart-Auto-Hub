import { useState, useEffect, ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Settings } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";

interface Advisor {
    name: string;
    email: string;
    phone: string;
    specialization: string;
    experience: string;
    rating: number;
    totalBookings: number;
    avatar: string;
}

interface AdvisorEditProfileModalProps {
    advisor: Advisor;
    onSave: (data: Advisor) => void;
}

export function AdvisorEditProfileModal({
    advisor,
    onSave,
}: AdvisorEditProfileModalProps) {
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState<Advisor>(advisor);

    // Sync state if prop changes
    useEffect(() => {
        setFormData(advisor);
    }, [advisor]);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setFormData({ ...formData, avatar: imageUrl });
        }
    };

    const handleSave = () => {
        onSave(formData);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="w-full bg-transparent">
                    <Settings size={16} className="mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-card text-card-foreground border-border">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Edit Profile</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Image Upload */}
                    <div className="flex flex-col items-center gap-4">
                        <div className="h-24 w-24 rounded-full bg-primary flex items-center justify-center overflow-hidden border-2 border-border relative">
                            {formData.avatar?.includes("/") ? (
                                <img
                                    src={formData.avatar}
                                    alt="Avatar"
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <span className="text-primary-foreground font-bold text-2xl">
                                    {formData.avatar}
                                </span>
                            )}
                        </div>
                        <Input
                            id="picture"
                            type="file"
                            accept="image/*"
                            className="w-full max-w-xs cursor-pointer bg-secondary/50"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Name */}
                    <div className="grid gap-2">
                        <label htmlFor="name" className="text-sm font-medium">
                            Full Name
                        </label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) =>
                                setFormData({ ...formData, name: e.target.value })
                            }
                            className="bg-background"
                        />
                    </div>

                    {/* Specialization */}
                    <div className="grid gap-2">
                        <label htmlFor="specialization" className="text-sm font-medium">
                            Position / Specialization
                        </label>
                        <Input
                            id="specialization"
                            value={formData.specialization}
                            onChange={(e) =>
                                setFormData({ ...formData, specialization: e.target.value })
                            }
                            className="bg-background"
                        />
                    </div>

                    {/* Phone */}
                    <div className="grid gap-2">
                        <label htmlFor="phone" className="text-sm font-medium">
                            Phone Number
                        </label>
                        <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) =>
                                setFormData({ ...formData, phone: e.target.value })
                            }
                            className="bg-background"
                        />
                    </div>
                </div>

                <DialogFooter className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setOpen(false)}>
                        Cancel
                    </Button>
                    <Button type="submit" onClick={handleSave}>
                        Save Changes
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

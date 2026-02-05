"use client";

import { useState } from "react";
import { updateAdvisorProfile } from "@/app/advisor-dashboard/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { User, Settings, LogOut, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { signOut } from "next-auth/react";

interface AdvisorProfileProps {
    advisor: {
        id: string;
        name: string | null;
        email: string;
        phone: string | null; // was phone in User, phoneNumber in Admin?
        phoneNumber: string | null;
        position: string | null;
        image: string | null;
        role: string;
        totalBookings?: number;
        rating?: number;
        experience?: string; // Not in schema, mocked or passed?
    };
}

export function AdvisorProfile({ advisor }: AdvisorProfileProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: advisor.name || "",
        position: advisor.position || "",
        phoneNumber: advisor.phoneNumber || advisor.phone || "",
        image: advisor.image || "",
    });

    const handleUpdate = async () => {
        setLoading(true);
        const res = await updateAdvisorProfile(advisor.id, formData);
        setLoading(false);

        if (res.success) {
            toast.success("Profile updated successfully");
            setOpen(false);
        } else {
            toast.error("Failed to update profile");
        }
    };

    const handleLogout = async () => {
        await signOut({ callbackUrl: "/admin/login" });
    };

    return (
        <div className="max-w-2xl mx-auto animate-slideInUp">
            <div className="flex flex-col md:flex-row gap-8 mb-8">
                <div className="flex flex-col items-center">
                    <div className="h-32 w-32 rounded-full bg-secondary flex items-center justify-center border-4 border-background shadow-lg overflow-hidden mb-4">
                        {advisor.image ? (
                            <img src={advisor.image} alt={advisor.name || "Advisor"} className="h-full w-full object-cover" />
                        ) : (
                            <User className="h-12 w-12 text-muted-foreground" />
                        )}
                    </div>
                    <h2 className="text-2xl font-bold">{advisor.name || "Advisor"}</h2>
                    <p className="text-muted-foreground">{advisor.position || advisor.role}</p>
                </div>

                <div className="flex-1 space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-card border border-border rounded-lg p-5 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Total Bookings</p>
                            <p className="text-2xl font-bold">{advisor.totalBookings || 0}</p>
                        </div>
                        <div className="bg-card border border-border rounded-lg p-5 text-center">
                            <p className="text-sm text-muted-foreground mb-1">Rating</p>
                            <p className="text-2xl font-bold">⭐ {advisor.rating || "N/A"}</p>
                        </div>
                    </div>

                    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
                        <h3 className="font-semibold border-b border-border pb-2">Contact Information</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Email</p>
                                <p className="font-medium truncate" title={advisor.email}>{advisor.email}</p>
                            </div>
                            <div>
                                <p className="text-xs text-muted-foreground uppercase tracking-wider">Phone</p>
                                <p className="font-medium">{advisor.phoneNumber || advisor.phone || "Not set"}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" className="h-12">
                            <Settings className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Update your profile information visible to customers.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="position">Position</Label>
                                <Input
                                    id="position"
                                    value={formData.position}
                                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                                    placeholder="e.g. Senior Technical Advisor"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input
                                    id="phone"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    placeholder="+94 ..."
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="image">Profile Image URL</Label>
                                <Input
                                    id="image"
                                    value={formData.image}
                                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                    placeholder="https://..."
                                />
                                <p className="text-xs text-muted-foreground">Enter a public URL for your profile photo.</p>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                            <Button onClick={handleUpdate} disabled={loading}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Changes
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>

                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" className="h-12">
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Logout Confirmation</AlertDialogTitle>
                            <AlertDialogDescription>
                                Are you sure you want to logout?
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="flex justify-end gap-2">
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleLogout}>Logout</AlertDialogAction>
                        </div>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </div>
    );
}

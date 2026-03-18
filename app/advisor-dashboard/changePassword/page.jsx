"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {getSession, signIn, signOut} from "next-auth/react";
import { useSession } from "next-auth/react";

export default function ChangePasswordPage() {

    const router = useRouter();

    const [tempPassword, setTempPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { data: session } = useSession();

    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!tempPassword || !newPassword || !confirmPassword) {
            toast.error("All fields are required");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.error("Passwords do not match");
            return;
        }

        setLoading(true);

        const res = await fetch("/api/Advisors/changePassword", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                password:newPassword,
                tempPassword,
            }),
        });

        const data = await res.json();

        if (data.success) {
            toast.success("Password updated successfully");
<<<<<<< Updated upstream


            // Redirect to dashboard/login
            //await signOut({ callbackUrl: "/login" });
            await signIn("admin-credentials", {
                redirect: false,
                email: session.user.email,
                password: newPassword,
            });

            if (res?.ok) {
                router.replace("/advisor-dashboard");
            } else {
                toast.error("Re-login failed");
            }



            // redirect to dashboard
            router.replace("/advisor-dashboard");


=======
            
            // Redirect to dashboard/login
            await signOut({ redirect: true,callbackUrl: "/admin/login" });
>>>>>>> Stashed changes
        } else {
            toast.error(data.error || "Failed to update password");
        }

        setLoading(false);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background px-4">
            <div className="w-full max-w-md border border-border rounded-lg p-6 shadow">

                <h2 className="text-2xl font-bold mb-4 text-center">
                    Change Password
                </h2>

                <p className="text-sm text-muted-foreground mb-6 text-center">
                    You must change your temporary password before continuing
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">

                    <Input
                        type="password"
                        placeholder="Temporary Password"
                        value={tempPassword}
                        onChange={(e) => setTempPassword(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                    />

                    <Input
                        type="password"
                        placeholder="Confirm New Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />

                    <Button type="submit" className="w-full" disabled={loading}>
                        {loading ? "Updating..." : "Update Password"}
                    </Button>

                </form>

            </div>
        </div>
    );
}
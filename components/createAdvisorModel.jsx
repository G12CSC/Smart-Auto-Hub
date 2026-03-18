"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

export default function CreateAdvisorModal({ open, onClose }) {
    const [email, setEmail] = useState("");
    const [generated, setGenerated] = useState(null);
    const [loading, setLoading] = useState(false);

    const createAdvisor = async () => {
        try {
            setLoading(true);

            const res = await fetch("/api/admin/createAdvisor", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (data.success) {
                setGenerated(data);
            }
            else {
                toast.error(data.error || "Failed to create advisor");
            }

            setLoading(false);
        }
        catch (error) {
        console.error("Error creating advisor:", error);
        setLoading(false);
    }
  } 

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Advisor</DialogTitle>
                </DialogHeader>

                {!generated ? (
                    <>
                        <Input
                            placeholder="Advisor Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <Button
                            className="w-full mt-4"
                            onClick={createAdvisor}
                            disabled={loading}
                        >
                            Generate Advisor Account
                        </Button>
                    </>
                ) : (
                    <div className="space-y-3">
                        <p className="font-semibold text-green-600">
                            Advisor profile created
                        </p>

                        <div className="border p-3 rounded">
                            <p>
                                <strong>Email:</strong> {generated.email}
                            </p>
                            <p>
                                <strong>Temporary Password:</strong>{" "}
                                {generated.temporaryPassword}
                            </p>
                        </div>

                        <p className="text-sm text-muted-foreground">
                            Share these credentials with the advisor.
                        </p>

                        <Button onClick={() => {
                            setGenerated(null);
                            setEmail("");
                            onClose();
                        }} className="w-full">
                            Close
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
}

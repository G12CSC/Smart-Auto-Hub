import { Button } from "@/components/ui/button";
import { UserCog, Trash2 } from "lucide-react";
import { useState } from "react";
import { useAdvisor } from "@/hooks/useAdvisor";
import CreateAdvisorModal from "@/components/createAdvisorModel.jsx";

export default function AdvisorTab() {
    const [isCreateAdvisorOpen, setIsCreateAdvisorOpen] = useState(false);
    const { advisors, handleDeleteAdvisor } = useAdvisor();

    return (
        <>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h2 className="text-2xl font-bold">Advisor Management</h2>
                        <p className="text-sm text-muted-foreground mt-1">
                            Create and manage advisor accounts
                        </p>
                    </div>

                    <div className="gap-3 flex">
                        <Button onClick={() => setIsCreateAdvisorOpen(true)}>
                            <UserCog size={18} className="mr-2" />
                            Create Advisor
                        </Button>
                    </div>

                </div>

                <div className="text-muted-foreground">
                    Advisors created here will receive temporary credentials
                    and will be required to change their password on first login.
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 my-2">
                    {
                        advisors.length === 0 ? (
                            <div className="text-center py-10 text-muted-foreground">
                                No advisors created yet.
                            </div>
                        ) : (
                            advisors.map((advisor) => (
                                <div key={advisor.id} className="bg-white dark:bg-black/50 rounded-lg border border-border p-4">
                                    <div className="flex items-center gap-3 mb-4 justify-between">
                                        <div className="flex gap-2">
                                            <div className="p-3 bg-primary/10 rounded-lg">
                                                <UserCog size={24} className="text-primary" />

                                            </div>
                                            <div>
                                                <h3 className="font-bold text-xl">{advisor.name}</h3>
                                                <p className="text-sm text-muted-foreground">Advisor</p>
                                            </div>
                                        </div>
                                        <div>
                                            <Button variant="outline" size="sm" onClick={() => {
                                                handleDeleteAdvisor(advisor.id);
                                            }
                                            } className="ml-auto">
                                                <Trash2 size={16} />
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
            <CreateAdvisorModal
                open={isCreateAdvisorOpen}
                onClose={() => setIsCreateAdvisorOpen(false)}
            />
        </>
    )
}
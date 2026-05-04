import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import NewsletterTable from "./NewsletterTable";

export default function NewsletterTab() {
    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-2xl font-bold">Newsletter Subscribers</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage your email subscriber list
                    </p>
                </div>
                <div className="flex gap-3 items-center">
                    <Button
                        variant="outline"
                        onClick={() =>
                            (window.location.href = "/admin/newsletters")
                        }
                    >
                        View Newsletters
                    </Button>
                    <Button
                        onClick={() => window.open("/api/subscribers/export")}
                    >
                        <FileText size={18} className="mr-2" />
                        Export List
                    </Button>
                </div>
            </div>

            <div>
                <NewsletterTable />
            </div>
        </div>
    )
}
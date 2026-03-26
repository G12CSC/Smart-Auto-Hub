
import TransactionForm from "./TransactionForm";
export default function TransactionTab() {
    return (
        <div>
            <div>
                <h2 className="text-2xl font-bold mb-6">Transaction Management</h2>
            </div>
            <div>
                <TransactionForm />
            </div>
        </div>
    )
}
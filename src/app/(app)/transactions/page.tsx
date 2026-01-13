import { TransactionsDataTable } from "@/components/transactions/data-table";

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground">View and manage all your transactions.</p>
      </div>
      <TransactionsDataTable />
    </div>
  );
}

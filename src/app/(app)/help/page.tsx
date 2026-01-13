import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function HelpPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Help & Support</h1>
        <p className="text-muted-foreground">Get to know FlowLedger and how it works.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>What is FlowLedger?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            FlowLedger is a personal finance prototype designed to give you a clear view of your financial life. 
            It allows you to import bank statements, automatically classifies your transactions using AI, 
            and helps you build and track budgets based on your real spending habits.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Prototype Status</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Please be aware that this is an early-stage prototype. Many features are still under development, 
            and you may encounter buttons or screens that are not yet functional. The behavior and appearance 
            of the app may change as development continues. Your feedback is valuable during this phase!
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Data Security Overview</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
            <ul className="list-disc pl-5 space-y-2">
                <li>Your data is stored in Google Firebase (specifically Firestore for data and Firebase Storage for files).</li>
                <li>Access to any data requires you to be signed in with your authenticated account.</li>
                <li>Firestore security rules are in place to ensure that each user can only access their own workspaces and the data within them.</li>
                <li>All traffic between your browser and our servers is encrypted over HTTPS. Data is also encrypted at rest by Google Cloud.</li>
                <li className="font-semibold text-destructive-foreground/80">However, as this is a prototype, please avoid using real banking credentials or any highly sensitive personal information.</li>
            </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How Transactions Are Handled</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>The transaction workflow is designed to be simple and powerful:</p>
          <ol className="list-decimal pl-5 space-y-2">
            <li><span className="font-semibold">Import:</span> You upload a transaction file (like a CSV) from your bank.</li>
            <li><span className="font-semibold">Automatic Classification:</span> Our AI analyzes each transaction's description and amount to suggest a category.</li>
            <li><span className="font-semibold">User Review:</span> Transactions classified by the AI appear in a review queue on your dashboard for you to confirm or correct. This ensures data accuracy.</li>
            <li><span className="font-semibold">Analytics:</span> Once confirmed, your transactions feed into your dashboard and budgeting tools, giving you up-to-date insights.</li>
          </ol>
        </CardContent>
      </Card>

    </div>
  );
}

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, Wand2 } from 'lucide-react';
import { BudgetLines } from '@/components/budget/budget-lines';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export default function BudgetPage() {
  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Budget - 2024</h1>
            <p className="text-muted-foreground">Monitor and adjust your monthly spending goals.</p>
          </div>
          <div className="flex gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="outline" disabled>
                  <FileText />
                  Export
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming soon</p>
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button disabled>
                  <Wand2 />
                  Generate with AI
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Coming soon</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Monthly Budget</CardTitle>
            <CardDescription>Based on average spending from the last 3 months.</CardDescription>
          </CardHeader>
          <CardContent>
            <BudgetLines />
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
}

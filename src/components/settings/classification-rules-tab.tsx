'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function ClassificationRulesTab() {
  const { toast } = useToast();
  const [prompt, setPrompt] = useState('');
  const [importedRules, setImportedRules] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleImport = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    setImportedRules([]);
    try {
      // In a real app, this would be an API call to a backend that runs the Genkit flow.
      // For this demo, we simulate the output.
      const simulatedResult = prompt.split('\n').filter(line => line.trim() !== '');
      await new Promise(resolve => setTimeout(resolve, 1500)); // simulate network delay

      if (simulatedResult.length === 0) {
        throw new Error("No rules found in prompt.");
      }

      setImportedRules(simulatedResult);
      toast({
        title: 'Rules Imported',
        description: `${simulatedResult.length} rules were successfully generated from your prompt.`,
      });
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Import Failed',
        description: 'Could not generate rules from the provided text. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Classification Rules</CardTitle>
        <CardDescription>Manage rules that automatically categorize your transactions.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          {/* Placeholder for existing rules */}
          <p className="text-sm text-muted-foreground">A list of your existing classification rules will be displayed here.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-lg">
              <Wand2 className="mr-2 text-primary" />
              Import Rules with AI
            </CardTitle>
            <CardDescription>
              Paste or write transaction descriptions, and we'll generate classification rules for you.
              Put each example on a new line.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="e.g., 'UBER EATS SF' for Restaurants/Delivery&#10;'Spotify Monthly' for Subscriptions/Music"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              rows={5}
              disabled={isLoading}
            />
          </CardContent>
          <CardFooter>
            <Button onClick={handleImport} disabled={isLoading || !prompt.trim()}>
              {isLoading ? 'Generating...' : 'Generate Rules'}
            </Button>
          </CardFooter>
        </Card>

        {importedRules.length > 0 && (
          <Alert>
            <AlertTitle>Generated Rules Preview</AlertTitle>
            <AlertDescription>
              <ul className="mt-2 space-y-1">
                {importedRules.map((rule, index) => (
                  <li key={index} className="font-mono text-xs bg-muted/50 p-2 rounded-md">{rule}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm">Review the generated rules. You can now save them to your workspace.</p>
               <Button className="mt-4" size="sm">Save Imported Rules</Button>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

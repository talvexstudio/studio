import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FileUploader } from '@/components/import/file-uploader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function ImportPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
       <div>
          <h1 className="text-2xl font-bold tracking-tight">Import Transactions</h1>
          <p className="text-muted-foreground">Upload a bank statement file to add new transactions.</p>
        </div>
      <Card>
        <CardHeader>
          <CardTitle>New Import</CardTitle>
          <CardDescription>Select an import template and upload your file.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="template">Import Template</Label>
            <Select>
              <SelectTrigger id="template">
                <SelectValue placeholder="Select a template..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="template1">ActivoBank (Default)</SelectItem>
                <SelectItem value="template2">Revolut (EUR)</SelectItem>
                <SelectItem value="template3">Generic CSV</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">Templates help map file columns correctly.</p>
          </div>
          <FileUploader />
        </CardContent>
        <CardFooter>
          <Button className="w-full">
            Import Transactions
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

'use client';

import {
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { ChevronsUpDown, LogOut, User, PlusCircle } from 'lucide-react';
import { useState } from 'react';
import { useFlowLedger } from '@/hooks/use-flow-ledger';
import { WorkspaceFormDialog } from './workspace-form-dialog';
import { saveWorkspace } from '@/lib/services/workspaces';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export function AppHeader() {
  const { workspaces, workspaceId, setWorkspaceId, reloadWorkspaces, user } = useFlowLedger();
  const [isWorkspaceDialogOpen, setIsWorkspaceDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleCreateWorkspace = async (name: string) => {
    if (!user) return;
    try {
      // This will create the workspace and return the new object with its ID
      const newWorkspace = await saveWorkspace({ name, ownerUserId: user.uid });
      // After saving, reload the list of workspaces
      await reloadWorkspaces();
      // Then, set the newly created workspace as the active one
      if(newWorkspace.id) {
        setWorkspaceId(newWorkspace.id);
      }
      toast({
        title: 'Workspace Created',
        description: `Successfully created workspace "${name}".`,
      });
      setIsWorkspaceDialogOpen(false);
    } catch(error) {
      toast({
        variant: 'destructive',
        title: 'Creation Failed',
        description: 'Could not create the new workspace.',
      });
    }
  };
  
  const currentWorkspace = workspaces.find(w => w.id === workspaceId);

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6">
      <div className="md:hidden">
        <SidebarTrigger variant="outline" size="icon">
          <ChevronsUpDown className="h-4 w-4" />
        </SidebarTrigger>
      </div>
      
      <div className="flex items-center gap-4">
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-48 justify-between">
                    {currentWorkspace?.name || 'Select Workspace'}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
                <DropdownMenuRadioGroup value={workspaceId || ''} onValueChange={setWorkspaceId}>
                    {workspaces.map(ws => (
                        <DropdownMenuRadioItem key={ws.id} value={ws.id}>{ws.name}</DropdownMenuRadioItem>
                    ))}
                </DropdownMenuRadioGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => setIsWorkspaceDialogOpen(true)}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    <span>New Workspace</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="ml-auto flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full">
              <Avatar>
                <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                <AvatarFallback>{user?.displayName?.charAt(0) || 'U'}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/settings">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/login">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
       <WorkspaceFormDialog
        isOpen={isWorkspaceDialogOpen}
        onOpenChange={setIsWorkspaceDialogOpen}
        onSave={handleCreateWorkspace}
      />
    </header>
  );
}

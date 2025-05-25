'use client';

import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { Copy, Key, Trash2, RefreshCw, Clock } from "lucide-react";
import { format } from 'date-fns';

interface ApiKey {
  _id: string;
  name: string;
  prefix: string;
  created: string;
  lastUsed?: string;
  expiresAt?: string;
  permissions: string[];
  usageCount: number;
  monthlyUsage?: number;
  isActive: boolean;
}

interface NewApiKey extends ApiKey {
  key: string;
}

const ApiKeyManager = () => {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [newKey, setNewKey] = useState<NewApiKey | null>(null);
  const [keyName, setKeyName] = useState('');
  const [expiryDays, setExpiryDays] = useState('never');
  const [permissions, setPermissions] = useState<string[]>(['read']);
  const [copiedKey, setCopiedKey] = useState(false);

  // Fetch API keys on component mount
  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/user/api-keys');
      
      if (!response.ok) {
        throw new Error('Failed to fetch API keys');
      }
      
      const data = await response.json();
      setApiKeys(data.apiKeys || []);
    } catch (error) {
      console.error('Error fetching API keys:', error);
      toast({
        title: "Error",
        description: "Couldn't load your API keys. Try again later!",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createApiKey = async () => {
    if (!keyName.trim()) {
      toast({
        title: "Missing info",
        description: "You gotta give your API key a name!",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const expiresIn = expiryDays === 'never' ? null : parseInt(expiryDays);
      
      const response = await fetch('/api/user/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: keyName,
          permissions,
          expiresIn,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to create API key');
      }
      
      const data = await response.json();
      
      // Show the newly created key (this is the only time the full key will be visible)
      setNewKey(data.apiKey);
      
      // Update the list of keys
      fetchApiKeys();
      
      // Reset form
      setKeyName('');
      setExpiryDays('never');
      setPermissions(['read']);
    } catch (error) {
      console.error('Error creating API key:', error);
      toast({
        title: "Error",
        description: "Couldn't create your API key. Try again later!",
        variant: "destructive",
      });
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch(`/api/user/api-keys?id=${keyId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete API key');
      }
      
      // Update the list of keys
      fetchApiKeys();
      
      toast({
        title: "Success",
        description: "API key deleted successfully!",
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      toast({
        title: "Error",
        description: "Couldn't delete your API key. Try again later!",
        variant: "destructive",
      });
    }
  };

  const toggleApiKeyStatus = async (keyId: string, isCurrentlyActive: boolean) => {
    try {
      const response = await fetch('/api/user/api-keys', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: keyId,
          isActive: !isCurrentlyActive,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update API key');
      }
      
      // Update the list of keys
      fetchApiKeys();
      
      toast({
        title: "Success",
        description: `API key ${!isCurrentlyActive ? 'activated' : 'deactivated'} successfully!`,
      });
    } catch (error) {
      console.error('Error updating API key:', error);
      toast({
        title: "Error",
        description: "Couldn't update your API key. Try again later!",
        variant: "destructive",
      });
    }
  };

  const copyKeyToClipboard = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(true);
    toast({
      title: "Copied!",
      description: "API key copied to clipboard. Keep it safe!",
    });
    
    setTimeout(() => setCopiedKey(false), 3000);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return format(new Date(dateString), 'MMM d, yyyy');
  };

  const getStatusColor = (key: ApiKey) => {
    if (!key.isActive) return 'text-gray-400';
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) return 'text-red-500';
    return 'text-green-500';
  };

  const getStatusText = (key: ApiKey) => {
    if (!key.isActive) return 'Inactive';
    if (key.expiresAt && new Date(key.expiresAt) < new Date()) return 'Expired';
    return 'Active';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold">API Keys</h3>
          <p className="text-sm text-gray-500">Manage API access to your account</p>
        </div>
        <Button onClick={() => setShowNewKeyDialog(true)}>
          <Key className="mr-2 h-4 w-4" />
          Create API Key
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <RefreshCw className="animate-spin h-8 w-8 text-gray-400" />
        </div>
      ) : apiKeys.length === 0 ? (
        <Card className="border-dashed border-2">
          <CardContent className="py-8">
            <div className="flex flex-col items-center text-center space-y-3">
              <Key className="h-12 w-12 text-gray-400" />
              <h3 className="font-semibold text-lg">No API Keys Yet</h3>
              <p className="text-sm text-gray-500 max-w-md">
                Create an API key to access Neural Nexus programmatically. Your API keys let you build applications that use our API.
              </p>
              <Button onClick={() => setShowNewKeyDialog(true)}>
                Create Your First Key
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {apiKeys.map((key) => (
            <Card key={key._id} className={`${!key.isActive ? 'opacity-70' : ''}`}>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{key.name}</CardTitle>
                    <CardDescription className="flex items-center mt-1">
                      <span className="font-mono text-xs bg-gray-100 dark:bg-gray-800 py-1 px-2 rounded">
                        {key.prefix}••••••••••••••••
                      </span>
                      <span className={`ml-3 text-xs flex items-center ${getStatusColor(key)}`}>
                        <span className="h-2 w-2 rounded-full bg-current mr-1"></span>
                        {getStatusText(key)}
                      </span>
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => deleteApiKey(key._id)}
                    title="Delete API key"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="pb-2 pt-0">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 text-xs">Created</p>
                    <p>{formatDate(key.created)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Last Used</p>
                    <p>{key.lastUsed ? formatDate(key.lastUsed) : 'Never'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Expires</p>
                    <p>{key.expiresAt ? formatDate(key.expiresAt) : 'Never'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 text-xs">Uses (30 days)</p>
                    <p>{key.monthlyUsage || 0} requests</p>
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-gray-500 text-xs mb-1">Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {key.permissions.map(perm => (
                      <span 
                        key={perm} 
                        className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100 rounded-full px-2 py-0.5"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="pt-2">
                <Button 
                  variant={key.isActive ? "destructive" : "outline"} 
                  size="sm"
                  onClick={() => toggleApiKeyStatus(key._id, key.isActive)}
                >
                  {key.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Create new API key dialog */}
      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Create API Key</DialogTitle>
            <DialogDescription>
              Generate a new API key to authenticate your applications.
            </DialogDescription>
          </DialogHeader>
          
          {newKey ? (
            <div className="space-y-4">
              <div className="rounded-md bg-amber-50 dark:bg-amber-900/30 p-4 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start">
                  <div className="text-amber-800 dark:text-amber-200">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Save your API key now
                    </h3>
                    <div className="mt-1 text-sm text-amber-700 dark:text-amber-300">
                      <p>This key will only be shown once and cannot be retrieved later.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label htmlFor="api-key">Your new API key</Label>
                <div className="flex">
                  <Input
                    id="api-key"
                    readOnly
                    value={newKey.key}
                    className="font-mono text-xs flex-1 pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-12 top-[140px]"
                    onClick={() => copyKeyToClipboard(newKey.key)}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="text-sm">
                  <span className="font-semibold">Permissions:</span> {newKey.permissions.join(', ')}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Expires:</span> {newKey.expiresAt ? formatDate(newKey.expiresAt) : 'Never'}
                </div>
              </div>
              
              <p className="text-sm text-gray-500">
                Use this key in your application by sending it in the <code className="bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded text-xs">Authorization</code> header:
              </p>
              
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs font-mono overflow-x-auto">
                Authorization: Bearer {newKey.key}
              </div>
            </div>
          ) : (
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label htmlFor="key-name">Key Name</Label>
                <Input
                  id="key-name"
                  placeholder="My App API Key"
                  value={keyName}
                  onChange={(e) => setKeyName(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="permissions">Permissions</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="read-permission" 
                      checked={permissions.includes('read')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPermissions([...permissions, 'read']);
                        } else {
                          setPermissions(permissions.filter(p => p !== 'read'));
                        }
                      }}
                    />
                    <label
                      htmlFor="read-permission"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Read (access public data)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="write-permission"
                      checked={permissions.includes('write')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPermissions([...permissions, 'write']);
                        } else {
                          setPermissions(permissions.filter(p => p !== 'write'));
                        }
                      }}
                    />
                    <label
                      htmlFor="write-permission"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Write (create and update resources)
                    </label>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="admin-permission"
                      checked={permissions.includes('admin')}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setPermissions([...permissions, 'admin']);
                        } else {
                          setPermissions(permissions.filter(p => p !== 'admin'));
                        }
                      }}
                    />
                    <label
                      htmlFor="admin-permission"
                      className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      Admin (full access to your account)
                    </label>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="expiry">Expires After</Label>
                <Select value={expiryDays} onValueChange={setExpiryDays}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select expiration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="never">Never</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                    <SelectItem value="90">90 days</SelectItem>
                    <SelectItem value="365">1 year</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}

          <DialogFooter className="sm:justify-between">
            {newKey ? (
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setNewKey(null);
                    setShowNewKeyDialog(false);
                  }}
                  className="flex-1"
                >
                  Done
                </Button>
                <Button
                  type="button"
                  onClick={() => copyKeyToClipboard(newKey.key)}
                  className="flex-1"
                >
                  {copiedKey ? 'Copied!' : 'Copy Key'}
                </Button>
              </div>
            ) : (
              <div className="flex gap-2 w-full">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowNewKeyDialog(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button type="button" onClick={createApiKey} className="flex-1">
                  Generate Key
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ApiKeyManager; 
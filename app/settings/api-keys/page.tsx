import { Metadata } from "next";
import ApiKeyManager from "@/components/ApiKeyManager";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "API Keys | Neural Nexus",
  description: "Manage your API keys for programmatic access to Neural Nexus",
};

export default async function ApiKeysPage() {
  // Check if user is authenticated
  const session = await getServerSession(authOptions);
  
  if (!session?.user) {
    redirect("/login?callbackUrl=/settings/api-keys");
  }
  
  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">API Keys</h1>
        <p className="text-gray-500 text-lg">
          Manage API keys for secure programmatic access to Neural Nexus services
        </p>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <ApiKeyManager />
      </div>
      
      <div className="mt-10 space-y-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">Getting Started with the API</h2>
          <p className="mb-4">
            Follow these steps to start using the Neural Nexus API in your applications:
          </p>
          
          <div className="space-y-4">
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h3 className="font-bold">1. Create an API Key</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Generate a new API key with appropriate permissions from the manager above.
              </p>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h3 className="font-bold">2. Include Your API Key in Requests</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Add your API key to the Authorization header of your HTTP requests:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded mt-2 text-sm overflow-x-auto">
                <code>Authorization: Bearer your_api_key</code>
              </pre>
            </div>
            
            <div className="border-l-4 border-blue-500 pl-4 py-1">
              <h3 className="font-bold">3. Make API Requests</h3>
              <p className="text-gray-600 dark:text-gray-400">
                Use the API endpoints to interact with Neural Nexus services:
              </p>
              <pre className="bg-gray-100 dark:bg-gray-900 p-3 rounded mt-2 text-sm overflow-x-auto">
                <code>{`curl -X GET "https://api.neural-nexus.ai/v1/models" \\
  -H "Authorization: Bearer your_api_key" \\
  -H "Content-Type: application/json"`}</code>
              </pre>
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4">API Documentation</h2>
          <p className="mb-4">
            Check out our comprehensive API documentation to learn more about available endpoints,
            request/response formats, and best practices.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Models API</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Interact with AI models, retrieve model information, and manage your models.
              </p>
              <a href="/docs/api/models" className="text-blue-500 hover:underline">
                View Documentation →
              </a>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Datasets API</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Access and manage datasets for training and evaluation purposes.
              </p>
              <a href="/docs/api/datasets" className="text-blue-500 hover:underline">
                View Documentation →
              </a>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">Inference API</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Run predictions and generate outputs using AI models in real-time.
              </p>
              <a href="/docs/api/inference" className="text-blue-500 hover:underline">
                View Documentation →
              </a>
            </div>
            
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <h3 className="font-bold text-lg mb-2">User API</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-3">
                Manage user settings, preferences, and account information.
              </p>
              <a href="/docs/api/user" className="text-blue-500 hover:underline">
                View Documentation →
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabase } from '@/providers/SupabaseProvider';
import { useAdminAuth } from '@/providers/AdminAuthProvider';
import AdminLayout from '@/components/layouts/AdminLayout';
import {
  Search,
  Users,
  Plus,
  Trash,
  Mail,
  Shield,
  X,
  Check,
  AlertCircle,
  Calendar,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import Link from 'next/link';

// Define user type
interface User {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
  };
  app_metadata: {
    provider?: string;
    roles?: string[];
  };
}

export default function AdminUsersPage() {
  const router = useRouter();
  const { supabase } = useSupabase();
  const { isAdminAuthenticated, isLoading: authLoading } = useAdminAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<'created_at' | 'email'>('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  
  // Add user modal state
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [addUserError, setAddUserError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!isAdminAuthenticated || authLoading) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase.auth.admin.listUsers();
        
        if (error) {
          throw error;
        }
        
        if (data?.users) {
          setUsers(data.users);
          console.log("✅ Loaded users:", data.users.length);
        }
      } catch (error) {
        console.error("❌ Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [supabase, isAdminAuthenticated, authLoading]);
  
  // Filter and sort users
  useEffect(() => {
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(user => 
        (user.email && user.email.toLowerCase().includes(term)) ||
        (user.user_metadata?.full_name && user.user_metadata.full_name.toLowerCase().includes(term))
      );
    }
    
    // Apply sorting
    filtered = filtered.sort((a, b) => {
      if (sortField === 'created_at') {
        const dateA = new Date(a.created_at).getTime();
        const dateB = new Date(b.created_at).getTime();
        return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
      } else if (sortField === 'email') {
        const emailA = a.email?.toLowerCase() || '';
        const emailB = b.email?.toLowerCase() || '';
        return sortDirection === 'asc' 
          ? emailA.localeCompare(emailB)
          : emailB.localeCompare(emailA);
      }
      return 0;
    });
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, sortField, sortDirection]);
  
  // Handle inviting a new user
  const handleInviteUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newUserEmail.trim()) {
      setAddUserError('Email is required');
      return;
    }
    
    setIsSubmitting(true);
    setAddUserError('');
    
    try {
      const { data, error } = await supabase.auth.admin.inviteUserByEmail(newUserEmail, {
        data: {
          roles: isAdmin ? ['admin'] : ['user']
        }
      });
      
      if (error) {
        throw error;
      }
      
      // Add the new user to the list
      if (data) {
        setUsers(prev => [data, ...prev]);
        
        // Reset form
        setNewUserEmail('');
        setIsAdmin(false);
        setShowAddUserModal(false);
      }
    } catch (error: any) {
      console.error('Error inviting user:', error);
      setAddUserError(error.message || 'Failed to invite user');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Handle deleting a user
  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }
    
    try {
      const { error } = await supabase.auth.admin.deleteUser(userId);
      
      if (error) {
        throw error;
      }
      
      // Remove the deleted user from the list
      setUsers(prev => prev.filter(user => user.id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };
  
  // Format date for display
  const formatDate = (dateString: string | null): string => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    }).format(date);
  };
  
  // Get user display name
  const getUserName = (user: User): string => {
    return user.user_metadata?.full_name || user.email.split('@')[0] || 'Anonymous';
  };
  
  // Check if user is admin
  const isUserAdmin = (user: User): boolean => {
    return user.app_metadata?.roles?.includes('admin') || false;
  };
  
  return (
    <AdminLayout>
      <div className="p-6 max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">User Management</h1>
            <p className="text-gray-400">
              View, add, and manage users in your application
            </p>
          </div>
          
          <button
            onClick={() => setShowAddUserModal(true)}
            className="mt-4 md:mt-0 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Invite User
          </button>
        </div>
        
        {/* Search and Filter */}
        <div className="bg-gray-800/30 rounded-lg p-4 mb-6 flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search users..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center">
            <button
              className={`px-3 py-2 rounded-lg mr-2 text-sm transition-colors ${
                sortField === 'created_at' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => {
                if (sortField === 'created_at') {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('created_at');
                  setSortDirection('desc');
                }
              }}
            >
              Sort by Date
              {sortField === 'created_at' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
                </span>
              )}
            </button>
            
            <button
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                sortField === 'email' 
                  ? 'bg-purple-600 text-white' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
              onClick={() => {
                if (sortField === 'email') {
                  setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
                } else {
                  setSortField('email');
                  setSortDirection('asc');
                }
              }}
            >
              Sort by Email
              {sortField === 'email' && (
                <span className="ml-1">
                  {sortDirection === 'asc' ? <ArrowUp className="inline h-3 w-3" /> : <ArrowDown className="inline h-3 w-3" />}
                </span>
              )}
            </button>
          </div>
        </div>
        
        {/* Users List */}
        <div className="bg-gray-800/30 rounded-xl overflow-hidden border border-gray-700/50">
          {isLoading ? (
            <div className="p-6">
              <div className="flex justify-center items-center py-20">
                <div className="h-8 w-8 border-4 border-t-transparent border-purple-500 rounded-full animate-spin"></div>
                <p className="ml-3 text-gray-400">Loading users...</p>
              </div>
            </div>
          ) : filteredUsers.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-800">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Joined</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Last Login</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-800/50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-full bg-gray-700 flex items-center justify-center text-sm overflow-hidden mr-3">
                            {user.user_metadata?.avatar_url ? (
                              <img 
                                src={user.user_metadata.avatar_url} 
                                alt={getUserName(user)} 
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              getUserName(user).charAt(0).toUpperCase()
                            )}
                          </div>
                          <div>
                            <div className="font-medium">{getUserName(user)}</div>
                            <div className="text-xs text-gray-400">ID: {user.id.slice(0, 8)}...</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm">{user.email}</div>
                        <div className="text-xs text-gray-400">
                          {user.app_metadata?.provider || 'Email'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(user.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {formatDate(user.last_sign_in_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          isUserAdmin(user) 
                            ? 'bg-purple-900/60 text-purple-200' 
                            : 'bg-blue-900/60 text-blue-200'
                        }`}>
                          {isUserAdmin(user) ? (
                            <>
                              <Shield className="h-3 w-3 mr-1" />
                              Admin
                            </>
                          ) : (
                            'User'
                          )}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end">
                          <Link
                            href={`/admin/users/${user.id}`}
                            className="text-indigo-400 hover:text-indigo-300 p-1"
                            title="View details"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() => handleDeleteUser(user.id)}
                            className="text-red-400 hover:text-red-300 p-1 ml-2"
                            title="Delete user"
                          >
                            <Trash className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-6 text-center py-20">
              <Users className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <h3 className="text-lg font-medium mb-2">No Users Found</h3>
              <p className="text-gray-400 mb-6">
                {searchTerm ? "No users match your search criteria." : "Your user list is empty."}
              </p>
              <button
                onClick={() => setShowAddUserModal(true)}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Invite Your First User
              </button>
            </div>
          )}
          
          <div className="bg-gray-800/50 px-6 py-3 border-t border-gray-700">
            <div className="text-xs text-gray-400">
              Total users: {users.length} • Filtered: {filteredUsers.length}
            </div>
          </div>
        </div>
      </div>
      
      {/* Add User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center">
            <div className="fixed inset-0 bg-black/70 transition-opacity" onClick={() => setShowAddUserModal(false)}></div>
            
            <div className="relative bg-gray-800 rounded-lg max-w-md w-full p-6 mx-auto shadow-xl">
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setShowAddUserModal(false)}
                  className="p-1 rounded-full hover:bg-gray-700 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              
              <h3 className="text-xl font-bold mb-4">Invite New User</h3>
              
              <form onSubmit={handleInviteUser}>
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="user@example.com"
                    className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div className="mb-6">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={() => setIsAdmin(!isAdmin)}
                      className="sr-only"
                    />
                    <div className={`w-10 h-5 rounded-full transition-colors ${isAdmin ? 'bg-purple-600' : 'bg-gray-700'} relative`}>
                      <div className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform transform ${isAdmin ? 'translate-x-5' : ''}`}></div>
                    </div>
                    <span className="ml-2 text-gray-300 text-sm">Grant admin privileges</span>
                  </label>
                </div>
                
                {addUserError && (
                  <div className="mb-4 p-3 bg-red-900/30 border border-red-800 rounded-lg text-sm">
                    <p className="text-red-400 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-2" />
                      {addUserError}
                    </p>
                  </div>
                )}
                
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowAddUserModal(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition-colors mr-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors inline-flex items-center"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="h-4 w-4 mr-2" />
                        Send Invitation
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
} 
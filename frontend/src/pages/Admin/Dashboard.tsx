import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  EnvelopeIcon, 
  DocumentTextIcon,
  CurrencyPoundIcon,
  ChartBarIcon,
  CalendarIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  KeyIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';

interface Contact {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  investmentInterest: string;
  preferredContactMethod: string;
  status: string;
  createdAt: string;
  notes?: string;
}

interface SellWhiskySubmission {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  caskType: string;
  distillery: string;
  year: string;
  litres?: string;
  abv?: string;
  askingPrice?: string;
  message?: string;
  status: string;
  createdAt: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sellSubmissions, setSellSubmissions] = useState<SellWhiskySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedSellSubmission, setSelectedSellSubmission] = useState<SellWhiskySubmission | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001';

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  // Also fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        window.location.href = '/admin/login';
        return;
      }

      // Always try to load local data first
      const loadLocalData = () => {
        if (activeTab === 'contacts') {
          const localSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
          console.log('Loading local contact submissions:', localSubmissions);
          const combinedContacts = [...localSubmissions, ...mockContacts];
          setContacts(combinedContacts);
        } else {
          const localSellSubmissions = JSON.parse(localStorage.getItem('sellWhiskySubmissions') || '[]');
          console.log('Loading local sell whisky submissions:', localSellSubmissions);
          const combinedSellSubmissions = [...localSellSubmissions, ...mockSellSubmissions];
          setSellSubmissions(combinedSellSubmissions);
        }
      };

      // Try API first
      try {
        if (activeTab === 'contacts') {
          const response = await axios.get(`${API_URL}/api/contact`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          // Merge API data with local data
          const localSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
          const apiContacts = response.data.data || [];
          const combinedContacts = [...localSubmissions, ...apiContacts];
          setContacts(combinedContacts);
        } else if (activeTab === 'sell') {
          const response = await axios.get(`${API_URL}/api/sell-whisky/submissions`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          // Merge API data with local data
          const localSellSubmissions = JSON.parse(localStorage.getItem('sellWhiskySubmissions') || '[]');
          const apiSubmissions = response.data.data || [];
          const combinedSubmissions = [...localSellSubmissions, ...apiSubmissions];
          setSellSubmissions(combinedSubmissions);
        }
      } catch (apiError: any) {
        console.error('API error, loading local data:', apiError);
        
        // Check if it's an authentication error
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
          localStorage.removeItem('adminToken');
          localStorage.removeItem('adminUser');
          window.location.href = '/admin/login';
          return;
        }
        
        // Load local data as fallback
        loadLocalData();
      }
    } catch (error: any) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateContactStatus = async (id: string, status: string) => {
    try {
      await axios.patch(`${API_URL}/api/contact/${id}/status`, 
        { status },
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        }
      );
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new': return 'bg-blue-100 text-blue-800';
      case 'contacted': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'converted': return 'bg-green-100 text-green-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.subject.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || contact.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredSellSubmissions = sellSubmissions.filter(submission => {
    const matchesSearch = submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         submission.distillery.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || submission.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Mock data for demo
  const mockContacts: Contact[] = [
    {
      _id: '1',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '020 7123 4567',
      subject: 'Investment Inquiry - Premium Package',
      message: 'I am interested in investing in premium whisky casks. I have a budget of £50,000 and would like to discuss the best options.',
      investmentInterest: 'premium',
      preferredContactMethod: 'phone',
      status: 'new',
      createdAt: new Date().toISOString()
    },
    {
      _id: '2',
      name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      subject: 'Beginner Question',
      message: 'I\'m new to whisky investment. Can you explain the process and minimum investment required?',
      investmentInterest: 'starter',
      preferredContactMethod: 'email',
      status: 'contacted',
      createdAt: new Date(Date.now() - 86400000).toISOString()
    }
  ];

  const mockSellSubmissions: SellWhiskySubmission[] = [
    {
      _id: '1',
      name: 'Michael Brown',
      email: 'michael.b@example.com',
      phone: '020 8765 4321',
      caskType: 'Ex-Sherry',
      distillery: 'Macallan',
      year: '2015',
      litres: '200',
      abv: '58.5',
      askingPrice: '35000',
      message: 'Looking to sell my Macallan cask. Excellent condition, stored in bonded warehouse.',
      status: 'new',
      createdAt: new Date().toISOString()
    }
  ];

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  };

  const handlePasswordChange = async () => {
    setPasswordError('');
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters');
      return;
    }
    
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.post(
        `${API_URL}/api/auth/admin/change-password`,
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );
      
      if (response.data.success) {
        alert('Password changed successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      }
    } catch (error: any) {
      setPasswordError(error.response?.data?.message || 'Failed to change password');
    }
  };

  const handleExportExcel = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${API_URL}/api/auth/admin/export-submissions`,
        {
          headers: { 'Authorization': `Bearer ${token}` },
          responseType: 'blob'
        }
      );
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `whisky-submissions-${new Date().toISOString().split('T')[0]}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Failed to export submissions');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gray-900 text-white p-6">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 mt-2">Manage inquiries and submissions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowPasswordModal(true)}
                className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition-colors flex items-center gap-2"
                title="Change Password"
              >
                <KeyIcon className="h-5 w-5" />
                Change Password
              </button>
              <button
                onClick={handleExportExcel}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition-colors flex items-center gap-2"
                title="Export to Excel"
              >
                <ArrowDownTrayIcon className="h-5 w-5" />
                Export Excel
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Debug Panel - Remove in production */}
      <div className="container mx-auto px-6 pt-4">
        <details className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <summary className="cursor-pointer font-medium text-yellow-800">Debug Info (Click to expand)</summary>
          <div className="mt-2 text-sm text-yellow-700">
            <p>Total Contacts: {contacts.length}</p>
            <p>Local Contacts: {contacts.filter(c => c._id.startsWith('local-')).length}</p>
            <p>Total Sell Submissions: {sellSubmissions.length}</p>
            <p>Local Sell Submissions: {sellSubmissions.filter(s => s._id.startsWith('local-')).length}</p>
            <button 
              onClick={() => {
                console.log('LocalStorage - contactSubmissions:', localStorage.getItem('contactSubmissions'));
                console.log('LocalStorage - sellWhiskySubmissions:', localStorage.getItem('sellWhiskySubmissions'));
                console.log('Current contacts state:', contacts);
                console.log('Current sellSubmissions state:', sellSubmissions);
              }}
              className="mt-2 px-3 py-1 bg-yellow-600 text-white rounded text-xs hover:bg-yellow-700"
            >
              Log Storage to Console
            </button>
            <button 
              onClick={() => {
                const testSubmission = {
                  _id: 'local-' + Date.now(),
                  name: 'Test User',
                  email: 'test@example.com',
                  phone: '123-456-7890',
                  subject: 'Test Submission',
                  message: 'This is a test submission',
                  investmentInterest: 'premium',
                  preferredContactMethod: 'email',
                  status: 'new',
                  createdAt: new Date().toISOString()
                };
                
                const existing = localStorage.getItem('contactSubmissions');
                const submissions = existing ? JSON.parse(existing) : [];
                submissions.push(testSubmission);
                localStorage.setItem('contactSubmissions', JSON.stringify(submissions));
                
                console.log('Added test submission:', testSubmission);
                alert('Test submission added! Click Refresh to see it.');
              }}
              className="mt-2 ml-2 px-3 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
            >
              Add Test Submission
            </button>
          </div>
        </details>
      </div>

      {/* Stats Overview */}
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Total Contacts</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {contacts.filter(c => c._id.startsWith('local-')).length > 0 && 
                    `(${contacts.filter(c => c._id.startsWith('local-')).length} new)`
                  }
                </p>
              </div>
              <UsersIcon className="h-12 w-12 text-blue-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">New Inquiries</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.filter(c => c.status === 'new').length}
                </p>
              </div>
              <EnvelopeIcon className="h-12 w-12 text-green-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Sell Submissions</p>
                <p className="text-2xl font-bold text-gray-900">{sellSubmissions.length}</p>
              </div>
              <CurrencyPoundIcon className="h-12 w-12 text-amber-500" />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-lg shadow p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {contacts.length > 0 
                    ? Math.round((contacts.filter(c => c.status === 'converted').length / contacts.length) * 100)
                    : 0}%
                </p>
              </div>
              <ChartBarIcon className="h-12 w-12 text-purple-500" />
            </div>
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('contacts')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'contacts'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Contact Inquiries
              </button>
              <button
                onClick={() => setActiveTab('sell')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'sell'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Sell Whisky Submissions
              </button>
            </nav>
          </div>

          {/* Filters */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  />
                </div>
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
              >
                <option value="all">All Status</option>
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="in-progress">In Progress</option>
                <option value="converted">Converted</option>
                <option value="closed">Closed</option>
              </select>
              <button
                onClick={() => fetchData()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-500"></div>
              </div>
            ) : (
              <>
                {activeTab === 'contacts' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Contact Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Subject
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Interest Level
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredContacts.map((contact) => (
                          <tr key={contact._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{contact.name}</div>
                                <div className="text-sm text-gray-500">{contact.email}</div>
                                {contact.phone && (
                                  <div className="text-sm text-gray-500">{contact.phone}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {contact.subject}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900 capitalize">
                                {contact.investmentInterest}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contact.status)}`}>
                                {contact.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(contact.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedContact(contact)}
                                className="text-amber-600 hover:text-amber-900 mr-3"
                              >
                                View
                              </button>
                              <select
                                value={contact.status}
                                onChange={(e) => updateContactStatus(contact._id, e.target.value)}
                                className="text-sm border border-gray-300 rounded px-2 py-1"
                              >
                                <option value="new">New</option>
                                <option value="contacted">Contacted</option>
                                <option value="in-progress">In Progress</option>
                                <option value="converted">Converted</option>
                                <option value="closed">Closed</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'sell' && (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Seller Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Cask Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Asking Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredSellSubmissions.map((submission) => (
                          <tr key={submission._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{submission.name}</div>
                                <div className="text-sm text-gray-500">{submission.email}</div>
                                {submission.phone && (
                                  <div className="text-sm text-gray-500">{submission.phone}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                <div>{submission.distillery} - {submission.year}</div>
                                <div className="text-gray-500">{submission.caskType}</div>
                                {submission.litres && (
                                  <div className="text-gray-500">{submission.litres}L @ {submission.abv}%</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">
                                {submission.askingPrice ? `£${parseInt(submission.askingPrice).toLocaleString()}` : 'Not specified'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(submission.status)}`}>
                                {submission.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <button
                                onClick={() => setSelectedSellSubmission(submission)}
                                className="text-amber-600 hover:text-amber-900"
                              >
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Contact Detail Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-700">Name:</span>
                  <span className="ml-2 text-gray-900">{selectedContact.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{selectedContact.email}</span>
                </div>
                {selectedContact.phone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-900">{selectedContact.phone}</span>
                  </div>
                )}
                <div>
                  <span className="font-medium text-gray-700">Subject:</span>
                  <span className="ml-2 text-gray-900">{selectedContact.subject}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Interest Level:</span>
                  <span className="ml-2 text-gray-900 capitalize">{selectedContact.investmentInterest}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Preferred Contact:</span>
                  <span className="ml-2 text-gray-900 capitalize">{selectedContact.preferredContactMethod}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Message:</span>
                  <p className="mt-2 text-gray-900 bg-gray-50 p-3 rounded">{selectedContact.message}</p>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                  >
                    Send Email
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Sell Submission Detail Modal */}
      {selectedSellSubmission && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Sell Whisky Submission</h3>
              <div className="space-y-4">
                <div>
                  <span className="font-medium text-gray-700">Seller Name:</span>
                  <span className="ml-2 text-gray-900">{selectedSellSubmission.name}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Email:</span>
                  <span className="ml-2 text-gray-900">{selectedSellSubmission.email}</span>
                </div>
                {selectedSellSubmission.phone && (
                  <div>
                    <span className="font-medium text-gray-700">Phone:</span>
                    <span className="ml-2 text-gray-900">{selectedSellSubmission.phone}</span>
                  </div>
                )}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Cask Details</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-700">Distillery:</span>
                      <span className="ml-2 font-medium">{selectedSellSubmission.distillery}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Year:</span>
                      <span className="ml-2 font-medium">{selectedSellSubmission.year}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Cask Type:</span>
                      <span className="ml-2 font-medium">{selectedSellSubmission.caskType}</span>
                    </div>
                    {selectedSellSubmission.litres && (
                      <div>
                        <span className="text-gray-700">Volume:</span>
                        <span className="ml-2 font-medium">{selectedSellSubmission.litres}L</span>
                      </div>
                    )}
                    {selectedSellSubmission.abv && (
                      <div>
                        <span className="text-gray-700">ABV:</span>
                        <span className="ml-2 font-medium">{selectedSellSubmission.abv}%</span>
                      </div>
                    )}
                    {selectedSellSubmission.askingPrice && (
                      <div>
                        <span className="text-gray-700">Asking Price:</span>
                        <span className="ml-2 font-medium">£{parseInt(selectedSellSubmission.askingPrice).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
                {selectedSellSubmission.message && (
                  <div>
                    <span className="font-medium text-gray-700">Additional Information:</span>
                    <p className="mt-2 text-gray-900 bg-gray-50 p-3 rounded">{selectedSellSubmission.message}</p>
                  </div>
                )}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setSelectedSellSubmission(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <a
                    href={`mailto:${selectedSellSubmission.email}`}
                    className="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                  >
                    Contact Seller
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-md w-full p-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
            
            {passwordError && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
                {passwordError}
              </div>
            )}
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                  placeholder="Minimum 6 characters"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowPasswordModal(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setPasswordError('');
                }}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={handlePasswordChange}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                Change Password
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
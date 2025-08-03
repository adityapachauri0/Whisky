import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  UsersIcon, 
  EnvelopeIcon, 
  CurrencyPoundIcon,
  ChartBarIcon,
  MagnifyingGlassIcon,
  KeyIcon,
  ArrowDownTrayIcon,
  CogIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import axios from 'axios';
import { buildApiEndpoint } from '../../config/api.config';
import SiteConfigManager from '../../components/admin/SiteConfigManager';
import { adminAPI } from '../../services/adminApi';

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
  ipAddress?: string;
  userAgent?: string;
  // Interest selection checkboxes (added for Bunnahabhain-style form)
  investmentPurposes?: boolean;
  ownCask?: boolean;
  giftPurpose?: boolean;
  otherInterest?: boolean;
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
  ipAddress?: string;
  userAgent?: string;
}

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('contacts');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [sellSubmissions, setSellSubmissions] = useState<SellWhiskySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [selectedSellSubmission, setSelectedSellSubmission] = useState<SellWhiskySubmission | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [passwordError, setPasswordError] = useState('');
  const [showEmailPreview, setShowEmailPreview] = useState(false);
  const [emailPreviewContent, setEmailPreviewContent] = useState<{subject: string, body: string}>({ subject: '', body: '' });
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalContacts] = useState(0);
  const [totalSellSubmissions] = useState(0);

  // Bulk selection state
  const [selectedContacts, setSelectedContacts] = useState<string[]>([]);
  const [selectedSellSubmissions, setSelectedSellSubmissions] = useState<string[]>([]);

  const fetchData = React.useCallback(async () => {
    setLoading(true);
    try {
      // Check if user is authenticated by looking for session data
      const adminUser = sessionStorage.getItem('adminUser');
      if (!adminUser) {
        window.location.href = '/admin/login';
        return;
      }

      // Always try to load local data first
      const loadLocalData = () => {
        if (activeTab === 'contacts') {
          const localSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
          // Add IP addresses to local submissions that don't have them
          const localSubmissionsWithIP = localSubmissions.map((contact: Contact, index: number) => ({
            ...contact,
            ipAddress: contact.ipAddress || `192.168.1.${100 + index}`,
            userAgent: contact.userAgent || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
          }));
          const combinedContacts = [...localSubmissionsWithIP, ...mockContacts];
          setContacts(combinedContacts);
        } else {
          const localSellSubmissions = JSON.parse(localStorage.getItem('sellWhiskySubmissions') || '[]');
          const combinedSellSubmissions = [...localSellSubmissions, ...mockSellSubmissions];
          setSellSubmissions(combinedSellSubmissions);
        }
      };

      // Try API first
      try {
        if (activeTab === 'contacts') {
          const response = await axios.get(buildApiEndpoint('admin/contact-submissions'), {
            withCredentials: true
          });
          
          // Use API data only - prioritize real database data over localStorage
          const apiContacts = response.data.data || [];
          if (apiContacts.length > 0) {
            // If we have API data, use only that
            setContacts(apiContacts);
          } else {
            // Only use localStorage as fallback when no API data
            const localSubmissions = JSON.parse(localStorage.getItem('contactSubmissions') || '[]');
            setContacts(localSubmissions);
          }
        } else if (activeTab === 'sell') {
          const response = await axios.get(buildApiEndpoint('admin/sell-submissions'), {
            withCredentials: true
          });
          
          // Use API data only - prioritize real database data over localStorage
          const apiSubmissions = response.data.data || [];
          if (apiSubmissions.length > 0) {
            // If we have API data, use only that
            setSellSubmissions(apiSubmissions);
          } else {
            // Only use localStorage as fallback when no API data
            const localSellSubmissions = JSON.parse(localStorage.getItem('sellWhiskySubmissions') || '[]');
            setSellSubmissions(localSellSubmissions);
          }
        }
      } catch (apiError: any) {
        console.error('API error, loading local data:', apiError);
        
        // Check if it's an authentication error
        if (apiError.response?.status === 401 || apiError.response?.status === 403) {
          sessionStorage.removeItem('adminUser');
          window.location.href = '/admin/login';
          return;
        }
        
        // For any other error (including 500), load local data as fallback
        loadLocalData();
      }
    } catch (error: any) {
      console.error('Error in fetchData:', error);
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const updateContactStatus = async (id: string, status: string) => {
    try {
      await axios.patch(buildApiEndpoint(`contact/${id}/status`), 
        { status },
        {
          withCredentials: true
        }
      );
      fetchData();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const deleteContact = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this contact? This action cannot be undone.')) {
      return;
    }
    
    try {
      await adminAPI.contacts.delete(id);
      fetchData();
      alert('Contact deleted successfully');
    } catch (error: any) {
      console.error('Error deleting contact:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete contact';
      alert(errorMessage);
    }
  };

  const deleteSellSubmission = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this sell submission? This action cannot be undone.')) {
      return;
    }
    
    try {
      await adminAPI.sellSubmissions.delete(id);
      fetchData();
      alert('Sell submission deleted successfully');
    } catch (error: any) {
      console.error('Error deleting sell submission:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete sell submission';
      alert(errorMessage);
    }
  };

  // Bulk delete functions
  const bulkDeleteContacts = async () => {
    if (selectedContacts.length === 0) {
      alert('Please select contacts to delete');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedContacts.length} selected contacts? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const response = await adminAPI.contacts.bulkDelete(selectedContacts);
      
      fetchData();
      setSelectedContacts([]);
      const deletedCount = response.data.data?.deletedCount || response.data.deletedCount || selectedContacts.length;
      alert(`${deletedCount} contacts deleted successfully`);
    } catch (error: any) {
      console.error('Error bulk deleting contacts:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete contacts';
      alert(errorMessage);
    }
  };

  const bulkDeleteSellSubmissions = async () => {
    if (selectedSellSubmissions.length === 0) {
      alert('Please select submissions to delete');
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete ${selectedSellSubmissions.length} selected submissions? This action cannot be undone.`)) {
      return;
    }
    
    try {
      const response = await adminAPI.sellSubmissions.bulkDelete(selectedSellSubmissions);
      
      fetchData();
      setSelectedSellSubmissions([]);
      const deletedCount = response.data.data?.deletedCount || response.data.deletedCount || selectedSellSubmissions.length;
      alert(`${deletedCount} submissions deleted successfully`);
    } catch (error: any) {
      console.error('Error bulk deleting sell submissions:', error);
      const errorMessage = error.response?.data?.message || 'Failed to delete submissions';
      alert(errorMessage);
    }
  };

  // Selection helper functions
  const toggleContactSelection = (contactId: string) => {
    setSelectedContacts(prev => 
      prev.includes(contactId) 
        ? prev.filter(id => id !== contactId)
        : [...prev, contactId]
    );
  };

  const toggleSellSubmissionSelection = (submissionId: string) => {
    setSelectedSellSubmissions(prev => 
      prev.includes(submissionId) 
        ? prev.filter(id => id !== submissionId)
        : [...prev, submissionId]
    );
  };

  const toggleAllContacts = () => {
    if (selectedContacts.length === paginatedContacts.length) {
      setSelectedContacts([]);
    } else {
      setSelectedContacts(paginatedContacts.map(contact => contact._id));
    }
  };

  const toggleAllSellSubmissions = () => {
    if (selectedSellSubmissions.length === paginatedSellSubmissions.length) {
      setSelectedSellSubmissions([]);
    } else {
      setSelectedSellSubmissions(paginatedSellSubmissions.map(submission => submission._id));
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

  // Pagination logic
  const getCurrentPageData = () => {
    const currentData = activeTab === 'contacts' ? filteredContacts : filteredSellSubmissions;
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return currentData.slice(startIndex, endIndex);
  };

  const getTotalPages = () => {
    const currentData = activeTab === 'contacts' ? filteredContacts : filteredSellSubmissions;
    return Math.ceil(currentData.length / itemsPerPage);
  };

  const paginatedContacts = activeTab === 'contacts' ? getCurrentPageData() : [];
  const paginatedSellSubmissions = activeTab === 'sell' ? getCurrentPageData() : [];

  // Reset to page 1 when switching tabs or changing filters
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab, searchTerm, statusFilter, itemsPerPage]);

  // Mock data for demo
  const mockContacts: Contact[] = [];

  const mockSellSubmissions: SellWhiskySubmission[] = [];

  const handleLogout = async () => {
    try {
      await axios.post(buildApiEndpoint('admin/logout'), {}, {
        withCredentials: true
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
    sessionStorage.removeItem('adminUser');
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
      const response = await axios.post(
        buildApiEndpoint('auth/admin/change-password'),
        {
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        },
        {
          withCredentials: true // Send httpOnly cookies
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
      const response = await axios.get(
        buildApiEndpoint('auth/admin/export-submissions?format=excel'),
        {
          withCredentials: true, // Send httpOnly cookies
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

  const handleSendTemplatedEmail = async (contact: Contact) => {
    try {
      // First, get email preview from backend
      const response = await axios.post(
        buildApiEndpoint('auth/admin/preview-email'),
        { contact },
        {
          withCredentials: true // Send httpOnly cookies
        }
      );
      
      if (response.data.success) {
        setEmailPreviewContent({
          subject: response.data.subject,
          body: response.data.html
        });
        setShowEmailPreview(true);
      }
    } catch (error: any) {
      console.error('Email preview failed:', error);
      // Fallback to simple mailto
      const subject = encodeURIComponent(`Re: ${contact.subject} - Your Whisky Investment Journey Begins`);
      const body = encodeURIComponent(`Dear ${contact.name},\n\nThank you for your interest in whisky cask investment...\n\nBest regards,\nViticultWhisky Team`);
      window.location.href = `mailto:${contact.email}?subject=${subject}&body=${body}`;
    }
  };

  const sendEmail = async () => {
    try {
      const response = await axios.post(
        buildApiEndpoint('auth/admin/send-email'),
        { 
          contact: selectedContact,
          subject: emailPreviewContent.subject,
          html: emailPreviewContent.body
        },
        {
          withCredentials: true // Send httpOnly cookies
        }
      );
      
      if (response.data.success) {
        alert('Email sent successfully!');
        setShowEmailPreview(false);
        setSelectedContact(null);
        
        // Update contact status to 'contacted'
        if (selectedContact) {
          updateContactStatus(selectedContact._id, 'contacted');
        }
      }
    } catch (error: any) {
      console.error('Email send failed:', error);
      alert('Failed to send email. Please try again.');
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
                title="Export to Excel file with IP addresses"
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
              <button
                onClick={() => setActiveTab('config')}
                className={`py-4 px-6 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'config'
                    ? 'border-amber-500 text-amber-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <CogIcon className="inline-block w-4 h-4 mr-1" />
                Site Configuration
              </button>
            </nav>
          </div>

          {/* Filters */}
          {activeTab !== 'config' && (
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
          )}

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
                    {/* Bulk Actions Bar */}
                    {selectedContacts.length > 0 && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-blue-800 font-medium">
                              {selectedContacts.length} contact{selectedContacts.length !== 1 ? 's' : ''} selected
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedContacts([])}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Clear Selection
                            </button>
                            <button
                              onClick={bulkDeleteContacts}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Delete Selected
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectedContacts.length === paginatedContacts.length && paginatedContacts.length > 0}
                              onChange={toggleAllContacts}
                              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                          </th>
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
                            Interest Selections
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            IP Address
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
                        {paginatedContacts.map((contact) => {
                          const contactItem = contact as Contact;
                          return (
                          <tr key={contactItem._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedContacts.includes(contactItem._id)}
                                onChange={() => toggleContactSelection(contactItem._id)}
                                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{contactItem.name}</div>
                                <div className="text-sm text-gray-500">{contactItem.email}</div>
                                {contactItem.phone && (
                                  <div className="text-sm text-gray-500">{contactItem.phone}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900 max-w-xs truncate">
                                {contactItem.subject}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm text-gray-900 capitalize">
                                {contactItem.investmentInterest}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-wrap gap-1 max-w-xs">
                                {contactItem.investmentPurposes && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    Investment
                                  </span>
                                )}
                                {contactItem.ownCask && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    Own Cask
                                  </span>
                                )}
                                {contactItem.giftPurpose && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                    Gift
                                  </span>
                                )}
                                {contactItem.otherInterest && (
                                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                    Other
                                  </span>
                                )}
                                {!contactItem.investmentPurposes && !contactItem.ownCask && !contactItem.giftPurpose && !contactItem.otherInterest && (
                                  <span className="text-xs text-gray-400">None selected</span>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(contactItem.status)}`}>
                                {contactItem.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {contactItem.ipAddress || 'Not recorded'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(contactItem.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setSelectedContact(contactItem)}
                                  className="text-amber-600 hover:text-amber-900"
                                >
                                  View
                                </button>
                                <select
                                  value={contactItem.status}
                                  onChange={(e) => updateContactStatus(contactItem._id, e.target.value)}
                                  className="text-sm border border-gray-300 rounded px-2 py-1"
                                >
                                  <option value="new">New</option>
                                  <option value="contacted">Contacted</option>
                                  <option value="in-progress">In Progress</option>
                                  <option value="converted">Converted</option>
                                  <option value="closed">Closed</option>
                                </select>
                                <button
                                  onClick={() => deleteContact(contactItem._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete contact"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {activeTab === 'sell' && (
                  <div className="overflow-x-auto">
                    {/* Bulk Actions Bar */}
                    {selectedSellSubmissions.length > 0 && (
                      <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <span className="text-blue-800 font-medium">
                              {selectedSellSubmissions.length} submission{selectedSellSubmissions.length !== 1 ? 's' : ''} selected
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => setSelectedSellSubmissions([])}
                              className="text-blue-600 hover:text-blue-800 text-sm"
                            >
                              Clear Selection
                            </button>
                            <button
                              onClick={bulkDeleteSellSubmissions}
                              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2"
                            >
                              <TrashIcon className="h-4 w-4" />
                              Delete Selected
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <input
                              type="checkbox"
                              checked={selectedSellSubmissions.length === paginatedSellSubmissions.length && paginatedSellSubmissions.length > 0}
                              onChange={toggleAllSellSubmissions}
                              className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                            />
                          </th>
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
                            IP Address
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
                        {paginatedSellSubmissions.map((submission) => {
                          const sellSubmission = submission as SellWhiskySubmission;
                          return (
                          <tr key={sellSubmission._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <input
                                type="checkbox"
                                checked={selectedSellSubmissions.includes(sellSubmission._id)}
                                onChange={() => toggleSellSubmissionSelection(sellSubmission._id)}
                                className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                              />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div>
                                <div className="text-sm font-medium text-gray-900">{sellSubmission.name}</div>
                                <div className="text-sm text-gray-500">{sellSubmission.email}</div>
                                {sellSubmission.phone && (
                                  <div className="text-sm text-gray-500">{sellSubmission.phone}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">
                                <div>{sellSubmission.distillery} - {sellSubmission.year}</div>
                                <div className="text-gray-500">{sellSubmission.caskType}</div>
                                {sellSubmission.litres && (
                                  <div className="text-gray-500">{sellSubmission.litres}L @ {sellSubmission.abv}%</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-sm font-medium text-gray-900">
                                {sellSubmission.askingPrice ? `£${parseInt(sellSubmission.askingPrice).toLocaleString()}` : 'Not specified'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sellSubmission.status)}`}>
                                {sellSubmission.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {sellSubmission.ipAddress || 'Not recorded'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(sellSubmission.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => setSelectedSellSubmission(sellSubmission)}
                                  className="text-amber-600 hover:text-amber-900"
                                >
                                  View Details
                                </button>
                                <button
                                  onClick={() => deleteSellSubmission(sellSubmission._id)}
                                  className="text-red-600 hover:text-red-900 p-1"
                                  title="Delete submission"
                                >
                                  <TrashIcon className="h-4 w-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Pagination Controls */}
                {(activeTab === 'contacts' || activeTab === 'sell') && (
                  <div className="bg-white px-6 py-3 border-t border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-700">Show:</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => setItemsPerPage(Number(e.target.value))}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-700">per page</span>
                      </div>
                      <div className="text-sm text-gray-700">
                        Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, activeTab === 'contacts' ? filteredContacts.length : filteredSellSubmissions.length)} of {activeTab === 'contacts' ? filteredContacts.length : filteredSellSubmissions.length} results
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <ChevronLeftIcon className="h-4 w-4 mr-1" />
                        Previous
                      </button>
                      
                      <div className="flex space-x-1">
                        {Array.from({ length: getTotalPages() }, (_, i) => i + 1).map((page) => (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-1 text-sm border rounded ${
                              currentPage === page
                                ? 'bg-amber-600 text-white border-amber-600'
                                : 'border-gray-300 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        ))}
                      </div>
                      
                      <button
                        onClick={() => setCurrentPage(Math.min(getTotalPages(), currentPage + 1))}
                        disabled={currentPage === getTotalPages()}
                        className="flex items-center px-3 py-1 text-sm border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Next
                        <ChevronRightIcon className="h-4 w-4 ml-1" />
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'config' && (
                  <div className="p-6">
                    <SiteConfigManager />
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
                
                {/* Interest Selection Checkboxes */}
                {(selectedContact.investmentPurposes || selectedContact.ownCask || selectedContact.giftPurpose || selectedContact.otherInterest) && (
                  <div className="border-t pt-4">
                    <span className="font-medium text-gray-700 block mb-3">Interest Selections:</span>
                    <div className="grid grid-cols-2 gap-3">
                      {selectedContact.investmentPurposes && (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="ml-2 text-sm text-gray-700">Investment Purposes</span>
                        </div>
                      )}
                      {selectedContact.ownCask && (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="ml-2 text-sm text-gray-700">Own Cask Interest</span>
                        </div>
                      )}
                      {selectedContact.giftPurpose && (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="ml-2 text-sm text-gray-700">Gift Purpose</span>
                        </div>
                      )}
                      {selectedContact.otherInterest && (
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                          <span className="ml-2 text-sm text-gray-700">Other Interest</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {selectedContact.ipAddress && (
                  <div className="grid grid-cols-2 gap-4 mt-4 p-4 bg-gray-50 rounded">
                    <div>
                      <span className="font-medium text-gray-700">IP Address:</span>
                      <span className="ml-2 text-gray-900 font-mono">{selectedContact.ipAddress}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-700">Submitted:</span>
                      <span className="ml-2 text-gray-900">{new Date(selectedContact.createdAt).toLocaleString()}</span>
                    </div>
                    {selectedContact.userAgent && (
                      <div className="col-span-2">
                        <span className="font-medium text-gray-700">Browser:</span>
                        <p className="text-sm text-gray-600 mt-1 font-mono break-all">{selectedContact.userAgent}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end gap-3 mt-6">
                  <button
                    onClick={() => setSelectedContact(null)}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => handleSendTemplatedEmail(selectedContact)}
                    className="px-4 py-2 text-white bg-amber-600 rounded-lg hover:bg-amber-700"
                  >
                    Send Email
                  </button>
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
                
                {/* IP Address and Technical Info */}
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-900 mb-2">Technical Information</h4>
                  {selectedSellSubmission.ipAddress && (
                    <div>
                      <span className="font-medium text-gray-700">IP Address:</span>
                      <span className="ml-2 text-gray-900 font-mono">{selectedSellSubmission.ipAddress}</span>
                    </div>
                  )}
                  {selectedSellSubmission.userAgent && (
                    <div className="mt-2">
                      <span className="font-medium text-gray-700">Browser:</span>
                      <span className="ml-2 text-gray-900 text-sm">{selectedSellSubmission.userAgent}</span>
                    </div>
                  )}
                  <div className="mt-2">
                    <span className="font-medium text-gray-700">Submitted:</span>
                    <span className="ml-2 text-gray-900">{new Date(selectedSellSubmission.createdAt).toLocaleString()}</span>
                  </div>
                </div>
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

      {/* Email Preview Modal */}
      {showEmailPreview && selectedContact && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b">
              <h3 className="text-lg font-medium text-gray-900">Email Preview</h3>
              <p className="text-sm text-gray-600 mt-1">Review the email before sending to {selectedContact.name}</p>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject:</label>
                <div className="p-3 bg-gray-100 rounded">{emailPreviewContent.subject}</div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Content:</label>
                <div className="border rounded p-4 bg-gray-50">
                  <iframe
                    srcDoc={emailPreviewContent.body}
                    className="w-full h-[500px] border-0"
                    title="Email Preview"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t flex justify-end gap-3">
              <button
                onClick={() => setShowEmailPreview(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={sendEmail}
                className="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600"
              >
                Send Email
              </button>
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-500"
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white text-gray-900 placeholder-gray-500"
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
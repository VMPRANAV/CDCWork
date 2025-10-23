import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  BarChart3,
  Calendar,
  CheckCircle,
  X,
  Mail,
  Phone,
  GraduationCap,
  User,
  Image as ImageIcon,
  Link as LinkIcon,
  CalendarDays,
  Upload,
  ExternalLink,
  Eye,
  Download,
  Tag,
  Filter
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

const CATEGORIES = {
  hackathon: { label: 'Hackathon', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
  coding_test: { label: 'Coding Test', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
  general: { label: 'General', color: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200' },
  announcement: { label: 'Announcement', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' },
  hiring: { label: 'Hiring', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
  event: { label: 'Event', color: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200' },
  workshop: { label: 'Workshop', color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200' },
  seminar: { label: 'Seminar', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' },
  other: { label: 'Other', color: 'bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200' }
};

const emptyForm = {
  title: '',
  description: '',
  category: 'general',
  registrationLink: '',
  eventDate: '',
  image: null
};

// Move PostForm component outside to prevent recreation
const PostForm = ({ formData, setFormData, onSubmit, onCancel, saving, editingPost, imagePreview, setImagePreview }) => {
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData({ ...formData, image: file });
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setFormData({ ...formData, image: null });
    setImagePreview(null);
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="Enter post title"
          required
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-2">Description *</label>
        <textarea
          className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none dark:bg-gray-800 dark:border-gray-700"
          rows={6}
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Enter post description"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Category *
        </label>
        <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(CATEGORIES).map(([key, { label }]) => (
              <SelectItem key={key} value={key}>{label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <ImageIcon className="w-4 h-4" />
          Event Image (Optional)
        </label>
        <div className="space-y-3">
          {imagePreview || (editingPost && editingPost.imageUrl) ? (
            <div className="relative rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700">
              <img
                src={imagePreview || editingPost.imageUrl}
                alt="Event preview"
                className="w-full h-64 object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={removeImage}
                className="absolute top-3 right-3 shadow-lg"
              >
                <X className="w-4 h-4 mr-1" />
                Remove
              </Button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center hover:border-blue-400 dark:hover:border-blue-600 transition-colors cursor-pointer bg-gray-50 dark:bg-gray-800/50">
              <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <label className="cursor-pointer block">
                <span className="text-sm font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  Click to upload image
                </span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </label>
              <p className="text-xs text-gray-500 mt-2">PNG, JPG, GIF, WEBP up to 5MB</p>
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <LinkIcon className="w-4 h-4" />
          Registration Link (Optional)
        </label>
        <Input
          type="url"
          value={formData.registrationLink}
          onChange={(e) => setFormData({ ...formData, registrationLink: e.target.value })}
          placeholder="https://example.com/register"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2 flex items-center gap-2">
          <CalendarDays className="w-4 h-4" />
          Event Date & Time (Optional)
        </label>
        <Input
          type="datetime-local"
          value={formData.eventDate}
          onChange={(e) => setFormData({ ...formData, eventDate: e.target.value })}
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t dark:border-gray-700">
        <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        <Button type="submit" disabled={saving}>
          {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
        </Button>
      </div>
    </form>
  );
};

export function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imagePreview, setImagePreview] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
  const [selectedPostReactions, setSelectedPostReactions] = useState(null);
  const [activeTab, setActiveTab] = useState('registered');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [postPendingDelete, setPostPendingDelete] = useState(null);

  const adminHeaders = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'admin',
    };
  }, []);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`${API_BASE}/posts`, { headers: adminHeaders });
      const items = Array.isArray(response.data) ? response.data : [];
      const ordered = [...items].sort((a, b) => {
        const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return bTime - aTime;
      });
      setPosts(ordered);
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to load posts';
      setError(message);
      toast.error('Unable to load posts', { description: message });
    } finally {
      setLoading(false);
    }
  }, [adminHeaders]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filteredPosts = useMemo(() => {
    let filtered = posts;

    // Filter by category
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(post => post.category === categoryFilter);
    }

    // Filter by search term
    const term = searchTerm.trim().toLowerCase();
    if (term) {
      filtered = filtered.filter((post) => 
        post.title?.toLowerCase().includes(term) || 
        post.description?.toLowerCase().includes(term)
      );
    }

    return filtered;
  }, [posts, searchTerm, categoryFilter]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setImagePreview(null);
    setDialogOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({ 
      title: post.title ?? '', 
      description: post.description ?? '',
      category: post.category ?? 'general',
      registrationLink: post.registrationLink ?? '',
      eventDate: post.eventDate ? new Date(post.eventDate).toISOString().slice(0, 16) : '',
      image: null
    });
    setImagePreview(null);
    setDialogOpen(true);
  };

  const handleCloseDialog = (open) => {
    setDialogOpen(open);
    if (!open) {
      setEditingPost(null);
      setFormData(emptyForm);
      setImagePreview(null);
    }
  };

  const handleCancel = () => {
    handleCloseDialog(false);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please provide title and description');
      return;
    }
    
    setSaving(true);
    try {
      const submitData = new FormData();
      submitData.append('title', formData.title);
      submitData.append('description', formData.description);
      submitData.append('category', formData.category);
      
      if (formData.registrationLink) {
        submitData.append('registrationLink', formData.registrationLink);
      }
      
      if (formData.eventDate) {
        submitData.append('eventDate', formData.eventDate);
      }
      
      if (formData.image) {
        submitData.append('image', formData.image);
      }

      const config = {
        headers: {
          ...adminHeaders,
          'Content-Type': 'multipart/form-data',
        }
      };

      if (editingPost) {
        await axios.put(`${API_BASE}/posts/${editingPost._id}`, submitData, config);
        toast.success('Post updated successfully');
      } else {
        await axios.post(`${API_BASE}/posts`, submitData, config);
        toast.success('Post created successfully');
      }
      
      handleCloseDialog(false);
      fetchPosts();
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to save post';
      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteRequest = (post) => {
    setPostPendingDelete(post);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!postPendingDelete) return;
    try {
      await axios.delete(`${API_BASE}/posts/${postPendingDelete._id}`, { headers: adminHeaders });
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to delete post';
      toast.error(message);
    } finally {
      setDeleteDialogOpen(false);
      setPostPendingDelete(null);
    }
  };

  const handleViewReactions = async (postId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
        toast.error('Authentication required');
        return;
    }

    const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
            role: 'admin',
        },
    };

    try {
        const { data } = await axios.get(`${API_BASE}/posts/${postId}/reactions`, config);
        
        if (data && data.reactions) {
            setSelectedPostReactions(data);
            setActiveTab('registered');
            setIsReactionsModalOpen(true);
        } else {
            toast.error('No reaction data found');
        }
    } catch (error) {
        console.error('Error fetching reactions:', error);
        const message = error.response?.data?.message || 'Failed to fetch student reactions';
        toast.error(message);
    }
  };

  const exportToCSV = (type) => {
    if (!selectedPostReactions) return;
    
    const students = selectedPostReactions.reactions[type];
    if (students.length === 0) {
      toast.info('No students to export');
      return;
    }

    const headers = ['Name', 'Email', 'Roll No', 'Phone', 'Responded At'];
    const rows = students.map(r => [
      r.user.name,
      r.user.email,
      r.user.rollno,
      r.user.phone || 'N/A',
      new Date(r.reactedAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type}_students_${selectedPostReactions.postTitle}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    toast.success('CSV exported successfully');
  };

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <Card key={n} className="overflow-hidden">
            <div className="h-48 bg-gray-200 dark:bg-gray-700 animate-pulse" />
            <CardHeader>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-3/4" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Posts Management</h1>
          <p className="text-muted-foreground mt-1">
            Create and manage event posts with images, dates, and analytics
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
            </DialogHeader>
            <PostForm 
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              saving={saving}
              editingPost={editingPost}
              imagePreview={imagePreview}
              setImagePreview={setImagePreview}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(CATEGORIES).map(([key, { label }]) => (
                <SelectItem key={key} value={key}>{label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Posts Grid */}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {filteredPosts.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm || categoryFilter !== 'all' 
                  ? 'No posts found matching your filters' 
                  : 'No posts created yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => {
            const category = CATEGORIES[post.category] || CATEGORIES.general;
            
            return (
              <Card key={post._id} className="overflow-hidden hover:shadow-lg transition-all flex flex-col">
                {/* Event Image */}
                {post.imageUrl ? (
                  <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800">
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <Badge className={category.color}>
                        {category.label}
                      </Badge>
                    </div>
                    {post.eventDate && (
                      <Badge className="absolute top-3 right-3 backdrop-blur-sm bg-blue-600/90 text-white">
                        <CalendarDays className="w-3 h-3 mr-1" />
                        {new Date(post.eventDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </Badge>
                    )}
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 h-32 flex items-center justify-center relative">
                    <ImageIcon className="w-12 h-12 text-gray-300 dark:text-gray-700" />
                    <div className="absolute top-3 left-3">
                      <Badge className={category.color}>
                        {category.label}
                      </Badge>
                    </div>
                  </div>
                )}

                <CardHeader className="space-y-2 pb-3">
                  <CardTitle className="text-lg line-clamp-2">{post.title}</CardTitle>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-3 flex-1 flex flex-col">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {post.description}
                  </p>

                  {post.registrationLink && (
                    <div className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                      <ExternalLink className="w-3 h-3" />
                      <span className="truncate">Registration link available</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2 pt-2 mt-auto">
                    <div className="text-center p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">
                        {post.reactionCounts?.registered || 0}
                      </div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-400">Registered</div>
                    </div>
                    <div className="text-center p-2 bg-red-50 dark:bg-red-950 rounded-lg">
                      <div className="text-lg font-bold text-red-600 dark:text-red-400">
                        {post.reactionCounts?.not_registered || 0}
                      </div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-400">Not Registered</div>
                    </div>
                    <div className="text-center p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="text-lg font-bold text-gray-800 dark:text-gray-200">
                        {post.reactionCounts?.total || 0}
                      </div>
                      <div className="text-[10px] text-gray-600 dark:text-gray-400">Total</div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-3 gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEdit(post)}
                      className="h-8 text-xs"
                    >
                      <Edit className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewReactions(post._id)}
                      className="h-8 text-xs"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteRequest(post)}
                      className="h-8 text-xs"
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      {/* Enhanced Student Reactions Modal */}
      <Dialog open={isReactionsModalOpen} onOpenChange={setIsReactionsModalOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader className="pb-4 border-b dark:border-gray-700">
            <DialogTitle className="text-2xl font-bold">
              {selectedPostReactions?.postTitle}
            </DialogTitle>
            <p className="text-sm text-muted-foreground">Student registration responses</p>
          </DialogHeader>

          {selectedPostReactions && (
            <div className="flex-1 overflow-auto">
              {/* Summary Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
                  <CardContent className="p-4 text-center">
                    <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                      {selectedPostReactions.reactions.counts.registered}
                    </div>
                    <div className="text-sm text-green-700 dark:text-green-300 font-medium">Registered</div>
                  </CardContent>
                </Card>

                <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
                  <CardContent className="p-4 text-center">
                    <X className="w-8 h-8 text-red-600 dark:text-red-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                      {selectedPostReactions.reactions.counts.not_registered}
                    </div>
                    <div className="text-sm text-red-700 dark:text-red-300 font-medium">Not Registered</div>
                  </CardContent>
                </Card>

                <Card className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
                  <CardContent className="p-4 text-center">
                    <BarChart3 className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                      {selectedPostReactions.reactions.counts.total}
                    </div>
                    <div className="text-sm text-blue-700 dark:text-blue-300 font-medium">Total Responses</div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 mb-4 border-b dark:border-gray-700">
                <button
                  onClick={() => setActiveTab('registered')}
                  className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'registered'
                      ? 'border-green-600 text-green-600 dark:text-green-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Registered ({selectedPostReactions.reactions.counts.registered})
                </button>
                <button
                  onClick={() => setActiveTab('not_registered')}
                  className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${
                    activeTab === 'not_registered'
                      ? 'border-red-600 text-red-600 dark:text-red-400'
                      : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                  }`}
                >
                  Not Registered ({selectedPostReactions.reactions.counts.not_registered})
                </button>
              </div>

              {/* Export Button */}
              <div className="mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(activeTab)}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Export to CSV
                </Button>
              </div>

              {/* Student List */}
              <div className="space-y-3">
                {selectedPostReactions.reactions[activeTab].length > 0 ? (
                  selectedPostReactions.reactions[activeTab].map((reaction, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                            {reaction.user.name.charAt(0).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <h4 className="font-semibold text-base truncate">{reaction.user.name}</h4>
                              <Badge variant="outline" className="text-xs shrink-0">
                                {new Date(reaction.reactedAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600 dark:text-gray-400">
                              <div className="flex items-center gap-2">
                                <Mail className="w-3.5 h-3.5 flex-shrink-0" />
                                <span className="truncate">{reaction.user.email}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <GraduationCap className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>{reaction.user.rollno}</span>
                              </div>
                              {reaction.user.phone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="w-3.5 h-3.5 flex-shrink-0" />
                                  <span>{reaction.user.phone}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-dashed">
                    <CardContent className="text-center py-12">
                      <User className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-gray-400">No students in this category</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
      </DialogContent>
    </Dialog>

    <AlertDialog
      open={deleteDialogOpen}
      onOpenChange={(open) => {
        setDeleteDialogOpen(open);
        if (!open) setPostPendingDelete(null);
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this post?</AlertDialogTitle>
          <AlertDialogDescription>
            {postPendingDelete
              ? `“${postPendingDelete.title}” will be removed permanently.`
              : 'This post will be removed permanently.'}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDeleteConfirmed}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </div>
);
}

export default Posts;

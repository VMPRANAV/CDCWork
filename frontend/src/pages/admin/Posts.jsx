import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
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
  User
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

const emptyForm = {
  title: '',
  description: '',
};

// Move PostForm component outside to prevent recreation
const PostForm = ({ formData, setFormData, onSubmit, onCancel, saving, editingPost }) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div>
      <label className="block text-sm font-medium mb-2">Title</label>
      <Input
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Enter post title"
        required
      />
    </div>
    <div>
      <label className="block text-sm font-medium mb-2">Description</label>
      <textarea
        className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={6}
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Enter post description"
        required
      />
    </div>
    <div className="flex justify-end gap-2">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      <Button type="submit" disabled={saving}>
        {saving ? 'Saving...' : editingPost ? 'Update Post' : 'Create Post'}
      </Button>
    </div>
  </form>
);

export function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');
  const [isReactionsModalOpen, setIsReactionsModalOpen] = useState(false);
  const [selectedPostReactions, setSelectedPostReactions] = useState(null);

  const adminHeaders = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
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
    const term = searchTerm.trim().toLowerCase();
    if (!term) return posts;
    return posts.filter((post) => post.title?.toLowerCase().includes(term));
  }, [posts, searchTerm]);

  const handleOpenCreate = () => {
    setEditingPost(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const handleOpenEdit = (post) => {
    setEditingPost(post);
    setFormData({ title: post.title ?? '', description: post.description ?? '' });
    setDialogOpen(true);
  };

  const handleCloseDialog = (open) => {
    setDialogOpen(open);
    if (!open) {
      setEditingPost(null);
      setFormData(emptyForm);
    }
  };

  const handleCancel = () => {
    handleCloseDialog(false);
  };

  const handleSubmit = async (event) => {
    event?.preventDefault();
    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Please complete all required fields');
      return;
    }
    setSaving(true);
    try {
      if (editingPost) {
        await axios.put(`${API_BASE}/posts/${editingPost._id}`, formData, { headers: adminHeaders });
        toast.success('Post updated successfully');
      } else {
        await axios.post(`${API_BASE}/posts`, formData, { headers: adminHeaders });
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

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm('Delete this post? This action cannot be undone.');
    if (!confirmDelete) return;
    try {
      await axios.delete(`${API_BASE}/posts/${postId}`, { headers: adminHeaders });
      toast.success('Post deleted successfully');
      fetchPosts();
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to delete post';
      toast.error(message);
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
        console.log('Fetching reactions for post:', postId);
        const { data } = await axios.get(`${API_BASE}/posts/${postId}/reactions`, config);
        console.log('Received reactions data:', data);
        
        if (data && data.reactions) {
            setSelectedPostReactions(data);
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

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((n) => (
          <Card key={n}>
            <CardHeader>
              <div className="h-6 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
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
            Create and manage posts with student registration analytics
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2" onClick={handleOpenCreate}>
              <Plus className="h-4 w-4" />
              Create Post
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
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
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search posts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Posts List */}
      <div className="space-y-4">
        {filteredPosts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <p className="text-muted-foreground">
                {searchTerm ? `No posts found for "${searchTerm}"` : 'No posts created yet'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post._id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-xl">{post.title}</CardTitle>
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    {new Date(post.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{post.description}</p>

                {/* Registration Summary - Only 2 options */}
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <h4 className="font-medium text-sm mb-3 flex items-center gap-2">
                    <BarChart3 className="w-4 h-4" />
                    Student Registration Status
                  </h4>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span className="text-lg font-bold text-green-600">
                          {post.reactionCounts?.registered || 0}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">Registered</div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-center gap-1">
                        <X className="w-4 h-4 text-red-600" />
                        <span className="text-lg font-bold text-red-600">
                          {post.reactionCounts?.not_registered || 0}
                        </span>
                      </div>
                      <div className="text-xs text-gray-600">Not Registered</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-lg font-bold text-gray-800">
                        {post.reactionCounts?.total || 0}
                      </div>
                      <div className="text-xs text-gray-600">Total Responses</div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEdit(post)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewReactions(post._id)}
                    className="flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    View Student Details
                  </Button>

                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(post._id)}
                    className="flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Detailed Student Reactions Modal */}
      <Dialog open={isReactionsModalOpen} onOpenChange={setIsReactionsModalOpen}>
        <DialogContent className="max-w-6xl max-h-[85vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="text-xl">
              Student Registration Details: {selectedPostReactions?.postTitle}
            </DialogTitle>
          </DialogHeader>

          {selectedPostReactions && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-green-200 bg-green-50">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <CheckCircle className="w-8 h-8 text-green-600" />
                      <span className="text-3xl font-bold text-green-600">
                        {selectedPostReactions.reactions.counts.registered}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-green-800">Registered Students</p>
                  </CardContent>
                </Card>
                <Card className="border-red-200 bg-red-50">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center gap-3 mb-3">
                      <X className="w-8 h-8 text-red-600" />
                      <span className="text-3xl font-bold text-red-600">
                        {selectedPostReactions.reactions.counts.not_registered}
                      </span>
                    </div>
                    <p className="text-lg font-semibold text-red-800">Not Registered Students</p>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Student Lists */}
              {['registered', 'not_registered'].map((type) => (
                <div key={type} className="space-y-4">
                  <div className="flex items-center gap-3">
                    {type === 'registered' ? (
                      <CheckCircle className="w-6 h-6 text-green-600" />
                    ) : (
                      <X className="w-6 h-6 text-red-600" />
                    )}
                    <h3 className="text-xl font-bold capitalize text-gray-800">
                      {type.replace('_', ' ')} Students ({selectedPostReactions.reactions[type].length})
                    </h3>
                  </div>
                  
                  {selectedPostReactions.reactions[type].length > 0 ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {selectedPostReactions.reactions[type].map((reaction, index) => (
                        <Card key={index} className="border-l-4 border-l-blue-500 hover:shadow-md transition-shadow">
                          <CardContent className="p-4">
                            <div className="space-y-3">
                              {/* Student Name */}
                              <div className="flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-600" />
                                <h4 className="font-semibold text-lg">{reaction.user.name}</h4>
                              </div>
                              
                              {/* Student Details - Simplified */}
                              <div className="space-y-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Mail className="w-4 h-4" />
                                  <span className="break-all">{reaction.user.email}</span>
                                </div>
                                
                                <div className="flex items-center gap-2">
                                  <GraduationCap className="w-4 h-4" />
                                  <span>Roll No: {reaction.user.rollno}</span>
                                </div>
                                
                                {reaction.user.phone && (
                                  <div className="flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    <span>{reaction.user.phone}</span>
                                  </div>
                                )}
                              </div>
                              
                              {/* Response Date */}
                              <div className="pt-2 border-t">
                                <Badge variant="outline" className="text-xs">
                                  Responded on {new Date(reaction.reactedAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit'
                                  })}
                                </Badge>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <Card className="border-dashed border-gray-300">
                      <CardContent className="text-center py-8">
                        <p className="text-gray-500 italic">No students in this category</p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              ))}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Posts;

import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Plus, Pencil, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3002/api';

const emptyForm = {
  title: '',
  description: '',
};

export function Posts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
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
        toast.success('Post updated');
      } else {
        await axios.post(`${API_BASE}/posts`, formData, { headers: adminHeaders });
        toast.success('Post created');
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
      toast.success('Post deleted');
      fetchPosts();
    } catch (err) {
      const message = err.response?.data?.message || 'Unable to delete post';
      toast.error(message);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <p className="text-muted-foreground">
          Create announcements and manage existing posts for students.
        </p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Manage Posts</CardTitle>
            <CardDescription>Search, create, and maintain announcement posts.</CardDescription>
          </div>
          <Button className="gap-2" onClick={handleOpenCreate}>
            <Plus className="h-4 w-4" /> New Post
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Input
              placeholder="Search posts by title"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              className="sm:max-w-xs"
            />
            <Badge variant="secondary">{filteredPosts.length} items</Badge>
          </div>
          <Separator />
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading posts...</p>
          ) : error ? (
            <p className="text-sm text-destructive">{error}</p>
          ) : filteredPosts.length === 0 ? (
            <div className="rounded-lg border border-dashed border-border/60 bg-muted/10 p-8 text-center text-sm text-muted-foreground">
              No posts found.
            </div>
          ) : (
            <div className="space-y-4">
              {filteredPosts.map((post) => (
                <Card key={post._id} className="border border-border/60">
                  <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                    <div className="space-y-1">
                      <CardTitle className="text-xl">{post.title}</CardTitle>
                      <CardDescription>{post.description}</CardDescription>
                      <p className="text-xs text-muted-foreground">
                        Posted on {post.createdAt ? new Date(post.createdAt).toLocaleString() : 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="gap-2" onClick={() => handleOpenEdit(post)}>
                        <Pencil className="h-4 w-4" /> Edit
                      </Button>
                      <Button variant="destructive" size="sm" className="gap-2" onClick={() => handleDelete(post._id)}>
                        <Trash2 className="h-4 w-4" /> Delete
                      </Button>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={handleCloseDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingPost ? 'Edit Post' : 'Create Post'}</DialogTitle>
            <DialogDescription>
              {editingPost ? 'Update the title or description for this announcement.' : 'Share a new announcement for students.'}
            </DialogDescription>
          </DialogHeader>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="post-title">
                Title
              </label>
              <Input
                id="post-title"
                value={formData.title}
                onChange={(event) => handleFormChange('title', event.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="post-description">
                Description
              </label>
              <textarea
                id="post-description"
                value={formData.description}
                onChange={(event) => handleFormChange('description', event.target.value)}
                required
                className="min-h-[150px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => handleCloseDialog(false)} disabled={saving}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving} className="gap-2">
                {saving ? 'Saving...' : editingPost ? 'Save Changes' : 'Create Post'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Posts;

import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Calendar, Search, CheckCircle, X, ExternalLink, CalendarDays, Clock, Maximize2 } from 'lucide-react';

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

const sortOptions = [
  { label: 'Newest first', value: 'newest' },
  { label: 'Oldest first', value: 'oldest' },
  { label: 'Title A-Z', value: 'title-asc' },
  { label: 'Title Z-A', value: 'title-desc' },
];

export function StudentPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sort, setSort] = useState('newest');
  const [activeTab, setActiveTab] = useState('all');
  const [error, setError] = useState('');
  const [userReactions, setUserReactions] = useState({});
  const [expandedPosts, setExpandedPosts] = useState({});
  const [fullImageOpen, setFullImageOpen] = useState(false);
  const [fullImageUrl, setFullImageUrl] = useState('');

  const fetchPosts = async () => {
    try {
        setLoading(true);
        const { data } = await axios.get(`${API_BASE}/posts`);
        setPosts(Array.isArray(data) ? data : []);
        setError('');

        const reactions = {};
        const userId = getUserIdFromToken();

        if (userId) {
            data.forEach((post) => {
                const userReaction = post.reactions?.find((r) => {
                    const reactionUserId = r.userId._id || r.userId;
                    return reactionUserId === userId;
                });
                if (userReaction) {
                    reactions[post._id] = userReaction.type;
                }
            });
        }
        setUserReactions(reactions);
    } catch (fetchError) {
        setError('Unable to load posts right now. Please try again later.');
        toast.error('Failed to fetch posts');
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const getUserIdFromToken = () => {
    const token = localStorage.getItem('authToken');
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.id;
    } catch (error) {
      return null;
    }
  };

  const handleReaction = async (postId, reactionType) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      toast.error('Please login to react to posts');
      return;
    }

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        role: 'student',
      },
    };

    try {
      if (userReactions[postId] === reactionType) {
        await axios.delete(`${API_BASE}/posts/${postId}/react`, config);
        setUserReactions((prev) => {
          const updated = { ...prev };
          delete updated[postId];
          return updated;
        });
        toast.success('Response removed');
      } else {
        await axios.post(
          `${API_BASE}/posts/${postId}/react`,
          { reactionType },
          config
        );
        setUserReactions((prev) => ({ ...prev, [postId]: reactionType }));
        
        const labels = {
          registered: 'Registered',
          not_registered: 'Not Registered'
        };
        toast.success(`Marked as ${labels[reactionType]}`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update reaction');
    }
  };

  const getReactionIcon = (type) => {
    switch (type) {
      case 'registered':
        return <CheckCircle className="w-4 h-4" />;
      case 'not_registered':
        return <X className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getReactionClassName = (postId, type) => {
    const isSelected = userReactions[postId] === type;
    if (isSelected) {
      switch (type) {
        case 'registered': 
          return 'bg-green-500 hover:bg-green-600 text-white border-green-500 shadow-md';
        case 'not_registered': 
          return 'bg-red-500 hover:bg-red-600 text-white border-red-500 shadow-md';
        default: 
          return '';
      }
    }
    return 'hover:bg-gray-50 dark:hover:bg-gray-800';
  };

  const toggleExpandPost = (postId) => {
    setExpandedPosts(prev => ({
      ...prev,
      [postId]: !prev[postId]
    }));
  };

  const openFullImage = (imageUrl) => {
    setFullImageUrl(imageUrl);
    setFullImageOpen(true);
  };

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    let filtered = posts;

    // Filter by category
    if (activeTab !== 'all') {
      filtered = filtered.filter((post) => post.category === activeTab);
    }

    // Filter by search
    if (normalizedSearch) {
      filtered = filtered.filter((post) => {
        const title = post.title?.toLowerCase() ?? '';
        const description = post.description?.toLowerCase() ?? '';
        return title.includes(normalizedSearch) || description.includes(normalizedSearch);
      });
    }

    // Sort
    const sorted = [...filtered].sort((a, b) => {
      const aDate = a.updatedAt || a.createdAt;
      const bDate = b.updatedAt || b.createdAt;
      const aTitle = a.title?.toLowerCase() || '';
      const bTitle = b.title?.toLowerCase() || '';

      switch (sort) {
        case 'oldest':
          return new Date(aDate || 0).getTime() - new Date(bDate || 0).getTime();
        case 'title-asc':
          return aTitle.localeCompare(bTitle);
        case 'title-desc':
          return bTitle.localeCompare(aTitle);
        case 'newest':
        default:
          return new Date(bDate || 0).getTime() - new Date(aDate || 0).getTime();
      }
    });

    return sorted;
  }, [posts, searchTerm, activeTab, sort]);

  const renderSkeletons = () => (
    <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
      {[0, 1, 2, 3].map((item) => (
        <Card key={item} className="overflow-hidden">
          <Skeleton className="h-64 w-full" />
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="mt-2 h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Posts & Announcements</h1>
        <p className="text-muted-foreground">
          Stay informed about announcements, hiring drives, events, and important updates. Mark your registration status!
        </p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Browse posts</CardTitle>
          <CardDescription>Filter by category or search across all updates and show your registration status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="relative md:max-w-sm flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search posts by keywords"
                className="pl-10"
              />
            </div>
            <Tabs value={sort} onValueChange={setSort} className="md:w-auto">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
                {sortOptions.map((option) => (
                  <TabsTrigger key={option.value} value={option.value} className="text-xs">
                    {option.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex flex-wrap gap-2">
              <TabsTrigger value="all">All</TabsTrigger>
              {Object.entries(CATEGORIES).map(([value, { label }]) => (
                <TabsTrigger key={value} value={value} className="capitalize">
                  {label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {error && (
        <Card className="border-destructive/50 bg-destructive/10">
          <CardContent className="py-3 text-sm text-destructive">{error}</CardContent>
        </Card>
      )}

      {loading ? (
        renderSkeletons()
      ) : filteredPosts.length === 0 ? (
        <Card className="border border-dashed border-border/60 bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">No posts to show</CardTitle>
            <CardDescription>
              Try a different search term or switch to another category.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button variant="outline" size="sm" onClick={() => setSearchTerm('')}>
              Clear search
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          {filteredPosts.map((post) => {
            const postedAt = post.createdAt
              ? new Date(post.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
              : 'Date unavailable';
            const category = CATEGORIES[post.category] || CATEGORIES.general;
            const description = post.description || 'No description provided.';
            const isExpanded = expandedPosts[post._id];
            const shouldShowReadMore = description.length > 200;

            return (
              <Card key={post._id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
                {/* Event Image */}
                {post.imageUrl && (
                  <div 
                    className="relative w-full h-64 bg-gray-100 dark:bg-gray-800 overflow-hidden cursor-pointer group/image"
                    onClick={() => openFullImage(post.imageUrl)}
                  >
                    <img 
                      src={post.imageUrl} 
                      alt={post.title}
                      className="w-full h-full object-cover group-hover/image:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/0 group-hover/image:bg-black/20 transition-colors flex items-center justify-center">
                      <div className="bg-white/90 dark:bg-gray-900/90 rounded-full p-3 opacity-0 group-hover/image:opacity-100 transition-opacity">
                        <Maximize2 className="w-6 h-6 text-gray-800 dark:text-gray-200" />
                      </div>
                    </div>
                    <div className="absolute bottom-4 left-4 right-4">
                      <Badge variant="secondary" className="backdrop-blur-md bg-white/90 dark:bg-gray-900/90 mb-2">
                        {category.label}
                      </Badge>
                    </div>
                    {post.eventDate && (
                      <div className="absolute top-4 right-4">
                        <Badge className="backdrop-blur-md bg-blue-600/90 text-white shadow-lg">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(post.eventDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </Badge>
                      </div>
                    )}
                  </div>
                )}

                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-2">
                      <CardTitle className="text-xl font-bold leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {post.title || 'Untitled post'}
                      </CardTitle>
                      <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>{postedAt}</span>
                        </div>
                        {!post.imageUrl && post.eventDate && (
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-950">
                            <CalendarDays className="w-3 h-3 mr-1" />
                            {new Date(post.eventDate).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </Badge>
                        )}
                      </div>
                    </div>
                    {!post.imageUrl && (
                      <Badge variant="secondary" className="uppercase shrink-0">
                        {category.label}
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Full Description with Read More */}
                  <div>
                    <p className={`text-muted-foreground leading-relaxed whitespace-pre-wrap ${!isExpanded && shouldShowReadMore ? 'line-clamp-3' : ''}`}>
                      {description}
                    </p>
                    {shouldShowReadMore && (
                      <Button
                        variant="link"
                        size="sm"
                        onClick={() => toggleExpandPost(post._id)}
                        className="px-0 h-auto font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                      >
                        {isExpanded ? 'Show less' : 'Read more'}
                      </Button>
                    )}
                  </div>

                  {/* Registration Link */}
                  {post.registrationLink && (
                    <a
                      href={post.registrationLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900 dark:hover:to-emerald-900 rounded-xl border-2 border-green-200 dark:border-green-800 transition-all group/link shadow-sm hover:shadow-md"
                    >
                      <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg group-hover/link:bg-green-200 dark:group-hover/link:bg-green-800 transition-colors">
                        <ExternalLink className="w-5 h-5 text-green-700 dark:text-green-300" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-green-800 dark:text-green-200">Registration Link</p>
                        <p className="text-xs text-green-600 dark:text-green-400">Click to register for this event</p>
                      </div>
                      <span className="text-xs font-medium text-green-600 dark:text-green-400 group-hover/link:translate-x-1 transition-transform">
                        Open →
                      </span>
                    </a>
                  )}

                  {/* Registration Buttons */}
                  <div className="space-y-3 border-t dark:border-gray-700 pt-4">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                      Your Registration Status
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      {['registered', 'not_registered'].map((type) => {
                        const isSelected = userReactions[post._id] === type;
                        const labels = {
                          registered: 'Registered',
                          not_registered: 'Not Registered'
                        };
                        
                        return (
                          <Button
                            key={type}
                            onClick={() => handleReaction(post._id, type)}
                            variant="outline"
                            size="sm"
                            className={`flex items-center justify-center gap-2 h-11 font-medium transition-all ${getReactionClassName(post._id, type)}`}
                          >
                            {getReactionIcon(type)}
                            {labels[type]}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Current Selection Indicator */}
                    {userReactions[post._id] && (
                      <div className="flex items-center gap-2 p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg text-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="p-1.5 bg-blue-100 dark:bg-blue-900 rounded-md">
                          {getReactionIcon(userReactions[post._id])}
                        </div>
                        <span className="text-blue-800 dark:text-blue-200 flex-1">
                          Marked as <strong className="font-semibold">
                            {userReactions[post._id] === 'registered' ? 'Registered' : 'Not Registered'}
                          </strong>
                        </span>
                        <span className="text-blue-600 dark:text-blue-400 text-xs font-medium">
                          Click to change
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Updated {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : 'N/A'}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}

      {/* Full Image Dialog */}
      <Dialog open={fullImageOpen} onOpenChange={setFullImageOpen}>
        <DialogContent className="max-w-7xl max-h-[95vh] p-0 overflow-hidden">
          <div className="relative w-full h-full flex items-center justify-center bg-black/90">
            <img 
              src={fullImageUrl} 
              alt="Full size" 
              className="max-w-full max-h-[95vh] object-contain"
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default StudentPosts;

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
import { toast } from 'sonner';
import { Calendar, Search, CheckCircle, X } from 'lucide-react';

const TAGS = {
  general: 'General',
  hiring: 'Hiring',
  announcement: 'Announcement',
  event: 'Event',
  update: 'Update',
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

  const fetchPosts = async () => {
    try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:3002/api/posts');
        setPosts(Array.isArray(data) ? data : []);
        setError('');

        // Extract user's current reactions
        const reactions = {};
        const userId = getUserIdFromToken();

        if (userId) {
            data.forEach((post) => {
                const userReaction = post.reactions?.find((r) => {
                    // Handle both populated and non-populated userId
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
        // Remove reaction if clicking the same button
        await axios.delete(`http://localhost:3002/api/posts/${postId}/react`, config);
        setUserReactions((prev) => {
          const updated = { ...prev };
          delete updated[postId];
          return updated;
        });
        toast.success('Response removed');
      } else {
        // Add or update reaction
        await axios.post(
          `http://localhost:3002/api/posts/${postId}/react`,
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
          return 'bg-green-500 hover:bg-green-600 text-white border-green-500';
        case 'not_registered': 
          return 'bg-red-500 hover:bg-red-600 text-white border-red-500';
        default: 
          return '';
      }
    }
    return 'hover:bg-gray-50';
  };

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const byTab =
      activeTab === 'all'
        ? posts
        : posts.filter((post) => post.category?.toLowerCase() === activeTab);

    const bySearch = normalizedSearch
      ? byTab.filter((post) => {
          const title = post.title?.toLowerCase() ?? '';
          const description = post.description?.toLowerCase() ?? '';
          return (
            title.includes(normalizedSearch) || description.includes(normalizedSearch)
          );
        })
      : byTab;

    const sorted = [...bySearch].sort((a, b) => {
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
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {[0, 1, 2, 3, 4, 5].map((item) => (
        <Card key={item} className="border border-border/60">
          <CardHeader>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="mt-2 h-3 w-24" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-3 w-full" />
            <Skeleton className="h-3 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </CardContent>
          <CardFooter>
            <Skeleton className="h-3 w-32" />
          </CardFooter>
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
            <div className="relative md:max-w-sm">
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
              {Object.entries(TAGS).map(([value, label]) => (
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
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-1">
          {filteredPosts.map((post) => {
            const postedAt = post.createdAt
              ? new Date(post.createdAt).toLocaleString()
              : 'Date unavailable';
            const tagLabel = TAGS[post.category?.toLowerCase?.() || ''] || 'General';
            const description = post.description || 'No description provided.';

            return (
              <Card key={post._id} className="border border-border/60 shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-xl font-semibold leading-tight mb-2">
                        {post.title || 'Untitled post'}
                      </CardTitle>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{postedAt}</span>
                      </div>
                    </div>
                    <Badge variant="secondary" className="uppercase shrink-0">
                      {tagLabel}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {description}
                  </p>

                  {/* Registration Buttons - Only 2 options */}
                  <div className="space-y-3 border-t pt-4">
                    <h4 className="text-sm font-medium">Your Registration Status:</h4>
                    <div className="flex flex-wrap gap-3">
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
                            className={`flex items-center gap-2 min-w-[140px] ${getReactionClassName(post._id, type)}`}
                          >
                            {getReactionIcon(type)}
                            {labels[type]}
                          </Button>
                        );
                      })}
                    </div>

                    {/* Current Selection Indicator */}
                    {userReactions[post._id] && (
                      <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm">
                        {getReactionIcon(userReactions[post._id])}
                        <span className="text-blue-800">
                          You have marked yourself as <strong>
                            {userReactions[post._id] === 'registered' ? 'Registered' : 'Not Registered'}
                          </strong>
                        </span>
                        <span className="text-blue-600 text-xs ml-auto">
                          Click again to remove
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>

                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground pt-4 border-t">
                  <span>Updated {post.updatedAt ? new Date(post.updatedAt).toLocaleDateString() : 'N/A'}</span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default StudentPosts;

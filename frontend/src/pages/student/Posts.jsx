import { useEffect, useMemo, useState } from 'react';
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

  useEffect(() => {
    let isMounted = true;
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:3002/api/posts');
        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
          setError('');
        }
      } catch (fetchError) {
        if (isMounted) {
          setError('Unable to load posts right now. Please try again later.');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredPosts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    const byTab = activeTab === 'all'
      ? posts
      : posts.filter((post) => post.category?.toLowerCase() === activeTab);

    const bySearch = normalizedSearch
      ? byTab.filter((post) => {
          const title = post.title?.toLowerCase() ?? '';
          const description = post.description?.toLowerCase() ?? '';
          return title.includes(normalizedSearch) || description.includes(normalizedSearch);
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
        <h1 className="text-3xl font-bold tracking-tight">Placement Updates</h1>
        <p className="text-muted-foreground">
          Stay informed about announcements, hiring drives, events, and important updates.
        </p>
      </div>

      <Card className="border-none shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Browse posts</CardTitle>
          <CardDescription>Filter by category or search across all updates.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search posts by keywords"
              className="md:max-w-sm"
            />
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
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filteredPosts.map((post) => {
            const postedAt = post.createdAt
              ? new Date(post.createdAt).toLocaleString()
              : 'Date unavailable';
            const tagLabel = TAGS[post.category?.toLowerCase?.() || ''] || 'General';
            const description = post.description || 'No description provided.';

            return (
              <Card key={post._id} className="flex h-full flex-col border border-border/60 shadow-sm">
                <CardHeader className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <CardTitle className="text-xl font-semibold leading-tight">
                      {post.title || 'Untitled post'}
                    </CardTitle>
                    <Badge variant="secondary" className="uppercase">
                      {tagLabel}
                    </Badge>
                  </div>
                  <CardDescription>{postedAt}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {description.length > 220 ? `${description.slice(0, 220)}…` : description}
                  </p>
                </CardContent>
                <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Updated {post.updatedAt ? new Date(post.updatedAt).toLocaleString() : 'N/A'}</span>
                  <Button variant="link" size="sm" asChild className="px-0">
                    <a href="/student/applications">View related listings</a>
                  </Button>
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

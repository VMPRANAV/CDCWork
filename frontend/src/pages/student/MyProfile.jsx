import { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MyProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [viewerOpen, setViewerOpen] = useState(false);

  const headers = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'student',
    };
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:3002/api/users/profile', { headers });
        if (!mounted) return;
        setProfile(data || {});
      } catch (e) {
        if (!mounted) return;
        setProfile({});
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, [headers]);

  useEffect(() => {
    if (!viewerOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') setViewerOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [viewerOpen]);

  const handleClose = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/student/dashboard', { replace: true });
    }
  };

  const storedUser = (() => {
    try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
  })();

  const photoUrl = profile?.photoUrl || storedUser.photoUrl || '';
  const avatarSrc = photoUrl || '/avatars/student.png';
  const firstName = profile?.firstName || storedUser.firstName || '';
  const lastName = profile?.lastName || storedUser.lastName || '';
  const displayName = profile?.fullName || `${firstName} ${lastName}`.trim() || storedUser.name || storedUser.collegeEmail || 'Student';
  const role = profile?.role || storedUser.role || 'student';
  const dept = profile?.dept || storedUser.dept || 'N/A';

  const firstInitial = (firstName?.[0] || displayName?.[0] || 'S').toUpperCase();
  const secondInitial = (lastName?.[0] || '').toUpperCase();
  const initials = `${firstInitial}${secondInitial}`.trim() || 'ST';

  const canZoom = Boolean(avatarSrc);

  return (
    <div className="mx-auto max-w-3xl">
      <Card className="relative overflow-hidden border-border/60 bg-card/95 shadow-sm backdrop-blur">
        <div className="h-24 w-full bg-gradient-to-r from-primary/10 via-primary/5 to-transparent" />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close"
          onClick={handleClose}
          className="absolute right-2 top-2 rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </Button>
        <CardHeader className="-mt-10">
          <div className="flex items-end gap-4">
            <div
              className={"rounded-full " + (canZoom ? 'cursor-zoom-in' : '')}
              title={canZoom ? 'Click to view large' : undefined}
              onClick={() => canZoom && setViewerOpen(true)}
            >
              <Avatar className="h-20 w-20 ring-2 ring-background">
                <AvatarImage src={avatarSrc} alt={displayName} />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col">
              <CardTitle className="text-2xl font-bold">{displayName}</CardTitle>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge variant="default" className="capitalize">{role}</Badge>
                <Badge variant="secondary" className="uppercase">{dept}</Badge>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="space-y-3">
              <div className="h-5 w-40 animate-pulse rounded bg-muted" />
              <div className="h-4 w-64 animate-pulse rounded bg-muted" />
              <div className="h-4 w-52 animate-pulse rounded bg-muted" />
            </div>
          ) : (
            <>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">College Email</p>
                  <p className="text-sm font-medium">{profile?.collegeEmail || storedUser.collegeEmail || 'N/A'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Roll Number</p>
                  <p className="text-sm font-medium">{profile?.rollNo || 'N/A'}</p>
                </div>
                
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {viewerOpen && (
        <div
          className="fixed inset-0 z-51 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setViewerOpen(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label="Close image viewer"
              onClick={() => setViewerOpen(false)}
              className="absolute -right-2 -top-2 rounded-full bg-black/60 text-white hover:bg-black/70"
            >
              <X className="h-5 w-5" />
            </Button>
            <img
              src={avatarSrc}
              alt={displayName}
              className="max-h-[90vh] max-w-[90vw] rounded-md object-contain"
            />
          </div>
        </div>
      )}
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { User, Shield, Bell, X } from 'lucide-react';

// Remove empty values and coerce numeric fields before sending to API (subset used here)
function cleanForUpdate(input) {
  const numericPaths = new Set([
    'passoutYear',
    'ugCgpa',
    'historyOfArrears',
    'currentArrears',
  ]);
  const toNumber = (v) => (v === '' || v === null || v === undefined ? undefined : Number(v));
  const walk = (obj, path = '') => {
    if (obj == null) return undefined;
    if (Array.isArray(obj)) {
      const arr = obj.map((v, i) => walk(v, path ? `${path}.${i}` : String(i))).filter((v) => v !== undefined);
      return arr.length ? arr : undefined;
    }
    if (typeof obj !== 'object') {
      if (obj === '') return undefined;
      if (numericPaths.has(path)) {
        const num = toNumber(obj);
        return Number.isFinite(num) ? num : undefined;
      }
      return obj;
    }
    const out = {};
    for (const [k, v] of Object.entries(obj)) {
      const childPath = path ? `${path}.${k}` : k;
      const cleaned = walk(v, childPath);
      if (cleaned !== undefined && !(typeof cleaned === 'object' && !Array.isArray(cleaned) && Object.keys(cleaned).length === 0)) {
        out[k] = cleaned;
      }
    }
    return Object.keys(out).length ? out : undefined;
  };
  return walk(input) || {};
}

export default function Settings() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const headers = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'student',
    };
  }, []);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('http://localhost:3002/api/users/profile', { headers });
        setProfile(data || {});
      } catch (error) {
        toast.error('Failed to load settings', { description: error.response?.data?.message || 'Please try again.' });
      } finally {
        setLoading(false);
      }
    })();
  }, [headers]);

  // Account form state
  const [account, setAccount] = useState({ firstName: '', lastName: '', personalEmail: '', mobileNumber: '' });
  const [errors, setErrors] = useState({ personalEmail: '', mobileNumber: '' });

  useEffect(() => {
    if (!profile) return;
    const next = {
      firstName: profile.firstName || '',
      lastName: profile.lastName || '',
      personalEmail: profile.personalEmail || '',
      mobileNumber: profile.mobileNumber || '',
    };
    setAccount(next);
    validateAndSetAccountErrors(next);
  }, [profile]);

  // Pure validator: returns errors (no state updates)
  function computeAccountErrors(a) {
    const next = { personalEmail: '', mobileNumber: '' };
    if (a.personalEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(a.personalEmail)) {
      next.personalEmail = 'Enter a valid email address.';
    }
    const digits = a.mobileNumber?.replace(/\s+/g, '') || '';
    if (digits && !/^[0-9]{10}$/.test(digits)) {
      next.mobileNumber = 'Mobile number must be 10 digits.';
    }
    return next;
  }

  // Update errors state based on current account
  function validateAndSetAccountErrors(a) {
    const next = computeAccountErrors(a);
    setErrors(next);
    return !next.personalEmail && !next.mobileNumber;
  }

  const onAccountChange = (field) => (e) => {
    const next = { ...account, [field]: e.target.value };
    setAccount(next);
    validateAndSetAccountErrors(next);
  };

  const handleAccountSave = async () => {
    if (!validateAndSetAccountErrors(account)) return;
    try {
      setSaving(true);
      const payload = cleanForUpdate({ ...profile, ...account });
      const { data } = await axios.put('http://localhost:3002/api/users/profile', payload, { headers });
      setProfile(data);
      toast.success('Account updated');
    } catch (error) {
      toast.error('Failed to save account', { description: error.response?.data?.message || 'Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Security form (stub endpoint)
  const [security, setSecurity] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const handleChangePassword = async () => {
    if (!security.newPassword || security.newPassword !== security.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      setSaving(true);
      await axios.post('http://localhost:3002/api/auth/change-password', security, { headers });
      toast.success('Password changed');
      setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      toast.error('Failed to change password', { description: error.response?.data?.message || 'Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  // Notifications (local-only for now)
  const [notify, setNotify] = useState({ email: true, push: false });
  useEffect(() => {
    const raw = localStorage.getItem('student_notifications');
    if (raw) {
      try { setNotify(JSON.parse(raw)); } catch { /* ignore */ }
    }
  }, []);
  const saveNotifications = () => {
    localStorage.setItem('student_notifications', JSON.stringify(notify));
    toast.success('Notification preferences saved');
  };

  // Preferences (theme/lang local-only) — removed UI tab for now
  const [prefs, setPrefs] = useState({ language: localStorage.getItem('language') || 'en' });
  const savePrefs = () => {
    localStorage.setItem('language', prefs.language);
    toast.success('Preferences saved');
  };

  const resetAccount = () => setAccount({
    firstName: profile?.firstName || '',
    lastName: profile?.lastName || '',
    personalEmail: profile?.personalEmail || '',
    mobileNumber: profile?.mobileNumber || '',
  });

  // Derive validity from errors; do not set state in render
  const isAccountValid = !errors.personalEmail && !errors.mobileNumber;

  return (
    <div className="space-y-6">
      {/* Gradient hero header with close button */}
      <div className="relative overflow-hidden rounded-xl border bg-gradient-to-r from-primary/10 via-primary/5 to-transparent p-6">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Close settings"
          className="absolute right-2 top-2"
          onClick={() => navigate(-1)}
        >
          <X className="h-5 w-5" />
        </Button>
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
        <div className="pointer-events-none absolute -left-10 -bottom-10 h-40 w-40 rounded-full bg-primary/10 blur-2xl" />
        <div>
          <h1 className="text-2xl font-semibold">Settings</h1>
          <p className="text-sm text-muted-foreground">Manage your account, security, notifications, and preferences.</p>
        </div>
      </div>

      {/* Two-column layout with sticky vertical tabs */}
      <Tabs defaultValue="account" className="grid gap-4 md:grid-cols-5">
        <TabsList className="md:col-span-1 md:sticky md:top-20 md:h-max md:flex md:flex-col md:items-stretch md:gap-1 bg-muted/40 p-1 rounded-lg w-full justify-start overflow-x-auto">
          <TabsTrigger value="account" className="justify-start gap-2 transition-colors data-[state=active]:bg-background data-[state=active]:shadow">
            <User className="h-4 w-4" /> Account
          </TabsTrigger>
          <TabsTrigger value="security" className="justify-start gap-2 transition-colors data-[state=active]:bg-background data-[state=active]:shadow">
            <Shield className="h-4 w-4" /> Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="justify-start gap-2 transition-colors data-[state=active]:bg-background data-[state=active]:shadow">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
        </TabsList>

        <div className="md:col-span-4 space-y-6">
          {/* Account */}
          <TabsContent value="account" className="animate-in fade-in-50 slide-in-from-right-2 duration-300">
            <Card className="border-none shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Account</CardTitle>
                <CardDescription>Update your basic account information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Inline success banner */}
                {!loading && profile && (
                  <div className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-800 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200">
                    Your account details are synced.
                  </div>
                )}

                {loading ? (
                  <div className="space-y-3">
                    <div className="h-4 w-40 animate-pulse rounded bg-muted" />
                    <div className="h-4 w-64 animate-pulse rounded bg-muted" />
                  </div>
                ) : (
                  <>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2 rounded-md border p-3 transition-shadow focus-within:ring-2 focus-within:ring-primary/20">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          placeholder="John"
                          className="transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                          value={account.firstName}
                          onChange={onAccountChange('firstName')}
                        />
                        <p className="text-xs text-muted-foreground">Your given name.</p>
                      </div>

                      <div className="space-y-2 rounded-md border p-3 transition-shadow focus-within:ring-2 focus-within:ring-primary/20">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          placeholder="Doe"
                          className="transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                          value={account.lastName}
                          onChange={onAccountChange('lastName')}
                        />
                        <p className="text-xs text-muted-foreground">Your family name.</p>
                      </div>

                      <div className="space-y-2 rounded-md border p-3 transition-shadow focus-within:ring-2 focus-within:ring-primary/20">
                        <Label htmlFor="personalEmail">Personal Email</Label>
                        <Input
                          id="personalEmail"
                          type="email"
                          placeholder="you@example.com"
                          className="transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                          value={account.personalEmail}
                          onChange={onAccountChange('personalEmail')}
                        />
                        {errors.personalEmail
                          ? <p className="text-xs text-red-500">{errors.personalEmail}</p>
                          : <p className="text-xs text-muted-foreground">For placement-related communication.</p>
                        }
                      </div>

                      <div className="space-y-2 rounded-md border p-3 transition-shadow focus-within:ring-2 focus-within:ring-primary/20">
                        <Label htmlFor="mobileNumber">Mobile Number</Label>
                        <Input
                          id="mobileNumber"
                          placeholder="98765 43210"
                          className="transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                          value={account.mobileNumber}
                          onChange={onAccountChange('mobileNumber')}
                        />
                        {errors.mobileNumber
                          ? <p className="text-xs text-red-500">{errors.mobileNumber}</p>
                          : <p className="text-xs text-muted-foreground">Use an active number reachable by recruiters.</p>
                        }
                      </div>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        type="button"
                        className="transition-transform active:scale-95"
                        onClick={resetAccount}
                      >
                        Reset
                      </Button>
                      <Button
                        className="transition-transform active:scale-95"
                        onClick={handleAccountSave}
                        disabled={saving || !isAccountValid}
                      >
                        {saving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security */}
          <TabsContent value="security" className="animate-in fade-in-50 slide-in-from-right-2 duration-300">
            <Card className="border-none shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Security</CardTitle>
                <CardDescription>Change your password.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2 rounded-md border p-3 transition-shadow focus-within:ring-2 focus-within:ring-primary/20">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="••••••••"
                      className="transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                      value={security.currentPassword}
                      onChange={(e) => setSecurity((p) => ({ ...p, currentPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 rounded-md border p-3 transition-shadow focus-within:ring-2 focus-within:ring-primary/20">
                    <Label htmlFor="newPassword">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="At least 8 characters"
                      className="transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                      value={security.newPassword}
                      onChange={(e) => setSecurity((p) => ({ ...p, newPassword: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2 rounded-md border p-3 transition-shadow focus-within:ring-2 focus-within:ring-primary/20 md:col-span-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Re-enter new password"
                      className="transition-all focus-visible:ring-2 focus-visible:ring-primary/40"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity((p) => ({ ...p, confirmPassword: e.target.value }))}
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    type="button"
                    className="transition-transform active:scale-95"
                    onClick={() => setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' })}
                  >
                    Reset
                  </Button>
                  <Button className="transition-transform active:scale-95" onClick={handleChangePassword} disabled={saving}>
                    {saving ? 'Saving...' : 'Change Password'}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications */}
          <TabsContent value="notifications" className="animate-in fade-in-50 slide-in-from-right-2 duration-300">
            <Card className="border-none shadow-sm transition-shadow hover:shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Notifications</CardTitle>
                <CardDescription>Control how you receive updates.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">Email notifications</p>
                    <p className="text-xs text-muted-foreground">Receive updates via email.</p>
                  </div>
                  <Switch checked={notify.email} onCheckedChange={(v) => setNotify((p) => ({ ...p, email: v }))} />
                </div>
                <div className="flex items-center justify-between rounded-lg border p-4 transition-colors hover:bg-muted/30">
                  <div>
                    <p className="text-sm font-medium">Push notifications</p>
                    <p className="text-xs text-muted-foreground">Get alerts in the app.</p>
                  </div>
                  <Switch checked={notify.push} onCheckedChange={(v) => setNotify((p) => ({ ...p, push: v }))} />
                </div>
                <div className="flex justify-end">
                  <Button className="transition-transform active:scale-95" onClick={saveNotifications}>Save</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
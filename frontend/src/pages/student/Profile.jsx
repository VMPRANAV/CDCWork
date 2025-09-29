// frontend/src/pages/student/Profile.jsx
import { useCallback, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { toast } from 'sonner';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';

const normalizeProfile = (data = {}) => ({
  ...data,
  education: {
    tenth: data.education?.tenth || {},
    twelth: data.education?.twelth || {},
    diploma: data.education?.diploma || {},
  },
  codingProfiles: data.codingProfiles || {},
  languages: {
    japanese: data.languages?.japanese || { knows: false, level: 'Not Applicable' },
    german: data.languages?.german || { knows: false, level: 'Not Applicable' },
  },
  address: data.address || {},
});

// Remove empty values and coerce numeric fields before sending to API
function cleanForUpdate(input) {
  const numericPaths = new Set([
    'passoutYear',
    'ugCgpa',
    'historyOfArrears',
    'currentArrears',
    'education.tenth.percentage',
    'education.tenth.passingYear',
    'education.twelth.percentage',
    'education.twelth.passingYear',
    'education.diploma.percentage',
    'education.diploma.passingYear',
  ]);

  const toNumber = (v) => (v === '' || v === null || v === undefined ? undefined : Number(v));

  const walk = (obj, path = '') => {
    if (obj == null) return undefined;

    if (Array.isArray(obj)) {
      const arr = obj
        .map((v, i) => walk(v, path ? `${path}.${i}` : String(i)))
        .filter((v) => v !== undefined);
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
      if (
        cleaned !== undefined &&
        !(typeof cleaned === 'object' && !Array.isArray(cleaned) && Object.keys(cleaned).length === 0)
      ) {
        out[k] = cleaned;
      }
    }
    return Object.keys(out).length ? out : undefined;
  };

  return walk(input) || {};
}

const languageLevels = {
  japanese: ['N5', 'N4', 'N3', 'N2', 'N1', 'Not Applicable'],
  german: ['A1', 'A2', 'B1', 'B2', 'C1', 'C2', 'Not Appeared', 'Not Applicable'],
};

const departmentOptions = [
  'AIDS',
  'BME',
  'CHEM',
  'CIVIL',
  'CSE',
  'AIML',
  'Cyber Security',
  'CSBS',
  'ECE',
  'EEE',
  'IT',
  'Mechanical',
  'Mechatronics',
];

export function StudentProfile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeEdit, setActiveEdit] = useState(null);
  const [drafts, setDrafts] = useState({});
  const [uploading, setUploading] = useState({ resume: false, photo: false });

  const headers = useMemo(() => {
    const token = localStorage.getItem('authToken');
    return {
      Authorization: token ? `Bearer ${token}` : undefined,
      role: 'student',
    };
  }, []);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:3002/api/users/profile', { headers });
      setProfile(normalizeProfile(data));
    } catch (error) {
      toast.error('Failed to load profile', {
        description: error.response?.data?.message || 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  }, [headers]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const startEdit = (section) => {
    if (!profile) return;
    let sectionDraft = {};
    switch (section) {
      case 'personal': {
        const {
          firstName = '',
          middleName = '',
          lastName = '',
          dob = '',
          gender = '',
          nationality = '',
        } = profile;
        sectionDraft = {
          firstName,
          middleName,
          lastName,
          dob: dob ? new Date(dob).toISOString().split('T')[0] : '',
          gender,
          nationality,
        };
        break;
      }
      case 'academic': {
        sectionDraft = {
          universityRegNumber: profile.universityRegNumber || '',
          rollNo: profile.rollNo || '',
          dept: profile.dept || '',
          quota: profile.quota || '',
          passoutYear: profile.passoutYear || '',
          ugCgpa: profile.ugCgpa ?? '',
          historyOfArrears: profile.historyOfArrears ?? 0,
          currentArrears: profile.currentArrears ?? 0,
          education: {
            tenth: {
              percentage: profile.education?.tenth?.percentage || '',
              board: profile.education?.tenth?.board || '',
              passingYear: profile.education?.tenth?.passingYear || '',
            },
            twelth: {
              percentage: profile.education?.twelth?.percentage || '',
              board: profile.education?.twelth?.board || '',
              passingYear: profile.education?.twelth?.passingYear || '',
            },
            diploma: {
              percentage: profile.education?.diploma?.percentage || '',
              passingYear: profile.education?.diploma?.passingYear || '',
            },
          },
        };
        break;
      }
      case 'professional': {
        sectionDraft = {
          codingProfiles: {
            github: profile.codingProfiles?.github || '',
            leetcode: profile.codingProfiles?.leetcode || '',
            codeforces: profile.codingProfiles?.codeforces || '',
            hackerrank: profile.codingProfiles?.hackerrank || '',
            geeksforgeeks: profile.codingProfiles?.geeksforgeeks || '',
          },
          languages: {
            japanese: {
              knows: Boolean(profile.languages?.japanese?.knows),
              level: profile.languages?.japanese?.level || 'Not Applicable',
            },
            german: {
              knows: Boolean(profile.languages?.german?.knows),
              level: profile.languages?.german?.level || 'Not Applicable',
            },
          },
          resumeUrl: profile.resumeUrl || '',
          photoUrl: profile.photoUrl || '',
        };
        break;
      }
      case 'contact': {
        sectionDraft = {
          mobileNumber: profile.mobileNumber || '',
          personalEmail: profile.personalEmail || '',
          residence: profile.residence || '',
          address: {
            city: profile.address?.city || '',
            state: profile.address?.state || '',
          },
          panNumber: profile.panNumber || '',
          aadharNumber: profile.aadharNumber || '',
        };
        break;
      }
      default:
        break;
    }
    setDrafts((prev) => ({ ...prev, [section]: sectionDraft }));
    setActiveEdit(section);
  };

  const cancelEdit = (section) => {
    setActiveEdit((prev) => (prev === section ? null : prev));
    setDrafts((prev) => ({ ...prev, [section]: null }));
  };

  const updateDraft = (section, path, value) => {
    setDrafts((prev) => {
      const current = prev[section] || {};
      if (!path.includes('.')) {
        return { ...prev, [section]: { ...current, [path]: value } };
      }
      const segments = path.split('.');
      const nextDraft = structuredClone(current);
      let node = nextDraft;
      for (let i = 0; i < segments.length - 1; i += 1) {
        const key = segments[i];
        node[key] = node[key] ? { ...node[key] } : {};
        node = node[key];
      }
      node[segments[segments.length - 1]] = value;
      return { ...prev, [section]: nextDraft };
    });
  };

  const persistProfile = async (payload, successMessage) => {
    try {
      const cleanPayload = cleanForUpdate(payload);
      const { data } = await axios.put('http://localhost:3002/api/users/profile', cleanPayload, {
        headers,
      });
      setProfile(normalizeProfile(data));
      toast.success(successMessage);
      return true;
    } catch (error) {
      toast.error('Failed to update profile', {
        description: error.response?.data?.message || 'Please try again.',
      });
      return false;
    }
  };

  const saveSection = async (section) => {
    if (!profile || !drafts[section]) return;
    const draft = drafts[section];
    let payload = { ...profile };

    switch (section) {
      case 'personal':
        payload = { ...profile, ...draft };
        break;
      case 'academic':
        payload = {
          ...profile,
          ...draft,
          education: {
            ...profile.education,
            ...draft.education,
          },
        };
        break;
      case 'professional':
        payload = {
          ...profile,
          codingProfiles: {
            ...profile.codingProfiles,
            ...draft.codingProfiles,
          },
          languages: {
            japanese: {
              ...(profile.languages?.japanese || {}),
              ...(draft.languages?.japanese || {}),
            },
            german: {
              ...(profile.languages?.german || {}),
              ...(draft.languages?.german || {}),
            },
          },
          resumeUrl: draft.resumeUrl || profile.resumeUrl || '',
          photoUrl: draft.photoUrl || profile.photoUrl || '',
        };
        break;
      case 'contact':
        payload = {
          ...profile,
          ...draft,
          address: {
            ...profile.address,
            ...(draft.address || {}),
          },
        };
        break;
      default:
        break;
    }

    const success = await persistProfile(payload, 'Profile updated successfully');
    if (success) {
      cancelEdit(section);
    }
  };

  const handleFileUpload = async (type, file) => {
    if (!file) return;
    try {
      setUploading((prev) => ({ ...prev, [type]: true }));
      const formData = new FormData();
      formData.append(type === 'resume' ? 'resume' : 'photo', file);

      const endpoint = type === 'resume' ? 'upload-resume' : 'upload-photo';
      const { data } = await axios.post(`http://localhost:3002/api/users/${endpoint}`, formData, {
        headers: {
          ...headers,
          'Content-Type': 'multipart/form-data',
        },
      });

      const field = type === 'resume' ? 'resumeUrl' : 'photoUrl';
      const url = data[field];
      const successMessage = type === 'resume' ? 'Resume uploaded' : 'Photo uploaded';

      const cacheBustedUrl = url ? `${url}${url.includes('?') ? '&' : '?'}_=${Date.now()}` : url;

      setProfile((prev) => (prev ? normalizeProfile({ ...prev, [field]: cacheBustedUrl }) : prev));
      setDrafts((prev) => {
        const professionalDraft = prev.professional;
        if (!professionalDraft) {
          return prev;
        }
        return {
          ...prev,
          professional: {
            ...professionalDraft,
            [field]: cacheBustedUrl,
          },
        };
      });

      toast.success(successMessage);
    } catch (error) {
      toast.error('Upload failed', {
        description: error.response?.data?.message || 'Please try again.',
      });
    } finally {
      setUploading((prev) => ({ ...prev, [type]: false }));
      if (type === 'photo') {
        const photoInput = document.getElementById('photoUpload');
        if (photoInput) photoInput.value = '';
      }
      if (type === 'resume') {
        const resumeInput = document.getElementById('resumeUpload');
        if (resumeInput) resumeInput.value = '';
      }
    }
  };

  const renderViewValue = (label, value) => {
    const isPrimitive = typeof value === 'string' || typeof value === 'number';
    const fallback = <p className="text-sm font-medium text-foreground">N/A</p>;

    return (
      <div className="space-y-1">
        <p className="text-xs font-medium text-muted-foreground uppercase">{label}</p>
        {isPrimitive ? (
          <p className="text-sm font-medium text-foreground">{value || 'N/A'}</p>
        ) : value ?? fallback}
      </div>
    );
  };

  if (loading && !profile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-10 text-center text-muted-foreground">Loading profile…</CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="py-10 text-center text-destructive">Unable to load profile.</CardContent>
        </Card>
      </div>
    );
  }

  const personalDraft = drafts.personal;
  const academicDraft = drafts.academic;
  const professionalDraft = drafts.professional;
  const contactDraft = drafts.contact;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">Manage your personal, academic, and professional information.</p>
      </div>

      <Tabs defaultValue="personal" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="academic">Academic</TabsTrigger>
          <TabsTrigger value="professional">Professional</TabsTrigger>
          <TabsTrigger value="contact">Contact & Other</TabsTrigger>
        </TabsList>

        <TabsContent value="personal">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">Personal Details</CardTitle>
                <CardDescription>Update your basic personal information.</CardDescription>
              </div>
              {activeEdit === 'personal' ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => cancelEdit('personal')}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => saveSection('personal')}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => startEdit('personal')}>
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {activeEdit === 'personal' && personalDraft ? (
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={personalDraft.firstName}
                      onChange={(event) => updateDraft('personal', 'firstName', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="middleName">Middle Name</Label>
                    <Input
                      id="middleName"
                      value={personalDraft.middleName}
                      onChange={(event) => updateDraft('personal', 'middleName', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={personalDraft.lastName}
                      onChange={(event) => updateDraft('personal', 'lastName', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={personalDraft.dob}
                      onChange={(event) => updateDraft('personal', 'dob', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={personalDraft.gender}
                      onValueChange={(value) => updateDraft('personal', 'gender', value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      value={personalDraft.nationality}
                      onChange={(event) => updateDraft('personal', 'nationality', event.target.value)}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid gap-6 md:grid-cols-2">
                  {renderViewValue('Full name', profile.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim() || 'N/A')}
                  {renderViewValue('Date of birth', profile.dob ? new Date(profile.dob).toLocaleDateString() : 'N/A')}
                  {renderViewValue('Gender', profile.gender || 'N/A')}
                  {renderViewValue('Nationality', profile.nationality || 'N/A')}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="academic">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">Academic Details</CardTitle>
                <CardDescription>Academic profile and educational history.</CardDescription>
              </div>
              {activeEdit === 'academic' ? (
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => cancelEdit('academic')}>
                        Cancel
                        </Button>
                        <Button size="sm" onClick={() => saveSection('academic')}>
                        Save
                        </Button>
                    </div>
                    ) : (
                    <Button size="sm" onClick={() => startEdit('academic')}>
                        Edit
                    </Button>
                )}
          </CardHeader>
          <CardContent className="space-y-6">
            {activeEdit === 'academic' && academicDraft ? (
              <div className="space-y-6">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="universityRegNumber">University Reg Number</Label>
                    <Input
                      id="universityRegNumber"
                      value={academicDraft.universityRegNumber}
                      onChange={(event) => updateDraft('academic', 'universityRegNumber', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rollNo">Roll Number</Label>
                    <Input
                      id="rollNo"
                      value={academicDraft.rollNo}
                      onChange={(event) => updateDraft('academic', 'rollNo', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dept">Department</Label>
                    <Select
                      value={academicDraft.dept}
                      onValueChange={(value) => updateDraft('academic', 'dept', value)}
                    >
                      <SelectTrigger id="dept">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departmentOptions.map((dept) => (
                          <SelectItem key={dept} value={dept}>
                            {dept}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quota">Quota</Label>
                    <Select
                      value={academicDraft.quota}
                      onValueChange={(value) => updateDraft('academic', 'quota', value)}
                    >
                      <SelectTrigger id="quota">
                        <SelectValue placeholder="Select quota" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Management Quota(MQ)">Management Quota (MQ)</SelectItem>
                        <SelectItem value="Government Quota(GQ)">Government Quota (GQ)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="passoutYear">Passout Year</Label>
                    <Input
                      id="passoutYear"
                      type="number"
                      value={academicDraft.passoutYear}
                      onChange={(event) => updateDraft('academic', 'passoutYear', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ugCgpa">UG CGPA</Label>
                    <Input
                      id="ugCgpa"
                      type="number"
                      step="0.01"
                      value={academicDraft.ugCgpa}
                      onChange={(event) => updateDraft('academic', 'ugCgpa', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="historyOfArrears">History of Arrears</Label>
                    <Input
                      id="historyOfArrears"
                      type="number"
                      value={academicDraft.historyOfArrears}
                      onChange={(event) => updateDraft('academic', 'historyOfArrears', event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currentArrears">Current Arrears</Label>
                    <Input
                      id="currentArrears"
                      type="number"
                      value={academicDraft.currentArrears}
                      onChange={(event) => updateDraft('academic', 'currentArrears', event.target.value)}
                    />
                  </div>
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="space-y-3">
                    <p className="text-sm font-semibold">10th Grade</p>
                    <Input
                      placeholder="Percentage"
                      value={academicDraft.education.tenth.percentage}
                      onChange={(event) => updateDraft('academic', 'education.tenth.percentage', event.target.value)}
                    />
                    <Select
                      value={academicDraft.education.tenth.board}
                      onValueChange={(value) => updateDraft('academic', 'education.tenth.board', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Board" />
                      </SelectTrigger>
                      <SelectContent>
                        {['State', 'CBSE', 'ICSC', 'NEB', 'others'].map((board) => (
                          <SelectItem key={board} value={board}>
                            {board}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Passing Year"
                      value={academicDraft.education.tenth.passingYear}
                      onChange={(event) => updateDraft('academic', 'education.tenth.passingYear', event.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold">12th Grade</p>
                    <Input
                      placeholder="Percentage"
                      value={academicDraft.education.twelth.percentage}
                      onChange={(event) => updateDraft('academic', 'education.twelth.percentage', event.target.value)}
                    />
                    <Select
                      value={academicDraft.education.twelth.board}
                      onValueChange={(value) => updateDraft('academic', 'education.twelth.board', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Board" />
                      </SelectTrigger>
                      <SelectContent>
                        {['State', 'CBSE', 'ICSC', 'NEB', 'others'].map((board) => (
                          <SelectItem key={board} value={board}>
                            {board}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Passing Year"
                      value={academicDraft.education.twelth.passingYear}
                      onChange={(event) => updateDraft('academic', 'education.twelth.passingYear', event.target.value)}
                    />
                  </div>

                  <div className="space-y-3">
                    <p className="text-sm font-semibold">Diploma</p>
                    <Input
                      placeholder="Percentage"
                      value={academicDraft.education.diploma.percentage}
                      onChange={(event) => updateDraft('academic', 'education.diploma.percentage', event.target.value)}
                    />
                    <Input
                      placeholder="Passing Year"
                      value={academicDraft.education.diploma.passingYear}
                      onChange={(event) => updateDraft('academic', 'education.diploma.passingYear', event.target.value)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {renderViewValue('University Reg No', profile.universityRegNumber || 'N/A')}
                {renderViewValue('Roll number', profile.rollNo || 'N/A')}
                {renderViewValue('Department', profile.dept || 'N/A')}
                {renderViewValue('Quota', profile.quota || 'N/A')}
                {renderViewValue('Passout year', profile.passoutYear || 'N/A')}
                {renderViewValue('UG CGPA', profile.ugCgpa || 'N/A')}
                {renderViewValue('History of arrears', profile.historyOfArrears ?? 'N/A')}
                {renderViewValue('Current arrears', profile.currentArrears ?? 'N/A')}
                {renderViewValue(
                  '10th grade',
                  profile.education?.tenth?.percentage
                    ? `${profile.education.tenth.percentage}% (${profile.education.tenth.board || 'Board N/A'})`
                    : 'N/A',
                )}
                {renderViewValue(
                  '12th grade',
                  profile.education?.twelth?.percentage
                    ? `${profile.education.twelth.percentage}% (${profile.education.twelth.board || 'Board N/A'})`
                    : 'N/A',
                )}
                {renderViewValue(
                  'Diploma',
                  profile.education?.diploma?.percentage
                    ? `${profile.education.diploma.percentage}% (${profile.education.diploma.passingYear || 'Year N/A'})`
                    : 'N/A',
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="professional">
          <Card className="border-none shadow-sm">
            <CardHeader className="flex flex-row items-start justify-between">
              <div>
                <CardTitle className="text-lg">Professional Details</CardTitle>
                <CardDescription>Showcase coding profiles, language skills, and documents.</CardDescription>
              </div>
              {activeEdit === 'professional' ? (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => cancelEdit('professional')}>
                    Cancel
                  </Button>
                  <Button size="sm" onClick={() => saveSection('professional')}>
                    Save
                  </Button>
                </div>
              ) : (
                <Button size="sm" onClick={() => startEdit('professional')}>
                  Edit
                </Button>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {activeEdit === 'professional' && professionalDraft ? (
                <div className="space-y-6">
                  {/* Coding profile URLs */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {['github', 'leetcode', 'codeforces', 'hackerrank', 'geeksforgeeks'].map((profileKey) => (
                      <div key={profileKey} className="space-y-2">
                        <Label className="capitalize" htmlFor={profileKey}>
                          {profileKey}
                        </Label>
                        <Input
                          id={profileKey}
                          value={professionalDraft.codingProfiles[profileKey] ?? ''}
                          onChange={(event) =>
                            updateDraft('professional', `codingProfiles.${profileKey}`, event.target.value)
                          }
                          placeholder="Profile URL"
                        />
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Language proficiency cards */}
                  <div className="grid gap-4 md:grid-cols-2">
                    {(['japanese', 'german']).map((language) => (
                      <div key={language} className="space-y-3 rounded-lg border p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-sm font-semibold uppercase">{language}</p>
                            <p className="text-xs text-muted-foreground">Toggle to mark proficiency.</p>
                          </div>
                          <Switch
                            checked={Boolean(professionalDraft.languages[language]?.knows)}
                            onCheckedChange={(checked) =>
                              updateDraft('professional', `languages.${language}.knows`, checked)
                            }
                          />
                        </div>
                        <Select
                          value={professionalDraft.languages[language]?.level ?? 'Not Applicable'}
                          onValueChange={(value) => updateDraft('professional', `languages.${language}.level`, value)}
                          disabled={!professionalDraft.languages[language]?.knows}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select level" />
                          </SelectTrigger>
                          <SelectContent>
                            {languageLevels[language].map((level) => (
                              <SelectItem key={level} value={level}>
                                {level}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  {/* Resume & Photo upload */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="resumeUpload">Upload Resume (PDF)</Label>
                      <Input
                        id="resumeUpload"
                        type="file"
                        accept="application/pdf"
                        disabled={uploading.resume}
                        onChange={(event) => handleFileUpload('resume', event.target.files?.[0] || null)}
                      />
                      {uploading.resume && <p className="text-xs text-muted-foreground">Uploading resume…</p>}
                      {profile.resumeUrl && (
                        <Button variant="link" size="sm" asChild className="px-0">
                          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                            View current resume
                          </a>
                        </Button>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="photoUpload">Upload Photo</Label>
                      <Input
                        id="photoUpload"
                        type="file"
                        accept="image/*"
                        disabled={uploading.photo}
                        onChange={(event) => handleFileUpload('photo', event.target.files?.[0] || null)}
                      />
                      {uploading.photo && <p className="text-xs text-muted-foreground">Uploading photo…</p>}
                      {profile.photoUrl && (
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 overflow-hidden rounded-md border">
                            <img src={profile.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                          </div>
                          <Button variant="link" size="sm" asChild className="px-0">
                            <a href={profile.photoUrl} target="_blank" rel="noopener noreferrer">
                              Open photo
                            </a>
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="grid gap-4 md:grid-cols-2">
                    {renderViewValue('GitHub', profile.codingProfiles?.github || 'N/A')}
                    {renderViewValue('LeetCode', profile.codingProfiles?.leetcode || 'N/A')}
                    {renderViewValue('Codeforces', profile.codingProfiles?.codeforces || 'N/A')}
                    {renderViewValue('HackerRank', profile.codingProfiles?.hackerrank || 'N/A')}
                    {renderViewValue('GeeksforGeeks', profile.codingProfiles?.geeksforgeeks || 'N/A')}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    {(['japanese', 'german']).map((language) => (
                      <div key={language} className="space-y-1">
                        <p className="text-xs font-medium uppercase text-muted-foreground">{language}</p>
                        <div className="flex items-center gap-2 text-sm font-medium">
                          <Badge variant={profile.languages?.[language]?.knows ? 'default' : 'secondary'}>
                            {profile.languages?.[language]?.knows ? 'Proficient' : 'Not applicable'}
                          </Badge>
                          {profile.languages?.[language]?.knows && (
                            <span className="text-muted-foreground">Level: {profile.languages[language].level}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="grid gap-4 md:grid-cols-2">
                    {renderViewValue(
                      'Resume',
                      profile.resumeUrl ? (
                        <Button variant="link" size="sm" asChild className="px-0">
                          <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                            View resume
                          </a>
                        </Button>
                      ) : (
                        'N/A'
                      ),
                    )}
                    {renderViewValue(
                      'Photo',
                      profile.photoUrl ? (
                        <div className="flex items-center gap-3">
                          <div className="h-16 w-16 overflow-hidden rounded-md border">
                            <img src={profile.photoUrl} alt="Profile" className="h-full w-full object-cover" />
                          </div>
                        </div>
                      ) : (
                        'N/A'
                      ),
                    )}
                  </div>

                  {profile.isPlaced && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {renderViewValue('Placed in', profile.company || 'N/A')}
                      {renderViewValue('Package', profile.package ? `${profile.package} LPA` : 'N/A')}
                      {renderViewValue(
                        'Placement date',
                        profile.placementDate ? new Date(profile.placementDate).toLocaleDateString() : 'N/A',
                      )}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

      <TabsContent value="contact">
        <Card className="border-none shadow-sm">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle className="text-lg">Contact & Other Details</CardTitle>
              <CardDescription>Keep your contact information up to date.</CardDescription>
            </div>
            {activeEdit === 'contact' ? (
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => cancelEdit('contact')}>
                  Cancel
                </Button>
                <Button size="sm" onClick={() => saveSection('contact')}>
                  Save
                </Button>
              </div>
            ) : (
              <Button size="sm" onClick={() => startEdit('contact')}>
                Edit
              </Button>
            )}
          </CardHeader>
          <CardContent className="space-y-6">
            {activeEdit === 'contact' && contactDraft ? (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="mobileNumber">Mobile Number</Label>
                  <Input
                    id="mobileNumber"
                    value={contactDraft.mobileNumber ?? ''}
                    onChange={(event) => updateDraft('contact', 'mobileNumber', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="personalEmail">Personal Email</Label>
                  <Input
                    id="personalEmail"
                    type="email"
                    value={contactDraft.personalEmail ?? ''}
                    onChange={(event) => updateDraft('contact', 'personalEmail', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="residence">Residence</Label>
                  <Select
                    value={contactDraft.residence ?? ''}
                    onValueChange={(value) => updateDraft('contact', 'residence', value)}
                  >
                    <SelectTrigger id="residence">
                      <SelectValue placeholder="Select residence" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Hostel">Hostel</SelectItem>
                      <SelectItem value="Day Scholar">Day Scholar</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number</Label>
                  <Input
                    id="panNumber"
                    value={contactDraft.panNumber ?? ''}
                    onChange={(event) => updateDraft('contact', 'panNumber', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Number</Label>
                  <Input
                    id="aadharNumber"
                    value={contactDraft.aadharNumber ?? ''}
                    onChange={(event) => updateDraft('contact', 'aadharNumber', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_city">City</Label>
                  <Input
                    id="address_city"
                    value={contactDraft.address?.city ?? ''}
                    onChange={(event) => updateDraft('contact', 'address.city', event.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address_state">State</Label>
                  <Input
                    id="address_state"
                    value={contactDraft.address?.state ?? ''}
                    onChange={(event) => updateDraft('contact', 'address.state', event.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {renderViewValue('Mobile number', profile.mobileNumber || 'N/A')}
                {renderViewValue('Personal email', profile.personalEmail || 'N/A')}
                {renderViewValue('Residence', profile.residence || 'N/A')}
                {renderViewValue('Location', `${profile.address?.city || 'N/A'}, ${profile.address?.state || 'N/A'}`)}
                {renderViewValue('PAN number', profile.panNumber || 'N/A')}
                {renderViewValue('Aadhar number', profile.aadharNumber || 'N/A')}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  </div>
);
}

export default StudentProfile;
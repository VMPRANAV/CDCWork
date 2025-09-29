import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  Home, 
  GraduationCap, 
  Briefcase, 
  BookOpen, 
  FileText, 
  Calendar,
  Hash,
  Award,
  FileCheck,
  FileX,
  ExternalLink
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const DetailItem = ({ label, value, icon: Icon, className = '' }) => (
  <div className={cn("flex items-start py-2", className)}>
    <div className="flex-shrink-0 w-5 h-5 mr-3 mt-0.5 text-muted-foreground">
      {Icon && <Icon className="h-4 w-4" />}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-medium text-muted-foreground">{label}</p>
      <p className="text-sm font-medium text-foreground break-words">
        {value || <span className="text-muted-foreground">Not provided</span>}
      </p>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children, className = '' }) => (
  <div className={cn("space-y-4", className)}>
    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground border-b pb-2 mb-2">
      {Icon && <Icon className="h-4 w-4" />}
      <h4>{title}</h4>
    </div>
    <div className="space-y-2">
      {children}
    </div>
  </div>
);

export function StudentDetails({ student, loading, onClose }) {
  if (!student) return null;

  return (
    <Dialog open={!!student} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {loading ? (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-8 w-8 rounded-full" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        ) : student.error ? (
          <div className="p-6">
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              {student.error}
            </div>
          </div>
        ) : (
          <>
            <DialogHeader className="px-6 pt-6 pb-4 border-b">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xl font-semibold">
                      {student.fullName?.charAt(0) || '?'}
                    </div>
                    <div>
                      <DialogTitle className="text-xl font-semibold">
                        {student.fullName || 'Student Details'}
                      </DialogTitle>
                      <p className="text-sm text-muted-foreground">
                        {student.rollNo || 'N/A'} • {student.dept || 'N/A'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2">
                <Badge 
                  variant={student.isPlaced ? 'default' : 'secondary'}
                  className={cn(
                    'text-sm font-medium',
                    student.isPlaced ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                  )}
                >
                  {student.isPlaced ? (
                    <>
                      <span className="h-2 w-2 rounded-full bg-green-600 mr-2"></span>
                      Placed at {student.company || 'a company'}
                    </>
                  ) : 'Not Placed'}
                </Badge>
                
                {student.ugCgpa && (
                  <Badge variant="outline" className="text-sm font-mono">
                    CGPA: {student.ugCgpa}
                  </Badge>
                )}
              </div>
            </DialogHeader>

            <Tabs defaultValue="overview" className="px-6 pb-6">
              <TabsList className="mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="academics">Academics</TabsTrigger>
                <TabsTrigger value="placement" disabled={!student.isPlaced}>
                  Placement
                </TabsTrigger>
                <TabsTrigger value="documents">Documents</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <Section title="Contact Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem 
                      label="Email" 
                      value={student.collegeEmail}
                      icon={Mail}
                    />
                    <DetailItem 
                      label="Phone" 
                      value={student.phone}
                      icon={Phone}
                    />
                    <DetailItem 
                      label="Address" 
                      value={student.residence}
                      icon={Home}
                    />
                    <DetailItem 
                      label="University Reg. No." 
                      value={student.universityRegNumber}
                      icon={Hash}
                    />
                  </div>
                </Section>

                <Section title="Personal Details">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem 
                      label="Date of Birth" 
                      value={student.dob ? format(new Date(student.dob), 'MMM d, yyyy') : null}
                      icon={Calendar}
                    />
                    <DetailItem 
                      label="Gender" 
                      value={student.gender}
                      icon={User}
                    />
                    <DetailItem 
                      label="Category" 
                      value={student.category}
                      icon={User}
                    />
                    <DetailItem 
                      label="Nationality" 
                      value={student.nationality || 'Indian'}
                      icon={User}
                    />
                  </div>
                </Section>
              </TabsContent>

              <TabsContent value="academics" className="space-y-6">
                <Section title="Academic Information">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem 
                      label="Department" 
                      value={student.dept}
                      icon={GraduationCap}
                    />
                    <DetailItem 
                      label="Passout Year" 
                      value={student.passoutYear}
                      icon={Calendar}
                    />
                    <DetailItem 
                      label="UG CGPA" 
                      value={student.ugCgpa}
                      icon={Award}
                    />
                    <DetailItem 
                      label="Current Arrears" 
                      value={student.currentArrears || '0'}
                      icon={FileX}
                    />
                    <DetailItem 
                      label="History of Arrears" 
                      value={student.historyOfArrears || '0'}
                      icon={FileText}
                    />
                    <DetailItem 
                      label="10th Percentage" 
                      value={student.tenthPercentage}
                      icon={BookOpen}
                    />
                    <DetailItem 
                      label="12th Percentage" 
                      value={student.twelfthPercentage}
                      icon={BookOpen}
                    />
                  </div>
                </Section>

                <Section title="Skills">
                  <div className="flex flex-wrap gap-2">
                    {student.skills?.length > 0 ? (
                      student.skills.map((skill, i) => (
                        <Badge key={i} variant="secondary" className="text-sm">
                          {skill}
                        </Badge>
                      ))
                    ) : (
                      <p className="text-sm text-muted-foreground">No skills added</p>
                    )}
                  </div>
                </Section>
              </TabsContent>

              {student.isPlaced && (
                <TabsContent value="placement" className="space-y-6">
                  <Section title="Placement Details">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailItem 
                        label="Company" 
                        value={student.company}
                        icon={Briefcase}
                      />
                      <DetailItem 
                        label="Package (LPA)" 
                        value={student.package}
                        icon={Award}
                      />
                      <DetailItem 
                        label="Job Role" 
                        value={student.jobRole}
                        icon={User}
                      />
                      <DetailItem 
                        label="Offer Letter" 
                        value={
                          <a 
                            href={student.offerLetterUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            View Offer Letter <ExternalLink className="h-3 w-3" />
                          </a>
                        }
                        icon={FileCheck}
                      />
                    </div>
                  </Section>
                </TabsContent>
              )}

              <TabsContent value="documents" className="space-y-6">
                <Section title="Documents">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <DetailItem 
                      label="Resume" 
                      value={
                        <a 
                          href={student.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1"
                        >
                          View Resume <ExternalLink className="h-3 w-3" />
                        </a>
                      }
                      icon={FileText}
                    />
                    <DetailItem 
                      label="Transcript" 
                      value={
                        student.transcriptUrl ? (
                          <a 
                            href={student.transcriptUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-primary hover:underline inline-flex items-center gap-1"
                          >
                            View Transcript <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : 'Not available'
                      }
                      icon={FileText}
                    />
                  </div>
                </Section>
              </TabsContent>
            </Tabs>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

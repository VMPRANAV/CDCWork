import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Users, Eye, Mail, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * StudentsTable - Displays a table of students with sorting and filtering handled by the parent
 */
export function StudentsTable({ 
  students = [], 
  onViewDetails, 
  loading, 
  className = '' 
}) {

  if (students.length === 0) {
    return (
      <div className="text-center py-12 border rounded-lg bg-muted/20">
        <Users className="mx-auto h-12 w-12 text-muted-foreground" />
        <h3 className="mt-2 text-sm font-medium text-foreground">No students found</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          {loading ? 'Loading students...' : 'Get started by adding a new student.'}
        </p>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="space-y-4 md:hidden">
        {students.map((student) => (
          <div
            key={student._id}
            className="rounded-lg border bg-card p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-lg font-semibold text-primary"
                  aria-hidden="true"
                >
                  {student.fullName?.charAt(0) || '?'}
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">
                    {student.fullName || 'N/A'}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {student.rollNo || 'N/A'}
                  </div>
                </div>
              </div>
              <Badge
                variant={student.isPlaced ? 'default' : 'secondary'}
                className={cn(
                  'mt-1 shrink-0',
                  student.isPlaced ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                )}
              >
                {student.isPlaced ? 'Placed' : 'Not Placed'}
              </Badge>
            </div>

            <div className="mt-4 space-y-2 text-sm">
              <a
                href={`mailto:${student.collegeEmail}`}
                className="flex items-center gap-2 text-primary hover:underline"
                onClick={(e) => e.stopPropagation()}
              >
                <Mail className="h-4 w-4" />
                {student.collegeEmail || 'N/A'}
              </a>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-1 text-xs font-medium uppercase text-muted-foreground">
                  {student.dept || 'N/A'}
                </span>
                <span
                  className={cn(
                    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium',
                    parseFloat(student.ugCgpa || 0) >= 8
                      ? 'bg-emerald-100 text-emerald-700'
                      : parseFloat(student.ugCgpa || 0) < 6
                      ? 'bg-red-100 text-red-700'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  CGPA: {student.ugCgpa || 'N/A'}
                </span>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => onViewDetails(student)}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation();
                  // TODO: Implement resume view
                }}
              >
                <FileText className="mr-2 h-4 w-4" />
                View Resume
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-hidden rounded-md border md:block">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">CGPA</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {students.map((student) => (
                <TableRow key={student._id} className="group hover:bg-muted/30">
                  <TableCell className="font-medium">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold"
                        aria-hidden="true"
                      >
                        {student.fullName?.charAt(0) || '?'}
                      </div>
                      <div>
                        <div className="font-medium">{student.fullName || 'N/A'}</div>
                        <div className="text-xs text-muted-foreground">{student.rollNo || 'N/A'}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <a 
                        href={`mailto:${student.collegeEmail}`} 
                        className="text-primary hover:underline flex items-center"
                        onClick={(e) => e.stopPropagation()}
                        aria-label={`Email ${student.fullName || 'student'}`}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        {student.collegeEmail || 'N/A'}
                      </a>
                    </div>
                  </TableCell>
                  <TableCell className="uppercase font-mono text-sm">
                    {student.dept || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <div className={cn(
                      "font-mono font-semibold text-right",
                      parseFloat(student.ugCgpa || 0) >= 8 ? 'text-green-600' : '',
                      parseFloat(student.ugCgpa || 0) < 6 ? 'text-red-600' : ''
                    )}>
                      {student.ugCgpa || 'N/A'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={student.isPlaced ? 'default' : 'secondary'}
                      className={cn(
                        'whitespace-nowrap',
                        student.isPlaced ? 'bg-green-100 text-green-800 hover:bg-green-100' : ''
                      )}
                    >
                      {student.isPlaced ? (
                        <>
                          <span className="h-2 w-2 rounded-full bg-green-600 mr-2" aria-hidden="true"></span>
                          Placed
                        </>
                      ) : (
                        'Not Placed'
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end space-x-2">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-muted-foreground hover:text-primary"
                        title="View Details"
                        onClick={() => onViewDetails(student)}
                        aria-label={`View details for ${student.fullName || 'student'}`}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 px-2 text-muted-foreground hover:text-primary"
                        title="View Resume"
                        onClick={(e) => {
                          e.stopPropagation();
                          // TODO: Implement resume view
                        }}
                        aria-label={`View resume for ${student.fullName || 'student'}`}
                      >
                        <FileText className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import toast from 'react-hot-toast'; // Replace use-toast import
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function BulkAdvanceDialog({ open, onOpenChange, jobs, jobRounds, onFetchRounds, onBulkAdvance }) {
  const [jobId, setJobId] = useState('');
  const [fromRoundId, setFromRoundId] = useState('');
  const [toRoundId, setToRoundId] = useState('');
  const [emails, setEmails] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    // When the selected job changes, fetch its rounds
    if (jobId) {
      onFetchRounds(jobId);
    }
    // Reset rounds when job is cleared
    setFromRoundId('');
    setToRoundId('');
  }, [jobId]);

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      // Reset state on close
      setJobId('');
      setFromRoundId('');
      setToRoundId('');
      setEmails('');
      setResult(null);
      setIsSubmitting(false);
    }
    onOpenChange(isOpen);
  };
  
  const fromRoundOptions = useMemo(() => {
    return jobRounds.sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  }, [jobRounds]);

  const toRoundOptions = useMemo(() => {
    if (!fromRoundId) return [];
    const fromRound = jobRounds.find(r => r._id === fromRoundId);
    if (!fromRound) return [];
    
    return jobRounds
      .filter(r => (r.sequence ?? 0) > (fromRound.sequence ?? 0))
      .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0));
  }, [jobRounds, fromRoundId]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    try {
      const response = await onBulkAdvance({ jobId, fromRoundId, toRoundId, emails });
      setResult(response);
      toast.success(`${response.successCount} students advanced successfully.`); // Updated toast usage
    } catch (error) {
      toast.error(error.message || 'Failed to submit the bulk advance request.'); // Updated toast usage
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = jobId && fromRoundId && toRoundId && emails.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Advance Applicants</DialogTitle>
          <DialogDescription>
            Move multiple students to the next round for a specific job. Enter student emails separated by commas or new lines.
          </DialogDescription>
        </DialogHeader>
        
        {!result ? (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="job" className="text-sm font-medium">Job</label>
              <Select value={jobId} onValueChange={setJobId}>
                <SelectTrigger id="job">
                  <SelectValue placeholder="Select a job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map(job => (
                    <SelectItem key={job._id} value={job._id}>
                      {job.jobTitle} - {job.companyName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fromRound" className="text-sm font-medium">Current Round</label>
                <Select value={fromRoundId} onValueChange={setFromRoundId} disabled={!jobId}>
                  <SelectTrigger id="fromRound">
                    <SelectValue placeholder="Select current round" />
                  </SelectTrigger>
                  <SelectContent>
                    {fromRoundOptions.map(round => (
                      <SelectItem key={round._id} value={round._id}>
                        Round {round.sequence}: {round.roundName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label htmlFor="toRound" className="text-sm font-medium">Next Round</label>
                <Select value={toRoundId} onValueChange={setToRoundId} disabled={!fromRoundId}>
                  <SelectTrigger id="toRound">
                    <SelectValue placeholder="Select next round" />
                  </SelectTrigger>
                  <SelectContent>
                    {toRoundOptions.map(round => (
                      <SelectItem key={round._id} value={round._id}>
                        Round {round.sequence}: {round.roundName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="emails" className="text-sm font-medium">Student Emails</label>
              <Textarea
                id="emails"
                placeholder="student1@example.com, student2@example.com&#10;student3@example.com"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                className="min-h-[150px]"
              />
            </div>
          </div>
        ) : (
          <div className="py-4 space-y-4">
              <Alert>
                  <AlertTitle className="font-bold">Process Summary</AlertTitle>
                  <AlertDescription>
                      <p>Successfully advanced: <strong>{result.successCount}</strong></p>
                      <p>Failed to advance: <strong>{result.failureCount}</strong></p>
                  </AlertDescription>
              </Alert>

              {result.failures && result.failures.length > 0 && (
                  <div className="space-y-2">
                      <h4 className="font-semibold">Failure Details</h4>
                      <div className="max-h-40 overflow-y-auto border rounded-md p-2 text-sm">
                          <ul>
                              {result.failures.map((fail, index) => (
                                  <li key={index} className="mb-1">
                                      <strong>{fail.email}:</strong> {fail.reason}
                                  </li>
                              ))}
                          </ul>
                      </div>
                  </div>
              )}
          </div>
        )}

        <DialogFooter>
          {result ? (
             <Button onClick={() => handleOpenChange(false)}>Close</Button>
          ) : (
            <Button
              type="submit"
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Advance Students
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

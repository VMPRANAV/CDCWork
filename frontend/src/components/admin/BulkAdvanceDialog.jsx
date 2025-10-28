import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export function BulkAdvanceDialog({ open, onOpenChange, jobs, jobRounds, onFetchRounds, onBulkAdvance }) {
  const [jobId, setJobId] = useState('');
  const [fromRoundId, setFromRoundId] = useState('');
  const [toRoundId, setToRoundId] = useState('');
  const [identifiers, setIdentifiers] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (jobId) {
      onFetchRounds(jobId);
    }
    setFromRoundId('');
    setToRoundId('');
  }, [jobId]);

  const handleOpenChange = (isOpen) => {
    if (!isOpen) {
      setJobId('');
      setFromRoundId('');
      setToRoundId('');
      setIdentifiers('');
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

  // Split identifiers into emails and rollNos
  const parseIdentifiers = (input) => {
    const lines = input
      .split(/[\n,]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const emails = [];
    const rollNos = [];
    for (const val of lines) {
      // Simple email regex
      if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        emails.push(val);
      } else {
        rollNos.push(val);
      }
    }
    // Only send if non-empty, else undefined
    return {
      emails: emails.length > 0 ? emails.join(',') : undefined,
      rollNos: rollNos.length > 0 ? rollNos.join(',') : undefined
    };
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setResult(null);
    try {
      const { emails, rollNos } = parseIdentifiers(identifiers);
      const response = await onBulkAdvance({ jobId, fromRoundId, toRoundId, emails, rollNos });
      setResult(response);
      toast.success(`${response.successCount} students advanced successfully.`);
    } catch (error) {
      toast.error(error.message || 'Failed to submit the bulk advance request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    jobId &&
    fromRoundId &&
    toRoundId &&
    identifiers.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bulk Advance Applicants</DialogTitle>
          <DialogDescription>
            Move multiple students to the next round for a specific job. Enter student emails <b>or</b> roll numbers separated by commas or new lines.
          </DialogDescription>
        </DialogHeader>
        
        {!result ? (
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="job" className="text-sm font-medium">Job</Label>
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
                <Label htmlFor="fromRound" className="text-sm font-medium">Current Round</Label>
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
                <Label htmlFor="toRound" className="text-sm font-medium">Next Round</Label>
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
              <Label htmlFor="identifiers" className="text-sm font-medium">Student Emails or Roll Numbers</Label>
              <Textarea
                id="identifiers"
                placeholder="student1@example.com, 21CS001&#10;student2@example.com"
                value={identifiers}
                onChange={(e) => setIdentifiers(e.target.value)}
                className="min-h-[80px]"
              />
              <div className="text-xs text-muted-foreground">
                Enter one per line or separate by commas. Both emails and roll numbers are supported.
              </div>
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
                        <strong>
                          {fail.identifier || fail.email || fail.rollNo}:
                        </strong> {fail.reason}
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

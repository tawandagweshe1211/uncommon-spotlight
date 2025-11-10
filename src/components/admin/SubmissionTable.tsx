import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Check, X, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";

export interface Submission {
  id: string;
  name: string;
  email: string;
  specialization: string;
  status: "employed" | "internship" | "looking";
  description: string;
  portfolio_link: string | null;
  profile_photo_url: string | null;
  submission_status: string;
  created_at: string;
}

interface SubmissionTableProps {
  submissions: Submission[];
  onApprove: (submission: Submission) => void;
  onReject: (id: string) => void;
}

export const SubmissionTable = ({ submissions, onApprove, onReject }: SubmissionTableProps) => {
  const [viewingSubmission, setViewingSubmission] = useState<Submission | null>(null);

  const getStatusBadge = (status: string) => {
    const variants = {
      employed: "default",
      internship: "secondary",
      looking: "outline",
    } as const;

    return (
      <Badge variant={variants[status as keyof typeof variants] || "outline"}>
        {status}
      </Badge>
    );
  };

  return (
    <>
      <div className="rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Specialization</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  No pending submissions
                </TableCell>
              </TableRow>
            ) : (
              submissions.map((submission) => (
                <TableRow key={submission.id}>
                  <TableCell className="font-medium">{submission.name}</TableCell>
                  <TableCell>{submission.email}</TableCell>
                  <TableCell>{submission.specialization}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>{new Date(submission.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setViewingSubmission(submission)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onApprove(submission)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => onReject(submission.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!viewingSubmission} onOpenChange={() => setViewingSubmission(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{viewingSubmission?.name}</DialogTitle>
            <DialogDescription>{viewingSubmission?.email}</DialogDescription>
          </DialogHeader>
          {viewingSubmission && (
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Specialization</h4>
                <p className="text-sm text-muted-foreground">{viewingSubmission.specialization}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Status</h4>
                {getStatusBadge(viewingSubmission.status)}
              </div>
              <div>
                <h4 className="font-semibold mb-2">About</h4>
                <p className="text-sm text-muted-foreground">{viewingSubmission.description}</p>
              </div>
              {viewingSubmission.portfolio_link && (
                <div>
                  <h4 className="font-semibold mb-2">Portfolio</h4>
                  <a
                    href={viewingSubmission.portfolio_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    {viewingSubmission.portfolio_link}
                  </a>
                </div>
              )}
              {viewingSubmission.profile_photo_url && (
                <div>
                  <h4 className="font-semibold mb-2">Profile Photo</h4>
                  <img
                    src={viewingSubmission.profile_photo_url}
                    alt={viewingSubmission.name}
                    className="h-32 w-32 rounded-full object-cover"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

import { CheckCircle2, Send, UploadCloud } from "lucide-react";
import { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SectionHeader } from "../../components/SectionHeader";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import { Textarea } from "../../components/ui/textarea";
import { createCandidate } from "../../services/api";
import type { UploadRequest } from "../../types";

type FormErrors = Partial<Record<keyof UploadRequest, string>>;

const initialForm: UploadRequest = {
  name: "",
  college: "",
  resumeText: "",
  githubUsername: "",
};

export default function CandidateUploadPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<UploadRequest>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);

  function validate(): FormErrors {
    const nextErrors: FormErrors = {};

    if (!form.name.trim()) {
      nextErrors.name = "Name is required.";
    }

    if (!form.college.trim()) {
      nextErrors.college = "College is required.";
    }

    if (form.resumeText.trim().length < 40) {
      nextErrors.resumeText = "Resume text should include at least 40 characters.";
    }

    if (!form.githubUsername.trim()) {
      nextErrors.githubUsername = "GitHub username is required.";
    }

    return nextErrors;
  }

  function updateField(field: keyof UploadRequest, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setApiError(null);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    setApiError(null);

    try {
      await createCandidate({
        name: form.name.trim(),
        college: form.college.trim(),
        resumeText: form.resumeText.trim(),
        githubUsername: form.githubUsername.trim(),
      });
      setForm(initialForm);
      setToast("Candidate uploaded successfully.");
      window.setTimeout(() => navigate("/"), 700);
    } catch (caughtError) {
      const message =
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to upload candidate.";
      setApiError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        eyebrow="Candidate Intake"
        title="Upload Candidate"
        description="Add a candidate profile for scoring. The backend can parse the payload and return ranked results."
      />

      {toast ? (
        <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {toast}
        </div>
      ) : null}

      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card>
          <CardHeader>
            <CardTitle>Candidate Details</CardTitle>
            <CardDescription>
              Required fields are validated before the profile is sent to the API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Priya Nair"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college">College</Label>
                  <Input
                    id="college"
                    value={form.college}
                    onChange={(event) => updateField("college", event.target.value)}
                    placeholder="VIT Vellore"
                    aria-invalid={Boolean(errors.college)}
                  />
                  {errors.college ? (
                    <p className="text-sm text-red-600">{errors.college}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUsername">GitHub Username</Label>
                <Input
                  id="githubUsername"
                  value={form.githubUsername}
                  onChange={(event) => updateField("githubUsername", event.target.value)}
                  placeholder="priyanair"
                  aria-invalid={Boolean(errors.githubUsername)}
                />
                {errors.githubUsername ? (
                  <p className="text-sm text-red-600">{errors.githubUsername}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumeText">Resume Text</Label>
                <Textarea
                  id="resumeText"
                  value={form.resumeText}
                  onChange={(event) => updateField("resumeText", event.target.value)}
                  placeholder="Paste resume text, project highlights, internships, skills, and achievements."
                  aria-invalid={Boolean(errors.resumeText)}
                />
                {errors.resumeText ? (
                  <p className="text-sm text-red-600">{errors.resumeText}</p>
                ) : null}
              </div>

              {apiError ? (
                <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {apiError}
                </div>
              ) : null}

              <Button type="submit" disabled={isSubmitting} className="w-full sm:w-auto">
                {isSubmitting ? (
                  <>
                    <UploadCloud className="h-4 w-4 animate-pulse" aria-hidden="true" />
                    Uploading
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" aria-hidden="true" />
                    Submit Candidate
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="h-fit shadow-sm">
          <CardHeader>
            <CardTitle>Backend Contract</CardTitle>
            <CardDescription>POST /candidate receives the normalized upload payload.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>Name, college, resume text, and GitHub username are sent as JSON.</p>
            <p>On success, the form resets and the recruiter returns to the leaderboard.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

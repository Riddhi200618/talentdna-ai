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
  collegeTier: "Tier3",
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

    if (!form.collegeTier) {
      nextErrors.collegeTier = "College tier is required.";
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
        collegeTier: form.collegeTier,
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
        <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-400 font-hanken shadow-lg mb-6">
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          {toast}
        </div>
      ) : null}

      <div className="max-w-3xl mx-auto w-full font-hanken">
        <Card className="border border-outline-variant/10">
          <CardHeader>
            <CardTitle>Candidate Details</CardTitle>
            <CardDescription className="dark:text-on-surface-variant/80">
              Required fields are validated before the profile is sent to the API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-on-surface font-semibold">Name</Label>
                  <Input
                    id="name"
                    value={form.name}
                    onChange={(event) => updateField("name", event.target.value)}
                    placeholder="Priya Nair"
                    aria-invalid={Boolean(errors.name)}
                  />
                  {errors.name ? <p className="text-xs font-bold text-rose-400 mt-1 font-hanken">{errors.name}</p> : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="college" className="text-on-surface font-semibold">College</Label>
                  <Input
                    id="college"
                    value={form.college}
                    onChange={(event) => updateField("college", event.target.value)}
                    placeholder="VIT Vellore"
                    aria-invalid={Boolean(errors.college)}
                  />
                  {errors.college ? (
                    <p className="text-xs font-bold text-rose-400 mt-1 font-hanken">{errors.college}</p>
                  ) : null}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="collegeTier" className="text-on-surface font-semibold">College Tier</Label>
                <select
                  id="collegeTier"
                  value={form.collegeTier}
                  onChange={(event) => updateField("collegeTier", event.target.value as UploadRequest["collegeTier"])}
                  className="flex h-10 w-full rounded-lg border border-outline-variant/30 bg-[#0e0e14]/60 px-3 py-2 text-sm text-on-surface shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lp-primary/10 shadow-inner transition-all duration-200"
                  aria-invalid={Boolean(errors.collegeTier)}
                >
                  <option value="Tier1" className="bg-[#131319] text-on-surface">Tier 1</option>
                  <option value="Tier2" className="bg-[#131319] text-on-surface">Tier 2</option>
                  <option value="Tier3" className="bg-[#131319] text-on-surface">Tier 3</option>
                  <option value="SelfTaught" className="bg-[#131319] text-on-surface">Self taught</option>
                </select>
                {errors.collegeTier ? (
                  <p className="text-xs font-bold text-rose-400 mt-1 font-hanken">{errors.collegeTier}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="githubUsername" className="text-on-surface font-semibold">GitHub Username</Label>
                <Input
                  id="githubUsername"
                  value={form.githubUsername}
                  onChange={(event) => updateField("githubUsername", event.target.value)}
                  placeholder="priyanair"
                  aria-invalid={Boolean(errors.githubUsername)}
                />
                {errors.githubUsername ? (
                  <p className="text-xs font-bold text-rose-400 mt-1 font-hanken">{errors.githubUsername}</p>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label htmlFor="resumeText" className="text-on-surface font-semibold">Resume Text</Label>
                <Textarea
                  id="resumeText"
                  value={form.resumeText}
                  onChange={(event) => updateField("resumeText", event.target.value)}
                  placeholder="Paste resume text, project highlights, internships, skills, and achievements."
                  aria-invalid={Boolean(errors.resumeText)}
                />
                {errors.resumeText ? (
                  <p className="text-xs font-bold text-rose-400 mt-1 font-hanken">{errors.resumeText}</p>
                ) : null}
              </div>

              {apiError ? (
                <div className="rounded-xl border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400 font-hanken">
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
      </div>
    </div>
  );
}

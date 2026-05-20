"use client"

import { useState } from "react"
import { BrandHeader } from "@/components/sic-agent/brand-header"
import { ProgressSteps, type StepKey } from "@/components/sic-agent/progress-steps"
import { LookupStep } from "@/components/sic-agent/lookup-step"
import { PrimaryStep } from "@/components/sic-agent/primary-step"
import { DescribeStep } from "@/components/sic-agent/describe-step"
import { ActivitiesStep } from "@/components/sic-agent/activities-step"
import { ConfirmStep } from "@/components/sic-agent/confirm-step"
import { CompanyBanner } from "@/components/sic-agent/company-banner"
import type {
  CompanyProfile,
  SicDescription,
  SelectedActivity,
} from "@/lib/types"
import type { SicCode } from "@/lib/sic-codes"

export default function Page() {
  const [step, setStep] = useState<StepKey>("lookup")
  const [profile, setProfile] = useState<CompanyProfile | null>(null)
  const [primary, setPrimary] = useState<SicCode | null>(null)
  const [description, setDescription] = useState<SicDescription | null>(null)
  const [activities, setActivities] = useState<SelectedActivity[]>([])

  const skipPrimary = !profile || profile.sic_codes.length <= 1

  const handleResolved = (p: CompanyProfile) => {
    setProfile(p)
    if (p.sic_codes.length === 0) {
      // Edge-case: company has no SIC codes registered.
      const placeholder: SicCode = {
        code: "00000",
        title: "Activity not classified",
        section: "Other",
      }
      setPrimary(placeholder)
      setStep("describe")
    } else if (p.sic_codes.length === 1) {
      setPrimary(p.sic_codes[0])
      setStep("describe")
    } else {
      setStep("primary")
    }
  }

  const handlePrimary = (sic: SicCode) => {
    setPrimary(sic)
    setStep("describe")
  }

  const handleDescription = (d: SicDescription) => {
    setDescription(d)
    setActivities([])
    setStep("activities")
  }

  const handleActivities = (selected: SelectedActivity[]) => {
    setActivities(selected)
    setStep("confirm")
  }

  const restart = () => {
    setProfile(null)
    setPrimary(null)
    setDescription(null)
    setActivities([])
    setStep("lookup")
  }

  return (
    <div className="min-h-dvh bg-background">
      <BrandHeader />

      <main className="mx-auto w-full max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <div className="mb-6">
          <ProgressSteps current={step} skipPrimary={skipPrimary} />
        </div>

        <div className="space-y-5">
          {profile && step !== "lookup" && <CompanyBanner profile={profile} />}

          {step === "lookup" && <LookupStep onResolved={handleResolved} />}

          {step === "primary" && profile && (
            <PrimaryStep
              profile={profile}
              onSelect={handlePrimary}
              onBack={restart}
            />
          )}

          {step === "describe" && profile && primary && (
            <DescribeStep
              sic={primary}
              secondarySics={profile.sic_codes.filter(
                (s) => s.code !== primary.code,
              )}
              companyName={profile.company_name}
              onBack={() => setStep(skipPrimary ? "lookup" : "primary")}
              onConfirm={handleDescription}
            />
          )}

          {step === "activities" && description && (
            <ActivitiesStep
              description={description}
              onBack={() => setStep("describe")}
              onContinue={handleActivities}
            />
          )}

          {step === "confirm" && profile && primary && description && (
            <ConfirmStep
              profile={profile}
              primary={primary}
              description={description}
              activities={activities}
              onRestart={restart}
            />
          )}
        </div>

        <footer className="mt-10 flex flex-col items-start gap-1 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            Data sourced from{" "}
            <a
              href="https://find-and-update.company-information.service.gov.uk/"
              target="_blank"
              rel="noreferrer"
              className="text-primary underline-offset-2 hover:underline"
            >
              UK Companies House
            </a>
            .
          </p>
          <p>For demonstration only — not a real onboarding flow.</p>
        </footer>
      </main>
    </div>
  )
}

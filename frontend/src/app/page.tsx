import { APP_NAME } from "@/constants";
import { CreateSubmissionButton } from "@/components/submissions/CreateSubmissionButton";
import { SubmissionList } from "@/components/submissions/SubmissionList";
import { PAGE_CONTAINER, CONTENT_INSET } from "@/lib/layout";
import { ClipboardList } from "lucide-react";

export default function HomePage() {
  return (
    <div className="page-shell">
      <header className="hero-gradient pb-10 pt-8 sm:pb-12 sm:pt-10">
        <div className={PAGE_CONTAINER}>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0 flex-1">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-teal-50 ring-1 ring-white/25">
                <ClipboardList size={14} />
                Wellness Intake Portal
              </div>
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                {APP_NAME}
              </h1>
              <p className="mt-2 max-w-md text-sm leading-relaxed text-teal-50/90">
                Create, save, and track multi-step wellness forms with draft
                support and step-by-step progress.
              </p>
            </div>
            <CreateSubmissionButton />
          </div>
        </div>
      </header>

      <main className={`${PAGE_CONTAINER} -mt-6 flex-1 pb-10 sm:-mt-8`}>
        <section className="card-surface overflow-hidden rounded-2xl">
          <div className={`border-b border-teal-100/70 py-4 ${CONTENT_INSET}`}>
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary-dark">
              Your Submissions
            </h2>
          </div>
          <div className={`py-4 ${CONTENT_INSET}`}>
            <SubmissionList />
          </div>
        </section>
      </main>
    </div>
  );
}

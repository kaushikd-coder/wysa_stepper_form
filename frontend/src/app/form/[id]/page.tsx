import { StepperForm } from "@/components/form/StepperForm";
import { PAGE_CONTAINER } from "@/lib/layout";

interface FormPageProps {
  params: Promise<{ id: string }>;
}

export default async function FormPage({ params }: FormPageProps) {
  const { id } = await params;

  return (
    <main className={`${PAGE_CONTAINER} flex-1 py-6 sm:py-10`}>
      <StepperForm submissionId={id} />
    </main>
  );
}

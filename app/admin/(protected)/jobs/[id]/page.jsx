import JobEditor from "../../../../../components/admin/JobEditor";

export default async function EditJobPage({ params }) {
  const { id } = await params;
  return <JobEditor jobId={id} />;
}

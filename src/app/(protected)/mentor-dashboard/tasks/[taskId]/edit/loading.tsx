import { Spinner } from "@/components/spinner";

export default function EditTaskLoading() {
  return (
    <div className="h-[calc(92vh-var(--header-height))]">
      <Spinner size="page" />
    </div>
  );
}

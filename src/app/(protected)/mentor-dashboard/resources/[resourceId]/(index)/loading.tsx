import { Spinner } from "@/components/spinner";

export default function ResourceLoading() {
  return (
    <div className="flex h-full items-center justify-center">
      <Spinner size="page" />
    </div>
  );
}
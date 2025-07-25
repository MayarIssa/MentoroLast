import type { ColumnDef } from "@tanstack/react-table";

import { Skeleton } from "./ui/skeleton";

const LoadingComponent = () => (
  <div>
    <Skeleton className="h-3 w-[70%]" />
  </div>
);

export const getLoadingColumns = (headers: string[]): ColumnDef<number>[] =>
  headers.map((header) => ({
    header,
    cell: LoadingComponent,
  }));

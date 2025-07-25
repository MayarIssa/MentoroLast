"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/lib/constants";

const FilterOnRole = ({
  setCurRole,
}: {
  setCurRole: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <Select onValueChange={setCurRole}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Category" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="All">All</SelectItem>
        {ROLES.map((role, idx) => (
          <SelectItem key={idx} value={role}>
            {role}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterOnRole;

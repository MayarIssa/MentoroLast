"use client";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { API } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { Check, ChevronsUpDown, Trash2 } from "lucide-react";
import { useState } from "react";
import { useFieldArray, useFormContext, type Control } from "react-hook-form";
import type { TPlanFormSchema, TRoadmapPlanSchema } from "./plan-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Resource } from "@/lib/types/resources";

export function PlanFormResources() {
  const { control, setValue } = useFormContext<TPlanFormSchema>();

  const { data: resources } = useQuery({
    queryKey: ["resources"],
    queryFn: () => API.queries.resources.getResources(),
  });
  const {
    fields: stagesFields,
    append: addStage,
    remove: removeStage,
  } = useFieldArray({
    control,
    name: "stages",
    rules: {
      minLength: 1,
    },
  });

  function handleRemoveStage(index: number) {
    stagesFields.forEach((stage, i) => {
      if (i > index) {
        setValue(`stages.${i}.order`, i);
      }
    });
    removeStage(index);
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-35rem)] pr-4">
        <div className="space-y-4">
          {stagesFields.map((stage, index) => {
            return (
              <StageCard
                key={index}
                stage={stage}
                index={index}
                handleRemoveStage={handleRemoveStage}
                control={control}
                resources={resources ?? []}
              />
            );
          })}
        </div>
      </ScrollArea>

      <Button
        type="button"
        onClick={() =>
          addStage({
            title: "",
            description: "",
            order: stagesFields.length + 1,
            expectedDuration: "",
            resources: [],
          })
        }
      >
        Add stage
      </Button>
    </>
  );
}

function StageCard({
  index,
  handleRemoveStage,
  control,
  resources,
}: {
  stage: TRoadmapPlanSchema["stages"][number];
  index: number;
  handleRemoveStage: (index: number) => void;
  control: Control<TPlanFormSchema>;
  resources: Omit<Resource, "files" | "urls">[];
}) {
  const [showOptions, setShowOptions] = useState(true);

  return (
    <Card key={index}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold">Stage {index + 1}</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="destructive"
              size="icon"
              onClick={() => handleRemoveStage(index)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowOptions(!showOptions)}
            >
              <ChevronsUpDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent
        className={cn(
          "grid gap-8 transition-all duration-300",
          showOptions ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="space-y-4 overflow-hidden">
          <FormField
            control={control}
            name={`stages.${index}.title`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`stages.${index}.description`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`stages.${index}.expectedDuration`}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input placeholder="Expected duration" {...field} />
                </FormControl>
                <FormMessage />
                <FormDescription>
                  Please enter the expected duration in this format:{" "}
                  <kbd>DAYS.HOURS:MINUTES:SECONDS</kbd>
                </FormDescription>
              </FormItem>
            )}
          />

          <FormField
            control={control}
            name={`stages.${index}.resources`}
            render={({ field }) => (
              <FormItem className="flex w-full flex-col">
                <FormLabel>Resources</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-full justify-between",
                          !field.value && "text-muted-foreground",
                        )}
                      >
                        {field.value.length > 0
                          ? resources
                              ?.filter((resource) =>
                                field.value.includes(resource.id),
                              )
                              .map((resource) => resource.title)
                              .join(", ")
                          : "Select resources"}
                        <ChevronsUpDown className="opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
                    <Command className="w-full">
                      <CommandInput
                        placeholder="Search resource..."
                        className="h-9"
                      />
                      <CommandList className="w-full">
                        <CommandEmpty>No Resource found.</CommandEmpty>
                        <CommandGroup>
                          {resources?.map((resource) => (
                            <CommandItem
                              value={resource.title}
                              key={resource.id}
                              onSelect={() => {
                                if (field.value.includes(resource.id)) {
                                  field.onChange(
                                    field.value.filter(
                                      (id) => id !== resource.id,
                                    ),
                                  );
                                } else {
                                  field.onChange([...field.value, resource.id]);
                                }
                              }}
                            >
                              {resource.title}
                              <Check
                                className={cn(
                                  "ml-auto",
                                  field.value.includes(resource.id)
                                    ? "opacity-100"
                                    : "opacity-0",
                                )}
                              />
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}

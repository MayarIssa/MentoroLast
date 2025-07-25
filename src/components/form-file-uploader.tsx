import { Button } from "@/components/ui/button";
import {
  FileUpload,
  FileUploadDropzone,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  type FileUploadRootProps,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Trash, Upload } from "lucide-react";
import { useLocale } from "next-intl";
import {
  useFormContext,
  type FieldPath,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";

export function FormFileUploader<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  label,
  maxFiles,
  ...props
}: UseControllerProps<TFieldValues, TName> & { label: string } & Omit<
    FileUploadRootProps,
    "value" | "onValueChange"
  >) {
  const { setError, control } = useFormContext();
  const isArabic = useLocale().startsWith("ar");

  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => {
        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>
            <FormControl>
              <FileUpload
                value={field.value}
                onValueChange={field.onChange}
                disabled={field.value.length >= (maxFiles ?? 9999)}
                onFileReject={(_, message) => setError(name, { message })}
                {...props}
              >
                <FileUploadDropzone
                  className={cn(field.value.length > 0 && "opacity-70")}
                >
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center rounded-full border p-2.5">
                      <Upload className="text-muted-foreground size-6" />
                    </div>
                    <p className="text-sm font-medium">
                      Drag & drop files here
                    </p>
                    <p className="text-muted-foreground text-xs">
                      Or click to browse
                    </p>
                  </div>
                  <FileUploadTrigger asChild>
                    <Button variant="outline" size="sm" className="mt-2 w-fit">
                      Browse files
                    </Button>
                  </FileUploadTrigger>
                </FileUploadDropzone>

                <FileUploadList>
                  {(field.value as File[]).map((file, index) => (
                    <FileUploadItem
                      key={index}
                      value={file}
                      className={cn("p-0", isArabic ? "pl-4" : "pr-4")}
                    >
                      <FileUploadItemPreview className="size-20 [&>svg]:size-12" />
                      <FileUploadItemMetadata />
                      <FileUploadItemDelete asChild>
                        <Button size="icon" variant="destructive">
                          <Trash />
                        </Button>
                      </FileUploadItemDelete>
                    </FileUploadItem>
                  ))}
                </FileUploadList>
              </FileUpload>
            </FormControl>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
}

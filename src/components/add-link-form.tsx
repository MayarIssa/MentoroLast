"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const addLinkFormSchema = z.object({
    description: z.string().min(2, { message: "Description is required" }),
    link: z.string().min(2, { message: "Link is required" }),
});

interface AddLinkFormProps {
    className?: string;
    onSubmit: (values: z.infer<typeof addLinkFormSchema>) => void;
}

const AddLinkForm = ({ className, onSubmit }: AddLinkFormProps) => {
    const form = useForm<z.infer<typeof addLinkFormSchema>>({
        resolver: zodResolver(addLinkFormSchema),
        defaultValues: {
            description: "",
            link: "",
        },
    });

    return (
        <>
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className={cn("py-4 space-y-8", className)}
                >
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input
                                        placeholder="Description"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="link"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <Input placeholder="Link" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className="w-full font-bold rounded-xl rounded-br-none"
                        type="submit"
                    >
                        Add
                    </Button>
                </form>
            </Form>
        </>
    );
};

export default AddLinkForm;

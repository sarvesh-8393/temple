"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, Upload } from "lucide-react";

const formSchema = z.object({
  templeName: z.string().min(2, "Temple name must be at least 2 characters."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  zipCode: z.string().regex(/^\d{5}$/, "Must be a valid 5-digit zip code."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(500),
  contactEmail: z.string().email("Invalid email address."),
});

export default function RegisterTemplePage() {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      templeName: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      description: "",
      contactEmail: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast({
      title: "Submitting Registration...",
      description: "Please wait while we process your temple's information.",
    });

    setTimeout(() => {
      console.log(values);
      toast({
        title: "Registration Submitted!",
        description: "Your temple profile has been submitted for review. We will notify you upon approval.",
      });
      form.reset();
    }, 2000);
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Building className="w-10 h-10 text-primary" />
          <div>
            <h1 className="text-3xl font-headline font-bold tracking-tight">Register Your Temple</h1>
            <p className="text-muted-foreground">Join our community and connect with devotees worldwide.</p>
          </div>
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>Temple Information</CardTitle>
            <CardDescription>Fill out the form below to create a profile for your temple.</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="templeName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Temple Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Sri Siva Vishnu Temple" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Tell us about the temple's history, significance, and deities." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                 <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Street Address</FormLabel>
                        <FormControl>
                            <Input placeholder="1234 Divine Rd" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>City</FormLabel>
                        <FormControl>
                            <Input placeholder="Sanctum" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>
                 <div className="grid md:grid-cols-2 gap-8">
                    <FormField
                    control={form.control}
                    name="state"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>State / Province</FormLabel>
                        <FormControl>
                            <Input placeholder="California" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                    <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                        <FormItem>
                        <FormLabel>Zip / Postal Code</FormLabel>
                        <FormControl>
                            <Input placeholder="90210" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                    />
                 </div>
                 <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email</FormLabel>
                      <FormControl>
                        <Input placeholder="contact@yourtemple.org" {...field} />
                      </FormControl>
                      <FormDescription>This email will be used for official communication.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Temple Photos</FormLabel>
                  <FormControl>
                    <Button variant="outline" className="w-full flex gap-2 items-center cursor-pointer">
                      <Upload className="w-4 h-4" />
                      Upload Images
                      <Input type="file" className="sr-only" multiple />
                    </Button>
                  </FormControl>
                  <FormDescription>Upload high-quality photos of your temple (simulated).</FormDescription>
                </FormItem>


                <Button type="submit" size="lg" className="w-full">
                  Submit for Review
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

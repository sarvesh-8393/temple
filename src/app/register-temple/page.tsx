
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import { useFirestore } from "@/firebase/provider";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
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
import { Building, PlusCircle, Trash2, IndianRupee } from "lucide-react";
import { errorEmitter, FirestorePermissionError } from "@/firebase";

const poojaSchema = z.object({
  name: z.string().min(1, "Pooja name is required."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
});

const formSchema = z.object({
  templeName: z.string().min(2, "Temple name must be at least 2 characters."),
  address: z.string().min(10, "Address must be at least 10 characters."),
  city: z.string().min(2, "City is required."),
  state: z.string().min(2, "State is required."),
  zipCode: z.string().regex(/^\d{5,6}$/, "Must be a valid zip code."),
  description: z.string().min(20, "Description must be at least 20 characters.").max(500),
  contactEmail: z.string().email("Invalid email address."),
  imageUrl: z.string().url("A valid image URL is required."),
  poojas: z.array(poojaSchema).optional(),
});

export default function RegisterTemplePage() {
  const { toast } = useToast();
  const firestore = useFirestore();
  
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
      imageUrl: "",
      poojas: [{ name: "", price: 0 }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "poojas",
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!firestore) {
        toast({
            variant: "destructive",
            title: "Database Error",
            description: "Could not connect to the database. Please try again later.",
        });
        return;
    }
    
    toast({
      title: "Submitting Registration...",
      description: "Please wait while we process your temple's information.",
    });

    const templesCollection = collection(firestore, "temples");
    addDoc(templesCollection, {
      ...values,
      createdAt: serverTimestamp(),
    })
      .then(() => {
        toast({
          title: "Registration Submitted!",
          description: "Your temple profile has been submitted for review. We will notify you upon approval.",
        });
        form.reset();
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
        
        const permissionError = new FirestorePermissionError({
          path: templesCollection.path,
          operation: 'create',
          requestResourceData: values,
        });
        
        errorEmitter.emit('permission-error', permissionError);
        
        // This toast is for user feedback, not for debugging the raw error.
        toast({
          variant: "destructive",
          title: "Submission Failed",
          description: "There was an error submitting your registration. Please check your permissions and try again.",
        });
      });
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

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                        <FormLabel>Temple Photo URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://example.com/temple.jpg" {...field} />
                        </FormControl>
                        <FormDescription>Provide a direct link to a high-quality photo of your temple.</FormDescription>
                        <FormMessage />
                    </FormItem>
                  )}
                />


                <div>
                  <FormLabel>Poojas Offered</FormLabel>
                  <FormDescription className="mb-4">Add the poojas available at your temple.</FormDescription>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex items-end gap-4 p-4 border rounded-lg">
                        <FormField
                          control={form.control}
                          name={`poojas.${index}.name`}
                          render={({ field }) => (
                            <FormItem className="flex-grow">
                              <FormLabel>Pooja Name</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Ganesh Pooja" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`poojas.${index}.price`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Price</FormLabel>
                              <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <FormControl>
                                  <Input type="number" placeholder="101" className="pl-8" {...field} />
                                </FormControl>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          onClick={() => remove(index)}
                          disabled={fields.length <= 1}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Remove Pooja</span>
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "", price: 0 })}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Pooja
                    </Button>
                  </div>
                </div>

                <Button type="submit" size="lg" className="w-full" disabled={form.formState.isSubmitting}>
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

    
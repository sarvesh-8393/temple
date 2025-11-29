
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { Building, PlusCircle, Trash2, IndianRupee } from "lucide-react";
import { useEffect, useRef } from "react";

// Declare global window interface for Google Maps
declare global {
  interface Window {
    google: any;
  }
}

const poojaSchema = z.object({
  name: z.string().min(1, "Pooja name is required."),
  description: z.string().min(10, "Description must be at least 10 characters long."),
  price: z.coerce.number().min(0, "Price must be a positive number."),
  times: z.string().optional(),
});

const formSchema = z.object({
  templeName: z.string().min(2, "Temple name must be at least 2 characters."),
  address: z.string().min(1, "Address is required."),
  placeId: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipCode: z.string().optional(),
  description: z.string().min(20, "Description must be at least 20 characters."),
  contactEmail: z.string().email("Invalid email address."),
  imageUrl: z.string()
    .min(1, "Temple photo URL is required")
    .refine((url) => {
      // Allow both regular URLs and data URLs
      return url.startsWith('http') || url.startsWith('https') || url.startsWith('data:image/');
    }, "Please provide a valid image URL"),
  poojas: z.array(poojaSchema).optional(),
});

export default function RegisterTemplePage() {
  const { toast } = useToast();
  const addressInputRef = useRef<HTMLInputElement>(null);

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
      poojas: [{ name: "", description: "", price: 0, times: "" }],
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "poojas",
  });

  useEffect(() => {
    if (typeof window !== 'undefined' && addressInputRef.current) {
      // Check if Google Maps API is loaded
      if (!window.google || !window.google.maps || !window.google.maps.places) {
        console.warn('Google Maps Places API not loaded. Please check your API key.');
        return;
      }

      const autocomplete = new window.google.maps.places.Autocomplete(addressInputRef.current, {
        types: ['address'],
        componentRestrictions: { country: 'in' },
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry) {
          form.setValue('address', place.formatted_address || '');
          form.setValue('placeId', place.place_id || '');
          form.setValue('lat', place.geometry.location?.lat() || 0);
          form.setValue('lng', place.geometry.location?.lng() || 0);

          // Extract address components
          let city = '', state = '', zipCode = '';
          place.address_components?.forEach((component: any) => {
            const types = component.types;
            if (types.includes('locality')) {
              city = component.long_name;
            } else if (types.includes('administrative_area_level_1')) {
              state = component.short_name;
            } else if (types.includes('postal_code')) {
              zipCode = component.long_name;
            }
          });

          form.setValue('city', city);
          form.setValue('state', state);
          form.setValue('zipCode', zipCode);
        }
      });
    }
  }, [form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('You must be logged in to register a temple');
        }

        const response = await fetch('/api/temples', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(values),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to register temple');
        }

        const result = await response.json();
        console.log('Temple registered successfully:', result);

        toast({
            title: "Registration Submitted!",
            description: "Your temple profile has been created successfully.",
        });
        form.reset();

    } catch (error: any) {
        console.error("Registration error:", error);
        toast({
            title: "Registration Failed",
            description: error.message || "There was an error submitting your registration. Please try again.",
            variant: "destructive",
        });
    }
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
                            <Input
                              placeholder="Start typing your address..."
                              {...field}
                              ref={addressInputRef}
                            />
                        </FormControl>
                        <FormDescription>
                          Use Google Places autocomplete to automatically fill in your address details.
                        </FormDescription>
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
                          <Input 
                            placeholder="https://example.com/temple.jpg" 
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>
                          Provide a direct web link (URL) to your temple photo. The URL should start with 'http://' or 'https://' 
                          and point directly to an image file. You can upload your image to a service like Imgur or similar and use that link.
                        </FormDescription>
                        <FormMessage />
                    </FormItem>
                  )}
                />


                <div>
                  <FormLabel>Poojas Offered</FormLabel>
                  <FormDescription className="mb-4">Add the poojas available at your temple.</FormDescription>
                  <div className="space-y-4">
                    {fields.map((field, index) => (
                      <div key={field.id} className="flex flex-col gap-4 p-4 border rounded-lg">
                        <div className="flex items-start gap-4">
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
                            className="mt-8"
                            >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove Pooja</span>
                            </Button>
                        </div>
                        <FormField
                            control={form.control}
                            name={`poojas.${index}.description`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Pooja Description</FormLabel>
                                <FormControl>
                                    <Textarea placeholder="Describe the pooja and its significance." {...field} />
                                </FormControl>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name={`poojas.${index}.times`}
                            render={({ field }) => (
                                <FormItem>
                                <FormLabel>Available Times (optional)</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g., 9:00 AM, 11:00 AM, 3:00 PM" {...field} />
                                </FormControl>
                                <FormDescription>Enter comma-separated times for this pooja (e.g., 9:00 AM, 11:00 AM, 3:00 PM)</FormDescription>
                                <FormMessage />
                                </FormItem>
                            )}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => append({ name: "", description: "", price: 0, times: "" })}
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

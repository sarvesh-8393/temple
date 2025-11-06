"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
import Image from "next/image";
import { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { useFirebaseApp } from "@/firebase/provider";
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
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Building, Upload, PlusCircle, Trash2, IndianRupee } from "lucide-react";

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
  const firebaseApp = useFirebaseApp();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
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
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "poojas",
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const uploadFile = (fileToUpload: File | Blob) => {
      const storage = getStorage(firebaseApp);
      const storageRef = ref(storage, `temple-images/${Date.now()}-${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, fileToUpload);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(progress);
        },
        (error) => {
          console.error("Upload failed:", error);
          toast({
            variant: "destructive",
            title: "Upload Failed",
            description: "There was an error uploading your image. Please try again.",
          });
          setIsUploading(false);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            form.setValue("imageUrl", downloadURL);
            toast({
              title: "Upload Successful",
              description: "Your temple image has been uploaded.",
            });
            setIsUploading(false);
          });
        }
      );
    }
    
    // --- Image Optimization Logic ---
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = document.createElement("img");
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const MAX_WIDTH = 1024;
        const MAX_HEIGHT = 1024;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(img, 0, 0, width, height);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              toast({
                variant: "destructive",
                title: "Image Processing Failed",
                description: "Could not process the image for upload.",
              });
              setIsUploading(false);
              return;
            }
            uploadFile(blob);
          },
          "image/jpeg",
          0.9 // 90% quality
        );
      };
      if (event.target?.result) {
        img.src = event.target.result as string;
      }
    };
    reader.readAsDataURL(file);
    // --- End Image Optimization ---
  };

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
      setUploadProgress(0);
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
                  <FormLabel>Temple Photo</FormLabel>
                  <FormControl>
                    <Input id="file-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" disabled={isUploading} />
                  </FormControl>
                   <Button asChild variant="outline" className="w-full" disabled={isUploading}>
                    <label htmlFor="file-upload" className="cursor-pointer flex items-center gap-2">
                        <Upload className="w-4 h-4"/>
                        <span>{isUploading ? 'Uploading...' : 'Choose an Image'}</span>
                    </label>
                   </Button>
                   {isUploading && <Progress value={uploadProgress} className="w-full mt-2" />}
                   {form.watch("imageUrl") && !isUploading && (
                     <div className="mt-4 relative w-full h-64 rounded-lg overflow-hidden border">
                       <Image src={form.watch("imageUrl")} alt="Temple preview" fill className="object-cover"/>
                     </div>
                   )}
                  <FormDescription>Upload a high-quality photo of your temple.</FormDescription>
                  <FormMessage />
                </FormItem>

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

                <Button type="submit" size="lg" className="w-full" disabled={isUploading || !form.formState.isValid}>
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

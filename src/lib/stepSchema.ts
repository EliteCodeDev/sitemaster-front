import { z } from "zod";

// Helper function to create checkbox group schema
const createCheckboxGroupSchema = (options: string[]) => {
  const checkboxSchema: Record<string, z.ZodType<boolean | undefined>> = {};

  options.forEach((option) => {
    checkboxSchema[option] = z.boolean().optional();
  });

  return z.object(checkboxSchema);
};

// Basic Information step schema
const basicInfoSchema = z.object({
  websiteName: z.string().min(2, "Website name must be at least 2 characters"),
  purpose: z.enum(["business", "personal", "portfolio", "ecommerce", "blog"]),
  description: z.string().min(10, "Description must be at least 10 characters"),
});
// Domain Information step schema
const domainSchema = z.object({
  domainName: z.string().min(2, "Domain must be at least 2 characters"),
  domainExtension: z.enum([".com", ".net", ".org", ".io", ".dev"]).optional(),
  otherExtension: z.string().optional(),
});
// Design Preferences step schema
const designSchema = z.object({
  // colorScheme: z.enum(["light", "dark", "colorful", "minimal"]),
  layout: z.enum(["modern", "classic", "minimalist", "creative"]),
  // features: createCheckboxGroupSchema([
  //   "animations",
  //   "darkMode",
  //   "multilingual",
  //   "accessibility",
  // ]),
});

// Content Sections step schema
const contentSchema = z.object({
  sections: createCheckboxGroupSchema([
    "hero",
    "about",
    "services",
    "testimonials",
    "gallery",
    "blog",
    "contact",
    "faq",
  ]).refine((data) => Object.values(data).some((value) => value === true), {
    message: "Select at least one section",
    path: ["sections"],
  }),
  homepage: z.enum(["content", "visual", "mixed"]),
});

// Social Media item schema
const socialMediaItemSchema = z.object({
  platform: z.enum(["facebook", "twitter", "instagram", "linkedin", "youtube"]),
  url: z.string().url("Please enter a valid URL"),
});

// Contact Information step schema
const contactSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().optional(),
  socialMedia: z.array(socialMediaItemSchema).optional(),
});

// Complete form schema
export const websiteCreatorSchema = z.object({
  ...basicInfoSchema.shape,
  ...domainSchema.shape,
  ...designSchema.shape,
  // ...contentSchema.shape,
  // ...contactSchema.shape,
});

// Type for the form data
export type WebsiteCreatorFormData = z.infer<typeof websiteCreatorSchema>;

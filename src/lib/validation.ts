import { z } from "zod";

// Versioned consent texts. The stored hash of the exact wording is recorded
// with every consent so future wording changes are provable.
export const CONSENT_TEXT_VERSION = "2026-07-v1";
export const NO_ENTITLEMENT_ACK_TEXT =
  "I acknowledge that registration does not constitute an investment, token purchase, asset reservation, price reservation, token allocation or entitlement to participate in any future offering.";
export const PRIVACY_ACK_TEXT =
  "I acknowledge the Privacy Policy and consent to the processing of this registration data for project-development communication.";
export const UPDATES_CONSENT_TEXT =
  "I consent to receive project-development updates and future eligibility information by email.";

export const waitlistSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(100),
  lastName: z.string().trim().min(1, "Last name is required").max(100),
  email: z.string().trim().toLowerCase().email("A valid email address is required").max(254),
  countryOfResidence: z.string().trim().min(2, "Country of residence is required").max(100),
  interestType: z.enum(["individual", "institutional"]),
  isIndustrialBuyer: z.boolean().default(false),
  isAssetOriginator: z.boolean().default(false),
  materialInterest: z.enum(["copper", "nickel", "both", "future"]),
  interestRange: z
    .enum(["undisclosed", "under_10k", "10k_50k", "50k_250k", "250k_1m", "over_1m"])
    .default("undisclosed"),
  participationType: z
    .enum(["undecided", "individual_participation", "institutional_participation", "industrial_offtake", "asset_origination", "enterprise_services"])
    .default("undecided"),
  consentUpdates: z.literal(true, {
    errorMap: () => ({ message: "Consent to receive updates is required for the waitlist" }),
  }),
  privacyAck: z.literal(true, {
    errorMap: () => ({ message: "The privacy acknowledgement is required" }),
  }),
  noEntitlementAck: z.literal(true, {
    errorMap: () => ({ message: "You must acknowledge that registration is not an investment, purchase, reservation, allocation or entitlement" }),
  }),
  // Honeypot: must remain empty. Bots that fill it are silently dropped.
  website: z.string().max(0).optional().or(z.literal("")),
  campaignSource: z.string().trim().max(120).optional(),
});

export type WaitlistInput = z.infer<typeof waitlistSchema>;

export const enquirySchema = z.object({
  enquiryType: z.enum(["enterprise", "asset_originator", "industrial_buyer", "general"]),
  organization: z.string().trim().max(200).optional(),
  contactName: z.string().trim().min(1, "Contact name is required").max(150),
  email: z.string().trim().toLowerCase().email("A valid email address is required").max(254),
  country: z.string().trim().max(100).optional(),
  message: z.string().trim().min(10, "Please describe your enquiry (minimum 10 characters)").max(5000),
  website: z.string().max(0).optional().or(z.literal("")),
});

export type EnquiryInput = z.infer<typeof enquirySchema>;

export const adminLoginSchema = z.object({
  email: z.string().trim().toLowerCase().email(),
  password: z.string().min(8),
});

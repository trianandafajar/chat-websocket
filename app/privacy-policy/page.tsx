import { LegalPage } from "@/components/legal/legal-page";
import type { LegalSection } from "@/components/legal/legal-page";

export const metadata = {
  title: "Privacy Policy - Chat App",
  description:
    "Learn how Chat App collects, uses, and protects your information.",
  openGraph: {
    title: "Privacy Policy - Chat App",
    description:
      "Learn how Chat App collects, uses, and protects your information.",
    type: "website",
    images: [{ url: "/logo.svg" }],
  },
};

const sections: LegalSection[] = [
  {
    title: "Information we collect",
    body: [
      [
        "We collect the information needed to ",
        { text: "create, secure, and maintain", mark: "strong" },
        " your Chat App account. This may include your name, email address, password credentials, profile details, avatar, account settings, and any information you choose to add to your profile.",
      ],
      "When you use Chat App, we process messages, conversation records, participant information, timestamps, delivery status, and other metadata that helps the app send, receive, organize, and display your chats correctly.",
      [
        "We may also collect technical information such as ",
        { text: "device type", mark: "code" },
        ", ",
        { text: "browser", mark: "code" },
        ", ",
        { text: "IP address", mark: "code" },
        ", session identifiers, authentication activity, and basic usage events. This information helps us understand whether the service is working properly and whether suspicious activity is taking place.",
      ],
    ],
  },
  {
    title: "How we use information",
    body: [
      "We use your information to provide the core messaging experience, including account access, chat delivery, conversation history, user presence, profile display, and basic personalization across the app.",
      [
        "Your information also helps us protect the service. For example, we may use login records, device information, and account activity to ",
        { text: "detect unauthorized access", mark: "strong" },
        ", prevent abuse, investigate errors, and keep Chat App reliable for everyone.",
      ],
      [
        "We may use your email address to send essential account messages such as verification links, password reset instructions, security alerts, product notices, or updates related to changes in our policies. These messages are ",
        { text: "part of operating the service", mark: "em" },
        " and are not intended as promotional spam.",
      ],
    ],
  },
  {
    title: "Sharing and disclosure",
    body: [
      [
        "We ",
        { text: "do not sell", mark: "strong" },
        " your personal information. We also do not share your private messages with advertisers or unrelated third parties for their own marketing purposes.",
      ],
      "We may share limited information with trusted service providers that help us run Chat App, such as hosting providers, database services, authentication systems, analytics tools, email delivery services, or infrastructure monitoring vendors. These providers are only allowed to process information as needed to support the app.",
      "We may disclose information if required by law, court order, legal process, or government request. We may also disclose information when we believe it is necessary to enforce our terms, investigate harmful activity, protect our users, prevent fraud, or maintain the security and integrity of Chat App.",
    ],
  },
  {
    title: "Data retention",
    body: [
      "We keep account information for as long as your account remains active or as long as needed to provide the service. Message data and conversation metadata may be retained so your chat history remains available when you return to the app.",
      [
        "Some information may be kept for a longer period when necessary for ",
        { text: "security, fraud prevention, debugging, legal compliance, dispute resolution, or backup recovery", mark: "em" },
        ". Backup copies are usually overwritten over time according to normal system operations.",
      ],
      "If you request deletion of your account, we will take reasonable steps to delete or anonymize personal information associated with your account, unless we need to retain certain records for legitimate business, safety, or legal reasons.",
    ],
  },
  {
    title: "Security",
    body: [
      [
        "We use reasonable technical and organizational measures to protect your information from unauthorized access, loss, misuse, alteration, or disclosure. These measures may include ",
        { text: "authentication controls", mark: "strong" },
        ", access restrictions, encrypted connections, monitoring, and operational safeguards.",
      ],
      "No online service can guarantee absolute security. You can help protect your account by using a strong password, keeping your login details private, signing out on shared devices, and contacting us if you notice unusual activity.",
    ],
  },
  {
    title: "Your choices",
    body: [
      "You may update certain account details directly in the app when those settings are available. You may also request access to personal information associated with your account, ask us to correct inaccurate information, or request deletion where applicable.",
      [
        "Depending on your location, you may have additional privacy rights under local law. We will review eligible requests and respond within a reasonable timeframe. Some information may remain in ",
        { text: "backups", mark: "code" },
        ", ",
        { text: "security logs", mark: "code" },
        ", or retained records for a limited period where permitted by law.",
      ],
    ],
  },
  {
    title: "Contact",
    body: [
      [
        "If you have questions about this Privacy Policy, how your information is handled, or how to exercise privacy rights related to your account, contact the Chat App support team through the available support channel. You can also review our ",
        { text: "Terms of Use", mark: "link", href: "/terms-of-use" },
        " for rules that apply when using the service.",
      ],
      "When you contact us, please include enough information for us to understand your request. For security reasons, we may need to verify that you are the account owner before sharing account details or making changes.",
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      label="Privacy policy"
      title="Privacy Policy"
      description="This page explains what information Chat App collects, why we use it, and the choices you have when using the service."
      updatedAt="May 9, 2026"
      sections={sections}
    />
  );
}

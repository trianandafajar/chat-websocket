import { LegalPage } from "@/components/legal/legal-page";
import type { LegalSection } from "@/components/legal/legal-page";

export const metadata = {
  title: "Terms of Use - Chat App",
  description:
    "Read the terms that apply when you access or use Chat App.",
  openGraph: {
    title: "Terms of Use - Chat App",
    description:
      "Read the terms that apply when you access or use Chat App.",
    type: "website",
    images: [{ url: "/logo.svg" }],
  },
};

const sections: LegalSection[] = [
  {
    title: "Acceptance of terms",
    body: [
      [
        "By accessing, creating an account, or using Chat App, you agree to follow these ",
        { text: "Terms of Use", mark: "strong" },
        ". These terms apply to your use of the website, messaging features, account tools, and any related services we provide.",
      ],
      [
        "If you do not agree with these terms, you should not use Chat App. Using the service means you understand that your access is subject to these rules, our ",
        { text: "Privacy Policy", mark: "link", href: "/privacy-policy" },
        ", and any additional notices shown inside the app.",
      ],
      [
        "We may update these terms from time to time as the product, legal requirements, or operating practices change. When changes are material, we may provide notice through the app, by email, or by updating the date on this page. ",
        { text: "Continued use after an update means you accept the revised terms.", mark: "em" },
      ],
    ],
  },
  {
    title: "Your account",
    body: [
      "You are responsible for providing accurate account information and keeping it up to date. You are also responsible for maintaining the confidentiality of your login credentials and for all activity that occurs under your account.",
      [
        "You should not share your password, allow another person to access your account, or use another user's account without permission. If you believe your account has been accessed ",
        { text: "without authorization", mark: "strong" },
        ", you should contact us as soon as possible.",
      ],
      [
        "We may ",
        { text: "suspend, restrict, or terminate", mark: "strong" },
        " accounts that violate these terms, create security risks, disrupt the service, impersonate others, or are used in a way that may harm Chat App or its users.",
      ],
    ],
  },
  {
    title: "Acceptable use",
    body: [
      [
        "You agree to use Chat App ",
        { text: "responsibly and lawfully", mark: "strong" },
        ". You may not use the service to harass, threaten, abuse, impersonate, defraud, spam, exploit, or harm other people.",
      ],
      [
        "You may not attempt to access accounts, systems, messages, data, or infrastructure that you are not authorized to access. You also may not interfere with the service, overload the system, reverse engineer protected parts of the app, or bypass ",
        { text: "security controls", mark: "code" },
        ".",
      ],
      "You are responsible for the messages, profile information, and content you send or share. Please only share content that you have the right to use, and avoid posting anything that is illegal, harmful, invasive, or otherwise violates the rights of others.",
    ],
  },
  {
    title: "Service availability",
    body: [
      "We work to keep Chat App fast, available, and reliable, but we cannot guarantee that the service will always be uninterrupted or error free. The app may be unavailable due to maintenance, updates, network issues, infrastructure problems, or circumstances outside our control.",
      [
        "We may add, modify, limit, or remove features as the product evolves. Some changes may be made to ",
        { text: "improve performance", mark: "em" },
        ", increase security, fix bugs, simplify the experience, or comply with technical or legal requirements.",
      ],
      "We are not responsible for losses or inconvenience caused by temporary service interruptions, message delays, unavailable features, or data issues that occur despite reasonable operational care.",
    ],
  },
  {
    title: "Intellectual property",
    body: [
      [
        "Chat App, including its software, interface, visual design, branding, logos, copy, systems, and related materials, is owned by us or our licensors. These terms allow you to use the service, but they ",
        { text: "do not transfer ownership", mark: "strong" },
        " of the app or its underlying technology to you.",
      ],
      "You retain ownership of content you create, send, or upload through Chat App, subject to any rights held by others. By using the service, you grant us a limited permission to host, store, process, transmit, display, and make your content available as needed to operate the app.",
      "You may not copy, modify, distribute, sell, lease, or create derivative works based on Chat App unless you have written permission or the law allows it.",
    ],
  },
  {
    title: "Limitation of liability",
    body: [
      [
        "To the fullest extent permitted by law, Chat App is provided on an ",
        { text: "as-is", mark: "code" },
        " and ",
        { text: "as-available", mark: "code" },
        " basis. We do not make warranties that the service will meet every expectation, remain available at all times, or be free from errors, vulnerabilities, or interruptions.",
      ],
      "We are not responsible for indirect, incidental, special, consequential, exemplary, or punitive damages arising from your use of or inability to use the service. This includes lost profits, lost data, lost messages, business interruption, or reputational harm.",
      "Some jurisdictions do not allow certain limitations of liability, so parts of this section may not apply to you. In those cases, our liability will be limited to the maximum extent permitted by applicable law.",
    ],
  },
  {
    title: "Contact",
    body: [
      "If you have questions about these Terms of Use, account restrictions, acceptable use, or how these rules apply to your use of Chat App, contact the Chat App support team through the available support channel.",
      "When contacting us about an account, please provide enough context for us to review the issue. We may need to verify account ownership before discussing account-specific information or making changes.",
    ],
  },
];

export default function TermsOfUsePage() {
  return (
    <LegalPage
      label="Terms of use"
      title="Terms of Use"
      description="These terms describe the rules and responsibilities that apply when you create an account or use Chat App."
      updatedAt="May 9, 2026"
      sections={sections}
    />
  );
}

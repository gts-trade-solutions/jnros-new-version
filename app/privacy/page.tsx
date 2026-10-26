import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { site } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "Privacy Policy", description: `How ${site.name} collects, uses and protects your information.`, path: "/privacy" });

/* Placeholder copy: have counsel review before launch. */
export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" path="/privacy" updated="October 2026">
      <p>
        This policy explains what information {site.legalName} (&ldquo;Jnros&rdquo;) collects through this website, how we use it and the choices you have.
      </p>
      <h2>Information you give us</h2>
      <p>
        When you request a quote, send a message or apply for a job we collect the details you provide, such as your name, company, email address, phone number
        and project information. We use them only to respond to you and to deliver the services you ask about.
      </p>
      <h2>Information collected automatically</h2>
      <p>
        Like most websites, our servers record basic technical information such as your browser type and the pages you visit. We use it to keep the site secure
        and working well. This site does not use advertising cookies.
      </p>
      <h2>Sharing</h2>
      <p>
        We do not sell your information. We share it only with Jnros group companies and service providers who help us operate, under contracts that require them
        to protect it, or where the law requires.
      </p>
      <h2>Your choices</h2>
      <p>
        You can ask us to access, correct or delete your information at any time by emailing <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}

import type { Metadata } from "next";
import { LegalPage } from "@/components/sections/LegalPage";
import { site } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({ title: "Terms of Use", description: `Terms governing your use of the ${site.name} website.`, path: "/terms" });

/* Placeholder copy: have counsel review before launch. */
export default function TermsPage() {
  return (
    <LegalPage title="Terms of Use" path="/terms" updated="October 2026">
      <p>By using this website you agree to these terms. If you do not agree, please do not use the site.</p>
      <h2>Information on this site</h2>
      <p>
        Content on this site, including project descriptions, capacities and statistics, is provided for general information. It is not an offer or a quotation;
        every project is priced and contracted separately.
      </p>
      <h2>Intellectual property</h2>
      <p>The Jnros name, logo, text and images on this site belong to {site.legalName} or its licensors and may not be used without permission.</p>
      <h2>Liability</h2>
      <p>
        We work to keep this site accurate and available but cannot guarantee it will always be either. To the extent permitted by law, we are not liable for
        losses arising from its use.
      </p>
      <h2>Contact</h2>
      <p>
        Questions about these terms? Email <a href={`mailto:${site.email}`}>{site.email}</a>.
      </p>
    </LegalPage>
  );
}

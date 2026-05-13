// app/campaign/page.tsx

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Collection from "@/components/collection/Collection";

/* -------------------------------------------------------------------------- */
/*                               CAMPAIGN DATA                                */
/* -------------------------------------------------------------------------- */
 
export default function CampaignPage() {
  return (
    <main
      id="MainContent"
      className="flex min-h-screen flex-col"
      role="main"
    >
      <Header />
      <div className="flex-1">
        <Collection />
      </div>
      <Footer />
    </main>
  );
}
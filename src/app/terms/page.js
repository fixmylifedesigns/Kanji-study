// src/app/terms/page.js
"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function Terms() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-3xl mx-auto py-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="mr-2" size={20} />
          Back
        </button>

        <Card className="p-8">
          <div className="prose prose-blue max-w-none">
            <h1 className="text-3xl font-bold text-center mb-8">
              Terms & Conditions
            </h1>
            <p className="text-gray-600 text-center mb-8">
              Last Updated: October 25, 2024
            </p>

            <section className="space-y-6">
              <h2 className="text-xl font-semibold">1. Introduction</h2>
              <p>
                Welcome to Kanji Study. These Terms and Conditions
                (&quot;Terms&quot;) govern your use of the Kanji Study
                application (&quot;App&quot;), developed and operated by
                StealthWork LLC (&quot;Company,&quot; &quot;we,&quot;
                &quot;us,&quot; or &quot;our&quot;). By accessing or using the
                App, you agree to be bound by these Terms.
              </p>

              <h2 className="text-xl font-semibold">2. Use of the App</h2>
              <p>
                2.1. You must be at least 13 years old to use this App. If you
                are under 13, you must have your parent's or legal guardian's
                permission to use the App, in compliance with the Children's
                Online Privacy Protection Act (COPPA).
              </p>
              <p>
                2.2. You agree to use the App in compliance with all applicable
                federal and state laws of the United States.
              </p>
              <p>
                2.3. You may not use the App in any way that could damage,
                disable, overburden, or impair our servers or networks.
              </p>

              <h2 className="text-xl font-semibold">
                3. Privacy & Data Collection
              </h2>
              <p>
                3.1. We collect and process your data in accordance with our
                Privacy Policy and applicable US privacy laws.
              </p>
              <p>
                3.2. We use Google Analytics and similar tools to improve our
                services. These tools collect anonymous usage data to help us
                understand how users interact with our App.
              </p>
              <p>
                3.3. You have the right to request deletion of your data at any
                time through the App settings.
              </p>

              <h2 className="text-xl font-semibold">4. Google Sign-In</h2>
              <p>
                4.1. The App uses Google Sign-In for authentication. By using
                this feature, you agree to Google's Terms of Service.
              </p>
              <p>
                4.2. We only access the information necessary for authentication
                and basic profile information.
              </p>

              <h2 className="text-xl font-semibold">
                5. Intellectual Property
              </h2>
              <p>
                5.1. All content in the App is protected by United States
                copyright laws and is the property of StealthWork LLC.
              </p>
              <p>5.2. The App uses data from various sources, including:</p>
              <ul className="list-disc pl-6">
                <li>Jisho.org</li>
                <li>Other publicly available Japanese language resources</li>
              </ul>

              <h2 className="text-xl font-semibold">6. Disclaimer</h2>
              <p>
                6.1. The App is provided "as is" without any warranties of any
                kind, either express or implied, including but not limited to
                the implied warranties of merchantability and fitness for a
                particular purpose.
              </p>
              <p>
                6.2. The Japanese language content provided is for educational
                purposes only, and we do not guarantee its accuracy or
                completeness.
              </p>

              <h2 className="text-xl font-semibold">7. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance
                with the laws of the United States of America and the State of
                Delaware, without regard to its conflict of law provisions.
              </p>

              <h2 className="text-xl font-semibold">8. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will
                notify users of any material changes via the App or email.
              </p>

              <h2 className="text-xl font-semibold">9. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us
                at:
                <br />
                <a
                  href="mailto:contact@stealthwork.app"
                  className="text-blue-500 hover:underline"
                >
                  contact@stealthwork.app
                </a>
              </p>
            </section>
          </div>
        </Card>
      </div>
    </main>
  );
}

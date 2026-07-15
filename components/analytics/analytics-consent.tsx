"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  analyticsConsentChangedEvent,
  gaMeasurementId,
  getStoredAnalyticsConsent,
  setStoredAnalyticsConsent,
  trackPageView,
  type AnalyticsConsent,
} from "@/lib/analytics";
import { Button } from "@/components/ui/button";

const grantedConsent = {
  analytics_storage: "granted",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

const deniedConsent = {
  analytics_storage: "denied",
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
};

export function AnalyticsConsent() {
  const pathname = usePathname();
  const [consent, setConsent] = useState<AnalyticsConsent | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [isManaging, setIsManaging] = useState(false);

  useEffect(() => {
    if (!gaMeasurementId) {
      setIsReady(true);
      return;
    }

    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      // Google Tag's loader processes the queued `arguments` object used by the official snippet.
      function gtag() {
        // eslint-disable-next-line prefer-rest-params
        window.dataLayer?.push(arguments);
      };

    window.gtag("consent", "default", {
      ...deniedConsent,
      wait_for_update: 500,
    });

    const storedConsent = getStoredAnalyticsConsent();
    setConsent(storedConsent);

    if (storedConsent === "accepted") {
      window.gtag("consent", "update", grantedConsent);
    }

    setIsReady(true);
  }, []);

  useEffect(() => {
    function handleConsentChange(event: Event) {
      const detail = (event as CustomEvent<AnalyticsConsent>).detail;
      setConsent(detail);

      if (typeof window !== "undefined" && window.gtag) {
        window.gtag(
          "consent",
          "update",
          detail === "accepted" ? grantedConsent : deniedConsent,
        );
      }
    }

    window.addEventListener(analyticsConsentChangedEvent, handleConsentChange);
    return () => {
      window.removeEventListener(
        analyticsConsentChangedEvent,
        handleConsentChange,
      );
    };
  }, []);

  useEffect(() => {
    if (consent === "accepted" && isScriptLoaded) {
      trackPageView(pathname);
    }
  }, [consent, isScriptLoaded, pathname]);

  useEffect(() => {
    if (consent !== "accepted" || !gaMeasurementId || !window.gtag) {
      return;
    }

    window.gtag("js", new Date());
    window.gtag("config", gaMeasurementId, {
      send_page_view: false,
    });
  }, [consent]);

  if (!gaMeasurementId || !isReady) {
    return null;
  }

  const shouldLoadAnalytics = consent === "accepted";
  const shouldShowBanner = consent === null || isManaging;

  return (
    <>
      {shouldLoadAnalytics ? (
        <Script
          id="liftpdf-ga4"
          src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
          strategy="afterInteractive"
          onLoad={() => {
            setIsScriptLoaded(true);
          }}
        />
      ) : null}

      {shouldShowBanner ? (
        <section
          aria-label="Analytics consent"
          className="fixed inset-x-3 bottom-3 z-[70] mx-auto max-w-3xl rounded-2xl border border-border bg-background p-4 shadow-2xl sm:bottom-5 sm:p-5"
        >
          <div className="grid gap-4 sm:grid-cols-[1fr_auto] sm:items-center">
            <div>
              <h2 className="text-base font-bold text-foreground">
                Analytics preferences
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                LiftPDF uses Google Analytics only if you accept it. Analytics
                helps measure page visits and tool actions; it never sends file
                names, document content or passwords.
              </p>
              <div className="mt-2 flex flex-wrap gap-3 text-sm font-semibold">
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy
                </Link>
                <Link href="/cookies" className="text-primary hover:underline">
                  Cookies
                </Link>
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:min-w-44">
              <Button
                type="button"
                onClick={() => {
                  setStoredAnalyticsConsent("accepted");
                  setIsManaging(false);
                }}
              >
                Accept analytics
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setStoredAnalyticsConsent("rejected");
                  setIsManaging(false);
                }}
              >
                Reject analytics
              </Button>
            </div>
          </div>
        </section>
      ) : (
        <button
          type="button"
          onClick={() => setIsManaging(true)}
          className="fixed bottom-3 left-3 z-[60] rounded-full border border-border bg-background px-3 py-2 text-xs font-semibold text-muted-foreground shadow-sm transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Analytics preferences
        </button>
      )}
    </>
  );
}

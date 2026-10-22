'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { GA_MEASUREMENT_ID, pageview } from '@/lib/analytics';

function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (pathname) {
      const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
      pageview(url);
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GoogleAnalytics() {
  return (
    <>
      {/* Google Analytics Script */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
              cookie_flags: 'SameSite=None;Secure',
            });

            // Enhanced measurement - Scroll tracking
            let maxScroll = 0;
            const scrollThresholds = [25, 50, 75, 90, 100];
            const trackedThresholds = new Set();

            window.addEventListener('scroll', function() {
              const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
              );

              if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                scrollThresholds.forEach(threshold => {
                  if (scrollPercent >= threshold && !trackedThresholds.has(threshold)) {
                    trackedThresholds.add(threshold);
                    gtag('event', 'scroll_depth', {
                      event_category: 'Engagement',
                      event_label: threshold + '%',
                      value: threshold,
                      non_interaction: true
                    });
                  }
                });
              }
            });

            // Track time on page
            let startTime = Date.now();
            const timeThresholds = [30, 60, 120, 300]; // seconds
            const trackedTimeThresholds = new Set();

            setInterval(function() {
              const timeOnPage = Math.floor((Date.now() - startTime) / 1000);

              timeThresholds.forEach(threshold => {
                if (timeOnPage >= threshold && !trackedTimeThresholds.has(threshold)) {
                  trackedTimeThresholds.add(threshold);
                  gtag('event', 'time_on_page', {
                    event_category: 'Engagement',
                    event_label: threshold + ' seconds',
                    value: threshold,
                    non_interaction: true
                  });
                }
              });
            }, 5000);

            // Track outbound links
            document.addEventListener('click', function(e) {
              const link = e.target.closest('a');
              if (link && link.hostname !== window.location.hostname) {
                gtag('event', 'outbound_link', {
                  event_category: 'Outbound',
                  event_label: link.href,
                  transport_type: 'beacon'
                });
              }
            });
          `,
        }}
      />
      <Suspense fallback={null}>
        <AnalyticsTracker />
      </Suspense>
    </>
  );
}

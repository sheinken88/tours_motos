import Script from "next/script";

function validGtmId(value: string | undefined): string | undefined {
  return value && /^GTM-[A-Z0-9]+$/.test(value) ? value : undefined;
}

function validGaId(value: string | undefined): string | undefined {
  return value && /^G-[A-Z0-9]+$/.test(value) ? value : undefined;
}

function validMetaPixelId(value: string | undefined): string | undefined {
  return value && /^\d+$/.test(value) ? value : undefined;
}

/**
 * Loads each analytics platform exactly once from public environment IDs.
 *
 * GA4 and Meta are initialized directly by the app. GTM receives the
 * `moto_*` dataLayer events but must not also install the GA4 or Meta base
 * tags, otherwise those providers would be initialized twice.
 */
export function AnalyticsScripts() {
  const gtmId = validGtmId(process.env.NEXT_PUBLIC_GTM_ID);
  const gaId = validGaId(process.env.NEXT_PUBLIC_GA_ID);
  const metaPixelId = validMetaPixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID);

  return (
    <>
      {gtmId ? (
        <>
          <Script id="moto-gtm" strategy="afterInteractive">
            {`
              if (!window.__motoGtmInitialized) {
                window.__motoGtmInitialized = true;
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${gtmId}');
              }
            `}
          </Script>
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${gtmId}`}
              height="0"
              width="0"
              title="Google Tag Manager"
              className="hidden"
            />
          </noscript>
        </>
      ) : null}

      {gaId ? (
        <>
          <Script
            id="moto-ga4-library"
            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            strategy="afterInteractive"
          />
          <Script id="moto-ga4" strategy="afterInteractive">
            {`
              window.dataLayer = window.dataLayer || [];
              window.gtag = window.gtag || function(){window.dataLayer.push(arguments);};
              if (!window.__motoGaInitialized) {
                window.__motoGaInitialized = true;
                window.gtag('js', new Date());
                window.gtag('config', '${gaId}', { send_page_view: false });
              }
            `}
          </Script>
        </>
      ) : null}

      {metaPixelId ? (
        <>
          <Script id="moto-meta-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              if (!window.__motoMetaInitialized) {
                window.__motoMetaInitialized = true;
                window.fbq('init', '${metaPixelId}');
              }
            `}
          </Script>
          <noscript>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              height="1"
              width="1"
              className="hidden"
              alt=""
              src={`https://www.facebook.com/tr?id=${metaPixelId}&ev=PageView&noscript=1`}
            />
          </noscript>
        </>
      ) : null}
    </>
  );
}

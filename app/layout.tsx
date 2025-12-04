import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { AppProvider } from "@/contexts/AppContext";
import { ManagerProvider } from "@/contexts/ManagerContext";
import { LivePreviewProvider } from "@/contexts/LivePreviewContext";
import { Toaster } from 'sonner';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillStream: QA Onboarding DXP",
  description: "Personalized QA onboarding experience powered by Contentstack",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Lytics Tracking Tag Version 3 */}
        <Script
          id="lytics-jstag"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(){"use strict";var o=window.jstag||(window.jstag={}),r=[];function n(e){o[e]=function(){for(var n=arguments.length,t=new Array(n),i=0;i<n;i++)t[i]=arguments[i];r.push([e,t])}}n("send"),n("mock"),n("identify"),n("pageView"),n("unblock"),n("getid"),n("setid"),n("loadEntity"),n("getEntity"),n("on"),n("once"),n("call"),o.loadScript=function(n,t,i){var e=document.createElement("script");e.async=!0,e.src=n,e.onload=t,e.onerror=i;var o=document.getElementsByTagName("script")[0],r=o&&o.parentNode||document.head||document.body,c=o||r.lastChild;return null!=c?r.insertBefore(e,c):r.appendChild(e),this},o.init=function n(t){return this.config=t,this.loadScript(t.src,function(){if(o.init===n)throw new Error("Load error!");o.init(o.config),function(){for(var n=0;n<r.length;n++){var t=r[n][0],i=r[n][1];o[t].apply(o,i)}r=void 0}()}),this}}();
              
              // Initialize Lytics tracking tag
              jstag.init({
                src: 'https://c.lytics.io/api/tag/a9a2ff2aa98210bbdfba8b7bcbb661db/latest.min.js'
              });
              
              // Send page view
              jstag.pageView();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <LivePreviewProvider>
          <ManagerProvider>
            <AppProvider>
              {children}
              <Toaster position="top-right" richColors />
            </AppProvider>
          </ManagerProvider>
        </LivePreviewProvider>
      </body>
    </html>
  );
}


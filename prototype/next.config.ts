import type { NextConfig } from "next";

/**
 * URL compatibility with the live site (panamericanceramics.org).
 *
 * The prototype reorganises the same material: the live site's nine browse
 * sections are tabs on one Browse page, and its five Resources pages are
 * sections of one Resources page. Without these, every link and bookmark
 * carried over from the live site lands on a 404.
 */
const LIVE_SITE_REDIRECTS: Array<[string, string]> = [
  // Browse sections → the Browse page's tabs
  ["/sites", "/browse"],
  ["/wares", "/browse"],
  ["/ceramic_types", "/browse"],
  ["/petrofabrics", "/browse"],
  ["/vessels", "/browse"],
  ["/petrographics", "/browse"],
  ["/kilns", "/browse"],
  ["/references", "/browse"],
  ["/contributors", "/browse"],
  // Resources sections → anchors on the Resources page
  ["/instructions", "/resources#instructions"],
  ["/glossary", "/resources#glossary"],
  ["/maps", "/resources#countries-regions"],
  ["/periods", "/resources#periods"],
  ["/instructional_videos", "/resources#videos"],
  // Renamed or relocated
  ["/land_acknowledgement", "/land-acknowledgement"],
  ["/forms/v2", "/submit"],
  ["/users/sign_in", "/signin"],
  ["/users/sign_up", "/onboarding"],
  ["/users/password/new", "/reset-password"],
];

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // The report-upload feature moved under Submit, beside /submit/vessel.
      { source: "/upload", destination: "/submit/report", permanent: false },

      ...LIVE_SITE_REDIRECTS.flatMap(([source, destination]) => [
        { source, destination, permanent: false },
        // Deep links such as /sites/1-la-quemada land on the same page.
        { source: `${source}/:path*`, destination, permanent: false },
      ]),
    ];
  },
};

export default nextConfig;

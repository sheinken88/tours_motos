import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");
const withMDX = createMDX({
  extension: /\.mdx?$/,
});

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  devIndicators: false,
  async redirects() {
    return [
      {
        source: "/es/tours/sobre-las-nubes",
        destination: "/es/tours/tour-moto-salta-jujuy",
        permanent: true,
      },
      {
        source: "/en/tours/sobre-las-nubes",
        destination: "/en/tours/motorcycle-tour-salta-jujuy",
        permanent: true,
      },
      {
        source: "/pt/tours/sobre-las-nubes",
        destination: "/pt/tours/tour-de-moto-salta-jujuy",
        permanent: true,
      },
      {
        source: "/es/tours/volcanes-del-norte",
        destination: "/es/tours/tour-moto-catamarca",
        permanent: true,
      },
      {
        source: "/en/tours/volcanes-del-norte",
        destination: "/en/tours/motorcycle-tour-catamarca",
        permanent: true,
      },
      {
        source: "/pt/tours/volcanes-del-norte",
        destination: "/pt/tours/tour-de-moto-catamarca",
        permanent: true,
      },
      {
        source: "/es/tours/gigantes-del-oeste",
        destination: "/es/tours/tour-moto-mendoza-la-rioja",
        permanent: true,
      },
      {
        source: "/en/tours/gigantes-del-oeste",
        destination: "/en/tours/motorcycle-tour-mendoza-la-rioja",
        permanent: true,
      },
      {
        source: "/pt/tours/gigantes-del-oeste",
        destination: "/pt/tours/tour-de-moto-mendoza-la-rioja",
        permanent: true,
      },
      {
        source: "/es/tours/cruces-del-sur",
        destination: "/es/tours/tour-moto-carretera-austral",
        permanent: true,
      },
      {
        source: "/en/tours/cruces-del-sur",
        destination: "/en/tours/motorcycle-tour-carretera-austral",
        permanent: true,
      },
      {
        source: "/pt/tours/cruces-del-sur",
        destination: "/pt/tours/tour-de-moto-carretera-austral",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(withMDX(nextConfig));

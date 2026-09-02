import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants/site";

// lastModified は入れない。ビルド時刻を入れると、中身が変わっていない日も
// 更新されたと申告することになる
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${SITE.url}/`,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE.url}/compare`,
      changeFrequency: "daily",
      priority: 0.8,
    },
  ];
}

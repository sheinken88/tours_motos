import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

/**
 * Locale-aware navigation primitives. Use these in place of next/link
 * and next/navigation in components that render inside a [locale] route.
 *
 *   import { Link, useRouter, usePathname, redirect } from "@/lib/i18n/navigation";
 *
 * They auto-prefix the current locale so consumers don't thread it manually.
 */
export const { Link, redirect, usePathname, useRouter, getPathname } = createNavigation(routing);

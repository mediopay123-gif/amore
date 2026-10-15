import { City, Category } from '../types';

export interface RouteParams {
  citySlug?: string;
  categorySlug?: string;
}

/**
 * Parses current window.location.pathname
 * Supports URLs like:
 * /
 * /it/
 * /it/:city
 * /it/:city/:category
 */
export function parseCurrentUrl(): RouteParams {
  const path = window.location.pathname.toLowerCase();
  const segments = path.split('/').filter(Boolean);

  // If path starts with 'it'
  if (segments[0] === 'it') {
    const citySlug = segments[1] || undefined;
    const categorySlug = segments[2] || undefined;
    return { citySlug, categorySlug };
  }

  return {};
}

/**
 * Generates an SEO friendly URL
 */
export function buildSeoUrl(city: City, category?: Category | null): string {
  const citySlug = city.slug;
  if (!category || category.id === 'all') {
    return `/it/${citySlug}`;
  }
  return `/it/${citySlug}/${category.slug}`;
}

/**
 * Updates URL in browser without page reload
 */
export function updateBrowserUrl(city: City, category?: Category | null) {
  const newUrl = buildSeoUrl(city, category);
  if (window.location.pathname !== newUrl) {
    window.history.pushState({ city: city.id, category: category?.id }, '', newUrl);
  }
}

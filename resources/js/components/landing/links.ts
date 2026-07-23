/**
 * Centralized external destinations for the landing page.
 * Update these constants once real URLs are available.
 */

export const EYAD_SITE_URL = 'https://eyadcs.dev';

// TODO: Replace with the real GitHub repository URL once it is published.
export const GITHUB_REPO_URL = '#';

// TODO: Point to the repository's contribution guide (e.g. CONTRIBUTING.md).
export const CONTRIBUTING_GUIDE_URL = GITHUB_REPO_URL;

// TODO: Point to the repository's "new issue" page for tool suggestions.
export const SUGGEST_TOOL_URL = GITHUB_REPO_URL;

export const KASHF_JAHIZ_URL = '/tools/kashf-jahiz';

export const NAV_ITEMS = [
    { label: 'الرئيسية', href: '#home' },
    { label: 'الأدوات', href: '#tools' },
    { label: 'عن المشروع', href: '#about' },
    { label: 'المساهمة', href: '#contribute' },
] as const;

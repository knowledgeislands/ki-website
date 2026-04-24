import { readFileSync } from 'fs';
import { execSync } from 'child_process';
import { dirname, relative, resolve, sep } from 'path';
import type { UserConfig } from '@11ty/eleventy';
import JSON5 from 'json5';

// ─── Eleventy config ──────────────────────────────────────────────────────────

export default function(eleventyConfig: UserConfig) {
  const outputRoot = resolve(process.cwd(), 'dist');

  // ── Relative URL helper ──────────────────────────────────────────────────
  // Converts absolute internal URLs to relative paths from the current output
  // file. This makes the dist/ folder fully portable (no assumed root).
  const toRelativeOutputUrl = (url: string, outputPath: string): string => {
    if (!url.startsWith('/')) return url;
    if (url.startsWith('//')) return url;

    // Make internal page URLs explicit to avoid directory-index assumptions.
    let normalized = url;
    if (normalized === '/') normalized = '/index.html';
    else if (normalized.endsWith('/')) normalized = `${normalized}index.html`;

    const fromDir = dirname(outputPath);
    const targetPath = resolve(outputRoot, `.${normalized}`);
    const rel = relative(fromDir, targetPath).split(sep).join('/');
    return rel || './';
  };

  // ── Passthrough copies ───────────────────────────────────────────────────
  // Add any static asset directories that should be copied verbatim to dist.
  eleventyConfig.addPassthroughCopy('src/assets/images');
  eleventyConfig.addPassthroughCopy('src/assets/js');
  // Vendor Lucide UMD bundle from node_modules so we don't depend on a CDN in production.
  eleventyConfig.addPassthroughCopy({ 'node_modules/lucide/dist/umd/lucide.min.js': 'assets/js/lucide.min.js' });

  // ── Transform: inject external-link icons ────────────────────────────────
  // Adds a Lucide external-link icon to any prose <a href="https://..."> link.
  // Skips links already inside named component classes (add your own classes
  // to the exclusion pattern below to protect icon-managed components).
  eleventyConfig.addTransform('external-link-icons', (content: string, outputPath: string | undefined) => {
    if (!outputPath?.endsWith('.html')) return content;
    return content.replace(
      /<a\s+([^>]*href="https?:\/\/[^"]*"[^>]*)>([\s\S]*?)<\/a>/gi,
      (match, attrs: string, inner: string) => {
        // Add class names here to prevent icon injection inside specific components:
        if (/class="[^"]*(?:home-nav-card|tool-card)/.test(attrs)) return match;
        if (/data-lucide="external-link"/.test(inner)) return match;
        return `<a ${attrs}>${inner}<i data-lucide="external-link" class="prose-ext-icon"></i></a>`;
      },
    );
  });

  // ── Transform: rewrite absolute links to relative ────────────────────────
  // Ensures href/src attributes pointing at absolute internal paths are
  // rewritten to relative paths, making dist/ portable without a web server.
  eleventyConfig.addTransform('explicit-index-links', (content: string, outputPath: string | undefined) => {
    if (!outputPath?.endsWith('.html')) return content;
    return content.replace(/(\s(?:href|src)=)(["'])([^"']+)(\2)/gi, (_match, prefix: string, quote: string, url: string) => {
      if (/^(?:https?:|mailto:|tel:|javascript:|data:|#)/i.test(url)) return `${prefix}${quote}${url}${quote}`;
      return `${prefix}${quote}${toRelativeOutputUrl(url, outputPath)}${quote}`;
    });
  });

  // ── Tailwind CSS ─────────────────────────────────────────────────────────────
  // In build mode, compile Tailwind as part of the Eleventy lifecycle so the
  // build script only needs to invoke Eleventy once.
  // In serve/watch mode the Tailwind --watch process runs in parallel (see
  // package.json dev script); addWatchTarget ensures the dev server reloads
  // the browser whenever Tailwind writes a new dist/assets/css/main.css.
  eleventyConfig.on('eleventy.before', ({ runMode }: { runMode: string }) => {
    if (runMode !== 'serve' && runMode !== 'watch') {
      execSync(
        'npx tailwindcss -i src/assets/css/main.css -o dist/assets/css/main.css --minify',
        { stdio: 'inherit' },
      );
    }
  });
  // Watch the compiled CSS so the dev server reloads the browser whenever
  // the Tailwind --watch process writes a new dist/assets/css/main.css.
  eleventyConfig.addWatchTarget('./dist/assets/css/main.css');

  // eleventyConfig.addPassthroughCopy('src/assets');
  // Note: image assets embedded as base64 data URIs via _data files (mount restrictions
  // prevent passthrough copy to dist). See src/_data/logoDataUri.ts.

  // ── Data extension: TypeScript ───────────────────────────────────────────
  // Allows .ts files in src/_data/ to be used as global data files.
  // With --import tsx/esm, dynamic import() loads .ts files directly.
  // Mirrors Eleventy's built-in JS handling: calls the export if it's a
  // function (sync or async), otherwise uses the value directly.
  eleventyConfig.addDataExtension('ts', {
    read: false,
    parser: async (filePath: string) => {
      const mod = await import(filePath) as { default: unknown };
      const data = mod.default;
      return typeof data === 'function' ? await (data as () => unknown)() : data;
    },
  });

  // ── Data extension: JSON5 ────────────────────────────────────────────────
  // Allows .json5 files in src/_data/ to be used as global data files.
  // Uses read:false to receive the file path rather than contents, which
  // allows selective exclusion of sub-paths that are aggregated elsewhere
  // (see the comment below — add any such paths here).
  eleventyConfig.addDataExtension('json5', {
    read: false,
    parser: (filePath: string) => {
      // Exclude paths aggregated by a parent data file to prevent double-loading.
      // Example: if (filePath.includes(`${sep}items${sep}records${sep}`)) return {};
      return JSON5.parse(readFileSync(filePath, 'utf-8')) as unknown;
    },
  });

  // ── Filters ──────────────────────────────────────────────────────────────

  // JSON dump — useful for debugging data in templates: {{ myData | jsonDump }}
  eleventyConfig.addFilter('jsonDump', (val: unknown) => JSON.stringify(val));

  // unique — deduplicate an array: {{ tags | unique }}
  eleventyConfig.addFilter('unique', (arr: unknown) => {
    if (!Array.isArray(arr)) return arr;
    return [...new Set(arr)];
  });

  // groupBy — group an array of objects by a key:
  // {% set grouped = items | groupBy("category") %}
  // {% for group in grouped %}{{ group.key }}: {{ group.values | length }}{% endfor %}
  eleventyConfig.addFilter('groupBy', (arr: unknown, key: string) => {
    if (!Array.isArray(arr)) return [];
    const map = new Map<string, unknown[]>();
    for (const item of arr) {
      const k = String((item as Record<string, unknown>)[key] ?? '');
      if (!map.has(k)) map.set(k, []);
      map.get(k)!.push(item);
    }
    return [...map.entries()].map(([k, values]) => ({ key: k, values }));
  });

  // ── Collections ──────────────────────────────────────────────────────────
  // Add collections here as new sections are built out.
  // Standard pattern: tag pages with e.g. `tags: blog` (via front matter or
  // a directory data file) and access them as `collections.blog` in templates.

  // ── Project-specific shortcodes ──────────────────────────────────────────
  // Add domain-specific shortcodes here. Example pattern:
  //
  // const myTermData = JSON5.parse(readFileSync('src/_data/myTerms.json5', 'utf-8'))
  //   as Array<{ id: string; name: string; description: string }>;
  // const myTermMap = new Map(myTermData.map(t => [t.name.toLowerCase(), t]));
  //
  // eleventyConfig.addShortcode('term', (name: string) => {
  //   const entry = myTermMap.get(name.toLowerCase());
  //   if (!entry) return name;
  //   return `<abbr title="${entry.description}" class="term">${entry.name}</abbr>`;
  // });

  // ── Return the config ──────────────────────────────────────────────────────────────

  return {
    dir: {
      input: 'src',
      output: 'dist',
      includes: '_includes',
      data: '_data',
    },
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    templateFormats: ['njk', 'md', 'html'],
  };
};

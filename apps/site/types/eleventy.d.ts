// @11ty/eleventy ships no type declarations; this ambient module keeps `tsc`
// happy for the config's `import type { UserConfig }` without pulling in a
// heavyweight community typings package.
declare module '@11ty/eleventy' {
  export type UserConfig = any
}

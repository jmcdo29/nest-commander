export const SITE = {
  title: 'Nest-Commander',
  description: 'Using NestJS as a CLI builder',
  defaultLanguage: 'en_US',
};

export const OPEN_GRAPH = {
  image: {
    src: 'https://repository-images.githubusercontent.com/328917508/8aed1c58-81dc-4561-9c52-14924e2dfb08',
    alt: 'nest-commander logo, the NestJS cat on top of a right facing arrow with an underscore under the cat',
  },
  twitter: 'jmcdo29',
};

// This is the type of the frontmatter you put in the docs markdown files.
export type Frontmatter = {
  title: string;
  description: string;
  layout: string;
  image?: { src: string; alt: string };
  dir?: 'ltr' | 'rtl';
  ogLocale?: string;
  lang?: string;
};

export const KNOWN_LANGUAGES = {
  English: 'en',
} as const;
export const KNOWN_LANGUAGE_CODES = Object.values(KNOWN_LANGUAGES);

export const GITHUB_EDIT_URL = `https://github.com/jmcdo29/nest-commander/tree/main/apps/docs`;

export const COMMUNITY_INVITE_URL = `https://discord.gg/6byqVsXzaF`;

export const GITHUB_DISCUSSIONS_URL = `https://github.com/jmcdo29/nest-commander/discussions`;

// See "Algolia" section of the README for more information.
export const ALGOLIA = {
  indexName: 'nest-commander',
  appId: '9O0K4CXI15',
  apiKey: '9689faf6550ca3133e69be1d9861ea92',
};

export type Sidebar = Record<
  (typeof KNOWN_LANGUAGE_CODES)[number],
  Record<string, { text: string; link: string }[]>
>;
export const SIDEBAR: Sidebar = {
  en: {
    Introduction: [
      { text: 'Why nest-commander?', link: 'en/introduction/intro' },
      {
        text: 'Installation',
        link: 'en/introduction/installation',
      },
    ],
    Features: [
      {
        text: 'Commander',
        link: 'en/features/commander',
      },
      {
        text: 'Inquirer',
        link: 'en/features/inquirer',
      },
      {
        text: 'Command Factory',
        link: 'en/features/factory',
      },
      {
        text: 'Completion',
        link: 'en/features/completion',
      },
      {
        text: 'Plugins',
        link: 'en/features/plugins',
      },
      {
        text: 'Utility Service',
        link: 'en/features/utility',
      },
    ],
    Testing: [
      {
        text: 'Installation',
        link: 'en/testing/installation',
      },
      {
        text: 'TestFactory',
        link: 'en/testing/factory',
      },
    ],
    Schematics: [
      {
        text: 'Installation',
        link: 'en/schematics/installation',
      },
      {
        text: 'Usage',
        link: 'en/schematics/usage',
      },
    ],
    'Execution and Publishing': [
      {
        text: 'Overview',
        link: 'en/execution',
      },
    ],
    API: [
      {
        text: 'Overview',
        link: 'en/api',
      },
    ],
  },
};

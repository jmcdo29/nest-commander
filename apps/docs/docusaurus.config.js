module.exports = {
  title: 'Nest Commander',
  tagline: 'A CLI builder using NestJS',
  url: 'https://nest-commander.jaymcdoniel.dev/',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'jmcdo29',
  projectName: 'nest-commander',
  trailingSlash: true,
  themeConfig: {
    colorMode: {
      defaultMode: 'dark',
    },
    navbar: {
      title: 'Nest Commander',
      logo: {
        alt: 'Nest Commander Logo',
        src: 'img/nest-commander-final.svg',
      },
      items: [
        {
          to: 'docs/',
          activeBasePath: 'docs',
          label: 'Docs',
          position: 'left',
        },
        {
          href: 'https://github.com/jmcdo29/nest-commander',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Development',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/jmcdo29/nest-commander',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Jay McDoniel Built with Docusaurus.`,
    },
    algolia: {
      appId: '9O0K4CXI15',
      apiKey: '9689faf6550ca3133e69be1d9861ea92',
      indexName: 'nest-commander',
      contextualSearch: true,
      searchParameters: {},
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          editUrl: 'https://github.com/jmcdo29/nest-commander/edit/main/apps/docs/',
          sidebarPath: require.resolve('./sidebars.js'),
          showLastUpdateAuthor: true,
          showLastUpdateTime: true,
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

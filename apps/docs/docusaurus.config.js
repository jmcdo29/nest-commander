module.exports = {
  title: 'Nest Commander',
  tagline: 'A CLI builder using NestJS',
  url: 'https://jmcdo29.github.io',
  baseUrl: '/nest-commander/',
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
      apiKey: '16818e5b1b367f97719b6ba809e235e9',
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

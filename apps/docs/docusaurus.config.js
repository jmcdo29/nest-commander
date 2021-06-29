module.exports = {
  title: 'Nest Commander',
  tagline: 'A CLI builder using NestJS',
  url: 'https://jmcdo29.github.io',
  baseUrl: '/nestjs-commander/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',
  organizationName: 'jmcdo29', // Usually your GitHub org/user name.
  projectName: 'nestjs-commander', // Usually your repo name.
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
          href: 'https://github.com/jmcdo29/nestjs-commander',
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
              href: 'https://github.com/jmcdo29/nestjs-commander',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Nest Commander Built with Docusaurus.`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/jmcdo29/nestjs-commander/edit/main/apps/docs/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};

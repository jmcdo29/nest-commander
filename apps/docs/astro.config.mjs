import { defineConfig } from 'astro/config';
import preact from '@astrojs/preact';
import react from '@astrojs/react';
import { h } from 'hastscript';
import directive from 'remark-directive';
import { visit } from 'unist-util-visit';

const acceptableCalloutTypes = {
  note: { cssClass: '', iconClass: 'comment-alt-lines' },
  tip: { cssClass: 'is-success', iconClass: 'lightbulb' },
  info: { cssClass: 'is-info', iconClass: 'info-circle' },
  warning: { cssClass: 'is-warning', iconClass: 'exclamation-triangle' },
  danger: { cssClass: 'is-danger', iconClass: 'siren-on' },
};

/**
 * Plugin to generate callout blocks.
 */
function calloutsPlugin() {
  return (tree) => {
    visit(tree, (node) => {
      if (
        node.type === 'textDirective' ||
        node.type === 'leafDirective' ||
        node.type === 'containerDirective'
      ) {
        if (!Object.keys(acceptableCalloutTypes).includes(node.name)) {
          return;
        }

        const boxInfo = acceptableCalloutTypes[node.name];

        // Adding CSS classes according to the type.
        const data = node.data || (node.data = {});
        const tagName = node.type === 'textDirective' ? 'span' : 'div';
        data.hName = tagName;
        data.hProperties = h(tagName, {
          class: `message ${boxInfo.cssClass}`,
        }).properties;

        // Creating the icon.
        const icon = h('i');
        const iconData = icon.data || (icon.data = {});
        iconData.hName = 'i';
        iconData.hProperties = h('i', {
          class: `far fa-${boxInfo.iconClass} md-callout-icon`,
        }).properties;

        // Creating the icon's column.
        const iconWrapper = h('div');
        const iconWrapperData = iconWrapper.data || (iconWrapper.data = {});
        iconWrapperData.hName = 'div';
        iconWrapperData.hProperties = h('div', {
          class: 'column is-narrow',
        }).properties;
        iconWrapper.children = [icon];

        // Creating the content's column.
        const contentColWrapper = h('div');
        const contentColWrapperData = contentColWrapper.data || (contentColWrapper.data = {});
        contentColWrapperData.hName = 'div';
        contentColWrapperData.hProperties = h('div', {
          class: 'column',
        }).properties;
        contentColWrapper.children = [...node.children]; // Adding markdown's content block.

        // Creating the column's wrapper.
        const columnsWrapper = h('div');
        const columnsWrapperData = columnsWrapper.data || (columnsWrapper.data = {});
        columnsWrapperData.hName = 'div';
        columnsWrapperData.hProperties = h('div', {
          class: 'columns',
        }).properties;
        columnsWrapper.children = [iconWrapper, contentColWrapper];

        // Creating the wrapper for the callout's content.
        const contentWrapper = h('div');
        const wrapperData = contentWrapper.data || (contentWrapper.data = {});
        wrapperData.hName = 'div';
        wrapperData.hProperties = h('div', {
          class: 'message-body',
        }).properties;
        contentWrapper.children = [columnsWrapper];
        node.children = [contentWrapper];
      }
    });
  };
}

// https://astro.build/config
export default defineConfig({
  outDir: '../../dist/apps/docs',
  site: 'https://nest-commander.jaymcdoniel.dev',
  integrations: [
    // Enable Preact to support Preact JSX components.
    preact(),
    // Enable React for the Algolia search component.
    react(),
  ],
  markdown: {
    extendDefaultPlugins: true,
    remarkPlugins: [directive, calloutsPlugin],
  },
  site: `http://astro.build`,
});

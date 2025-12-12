import type { DocsThemeConfig } from 'nextra-theme-docs';
import React from 'react';

const config: DocsThemeConfig = {
  logo: <span>Next.js, Nextra, shadcn/ui Turborepo starter template</span>,
  project: {
    link: 'https://github.com/fapiper/krono',
  },
  chat: {
    link: 'https://discord.com',
  },
  docsRepositoryBase: 'https://github.com/shuding/nextra-docs-template',
  footer: {
    content: (
      <span>
        MIT {new Date().getFullYear()} - ©{' '}
        <a
          href="https://github.com/fapiper/krono"
          target="_blank"
          rel="noreferrer"
        >
          turborepo-next-shadcn-ui
        </a>{' '}
        .
      </span>
    ),
  },
};

export default config;

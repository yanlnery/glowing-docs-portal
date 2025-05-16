
import React from 'react';

export interface SidebarLinkDef {
  title: string;
  href: string;
  icon?: React.ReactNode;
  children?: SidebarLinkDef[];
  isExternal?: boolean;
}

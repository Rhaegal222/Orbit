import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'button',
    pathMatch: 'full',
  },
  {
    path: 'button',
    loadComponent: () =>
      import('./pages/button-page/button-page.component').then((m) => m.ButtonPageComponent),
  },
  {
    path: 'badge',
    loadComponent: () =>
      import('./pages/badge-page/badge-page.component').then((m) => m.BadgePageComponent),
  },
  {
    path: 'form-grid',
    redirectTo: 'layout',
    pathMatch: 'full',
  },
  {
    path: 'layout',
    loadComponent: () =>
      import('./pages/layout-page/layout-page.component').then((m) => m.LayoutPageComponent),
  },
  {
    path: 'form-field',
    loadComponent: () =>
      import('./pages/form-field-page/form-field-page.component').then(
        (m) => m.FormFieldPageComponent,
      ),
  },
  {
    path: 'form-section',
    loadComponent: () =>
      import('./pages/form-section-page/form-section-page.component').then(
        (m) => m.FormSectionPageComponent,
      ),
  },
  {
    path: 'text-input',
    loadComponent: () =>
      import('./pages/text-input-page/text-input-page.component').then(
        (m) => m.TextInputPageComponent,
      ),
  },
  {
    path: 'select',
    loadComponent: () =>
      import('./pages/select-page/select-page.component').then((m) => m.SelectPageComponent),
  },
  {
    path: 'checkbox',
    loadComponent: () =>
      import('./pages/checkbox-page/checkbox-page.component').then((m) => m.CheckboxPageComponent),
  },
  {
    path: 'pill-switch',
    loadComponent: () =>
      import('./pages/pill-switch-page/pill-switch-page.component').then(
        (m) => m.PillSwitchPageComponent,
      ),
  },
  {
    path: 'operational-modal',
    loadComponent: () =>
      import('./pages/operational-modal-page/operational-modal-page.component').then(
        (m) => m.OperationalModalPageComponent,
      ),
  },
  {
    path: 'attachments',
    loadComponent: () =>
      import('./pages/attachment-page/attachment-page.component').then(
        (m) => m.AttachmentPageComponent,
      ),
  },
  {
    path: 'pickers',
    loadComponent: () =>
      import('./pages/pickers-page/pickers-page.component').then((m) => m.PickersPageComponent),
  },
  {
    path: 'motion',
    loadComponent: () =>
      import('./pages/motion-page/motion-page.component').then((m) => m.MotionPageComponent),
  },
  {
    path: 'dialog',
    loadComponent: () =>
      import('./pages/dialog-page/dialog-page.component').then((m) => m.DialogPageComponent),
  },
  {
    path: 'popover',
    loadComponent: () =>
      import('./pages/popover-page/popover-page.component').then((m) => m.PopoverPageComponent),
  },
  {
    path: 'tooltip',
    loadComponent: () =>
      import('./pages/tooltip-page/tooltip-page.component').then((m) => m.TooltipPageComponent),
  },
  {
    path: 'panel',
    loadComponent: () =>
      import('./pages/panel-page/panel-page.component').then((m) => m.PanelPageComponent),
  },
  {
    path: 'navbar',
    loadComponent: () =>
      import('./pages/navbar-page/navbar-page.component').then((m) => m.NavbarPageComponent),
  },
  {
    path: 'sidebar',
    loadComponent: () =>
      import('./pages/sidebar-page/sidebar-page.component').then((m) => m.SidebarPageComponent),
  },
  {
    path: 'tab',
    loadComponent: () =>
      import('./pages/tab-page/tab-page.component').then((m) => m.TabPageComponent),
  },
  {
    path: 'table',
    loadComponent: () =>
      import('./pages/table-page/table-page.component').then((m) => m.TablePageComponent),
  },
  {
    path: 'typography',
    loadComponent: () =>
      import('./pages/typography-page/typography-page.component').then(
        (m) => m.TypographyPageComponent,
      ),
  },
  {
    path: 'themes',
    loadComponent: () =>
      import('./pages/themes-page/themes-page.component').then((m) => m.ThemesPageComponent),
  },
  {
    path: 'patterns',
    loadComponent: () =>
      import('./pages/patterns-page/patterns-page.component').then((m) => m.PatternsPageComponent),
  },
];

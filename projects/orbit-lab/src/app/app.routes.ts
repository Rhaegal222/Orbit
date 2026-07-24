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
    path: 'alert',
    loadComponent: () =>
      import('./pages/alert-page/alert-page.component').then((m) => m.AlertPageComponent),
  },
  {
    path: 'avatar',
    loadComponent: () =>
      import('./pages/avatar-page/avatar-page.component').then((m) => m.AvatarPageComponent),
  },
  {
    path: 'chip',
    loadComponent: () =>
      import('./pages/chip-page/chip-page.component').then((m) => m.ChipPageComponent),
  },
  {
    path: 'breadcrumb',
    loadComponent: () =>
      import('./pages/breadcrumb-page/breadcrumb-page.component').then(
        (m) => m.BreadcrumbPageComponent,
      ),
  },
  {
    path: 'pagination',
    loadComponent: () =>
      import('./pages/pagination-page/pagination-page.component').then(
        (m) => m.PaginationPageComponent,
      ),
  },
  {
    path: 'accordion',
    loadComponent: () =>
      import('./pages/accordion-page/accordion-page.component').then(
        (m) => m.AccordionPageComponent,
      ),
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
    path: 'skeleton',
    loadComponent: () =>
      import('./pages/skeleton-page/skeleton-page.component').then((m) => m.SkeletonPageComponent),
  },
  {
    path: 'slider',
    loadComponent: () =>
      import('./pages/slider-page/slider-page.component').then((m) => m.SliderPageComponent),
  },
  {
    path: 'progress-bar',
    loadComponent: () =>
      import('./pages/progress-bar-page/progress-bar-page.component').then(
        (m) => m.ProgressBarPageComponent,
      ),
  },
  {
    path: 'spinner',
    loadComponent: () =>
      import('./pages/spinner-page/spinner-page.component').then((m) => m.SpinnerPageComponent),
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
    // Legacy technical route retained for existing bookmarks.
    path: 'operational-modal',
    redirectTo: 'examples',
    pathMatch: 'full',
  },
  {
    path: 'examples',
    loadComponent: () =>
      import('./pages/examples-page/examples-page.component').then(
        ({ ExamplesPageComponent }) => ExamplesPageComponent,
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
    path: 'motion',
    loadComponent: () =>
      import('./pages/motion-page/motion-page.component').then((m) => m.MotionPageComponent),
  },
  {
    path: 'date-picker',
    loadComponent: () =>
      import('./pages/pickers-page/pickers-page.component').then((m) => m.DatePickerPageComponent),
  },
  {
    path: 'time-picker',
    loadComponent: () =>
      import('./pages/time-picker-page/time-picker-page.component').then(
        (m) => m.TimePickerPageComponent,
      ),
  },
  {
    path: 'pickers',
    redirectTo: 'date-picker',
    pathMatch: 'full',
  },
  {
    path: 'tags-badges',
    loadComponent: () =>
      import('./pages/badge-page/badge-page.component').then((m) => m.BadgePageComponent),
  },
  {
    path: 'badge',
    redirectTo: 'tags-badges',
    pathMatch: 'full',
  },
  {
    path: 'chip',
    redirectTo: 'tags-badges',
    pathMatch: 'full',
  },
  {
    path: 'feedback',
    loadComponent: () =>
      import('./pages/banner-page/banner-page.component').then((m) => m.BannerPageComponent),
  },
  {
    path: 'alert',
    redirectTo: 'feedback',
    pathMatch: 'full',
  },
  {
    path: 'banner',
    redirectTo: 'feedback',
    pathMatch: 'full',
  },
  {
    path: 'loading',
    loadComponent: () =>
      import('./pages/spinner-page/spinner-page.component').then((m) => m.SpinnerPageComponent),
  },
  {
    path: 'spinner',
    redirectTo: 'loading',
    pathMatch: 'full',
  },
  {
    path: 'skeleton',
    redirectTo: 'loading',
    pathMatch: 'full',
  },
  {
    path: 'progress-bar',
    redirectTo: 'loading',
    pathMatch: 'full',
  },
  {
    path: 'text-input',
    redirectTo: 'form-field',
    pathMatch: 'full',
  },
  {
    path: 'form-section',
    redirectTo: 'form-field',
    pathMatch: 'full',
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
    path: 'toast',
    loadComponent: () =>
      import('./pages/toast-page/toast-page.component').then((m) => m.ToastPageComponent),
  },
  {
    path: 'navbar',
    loadComponent: () =>
      import('./pages/navbar-page/navbar-page.component').then((m) => m.NavbarPageComponent),
  },
  {
    path: 'sidebar',
    redirectTo: 'panel',
    pathMatch: 'full',
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

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { ThemesPageComponent } from './themes-page.component';

describe('ThemesPageComponent', () => {
  let fixture: ComponentFixture<ThemesPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [ThemesPageComponent] }).compileComponents();
    fixture = TestBed.createComponent(ThemesPageComponent);
    fixture.detectChanges();
  });

  it('scopes both reference themes explicitly', () => {
    const themes = [...fixture.nativeElement.querySelectorAll('.theme-matrix__theme')];

    expect(themes.map((theme) => theme.getAttribute('data-orbit-theme'))).toEqual([
      'light',
      'dark',
    ]);
  });
});

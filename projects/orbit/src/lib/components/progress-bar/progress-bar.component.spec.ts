import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it } from 'vitest';
import { OrbitProgressBarComponent } from './progress-bar.component';

describe('OrbitProgressBarComponent', () => {
  let fixture: ComponentFixture<OrbitProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitProgressBarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitProgressBarComponent);
  });

  function bar(): HTMLElement {
    return fixture.nativeElement.querySelector('.orbit-progress-bar') as HTMLElement;
  }

  function fill(): HTMLElement {
    return fixture.nativeElement.querySelector('.orbit-progress-bar__fill') as HTMLElement;
  }

  it('defaults to indeterminate when value is not set', () => {
    fixture.detectChanges();

    expect(bar().classList.contains('orbit-progress-bar--indeterminate')).toBe(true);
    expect(bar().getAttribute('aria-valuenow')).toBeNull();
    expect(fill().style.width).toBe('');
  });

  it('renders a determinate bar with width and aria-valuenow matching the value', () => {
    fixture.componentRef.setInput('value', 45);
    fixture.detectChanges();

    expect(bar().classList.contains('orbit-progress-bar--indeterminate')).toBe(false);
    expect(bar().getAttribute('aria-valuenow')).toBe('45');
    expect(fill().style.width).toBe('45%');
  });

  it('clamps a value above 100 down to 100', () => {
    fixture.componentRef.setInput('value', 150);
    fixture.detectChanges();

    expect(bar().getAttribute('aria-valuenow')).toBe('100');
    expect(fill().style.width).toBe('100%');
  });

  it('clamps a negative value up to 0', () => {
    fixture.componentRef.setInput('value', -20);
    fixture.detectChanges();

    expect(bar().getAttribute('aria-valuenow')).toBe('0');
    expect(fill().style.width).toBe('0%');
  });

  it('treats NaN as indeterminate instead of rendering width:NaN%', () => {
    fixture.componentRef.setInput('value', NaN);
    fixture.detectChanges();

    expect(bar().classList.contains('orbit-progress-bar--indeterminate')).toBe(true);
    expect(bar().getAttribute('aria-valuenow')).toBeNull();
    expect(fill().style.width).toBe('');
  });

  it('always exposes role=progressbar with min/max bounds of 0 and 100', () => {
    fixture.detectChanges();

    expect(bar().getAttribute('role')).toBe('progressbar');
    expect(bar().getAttribute('aria-valuemin')).toBe('0');
    expect(bar().getAttribute('aria-valuemax')).toBe('100');
  });

  it('applies the given ariaLabel, and omits the attribute when unset', () => {
    fixture.detectChanges();
    expect(bar().hasAttribute('aria-label')).toBe(false);

    fixture.componentRef.setInput('ariaLabel', 'Caricamento allegato');
    fixture.detectChanges();
    expect(bar().getAttribute('aria-label')).toBe('Caricamento allegato');
  });
});

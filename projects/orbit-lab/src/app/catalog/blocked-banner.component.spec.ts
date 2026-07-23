import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { LabBlockedBannerComponent } from './blocked-banner.component';

describe('LabBlockedBannerComponent', () => {
  let fixture: ComponentFixture<LabBlockedBannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LabBlockedBannerComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(LabBlockedBannerComponent);
    fixture.componentRef.setInput(
      'file',
      'projects/orbit/src/lib/components/badge/badge.component.css',
    );
    fixture.componentRef.setInput('tokens', ['--orbit-font-family', '--orbit-radius-full']);
    fixture.detectChanges();
  });

  it('renders the file path', () => {
    expect(fixture.nativeElement.textContent).toContain(
      'projects/orbit/src/lib/components/badge/badge.component.css',
    );
  });

  it('renders every blocked token', () => {
    const items = fixture.nativeElement.querySelectorAll('[data-blocked-token]');
    expect(items.length).toBe(2);
    expect(items[0].textContent.trim()).toBe('--orbit-font-family');
    expect(items[1].textContent.trim()).toBe('--orbit-radius-full');
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { BadgePageComponent } from './badge-page.component';

describe('BadgePageComponent', () => {
  let fixture: ComponentFixture<BadgePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BadgePageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(BadgePageComponent);
    fixture.detectChanges();
  });

  it('does not show a blocked banner (token drift resolved by Core)', () => {
    expect(fixture.nativeElement.querySelector('[data-blocked-banner]')).toBeNull();
  });

  it('renders every tone as a real orbit-badge', () => {
    const badges = fixture.nativeElement.querySelectorAll('orbit-badge');
    expect(badges.length).toBe(6);
  });
});

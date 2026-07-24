import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { AvatarPageComponent } from './avatar-page.component';

describe('AvatarPageComponent', () => {
  let fixture: ComponentFixture<AvatarPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AvatarPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(AvatarPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders an image avatar in the base example', () => {
    expect(fixture.nativeElement.querySelector('[data-example="base"] img')).toBeTruthy();
  });

  it('renders an initials fallback in the initials example', () => {
    const initials = fixture.nativeElement.querySelector(
      '[data-example="initials"] .orbit-avatar__initials',
    );
    expect(initials?.textContent?.trim()).toBe('MR');
  });

  it('renders all three sizes in the sizes example', () => {
    const avatars = fixture.nativeElement.querySelectorAll('[data-example="sizes"] .orbit-avatar');
    expect(avatars.length).toBe(3);
  });

  it('renders a copyable usage snippet', () => {
    const showCode = [
      ...fixture.nativeElement.querySelectorAll('.lab-example__actions button'),
    ].find((button) => button.textContent?.includes('Mostra codice')) as HTMLButtonElement;
    showCode.click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-avatar',
    );
  });
});

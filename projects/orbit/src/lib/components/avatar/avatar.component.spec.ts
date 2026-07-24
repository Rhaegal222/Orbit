import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitAvatarComponent } from './avatar.component';

describe('OrbitAvatarComponent', () => {
  let fixture: ComponentFixture<OrbitAvatarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrbitAvatarComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(OrbitAvatarComponent);
  });

  it('creates', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('derives two-letter initials from a compound name', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim(),
    ).toBe('MR');
  });

  it('derives a single-letter initial from a single-word name', () => {
    fixture.componentRef.setInput('name', 'Cher');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim(),
    ).toBe('C');
  });

  it('falls back to "?" for an empty name', () => {
    fixture.componentRef.setInput('name', '');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim(),
    ).toBe('?');
  });

  it('takes the first letter of the first and last word for names with more than two words', () => {
    fixture.componentRef.setInput('name', 'Maria Grazia Del Vecchio');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim(),
    ).toBe('MV');
  });

  it('renders an <img> with alt text when src is provided', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.componentRef.setInput('src', 'https://example.test/avatar.png');
    fixture.detectChanges();
    const img = fixture.nativeElement.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.alt).toBe('Mario Rossi');
    expect(fixture.nativeElement.querySelector('.orbit-avatar__initials')).toBeNull();
  });

  it('falls back to initials when the image fails to load', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.componentRef.setInput('src', 'https://example.test/broken.png');
    fixture.detectChanges();
    fixture.nativeElement.querySelector('img').dispatchEvent(new Event('error'));
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
    expect(
      fixture.nativeElement.querySelector('.orbit-avatar__initials')?.textContent?.trim(),
    ).toBe('MR');
  });

  it('produces the same background hue for the same name', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.detectChanges();
    const hueA = fixture.componentInstance['backgroundHue']();

    const fixture2 = TestBed.createComponent(OrbitAvatarComponent);
    fixture2.componentRef.setInput('name', 'Mario Rossi');
    fixture2.detectChanges();
    const hueB = fixture2.componentInstance['backgroundHue']();

    expect(hueA).toBe(hueB);
  });

  it('can produce different hues for different names', () => {
    fixture.componentRef.setInput('name', 'Aaa');
    fixture.detectChanges();
    const hueA = fixture.componentInstance['backgroundHue']();

    const fixture2 = TestBed.createComponent(OrbitAvatarComponent);
    fixture2.componentRef.setInput('name', 'Zzz Qqq');
    fixture2.detectChanges();
    const hueB = fixture2.componentInstance['backgroundHue']();

    expect(hueA).not.toBe(hueB);
  });

  it('exposes an accessible name via role=img/aria-label when showing initials', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('.orbit-avatar') as HTMLElement;
    expect(host.getAttribute('role')).toBe('img');
    expect(host.getAttribute('aria-label')).toBe('Mario Rossi');
  });

  it('omits role/aria-label from the host when an image is shown, since the <img alt> already carries it', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.componentRef.setInput('src', 'https://example.test/avatar.png');
    fixture.detectChanges();
    const host = fixture.nativeElement.querySelector('.orbit-avatar') as HTMLElement;
    expect(host.hasAttribute('role')).toBe(false);
    expect(host.hasAttribute('aria-label')).toBe(false);
  });

  it('applies the size class', () => {
    fixture.componentRef.setInput('name', 'Mario Rossi');
    fixture.componentRef.setInput('size', 'lg');
    fixture.detectChanges();
    expect(
      fixture.nativeElement.querySelector('.orbit-avatar')?.classList.contains('orbit-avatar--lg'),
    ).toBe(true);
  });
});

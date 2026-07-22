import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, expect, it } from 'vitest';
import { SelectPageComponent } from './select-page.component';

describe('SelectPageComponent', () => {
  let fixture: ComponentFixture<SelectPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SelectPageComponent],
    }).compileComponents();
    fixture = TestBed.createComponent(SelectPageComponent);
    fixture.detectChanges();
  });

  it('creates', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('renders the base example as readonly (not searchable)', () => {
    const input = fixture.nativeElement.querySelector('[data-example="base"] input');
    expect(input.readOnly).toBe(true);
  });

  it('renders the searchable example as editable', () => {
    const input = fixture.nativeElement.querySelector('[data-example="searchable"] input');
    expect(input.readOnly).toBe(false);
  });

  it('marks the invalid example as invalid via the host class', () => {
    const el = fixture.nativeElement.querySelector('[data-example="invalid"] orbit-select');
    expect(el.classList.contains('orbit-select--invalid')).toBe(true);
  });

  it('disables the native input in the disabled example via a disabled FormControl', () => {
    const input = fixture.nativeElement.querySelector('[data-example="disabled"] input');
    expect(input.disabled).toBe(true);
  });

  it('groups the invalid and disabled states in one documented preview', () => {
    const preview = fixture.nativeElement.querySelector('.select-page__state-preview');

    expect(preview.querySelector('[data-example="invalid"]')).toBeTruthy();
    expect(preview.querySelector('[data-example="disabled"]')).toBeTruthy();
  });

  it('renders a copyable usage snippet', () => {
    expect(fixture.nativeElement.querySelector('[data-code-block]').textContent).toContain(
      '<orbit-select',
    );
  });

  it('maps selectable tiles with interactive and disabled states', () => {
    const tiles = fixture.nativeElement.querySelectorAll('[data-example="selectable-tile"] orbit-selectable-tile');
    expect(tiles.length).toBe(3);
    expect(tiles[2].querySelector('button').disabled).toBe(true);
  });
});

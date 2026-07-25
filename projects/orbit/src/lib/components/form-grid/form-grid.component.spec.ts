import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitFormGridComponent } from './form-grid.component';
import { OrbitFormGridItemDirective } from './form-grid-item.directive';

@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [OrbitFormGridComponent, OrbitFormGridItemDirective],
  template: `
    <orbit-form-grid density="compact" layout="single">
      <div orbitFormGridItem [span]="12" [spanMd]="6" [spanLg]="4">Campo</div>
    </orbit-form-grid>
  `,
})
class FormGridHostComponent {}

describe('OrbitFormGridComponent', () => {
  let fixture: ComponentFixture<FormGridHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormGridHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FormGridHostComponent);
    fixture.detectChanges();
  });

  it('renders a twelve-column form grid with a compact density override', () => {
    const grid = fixture.nativeElement.querySelector('orbit-form-grid') as HTMLElement;

    expect(grid.getAttribute('data-orbit-density')).toBe('compact');
    expect(grid.classList).toContain('orbit-form-grid--single');
  });

  it('maps responsive spans to host CSS custom properties', () => {
    const item = fixture.nativeElement.querySelector('[orbitFormGridItem]') as HTMLElement;

    expect(item.classList).toContain('orbit-form-grid__item');
    expect(item.style.getPropertyValue('--orbit-form-grid-span')).toBe('12');
    expect(item.style.getPropertyValue('--orbit-form-grid-span-md')).toBe('6');
    expect(item.style.getPropertyValue('--orbit-form-grid-span-lg')).toBe('4');
  });
});

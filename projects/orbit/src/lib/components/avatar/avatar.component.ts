import { ChangeDetectionStrategy, Component, computed, input, signal } from '@angular/core';

export type OrbitAvatarSize = 'sm' | 'md' | 'lg';

/** Fixed, well-spaced hue set — keeps `--orbit-text-inverse` legible over every generated background. */
const AVATAR_HUES: readonly number[] = [4, 32, 96, 152, 200, 232, 268, 320];

@Component({
  selector: 'orbit-avatar',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.css',
  host: {
    '[style.--orbit-avatar-hue]': 'backgroundHue()',
  },
})
export class OrbitAvatarComponent {
  src = input<string | undefined>(undefined);
  /** Used both as the `<img>` alt text and to derive the initials fallback. */
  name = input.required<string>();
  size = input<OrbitAvatarSize>('md');

  protected readonly imageFailed = signal(false);

  protected readonly showImage = computed(() => !!this.src() && !this.imageFailed());
  protected readonly initials = computed(() => this.deriveInitials(this.name()));
  protected readonly backgroundHue = computed(() => this.hashToHue(this.name()));

  onImageError(): void {
    this.imageFailed.set(true);
  }

  private deriveInitials(name: string): string {
    const words = name.trim().split(/\s+/).filter(Boolean);
    if (words.length === 0) return '?';
    if (words.length === 1) return words[0].charAt(0).toUpperCase();
    const first = words[0].charAt(0);
    const last = words[words.length - 1].charAt(0);
    return (first + last).toUpperCase();
  }

  private hashToHue(name: string): number {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = (hash * 31 + name.charCodeAt(i)) | 0;
    }
    const index = Math.abs(hash) % AVATAR_HUES.length;
    return AVATAR_HUES[index];
  }
}

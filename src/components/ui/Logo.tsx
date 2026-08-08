import logoUrl from '@/assets/logos/ats-logo.png';
import { cx } from '@/lib/cx.ts';

interface LogoProps {
  /** Tailwind height class for the mark. Width follows the intrinsic ratio. */
  className?: string;
  /**
   * Classes for the wrapper — which is what carries the plate. Responsive
   * visibility belongs here rather than on `className`: hiding the image alone
   * would leave an empty ivory rectangle behind on a dark ground.
   */
  containerClassName?: string;
  /**
   * The supplied artwork sets "ATS" in forest green and the strapline in red —
   * both of which disappear against `--forest`. On any dark ground the mark
   * therefore sits on an ivory plate rather than being recoloured: repainting a
   * registered corporate mark is not ours to do.
   */
  plate?: boolean;
}

/**
 * The ATS corporate mark.
 *
 * One `<img>` rather than inline SVG because what was supplied is a raster
 * lockup (1280×668 JPEG on a flattened black ground). The black was keyed out
 * to alpha so the mark can sit on ivory or on a plate without a box around it;
 * the PNG under src/assets/logos is the derived file, the JPEG in
 * src/assets/icons is the original.
 *
 * The derived file is 400px wide — 3x the widest on-screen rendering, and 43kB
 * against 352kB for the full-size lockup. `public/og-logo.png` keeps the full
 * size for share cards, where the wordmark is actually read. Ask ATS for
 * vector artwork; that replaces all of this with one small file.
 *
 * `alt` names the company, not the file: this is a link's accessible label
 * wherever it is used as one.
 */
export function Logo({ className, containerClassName, plate = false }: LogoProps) {
  return (
    <span
      className={cx(
        'inline-flex shrink-0 items-center',
        plate && 'rounded-[2px] bg-ivory px-2 py-1.5',
        containerClassName,
      )}
    >
      <img
        src={logoUrl}
        alt="ATS Infrastructure"
        width={400}
        height={209}
        decoding="async"
        className={cx('w-auto', className ?? 'h-7')}
      />
    </span>
  );
}

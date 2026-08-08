import { cx } from '@/lib/cx.ts';
import { srcSet, variantUrl, type ImageAsset } from '@/assets/manifest.ts';

interface FigureProps {
  asset: ImageAsset;
  /**
   * The `sizes` attribute. Required — without it the browser assumes 100vw and
   * downloads the largest variant even inside a half-width column.
   */
  sizes: string;
  /** Above-the-fold image: eager + high priority. Exactly one per page. */
  priority?: boolean;
  /**
   * Tailwind aspect-ratio class. Omit to let the image keep its intrinsic
   * ratio — the right choice for drawings, which must never be cropped.
   */
  ratio?: string;
  className?: string;
  imgClassName?: string;
  /** Show the brochure credit under the image. */
  showCredit?: boolean;
}

/**
 * The single image primitive.
 *
 * Always emits width/height so layout space is reserved before decode (CLS 0),
 * always requires `sizes`, and offers a WebP source only for assets where WebP
 * measured smaller than JPEG.
 */
export function Figure({
  asset,
  sizes,
  priority = false,
  ratio,
  className,
  imgClassName,
  showCredit = false,
}: FigureProps) {
  const largest = asset.widths[asset.widths.length - 1];
  // With a fixed ratio the image fills and crops; without one it keeps its own
  // proportions. Either way width/height are present, so nothing shifts.
  const fit = ratio ? 'h-full w-full object-cover' : 'h-auto w-full';

  return (
    <figure className={cx('relative m-0', className)}>
      {/* `data-figure` marks the clipping frame the motion layer animates. */}
      <div data-figure className={cx('overflow-hidden', ratio)}>
        <picture data-figure-inner className="block h-full w-full">
          {asset.webp && <source type="image/webp" srcSet={srcSet(asset, 'webp')} sizes={sizes} />}
          <source type="image/jpeg" srcSet={srcSet(asset, 'jpg')} sizes={sizes} />
          <img
            src={variantUrl(asset.base, largest, 'jpg')}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            sizes={sizes}
            loading={priority ? 'eager' : 'lazy'}
            fetchPriority={priority ? 'high' : 'auto'}
            decoding={priority ? 'sync' : 'async'}
            className={cx(fit, imgClassName)}
          />
        </picture>
      </div>

      {showCredit && (
        <figcaption className="t-fine mt-3 text-charcoal/45 [.surface-dark_&]:text-ivory/45">
          {asset.credit} · artist’s impression
        </figcaption>
      )}
    </figure>
  );
}

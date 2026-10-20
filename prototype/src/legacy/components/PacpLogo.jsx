export const pacpLogoUrl = '/assets/pacp-logo.png';

/** Intrinsic pixel size of the artwork, used to reserve layout space. */
const NATURAL_WIDTH = 164;
const NATURAL_HEIGHT = 184;

/**
 * The PACP mark. Pass `size` for a fixed height (width follows the artwork's
 * ratio), or style it with `className` — e.g. `className="h-10 w-auto"`.
 */
export function PacpLogo({ size, className = '', title = 'PACP', style, ...rest }) {
  return (
    <img
      src={pacpLogoUrl}
      alt={title}
      width={NATURAL_WIDTH}
      height={NATURAL_HEIGHT}
      className={className}
      style={size ? { height: size, width: 'auto', ...style } : style}
      {...rest}
    />
  );
}

export default PacpLogo;

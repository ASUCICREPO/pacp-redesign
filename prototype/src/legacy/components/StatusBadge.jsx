import { BADGE_SIZES } from '../data/BADGE_SIZES.js';
import { STATUS_STYLES } from '../data/STATUS_STYLES.js';

export function StatusBadge({
  status: i,
  showLabel: n = !0,
  size: o = "md"
}) {
  const s = STATUS_STYLES[i],
    c = BADGE_SIZES[o],
    U = s.icon;
  return <div className={`inline-flex items-center gap-2 ${c.padding} ${s.bgColor} ${s.textColor} border ${s.borderColor} rounded-full ${c.text} font-medium`}><U className={c.iconSize} />{n && <span>{s.label}</span>}</div>;
}

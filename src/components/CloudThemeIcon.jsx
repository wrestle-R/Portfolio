export default function CloudThemeIcon() {
  return (
<svg className="theme-cloud" viewBox="0 0 100 80" fill="none" aria-hidden="true" focusable="false">
  <defs>
    <filter id="theme-cloud-paper" x="-10%" y="-10%" width="120%" height="120%" colorInterpolationFilters="sRGB">
      <feTurbulence type="fractalNoise" baseFrequency=".62" numOctaves="3" seed="11" result="noise" />
      <feColorMatrix in="noise" type="saturate" values="0" result="grain" />
      <feComposite in="grain" in2="SourceAlpha" operator="in" result="paper" />
      <feComponentTransfer in="paper" result="texture"><feFuncA type="linear" slope=".08" /></feComponentTransfer>
      <feBlend in="SourceGraphic" in2="texture" mode="soft-light" />
    </filter>
  </defs>
  <g filter="url(#theme-cloud-paper)" strokeLinecap="round" strokeLinejoin="round">
    <g className="theme-cloud__sun">
      <path d="m72 3 1 5m15 1-3 4m11 10-5 1M56 9l3 4m-9 11 5 1m34 13-4-3" stroke="#fff8e7" strokeWidth="7" />
      <path d="m72 3 1 5m15 1-3 4m11 10-5 1M56 9l3 4m-9 11 5 1m34 13-4-3" stroke="#d9ac4e" strokeWidth="3" />
      <circle cx="72" cy="26" r="15" fill="#e7b64f" stroke="#fff8e7" strokeWidth="4" />
    </g>
    <g className="theme-cloud__moon">
      <path d="M82 5C68 4 57 14 57 27c0 14 12 23 25 20 8-2 13-6 15-12-14 5-28-8-15-30Z" fill="#f1d59d" stroke="#fff8e7" strokeWidth="5" />
      <path d="M66 18c-5 8-3 16 4 21" stroke="#fff8e7" strokeWidth="2" opacity=".55" />
    </g>
    <path className="theme-cloud__back" d="M14 53c-1-9 6-16 14-15 2-14 20-20 30-9 10-3 20 5 20 16 10-1 18 6 17 16-1 10-10 14-22 13H23C9 75 3 68 5 60c1-4 4-6 9-7Z" stroke="#fff8e7" strokeWidth="5" />
    <path className="theme-cloud__middle" d="M17 59c-3-9 5-17 14-15 5-11 19-13 26-3 9-3 18 3 19 12 7-2 15 3 15 9 0 7-9 11-18 11H24c-12 0-16-8-7-14Z" />
    <path className="theme-cloud__front" d="M18 61c-4-10 3-18 13-18 3-12 21-15 29-3 10-2 19 5 19 14 12-2 20 9 13 17-4 5-11 5-20 5H22C9 76 6 66 18 61Z" stroke="#fff8e7" strokeWidth="4" />
    <path d="M29 48c3-9 14-12 21-6m16 6c5 1 8 5 8 9M20 65c0 4 5 7 10 7" stroke="#fff8e7" strokeWidth="2" opacity=".35" />
  </g>
</svg>
  );
}

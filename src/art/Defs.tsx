/**
 * Shared SVG definitions (gradients, filters, patterns) used by all of the realistic dessert art.
 * Every exported SVG includes its own <ArtDefs/> so exports are self-contained.
 */
export function ArtDefs() {
  return (
    <defs>
      {/* ---------- shadows & stickers ---------- */}
      <filter id="yc-shadow" x="-30%" y="-30%" width="160%" height="170%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" />
        <feOffset dy="3" result="o" />
        <feFlood floodColor="#5e3a27" floodOpacity="0.28" />
        <feComposite in2="o" operator="in" />
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="yc-shadow-lg" x="-30%" y="-30%" width="160%" height="170%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="7" />
        <feOffset dy="8" result="o" />
        <feFlood floodColor="#5e3a27" floodOpacity="0.3" />
        <feComposite in2="o" operator="in" />
        <feMerge><feMergeNode /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="yc-sticker" x="-25%" y="-25%" width="150%" height="150%">
        <feMorphology in="SourceAlpha" operator="dilate" radius="3.2" result="d" />
        <feFlood floodColor="#ffffff" />
        <feComposite in2="d" operator="in" result="outline" />
        <feGaussianBlur in="d" stdDeviation="2.4" result="sb" />
        <feOffset in="sb" dy="2.5" result="so" />
        <feFlood floodColor="#5e4535" floodOpacity="0.32" />
        <feComposite in2="so" operator="in" result="shadow" />
        <feMerge><feMergeNode in="shadow" /><feMergeNode in="outline" /><feMergeNode in="SourceGraphic" /></feMerge>
      </filter>
      <filter id="yc-blur2"><feGaussianBlur stdDeviation="2" /></filter>
      <filter id="yc-blur4"><feGaussianBlur stdDeviation="4" /></filter>
      <filter id="yc-blur10" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="10" /></filter>

      {/* ---------- textures ---------- */}
      <filter id="yc-scoop" x="-15%" y="-15%" width="130%" height="130%">
        <feTurbulence type="fractalNoise" baseFrequency="0.045" numOctaves="2" seed="4" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="7" xChannelSelector="R" yChannelSelector="G" result="d" />
        <feTurbulence type="fractalNoise" baseFrequency="0.55" numOctaves="2" seed="9" result="fine" />
        <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 -2.4 0.95" result="speck" />
        <feComposite in="speck" in2="d" operator="in" result="speckIn" />
        <feMerge><feMergeNode in="d" /><feMergeNode in="speckIn" /></feMerge>
      </filter>
      <filter id="yc-rough" x="-10%" y="-10%" width="120%" height="120%">
        <feTurbulence type="fractalNoise" baseFrequency="0.08" numOctaves="2" seed="2" result="n" />
        <feDisplacementMap in="SourceGraphic" in2="n" scale="4" xChannelSelector="R" yChannelSelector="G" />
      </filter>
      <filter id="yc-grain" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="g" />
        <feColorMatrix in="g" type="matrix" values="0 0 0 0 0.3  0 0 0 0 0.18  0 0 0 0 0.1  0 0 0 -1.6 0.95" result="sp" />
        <feComposite in="sp" in2="SourceGraphic" operator="in" result="spIn" />
        <feMerge><feMergeNode in="SourceGraphic" /><feMergeNode in="spIn" /></feMerge>
      </filter>
      <filter id="yc-lace" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" seed="12" result="n" />
        <feColorMatrix in="n" type="matrix" values="0 0 0 0 0.62  0 0 0 0 0.36  0 0 0 0 0.14  0 0 0 9 -4.4" result="spots" />
        <feGaussianBlur in="spots" stdDeviation="1.2" result="soft" />
        <feComposite in="soft" in2="SourceGraphic" operator="in" />
      </filter>
      <filter id="yc-edge" x="-10%" y="-10%" width="120%" height="120%">
        <feMorphology in="SourceAlpha" operator="erode" radius="7" result="e" />
        <feComposite in="SourceAlpha" in2="e" operator="out" result="ring" />
        <feGaussianBlur in="ring" stdDeviation="4" result="rb" />
        <feFlood floodColor="#8A4E1E" />
        <feComposite in2="rb" operator="in" result="c" />
        <feComposite in="c" in2="SourceAlpha" operator="in" />
      </filter>
      <filter id="yc-gloss" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b" />
        <feSpecularLighting in="b" surfaceScale="4" specularConstant="0.9" specularExponent="22" lightingColor="#ffffff" result="s">
          <fePointLight x="-60" y="-120" z="160" />
        </feSpecularLighting>
        <feComposite in="s" in2="SourceAlpha" operator="in" result="sIn" />
        <feComposite in="SourceGraphic" in2="sIn" operator="arithmetic" k1="0" k2="1" k3="0.55" k4="0" />
      </filter>

      {/* ---------- glass ---------- */}
      <linearGradient id="yc-glass-body" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#ffffff" stopOpacity="0.55" />
        <stop offset="0.12" stopColor="#ffffff" stopOpacity="0.12" />
        <stop offset="0.5" stopColor="#ffffff" stopOpacity="0.04" />
        <stop offset="0.86" stopColor="#ffffff" stopOpacity="0.14" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.6" />
      </linearGradient>
      <linearGradient id="yc-vol" x1="0" x2="1" y1="0" y2="0">
        <stop offset="0" stopColor="#000" stopOpacity="0.28" />
        <stop offset="0.18" stopColor="#000" stopOpacity="0.06" />
        <stop offset="0.38" stopColor="#fff" stopOpacity="0.16" />
        <stop offset="0.55" stopColor="#fff" stopOpacity="0" />
        <stop offset="0.85" stopColor="#000" stopOpacity="0.1" />
        <stop offset="1" stopColor="#000" stopOpacity="0.32" />
      </linearGradient>
      <linearGradient id="yc-shine-v" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.95" />
        <stop offset="0.6" stopColor="#fff" stopOpacity="0.35" />
        <stop offset="1" stopColor="#fff" stopOpacity="0" />
      </linearGradient>
      <linearGradient id="yc-glass-foot" x1="0" x2="1">
        <stop offset="0" stopColor="#dfeff5" stopOpacity="0.9" />
        <stop offset="0.3" stopColor="#ffffff" stopOpacity="0.5" />
        <stop offset="0.7" stopColor="#cfe3ea" stopOpacity="0.4" />
        <stop offset="1" stopColor="#ffffff" stopOpacity="0.9" />
      </linearGradient>
      <radialGradient id="yc-floor-shadow">
        <stop offset="0" stopColor="#3b2414" stopOpacity="0.45" />
        <stop offset="1" stopColor="#3b2414" stopOpacity="0" />
      </radialGradient>

      {/* ---------- fruit & food ---------- */}
      <radialGradient id="yc-strawberry" cx="0.38" cy="0.32" r="0.75">
        <stop offset="0" stopColor="#FF7A86" />
        <stop offset="0.45" stopColor="#E3192F" />
        <stop offset="1" stopColor="#8A0717" />
      </radialGradient>
      <radialGradient id="yc-straw-flesh" cx="0.5" cy="0.45" r="0.6">
        <stop offset="0" stopColor="#FFF5F3" />
        <stop offset="0.45" stopColor="#FBC5C8" />
        <stop offset="0.85" stopColor="#F05468" />
        <stop offset="1" stopColor="#D41E36" />
      </radialGradient>
      <radialGradient id="yc-cherry" cx="0.35" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#FF6F7E" />
        <stop offset="0.35" stopColor="#E01A35" />
        <stop offset="0.8" stopColor="#9C0B20" />
        <stop offset="1" stopColor="#5E0412" />
      </radialGradient>
      <radialGradient id="yc-leaf" cx="0.4" cy="0.3" r="0.9">
        <stop offset="0" stopColor="#9BD36A" />
        <stop offset="1" stopColor="#3E7A23" />
      </radialGradient>
      <radialGradient id="yc-kiwi" cx="0.5" cy="0.5" r="0.5">
        <stop offset="0" stopColor="#FBF8DA" />
        <stop offset="0.25" stopColor="#E0EE9C" />
        <stop offset="0.75" stopColor="#8DC23C" />
        <stop offset="0.93" stopColor="#6FA62A" />
        <stop offset="1" stopColor="#7A6A34" />
      </radialGradient>
      <radialGradient id="yc-sphere-white" cx="0.36" cy="0.3" r="0.8">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="0.6" stopColor="#F6F3EC" />
        <stop offset="1" stopColor="#D9D2C4" />
      </radialGradient>
      <linearGradient id="yc-wafer" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#F6D79A" />
        <stop offset="1" stopColor="#D09A52" />
      </linearGradient>
      <radialGradient id="yc-cookie" cx="0.42" cy="0.38" r="0.7">
        <stop offset="0" stopColor="#F2C27A" />
        <stop offset="0.7" stopColor="#D99A4C" />
        <stop offset="1" stopColor="#A86A2C" />
      </radialGradient>
      <linearGradient id="yc-choc" x1="0" x2="1">
        <stop offset="0" stopColor="#2E160B" />
        <stop offset="0.4" stopColor="#6A3A20" />
        <stop offset="0.6" stopColor="#5A2F18" />
        <stop offset="1" stopColor="#24110A" />
      </linearGradient>

      {/* ---------- materials ---------- */}
      <linearGradient id="yc-wood" x1="0" x2="0" y1="0" y2="1">
        <stop offset="0" stopColor="#C8925E" />
        <stop offset="1" stopColor="#8E5E36" />
      </linearGradient>
      <linearGradient id="yc-wood-h" x1="0" x2="1">
        <stop offset="0" stopColor="#9C6A3E" />
        <stop offset="0.5" stopColor="#C8925E" />
        <stop offset="1" stopColor="#9C6A3E" />
      </linearGradient>
      <linearGradient id="yc-metal" x1="0" x2="1">
        <stop offset="0" stopColor="#8E979C" />
        <stop offset="0.2" stopColor="#F4F7F8" />
        <stop offset="0.45" stopColor="#B9C2C7" />
        <stop offset="0.7" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#7E878C" />
      </linearGradient>
      <linearGradient id="yc-gold" x1="0" x2="1" y1="0" y2="1">
        <stop offset="0" stopColor="#F9E3A1" />
        <stop offset="0.5" stopColor="#D4A746" />
        <stop offset="1" stopColor="#A87B22" />
      </linearGradient>
      <linearGradient id="yc-ceramic" x1="0" x2="1">
        <stop offset="0" stopColor="#E6DED2" />
        <stop offset="0.35" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#D8CEC0" />
      </linearGradient>

      {/* ---------- patterns ---------- */}
      <pattern id="yc-ging-pink" width="22" height="22" patternUnits="userSpaceOnUse">
        <rect width="22" height="22" fill="#fff" />
        <rect width="11" height="22" fill="#E8607E" opacity="0.45" />
        <rect width="22" height="11" fill="#E8607E" opacity="0.45" />
      </pattern>
      <pattern id="yc-ging-green" width="22" height="22" patternUnits="userSpaceOnUse">
        <rect width="22" height="22" fill="#fff" />
        <rect width="11" height="22" fill="#6E9B4A" opacity="0.45" />
        <rect width="22" height="11" fill="#6E9B4A" opacity="0.45" />
      </pattern>
      <pattern id="yc-kraft" width="60" height="60" patternUnits="userSpaceOnUse">
        <rect width="60" height="60" fill="#D9B98F" />
        <path d="M0 15h60M0 38h60" stroke="#C9A676" strokeWidth="1" opacity=".5" />
      </pattern>
      <pattern id="yc-floral" width="46" height="46" patternUnits="userSpaceOnUse">
        <rect width="46" height="46" fill="#FFF5F7" />
        <g transform="translate(12 12)" fill="#F3A6BC">
          {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} rx="3.6" ry="6" transform={`rotate(${a}) translate(0 -5)`} />)}
          <circle r="2" fill="#F7D774" />
        </g>
        <g transform="translate(34 34) scale(.8)" fill="#F7C6D4">
          {[20, 92, 164, 236, 308].map((a) => <ellipse key={a} rx="3.6" ry="6" transform={`rotate(${a}) translate(0 -5)`} />)}
          <circle r="2" fill="#F7D774" />
        </g>
      </pattern>
      <pattern id="yc-dots" width="16" height="16" patternUnits="userSpaceOnUse">
        <circle cx="8" cy="8" r="2.4" fill="#fff" opacity=".7" />
      </pattern>
      <pattern id="yc-waffle" width="10" height="10" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
        <rect width="10" height="10" fill="none" />
        <path d="M0 0h10M0 0v10" stroke="#B57A3A" strokeWidth="1.6" opacity=".55" />
      </pattern>
    </defs>
  );
}

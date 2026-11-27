export default function HomeIllustration() {
  return (
    <div className="art">
      <svg
        viewBox="0 0 520 420"
        role="img"
        aria-label="HR analytics dashboard, org chart and cloud illustration"
      >
        <circle cx="270" cy="210" r="176" fill="var(--red)" opacity=".07" />
        <circle
          cx="270"
          cy="210"
          r="132"
          fill="none"
          stroke="var(--red)"
          opacity=".3"
          strokeDasharray="3 9"
          strokeLinecap="round"
        />
        <rect x="52" y="176" width="26" height="12" fill="var(--red)" />
        <rect x="78" y="176" width="26" height="12" fill="#CDD2D9" />
        <path
          d="M470 376h14M477 369v14"
          stroke="var(--red)"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
        <g className="f1" style={{ filter: "drop-shadow(0 18px 28px rgba(20,23,28,.16))" }}>
          <rect x="120" y="80" width="300" height="240" rx="14" fill="var(--card)" stroke="var(--line)" />
          <text x="142" y="106" className="th">HCM Overview</text>
          <text x="252" y="105" className="ts">Sample data</text>
          <line x1="120" y1="120" x2="420" y2="120" stroke="var(--line)" />
          <g fill="#CDD2D9">
            <rect x="146" y="218" width="24" height="52" rx="3" />
            <rect x="182" y="198" width="24" height="72" rx="3" />
            <rect x="218" y="210" width="24" height="60" rx="3" />
          </g>
          <rect x="254" y="160" width="24" height="110" rx="3" fill="var(--red)" />
          <line x1="140" y1="270" x2="290" y2="270" stroke="var(--line)" />
          <polyline
            points="158,190 194,168 230,180 266,132"
            fill="none"
            stroke="#8A919C"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="362" cy="190" r="38" fill="none" stroke="#E3E6EA" strokeWidth="14" />
          <circle
            cx="362"
            cy="190"
            r="38"
            fill="none"
            stroke="var(--red)"
            strokeWidth="14"
            strokeDasharray="155 240"
            strokeLinecap="round"
            transform="rotate(-90 362 190)"
          />
          <text x="362" y="196" textAnchor="middle" className="tn" style={{ fontSize: 16 }}>65%</text>
          <text x="362" y="262" textAnchor="middle" className="tc">Goals on track</text>
          <circle cx="146" cy="298" r="10" fill="#CDD2D9" />
          <circle cx="166" cy="298" r="10" fill="var(--red)" />
          <circle cx="186" cy="298" r="10" fill="#8A919C" />
          <rect x="214" y="294" width="90" height="8" rx="4" fill="#E3E6EA" />
        </g>
        <g className="f2" style={{ filter: "drop-shadow(0 14px 22px rgba(20,23,28,.15))" }}>
          <rect x="36" y="252" width="150" height="112" rx="12" fill="var(--card)" stroke="var(--line)" />
          <path d="M111 286V302M78 322V302H144V322" fill="none" stroke="#CDD2D9" strokeWidth="2" />
          <circle cx="111" cy="276" r="10" fill="var(--red)" />
          <circle cx="78" cy="331" r="9" fill="#8A919C" />
          <circle cx="144" cy="331" r="9" fill="#CDD2D9" />
        </g>
        <g className="f3" style={{ filter: "drop-shadow(0 14px 22px rgba(20,23,28,.15))" }}>
          <rect x="376" y="36" width="100" height="68" rx="12" fill="var(--card)" stroke="var(--line)" />
          <g fill="var(--red)">
            <circle cx="410" cy="74" r="11" />
            <circle cx="428" cy="65" r="15" />
            <circle cx="446" cy="74" r="11" />
            <rect x="410" y="72" width="36" height="13" rx="6" />
          </g>
          <text x="426" y="99" textAnchor="middle" className="tc" style={{ fontSize: 10 }}>Cloud HCM</text>
        </g>
        <g className="f5" style={{ filter: "drop-shadow(0 12px 20px rgba(20,23,28,.15))" }}>
          <rect x="40" y="26" width="116" height="54" rx="12" fill="var(--card)" stroke="var(--line)" />
          <rect x="40" y="38" width="3" height="30" fill="var(--red)" />
          <text x="56" y="56" className="tn">1,248</text>
          <text x="56" y="71" className="tc">Employees</text>
        </g>
        <g className="f6" style={{ filter: "drop-shadow(0 12px 20px rgba(20,23,28,.15))" }}>
          <rect x="430" y="128" width="88" height="54" rx="12" fill="var(--card)" stroke="var(--line)" />
          <rect x="430" y="140" width="3" height="30" fill="var(--red)" />
          <text x="444" y="158" className="tn">8</text>
          <text x="444" y="173" className="tc">HCM modules</text>
        </g>
        <g className="f5" style={{ filter: "drop-shadow(0 12px 20px rgba(20,23,28,.15))" }}>
          <rect x="226" y="338" width="132" height="52" rx="12" fill="var(--card)" stroke="var(--line)" />
          <rect x="226" y="349" width="3" height="30" fill="var(--red)" />
          <text x="242" y="366" className="tn">26D</text>
          <text x="242" y="381" className="tc">Quarterly update</text>
        </g>
        <g className="f4">
          <g transform="translate(452 322)">
            <circle r="20" fill="none" stroke="var(--red)" strokeWidth="8" strokeDasharray="7.85 7.85" />
            <circle r="16" fill="var(--red)" />
            <circle r="6" fill="var(--card)" />
          </g>
        </g>
      </svg>
    </div>
  );
}

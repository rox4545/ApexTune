'use client';

import { useTheme, useWidgetSDK } from '@nitrostack/widgets';

interface DiskInfo {
  mount: string;
  usedPercent: string;
}

interface SystemOverviewData {
  cpuLoadPercent: string;
  ramUsedPercent: string;
  disks: DiskInfo[];
  gpuLoadPercent: string | number;
}

function Bar({ label, percent, color, isDark }: { label: string; percent: number; color: string; isDark: boolean }) {
  return (
    <div style={{ marginBottom: '14px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px', opacity: 0.85 }}>
        <span>{label}</span>
        <span style={{ fontWeight: 'bold' }}>{percent.toFixed(0)}%</span>
      </div>
      <div style={{ width: '100%', height: '8px', borderRadius: '999px', background: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)', overflow: 'hidden' }}>
        <div style={{ width: `${Math.min(100, Math.max(0, percent))}%`, height: '100%', borderRadius: '999px', background: color, transition: 'width 0.4s ease' }} />
      </div>
    </div>
  );
}

export default function SystemOverview() {
  const theme = useTheme();
  const { getToolOutput } = useWidgetSDK();
  const data = getToolOutput<SystemOverviewData>();

  const isDark = theme === 'dark';
  const bgColor = isDark
    ? 'linear-gradient(135deg, #1f2937 0%, #111827 100%)'
    : 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)';

  if (!data) {
    return <div style={{ padding: '24px', textAlign: 'center', color: isDark ? '#fff' : '#000' }}>Loading system stats...</div>;
  }

  const cpu = parseFloat(data.cpuLoadPercent) || 0;
  const ram = parseFloat(data.ramUsedPercent) || 0;
  const gpu = typeof data.gpuLoadPercent === 'number' ? data.gpuLoadPercent : parseFloat(String(data.gpuLoadPercent)) || 0;

  return (
    <div style={{ padding: '24px', background: bgColor, borderRadius: '16px', color: 'white', maxWidth: '400px', boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
        <span style={{ fontSize: '28px' }}>⚡</span>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px' }}>ApexTune System Overview</h3>
          <p style={{ margin: '2px 0 0 0', fontSize: '13px', opacity: 0.75 }}>Live snapshot</p>
        </div>
      </div>

      <div style={{ background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '18px', backdropFilter: 'blur(10px)' }}>
        <Bar label="CPU" percent={cpu} color="#22d3ee" isDark={isDark} />
        <Bar label="RAM" percent={ram} color="#a78bfa" isDark={isDark} />
        <Bar label="GPU" percent={gpu} color="#f472b6" isDark={isDark} />
        {data.disks?.map((d) => (
          <Bar key={d.mount} label={`Disk (${d.mount})`} percent={parseFloat(d.usedPercent) || 0} color="#facc15" isDark={isDark} />
        ))}
      </div>

      <div style={{ fontSize: '11px', textAlign: 'center', opacity: 0.7, marginTop: '12px' }}>✨ ApexTune</div>
    </div>
  );
}
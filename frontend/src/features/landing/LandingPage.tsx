import React from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldAlert, 
  Activity, 
  Layers, 
  CheckCircle2, 
  Clock, 
  Zap, 
  Building2, 
  Terminal,
  FileText,
  AlertTriangle,
  Check,
  X,
  Wrench,
  Search,
  ChevronRight
} from 'lucide-react';

interface LandingPageProps {
  onNavigate: (view: 'student' | 'admin') => void;
  connectionMode?: string;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  return (
    <div style={{ paddingBottom: '5rem' }}>
      
      {/* ====================================================================
          1. Nexus-Inspired Hero Section (bg-nexus-radial, gradient typography, window mockup)
          ==================================================================== */}
      <section 
        className="bg-nexus-radial"
        style={{ 
          padding: 'clamp(3rem, 7vw, 6.5rem) 0 clamp(2.5rem, 5vw, 4.5rem)',
          borderBottom: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '1020px' }}>
          
          {/* Nexus Status Pill with Pulsing Indicator */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <div className="nexus-pill">
              <span className="pulse-dot" style={{ backgroundColor: 'var(--nexus-primary)' }} />
              <span>Nexus Intelligence · CampusPulseAI v2.4</span>
              <ChevronRight size={14} style={{ opacity: 0.6 }} />
            </div>
          </div>

          {/* Main Confident Headline with Nexus Gradient */}
          <h1 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: 'clamp(2.5rem, 5.5vw, 4.5rem)',
            fontWeight: 900,
            letterSpacing: '-0.035em',
            lineHeight: 1.1,
            marginBottom: '1.25rem',
            color: 'var(--text-primary)'
          }}>
            Turn Campus Incidents <br className="hidden-sm" />
            <span className="nexus-gradient-text">
              Into Coordinated Action.
            </span>
          </h1>

          {/* Supporting Value Proposition */}
          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: 'var(--text-secondary)',
            lineHeight: 1.6,
            maxWidth: '740px',
            margin: '0 auto 2.25rem'
          }}>
            Transform scattered student complaints into structured, correlated campus intelligence — giving facilities and operations teams the spatial context they need to resolve outages before disruptions cascade.
          </p>

          {/* Primary & Secondary CTAs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1rem',
            flexWrap: 'wrap',
            marginBottom: '3.5rem'
          }}>
            <button
              onClick={() => onNavigate('student')}
              className="btn btn-primary btn-lg"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.6rem',
                background: 'var(--nexus-primary)',
                boxShadow: '0 4px 20px rgba(91, 77, 245, 0.4)'
              }}
            >
              <span>Report an Incident</span>
              <ArrowRight size={18} />
            </button>

            <button
              onClick={() => onNavigate('admin')}
              className="btn btn-secondary btn-lg"
              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem' }}
            >
              <Activity size={18} color="var(--nexus-accent)" />
              <span>Explore Command Center</span>
            </button>
          </div>

          {/* Nexus Window Mockup Frame (inspired by d:\zoom-clone\components\marketing\MarketingHero.tsx) */}
          <div 
            className="nexus-card"
            style={{
              padding: '1.25rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 40px rgba(91, 77, 245, 0.12)',
              textAlign: 'left',
              position: 'relative'
            }}
          >
            {/* Window bar with macOS dots */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '0.85rem',
              borderBottom: '1px solid var(--border-subtle)',
              marginBottom: '1.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }} />
                <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }} />
                <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginLeft: '8px', fontFamily: 'var(--font-mono)' }}>
                  campuspulse.os / workspace-telemetry
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--nexus-primary)', border: '1px solid var(--border-subtle)' }}>
                  Live Cluster Simulation
                </span>
              </div>
            </div>

            {/* Preview Content Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.25rem',
              alignItems: 'stretch'
            }}>
              {/* Incident Feed Card Sample */}
              <div style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                borderLeft: '4px solid var(--sev-high)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                      <span className="badge badge-status-open">OPEN</span>
                      <span className="badge badge-sev-HIGH">HIGH SEVERITY</span>
                      <span className="badge badge-emerging">
                        <Zap size={10} /> SPIKE
                      </span>
                    </div>
                    <span style={{ fontSize: '0.725rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Just now
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '6px' }}>
                    CSE Block Network Outage
                  </h3>

                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '12px', lineHeight: 1.4 }}>
                    Multiple student reports indicate core switch down across Lab 3 and 2nd floor hallway.
                  </p>
                </div>

                <div>
                  {/* Impact meter */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      <span>CRITICALITY IMPACT</span>
                      <span style={{ color: 'var(--sev-high)', fontFamily: 'var(--font-mono)' }}>78 / 100</span>
                    </div>
                    <div className="impact-meter-bg">
                      <div className="impact-meter-fill impact-meter-fill-high" style={{ width: '78%' }} />
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--nexus-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <FileText size={13} /> 3 Correlated Reports
                    </span>
                    <button 
                      onClick={() => onNavigate('admin')}
                      className="btn btn-sm btn-secondary" 
                      style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
                    >
                      Deep Triage →
                    </button>
                  </div>
                </div>
              </div>

              {/* Correlation & AI Insights Panel */}
              <div style={{
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', color: 'var(--nexus-primary)', fontWeight: 700, fontSize: '0.85rem' }}>
                    <Sparkles size={16} />
                    <span>Explainable AI Synthesis</span>
                  </div>

                  <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                    "Correlated 3 student reports with 88% similarity based on identical building (CSE Block), network domain category, and arrival within a 45-minute window."
                  </p>
                </div>

                <div style={{
                  background: 'var(--bg-surface-1)',
                  borderRadius: 'var(--radius-md)',
                  padding: '0.75rem',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                      Recommended Action
                    </div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      Reset Core Router in Server Rm 204
                    </div>
                  </div>
                  <span className="badge" style={{ background: 'var(--status-resolved-bg)', color: 'var(--status-resolved)' }}>
                    Actionable
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          2. Nexus AI Architecture Section (inspired by MarketingAI.tsx)
          ==================================================================== */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 6rem) 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2.5rem', alignItems: 'center' }}>
            <div>
              <div className="nexus-pill" style={{ marginBottom: '1rem', color: 'var(--nexus-primary)' }}>
                <Sparkles size={14} />
                <span>Nexus Cluster Architecture</span>
              </div>
              <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(2rem, 4vw, 2.75rem)', fontWeight: 800, letterSpacing: '-0.025em', color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1rem' }}>
                The Intelligence Layer That Correlates, Prioritizes, and Dispatches.
              </h2>
              <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                CampusPulseAI operates like a nervous system for your campus. Incoming reports are parsed for location entities, mathematically compared across 4 dimensions, and grouped into singular actionable incidents.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(91, 77, 245, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--nexus-primary)', flexShrink: 0 }}>
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      Deterministic Multi-Factor Scoring
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      Formula: <code>0.55*Sim + 0.20*Loc + 0.15*Cat + 0.10*Time</code> guarantees transparent, explainable clustering with 0 hallucinations.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(239, 68, 68, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ef4444', flexShrink: 0 }}>
                    <AlertTriangle size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      Velocity Spike Auto-Escalation
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      When 3 or more related reports arrive within a 60-minute window, the system triggers an emerging spike alert for immediate administrative triage.
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 40, height: 40, borderRadius: '10px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981', flexShrink: 0 }}>
                    <Wrench size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
                      Actionable Facilities Protocols
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>
                      Synthesizes step-by-step triage checklists for maintenance teams and broadcasts status updates back to affected students in real time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Dossier Preview */}
            <div className="nexus-card" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Building2 size={18} color="var(--nexus-primary)" />
                  <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Central Library · 2nd Floor Water Leak
                  </span>
                </div>
                <span className="badge badge-sev-CRITICAL">CRITICAL</span>
              </div>

              <div style={{ background: 'var(--bg-surface-2)', padding: '1rem', borderRadius: 'var(--radius-md)', marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.725rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>
                  AI Executive Incident Synthesis:
                </div>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  Burst plumbing manifold near restroom 2B leaking at estimated 15 gal/min. Immediate risk to digital archives below. Facilities dispatch requested.
                </p>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="var(--status-resolved)" />
                  <span>Main shutoff valve isolated in Utility Basement</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="var(--status-resolved)" />
                  <span>Submersible extraction pumps deployed</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <CheckCircle2 size={15} color="var(--status-resolved)" />
                  <span>Electrical circuits in study wing 204 de-energized</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Clustered from 4 reports</span>
                <span className="kbd-tag" style={{ color: 'var(--status-resolved)' }}>Response Time: &lt; 2m</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          3. Nexus Comparison Matrix: "Replace Fragmented Campus Dispatches"
             (inspired by d:\zoom-clone\components\marketing\MarketingComparison.tsx)
          ==================================================================== */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 6rem) 0', borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface-1)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '680px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--nexus-primary)' }}>
              Replace Fragmented Workflows
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.025em', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              Why Modern Campuses Choose CampusPulseAI
            </h2>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
              Traditional complaints disappear into separate inboxes, ticketing queues, and chaotic WhatsApp groups. CampusPulseAI unifies them into one intelligence context.
            </p>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <div style={{ minWidth: '720px' }}>
              {/* Header Row */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
                gap: '1rem',
                padding: '0.75rem 1rem',
                borderBottom: '1px solid var(--border-medium)',
                fontWeight: 700,
                fontSize: '0.8rem',
                color: 'var(--text-muted)',
                textTransform: 'uppercase',
                letterSpacing: '0.05em'
              }}>
                <div>Operational Capability</div>
                <div style={{ color: 'var(--nexus-primary)', textAlign: 'center', fontWeight: 800 }}>CampusPulse AI</div>
                <div style={{ textAlign: 'center' }}>Email & Slack</div>
                <div style={{ textAlign: 'center' }}>Phone Hotlines</div>
                <div style={{ textAlign: 'center' }}>Legacy Forms</div>
              </div>

              {/* Comparison Rows */}
              {[
                { title: 'Multi-Factor Correlation (Space, Time, Semantic)', campus: true, email: false, phone: false, forms: false },
                { title: 'Velocity Surge Spike Detection (Sliding 60m Window)', campus: true, email: false, phone: false, forms: false },
                { title: 'Deterministic Location Entity Extraction', campus: true, email: false, phone: false, forms: true },
                { title: 'AI Action Protocol & Facilities Checklists', campus: true, email: false, phone: false, forms: false },
                { title: 'Explainable Justification (Cosine & Proximity Math)', campus: true, email: false, phone: false, forms: false },
                { title: 'Live Ticket Lifecycle Tracking for Students', campus: true, email: true, phone: false, forms: false }
              ].map((row, i) => (
                <div
                  key={i}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1.5fr 1fr 1fr 1fr',
                    gap: '1rem',
                    padding: '1rem',
                    alignItems: 'center',
                    borderBottom: '1px solid var(--border-subtle)',
                    background: i % 2 === 0 ? 'transparent' : 'var(--bg-surface-2)',
                    borderRadius: 'var(--radius-sm)'
                  }}
                >
                  <div style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {row.title}
                  </div>
                  
                  {/* CampusPulse */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'rgba(91, 77, 245, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Check size={16} color="var(--nexus-primary)" strokeWidth={2.5} />
                    </div>
                  </div>

                  {/* Email */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {row.email ? <Check size={16} color="var(--text-muted)" /> : <X size={16} color="var(--text-subtle)" opacity={0.4} />}
                  </div>

                  {/* Phone */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {row.phone ? <Check size={16} color="var(--text-muted)" /> : <X size={16} color="var(--text-subtle)" opacity={0.4} />}
                  </div>

                  {/* Forms */}
                  <div style={{ display: 'flex', justifyContent: 'center' }}>
                    {row.forms ? <Check size={16} color="var(--text-muted)" /> : <X size={16} color="var(--text-subtle)" opacity={0.4} />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          4. Bento Feature Grid
          ==================================================================== */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 6rem) 0', borderBottom: '1px solid var(--border-subtle)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '640px', margin: '0 auto 3rem' }}>
            <span style={{ fontSize: '0.775rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--nexus-accent)' }}>
              Engineered for Speed & Clarity
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)', fontWeight: 800, letterSpacing: '-0.025em', marginTop: '0.5rem', color: 'var(--text-primary)' }}>
              Everything You Need. Nothing You Don't.
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(12, 1fr)',
            gap: '1.25rem'
          }}>
            {/* Bento Card 1: Multi-Factor Correlation (Col 8) */}
            <div className="nexus-card" style={{ gridColumn: 'span 12', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--nexus-primary)', marginBottom: '0.5rem' }}>
                <Layers size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  Multi-Factor Correlation Architecture
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.6rem' }}>
                Deterministic Weighted Cluster Math
              </h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '680px', marginBottom: '1.25rem' }}>
                Single complaints are evaluated against active incidents using a multi-factor formula combining semantic cosine similarity, physical building proximity, category matching, and temporal decay.
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                <span className="badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                  0.55 × Semantic Similarity
                </span>
                <span className="badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                  0.20 × Location Match
                </span>
                <span className="badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                  0.15 × Category Match
                </span>
                <span className="badge" style={{ background: 'var(--bg-surface-2)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}>
                  0.10 × Temporal Decay
                </span>
              </div>
            </div>

            {/* Bento Card 2: Rapid Spike Detection (Col 6) */}
            <div className="nexus-card" style={{ gridColumn: 'span 6', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#ef4444', marginBottom: '0.5rem' }}>
                <AlertTriangle size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Velocity Surge Detection
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Rapid Spike Auto-Escalation
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                When arrival velocity exceeds threshold (≥ 3 reports in 60m), the engine automatically triggers an emerging alert for immediate administrative triage.
              </p>
            </div>

            {/* Bento Card 3: Dual Mode Support (Col 6) */}
            <div className="nexus-card" style={{ gridColumn: 'span 6', padding: '1.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--nexus-accent)', marginBottom: '0.5rem' }}>
                <Terminal size={20} />
                <span style={{ fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
                  Resilient Dual Mode
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
                Live API & Simulation Sandbox
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
                Zero-crash resilience ensures administrators and students can switch between the live Express backend and an offline simulation sandbox seamlessly.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================================
          5. Bottom Call-To-Action Banner
          ==================================================================== */}
      <section style={{ padding: 'clamp(3.5rem, 6vw, 5.5rem) 0' }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <div 
            className="nexus-card"
            style={{
              padding: '3rem 2rem',
              maxWidth: '960px',
              margin: '0 auto',
              background: 'radial-gradient(ellipse at 50% 0%, rgba(91, 77, 245, 0.18) 0%, var(--bg-surface-1) 75%)'
            }}
          >
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--nexus-primary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Campus-Wide Incident Intelligence
            </span>
            <h2 style={{ fontFamily: 'var(--font-heading)', fontSize: 'clamp(1.8rem, 3.5vw, 2.5rem)', fontWeight: 800, marginTop: '0.5rem', marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
              Ready to Upgrade Campus Operations?
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', maxWidth: '560px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Whether you are a student reporting a broken lab switch or an administrator monitoring campus infrastructure, CampusPulse AI keeps teams in sync.
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('student')}
                className="btn btn-primary btn-lg"
                style={{ background: 'var(--nexus-primary)' }}
              >
                Submit Incident Report →
              </button>
              <button
                onClick={() => onNavigate('admin')}
                className="btn btn-secondary btn-lg"
              >
                Open Admin Command Center
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

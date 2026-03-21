import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default function ConfidenceGauge({ confidence }) {
  const value = Math.round((confidence || 0.81) * 100)
  const color = value >= 80 ? '#22c55e' 
              : value >= 60 ? '#EF9F27' 
              : '#E24B4A'
  const quality = value >= 80 ? 'EXCELLENT' 
                : value >= 60 ? 'ACCEPTABLE' 
                : 'LOW'

  return (
    <div style={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 12,
      padding: '8px 4px'
    }}>
      
      {/* Panel header */}
      <div style={{
        fontSize: 9,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        color: 'var(--text-secondary)',
        alignSelf: 'flex-start',
        width: '100%'
      }}>
        Model Confidence
      </div>

      {/* Large gauge taking up most space */}
      <div style={{ 
        width: '85%', 
        maxWidth: 140,
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            trailColor: '#1e2130',
            backgroundColor: 'transparent',
            pathTransitionDuration: 1.5,
            textSize: '20px',
          })}
        />
      </div>

      {/* Quality label */}
      <div style={{ 
        fontSize: 11, 
        fontWeight: 600,
        color: color,
        letterSpacing: '0.1em',
        textTransform: 'uppercase'
      }}>
        {quality}
      </div>

      {/* Additional stats below gauge */}
      <div style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 6,
        borderTop: '0.5px solid var(--sidebar-border)',
        paddingTop: 8
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: 10,
          color: 'var(--text-secondary)'
        }}>
          <span>Model</span>
          <span style={{ color: 'var(--text-primary)', 
                         fontFamily: 'monospace' }}>
            U-Net ResNet-50
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: 10,
          color: 'var(--text-secondary)'
        }}>
          <span>Dataset</span>
          <span style={{ color: 'var(--text-primary)',
                         fontFamily: 'monospace' }}>
            xBD · DoD
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: 10,
          color: 'var(--text-secondary)'
        }}>
          <span>Classes</span>
          <span style={{ color: 'var(--text-primary)',
                         fontFamily: 'monospace' }}>
            4 damage types
          </span>
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          fontSize: 10,
          color: 'var(--text-secondary)'
        }}>
          <span>Params</span>
          <span style={{ color: 'var(--text-primary)',
                         fontFamily: 'monospace' }}>
            ~32M
          </span>
        </div>
      </div>
    </div>
  )
}

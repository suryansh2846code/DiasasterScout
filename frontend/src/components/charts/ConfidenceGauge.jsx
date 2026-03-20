import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const ConfidenceGauge = ({ confidence }) => {
  const value = Math.round((confidence || 0.81) * 100);
  
  let color = '#22c55e';
  let label = 'EXCELLENT';
  if (value < 60) {
    color = '#E24B4A';
    label = 'LOW';
  } else if (value < 80) {
    color = '#EF9F27';
    label = 'ACCEPTABLE';
  }

  return (
    <div className="flex flex-col h-full justify-center items-center">
      <div style={{ width: 90, height: 90, margin: '0 auto' }}>
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            pathColor: color,
            textColor: color,
            trailColor: '#1e2130',
            backgroundColor: 'transparent',
            pathTransitionDuration: 1.5,
            textSize: '22px'
          })}
        />
      </div>
      <div style={{ 
        fontSize: '9px', 
        textTransform: 'uppercase', 
        color: 'var(--text-secondary)', 
        letterSpacing: '0.08em', 
        textAlign: 'center',
        marginTop: '12px'
      }}>
        MODEL CONFIDENCE
      </div>
      <div style={{ 
        fontSize: '10px', 
        fontWeight: 500, 
        color: color,
        marginTop: '2px'
      }}>
        {label}
      </div>
    </div>
  );
};

export default ConfidenceGauge;

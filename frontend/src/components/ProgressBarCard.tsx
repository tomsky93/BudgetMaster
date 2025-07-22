import React from 'react';
import { Card } from 'primereact/card';
import { ProgressBar } from 'primereact/progressbar';
import { Money } from './Money';

interface Props {
  label: string;
  utilization: number; 
  remaining: number;
}

export const ProgressBarCard: React.FC<Props> = ({
  label,
  utilization,
  remaining,
}) => (
  <Card className="w-full bg-white shadow rounded-lg p-2">
    <div className="flex justify-between items-center">
      <h6 className="text-xl">{label}</h6>
      <small className="text-sm text-gray-500">
        {utilization.toFixed(1)}% used
      </small>
    </div>
    <ProgressBar
      value={utilization}
      showValue={false}
      style={{ height: '8px', borderRadius: '12px' }}
      className="bg-gray-200 mt-1"
    />
    <div className="flex justify-end mt-1">
      <small className="text-sm text-gray-500">
        <Money amount={remaining} /> remaining
      </small>
    </div>
  </Card>
);
import { ArrowDown,ArrowUp } from 'lucide-react';
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface KpiCardProps {
  title: string;
  value: string;
  change: number;
  changeType?: 'increase_is_good' | 'decrease_is_good';
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, changeType = 'increase_is_good' }) => {
  const isPositive = change >= 0;
  const ChangeIcon = isPositive ? ArrowUp : ArrowDown;
  
  let textColorClass = 'text-gray-500'; // Neutral for 0 change
  if (change !== 0) {
    if (changeType === 'increase_is_good') {
      textColorClass = isPositive ? 'text-green-500' : 'text-red-500';
    } else {
      textColorClass = isPositive ? 'text-red-500' : 'text-green-500';
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <p className={`text-xs ${textColorClass} flex items-center`}>
          <ChangeIcon className="h-4 w-4 mr-1" />
          {change.toFixed(2)}% em relação ao período anterior
        </p>
      </CardContent>
    </Card>
  );
};

export default KpiCard;

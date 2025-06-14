import React from 'react';
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer,Tooltip, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeSeriesDataPoint } from '@/types/common';

interface RoiChartProps {
  title: string;
  data: TimeSeriesDataPoint[];
  dataKeyX: string;
  dataKeyY: string;
  lineColor: string;
}

const RoiChart: React.FC<RoiChartProps> = ({ title, data, dataKeyX, dataKeyY, lineColor }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey={dataKeyX} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKeyY} stroke={lineColor} activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default RoiChart;

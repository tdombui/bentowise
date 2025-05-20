'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { ChartColumn } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';

interface Job {
  id: string;
  estimated_price: number;
  completion_date: string | null;
}

export default function IncomeChart() {
  const [chartData, setChartData] = useState<{ date: string; displayDate: string; total: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedJobs = async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('id, estimated_price, completion_date')
        .eq('status', 'Completed');

      if (error) {
        console.error('Error fetching completed jobs:', error);
        setLoading(false);
        return;
      }

      const today = new Date();
      const fiveDaysAgo = subDays(today, 4);

      const days = eachDayOfInterval({ start: fiveDaysAgo, end: today });
      const revenueByDate: Record<string, { date: string; displayDate: string; total: number }> = {};

      days.forEach(day => {
        const isoKey = format(day, 'yyyy-MM-dd');
        revenueByDate[isoKey] = {
          date: isoKey,
          displayDate: format(day, 'MMMM d'),  // ✅ Full date format like "May 14"
          total: 0,
        };
      });

      (data || []).forEach((job: Job) => {
        if (!job.completion_date) return;
        try {
          const jobDate = format(new Date(job.completion_date), 'yyyy-MM-dd');
          if (revenueByDate[jobDate]) {
            revenueByDate[jobDate].total += job.estimated_price || 0;
          }
        } catch (err) {
          console.error('Invalid completion_date format for job:', job);
        }
      });
      setChartData(Object.values(revenueByDate));
      setLoading(false);
    };
    fetchCompletedJobs();
  }, []);

  const currencyFormatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const { displayDate, total } = payload[0].payload;
      return (
        <div className="bg-white p-2 border rounded shadow">
          <p className="text-black font-semibold">{displayDate}</p>
          <p className="text-emerald-600 font-bold">{currencyFormatter.format(total)}</p>
        </div>
      );
    }
    return null;
  };

  if (loading) return <p>Loading chart...</p>;
  if (chartData.length === 0) return <p>No completed jobs to display.</p>;

  const todayFormatted = format(new Date(), 'MMMM d, yyyy');

  return (
    <div className="border p-4 rounded-xl shadow h-[400px] flex flex-col select-none">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <ChartColumn className="mr-2" />
          <h2 className="text-xl font-semibold">Daily Income</h2>
        </div>
        <span className="text-sm text-gray-400 select-none">last 5 days</span>
      </div>
      <div className="flex-1">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 20, left: 30, bottom: 30 }}
          >
            <XAxis
              dataKey="displayDate"
              interval={0}
              angle={-45}
              dx={-20}
              dy={20}
            />
            <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

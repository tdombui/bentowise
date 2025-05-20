'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, startOfYear, subYears, parseISO, isAfter } from 'date-fns';
import { ChartSpline } from 'lucide-react';


interface Job {
    id: string;
    estimated_price: number;
    completion_date: string | null;
}

type RangeOption = 'ytd' | '1y' | 'max';

export default function TotalIncomeTrendChart() {
    const [chartData, setChartData] = useState<{ date: string; total: number }[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedRange, setSelectedRange] = useState<RangeOption>('ytd');

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

            const jobs: Job[] = (data || []).filter(job => job.completion_date);
            const processedData = jobs.map(job => ({
                date: format(parseISO(job.completion_date!), 'yyyy-MM'),
                total: job.estimated_price || 0,
            }));

            // Aggregate totals by month
            const totalsByMonth: Record<string, number> = {};
            processedData.forEach(({ date, total }) => {
                totalsByMonth[date] = (totalsByMonth[date] || 0) + total;
            });

            const formattedData = Object.entries(totalsByMonth)
                .map(([date, total]) => ({ date, total }))
                .sort((a, b) => (a.date > b.date ? 1 : -1));

            setChartData(formattedData);
            setLoading(false);
        };

        fetchCompletedJobs();
    }, []);

    const filterDataByRange = () => {
        const today = new Date();
        let startDate: Date;

        if (selectedRange === 'ytd') {
            startDate = startOfYear(today);
        } else if (selectedRange === '1y') {
            startDate = subYears(today, 1);
        } else {
            return chartData; // max range
        }

        return chartData.filter(item => {
            const itemDate = parseISO(item.date + '-01');
            return isAfter(itemDate, startDate);
        });
    };

    const filteredData = filterDataByRange();

    const currencyFormatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
    });

    const totalIncome = filteredData.reduce((sum, item) => sum + item.total, 0);

    const CustomTooltip = ({ active, payload }: any) => {
        if (active && payload && payload.length) {
            const { date, total } = payload[0].payload;
            return (
                <div className="bg-white p-2 border rounded shadow">
                    <p className="text-black font-semibold">{date}</p>
                    <p className="text-emerald-600 font-bold">{currencyFormatter.format(total)}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) return <p>Loading chart...</p>;
    if (chartData.length === 0) return <p>No income data available.</p>;

    return (
        <div className="border p-4 rounded-xl shadow h-[460px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">

                    <ChartSpline className="mr-2" />
                    <h2 className="text-xl font-semibold">Total Income Trend</h2></div>
                <div className="space-x-2">
                    <button
                        onClick={() => setSelectedRange('ytd')}
                        className={`text-sm px-2 py-1 rounded ${selectedRange === 'ytd' ? 'bg-blue-600 text-white' : 'bg-neutral-300'}`}
                    >
                        YTD
                    </button>
                    <button
                        onClick={() => setSelectedRange('1y')}
                        className={`text-sm px-2 py-1 rounded ${selectedRange === '1y' ? 'bg-blue-600 text-white' : 'bg-neutral-300'}`}
                    >
                        1 Year
                    </button>
                    <button
                        onClick={() => setSelectedRange('max')}
                        className={`text-sm px-2 py-1 rounded ${selectedRange === 'max' ? 'bg-blue-600 text-white' : 'bg-neutral-300'}`}
                    >
                        Max
                    </button>
                </div>
            </div>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={filteredData} margin={{ top: 30, right: 20, left: 30, bottom: 30 }}>
                        <XAxis
                            dataKey="date"
                            interval={0}
                            angle={-45}
                            dx={-20}
                            dy={20}
                        />                        <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="total" stroke="#10B981" strokeWidth={2} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center text-lg font-bold">
                Total: {currencyFormatter.format(totalIncome)}
            </div>
        </div>
    );
}

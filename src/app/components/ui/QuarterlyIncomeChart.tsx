'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import { ChartColumn } from 'lucide-react';
import Link from 'next/link';

interface Job {
    id: string;
    estimated_price: number;
    completion_date: string | null;
}

function getQuarter(date: Date): string {
    const quarter = Math.floor(date.getMonth() / 3) + 1;
    return `Q${quarter} ${date.getFullYear()}`; // Example: "Q2 2025"
}

export default function QuarterlyIncomeChart() {
    const [chartData, setChartData] = useState<{ quarter: string; total: number }[]>([]);
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
            const ninetyDaysAgo = subDays(today, 89);

            const totalsByQuarter: Record<string, number> = {};

            (data || []).forEach((job: Job) => {
                if (!job.completion_date) return;
                const date = new Date(job.completion_date);
                if (date >= ninetyDaysAgo && date <= today) {
                    const quarterKey = getQuarter(date);
                    totalsByQuarter[quarterKey] = (totalsByQuarter[quarterKey] || 0) + (job.estimated_price || 0);
                }
            });

            const formattedData = Object.entries(totalsByQuarter).map(([quarter, total]) => ({ quarter, total }));
            setChartData(formattedData);
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
            const { quarter, total } = payload[0].payload;
            return (
                <div className="bg-white p-2 border rounded shadow">
                    <p className="text-black font-semibold">{quarter}</p>
                    <p className="text-emerald-600 font-bold">{currencyFormatter.format(total)}</p>
                </div>
            );
        }
        return null;
    };

    if (loading) return <p>Loading chart...</p>;
    if (chartData.length === 0) return <p>No income recorded in the past 3 months.</p>;

    const totalIncome = chartData.reduce((sum, item) => sum + item.total, 0);

    return (
        <div className="border p-4 rounded-xl shadow h-[460px] flex flex-col">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                    <ChartColumn className="mr-2" />
                    <h2 className="text-xl font-semibold">Quarterly Income</h2>
                </div>
                <Link
                    href="/sales"
                    className="text-sm text-blue-500 underline hover:text-blue-400"
                >
                    View Sales
                </Link>
            </div>
            <div className="flex-1">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 30, right: 20, left: 30, bottom: 30 }}>
                        <XAxis dataKey="quarter" />
                        <YAxis tickFormatter={(value) => currencyFormatter.format(value)} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="total" fill="#10B981" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4 text-center text-lg font-bold">
                Total: {currencyFormatter.format(totalIncome)}
            </div>
        </div>
    );
}

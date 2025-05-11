import {
  RadialBarChart, RadialBar, Legend, Tooltip, ResponsiveContainer,
} from 'recharts'

export default function OrdersRadialChart({ stats }) {
  const data = [
    { name: 'جديدة', value: stats.counts.newOrders, fill: '#facc15' },
    { name: 'مؤكدة', value: stats.counts.confirmed, fill: '#14b8a6' },
    { name: 'بانتظار التأكيد', value: stats.counts.pendingConfirm, fill: '#a855f7' },
  ]

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart cx="50%" cy="50%" innerRadius="30%" outerRadius="90%" data={data} startAngle={180} endAngle={0}>
          <RadialBar minAngle={15} background clockWise dataKey="value" />
          <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" align="center" />
          <Tooltip />
        </RadialBarChart>
      </ResponsiveContainer>
    </div>
  )
}

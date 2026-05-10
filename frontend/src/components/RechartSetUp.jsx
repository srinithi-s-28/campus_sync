import React from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { useTheme } from "../context/ThemeContext"

function RechartSetUp({ charts }) {
  if (!charts || charts.length === 0) return null

  const COLORS = ["#3b82f6", "#06b6d4", "#22c55e", "#f59e0b", "#ef4444"]

  return (
    <div className="space-y-8">
      {charts.map((chart, index) => (
        <div
          key={index}
          className="bg-slate-900/40 border border-blue-500/20 rounded-2xl p-5 shadow-lg"
        >
          {/* TITLE */}
          <h4 className="text-blue-200 font-semibold mb-4">
            {chart.title}
          </h4>

          <div className="w-full h-72">
            <ResponsiveContainer width="100%" height="100%">
              {/* BAR */}
              {chart.type === "bar" && (
                <BarChart data={chart.data}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                    {chart.data.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}

              {/* LINE */}
              {chart.type === "line" && (
                <LineChart data={chart.data}>
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#60a5fa"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                  />
                </LineChart>
              )}

              {/* PIE */}
              {chart.type === "pie" && (
                <PieChart>
                  <Tooltip />
                  <Pie
                    data={chart.data}
                    dataKey="value"
                    nameKey="name"
                    outerRadius={100}
                    label
                  >
                    {chart.data.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i % COLORS.length]}
                      />
                    ))}
                  </Pie>
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </div>
      ))}
    </div>
  )
}

export default RechartSetUp

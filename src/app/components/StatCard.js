export default function StatCard({ title, value, subtext, icon, color }) {
  // Couleurs de fond et de texte dynamiques
  const colorStyles = {
    indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
    yellow: 'bg-amber-50 text-amber-600 border-amber-100',
    green: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    red: 'bg-rose-50 text-rose-600 border-rose-100',
  }

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </p>
        <p className="text-3xl font-extrabold text-slate-900">{value}</p>
        {subtext && <p className="text-xs text-slate-400 mt-1">{subtext}</p>}
      </div>
      <div className={`p-3 rounded-xl border ${colorStyles[color] || colorStyles.indigo}`}>
        {icon}
      </div>
    </div>
  )
}
'use client'

import { useState } from 'react'

export default function WorkCalendarView({ shifts, calculateHours }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Navigation des mois
  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Calcul des jours du mois
  const firstDayOfMonth = new Date(year, month, 1)
  const lastDayOfMonth = new Date(year, month + 1, 0)
  const daysInMonth = lastDayOfMonth.getDate()

  // Décalage pour commencer la semaine le Lundi (0 = Lundi, 6 = Dimanche)
  let startingDay = firstDayOfMonth.getDay() - 1
  if (startingDay === -1) startingDay = 6

  // Grouper les shifts par date (YYYY-MM-DD)
  const shiftsByDate = shifts.reduce((acc, shift) => {
    const dateKey = shift.work_date.split('T')[0]
    if (!acc[dateKey]) acc[dateKey] = []
    acc[dateKey].push(shift)
    return acc
  }, {})

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ]

  const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

  return (
    <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
      {/* En-tête du calendrier */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-800">
          {monthNames[month]} {year}
        </h2>
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={prevMonth}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold transition"
          >
            ← Mois préc.
          </button>
          <button
            type="button"
            onClick={() => setCurrentDate(new Date())}
            className="px-3 py-1.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition"
          >
            Aujourd'hui
          </button>
          <button
            type="button"
            onClick={nextMonth}
            className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-semibold transition"
          >
            Mois suiv. →
          </button>
        </div>
      </div>

      {/* Grille du calendrier */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {/* En-têtes jours de la semaine */}
        {weekDays.map((day) => (
          <div key={day} className="py-2 text-xs font-bold text-slate-400 uppercase">
            {day}
          </div>
        ))}

        {/* Cases vides du début de mois */}
        {Array.from({ length: startingDay }).map((_, i) => (
          <div key={`empty-${i}`} className="h-24 bg-slate-50/50 rounded-lg border border-slate-100" />
        ))}

        {/* Jours du mois */}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const dayNum = i + 1
          const monthStr = String(month + 1).padStart(2, '0')
          const dayStr = String(dayNum).padStart(2, '0')
          const dateString = `${year}-${monthStr}-${dayStr}`
          
          const dayShifts = shiftsByDate[dateString] || []
          const isToday =
            new Date().toDateString() === new Date(year, month, dayNum).toDateString()

          return (
            <div
              key={dateString}
              className={`h-24 p-1.5 border rounded-lg flex flex-col justify-between overflow-hidden text-left transition ${
                isToday
                  ? 'border-indigo-500 bg-indigo-50/30'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
            >
              <div className="flex justify-between items-center">
                <span
                  className={`text-xs font-bold ${
                    isToday
                      ? 'bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center'
                      : 'text-slate-700'
                  }`}
                >
                  {dayNum}
                </span>
                {dayShifts.length > 0 && (
                  <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">
                    {dayShifts
                      .reduce(
                        (acc, s) =>
                          acc +
                          parseFloat(
                            calculateHours(s.start_time, s.end_time, s.break_duration_minutes)
                          ),
                        0
                      )
                      .toFixed(1)}h
                  </span>
                )}
              </div>

              {/* Sessions du jour */}
              <div className="space-y-1 overflow-y-auto max-h-14">
                {dayShifts.map((shift) => (
                  <div
                    key={shift.id}
                    className="p-1 text-[10px] bg-emerald-50 border border-emerald-200 text-emerald-900 rounded truncate"
                    title={`${shift.applications?.company_name || 'Contrat'} (${shift.start_time?.slice(0, 5)}-${shift.end_time?.slice(0, 5)}) : ${shift.notes || 'Pas de note'}`}
                  >
                    <p className="font-semibold truncate">
                      {shift.applications?.company_name}
                    </p>
                    <p className="text-emerald-700">
                      {shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import WorkCalendarView from '../components/WorkCalendarView'

export default function WorkLogPage() {
  const [shifts, setShifts] = useState([])
  const [acceptedApps, setAcceptedApps] = useState([])
  const [loading, setLoading] = useState(true)
  const [viewMode, setViewMode] = useState('calendar') // 'calendar' ou 'table'

  const [form, setForm] = useState({
    application_id: '',
    work_date: new Date().toISOString().split('T')[0],
    start_time: '09:00',
    end_time: '17:00',
    break_duration_minutes: 60,
    notes: '',
  })

  const fetchData = async () => {
    setLoading(true)

    const { data: apps } = await supabase
      .from('applications')
      .select('id, company_name, position_title')
      .eq('status', 'Accepté')

    const { data: shiftData } = await supabase
      .from('work_shifts')
      .select('*, applications(company_name, position_title)')
      .order('work_date', { ascending: false })

    setAcceptedApps(apps || [])
    setShifts(shiftData || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const calculateHours = (start, end, pauseMinutes) => {
    if (!start || !end) return '0.00'
    const [h1, m1] = start.split(':').map(Number)
    const [h2, m2] = end.split(':').map(Number)
    const totalMinutes = (h2 * 60 + m2) - (h1 * 60 + m1) - (pauseMinutes || 0)
    return (totalMinutes / 60).toFixed(2)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('work_shifts').insert([form])
    if (!error) {
      setForm({ ...form, notes: '' })
      fetchData()
    }
  }

  const totalHoursWorked = shifts
    .reduce((acc, shift) => {
      return acc + parseFloat(calculateHours(shift.start_time, shift.end_time, shift.break_duration_minutes))
    }, 0)
    .toFixed(2)

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="pb-4 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Agenda Post-Acceptation</h1>
          <p className="text-slate-500 text-sm">Saisissez vos heures effectuées sur vos contrats acceptés.</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-right">
          <p className="text-xs text-emerald-700 font-semibold uppercase">Total Travaillé</p>
          <p className="text-2xl font-extrabold text-emerald-900">{totalHoursWorked} h</p>
        </div>
      </header>

      {/* Saisie d'une journée de travail */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-md font-semibold text-slate-800">Enregistrer des heures de travail</h2>

        {acceptedApps.length === 0 ? (
          <p className="text-amber-600 text-xs bg-amber-50 p-3 rounded-lg border border-amber-200">
            Aucune candidature n'a le statut "Accepté". Seules les offres validées peuvent recevoir des heures de travail.
          </p>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Contrat concerné *</label>
                <select
                  required
                  value={form.application_id}
                  onChange={(e) => setForm({ ...form, application_id: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
                >
                  <option value="">Sélectionner l'entreprise</option>
                  {acceptedApps.map((app) => (
                    <option key={app.id} value={app.id}>
                      {app.company_name} ({app.position_title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Date *</label>
                <input
                  type="date"
                  required
                  value={form.work_date}
                  onChange={(e) => setForm({ ...form, work_date: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Pause (minutes)</label>
                <input
                  type="number"
                  value={form.break_duration_minutes}
                  onChange={(e) => setForm({ ...form, break_duration_minutes: parseInt(e.target.value, 10) || 0 })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Heure de début</label>
                <input
                  type="time"
                  required
                  value={form.start_time}
                  onChange={(e) => setForm({ ...form, start_time: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Heure de fin</label>
                <input
                  type="time"
                  required
                  value={form.end_time}
                  onChange={(e) => setForm({ ...form, end_time: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Notes / Tâches effectuées</label>
                <input
                  type="text"
                  placeholder="Ex: Formation, Projet client..."
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
              >
                Enregistrer la session
              </button>
            </div>
          </>
        )}
      </form>

      {/* Switch Vue Calendrier / Vue Tableau */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Suivi du temps</h2>
        <div className="bg-slate-200 p-1 rounded-lg flex space-x-1">
          <button
            type="button"
            onClick={() => setViewMode('calendar')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              viewMode === 'calendar'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vue Calendrier
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${
              viewMode === 'table'
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Vue Tableau
          </button>
        </div>
      </div>

      {/* Rendu dynamique */}
      {viewMode === 'calendar' ? (
        <WorkCalendarView shifts={shifts} calculateHours={calculateHours} />
      ) : (
        <section className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-semibold">
              <tr>
                <th className="p-3">Date</th>
                <th className="p-3">Entreprise</th>
                <th className="p-3">Horaires</th>
                <th className="p-3">Pause</th>
                <th className="p-3">Durée Net</th>
                <th className="p-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-slate-800">
              {loading ? (
                <tr><td colSpan={6} className="p-4 text-slate-500">Chargement...</td></tr>
              ) : shifts.length === 0 ? (
                <tr><td colSpan={6} className="p-4 text-center text-slate-400">Aucune session enregistrée.</td></tr>
              ) : (
                shifts.map((shift) => (
                  <tr key={shift.id} className="hover:bg-slate-50">
                    <td className="p-3 font-medium">
                      {new Date(shift.work_date).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="p-3">{shift.applications?.company_name}</td>
                    <td className="p-3 text-slate-600">
                      {shift.start_time?.slice(0, 5)} - {shift.end_time?.slice(0, 5)}
                    </td>
                    <td className="p-3 text-slate-500">{shift.break_duration_minutes} min</td>
                    <td className="p-3 font-bold text-emerald-700">
                      {calculateHours(shift.start_time, shift.end_time, shift.break_duration_minutes)} h
                    </td>
                    <td className="p-3 text-slate-500 text-xs">{shift.notes || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </section>
      )}
    </div>
  )
}
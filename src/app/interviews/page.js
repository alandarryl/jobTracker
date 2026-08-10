'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    application_id: '',
    interview_type: 'Entretien RH',
    event_date: '',
    location_or_link: '',
    notes: '',
  })

  const fetchData = async () => {
    setLoading(true)
    
    // Récupération des entretiens avec jointure sur la candidature
    const { data: interviewData } = await supabase
      .from('interviews')
      .select('*, applications(company_name, position_title)')
      .order('event_date', { ascending: true })

    // Récupération des candidatures pour la liste déroulante
    const { data: appData } = await supabase
      .from('applications')
      .select('id, company_name, position_title')

    setInterviews(interviewData || [])
    setApplications(appData || [])
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const { error } = await supabase.from('interviews').insert([form])
    if (!error) {
      setForm({
        application_id: '',
        interview_type: 'Entretien RH',
        event_date: '',
        location_or_link: '',
        notes: '',
      })
      fetchData()
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <header className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Suivi des Entretiens</h1>
        <p className="text-slate-500 text-sm">Planifiez et préparez vos étapes de recrutement.</p>
      </header>

      {/* Formulaire de planification */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-md font-semibold text-slate-800">Planifier un entretien</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Candidature *</label>
            <select
              required
              value={form.application_id}
              onChange={(e) => setForm({ ...form, application_id: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
            >
              <option value="">Sélectionner une entreprise</option>
              {applications.map((app) => (
                <option key={app.id} value={app.id}>
                  {app.company_name} — {app.position_title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Type d'entretien</label>
            <select
              value={form.interview_type}
              onChange={(e) => setForm({ ...form, interview_type: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
            >
              <option value="Entretien RH">Entretien RH</option>
              <option value="Test Technique">Test Technique</option>
              <option value="Entretien Manager">Entretien Manager</option>
              <option value="Entretien Final">Entretien Final</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Date et Heure *</label>
            <input
              type="datetime-local"
              required
              value={form.event_date}
              onChange={(e) => setForm({ ...form, event_date: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Lien Visio ou Adresse</label>
            <input
              type="text"
              placeholder="https://meet.google.com/... ou adresse"
              value={form.location_or_link}
              onChange={(e) => setForm({ ...form, location_or_link: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes / Préparation</label>
            <input
              type="text"
              placeholder="Questions à poser, points à aborder..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg">
            Ajouter au calendrier
          </button>
        </div>
      </form>

      {/* Liste Chronologique des entretiens */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-slate-800">Prochains Entretiens</h2>
        {loading ? (
          <p className="text-slate-500 text-sm">Chargement...</p>
        ) : interviews.length === 0 ? (
          <p className="text-slate-400 text-sm italic">Aucun entretien planifié pour le moment.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {interviews.map((item) => {
              const dateObj = new Date(item.event_date)
              return (
                <div key={item.id} className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm flex space-x-4">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 text-center min-w-[70px] flex flex-col justify-center">
                    <span className="text-xs font-bold uppercase text-indigo-600">
                      {dateObj.toLocaleDateString('fr-FR', { month: 'short' })}
                    </span>
                    <span className="text-xl font-extrabold text-indigo-900">
                      {dateObj.getDate()}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-slate-900">{item.applications?.position_title}</h3>
                      <span className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        {item.interview_type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 font-medium">{item.applications?.company_name}</p>
                    <p className="text-xs text-indigo-600 font-semibold">
                      🕒 {dateObj.toLocaleTimeString('fr-FR', { hour: '2d', minute: '2d' })}
                    </p>
                    {item.location_or_link && (
                      <p className="text-xs text-slate-600 truncate">📍 {item.location_or_link}</p>
                    )}
                    {item.notes && <p className="text-xs text-slate-400 italic">"{item.notes}"</p>}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
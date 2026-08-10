'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getDaysSince, getFeedbackStatus } from '../lib/dateUtils'
import EditJobModal from './EditJobModal'

export default function JobTable() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedApp, setSelectedApp] = useState(null)

  const fetchApplications = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('applied_at', { ascending: false })

    if (error) {
      console.error('Erreur Supabase :', error.message)
    } else {
      setApplications(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchApplications()
  }, [])

  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id)

    if (!error) fetchApplications()
  }

  const handleDelete = async (id, company) => {
    if (window.confirm(`Voulez-vous vraiment supprimer la candidature pour "${company}" ?`)) {
      const { error } = await supabase.from('applications').delete().eq('id', id)
      if (!error) fetchApplications()
    }
  }

  if (loading) return <p className="p-4 text-slate-500">Chargement de vos candidatures...</p>

  if (applications.length === 0) {
    return (
      <div className="p-6 text-center text-slate-500 border rounded-xl bg-white">
        Aucune candidature enregistrée pour le moment.
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto w-full shadow-sm rounded-xl border border-slate-200">
        <table className="min-w-full bg-white text-left text-sm">
          <thead className="bg-slate-100 text-slate-700 uppercase text-xs font-semibold">
            <tr>
              <th className="p-3">Entreprise / Poste</th>
              <th className="p-3">Contrat</th>
              <th className="p-3">Liens & Contact</th>
              <th className="p-3">Statut</th>
              <th className="p-3">Dépôt CV</th>
              <th className="p-3">Attente</th>
              <th className="p-3">Suivi Retour</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 text-slate-800">
            {applications.map((app) => {
              const daysSince = getDaysSince(app.applied_at)
              const feedback = getFeedbackStatus(app.applied_at, app.expected_feedback_days)

              return (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-3 font-medium">
                    <div className="text-slate-900 font-semibold">{app.position_title}</div>
                    <div className="text-xs text-slate-500">{app.company_name}</div>
                  </td>

                  <td className="p-3">
                    <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 text-xs font-medium border border-slate-300">
                      {app.contract_type}
                    </span>
                  </td>

                  {/* NOUVELLE COLONNE: Liens et Email */}
                  <td className="p-3">
                    <div className="flex items-center space-x-2">
                      {app.job_link ? (
                        <a
                          href={app.job_link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-indigo-600 hover:text-indigo-800 bg-indigo-50 p-1.5 rounded-md transition-colors"
                          title="Ouvrir le lien de l'offre"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      ) : (
                        <span className="text-xs text-slate-300">-</span>
                      )}

                      {app.contact_email ? (
                        <a
                          href={`mailto:${app.contact_email}`}
                          className="text-emerald-600 hover:text-emerald-800 bg-emerald-50 p-1.5 rounded-md transition-colors"
                          title={`Envoyer un email à ${app.contact_email}`}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </a>
                      ) : null}
                    </div>
                  </td>

                  <td className="p-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className={`px-2 py-1 rounded-full text-xs font-bold border-none outline-none cursor-pointer ${
                        app.status === 'Accepté'
                          ? 'bg-emerald-100 text-emerald-800'
                          : app.status === 'Rejeté'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      <option value="En attente">En attente</option>
                      <option value="Accepté">Accepté</option>
                      <option value="Rejeté">Rejeté</option>
                    </select>
                  </td>

                  <td className="p-3 text-slate-600">
                    {new Date(app.applied_at).toLocaleDateString('fr-FR')}
                  </td>

                  <td className="p-3 font-medium">
                    {daysSince === 0 ? "Aujourd'hui" : `${daysSince} j`}
                  </td>

                  <td className="p-3">
                    {app.status === 'En attente' ? (
                      <span
                        className={`text-xs px-2 py-1 rounded font-medium ${
                          feedback.alert
                            ? 'bg-rose-100 text-rose-700 font-bold border border-rose-200'
                            : 'bg-blue-50 text-blue-700'
                        }`}
                      >
                        {feedback.text}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-400">Terminé</span>
                    )}
                  </td>

                  <td className="p-3 text-right space-x-2 whitespace-nowrap">
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      title="Éditer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>

                    <button
                      onClick={() => handleDelete(app.id, app.company_name)}
                      className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Supprimer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {selectedApp && (
        <EditJobModal
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onUpdated={fetchApplications}
        />
      )}
    </>
  )
}
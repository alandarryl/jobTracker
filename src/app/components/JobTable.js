'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { getDaysSince, getFeedbackStatus } from '../lib/dateUtils'

export default function JobTable() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)

  // Récupération des candidatures depuis Supabase
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

  // Mettre à jour le statut directement dans le tableau
  const handleStatusChange = async (id, newStatus) => {
    const { error } = await supabase
      .from('applications')
      .update({ status: newStatus })
      .eq('id', id)

    if (error) {
      console.error('Erreur mise à jour :', error.message)
    } else {
      // Recharger la liste pour refléter le changement
      fetchApplications()
    }
  }

  if (loading) {
    return <p className="p-4 text-gray-500">Chargement de vos candidatures...</p>
  }

  if (applications.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500 border rounded-lg bg-gray-50">
        Aucune candidature enregistrée pour le moment.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto w-full shadow-sm rounded-lg border border-gray-200">
      <table className="min-w-full bg-white text-left text-sm">
        <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
          <tr>
            <th className="p-3">Entreprise / Poste</th>
            <th className="p-3">Contrat</th>
            <th className="p-3">Statut</th>
            <th className="p-3">Dépôt du CV</th>
            <th className="p-3">Durée d'attente</th>
            <th className="p-3">Suivi de retour</th>
            <th className="p-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 text-gray-800">
          {applications.map((app) => {
            const daysSince = getDaysSince(app.applied_at)
            const feedback = getFeedbackStatus(app.applied_at, app.expected_feedback_days)

            return (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                {/* Entreprise & Poste */}
                <td className="p-3 font-medium">
                  <div className="text-gray-900 font-semibold">{app.position_title}</div>
                  <div className="text-xs text-gray-500">{app.company_name}</div>
                </td>

                {/* Type de contrat */}
                <td className="p-3">
                  <span className="px-2 py-1 rounded bg-gray-100 text-gray-700 text-xs font-medium border border-gray-300">
                    {app.contract_type}
                  </span>
                </td>

                {/* Statut avec badge couleur */}
                <td className="p-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      app.status === 'Accepté'
                        ? 'bg-green-100 text-green-800'
                        : app.status === 'Rejeté'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {app.status}
                  </span>
                </td>

                {/* Date d'envoi */}
                <td className="p-3 text-gray-600">
                  {new Date(app.applied_at).toLocaleDateString('fr-FR')}
                </td>

                {/* Temps écoulé depuis le dépôt */}
                <td className="p-3 font-medium">
                  {daysSince === 0 ? "Aujourd'hui" : `${daysSince} jour(s)`}
                </td>

                {/* Suivi retour & alerte */}
                <td className="p-3">
                  {app.status === 'En attente' ? (
                    <span
                      className={`text-xs px-2 py-1 rounded font-medium ${
                        feedback.alert
                          ? 'bg-red-100 text-red-700 font-bold border border-red-200'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {feedback.text}
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">Terminé</span>
                  )}
                </td>

                {/* Changement rapide de statut */}
                <td className="p-3">
                  <select
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className="border border-gray-300 rounded p-1 text-xs bg-white text-gray-700"
                  >
                    <option value="En attente">En attente</option>
                    <option value="Accepté">Accepté</option>
                    <option value="Rejeté">Rejeté</option>
                  </select>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function EditJobModal({ application, onClose, onUpdated }) {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    company_name: application.company_name || '',
    position_title: application.position_title || '',
    contract_type: application.contract_type || 'Stage',
    status: application.status || 'En attente',
    applied_at: application.applied_at || '',
    expected_feedback_days: application.expected_feedback_days || 14,
    job_link: application.job_link || '',            // Nouveau champ
    contact_email: application.contact_email || '',  // Nouveau champ
    notes: application.notes || '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase
      .from('applications')
      .update(form)
      .eq('id', application.id)

    setLoading(false)

    if (!error) {
      onUpdated()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-bold text-slate-800">Modifier la candidature</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 font-bold">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Entreprise</label>
              <input
                type="text"
                required
                value={form.company_name}
                onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Poste</label>
              <input
                type="text"
                required
                value={form.position_title}
                onChange={(e) => setForm({ ...form, position_title: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Lien de l'offre</label>
              <input
                type="url"
                value={form.job_link}
                onChange={(e) => setForm({ ...form, job_link: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Email recruteur</label>
              <input
                type="email"
                value={form.contact_email}
                onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Contrat</label>
              <select
                value={form.contract_type}
                onChange={(e) => setForm({ ...form, contract_type: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
              >
                <option value="Job étudiant">Job étudiant</option>
                <option value="Stage">Stage</option>
                <option value="Alternance">Alternance</option>
                <option value="Intérim">Intérim</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Statut</label>
              <select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm bg-white"
              >
                <option value="En attente">En attente</option>
                <option value="Accepté">Accepté</option>
                <option value="Rejeté">Rejeté</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Date d'envoi</label>
              <input
                type="date"
                required
                value={form.applied_at}
                onChange={(e) => setForm({ ...form, applied_at: e.target.value })}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Délai retour (jours)</label>
              <input
                type="number"
                value={form.expected_feedback_days}
                onChange={(e) => setForm({ ...form, expected_feedback_days: parseInt(e.target.value) || 0 })}
                className="w-full border border-slate-300 rounded-lg p-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Notes</label>
            <textarea
              rows="2"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2 text-sm"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-300 text-slate-600 text-xs rounded-lg hover:bg-slate-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium rounded-lg disabled:opacity-50"
            >
              {loading ? 'Enregistrement...' : 'Sauvegarder'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
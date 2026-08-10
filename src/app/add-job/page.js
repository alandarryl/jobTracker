'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../lib/supabaseClient'

export default function AddJobPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const [form, setForm] = useState({
    company_name: '',
    position_title: '',
    contract_type: 'Stage',
    status: 'En attente',
    applied_at: new Date().toISOString().split('T')[0],
    expected_feedback_days: 14,
    job_link: '',        // Nouveau champ
    contact_email: '',   // Nouveau champ
    notes: '',
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    const { error } = await supabase.from('applications').insert([form])

    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    } else {
      router.push('/applications')
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <header className="pb-4 border-b border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900">Ajouter une candidature</h1>
        <p className="text-slate-500 text-sm">Renseignez les détails du poste auquel vous avez postulé.</p>
      </header>

      {errorMsg && (
        <div className="p-3 bg-red-100 border border-red-300 text-red-700 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Entreprise *</label>
            <input
              type="text"
              required
              placeholder="Ex: Google"
              value={form.company_name}
              onChange={(e) => setForm({ ...form, company_name: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Intitulé du poste *</label>
            <input
              type="text"
              required
              placeholder="Ex: Développeur Web"
              value={form.position_title}
              onChange={(e) => setForm({ ...form, position_title: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* NOUVEAUX CHAMPS: Lien & Contact Email */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Lien de l'offre</label>
            <input
              type="url"
              placeholder="https://..."
              value={form.job_link}
              onChange={(e) => setForm({ ...form, job_link: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email du contact / recruteur</label>
            <input
              type="email"
              placeholder="recruteur@entreprise.com"
              value={form.contact_email}
              onChange={(e) => setForm({ ...form, contact_email: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Type de contrat *</label>
            <select
              value={form.contract_type}
              onChange={(e) => setForm({ ...form, contract_type: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="Job étudiant">Job étudiant</option>
              <option value="Stage">Stage</option>
              <option value="Alternance">Alternance</option>
              <option value="Intérim">Intérim</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Statut initial</label>
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white focus:ring-2 focus:ring-indigo-500"
            >
              <option value="En attente">En attente</option>
              <option value="Accepté">Accepté</option>
              <option value="Rejeté">Rejeté</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Date d'envoi du CV *</label>
            <input
              type="date"
              required
              value={form.applied_at}
              onChange={(e) => setForm({ ...form, applied_at: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Délai de retour attendu (jours)</label>
            <input
              type="number"
              min="1"
              value={form.expected_feedback_days}
              onChange={(e) => setForm({ ...form, expected_feedback_days: parseInt(e.target.value) || 1 })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Notes / Remarques</label>
          <textarea
            rows="3"
            placeholder="Remarques complémentaires..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-indigo-500"
          ></textarea>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.push('/applications')}
            className="px-4 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg disabled:opacity-50"
          >
            {loading ? 'Enregistrement...' : 'Enregistrer la candidature'}
          </button>
        </div>
      </form>
    </div>
  )
}
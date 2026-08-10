'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabaseClient'
import StatCard from '../components/StatCard'

export default function DashboardPage() {
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
  })
  const [recentApplications, setRecentApplications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchDashboardData() {
      setLoading(true)

      // Récupération de toutes les candidatures pour le calcul des statistiques
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .order('applied_at', { ascending: false })

      if (error) {
        console.error('Erreur lors du chargement des statistiques :', error.message)
      } else if (data) {
        // Calcul des métriques
        const total = data.length
        const pending = data.filter((item) => item.status === 'En attente').length
        const accepted = data.filter((item) => item.status === 'Accepté').length
        const rejected = data.filter((item) => item.status === 'Rejeté').length

        setStats({ total, pending, accepted, rejected })
        // Garder les 5 plus récentes pour la section récapitulative
        setRecentApplications(data.slice(0, 5))
      }

      setLoading(false)
    }

    fetchDashboardData()
  }, [])

  // Calcul du taux d'acceptation (en %)
  const acceptanceRate =
    stats.total > 0 ? Math.round((stats.accepted / stats.total) * 100) : 0

  if (loading) {
    return <p className="p-4 text-slate-500">Chargement du tableau de bord...</p>
  }

  return (
    <div className="space-y-8">
      {/* En-tête */}
      <header className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Tableau de bord</h1>
          <p className="text-slate-500 text-sm">
            Vue d'ensemble et état de vos recherches d'emploi.
          </p>
        </div>
        <Link
          href="/add-job"
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-4 py-2 rounded-lg text-sm transition-colors flex items-center space-x-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          <span>Nouvelle candidature</span>
        </Link>
      </header>

      {/* Grille de cartes statistiques */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Envoyé"
          value={stats.total}
          subtext="Toutes catégories confondues"
          color="indigo"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          }
        />

        <StatCard
          title="En Attente"
          value={stats.pending}
          subtext="En attente de réponse"
          color="yellow"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Acceptées"
          value={stats.accepted}
          subtext={`${acceptanceRate}% de taux de succès`}
          color="green"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />

        <StatCard
          title="Refusées"
          value={stats.rejected}
          subtext="Candidatures sans suite"
          color="red"
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Aperçu des candidatures récentes */}
      <section className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-bold text-slate-800">Dernières candidatures</h2>
          <Link
            href="/applications"
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Voir tout →
          </Link>
        </div>

        {recentApplications.length === 0 ? (
          <p className="text-slate-400 text-sm py-4">Aucune candidature enregistrée pour l'instant.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {recentApplications.map((app) => (
              <div key={app.id} className="py-3 flex justify-between items-center text-sm">
                <div>
                  <p className="font-semibold text-slate-900">{app.position_title}</p>
                  <p className="text-xs text-slate-500">{app.company_name} • {app.contract_type}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                      app.status === 'Accepté'
                        ? 'bg-emerald-100 text-emerald-800'
                        : app.status === 'Rejeté'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(app.applied_at).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
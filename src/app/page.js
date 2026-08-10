'use client'

import { useState } from 'react'
import Sidebar from './components/Sidebar'
import JobTable from './components/JobTable'

export default function Home() {
  const [activePage, setActivePage] = useState('applications')

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar rétractable */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Contenu principal */}
      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Affichage conditionnel selon la page active */}
          {activePage === 'dashboard' && (
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Tableau de bord</h1>
              <p className="text-slate-500 text-sm">Vue globale de vos recherches.</p>
            </div>
          )}

          {activePage === 'applications' && (
            <div>
              <header className="flex justify-between items-center pb-4 mb-6 border-b border-slate-200">
                <div>
                  <h1 className="text-2xl font-bold text-slate-900">Mes Candidatures</h1>
                  <p className="text-slate-500 text-sm">
                    Suivi de vos réponses pour stages, alternances, jobs étudiants et intérim.
                  </p>
                </div>
              </header>

              {/* Composant Tableau */}
              <JobTable />
            </div>
          )}

          {activePage === 'stats' && (
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Statistiques</h1>
              <p className="text-slate-500 text-sm">Analyse du taux de réponse et délais.</p>
            </div>
          )}

          {activePage === 'settings' && (
            <div>
              <h1 className="text-2xl font-bold text-slate-800 mb-2">Paramètres</h1>
              <p className="text-slate-500 text-sm">Configuration de votre compte JobTrack.</p>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}
'use client'

import Link from 'next/link'
import JobTable from '../components/JobTable'

export default function ApplicationsPage() {
  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mes Candidatures</h1>
          <p className="text-slate-500 text-sm">
            Liste de vos candidatures enregistrées.
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

      <JobTable />
    </div>
  )
}
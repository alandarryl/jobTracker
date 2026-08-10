import './globals.css'
import Sidebar from './components/Sidebar'

export const metadata = {
  title: 'JobTrack',
  description: 'Suivi de mes candidatures',
}

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body className="bg-slate-50 text-slate-900 antialiased">
        <div className="flex min-h-screen">
          {/* Sidebar fixe à gauche */}
          <Sidebar />

          {/* Contenu dynamique des pages */}
          <main className="flex-1 p-8 overflow-y-auto">
            <div className="max-w-6xl mx-auto">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  )
}
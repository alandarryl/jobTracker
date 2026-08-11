'use client'

import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function ContactsPage() {
  const [contacts, setContacts] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState('Tous')

  const [form, setForm] = useState({
    name: '',
    company: '',
    type: "Agence d'intérim",
    email: '',
    phone: '',
    notes: '',
    last_contacted_at: '',
  })

  const fetchContacts = async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Erreur de chargement:', error.message)
    } else {
      setContacts(data || [])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchContacts()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrorMessage('')

    if (!form.name.trim()) {
      setErrorMessage('Le nom du contact est obligatoire.')
      return
    }

    setSubmitting(true)

    try {
      const payload = {
        name: form.name,
        company: form.company || null,
        type: form.type,
        email: form.email || null,
        phone: form.phone || null,
        notes: form.notes || null,
        last_contacted_at: form.last_contacted_at || null,
      }

      const { error } = await supabase.from('contacts').insert([payload])

      if (error) {
        console.error('Erreur Supabase lors de l\'insertion:', error)
        setErrorMessage(`Impossible d'enregistrer : ${error.message}`)
      } else {
        setForm({
          name: '',
          company: '',
          type: "Agence d'intérim",
          email: '',
          phone: '',
          notes: '',
          last_contacted_at: '',
        })
        await fetchContacts()
      }
    } catch (err) {
      console.error('Erreur inattendue:', err)
      setErrorMessage('Une erreur est survenue lors de l\'envoi.')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id) => {
    if (confirm('Voulez-vous vraiment supprimer ce contact ?')) {
      const { error } = await supabase.from('contacts').delete().eq('id', id)
      if (error) {
        alert(`Erreur de suppression: ${error.message}`)
      } else {
        fetchContacts()
      }
    }
  }

  const filteredContacts = contacts.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.company && c.company.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesType = selectedType === 'Tous' || c.type === selectedType
    return matchesSearch && matchesType
  })

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <header className="pb-4 border-b border-slate-200 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Annuaire de Contacts</h1>
          <p className="text-slate-500 text-sm">
            Gérez vos contacts réseau, chargés de recrutement et agences d'intérim.
          </p>
        </div>
        <div className="bg-indigo-50 border border-indigo-200 px-4 py-2 rounded-xl text-right">
          <p className="text-xs text-indigo-600 font-semibold uppercase">Total Contacts</p>
          <p className="text-2xl font-extrabold text-indigo-900">{contacts.length}</p>
        </div>
      </header>

      {/* Formulaire d'ajout */}
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h2 className="text-base font-bold text-slate-800">Ajouter un nouveau contact</h2>

        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs p-3 rounded-lg font-medium">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Nom du contact *</label>
            <input
              type="text"
              required
              placeholder="Ex: Marie Dupont"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Entreprise / Agence</label>
            <input
              type="text"
              placeholder="Ex: Adecco, Randstad..."
              value={form.company}
              onChange={(e) => setForm({ ...form, company: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Type de contact</label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
            >
              <option value="Agence d'intérim">Agence d'intérim</option>
              <option value="Recruteur / RH">Recruteur / RH</option>
              <option value="Réseau Pro">Réseau Pro</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Email</label>
            <input
              type="email"
              placeholder="marie@agence.fr"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Téléphone</label>
            <input
              type="tel"
              placeholder="06 12 34 56 78"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Dernier relance / contact</label>
            <input
              type="date"
              value={form.last_contacted_at}
              onChange={(e) => setForm({ ...form, last_contacted_at: e.target.value })}
              className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Notes / Remarques</label>
          <input
            type="text"
            placeholder="Ex: Préfère être appelée le matin. Spécialité logistique."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            className="w-full border border-slate-300 rounded-lg p-2.5 text-sm"
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition"
          >
            {submitting ? 'Enregistrement...' : 'Enregistrer le contact'}
          </button>
        </div>
      </form>

      {/* Recherche et filtres */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <input
          type="text"
          placeholder="Rechercher par nom ou entreprise..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 border border-slate-300 rounded-lg p-2.5 text-sm bg-white"
        />

        <div className="flex space-x-2 overflow-x-auto w-full md:w-auto">
          {['Tous', "Agence d'intérim", 'Recruteur / RH', 'Réseau Pro', 'Autre'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setSelectedType(type)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition ${
                selectedType === type
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Cartes de contacts */}
      {loading ? (
        <p className="text-slate-500 text-sm">Chargement des contacts...</p>
      ) : filteredContacts.length === 0 ? (
        <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400">
          Aucun contact trouvé.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4 hover:border-slate-300 transition"
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                    {contact.type}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleDelete(contact.id)}
                    className="text-slate-400 hover:text-red-600 text-xs transition"
                    title="Supprimer"
                  >
                    ✕
                  </button>
                </div>

                <h3 className="text-base font-bold text-slate-900">{contact.name}</h3>
                {contact.company && (
                  <p className="text-sm font-medium text-indigo-600">{contact.company}</p>
                )}

                {contact.notes && (
                  <p className="text-xs text-slate-500 mt-2 bg-slate-50 p-2 rounded border border-slate-100">
                    {contact.notes}
                  </p>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                {contact.phone && (
                  <div className="flex items-center justify-between text-slate-700">
                    <span>📞 {contact.phone}</span>
                    <a
                      href={`tel:${contact.phone}`}
                      className="text-indigo-600 hover:underline font-semibold"
                    >
                      Appeler
                    </a>
                  </div>
                )}

                {contact.email && (
                  <div className="flex items-center justify-between text-slate-700 truncate">
                    <span className="truncate">✉️ {contact.email}</span>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-indigo-600 hover:underline font-semibold shrink-0 ml-2"
                    >
                      Écrire
                    </a>
                  </div>
                )}

                {contact.last_contacted_at && (
                  <p className="text-[11px] text-slate-400 pt-1">
                    Dernier contact : {new Date(contact.last_contacted_at).toLocaleDateString('fr-FR')}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
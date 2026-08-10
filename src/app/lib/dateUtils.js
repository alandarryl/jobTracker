// Calcule le nombre de jours écoulés depuis l'envoi du CV
export function getDaysSince(appliedDate) {
  if (!appliedDate) return 0
  
  const start = new Date(appliedDate)
  const today = new Date()
  
  // Ignorer l'heure pour comparer uniquement les jours
  start.setHours(0, 0, 0, 0)
  today.setHours(0, 0, 0, 0)
  
  const diffTime = today - start
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
  
  return diffDays < 0 ? 0 : diffDays
}

// Détermine l'état de l'attente pour le retour de candidature
export function getFeedbackStatus(appliedDate, expectedDays = 14) {
  const daysPassed = getDaysSince(appliedDate)
  const remaining = expectedDays - daysPassed

  if (remaining < 0) {
    return {
      text: `Relance recommandée (${Math.abs(remaining)}j de retard)`,
      alert: true,
    }
  } else if (remaining === 0) {
    return {
      text: "Retour attendu aujourd'hui",
      alert: false,
    }
  } else {
    return {
      text: `Retour attendu sous ${remaining}j`,
      alert: false,
    }
  }
}
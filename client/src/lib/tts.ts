let synth: SpeechSynthesis

// Initialize speech synthesis
if (typeof window !== "undefined") {
  synth = window.speechSynthesis
}

export function speak(text: string) {
  if (!synth) return

  // Cancel any ongoing speech
  synth.cancel()

  const utterance = new SpeechSynthesisUtterance(text)

  // Configure voice settings for Trump-like characteristics
  utterance.pitch = 0.7 // Lower pitch for Trump's distinctive voice
  utterance.rate = 0.85  // Slower rate to match Trump's speaking pace
  utterance.volume = 1.0

  // Try to find a deep male voice
  const voices = synth.getVoices()
  const americanVoice = voices.find(
    voice => 
      voice.lang === 'en-US' && 
      voice.name.toLowerCase().includes('male') &&
      (voice.name.toLowerCase().includes('deep') || voice.name.toLowerCase().includes('low'))
  )

  if (americanVoice) {
    utterance.voice = americanVoice
  }

  // Add Trump-like emphasis
  text = text.replace(/tremendous/gi, 'treMENdous')
  text = text.replace(/great/gi, 'GREAT')
  text = text.replace(/huge/gi, 'YUUGE')

  utterance.text = text
  synth.speak(utterance)
}
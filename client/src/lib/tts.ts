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
  utterance.pitch = 0.9 // Slightly lower pitch
  utterance.rate = 0.9  // Slightly slower rate
  utterance.volume = 1.0

  // Try to find a deep male voice
  const voices = synth.getVoices()
  const americanVoice = voices.find(
    voice => voice.lang === 'en-US' && voice.name.includes('Male')
  )
  if (americanVoice) {
    utterance.voice = americanVoice
  }

  synth.speak(utterance)
}

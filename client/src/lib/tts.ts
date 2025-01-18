import { useToast } from "@/hooks/use-toast";

async function generateTrumpVoice(text: string): Promise<ArrayBuffer> {
  const VOICE_ID = "TxGEqnHWrfWFTfGW9XjX"; // Premium Trump voice model ID

  if (!import.meta.env.VITE_ELEVEN_LABS_API_KEY) {
    throw new Error("ElevenLabs API key not found");
  }

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": import.meta.env.VITE_ELEVEN_LABS_API_KEY,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: {
          stability: 0.30, // Lower stability for more expressiveness
          similarity_boost: 0.95, // Higher similarity to match Trump's voice better
          style: 1.0, // Emphasize characteristic speaking style
          use_speaker_boost: true // Enhance voice clarity
        },
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Failed to generate voice: ${errorText}`);
  }

  return await response.arrayBuffer();
}

export async function speak(text: string) {
  try {
    const audioData = await generateTrumpVoice(text);
    const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    await audio.play();

    // Clean up the URL after playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
    };
  } catch (error) {
    console.error("Error generating Trump voice:", error);
    // Fallback to browser TTS if ElevenLabs fails
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.7;
    utterance.rate = 0.85;
    synth.speak(utterance);
  }
}
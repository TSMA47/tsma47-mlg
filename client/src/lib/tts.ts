import { useToast } from "@/hooks/use-toast";

async function generateTrumpVoice(text: string): Promise<ArrayBuffer> {
  const VOICE_ID = "ErXwobaYiN019PkySvjV"; // Trump voice clone ID in ElevenLabs

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
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error("Failed to generate voice");
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
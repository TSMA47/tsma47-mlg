import { useToast } from "@/hooks/use-toast";

async function generateTrumpVoice(text: string): Promise<ArrayBuffer> {
  const VOICE_ID = "TxGEqnHWrfWFTfGW9XjX"; // Trump voice model ID
  const API_KEY = import.meta.env.VITE_ELEVEN_LABS_API_KEY;

  if (!API_KEY) {
    throw new Error("ElevenLabs API key not found in environment variables");
  }

  try {
    console.log("Attempting to generate voice with text:", text);
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": API_KEY,
        },
        body: JSON.stringify({
          text,
          model_id: "eleven_monolingual_v1",
          voice_settings: {
            stability: 0.35,
            similarity_boost: 0.75,
            style: 0.35,
            use_speaker_boost: true,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.text();
      console.error("ElevenLabs API error:", errorData);
      throw new Error(`Voice generation failed: ${response.status} - ${errorData}`);
    }

    console.log("Voice generated successfully");
    return await response.arrayBuffer();
  } catch (error) {
    console.error("Voice generation error:", error);
    throw error;
  }
}

export async function speak(text: string) {
  try {
    if (!text.trim()) return;

    console.log("Starting voice generation for text:", text);
    const audioData = await generateTrumpVoice(text);
    console.log("Received audio data, creating blob...");
    const audioBlob = new Blob([audioData], { type: "audio/mpeg" });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);

    // Clean up previous audio elements
    const previousAudio = document.querySelector('.trump-voice-audio');
    if (previousAudio) {
      (previousAudio as HTMLAudioElement).pause();
      previousAudio.remove();
    }

    // Add class for cleanup
    audio.className = 'trump-voice-audio';

    // Add error handling for audio playback
    audio.onerror = (e) => {
      console.error("Audio playback error:", e);
      throw new Error("Failed to play generated audio");
    };

    console.log("Playing generated audio...");
    await audio.play();

    // Clean up the URL after playing
    audio.onended = () => {
      URL.revokeObjectURL(audioUrl);
      audio.remove();
    };
  } catch (error) {
    console.error("Failed to generate or play Trump voice:", error);
    throw error;
  }
}
import { GoogleGenAI, Modality } from "@google/genai";
import { ElevenLabsClient } from "@elevenlabs/elevenlabs-js";
import { NextResponse } from 'next/server';

// The client gets the API key from the environment variable `GEMINI_API_KEY`
const genAI = new GoogleGenAI({});

const elevenlabs = new ElevenLabsClient({
  apiKey: process.env.ELEVENLABS_API_KEY,
});

export async function POST(req) {
  try {
    const { imageData, prompt } = await req.json();

    if (!imageData || !prompt) {
      return NextResponse.json({ error: 'Missing image data or prompt' }, { status: 400 });
    }

    // --- 1. Generate Image with Gemini 1.5 Flash Image Preview ---
    // The user's drawing is already a Data URI, so we just need the base64 part
    const base64Image = imageData.split(',')[1];

    // Construct the prompt following the official docs pattern for image editing
    const imagePrompt = [
      { text: `Using the provided image of a user's drawing of a "${prompt}", enhance this drawing into a beautiful, professional, and artistic masterpiece. The style should be imaginative and visually stunning, while still respecting the core subject of the original drawing.` },
      {
        inlineData: {
          mimeType: "image/png",
          data: base64Image,
        },
      },
    ];

    // Generate the new image using the correct model name from the docs
    const response = await genAI.models.generateContent({
      model: "gemini-2.5-flash-image-preview",
      contents: imagePrompt,
    });

    let generatedArtworkDataUri = null;
    
    // Process the response following the exact pattern from the docs
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        generatedArtworkDataUri = `data:${part.inlineData.mimeType};base64,${imageData}`;
        console.log("Image generated successfully");
        break;
      }
    }

    if (!generatedArtworkDataUri) {
      throw new Error("Image generation failed, no image data returned.");
    }

    // --- 2. Generate Orchestral Music with ElevenLabs ---
    let audioDataUri = null;
    
    try {
      const musicPrompt = `Create a beautiful, orchestral masterpiece inspired by a ${prompt}. The composition should be uplifting, magical, and cinematic with sweeping strings, gentle woodwinds, and triumphant brass. The tempo should be moderate, around 80-100 bpm, building from a soft introduction to a majestic climax that captures the essence and beauty of the subject. Include delicate harp arpeggios and warm orchestral textures that evoke wonder and creativity.`;
      
      console.log("Generating orchestral music for:", prompt);
      
      const musicTrack = await elevenlabs.music.compose({
        prompt: musicPrompt,
        musicLengthMs: 15000, // 15 seconds of music
      });

      // Handle the stream properly based on the ElevenLabs SDK
      const chunks = [];
      const reader = musicTrack.getReader();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
      }
      
      // Combine all chunks into a single buffer
      const audioBuffer = Buffer.concat(chunks);
      const audioBase64 = audioBuffer.toString('base64');
      audioDataUri = `data:audio/mpeg;base64,${audioBase64}`;

      console.log("Music generated successfully");
      
    } catch (audioError) {
      console.error("Audio generation failed:", audioError);
      // Continue without audio - the frontend will handle the missing audio gracefully
    }

    // --- 3. Send the results back to the client ---
    return NextResponse.json({ 
      artwork: generatedArtworkDataUri,
      audio: audioDataUri, // This will be null if audio generation failed
      imageGenerated: true,
      audioGenerated: audioDataUri !== null,
    });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Failed to generate AI content' }, { status: 500 });
  }
}

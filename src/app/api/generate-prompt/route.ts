import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessData, guideMarryData } = body;

    // Construct the prompt for Mistral
    const prompt = `Create a professional and friendly system prompt for a voice assistant for ${businessData.name}. 
    The assistant should act as a receptionist and provide the following information:
    
    Business Name: ${businessData.name}
    Address: ${businessData.address}
    Website: ${businessData.website || 'Not provided'}
    Phone: ${businessData.phone || 'Not provided'}
    Overview: ${businessData.overview || 'Not provided'}
    Service Hours: ${businessData.serviceHours?.map((s: { day: string; start: string; end: string }) => 
      `${s.day}: ${s.start} - ${s.end}`).join(', ') || 'Not provided'}
    
    Additional Instructions:
    - Phone Greeting: ${guideMarryData.phoneGreeting || 'Not provided'}
    - Request Caller Name: ${guideMarryData.callerName ? 'Yes' : 'No'}
    - Capture Caller Phone: ${guideMarryData.callerPhone ? 'Yes' : 'No'}
    - Additional Questions to Ask: ${guideMarryData.additionalQuestions || 'None'}
    
    The system prompt should be professional, friendly, and include all necessary information for the assistant to effectively handle calls.`;

    // Call Mistral API
    const response = await axios.post(
      'https://api.mistral.ai/v1/chat/completions',
      {
        model: 'mistral-tiny',
        messages: [
          {
            role: 'system',
            content: 'You are a professional prompt engineer specializing in creating system prompts for AI voice assistants.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.MISTRAL_API}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return NextResponse.json({ 
      prompt: response.data.choices[0].message.content 
    });
  } catch (error) {
    console.error('Error generating prompt:', error);
    return NextResponse.json(
      { error: 'Failed to generate prompt' },
      { status: 500 }
    );
  }
} 
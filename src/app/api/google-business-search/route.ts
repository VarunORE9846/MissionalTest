import { NextResponse } from 'next/server';
import axios from 'axios';

const GOOGLE_PLACES_API = 'https://maps.googleapis.com/maps/api/place/autocomplete/json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    // Debug log
    console.log('API Key available:', !!apiKey);

    if (!query) {
      return NextResponse.json(
        { error: 'Query parameter is required' },
        { status: 400 }
      );
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Google Places API key is not configured' },
        { status: 500 }
      );
    }

    const response = await axios.get(GOOGLE_PLACES_API, {
      params: {
        input: query,
        key: apiKey,
        types: 'establishment',
        components: 'country:us', // Restrict to US businesses
      },
    });

    if (response.data.status !== 'OK' && response.data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${response.data.status}`);
    }

    const predictions = response.data.predictions.map((prediction: any) => ({
      place_id: prediction.place_id,
      name: prediction.structured_formatting.main_text,
      formatted_address: prediction.structured_formatting.secondary_text,
      icon: prediction.icon,
    }));

    return NextResponse.json({ predictions });
  } catch (error: unknown) {
    console.error('Error searching business:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to search business' },
      { status: 500 }
    );
  }
} 
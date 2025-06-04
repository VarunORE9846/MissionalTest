import { NextResponse } from 'next/server';
import axios from 'axios';

const GOOGLE_PLACES_DETAILS_API = 'https://maps.googleapis.com/maps/api/place/details/json';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const placeId = searchParams.get('place_id');
    const apiKey = process.env.GOOGLE_PLACES_API_KEY;

    if (!placeId) {
      return NextResponse.json({ error: 'place_id is required' }, { status: 400 });
    }
    if (!apiKey) {
      return NextResponse.json({ error: 'API key not configured' }, { status: 500 });
    }

    const response = await axios.get(GOOGLE_PLACES_DETAILS_API, {
      params: {
        place_id: placeId,
        key: apiKey,
        fields: [
          'name',
          'formatted_address',
          'website',
          'international_phone_number',
          'formatted_phone_number',
          'opening_hours',
          'business_status',
          'types',
          'editorial_summary',
          'reviews',
          'url',
        ].join(','),
      },
    });

    if (response.data.status !== 'OK') {
      throw new Error(`Google Places Details API error: ${response.data.status} - ${response.data.error_message || ''}`);
    }

    const result = response.data.result;
    return NextResponse.json({
      name: result?.name,
      address: result?.formatted_address,
      website: result?.website,
      phone: result?.international_phone_number || result?.formatted_phone_number,
      overview: result?.editorial_summary?.overview || '',
      business_status: result?.business_status,
      types: result?.types,
      url: result?.url,
      service_times: result?.opening_hours?.weekday_text || [],
      // Exclude photos/images
    });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      // Log the full response from Google
      console.error('Google Details API error:', error.response?.data || error.message);
      return NextResponse.json(
        { error: error.response?.data?.error_message || error.response?.data || error.message },
        { status: 500 }
      );
    } else {
      console.error('Error fetching business details:', error);
      return NextResponse.json({ error: 'Failed to fetch business details' }, { status: 500 });
    }
  }
} 
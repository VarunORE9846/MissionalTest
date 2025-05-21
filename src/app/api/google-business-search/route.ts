import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q');
  if (!q) {
    return NextResponse.json({ predictions: [] });
  }
  const apiKey = process.env.GOOGLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'Missing Google API Key' }, { status: 500 });
  }
  try {
    const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(q)}&types=establishment&key=${apiKey}`;
    const { data } = await axios.get(url);
    // Map predictions to a simpler format
    const predictions = (data.predictions || []).map((p: any) => ({
      place_id: p.place_id,
      name: p.structured_formatting?.main_text || p.description,
      formatted_address: p.description,
      icon: p.icon,
    }));
    return NextResponse.json({ predictions });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch from Google' }, { status: 500 });
  }
} 
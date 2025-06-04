import { NextResponse } from 'next/server';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { businessData, guideMarryData } = body;

    // Compose the knowledge base content
    const lines = [
      `Business Name: ${businessData.name}`,
      `Address: ${businessData.address}`,
      `Website: ${businessData.website || 'Not provided'}`,
      `Phone: ${businessData.phone || 'Not provided'}`,
      `Overview: ${businessData.overview || 'Not provided'}`,
      '',
      'Service Hours:',
      ...(businessData.serviceHours || []).map((s: any) => `  ${s.day}: ${s.start && s.end ? `${s.start} - ${s.end}` : 'Closed'}`),
      '',
      'Assistant/Receptionist Instructions:',
      `  Phone Greeting: ${guideMarryData.phoneGreeting || 'Not provided'}`,
      `  Request Caller Name: ${guideMarryData.callerName ? 'Yes' : 'No'}`,
      `  Capture Caller Phone: ${guideMarryData.callerPhone ? 'Yes' : 'No'}`,
      `  Additional Questions: ${guideMarryData.additionalQuestions || 'None'}`
    ];

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();
    const { width, height } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontSize = 12;
    let y = height - 40;
    page.drawText('Business Knowledge Base', {
      x: 40,
      y,
      size: 18,
      font,
      color: rgb(0.2, 0.2, 0.7),
    });
    y -= 30;
    lines.forEach(line => {
      page.drawText(line, {
        x: 40,
        y,
        size: fontSize,
        font,
        color: rgb(0, 0, 0),
      });
      y -= fontSize + 4;
      if (y < 40) {
        y = height - 40;
        pdfDoc.addPage();
      }
    });
    const pdfBytes = await pdfDoc.save();
    return new Response(Buffer.from(pdfBytes), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="knowledge-base.pdf"',
      },
    });
  } catch (error) {
    console.error('Error generating knowledge base PDF:', error);
    return NextResponse.json({ error: 'Failed to generate knowledge base PDF' }, { status: 500 });
  }
} 
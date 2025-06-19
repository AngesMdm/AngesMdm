// app/api/data/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'actus.json');

  try {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(fileContent);
    return NextResponse.json(json);
  } catch (err) {
    return NextResponse.json({ error: 'Erreur de lecture' }, { status: 500 });
  }
}

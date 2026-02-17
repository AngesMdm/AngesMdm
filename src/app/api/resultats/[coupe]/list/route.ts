// app/api/resultats/[coupe]/list/route.ts
import { list } from "@vercel/blob";

export async function GET(req: Request, context: any): Promise<Response> {

    const { coupe } = await context.params;
    const decodedCoupe = decodeURIComponent(coupe);
    if (!decodedCoupe) {
        return new Response(JSON.stringify({ error: "Coupe non spécifiée" }), { status: 400 });
    }
    try {
        const result = await list({
            prefix: `${decodedCoupe}/`,
        });
        const phases = (result.blobs ?? [])
        .filter(blob => blob.pathname.endsWith('/'))
        .map(blob =>
            blob.pathname
            .replace(`${decodedCoupe}/`, "")
            .replace(/\/$/, "")
        ).filter(Boolean);

        return Response.json({ phases });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Erreur lors de la récupération des résultats" }), { status: 500 });
    }
}

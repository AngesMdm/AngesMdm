// app/api/resultats/[coupe]/[phase]/route.ts

export async function GET(req: Request, context: any): Promise<Response> {
    
    const { coupe, phase } = await context.params;
    const decodedCoupe = decodeURIComponent(coupe);
    const decodedPhase = decodeURIComponent(phase);
    
    if (!decodedCoupe) {
        return new Response(JSON.stringify({ error: "Coupe non spécifiée" }), { status: 400 });
    }
    if (!decodedPhase) {
        return new Response(JSON.stringify({ error: "Phase non spécifiée" }), { status: 400 });
    }
    try {
        const res = await fetch(
            `${process.env.BLOB_RESULTS_URL}${encodeURIComponent(decodedCoupe)}/${encodeURIComponent(decodedPhase)}/resultats.json`,
            { cache: "no-store" }
        );
        if (!res.ok) {
            throw new Error(`Erreur lors de la récupération des résultats pour ${decodedCoupe} - ${decodedPhase}`);
        }
        const data = await res.json();
        return new Response(JSON.stringify(data), { status: 200, headers: { "Content-Type": "application/json" } });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error: "Erreur lors de la récupération des résultats" }), { status: 500 });
    }
}

import { NextRequest, NextResponse } from "next/server";

export default async function userAsASessionIDMiddleware(req: NextRequest) {

    // Si c'est une route de nextJS
    if (req.url.includes('_next') || req.url.includes('api') || req.url.includes('manifest.json') || req.url.includes('favicon.json') || req.url.includes('favicon.ico') || req.url.includes('assets')) {
        return NextResponse.next();
    }
    if( req.url.includes('login') || req.url.includes('logout') || req.url.includes('member')) {
        // Si c'est une route de login, logout ou member, on ne fait rien
        return NextResponse.next();
    }
    //TODO
    return NextResponse.next();
}
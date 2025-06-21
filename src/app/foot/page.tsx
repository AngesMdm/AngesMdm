import FootPage from './Foot';

export const metadata = {
    title: 'Foot - Anges MDM',
    description:
        'Découvrez le football américain avec les Anges de Mont-de-Marsan : postes, règles, équipe senior, galerie photo et ambiance de match.',
    openGraph: {
        title: 'Football Américain — Anges MDM à Mont-de-Marsan',
        images: ['/assets/images/logo.png'],
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
};

export default function Page() {
    return <FootPage />;
}
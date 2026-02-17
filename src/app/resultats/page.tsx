import Resultats from './Resultats';

export const metadata = {
    title: 'Résultats - Anges MDM',
    description:
        'Découvrez les résultats et classementde notre équipe flag football à Mont-de-Marsan. Suivez les performances de nos joueurs et restez informés des dernières nouvelles du club.',
    openGraph: {
        title: 'Anges MDM — Club de Football Américain, Flag et Cheer à Mont-de-Marsan',
        images: ['/assets/images/logo.png'],
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
};

export default function Page() {
    return <Resultats />;
}
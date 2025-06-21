import CheerPage from './Cheer';

export const metadata = {
    title: 'Cheerleading - Anges MDM',
    description:
        'Les cheerleaders des Anges MDM : acrobaties, esprit d’équipe et performances lors des matchs. Découvrez notre section cheer et sa galerie photo.',
    openGraph: {
        title: 'Cheerleading — Anges MDM à Mont-de-Marsan',
        images: ['/assets/images/logo.png'],
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
};

export default function Page() {
    return <CheerPage />;
}
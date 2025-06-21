import FlagPage from './Flag';

export const metadata = {
    title: 'Flag - Anges MDM',
    description:
        'Le flag football, une version sans contact du football américain accessible à tous. Rejoignez les Anges MDM et découvrez ce sport dynamique et stratégique.',
    openGraph: {
        title: 'Flag Football — Anges MDM à Mont-de-Marsan',
        images: ['/assets/images/logo.png'],
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
};

export default function Page() {
    return <FlagPage />;
}
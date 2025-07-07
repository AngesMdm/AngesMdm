import NousRejoindrePage from './NousRejoindre';

export const metadata = {
    title: 'Nous rejoindre - Anges MDM',
    description:
        'Bienvenue sur le site officiel des Anges de Mont-de-Marsan. Découvrez notre club de football américain, flag football et cheerleading, ainsi que nos actualités, staff, équipes et partenaires.',
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
    return <NousRejoindrePage />;
}
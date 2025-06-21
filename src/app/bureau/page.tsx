import BureauPage from './Bureau';

export const metadata = {
    title: 'Bureau — Anges MDM',
    description:
        'Découvrez les membres du bureau des Anges de Mont-de-Marsan : président, trésorier, secrétaire et responsables œuvrant au bon fonctionnement du club.',
    openGraph: {
        title: 'Bureau — Anges MDM',
        description:
            'Le bureau dirigeant des Anges de Mont-de-Marsan : une équipe de passionnés qui encadrent l’organisation du club de football américain, flag et cheerleading.',
        url: 'https://anges-mdm.fr/bureau',
        siteName: 'Anges de Mont-de-Marsan',
        locale: 'fr_FR',
        type: 'website',
        images: [
            {
                url: '/assets/images/logo.png',
                width: 800,
                height: 600,
                alt: 'Logo des Anges de Mont-de-Marsan',
            },
        ],
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
};

export default function Page() {
    return <BureauPage />;
}

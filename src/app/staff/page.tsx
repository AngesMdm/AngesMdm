import Staff from './Staff';

export const metadata = {
    title: 'Staff — Anges MDM',
    description:
        'Découvrez le staff des Anges de Mont-de-Marsan : nos coachs, arbitres et encadrants passionnés qui accompagnent les sections football américain, flag et cheerleading.',
    openGraph: {
        title: 'Staff — Anges MDM',
        description:
            'Rencontrez les entraîneurs, arbitres et membres du staff des Anges de Mont-de-Marsan, investis dans le développement du football américain, du flag football et du cheerleading.',
        url: 'https://anges-mdm.fr/staff',
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
    return <Staff />;
}

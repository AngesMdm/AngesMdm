import Login from './Login';

export const metadata = {
    title: 'Connexion — Espace Membre Anges MDM',
    description:
        'Accédez à l’espace membre des Anges de Mont-de-Marsan via votre compte Google pour consulter les contenus réservés du club.',
    openGraph: {
        title: 'Connexion — Espace Membre Anges MDM',
        images: ['/assets/images/logo.png'],
    },
    viewport: {
        width: 'device-width',
        initialScale: 1,
    },
};

export default function Page() {
    return <Login />;
}
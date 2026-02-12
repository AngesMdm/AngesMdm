import Home from './Home';

export const metadata = {
  metadataBase: new URL('https://anges-mdm.vercel.app'),

  title: {
    default: 'Anges de Mont-de-Marsan',
    template: '%s | Anges MDM',
  },

  description:
    'Site officiel des Anges de Mont-de-Marsan. Football américain, flag football et cheerleading.',

  openGraph: {
    title: 'Anges de Mont-de-Marsan',
    description:
      'Club de football américain, flag football et cheerleading à Mont-de-Marsan.',
    url: 'https://anges-mdm.vercel.app',
    siteName: 'Anges de Mont-de-Marsan',
    images: [
      {
        url: '/assets/images/logo.png',
        width: 1200,
        height: 630,
        alt: 'Logo Anges MDM',
      },
    ],
    locale: 'fr_FR',
    type: 'website',
  },
};

export default function Page() {
  return <Home />;
}

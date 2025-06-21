'use client';
import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function Login() {
    const { data: session, status } = useSession();

    if (status === 'loading') {
        return (
            <main className="login-page">
                <div className="login-container">
                    <div className="login-card">
                        <Image
                            src="/assets/images/logo.png"
                            alt="Logo"
                            width={60}
                            height={60}
                            className="login-logo"
                        />
                        <div className="login-loader"></div>
                        <p className="login-email">Chargement de la session...</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <Image
                        src="/assets/images/logo.png"
                        alt="Logo"
                        width={60}
                        height={60}
                        className="login-logo"
                    />
                    {session?.user ? (
                        <>
                            <h1 className="login-title">Bonjour, {session.user.name}</h1>
                            <p className="login-email">Email : {session.user.email}</p>
                            <button className="login-button" onClick={() => signOut()}>
                                Se déconnecter
                            </button>
                        </>
                    ) : (
                        <>
                            <h1 className="login-title">Connexion</h1>
                            <p className="login-email">Vous n'êtes pas connecté.</p>
                            <button className="login-button" onClick={() => signIn('google')}>
                                Se connecter avec Google
                            </button>
                        </>
                    )}
                </div>
            </div>
        </main>
    );
}

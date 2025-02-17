import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Navbar from '../components/Navbar';
import LilholtDinnerPlanLogo from '../assets/images/LilholtDinnerPlanLogo.png';
import { googleLogin, onAuthStateChanged, User } from '../firebase/auth';

export default function Home() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged((usr) => {
      if (usr) {
        setUser(usr);
        router.push('/dashboard');
      }
    });
    return unsubscribe;
  }, [router]);

  const handleGoogleLogin = async () => {
    try {
      await googleLogin();
      // onAuthStateChanged will handle redirection
    } catch (err: any) {
      console.error('Login failed:', err.message);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '2rem', fontFamily: 'Inter, sans-serif' }}>
      <Navbar />
      <Image
        src={LilholtDinnerPlanLogo}
        alt="Lilholt Dinner Plan Logo"
        width={200}
        height={200}
      />
      <h1>Welcome to the Lilholt Dinner Planner</h1>
      {!user && (
        <button onClick={handleGoogleLogin} style={{ padding: '1rem 2rem', fontSize: '1rem' }}>
          Sign in with Google
        </button>
      )}
    </div>
  );
}
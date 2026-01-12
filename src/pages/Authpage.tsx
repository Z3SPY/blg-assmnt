import { useState, useEffect } from "react";
import { supabase } from '../lib/supabase'

function Authpage() {
    const [loading, setLoading] = useState<boolean>(false);
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(false); // Toggle between login/signup
    const [session, setSession] = useState<import("@supabase/supabase-js").Session | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);

    useEffect(() => {
        // Check for existing session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);


    // ====================
    // SIGN UP FUNCTION
    const handleSignUp = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setAuthError(null);
        

        // Connection to Supabase Auth for Sign Up
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            setAuthError(error.message);
        } else {
            alert("Account created! You can now log in.");
            setIsSignUp(false); // Switch to login view
        }
        setLoading(false);
    };

    // ====================
    // LOGIN FUNCTION
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setAuthError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setAuthError(error.message);
        }
        setLoading(false);
    };

     // ====================
    // LOGOUT FUNCTION
    const handleLogout = async () => {
        await supabase.auth.signOut();
        setSession(null);
    };

    
    
    
    // ====================
    // SESSION CHECKS 
    if (authError) {
        return (
            <div>
                <h1>Authentication</h1>
                <p style={{ color: 'red' }}>✗ {authError}</p>
                <button onClick={() => setAuthError(null)}>
                    Try again
                </button>
            </div>
        );
    }

    // If user is logged in, show welcome screen
    if (session) {
        return (
            <div>
                <h1>Welcome!</h1>
                <p>You are logged in as: {session.user.email}</p>
                <button onClick={handleLogout}>Sign Out</button>
            </div>
        );
    }

    // Show login/signup form
    return (
        <div>
            <h1>{isSignUp ? 'Sign Up' : 'Login'}</h1>
            <form onSubmit={isSignUp ? handleSignUp : handleLogin}>
                <input
                    type="email"
                    placeholder="Your email"
                    value={email}
                    required={true}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Your password"
                    value={password}
                    required={true}
                    minLength={6}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button disabled={loading}>
                    {loading ? <span>Loading...</span> : <span>{isSignUp ? 'Sign Up' : 'Login'}</span>}
                </button>
            </form>
            
            <p>
                {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                {' '}
                <button 
                    type="button"
                    onClick={() => {
                        setIsSignUp(!isSignUp);
                        setAuthError(null);
                    }}
                    style={{ background: 'none', border: 'none', color: 'blue', cursor: 'pointer', textDecoration: 'underline' }}
                >
                    {isSignUp ? 'Login' : 'Sign Up'}
                </button>
            </p>
        </div>
    );
}

export default Authpage;
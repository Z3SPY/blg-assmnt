import { useState, useEffect } from "react";
import { PencilLine, CircleArrowLeft } from 'lucide-react';

// Redux actions
import { _rdxLogin, _rdxLogout } from "../state/session/session";
import {  type AppDispatch } from "../state/store";
import { useDispatch, useSelector, type UseDispatch } from "react-redux";

//TypeScript types
import type { SessionPayload } from "../state/session/session";

// React 
import { useNavigate } from "react-router-dom";


//Repositories and Services
import { authService } from "../services/AuthServices";
import { supabase } from "../lib/supabase";

import "./css/Authpage.css";


function Authpage(props: { AuthState?: boolean }) {
    // Redux hooks
    const dispatch = useDispatch<AppDispatch>();
    //const sessionState = useSelector((state: RootState) => state.session);

    // Local state
    const [loading, setLoading] = useState<boolean>(false);
    
    const [confirmPassword, setConfirmPassword] = useState<string>("");
    const [isSignUp, setIsSignUp] = useState<boolean>(props.AuthState!); // Toggle between login/signup
    const [session, setSession] = useState<import("@supabase/supabase-js").Session | null>(null);
    const [authError, setAuthError] = useState<string | null>(null);


    // Importants:
    const [email, setEmail] = useState<string>("");
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");





    const navigate = useNavigate();  

    

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
    

        // Quick Validation Checks
        if (!email.includes('@')) {
            setAuthError("Please enter a valid email address.");
            setLoading(false);
            return;
        }

        if ( confirmPassword !== password) {
            alert("Password mismatch");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long");
            setLoading(false);
            return;
        }

    

        // Connection to Supabase Auth for Sign Up
        try { 

            const user = await authService.signUp(email, password, username); 

            setIsSignUp(false); // Switch to login view
        
            // ====================
            // redux action dispatch
            dispatch(_rdxLogin(
                {userName: user.username,
                userId: user.id,
             } as SessionPayload

            ));
            // ====================

            navigate('/');
            
        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'Sign up failed');
        } finally {
            setLoading(false);
        }
        
    };


    
    // ====================
    // LOGIN FUNCTION
    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setLoading(true);
        setAuthError(null);

        // ===================
        // This is the supabase check for login
        try {
           const user = await authService.signIn(email, password);
           // Need Validation to check if login was successful
            // ====================
            // redux action dispatch
            

            dispatch(_rdxLogin(
                    {userName: user.username,
                    userId: user.id,
                } as SessionPayload

            ));
            // ====================
            

            navigate('/');

        } catch (error) {
            setAuthError(error instanceof Error ? error.message : 'Sign up failed');
        } finally {
            setLoading(false);
        }
    };


    // ====================
    // LOGOUT FUNCTION
    const handleLogout = async () => {
        try {
            await authService.signOut();
            
            // Redux action dispatch
            dispatch(_rdxLogout());
            
            setSession(null);
        } catch (error) {
            console.error('Logout failed:', error);
            // Optionally show error to user
        }
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
    if (session && !loading) {

        // Session Open, Then gives out error

        // Only load if not loading
        if (!loading) {
            setTimeout(() => {
                navigate('/');
            }, 0); //50000 
        }
         

        /*
        return (
            <div>
                <h1>Welcome!</h1>
                <p>You are logged in as: {session.user.email}</p>
                <button onClick={handleLogout}>Sign Out</button>
            </div>
        );*/
    }

    // Show login/signup form
    return (
        <>
            <div className="absolute top-10 left-16 text-[2vh] flex gap-2 text-white font-bold cursor-pointer" onClick={() => {navigate("/")}}>
                <PencilLine className="bg-zinc-700 p-1 rounded-md h-7 w-7 shadow-sm shadow-neutral-900"/> Jotted.
            </div>
            <div className="h-screen bg-neutral-900 flex justify-center items-center [&>*]:animate-in [&>*]:fade-in [&>*]:duration-1000 [&>*]:slide-in-from-bottom-2 [&>*]:[animation-delay:calc(var(--i)*100ms)]">
                <div id="main-form" className="md:w-4/6 lg:w-3/6
                                                shadow-lg bg-neutral-800 shadow-neutral-950 h-4/6  rounded-lg p-10 flex flex-col gap-2">
                        <h1 className="font-bold text-[25px] text-white"> {isSignUp ? 'Create an Account' : 'Login to your account'}</h1>
                        <p className="text-neutral-300 text-md ">
                            {isSignUp 
                            ? 'Join Jotted today and start capturing your thoughts effortlessly.' 
                            : 'Enter your credentials to access your dashboard and notes.'
                            }
                        </p>
                        <form onSubmit={isSignUp ? handleSignUp : handleLogin} className="flex flex-col gap-3 [&>*input]:text-neutral-900 my-5">
                            
                        

                            <input
                                type="email"
                                placeholder="Your email"
                                value={email}
                                required={true}
                                onChange={(e) => setEmail(e.target.value)}
                                className="authInputs"
                            />

                           
                            
                

                            <input
                                type="password"
                                placeholder="Your password"
                                value={password}
                                required={true}
                                minLength={6}
                                onChange={(e) => setPassword(e.target.value)}
                                className="authInputs"
                            />
                            {isSignUp && (
                                <input
                                    type="password"
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    required={true}
                                    minLength={6}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="authInputs"
                                />
                            )}
                             { isSignUp ? (
                                <input
                                type="text"
                                placeholder="Pick a username"
                                value={username}
                                required={true}
                                onChange={(e) => setUsername(e.target.value)}
                                className="authInputs"
                            />
                            ) : null
                            }
                            <button className="auth-btn " disabled={loading}>
                                {loading ? <span>Loading...</span> : <span>{isSignUp ? 'Sign Up' : 'Login'}</span>}
                            </button>
                        </form>
                        
                        <p className="text-white">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            {' '}
                            <button 
                                type="button"
                                onClick={() => {
                                    setIsSignUp(!isSignUp);
                                    setAuthError(null);
                                    navigate(isSignUp ? "/signup" : "/login");
                                }}
                                className="hvr-btn"
                                style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                            >
                                {isSignUp ? 'Login' : 'Sign Up'}
                            </button>
                        </p>

                        <button onClick={() => {navigate("/")}} className="back-btn bg-neutral-600 mt-auto self-start px-4 py-2 rounded text-white flex gap-2"> 
                            <CircleArrowLeft />  Back
                        </button>
                </div>

                
                
            </div>
        </>

        
    );
}

export default Authpage;
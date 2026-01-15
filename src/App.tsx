import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Pages from './pages/Pages';

import { authService } from './services/AuthServices';

// Redux 
import { _rdxLogin, _rdxLogout, type SessionPayload } from './state/session/session';
import { type AppDispatch } from './state/store';
import { useDispatch } from "react-redux";



import "./index.css"

function App() {

  // redux hooks
  const dispatch = useDispatch<AppDispatch>();

  // REINSERT REDUX 
  useEffect(() => {
    const checkSession = async () => {
        try {
            const data = await authService.getUserSession();
            if (data) {
                //console.log(data);  

                dispatch(_rdxLogin({
                  userName: data.username,
                  userId: data.id,} as SessionPayload
                ) )

            } else {
                dispatch(_rdxLogout());
            }
        } catch (error) {
            //console.log(error);
            dispatch(_rdxLogout());
        }
    };

    checkSession(); // Call the async function
  }, [dispatch]);




  const { Homepage, Blogpage, Formpage, Authpage, Profilepage } = Pages;


  return (
    /*<>
    <div className="flex justify-center items-center h-screen bg-red-200">
      <h1 className="text-3xl font-bold"> { checkConnection ? "Connected to Supabase" : "Not connected to Supabase"}</h1>
    </div>
    </>*/

    /** Note this needs middle ware */

    <Router>
      <Routes>
        <Route path='/' element={<Homepage />}></Route>


        {/** BLOGS */}
        <Route path='/form' element={<Formpage />}></Route>
        <Route path='/blog/:id' element={<Blogpage />}></Route>

        {/** AUTHENTICATION */}
        <Route path='/login' element={<Authpage AuthState={false} />} />
        <Route path='/signup' element={<Authpage AuthState={true} />} />
        <Route path='/auth' element={<Authpage />}></Route>

        {/** PROFILE */}
        <Route path='/profile/:id' element={<Profilepage />}></Route>
      </Routes>
    </Router>
  )
}

export default App

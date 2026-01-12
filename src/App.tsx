import { useEffect, useState } from 'react'
import { supabase } from './lib/supabase'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Pages from './pages/Pages';


import "./index.css"

function App() {
  const [checkConnection, setCheckConnection] = useState(false)

  useEffect(() => {
    const checkSupabaseConnection = async () => {
      try {
        const { data, error } = await supabase.from('blogs').select('*').limit(1)
        if (error) {
          console.error('Error fetching data from Supabase:', error)
          setCheckConnection(false)
        } else {
          console.log('Data fetched from Supabase:', data)
          setCheckConnection(true)
        }
      } catch (error) {
        console.error('Unexpected error:', error)
        setCheckConnection(false)
      }
    }

    checkSupabaseConnection()
  }, [])

  const { Homepage, Blogpage, Formpage, Authpage } = Pages;


  return (
    /*<>
    <div className="flex justify-center items-center h-screen bg-red-200">
      <h1 className="text-3xl font-bold"> { checkConnection ? "Connected to Supabase" : "Not connected to Supabase"}</h1>
    </div>
    </>*/

    /** Note this needs middle ware */

    <Router>
      <Routes>
        <Route path='/Form' element={<Formpage />}></Route>
        <Route path='/' element={<Homepage />}></Route>
        <Route path='/Blog' element={<Blogpage title="Sample Blog Title" content="This is a sample blog content." />}></Route>
        <Route path='/Auth' element={<Authpage />}></Route>
      </Routes>
    </Router>
  )
}

export default App

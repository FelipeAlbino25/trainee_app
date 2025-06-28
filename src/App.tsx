import { useEffect, useState } from 'react'
import type{ Task } from './types/Task'
import NavBar from './components/NavBar'
import Board from './components/Board'
import './App.css'

import { getLists } from './api/endpoints/List'
import type { List } from './types/List'

function App() {

  const [lists,setLists] = useState<List[]>([]);

  useEffect(()=>{
  
    const fetchLists = async() =>{
      try{
        const listsTemp = await getLists();
        setLists(listsTemp)
      }
      catch(err){
        console.error(err)
      }
    }
    fetchLists();


  }, [])

  return (
    <>
    <NavBar/>
    <Board lists={lists}></Board>
    </>
  )
}

export default App

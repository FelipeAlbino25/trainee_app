import { useEffect, useState } from 'react'
import NavBar from './components/NavBar'
import Board from './components/Board'
import './App.css'

import { getLists } from './api/endpoints/List'
import type { List } from './types/List'

function App() {
  const [lists, setLists] = useState<List[]>([]);

  const fetchLists = async () => {
    try {
      const listsTemp = await getLists();
      setLists(listsTemp);
    } catch (err) {
      console.error(err);
    }
  };


  useEffect(() => {
    fetchLists();
  }, []);

  return (
    <>
      <NavBar />
      <Board lists={lists} refetchLists={fetchLists} />
    </>
  );
}
export default App;
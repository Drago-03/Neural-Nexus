import { useState, useEffect } from 'react'
import { supabase } from '../utils/supabase'

interface Todo {
  id: string;
  title: string;
  completed?: boolean;
  created_at?: string;
}

function Page() {
  const [todos, setTodos] = useState<Todo[]>([])

  useEffect(() => {
    async function getTodos() {
      const { data } = await supabase.from('todos').select()

      if (data && data.length > 0) {
        setTodos(data as Todo[])
      }
    }

    getTodos()
  }, [])

  return (
    <div>
      {todos.map((todo) => (
        <li key={todo.id}>{todo.title}</li>
      ))}
    </div>
  )
}
export default Page 
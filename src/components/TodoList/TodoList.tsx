import type { FC, FormEventHandler } from 'react'
import { useEffect, useState } from 'react'

import type { TodosQuery } from '@/generated/request'
import {
  useAddTodoMutation,
  useDeleteTodoMutation,
  useTodosQuery,
  useUpdateTodoMutation,
} from '@/generated/request'

export const TodoList: FC = () => {
  const [todoTitle, setTodoTitle] = useState('')
  const [todos, setTodos] = useState<TodosQuery['todos']>([])
  const { loading, error, data, refetch } = useTodosQuery()
  const [addTodoMutation] = useAddTodoMutation()
  const [updateTodoMutation] = useUpdateTodoMutation()
  const [deleteTodoMutation] = useDeleteTodoMutation()
  useEffect(() => {
    setTodos(data?.todos ?? [])
  }, [data?.todos])

  if (loading) return <div>loading...</div>
  if (error) return <div>error!</div>
  if (!data?.todos) return null

  const handleSubmit: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault()

    if (!todoTitle) return alert('todoを入力してください')

    const { data } = await addTodoMutation({ variables: { title: todoTitle } })

    // 作成されたTodo
    const addedTodo = data?.addTodo

    if (!addedTodo) return

    setTodos([...todos, addedTodo])
    setTodoTitle('')
    // データの再取得
    await refetch()
  }

  const handleChange = async (todoId: string, completed: boolean) => {
    const { data } = await updateTodoMutation({
      variables: { todoId, completed },
    })

    // 更新対象
    const todo = data?.updateTodo

    if (!todo) return

    const updatedTodos = todos.map((t) => (t?.id === todo.id ? todo : t))
    setTodos(updatedTodos)
  }

  const handleDelete = async (todoId: string) => {
    const isOk = confirm('削除しますか？')
    if (!isOk) return

    const { data } = await deleteTodoMutation({ variables: { todoId } })

    // 削除対象
    const todo = data?.deleteTodo

    if (!todo) return

    const deletedTodo = todos.filter((t) => t?.id !== todo.id)
    setTodos(deletedTodo)
  }

  return (
    <div className="p-5 border rounded">
      Todo List
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="p-2 border"
          type="text"
          value={todoTitle}
          onChange={(e) => setTodoTitle(e.target.value)}
        />
        <button className="bg-gray-200 p-2">追加</button>
      </form>
      <ul className="mt-5">
        {todos.map((todo) => (
          <li key={todo.id} className={`${todo.completed && 'line-through'}`}>
            <span>
              {todo.completed ? '✅' : '👀'} {todo.title}
            </span>
            <input
              className="cursor-pointer"
              type="checkbox"
              checked={todo.completed}
              onChange={(e) => handleChange(todo.id, e.target.checked)}
            />
            <span> / </span>
            <button onClick={() => handleDelete(todo.id)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  )
}

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

  return <div className="p-5 border rounded">Todo List</div>
}

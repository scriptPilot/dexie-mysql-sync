import { useState } from 'react'
import { db, useLiveQuery } from '../store'
import { Flex, Button, Checkbox, Input, Typography } from 'antd'
import { DeleteOutlined } from '@ant-design/icons'

const { Title } = Typography

function TaskItem(task) {
  return (
    <Flex gap="small" key={task.id}>
      <Checkbox checked={task.done} onClick={() => db.tasks.update(task.id, { done: task.done ? 0 : 1 })} />
      <Input value={task.title} onChange={e => db.tasks.update(task.id, { title: e.target.value})} disabled={task.done} />
      <Button danger type="link" icon={<DeleteOutlined />} onClick={() => db.tasks.delete(task.id)} />
    </Flex>
  )
}

function TodoList() {
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const tasks = useLiveQuery(() => db.tasks.where('$deleted').notEqual(1).sortBy('$created'))
  function onAddTask() {
    db.tasks.add({ title: newTaskTitle })
    setNewTaskTitle('')
  }
  return (
    <Flex gap="middle" vertical>
      <Title level={2}>Todo List</Title>
      <Flex gap="middle">
        <Input placeholder="New Todo Title" value={newTaskTitle} onChange={e => setNewTaskTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && onAddTask()} />
        <Button type="primary" onClick={onAddTask}>Add Todo</Button>
      </Flex>
      <Flex gap="small" vertical>
        {tasks?.map(TaskItem)}
      </Flex>
    </Flex>
  )
}

export default TodoList
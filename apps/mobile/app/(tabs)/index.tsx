// import { ExternalLink } from '@tamagui/lucide-icons'
import { useState, useEffect } from 'react';
import { Anchor, H2, Paragraph, Text, XStack, YStack } from 'tamagui'
// import { ToastControl } from 'app/CurrentToast'
import { AddTaskButton } from 'components/Button'
import { TodoListItem } from 'components/TodoListItem'
import { AddEditDialog } from 'components/AddEditDialog'
import { AlertDiaglog } from 'components/AlertDialog'
import useStore from 'state/todo';
import type { TodoBase } from '@todo-monorepo/datasource';

export default function TabOneScreen() {

  const { todos, addTodo, updateTodo, deleteTodo, fetchTodos } = useStore();
  const [addEditComp, setAddEditComp] = useState<boolean>(false);
  const [alertComp, setAlertComp] = useState<boolean>(false);
  const [mode, setMode] = useState<'add' | 'edit'>('add');
  const [currentEditTodoId, setCurrentEditTodoId] = useState<string>('');
  const [deleteTodoId, setDeleteTodoId] = useState<string | null>(null);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos])

  // Handlers for CRUD operations
  const addNewTask = () => {
    setMode('add');
    setAddEditComp(true);
  };

  const handleNewTask = async (newTodo: { title: string; description?: string, completed: boolean }) => {
    try {
      await addTodo(newTodo);
      setAddEditComp(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleEditTask = async (updatedTodo: TodoBase) => {
    try {
      await updateTodo({ id: currentEditTodoId, ...updatedTodo });
      setAddEditComp(false);
    } catch (error) {
      console.error("Error editing task:", error);
    }
  };

  const handleDeleteTask = async () => {
    if (!deleteTodoId) return;
    try {
      await deleteTodo(deleteTodoId);
      setAlertComp(false);
      setDeleteTodoId(null);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  // UI interaction handlers
  const openEditMode = (id: string) => {
    setMode('edit');
    setCurrentEditTodoId(id);
    setAddEditComp(true);
  };

  const openDeleteConfirm = (id: string) => {
    setDeleteTodoId(id);
    setAlertComp(true);
  };

  const toggleTodoStatus = async (id: string) => {
    const todo = todos.find(todo => todo.id === id);
    if (todo) {
      try {
        await updateTodo({ id, title: todo.title, description: todo.description, completed: !todo.completed });
      } catch (error) {
        console.error("Error toggling task status:", error);
      }
    }
  };

  return (
    <YStack flex={1} items="center" gap="$5" bg="$background" style={{ padding: '1rem', maxWidth: '48rem', width: '100%', margin: 'auto' }}>
      <AddTaskButton onPress={addNewTask}></AddTaskButton>
      <YStack background="$background" width={'100%'}>
        {todos.length === 0 ? (
          <Text>暂无任务，点击上方按钮添加</Text>
        ) : (
          todos.map(todo => (
            <TodoListItem
              key={todo.id}
              {...todo}
              toggleTodoStatus={toggleTodoStatus}
              openEditMode={openEditMode}
              openDeleteConfirm={openDeleteConfirm}
            />
          ))
        )}
      </YStack>
      {mode === 'add' ?
        <AddEditDialog
          isOpen={addEditComp}
          onOpenChange={setAddEditComp}
          mode='add'
          initialData={undefined}
          onSubmit={handleNewTask}
        /> :
        <AddEditDialog
          isOpen={addEditComp}
          onOpenChange={setAddEditComp}
          mode='edit'
          initialData={{
            title: todos.find(todo => todo.id === currentEditTodoId)?.title as string,
            description: todos.find(todo => todo.id === currentEditTodoId)?.description,
            completed: todos.find(todo => todo.id === currentEditTodoId)?.completed as boolean
          }}
          onSubmit={handleEditTask}
        />}
      <AlertDiaglog
        isOpen={alertComp}
        onOpenChange={setAlertComp}
        onConfirm={handleDeleteTask}
      />
    </YStack>
  )
}

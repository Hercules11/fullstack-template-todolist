// TodoApiHooks.ts
import { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import todoApiService from './TodoApiService';

// 定义查询键
export const TODO_QUERY_KEYS = {
  all: ['todos'] as const,
  lists: () => [...TODO_QUERY_KEYS.all, 'list'] as const,
  list: (filters: string) => [...TODO_QUERY_KEYS.lists(), { filters }] as const,
  details: () => [...TODO_QUERY_KEYS.all, 'detail'] as const,
  detail: (id: string) => [...TODO_QUERY_KEYS.details(), id] as const,
};

/**
 * 使用所有Todo列表的Hook
 */
export const useAllTodos = () => {
  return useQuery({
    queryKey: TODO_QUERY_KEYS.lists(),
    queryFn: () => todoApiService.getAllTodos(),
  });
};

/**
 * 使用单个Todo详情的Hook
 */
export const useTodoById = (id: string) => {
  return useQuery({
    queryKey: TODO_QUERY_KEYS.detail(id),
    queryFn: () => todoApiService.getTodoById(id),
    enabled: !!id, // 仅在id存在时启用查询
  });
};

/**
 * 创建Todo的Hook
 */
export const useCreateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (newTodo: CreateTodoDto) => todoApiService.createTodo(newTodo),
    onSuccess: () => {
      // 创建成功后使Todo列表查询失效，触发重新获取
      queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEYS.lists() });
    },
  });
};

/**
 * 更新Todo的Hook
 */
export const useUpdateTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTodoDto }) =>
      todoApiService.updateTodo(id, data),
    onSuccess: (data, variables) => {
      // 更新缓存中的单个Todo
      queryClient.setQueryData(
        TODO_QUERY_KEYS.detail(variables.id),
        data
      );
      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEYS.lists() });
    },
  });
};

/**
 * 标记Todo为已完成的Hook
 */
export const useMarkTodoAsCompleted = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApiService.markTodoAsCompleted(id),
    onSuccess: (data, id) => {
      // 更新缓存中的单个Todo
      queryClient.setQueryData(
        TODO_QUERY_KEYS.detail(id),
        data
      );
      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEYS.lists() });
    },
  });
};

/**
 * 删除Todo的Hook
 */
export const useDeleteTodo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => todoApiService.deleteTodo(id),
    onSuccess: (_, id) => {
      // 从缓存中移除单个Todo
      queryClient.removeQueries({ queryKey: TODO_QUERY_KEYS.detail(id) });
      // 使列表查询失效
      queryClient.invalidateQueries({ queryKey: TODO_QUERY_KEYS.lists() });
    },
  });
};

/**
 * 使用Todo的自定义Hook（不依赖React Query）
 */
export const useTodoOperations = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  // 加载所有Todo
  const fetchTodos = useCallback(async () => {
    try {
      setLoading(true);
      const result = await todoApiService.getAllTodos();
      setTodos(result);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('加载Todo失败'));
    } finally {
      setLoading(false);
    }
  }, []);

  // 创建Todo
  const addTodo = useCallback(async (todoData: CreateTodoDto) => {
    try {
      setLoading(true);
      const newTodo = await todoApiService.createTodo(todoData);
      setTodos(prev => [...prev, newTodo]);
      return newTodo;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('创建Todo失败'));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 更新Todo
  const updateTodo = useCallback(async (id: string, updateData: UpdateTodoDto) => {
    try {
      setLoading(true);
      const updatedTodo = await todoApiService.updateTodo(id, updateData);
      setTodos(prev => prev.map(todo => todo.id === id ? updatedTodo : todo));
      return updatedTodo;
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`更新Todo(ID: ${id})失败`));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 删除Todo
  const removeTodo = useCallback(async (id: string) => {
    try {
      setLoading(true);
      await todoApiService.deleteTodo(id);
      setTodos(prev => prev.filter(todo => todo.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error(`删除Todo(ID: ${id})失败`));
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // 初始加载
  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  return {
    todos,
    loading,
    error,
    fetchTodos,
    addTodo,
    updateTodo,
    removeTodo
  };
};
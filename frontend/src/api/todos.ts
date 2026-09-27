import axios from 'axios';
import { Todo } from '../types/Todo';

axios.defaults.baseURL = 'http://localhost:3005';

export function getAll(): Promise<Todo[]> {
  return axios.get('/todos').then(res => res.data);
}

export function updateAll(items: Todo[]): Promise<Todo[]> {
  return axios.patch('/todos?action=update', { items }).then(res => res.data);
}

export function deleteAll(items: Todo[]): Promise<Todo[]> {
  return axios
    .patch('/todos?action=delete', { ids: items.map(item => item.id) })
    .then(res => res.data);
}

export async function getOne(id: string): Promise<Todo[]> {
  const response = await axios.get(`/todos/${id}`);

  return response.data;
}

export async function deleteTodo(id: string): Promise<string> {
  const response = await axios.delete(`/todos/${id}`);

  return response.statusText;
}

export async function add(title: string): Promise<Todo> {
  const response = await axios.post('/todos', { title });

  return response.data;
}

export async function update({ title, completed, id }: Todo): Promise<Todo> {
  const response = await axios.put(`/todos/${id}`, { title, completed });

  return response.data;
}

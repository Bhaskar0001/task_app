export type Priority = 'Low' | 'Medium' | 'High';
export type Status = 'Pending' | 'In Progress' | 'Completed';

export interface Task {
  _id: string;
  title: string;
  description?: string;
  priority: Priority;
  dueDate?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  status?: Status;
}

export interface UpdateTaskInput {
  title: string;
  description?: string;
  priority?: Priority;
  dueDate?: string;
  status?: Status;
}

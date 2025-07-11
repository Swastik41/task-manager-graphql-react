import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete, onEdit, onToggle }) {
  return (
    <ul className="task-list">
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onDelete={() => onDelete(task.id)}
          onEdit={() => onEdit(task)}
          onToggle={() => onToggle(task.id)}
        />
      ))}
    </ul>
  );
}

import { FaCheckCircle, FaRegCircle } from "react-icons/fa";

function getDueColor(dueDate) {
  if (!dueDate) return '';
  const now = new Date();
  const due = new Date(dueDate);
  if (due < now) return 'due-overdue';
  if (due - now < 36 * 3600 * 1000) return 'due-soon'; // <36 hours
  return '';
}

function getPriorityColor(priority) {
  if (priority === "High") return "priority-high";
  if (priority === "Medium") return "priority-medium";
  return "priority-low";
}

export default function TaskItem({ task, onDelete, onEdit, onToggle }) {
  const dueColor = getDueColor(task.dueDate);
  const prioClass = getPriorityColor(task.priority);
  return (
    <li className={`task-item ${task.completed ? "completed" : ""}`}>
      <div className="task-main">
        <span className="check-circle" onClick={onToggle} title={task.completed ? "Mark as Incomplete" : "Mark as Complete"}>
          {task.completed ? <FaCheckCircle /> : <FaRegCircle />}
        </span>
        <span>
          <strong>{task.title}</strong>
          {task.description && <span className="task-desc">({task.description})</span>}
        </span>
        <span className={`priority-badge ${prioClass}`}>{task.priority}</span>
        {task.dueDate &&
          <span className={`due-date ${dueColor}`}>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
        }
        <div className="created-at">Created: {new Date(task.createdAt).toLocaleString()}</div>
      </div>
      <div>
        <button className="btn-secondary" onClick={onEdit}>Edit</button>
        <button className="btn-danger" onClick={onDelete}>Delete</button>
      </div>
    </li>
  );
}

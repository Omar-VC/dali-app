import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

export default function TaskList() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "tasks"), where("uid", "==", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(results);
    });

    return () => unsubscribe();
  }, [user]);

  if (tasks.length === 0) {
    return <p className="text-gray-500 text-sm">No tenés tareas todavía</p>;
  }

  return (
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li
          key={task.id}
          className="flex items-center justify-between bg-white p-3 rounded-lg shadow"
        >
          <span
            className={`flex-1 ${
              task.completed ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </span>

          <div className="flex gap-2">
            <button
              onClick={() =>
                updateDoc(doc(db, "tasks", task.id), {
                  completed: !task.completed,
                })
              }
              className="text-sm px-3 py-1 rounded bg-gray-200"
            >
              {task.completed ? "↩" : "✓"}
            </button>

            <button
              onClick={() => deleteDoc(doc(db, "tasks", task.id))}
              className="text-sm px-3 py-1 rounded bg-red-500 text-white"
            >
              ✕
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}

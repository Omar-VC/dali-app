import TaskForm from "../components/tasks/TaskForm";
import TaskList from "../components/tasks/TaskList";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { doc, onSnapshot, collection, query, where } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();
  const [tasksToday, setTasksToday] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [balanceTotal, setBalanceTotal] = useState(0);

  useEffect(() => {
    if (!user) return;

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("uid", "==", user.uid));

    const unsubTasks = onSnapshot(q, (snapshot) => {
      let today = 0;
      let completed = 0;

      snapshot.forEach((doc) => {
        const data = doc.data();
        if (!data.completed) today++;
        if (data.completed) completed++;
      });

      setTasksToday(today);
      setCompletedTasks(completed);
    });

    const balanceRef = doc(db, "balances", user.uid);
    const unsubBalance = onSnapshot(balanceRef, (docSnap) => {
      if (docSnap.exists()) setBalanceTotal(docSnap.data().total);
      else setBalanceTotal(0);
    });

    return () => {
      unsubTasks();
      unsubBalance();
    };
  }, [user]);

  return (
    <div className="space-y-6 px-4 sm:px-6 md:px-8">
      <h2 className="text-xl sm:text-2xl font-bold">Dashboard</h2>

      {/* Cards responsivas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-start">
          <p className="text-sm text-gray-500">Tareas hoy</p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold">{tasksToday}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-start">
          <p className="text-sm text-gray-500">Tareas completadas</p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold">{completedTasks}</p>
        </div>

        <div className="bg-white p-4 rounded-xl shadow flex flex-col items-start">
          <p className="text-sm text-gray-500">Balance total</p>
          <p className="text-lg sm:text-xl md:text-2xl font-semibold">${balanceTotal}</p>
        </div>
      </div>

      {/* Sección de tareas */}
      <div className="space-y-6">
        <h2 className="text-xl sm:text-2xl font-bold">Tareas</h2>
        <TaskForm />
        <TaskList />
      </div>
    </div>
  );
}

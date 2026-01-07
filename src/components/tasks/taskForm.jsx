import { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

export default function TaskForm() {
  const [title, setTitle] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    await addDoc(collection(db, "tasks"), {
      title,
      completed: false,
      uid: user.uid,
      createdAt: serverTimestamp(),
    });

    setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="text"
        placeholder="Nueva tarea..."
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="flex-1 border rounded-lg px-3 py-2"
      />

      <button className="bg-black text-white px-4 rounded-lg">
        Agregar
      </button>
    </form>
  );
}

import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  deleteDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

// Heroicons (flechas)
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from "@heroicons/react/24/solid";

export default function TransactionList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, "transactions"), where("uid", "==", user.uid));
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
      setItems(data);
    });

    return () => unsub();
  }, [user]);

  const handleDelete = async (id, type, amount) => {
    await deleteDoc(doc(db, "transactions", id));
    const balanceRef = doc(db, "balances", user.uid);
    await updateDoc(balanceRef, {
      total: type === "income" ? increment(-amount) : increment(amount),
    });
  };

  const handleEdit = async (id, oldType, oldAmount) => {
    const newAmount = parseFloat(prompt("Nuevo monto:", oldAmount));
    if (!newAmount || newAmount <= 0) return;

    const newType = prompt("Tipo (income/expense):", oldType);
    if (newType !== "income" && newType !== "expense") return;

    const txRef = doc(db, "transactions", id);
    await updateDoc(txRef, { amount: newAmount, type: newType });

    const balanceRef = doc(db, "balances", user.uid);
    let diff = 0;
    if (oldType === "income") diff -= oldAmount;
    else diff += oldAmount;

    if (newType === "income") diff += newAmount;
    else diff -= newAmount;

    await updateDoc(balanceRef, { total: increment(diff) });
  };

  const handleClear = async () => {
    for (let item of items) {
      await deleteDoc(doc(db, "transactions", item.id));
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xl font-bold">Transacciones</p>

      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className={`flex justify-between items-center p-3 rounded-lg shadow 
              ${item.type === "income" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
          >
            <div className="flex items-center gap-2">
              {item.type === "income" ? (
                <ArrowUpCircleIcon className="h-6 w-6 text-green-600" />
              ) : (
                <ArrowDownCircleIcon className="h-6 w-6 text-red-600" />
              )}
              <span>
                {item.type === "income" ? "+" : "-"}${item.amount} — {item.detail}
              </span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item.id, item.type, item.amount)}
                className="text-blue-600 text-sm"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(item.id, item.type, item.amount)}
                className="text-red-600 text-sm"
              >
                Borrar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {items.length > 0 && (
        <button
          onClick={handleClear}
          className="bg-red-600 text-white px-4 py-2 rounded-lg mt-2"
        >
          Limpiar lista
        </button>
      )}
    </div>
  );
}

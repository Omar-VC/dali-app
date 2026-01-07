import { useState } from "react";
import { addDoc, collection, serverTimestamp, doc, updateDoc, increment, setDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import { useAuth } from "../../context/AuthContext";

export default function TransactionForm({ type, onClose }) {
  const [amount, setAmount] = useState("");
  const [detail, setDetail] = useState("");
  const { user } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || amount <= 0) return;

    // Crear la transacción
    await addDoc(collection(db, "transactions"), {
      uid: user.uid,
      type,
      amount: Number(amount),
      detail,
      createdAt: serverTimestamp(),
    });

    // Actualizar balance total
    const balanceRef = doc(db, "balances", user.uid);
    const balanceSnap = await getDoc(balanceRef);
    if (!balanceSnap.exists()) {
      await setDoc(balanceRef, { total: type === "income" ? Number(amount) : -Number(amount) });
    } else {
      await updateDoc(balanceRef, {
        total: increment(type === "income" ? Number(amount) : -Number(amount)),
      });
    }

    setAmount("");
    setDetail("");
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <h3 className="font-semibold">
        {type === "income" ? "Nuevo ingreso" : "Nuevo egreso"}
      </h3>

      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <input
        type="text"
        placeholder="Detalle"
        value={detail}
        onChange={(e) => setDetail(e.target.value)}
        className="w-full border rounded-lg px-3 py-2"
      />

      <div className="flex gap-2">
        <button className="bg-black text-white px-4 py-2 rounded-lg">Guardar</button>
        <button type="button" onClick={onClose} className="text-gray-500">Cancelar</button>
      </div>
    </form>
  );
}

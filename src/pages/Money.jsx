import { useState, useEffect } from "react";
import TransactionForm from "../components/transactions/TransactionForm";
import TransactionList from "../components/transactions/TransactionList";
import BalanceModal from "../components/BalanceModal";
import { useAuth } from "../context/AuthContext";
import { db } from "../firebase/config";
import { doc, onSnapshot, setDoc } from "firebase/firestore";

export default function Money() {
  const { user } = useAuth();

  const [mode, setMode] = useState(null);
  const [showBalanceModal, setShowBalanceModal] = useState(false);
  const [balanceTotal, setBalanceTotal] = useState(0);

  // --- Escuchar balance en tiempo real desde Firebase ---
  useEffect(() => {
    if (!user) return;

    const balanceRef = doc(db, "balances", user.uid);
    const unsub = onSnapshot(balanceRef, (snap) => {
      if (snap.exists()) setBalanceTotal(snap.data().total);
      else setBalanceTotal(0);
    });

    return () => unsub();
  }, [user]);

  // --- Guardar balance manual desde el modal ---
  const handleSaveBaseBalance = async (newBase) => {
    if (user) {
      const balanceRef = doc(db, "balances", user.uid);
      await setDoc(balanceRef, { total: newBase }, { merge: true });
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dinero</h2>

      <div className="bg-white p-4 rounded-xl shadow">
        <p className="text-sm text-gray-500">Balance total</p>
        <p className="text-2xl font-semibold">${balanceTotal}</p>
      </div>

      <div className="flex gap-4">
        <button onClick={() => setMode("income")} className="bg-green-600 text-white px-4 py-2 rounded-lg">
          Registrar ingreso $
        </button>
        <button onClick={() => setMode("expense")} className="bg-red-600 text-white px-4 py-2 rounded-lg">
          Registrar egreso $
        </button>
        <button onClick={() => setShowBalanceModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
          Modificar balance
        </button>
      </div>

      {mode && <TransactionForm type={mode} onClose={() => setMode(null)} />}
      {showBalanceModal && (
        <BalanceModal
          currentBalance={balanceTotal}
          onClose={() => setShowBalanceModal(false)}
          onSave={handleSaveBaseBalance}
        />
      )}

      <TransactionList />
    </div>
  );
}

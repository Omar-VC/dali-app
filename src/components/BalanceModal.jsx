import { useState } from "react";

export default function BalanceModal({ currentBalance, onClose, onSave }) {
  const [amount, setAmount] = useState(currentBalance);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (amount === null || amount < 0) return;
    console.log("Guardando balance:", amount); // 👈 acá ves el valor en consola

    onSave(amount);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-lg">
        <h3 className="text-lg font-semibold mb-4">Modificar Balance Total</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="number"
            placeholder="Monto total"
            value={amount}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full border rounded-lg px-3 py-2"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg text-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-lg"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

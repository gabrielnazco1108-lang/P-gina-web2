import React, { useState } from "react";
import { EscrowTransaction, CatalogItem } from "../types";
import { CheckCircle2, Circle, AlertCircle, FileLock2, ArrowRight, Shield, CreditCard, Landmark, DollarSign, RefreshCw, Scale, Check } from "lucide-react";

interface EscrowModuleProps {
  transactions: EscrowTransaction[];
  catalog: CatalogItem[];
  onUpdateTransaction: (tx: EscrowTransaction) => void;
  onAddTransaction: (tx: EscrowTransaction) => void;
}

export function EscrowModule({ transactions, catalog, onUpdateTransaction, onAddTransaction }: EscrowModuleProps) {
  const [selectedTx, setSelectedTx] = useState<EscrowTransaction>(transactions[0]);
  const [draftingContract, setDraftingContract] = useState(false);
  const [contractDraft, setContractDraft] = useState<string | null>(null);

  // New Escrow simulator state
  const [newTxBuyer, setNewTxBuyer] = useState("");
  const [newTxSeller, setNewTxSeller] = useState("");
  const [selectedItem, setSelectedItem] = useState<CatalogItem>(catalog[0]);
  const [paymentMethod, setPaymentMethod] = useState<"ESCROW_TRANS" | "COMMERCIAL_CREDIT" | "BANK_WIRE">("ESCROW_TRANS");
  const [deliveryTerm, setDeliveryTerm] = useState("FCA (Incoterms 2020)");
  const [inspectionDays, setInspectionDays] = useState(5);

  const handleCreateEscrow = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTxBuyer || !newTxSeller) {
      alert("Por favor completa los nombres de Comprador y Vendedor.");
      return;
    }

    const newTx: EscrowTransaction = {
      id: "tx-" + (Date.now() % 100000),
      item: selectedItem,
      buyerName: newTxBuyer,
      sellerName: newTxSeller,
      amount: selectedItem.price,
      status: "CREATED",
      paymentMethod,
      deliveryTerm,
      inspectionPeriodDays: inspectionDays,
      timeline: [
        { status: "CREATED", label: "Contrato Firmado", date: new Date().toISOString().split("T")[0], description: "Las partes acuerdan y firman digitalmente los términos de depósito.", completed: true },
        { status: "FUNDS_DEPOSITED", label: "Custodia Activa", date: "", description: "El comprador transfiere fondos a la cuenta neutral de custodia del marketplace.", completed: false },
        { status: "EQUIPMENT_SHIPPED", label: "Logística y Despacho", date: "", description: "El vendedor despacha la maquinaria pesada con guías aduaneras oficiales.", completed: false },
        { status: "IN_INSPECTION", label: "Conformidad Técnica", date: "", description: "Periodo de inspección en sitio. Terceras partes certifican estado.", completed: false },
        { status: "FUNDS_RELEASED", label: "Liquidación Bancaria", date: "", description: "Liberación autorizada y transferencia final al vendedor.", completed: false }
      ]
    };

    onAddTransaction(newTx);
    setSelectedTx(newTx);
    setContractDraft(null); // Clear previous contract
    // Reset inputs
    setNewTxBuyer("");
    setNewTxSeller("");
  };

  // Draft Contract with Gemini
  const handleDraftContract = async (tx: EscrowTransaction) => {
    setDraftingContract(true);
    try {
      const response = await fetch("/api/gemini/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateContract",
          payload: {
            buyer: tx.buyerName,
            seller: tx.sellerName,
            machineName: tx.item.name,
            price: tx.amount,
            deliveryTerm: tx.deliveryTerm,
            escrowConditions: `El monto de ${tx.amount} USD se mantendrá en custodia en la cuenta neutral y será liberado al vendedor una vez transcurrido el periodo de inspección de ${tx.inspectionPeriodDays} días sin reporte de disconformidad técnica formal.`
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setContractDraft(data.result);
      } else {
        alert("Error de redacción legal: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error al comunicarse con el redactor legal IA.");
    } finally {
      setDraftingContract(false);
    }
  };

  // Advance Escrow States (Simulation)
  const advanceStatus = (tx: EscrowTransaction, nextState: "FUNDS_DEPOSITED" | "EQUIPMENT_SHIPPED" | "IN_INSPECTION" | "FUNDS_RELEASED") => {
    const today = new Date().toISOString().split("T")[0];
    const updatedTimeline = tx.timeline.map((step) => {
      if (step.status === nextState) {
        return { ...step, completed: true, date: today };
      }
      // Keep previous completed steps true
      return step;
    });

    const updatedTx: EscrowTransaction = {
      ...tx,
      status: nextState,
      timeline: updatedTimeline
    };

    onUpdateTransaction(updatedTx);
    setSelectedTx(updatedTx);
  };

  return (
    <div className="space-y-8">
      {/* Visual Flow Explanation banner */}
      <div className="bg-slate-50 border-2 border-slate-900 rounded-none p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1.5 max-w-2xl">
          <h4 className="text-sm font-sans font-black uppercase text-slate-900 flex items-center gap-1.5">
            <Shield className="text-orange-600" size={16} /> El Flujo de Custodia de Fondos (Escrow de Alta Seguridad)
          </h4>
          <p className="text-slate-600 text-xs leading-relaxed font-sans">
            El dinero de la compraventa no va directo al vendedor. El marketplace actúa como fideicomisario neutro registrado, custodiando los fondos hasta que el comprador e inspectores firman la conformidad de entrega técnica de la maquinaria pesada.
          </p>
        </div>
        <div className="flex gap-2 shrink-0 font-mono text-[10px] text-slate-600 bg-white p-2.5 rounded-none border border-slate-300 uppercase">
          <span className="flex items-center gap-1 font-bold text-orange-600"><Check size={12} /> mTLS</span> | 
          <span className="flex items-center gap-1 font-bold text-orange-600"><Check size={12} /> Cuentas Segregadas</span> | 
          <span className="flex items-center gap-1 font-bold text-orange-600"><Check size={12} /> Swift ISO20022</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Panel izquierdo: Transacciones activas & Simulación */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* List of Escrow Transactions */}
          <div className="bg-white rounded-none border-2 border-slate-900 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-4">
            <h3 className="font-sans font-black uppercase text-slate-900 text-xs flex items-center gap-2 border-b-2 border-slate-900 pb-3">
              <FileLock2 size={16} className="text-orange-600" />
              Contratos en Custodia (Escrow)
            </h3>

            <div className="space-y-2 max-h-[220px] overflow-y-auto">
              {transactions.map((tx) => {
                const isSelected = selectedTx.id === tx.id;
                return (
                  <button
                    key={tx.id}
                    onClick={() => {
                      setSelectedTx(tx);
                      setContractDraft(null); // Reset draft
                    }}
                    className={`w-full text-left p-3 rounded-none border-2 transition-all flex items-center justify-between cursor-pointer ${
                      isSelected
                        ? "bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]"
                        : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div>
                      <div className="font-sans font-black uppercase text-xs tracking-tight truncate max-w-[195px]">
                        {tx.item.name}
                      </div>
                      <div className="text-[9px] font-mono opacity-75 mt-0.5 flex items-center gap-1.5 uppercase">
                        <span>{tx.buyerName}</span> ➔ <span>{tx.sellerName}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-sans font-bold text-xs">${tx.amount.toLocaleString()} USD</div>
                      <span className="text-[9px] font-mono uppercase block mt-0.5 font-bold text-orange-500">
                        {tx.status}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* New Transaction Form (Simulator Launcher) */}
          <div className="bg-white rounded-none border-2 border-slate-900 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
            <h3 className="font-sans font-black uppercase text-slate-900 text-xs flex items-center gap-2 mb-4 border-b border-slate-200 pb-2">
              <Landmark size={16} className="text-orange-600" />
              Simulador: Generar Transacción B2B
            </h3>

            <form onSubmit={handleCreateEscrow} className="space-y-4">
              <div>
                <label className="text-slate-800 text-[10px] font-mono font-bold block mb-1 uppercase tracking-wider">
                  Comprador (Empresa KYB Aprobada)
                </label>
                <input
                  type="text"
                  required
                  value={newTxBuyer}
                  onChange={(e) => setNewTxBuyer(e.target.value)}
                  placeholder="Ej. Heidelberg Industrial Logistics"
                  className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none focus:border-slate-950 font-sans"
                />
              </div>

              <div>
                <label className="text-slate-800 text-[10px] font-mono font-bold block mb-1 uppercase tracking-wider">
                  Vendedor (Empresa KYB Aprobada)
                </label>
                <input
                  type="text"
                  required
                  value={newTxSeller}
                  onChange={(e) => setNewTxSeller(e.target.value)}
                  placeholder="Ej. Aceros del Atlántico S.A."
                  className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none focus:border-slate-950 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 text-[10px] font-mono font-bold block mb-1 uppercase tracking-wider">
                    Activo Catálogo
                  </label>
                  <select
                    value={selectedItem.id}
                    onChange={(e) => {
                      const found = catalog.find((i) => i.id === e.target.value);
                      if (found) setSelectedItem(found);
                    }}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none focus:border-slate-950 font-sans"
                  >
                    {catalog.map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.brand} {i.name.slice(0, 15)}... (${i.price.toLocaleString()} USD)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-800 text-[10px] font-mono font-bold block mb-1 uppercase tracking-wider">
                    Método Seguro
                  </label>
                  <select
                    value={paymentMethod}
                    onChange={(e: any) => setPaymentMethod(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none"
                  >
                    <option value="ESCROW_TRANS">Escrow Custodiado</option>
                    <option value="COMMERCIAL_CREDIT">Crédito Comercial</option>
                    <option value="BANK_WIRE">Transferencia Wire Directa</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-800 text-[10px] font-mono font-bold block mb-1 uppercase tracking-wider">
                    Incoterm / Entrega
                  </label>
                  <input
                    type="text"
                    value={deliveryTerm}
                    onChange={(e) => setDeliveryTerm(e.target.value)}
                    placeholder="Ej. DDP Veracruz"
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-800 text-[10px] font-mono font-bold block mb-1 uppercase tracking-wider">
                    Inspección (Días)
                  </label>
                  <input
                    type="number"
                    value={inspectionDays}
                    onChange={(e) => setInspectionDays(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white font-sans font-black text-xs uppercase tracking-widest py-3 rounded-none flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
              >
                <DollarSign size={14} /> Inicializar Fideicomiso
              </button>
            </form>
          </div>

        </div>

        {/* Panel derecho: Trazabilidad y borrador de contrato legal */}
        <div className="lg:col-span-7 bg-white rounded-none border-2 border-slate-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <div className="border-b-2 border-slate-900 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-slate-400 text-[9px] font-mono tracking-wider uppercase block">
                SEGUIMIENTO DE TRANSACCIÓN / ID: {selectedTx.id}
              </span>
              <h3 className="font-sans font-black uppercase text-slate-900 text-lg mt-1 leading-none">
                {selectedTx.item.brand} {selectedTx.item.name}
              </h3>
              <p className="text-slate-500 text-xs mt-1.5 font-mono">
                Comprador: <strong className="text-slate-800 uppercase">{selectedTx.buyerName}</strong> ➔ Vendedor: <strong className="text-slate-800 uppercase">{selectedTx.sellerName}</strong>
              </p>
            </div>
            
            <div className="text-left sm:text-right">
              <span className="text-slate-400 text-[9px] font-mono block uppercase">MONTO TOTAL EN ESCROW</span>
              <span className="text-xl font-sans font-black text-slate-900">${selectedTx.amount.toLocaleString()} USD</span>
            </div>
          </div>

          {/* Interactive Steps Visual Tracker */}
          <div>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 mb-4">
              Línea de Vida de la Transacción Segura
            </h4>

            <div className="space-y-6 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
              {selectedTx.timeline.map((step, idx) => {
                const isCompleted = step.completed;
                const isCurrent = !isCompleted && (idx === 0 || selectedTx.timeline[idx - 1].completed);

                return (
                  <div key={step.status} className="flex gap-4 relative">
                    {/* Circle icon */}
                    <div className="relative z-10">
                      {isCompleted ? (
                        <div className="w-6 h-6 rounded-none bg-emerald-500 border border-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                          ✓
                        </div>
                      ) : isCurrent ? (
                        <div className="w-6 h-6 rounded-none bg-orange-500 border border-orange-600 text-white flex items-center justify-center font-bold text-[10px] animate-pulse">
                          ●
                        </div>
                      ) : (
                        <div className="w-6 h-6 rounded-none bg-white border border-slate-300 text-slate-300 flex items-center justify-center">
                          <Circle size={10} />
                        </div>
                      )}
                    </div>

                    {/* Step label & details */}
                    <div className="flex-1">
                      <div className="flex justify-between items-baseline">
                        <h5 className={`font-sans font-bold text-xs uppercase tracking-wide ${isCompleted ? "text-slate-900" : isCurrent ? "text-orange-600 font-black" : "text-slate-400"}`}>
                          {step.label}
                        </h5>
                        <span className="text-[9px] font-mono text-slate-400">{step.date}</span>
                      </div>
                      <p className={`text-xs mt-0.5 font-sans ${isCompleted ? "text-slate-600" : isCurrent ? "text-slate-800" : "text-slate-400"}`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Controls to simulate advancing states */}
          <div className="p-4 bg-slate-50 rounded-none border-2 border-slate-900 space-y-3">
            <h5 className="text-[10px] font-mono font-bold text-slate-700 uppercase tracking-wider">Acciones del Operador de Custodia (Fideicomiso)</h5>
            <div className="flex flex-wrap gap-2">
              {selectedTx.status === "CREATED" && (
                <button
                  onClick={() => advanceStatus(selectedTx, "FUNDS_DEPOSITED")}
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs px-3 py-2 rounded-none font-sans font-black uppercase tracking-wider transition-all cursor-pointer shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
                >
                  Confirmar Depósito del Comprador
                </button>
              )}
              {selectedTx.status === "FUNDS_DEPOSITED" && (
                <button
                  onClick={() => advanceStatus(selectedTx, "EQUIPMENT_SHIPPED")}
                  className="bg-slate-900 hover:bg-slate-850 text-white text-xs px-3 py-2 rounded-none font-sans font-black uppercase tracking-wider transition-all cursor-pointer shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
                >
                  Registrar Guía de Despacho
                </button>
              )}
              {selectedTx.status === "EQUIPMENT_SHIPPED" && (
                <button
                  onClick={() => advanceStatus(selectedTx, "IN_INSPECTION")}
                  className="bg-slate-900 hover:bg-slate-850 text-white text-xs px-3 py-2 rounded-none font-sans font-black uppercase tracking-wider transition-all cursor-pointer shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
                >
                  Iniciar Inspección Técnica
                </button>
              )}
              {selectedTx.status === "IN_INSPECTION" && (
                <button
                  onClick={() => advanceStatus(selectedTx, "FUNDS_RELEASED")}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-2 rounded-none font-sans font-black uppercase tracking-wider transition-all cursor-pointer shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
                >
                  Liberar Custodia (Firma y Traspaso)
                </button>
              )}
              {selectedTx.status === "FUNDS_RELEASED" && (
                <span className="text-emerald-800 font-mono text-[11px] font-bold bg-emerald-50 border border-emerald-300 px-3 py-2.5 rounded-none block w-full uppercase leading-normal">
                  ✔ Fideicomiso Liquidado al 100% con Éxito. Comprobante bancario Swift enviado a ambas partes corporativas.
                </span>
              )}
            </div>
          </div>

          {/* AI Contract generation button and output */}
          <div className="border-t-2 border-slate-900 pt-5 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                Borrador de Contrato Digital B2B
              </h4>
              <button
                onClick={() => handleDraftContract(selectedTx)}
                disabled={draftingContract}
                className="bg-slate-900 hover:bg-slate-850 text-white font-mono font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-none flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 border border-slate-900 shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]"
              >
                {draftingContract ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Scale size={12} className="text-orange-500" />
                )}
                Redactar Contrato Escrow con IA
              </button>
            </div>

            {contractDraft ? (
              <div className="bg-slate-50 border border-slate-300 rounded-none p-4 font-mono text-[11px] max-h-[300px] overflow-y-auto leading-relaxed text-slate-700">
                <div className="border-b border-slate-200 pb-2 mb-3 flex justify-between text-slate-500 text-[10px] uppercase font-bold">
                  <span>CONTRATO_DRAFT_{selectedTx.id}.MD</span>
                  <span>BORRADOR LEGAL PREPARADO</span>
                </div>
                <div className="whitespace-pre-wrap leading-normal prose prose-sm max-w-none">
                  {contractDraft}
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-none p-6 text-center text-xs text-slate-400 font-sans">
                Haz clic en <strong>Redactar Contrato Escrow con IA</strong> para redactar un acuerdo de fideicomiso legal de comercio industrial estructurado por la inteligencia artificial basado en normativas aduaneras.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}

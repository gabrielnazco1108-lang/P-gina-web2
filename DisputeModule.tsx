import React, { useState } from "react";
import { EscrowTransaction } from "../types";
import { ShieldAlert, Scale, Sparkles, AlertTriangle, CheckCircle, RefreshCw, Star, ArrowUpRight, HelpCircle } from "lucide-react";

interface DisputeModuleProps {
  transactions: EscrowTransaction[];
  onUpdateTransaction: (tx: EscrowTransaction) => void;
}

export function DisputeModule({ transactions, onUpdateTransaction }: DisputeModuleProps) {
  // Filter transactions that can be disputed or are in active dispute simulation
  const [selectedTx, setSelectedTx] = useState<EscrowTransaction>(transactions[0]);
  const [buyerClaim, setBuyerClaim] = useState("");
  const [sellerResponse, setSellerResponse] = useState("");
  const [resolvingDispute, setResolvingDispute] = useState(false);

  // Ratings simulator state
  const [ratingInput, setRatingInput] = useState(5);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  const handleOpenDispute = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyerClaim) {
      alert("Por favor redacta la disconformidad técnica del comprador.");
      return;
    }

    const updatedTx: EscrowTransaction = {
      ...selectedTx,
      status: "DISPUTE_OPENED",
      disputeNotes: {
        buyerClaim,
        sellerResponse: sellerResponse || "El vendedor sostiene que el equipo cumple estrictamente con el manual de mantenimiento y las horas declaradas en la ficha técnica inicial del catálogo.",
      }
    };

    onUpdateTransaction(updatedTx);
    setSelectedTx(updatedTx);
    setBuyerClaim("");
    setSellerResponse("");
  };

  // Resolve Dispute with Gemini Arbitrator
  const handleAIBindingArbitration = async (tx: EscrowTransaction) => {
    if (!tx.disputeNotes?.buyerClaim) {
      alert("No hay reclamación activa registrada para esta disputa.");
      return;
    }

    setResolvingDispute(true);
    try {
      const response = await fetch("/api/gemini/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "resolveDispute",
          payload: {
            machineName: tx.item.brand + " " + tx.item.name,
            transactionAmount: tx.amount,
            buyerClaim: tx.disputeNotes.buyerClaim,
            sellerCounterClaim: tx.disputeNotes.sellerResponse || "Equipo entregado en conformidad operativa."
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        const updatedTx: EscrowTransaction = {
          ...tx,
          disputeNotes: {
            ...tx.disputeNotes!,
            aiArbitration: data.result,
            resolvedAt: new Date().toISOString().split("T")[0],
            resolutionOutcome: "Propuesta de Mediación sugerida por Mediador Neutro de IA B2B."
          }
        };
        onUpdateTransaction(updatedTx);
        setSelectedTx(updatedTx);
      } else {
        alert("Error de arbitraje: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error al comunicarse con el mediador legal.");
    } finally {
      setResolvingDispute(false);
    }
  };

  const handleSubmitRating = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText) {
      alert("Por favor ingresa un comentario comercial.");
      return;
    }
    setFeedbackSubmitted(true);
    setTimeout(() => {
      setFeedbackSubmitted(false);
      setFeedbackText("");
      alert("¡Calificación corporativa registrada en los logs inmutables de reputación del vendedor!");
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Panel izquierdo: Gestión de disputas e inicio de reclamación */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Open Dispute Form */}
        <div className="bg-white rounded-none border-2 border-slate-900 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <h3 className="font-sans font-black uppercase text-slate-900 text-xs flex items-center gap-2 border-b-2 border-slate-900 pb-3">
            <ShieldAlert size={16} className="text-rose-600" />
            Iniciar Disputa Técnica Comercial
          </h3>
          <p className="text-slate-600 text-xs leading-normal font-sans">
            Si durante el periodo de inspección de la maquinaria el comprador de prueba detecta fallas severas o piezas no declaradas, puede activar el freno de escrow para retener los fondos.
          </p>

          <form onSubmit={handleOpenDispute} className="space-y-4">
            <div>
              <label className="text-[10px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                Seleccionar Transacción Activa
              </label>
              <select
                value={selectedTx.id}
                onChange={(e) => {
                  const found = transactions.find((t) => t.id === e.target.value);
                  if (found) setSelectedTx(found);
                }}
                className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none focus:border-slate-900"
              >
                {transactions.map((t) => (
                  <option key={t.id} value={t.id}>
                    TX-{t.id.slice(-4)}: {t.item.name.slice(0, 18)}... (${t.amount.toLocaleString()} USD)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                Reclamación Técnica del Comprador *
              </label>
              <textarea
                required
                value={buyerClaim}
                onChange={(e) => setBuyerClaim(e.target.value)}
                placeholder="Ej. El motor de la excavadora presenta fugas severas en el colector de escape y pérdida de compresión. No coincide con el estado 'Excelente' publicado..."
                rows={3}
                className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none focus:border-rose-500 font-sans"
              />
            </div>

            <div>
              <label className="text-[10px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">
                Descargo del Vendedor (Opcional)
              </label>
              <textarea
                value={sellerResponse}
                onChange={(e) => setSellerResponse(e.target.value)}
                placeholder="Ej. El equipo fue entregado funcionando. Dichas marcas corresponden al desgaste normal por horas declaradas..."
                rows={2}
                className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none focus:border-slate-900"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-rose-600 hover:bg-rose-700 text-white font-sans font-black uppercase text-xs tracking-widest py-3 rounded-none flex items-center justify-center gap-2 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer border border-rose-700"
            >
              Frenar Escrow y Abrir Disputa
            </button>
          </form>
        </div>

        {/* Reputation and Rating System simulation */}
        <div className="bg-white rounded-none border-2 border-slate-900 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <h3 className="font-sans font-black uppercase text-slate-900 text-xs flex items-center gap-2 border-b-2 border-slate-900 pb-3">
            <Star size={16} className="text-orange-500 fill-orange-500" />
            Calificación y Reputación B2B
          </h3>
          <p className="text-slate-600 text-xs font-sans">
            Una vez finalizado el Escrow, las empresas se califican con firmas criptográficas de reputación de transacciones exitosas.
          </p>

          <form onSubmit={handleSubmitRating} className="space-y-3">
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setRatingInput(star)}
                  className="text-orange-500 hover:scale-110 transition-transform cursor-pointer"
                >
                  <Star size={18} fill={star <= ratingInput ? "#ea580c" : "none"} className={star <= ratingInput ? "text-orange-600" : "text-slate-400"} />
                </button>
              ))}
              <span className="text-xs font-mono text-slate-500 self-center ml-2 uppercase font-bold">Score: {ratingInput}/5</span>
            </div>

            <textarea
              required
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Escribe tu reseña corporativa de flete, veracidad técnica y tiempos de respuesta de la contraparte..."
              rows={2}
              className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:bg-white focus:outline-none"
            />

            <button
              type="submit"
              disabled={feedbackSubmitted}
              className="w-full bg-slate-900 hover:bg-slate-850 text-white text-xs font-black uppercase tracking-wider py-2.5 rounded-none transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] border border-slate-950"
            >
              {feedbackSubmitted ? "Registrando..." : "Enviar Calificación Oficial"}
            </button>
          </form>
        </div>

      </div>

      {/* Panel derecho: Arbitraje Legal Inteligente */}
      <div className="lg:col-span-7 bg-white rounded-none border-2 border-slate-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-6">
        
        <div className="border-b-2 border-slate-900 pb-4">
          <span className="text-slate-400 text-[9px] font-mono tracking-wider uppercase block">
            SISTEMA DE ARBITRAJE DE DISPUTAS B2B
          </span>
          <h3 className="font-sans font-black uppercase text-slate-900 text-lg mt-1 leading-none">
            Inspección de Conflictos de Transacción
          </h3>
          <p className="text-slate-500 text-xs mt-1.5 font-sans">
            Visualización y resolución justa mediante peritaje de evidencias y mediación por Inteligencia Artificial.
          </p>
        </div>

        {/* Info Card of current status */}
        <div className="p-4 rounded-none border-2 border-slate-900 flex gap-4 items-start bg-slate-50 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]">
          <div className="p-2 bg-slate-200 text-slate-800 rounded-none border border-slate-300">
            <Scale size={20} />
          </div>
          <div className="space-y-1 flex-1 min-w-0">
            <div className="flex justify-between items-baseline">
              <span className="text-[10px] font-mono font-black text-slate-900 uppercase">CONTRATO REF: TX-{selectedTx.id}</span>
              <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-none uppercase border ${
                selectedTx.status === "DISPUTE_OPENED" ? "bg-rose-50 text-rose-800 border-rose-300" : "bg-slate-200 text-slate-700 border-slate-300"
              }`}>
                {selectedTx.status}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-sans leading-relaxed">
              <strong>Equipo:</strong> {selectedTx.item.brand} {selectedTx.item.name} | <strong>Monto Escrow:</strong> ${selectedTx.amount.toLocaleString()} USD
            </p>
          </div>
        </div>

        {/* Claim and response block */}
        {selectedTx.disputeNotes?.buyerClaim ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-none space-y-1.5">
              <span className="text-rose-600 text-[9px] font-mono font-bold block uppercase tracking-wider">RECLAMO COMPRADOR:</span>
              <p className="text-slate-700 text-xs leading-relaxed italic font-sans">
                "{selectedTx.disputeNotes.buyerClaim}"
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-2 border-slate-900 rounded-none space-y-1.5">
              <span className="text-slate-500 text-[9px] font-mono font-bold block uppercase tracking-wider">DESCARGO VENDEDOR:</span>
              <p className="text-slate-700 text-xs leading-relaxed italic font-sans">
                "{selectedTx.disputeNotes.sellerResponse || "A la espera de respuesta del representante legal."}"
              </p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center text-slate-400 bg-slate-50 border-2 border-dashed border-slate-300 rounded-none">
            <AlertTriangle className="mx-auto text-orange-500 mb-2" size={24} />
            <p className="text-xs font-sans">
              La transacción seleccionada no tiene disputas abiertas. Puedes simular abrir una usando el formulario de la izquierda.
            </p>
          </div>
        )}

        {/* AI Arbitration triggers */}
        {selectedTx.disputeNotes?.buyerClaim && (
          <div className="border-t-2 border-slate-900 pt-5 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
                  Resolución Arbitral por IA B2B
                </h4>
                <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">Propuesta de conciliación justa con validez mercantil.</p>
              </div>
              <button
                onClick={() => handleAIBindingArbitration(selectedTx)}
                disabled={resolvingDispute}
                className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-none flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 border border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
              >
                {resolvingDispute ? (
                  <RefreshCw size={12} className="animate-spin" />
                ) : (
                  <Sparkles size={12} />
                )}
                Emitir Laudo Arbitral con IA
              </button>
            </div>

            {selectedTx.disputeNotes.aiArbitration ? (
              <div className="bg-slate-900 text-slate-100 rounded-none p-5 border-2 border-slate-900 space-y-4 font-mono text-[11px] max-h-[320px] overflow-y-auto leading-relaxed">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-orange-400 font-bold flex items-center gap-1.5 uppercase text-[9px] tracking-wider">
                    <Sparkles size={11} /> DICTAMEN DE ARBITRAJE COMERCIAL NEUTRO (IA ACCREDITED)
                  </span>
                  <span className="text-[9px] text-slate-500">RESOLUCIÓN COOPERATIVA</span>
                </div>
                <div className="whitespace-pre-wrap leading-normal text-slate-300 prose prose-invert max-w-none">
                  {selectedTx.disputeNotes.aiArbitration}
                </div>

                <div className="bg-slate-800 p-3 rounded-none border border-slate-700 flex justify-between items-center">
                  <span className="text-[9px] text-slate-400 font-mono font-bold uppercase tracking-wider">¿ACEPTAR PROPUESTA DE CONCILIACIÓN?</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        const updated: EscrowTransaction = {
                          ...selectedTx,
                          status: "REFUNDED",
                          disputeNotes: {
                            ...selectedTx.disputeNotes!,
                            resolutionOutcome: "Disputa resuelta mediante Reembolso Parcial / Acuerdo Bilateral sugerido por Mediador."
                          }
                        };
                        onUpdateTransaction(updated);
                        setSelectedTx(updated);
                        alert("Acuerdo aceptado. Fondos re-distribuidos de acuerdo al laudo.");
                      }}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-none uppercase tracking-wider"
                    >
                      Sí, Firmar Acuerdo
                    </button>
                    <button
                      onClick={() => alert("Rechazado. La disputa pasará a arbitraje de tribunales mercantiles designados en el contrato.")}
                      className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-none uppercase tracking-wider"
                    >
                      Ir a Juicio Legal
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="border border-dashed border-slate-300 rounded-none p-5 text-center text-xs text-slate-400 font-sans">
                La mediación neutral redactará recomendaciones, plazos de gracia y porcentajes de devolución para mitigar pérdidas de flete pesado de manera justa.
              </div>
            )}
          </div>
        )}

      </div>

    </div>
  );
}

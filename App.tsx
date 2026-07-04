import React, { useState } from "react";
import { Company, CatalogItem, EscrowTransaction } from "./types";
import { PRESET_COMPANIES, PRESET_CATALOG, PRESET_TRANSACTIONS } from "./data";
import { KybModule } from "./components/KybModule";
import { EscrowModule } from "./components/EscrowModule";
import { CatalogModule } from "./components/CatalogModule";
import { DisputeModule } from "./components/DisputeModule";
import { ArchitectureOverview } from "./components/ArchitectureOverview";
import { 
  ShieldCheck, 
  Building2, 
  FileLock2, 
  Layers, 
  Scale, 
  Settings, 
  Download, 
  RotateCcw, 
  Sparkles,
  Info
} from "lucide-react";

export default function App() {
  // Global simulation states
  const [companies, setCompanies] = useState<Company[]>(PRESET_COMPANIES);
  const [catalog, setCatalog] = useState<CatalogItem[]>(PRESET_CATALOG);
  const [transactions, setTransactions] = useState<EscrowTransaction[]>(PRESET_TRANSACTIONS);
  const [activeTab, setActiveTab] = useState<"architecture" | "kyb" | "escrow" | "catalog" | "disputes">("architecture");

  // State modifiers for interactive simulation
  const handleUpdateCompany = (updated: Company) => {
    setCompanies(companies.map((c) => (c.id === updated.id ? updated : c)));
  };

  const handleAddCompany = (newComp: Company) => {
    setCompanies([newComp, ...companies]);
  };

  const handleUpdateTransaction = (updated: EscrowTransaction) => {
    setTransactions(transactions.map((t) => (t.id === updated.id ? updated : t)));
  };

  const handleAddTransaction = (newTx: EscrowTransaction) => {
    setTransactions([newTx, ...transactions]);
  };

  const handleAddCatalogItem = (newItem: CatalogItem) => {
    setCatalog([newItem, ...catalog]);
  };

  const handleResetSimulation = () => {
    if (window.confirm("¿Seguro que deseas restablecer los datos de la simulación a sus valores originales?")) {
      setCompanies(PRESET_COMPANIES);
      setCatalog(PRESET_CATALOG);
      setTransactions(PRESET_TRANSACTIONS);
      alert("Simulación restablecida.");
    }
  };

  // Export full spec as JSON
  const handleExportSpecification = () => {
    const fullSpec = {
      platform: "InduTrust B2B Marketplace",
      version: "1.0.0-Beta",
      compliantStandards: ["GDPR Art 5", "AML Directive UE 2015/849", "ISO 9001", "Incoterms 2020"],
      modules: {
        kybVerification: {
          requiredDocuments: ["taxRegistration", "incorporationDeed", "identityProof", "bankReference"],
          onboardingFlow: ["Form Submission", "OFAC Sanciones Screening", "Gemini AI Risk Assessment", "Admin Approval"],
        },
        escrowTrustEngine: {
          custodyStates: ["CREATED", "FUNDS_DEPOSITED", "EQUIPMENT_SHIPPED", "IN_INSPECTION", "FUNDS_RELEASED", "DISPUTE_OPENED"],
          authorizedPaymentMethods: ["ESCROW_TRANS", "COMMERCIAL_CREDIT", "BANK_WIRE"],
        },
        industrialCatalogStructure: {
          mandatoryFields: ["serialNumber", "certifications", "maintenanceLogUrl", "operatingHours", "enginePowerHP"],
        },
        disputesAndArbitration: {
          resolutionChannels: ["AI Automated Mediation", "Tribunales Mercantiles Consensuados"],
        },
      },
      simulatedEntities: {
        companiesCount: companies.length,
        catalogItemsCount: catalog.length,
        transactionsCount: transactions.length,
      }
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullSpec, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", "indutrust-architecture-spec.json");
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Banner indicating status and compliance scope (System Bar style from Design Spec) */}
      <div className="bg-slate-900 text-slate-300 py-2.5 px-6 text-[10px] font-mono border-b border-slate-700 flex flex-wrap justify-between items-center gap-x-6 gap-y-1.5">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-orange-500 font-bold uppercase tracking-widest">
            <Sparkles size={13} className="animate-pulse" /> SIMULADOR ARQUITECTURA B2B ACTIVO
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">ESTADO API: OPERATIVO</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-slate-400">ENCRYPTED: TLS 1.3</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-400">LATENCY: 42ms</span>
          <span className="text-slate-600">|</span>
          <span className="text-emerald-400 font-bold flex items-center gap-1">
            <ShieldCheck size={13} /> CONFORME CON GDPR & AMLD5
          </span>
        </div>
      </div>

      {/* Main Executive Header with Geometric Balance / heavy border-b-2 */}
      <header className="bg-white border-b-4 border-slate-900 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          
          {/* Logo & Vibe Title */}
          <div className="flex items-center gap-4">
            <div className="w-11 h-11 bg-orange-600 flex items-center justify-center font-black text-xl text-white border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] shrink-0">
              IND
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-sans font-black tracking-tight text-slate-900 uppercase">
                  InduTrust <span className="text-orange-600 font-black">Marketplace</span>
                </h1>
                <span className="bg-slate-900 text-white text-[9px] font-mono font-bold px-2 py-0.5 border border-slate-900">
                  B2B CORE v1.0
                </span>
              </div>
              <p className="text-[11px] uppercase tracking-wider font-bold text-slate-400">
                Portal de Ingeniería de Software, Cumplimiento y Simulación Escrow
              </p>
            </div>
          </div>

          {/* Quick Simulation controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetSimulation}
              title="Restablecer todos los datos del simulador"
              className="bg-white hover:bg-slate-100 text-slate-700 hover:text-slate-900 font-bold text-xs uppercase tracking-wider px-3.5 py-2 border-2 border-slate-900 flex items-center gap-1.5 transition-all cursor-pointer shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-x-[1px] active:translate-y-[1px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
            >
              <RotateCcw size={14} className="text-orange-600" /> Restablecer
            </button>

            <button
              onClick={handleExportSpecification}
              title="Exportar archivo de especificación técnica B2B"
              className="bg-orange-600 hover:bg-orange-700 text-white font-sans font-black text-xs uppercase tracking-widest px-4 py-2.5 border-2 border-slate-900 flex items-center gap-2 transition-all cursor-pointer shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
            >
              <Download size={14} className="text-white" /> Exportar Especificación
            </button>
          </div>

        </div>
      </header>

      {/* Navigation Tabs modeled on sharp boxy grid tabs */}
      <nav className="bg-slate-900 text-slate-300 border-b border-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex overflow-x-auto py-0 gap-px bg-slate-800 font-sans font-bold text-xs uppercase tracking-wider">
            
            <button
              onClick={() => setActiveTab("architecture")}
              className={`px-5 py-4 flex items-center gap-2 shrink-0 transition-all cursor-pointer border-b-4 ${
                activeTab === "architecture"
                  ? "bg-white text-slate-900 border-b-orange-600"
                  : "border-b-transparent text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Settings size={15} className={activeTab === "architecture" ? "text-orange-600" : ""} /> Especificación Arquitectura
            </button>

            <button
              onClick={() => setActiveTab("kyb")}
              className={`px-5 py-4 flex items-center gap-2 shrink-0 transition-all cursor-pointer border-b-4 ${
                activeTab === "kyb"
                  ? "bg-white text-slate-900 border-b-orange-600"
                  : "border-b-transparent text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Building2 size={15} className={activeTab === "kyb" ? "text-orange-600" : ""} /> 1. Verificación KYB
            </button>

            <button
              onClick={() => setActiveTab("escrow")}
              className={`px-5 py-4 flex items-center gap-2 shrink-0 transition-all cursor-pointer border-b-4 ${
                activeTab === "escrow"
                  ? "bg-white text-slate-900 border-b-orange-600"
                  : "border-b-transparent text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <FileLock2 size={15} className={activeTab === "escrow" ? "text-orange-600" : ""} /> 2. Transacciones Escrow
            </button>

            <button
              onClick={() => setActiveTab("catalog")}
              className={`px-5 py-4 flex items-center gap-2 shrink-0 transition-all cursor-pointer border-b-4 ${
                activeTab === "catalog"
                  ? "bg-white text-slate-900 border-b-orange-600"
                  : "border-b-transparent text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Layers size={15} className={activeTab === "catalog" ? "text-orange-600" : ""} /> 3. Catálogo Industrial
            </button>

            <button
              onClick={() => setActiveTab("disputes")}
              className={`px-5 py-4 flex items-center gap-2 shrink-0 transition-all cursor-pointer border-b-4 ${
                activeTab === "disputes"
                  ? "bg-white text-slate-900 border-b-orange-600"
                  : "border-b-transparent text-slate-300 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Scale size={15} className={activeTab === "disputes" ? "text-orange-600" : ""} /> 4. Reputación y Disputas
            </button>

          </div>
        </div>
      </nav>

      {/* Main Content Stage */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Dynamic Warning if Gemini API Key is missing in workspace (lazy warning) */}
        {!process.env.GEMINI_API_KEY && (
          <div className="mb-6 p-4 bg-orange-50 text-orange-950 rounded-none text-xs leading-normal border-2 border-orange-500 flex gap-3 items-center">
            <Info size={18} className="shrink-0 text-orange-600" />
            <div>
              <strong className="uppercase tracking-wide">AVISO DE SIMULACIÓN ARBITRAL:</strong> Las llamadas de redacción y auditorías por Inteligencia Artificial están listas en el backend (servidor NodeJS). Asegúrate de configurar tu clave <code>GEMINI_API_KEY</code> en la barra lateral de Secrets de AI Studio para activar la inteligencia legal plenamente.
            </div>
          </div>
        )}

        {/* Selected tab view container */}
        <div className="animate-fade-in">
          {activeTab === "architecture" && <ArchitectureOverview />}
          
          {activeTab === "kyb" && (
            <KybModule 
              companies={companies}
              onUpdateCompany={handleUpdateCompany}
              onAddCompany={handleAddCompany}
            />
          )}

          {activeTab === "escrow" && (
            <EscrowModule 
              transactions={transactions}
              catalog={catalog}
              onUpdateTransaction={handleUpdateTransaction}
              onAddTransaction={handleAddTransaction}
            />
          )}

          {activeTab === "catalog" && (
            <CatalogModule 
              catalog={catalog}
              onAddCatalogItem={handleAddCatalogItem}
            />
          )}

          {activeTab === "disputes" && (
            <DisputeModule 
              transactions={transactions}
              onUpdateTransaction={handleUpdateTransaction}
            />
          )}
        </div>

      </main>

      {/* Executive Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t-4 border-slate-950 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-800 pb-6">
            <div className="flex items-center gap-2">
              <span className="text-orange-500 font-black text-sm uppercase tracking-widest">InduTrust B2B Core</span>
              <span className="text-slate-700">|</span>
              <span className="text-xs opacity-65 font-mono">SECURE INDUSTRIAL TRANSACTION ENGINE</span>
            </div>
            <div className="flex gap-4 text-xs font-mono">
              <a href="#privacy" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); alert("Las transferencias de archivos y datos están protegidas bajo regulaciones de estricto secreto corporativo, cumpliendo GDPR."); }}>Políticas de Datos</a>
              <a href="#compliance" className="hover:text-white transition-colors" onClick={(e) => { e.preventDefault(); alert("En cumplimiento de los estándares financieros globales AML/KYC, todos los fondos en Escrow se custodian en bancos regulados de nivel 1."); }}>Estándar de Seguridad Financiera</a>
            </div>
          </div>
          <div className="text-center sm:text-left text-xs opacity-50 space-y-1">
            <p className="font-mono text-[10px]">© 2026 INDUTRUST MARKETPLACE ENGINE. ALL RIGHTS RESERVED.</p>
            <p>Diseñado para auditorías de arquitectura de software, transacciones garantizadas de maquinaria de construcción, minería y componentes industriales pesados.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}

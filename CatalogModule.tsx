import React, { useState } from "react";
import { CatalogItem, TechnicalSpecs } from "../types";
import { Sparkles, FileSpreadsheet, Eye, Tag, AlertOctagon, HelpCircle, CheckCircle, RefreshCw, Layers } from "lucide-react";

interface CatalogModuleProps {
  catalog: CatalogItem[];
  onAddCatalogItem: (item: CatalogItem) => void;
}

export function CatalogModule({ catalog, onAddCatalogItem }: CatalogModuleProps) {
  const [selectedItem, setSelectedItem] = useState<CatalogItem>(catalog[0]);
  const [generatingSpecs, setGeneratingSpecs] = useState(false);
  const [aiSpecsReport, setAiSpecsReport] = useState<string | null>(null);

  // Form states for listing new machinery
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("Maquinaria de Excavación");
  const [price, setPrice] = useState(100000);
  const [condition, setCondition] = useState<"NUEVA" | "RECONSTRUIDA" | "USADA_EXCELENTE" | "USADA_OPERATIVA">("USADA_EXCELENTE");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  
  // Specs form states
  const [enginePower, setEnginePower] = useState(180);
  const [operatingHours, setOperatingHours] = useState(3000);
  const [weightTons, setWeightTons] = useState(15);
  const [year, setYear] = useState(2022);
  const [certificationsText, setCertificationsText] = useState("ISO 9001, CE, EPA Tier 4");
  const [serialNumber, setSerialNumber] = useState("");

  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !brand || !location || !serialNumber) {
      alert("Por favor completa los campos obligatorios del activo industrial.");
      return;
    }

    const certsArray = certificationsText.split(",").map((c) => c.trim()).filter((c) => c.length > 0);

    const newItem: CatalogItem = {
      id: "cat-" + Date.now(),
      name,
      brand,
      category,
      price: Number(price),
      condition,
      location,
      imageUrl: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&q=80&w=600",
      sellerId: "comp-1",
      sellerName: "Aceros del Atlántico S.A. de C.V.",
      sellerRating: 4.8,
      description,
      specs: {
        enginePowerHP: Number(enginePower),
        operatingHours: Number(operatingHours),
        weightTons: Number(weightTons),
        yearOfManufacture: Number(year),
        certifications: certsArray,
        maintenanceLogUrl: `${brand.toUpperCase()}-${serialNumber}-Maint-Log.pdf`,
        serialNumber,
        lastInspectionDate: new Date().toISOString().split("T")[0]
      }
    };

    onAddCatalogItem(newItem);
    setSelectedItem(newItem);
    setAiSpecsReport(null);

    // Reset listing form
    setName("");
    setBrand("");
    setPrice(100000);
    setSerialNumber("");
    setLocation("");
    setDescription("");
  };

  // Generate Specs using Gemini
  const handleGenerateSpecs = async (item: CatalogItem) => {
    setGeneratingSpecs(true);
    try {
      const response = await fetch("/api/gemini/action", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "generateSpecs",
          payload: {
            machineName: item.brand + " " + item.name,
            category: item.category
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setAiSpecsReport(data.result);
      } else {
        alert("Error de análisis de ingeniería: " + data.error);
      }
    } catch (error) {
      console.error(error);
      alert("Error al comunicarse con el motor de ingeniería IA.");
    } finally {
      setGeneratingSpecs(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      
      {/* Panel izquierdo: Lista de catálogo industrial y publicador */}
      <div className="lg:col-span-5 space-y-6">
        
        {/* Catalog List */}
        <div className="bg-white rounded-none border-2 border-slate-900 p-5 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-4">
          <h3 className="font-sans font-black uppercase text-slate-900 text-xs flex items-center gap-2 border-b-2 border-slate-900 pb-3">
            <Layers size={16} className="text-orange-600" />
            Catálogo de Activos Industriales
          </h3>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
            {catalog.map((item) => {
              const isSelected = selectedItem.id === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setSelectedItem(item);
                    setAiSpecsReport(null);
                  }}
                  className={`w-full text-left p-3 rounded-none border-2 transition-all flex items-start gap-3 cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 text-white border-slate-900 shadow-[2px_2px_0px_0px_rgba(234,88,12,1)]"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    referrerPolicy="no-referrer"
                    className="w-14 h-14 object-cover rounded-none shrink-0 border border-slate-300"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-mono font-bold tracking-wider uppercase opacity-75 block">
                      {item.category}
                    </span>
                    <h4 className="font-sans font-black uppercase text-xs truncate leading-tight">{item.name}</h4>
                    <p className="text-[10px] font-mono mt-1 opacity-90">
                      ${item.price.toLocaleString()} USD | {item.condition.replace("_", " ")}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Requirements Box */}
        <div className="bg-slate-900 text-white rounded-none p-5 border-2 border-slate-900 shadow-[3px_3px_0px_0px_rgba(234,88,12,1)] space-y-3">
          <h4 className="text-xs font-sans font-black tracking-widest text-orange-500 uppercase flex items-center gap-1.5">
            <AlertOctagon size={14} /> CAMPOS MANDATORIOS B2B
          </h4>
          <p className="text-slate-400 text-xs leading-normal font-sans">
            En un marketplace corporativo, publicar un activo requiere la validación de campos obligatorios para asegurar legitimidad y mitigar responsabilidades civiles:
          </p>
          <ul className="space-y-2 text-[10px] font-mono uppercase text-slate-300">
            <li><strong>• Número de Serie (VIN):</strong> Comprobación de gravámenes y origen legal.</li>
            <li><strong>• Bitácora de Mantenimiento:</strong> Ficha técnica verificable firmada por perito.</li>
            <li><strong>• Certificaciones de Seguridad:</strong> Homologación ISO, EPA o CE obligatoria.</li>
          </ul>
        </div>

      </div>

      {/* Panel derecho: Ficha de detalle e ingeniería */}
      <div className="lg:col-span-7 bg-white rounded-none border-2 border-slate-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-6">
        
        {/* Detalle del activo */}
        <div className="border-b-2 border-slate-900 pb-5">
          <div className="flex justify-between items-start">
            <div>
              <span className="bg-slate-100 text-slate-800 text-[9px] font-mono font-bold px-2.5 py-1 rounded-none uppercase border border-slate-300">
                {selectedItem.category}
              </span>
              <h2 className="font-sans font-black uppercase text-slate-900 text-xl mt-3 leading-none">
                {selectedItem.brand} {selectedItem.name}
              </h2>
              <p className="text-slate-500 text-xs mt-2 font-sans">
                Ubicación: <strong className="text-slate-700">{selectedItem.location}</strong> | Propietario: <strong className="text-slate-700">{selectedItem.sellerName}</strong>
              </p>
            </div>
            
            <div className="text-right">
              <span className="text-[10px] text-slate-400 font-mono block uppercase">VALOR DE CAPITAL</span>
              <span className="text-2xl font-sans font-black text-slate-900 leading-none block mt-1">
                ${selectedItem.price.toLocaleString()} USD
              </span>
            </div>
          </div>
        </div>

        {/* Ficha de Variables Técnicas */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400 flex items-center gap-1.5">
            <FileSpreadsheet size={14} className="text-orange-600" />
            Especificaciones Mecánicas Certificadas
          </h4>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-50 p-3 rounded-none border-2 border-slate-900">
              <span className="text-slate-400 text-[9px] font-mono uppercase tracking-wider block font-bold">POTENCIA MOTOR</span>
              <span className="text-sm font-sans font-black text-slate-800 mt-1 block">
                {selectedItem.specs.enginePowerHP} HP
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-none border-2 border-slate-900">
              <span className="text-slate-400 text-[9px] font-mono uppercase tracking-wider block font-bold">HORAS OPERATIVAS</span>
              <span className="text-sm font-sans font-black text-slate-800 mt-1 block font-mono">
                {selectedItem.specs.operatingHours.toLocaleString()} Hrs
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-none border-2 border-slate-900">
              <span className="text-slate-400 text-[9px] font-mono uppercase tracking-wider block font-bold">PESO OPERATIVO</span>
              <span className="text-sm font-sans font-black text-slate-800 mt-1 block">
                {selectedItem.specs.weightTons} Tons
              </span>
            </div>

            <div className="bg-slate-50 p-3 rounded-none border-2 border-slate-900">
              <span className="text-slate-400 text-[9px] font-mono uppercase tracking-wider block font-bold">AÑO FABRICACIÓN</span>
              <span className="text-sm font-sans font-black text-slate-800 mt-1 block font-mono">
                {selectedItem.specs.yearOfManufacture}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-none border-2 border-slate-900 space-y-1.5">
              <span className="text-slate-400 text-[9px] font-mono uppercase tracking-wider block font-bold">NÚMERO DE SERIE / VIN</span>
              <span className="text-xs font-mono font-bold text-slate-800 block">
                {selectedItem.specs.serialNumber}
              </span>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Identificador físico de fábrica.</span>
            </div>

            <div className="bg-slate-50 p-4 rounded-none border-2 border-slate-900 space-y-1.5">
              <span className="text-slate-400 text-[9px] font-mono uppercase tracking-wider block font-bold">CERTIFICACIONES</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {selectedItem.specs.certifications.map((c, idx) => (
                  <span key={idx} className="bg-slate-200 text-slate-850 text-[9px] font-mono font-bold px-2 py-0.5 rounded-none border border-slate-400 uppercase">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-100 text-slate-950 rounded-none border-2 border-slate-900 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 bg-orange-600 shrink-0" />
              <span className="text-xs font-sans">Documentación técnica obligatoria: <strong>{selectedItem.specs.maintenanceLogUrl}</strong></span>
            </div>
            <button
              onClick={() => alert(`Simulación: Descargando archivo técnico ${selectedItem.specs.maintenanceLogUrl} firmado con firma SHA-256.`)}
              className="bg-slate-900 hover:bg-slate-850 text-white text-[9px] font-mono uppercase font-bold px-2.5 py-1.5 rounded-none transition-all cursor-pointer shrink-0 border border-slate-900 shadow-[1px_1px_0px_0px_rgba(255,255,255,1)]"
            >
              Ver PDF
            </button>
          </div>
        </div>

        {/* Generar análisis de ingeniería / specs con IA */}
        <div className="border-t-2 border-slate-900 pt-5 space-y-4">
          <div className="flex justify-between items-center">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-400">
              Validación Técnica e Ingeniería por IA
            </h4>
            <button
              onClick={() => handleGenerateSpecs(selectedItem)}
              disabled={generatingSpecs}
              className="bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-[10px] uppercase tracking-wider px-3.5 py-2 rounded-none flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 border border-slate-900 shadow-[1px_1px_0px_0px_rgba(15,23,42,1)]"
            >
              {generatingSpecs ? (
                <RefreshCw size={12} className="animate-spin" />
              ) : (
                <Sparkles size={12} />
              )}
              Generar Ficha de Ingeniería con IA
            </button>
          </div>

          {aiSpecsReport ? (
            <div className="bg-slate-900 text-slate-100 rounded-none p-5 border-2 border-slate-900 font-mono text-[11px] max-h-[300px] overflow-y-auto leading-relaxed">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2 mb-3">
                <span className="text-orange-400 font-bold uppercase text-[9px] tracking-wider">
                  ANÁLISIS DE FIABILIDAD TÉCNICA E HIGIENE INDUSTRIAL (CRAWLER IA)
                </span>
                <span className="text-[9px] text-slate-500">STANDARDS ISO/EPA</span>
              </div>
              <div className="whitespace-pre-wrap text-slate-300 prose prose-invert max-w-none">
                {aiSpecsReport}
              </div>
            </div>
          ) : (
            <div className="border border-dashed border-slate-300 rounded-none p-4 text-center text-xs text-slate-400 font-sans">
              ¿Quieres expandir los datos de este equipo con normas de emisiones, cubicaciones y requerimientos de seguridad? Usa el motor de ingeniería.
            </div>
          )}
        </div>

        {/* Publicar un nuevo activo */}
        <div className="border-t-2 border-slate-900 pt-5">
          <details className="group border-2 border-slate-900 rounded-none bg-slate-50 overflow-hidden">
            <summary className="bg-slate-100 group-open:bg-slate-200 p-3 text-[10px] font-mono font-bold text-slate-700 cursor-pointer select-none flex justify-between items-center uppercase tracking-wider">
              <span>🗎 PUBLICAR NUEVO ACTIVO INDUSTRIAL (FORMULARIO B2B)</span>
              <span className="transition-transform group-open:rotate-180">▼</span>
            </summary>
            
            <form onSubmit={handleCreateListing} className="p-4 space-y-4 bg-white border-t-2 border-slate-900">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2">
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Nombre Maquinaria *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej. Excavadora de Orugas CAT 320D"
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none focus:border-slate-950 font-sans"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Marca / Fabricante *</label>
                  <input
                    type="text"
                    required
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Ej. Caterpillar"
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none focus:border-slate-950 font-sans"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Categoría</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none"
                  >
                    <option value="Maquinaria de Excavación">Maquinaria de Excavación</option>
                    <option value="Equipos de Elevación">Equipos de Elevación</option>
                    <option value="Energía y Generación">Energía y Generación</option>
                    <option value="Logística e Industrial">Logística e Industrial</option>
                  </select>
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Precio (USD) *</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Ubicación Física *</label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Ej. Querétaro, México"
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">HP Motor</label>
                  <input
                    type="number"
                    value={enginePower}
                    onChange={(e) => setEnginePower(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Horas Operativas</label>
                  <input
                    type="number"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Peso (Tons)</label>
                  <input
                    type="number"
                    value={weightTons}
                    onChange={(e) => setWeightTons(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Año Fab.</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(Number(e.target.value))}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Número de Serie (VIN) *</label>
                  <input
                    type="text"
                    required
                    value={serialNumber}
                    onChange={(e) => setSerialNumber(e.target.value)}
                    placeholder="Ej. CAT0320DREG2022"
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none focus:border-slate-950 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Estado de Maquinaria</label>
                  <select
                    value={condition}
                    onChange={(e: any) => setCondition(e.target.value)}
                    className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none"
                  >
                    <option value="NUEVA">NUEVA</option>
                    <option value="RECONSTRUIDA">RECONSTRUIDA (Overhauled)</option>
                    <option value="USADA_EXCELENTE">USADA EXCELENTE</option>
                    <option value="USADA_OPERATIVA">USADA OPERATIVA</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Certificaciones (Sep. coma)</label>
                <input
                  type="text"
                  value={certificationsText}
                  onChange={(e) => setCertificationsText(e.target.value)}
                  className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[9px] font-mono font-bold text-slate-700 block mb-1 uppercase tracking-wider">Descripción del Activo</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe detalladamente el origen, uso, estado del sistema hidráulico y cualquier detalle técnico para garantizar transparencia corporativa..."
                  rows={3}
                  className="w-full bg-slate-50 text-slate-800 text-xs border border-slate-300 rounded-none p-2.5 focus:outline-none focus:border-slate-950"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                <button
                  type="submit"
                  className="bg-orange-600 hover:bg-orange-700 text-white font-sans font-black text-xs uppercase tracking-widest px-5 py-3 rounded-none transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] cursor-pointer"
                >
                  Agregar a Catálogo Seguro
                </button>
              </div>
            </form>
          </details>
        </div>

      </div>
    </div>
  );
}

import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Initialize Gemini client on the server with recommended headers
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Helper for calling Gemini
async function callGemini(systemInstruction: string, prompt: string) {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error("La clave GEMINI_API_KEY no está configurada en las variables de entorno.");
  }
  const response = await ai.models.generateContent({
    model: "gemini-3.5-flash",
    contents: prompt,
    config: {
      systemInstruction,
      temperature: 0.2,
    },
  });
  return response.text;
}

// B2B Marketplace compliance helper endpoints
app.post("/api/gemini/action", async (req, res) => {
  const { action, payload } = req.body;

  try {
    if (!action) {
      return res.status(400).json({ error: "Falta el parámetro 'action'." });
    }

    if (action === "auditKyb") {
      const { businessName, taxId, constitutionDate, complianceCountry, documentType, docContent } = payload;
      const systemInstruction = "Eres un Oficial de Cumplimiento Legal (Compliance Officer) y Experto en KYB (Know Your Business) para mercados industriales globales de la Unión Europea y América Latina. Analiza la viabilidad de la empresa, verifica su estructura fiscal y emite un informe estructurado de riesgo legal/KYB.";
      const prompt = `Analiza y audita la siguiente empresa para onboarding en un marketplace B2B:
Empresa: ${businessName}
Identificador Fiscal (Tax ID/RFC/CIF): ${taxId}
Fecha de Constitución: ${constitutionDate}
País de Operación: ${complianceCountry}
Tipo de Documento Presentado: ${documentType}
Contenido/Extracto del Documento: ${docContent || "Extracto de Escritura Constitutiva y Certificado de Situación Fiscal de alta fidelidad."}

Por favor, genera un análisis técnico formal en formato Markdown con las siguientes secciones obligatorias:
1. **Puntaje de Riesgo Global** (Especifica un porcentaje del 0 al 100% indicando nivel de riesgo Bajo, Medio o Alto y justifica).
2. **Validación Legal e Identidad Corporativa** (Comentarios sobre la consistencia de los datos presentados).
3. **Cumplimiento Anti-Lavado (AML) y Prevención de Fraude** (Verificación contra listas restrictivas simuladas e implicaciones).
4. **Recomendaciones de Aprobación** (Pasos específicos para el Administrador del Marketplace, si se debe aprobar, pedir más documentación, o rechazar).
5. **Cláusula de Cumplimiento Legal** (Referencia a cumplimiento normativo internacional como GDPR para manejo de datos de representantes legales, Directiva UE 2015/849 contra el blanqueo de capitales, etc.).`;

      const result = await callGemini(systemInstruction, prompt);
      return res.json({ success: true, result });
    }

    if (action === "generateContract") {
      const { buyer, seller, machineName, price, escrowConditions, deliveryTerm } = payload;
      const systemInstruction = "Eres un Abogado Corporativo Internacional especializado en contratos de compraventa comercial B2B de activos de capital y maquinaria pesada, con amplio conocimiento de leyes de comercio internacional (Incoterms 2020, Convenio de Viena sobre Compraventa de Mercancías).";
      const prompt = `Genera un borrador de Contrato de Compraventa con Depósito en Custodia (Escrow Contract) con alta validez legal:
- Comprador (Empresa): ${buyer}
- Vendedor (Empresa): ${seller}
- Equipo/Maquinaria: ${machineName}
- Precio de Transacción: ${price} USD
- Término de Entrega (Incoterm): ${deliveryTerm || "FCA (Free Carrier)"}
- Condiciones de Escrow / Liberación de Fondos: ${escrowConditions || "Sujeto a inspección técnica de 5 días hábiles tras recepción en destino por un inspector certificado."}

Genera un contrato formal en Markdown que incluya:
- Declaraciones de ambas partes (existencia legal, personería jurídica).
- Cláusula Primera: Objeto del contrato (descripción del equipo).
- Cláusula Segunda: Precio y mecanismo de pago seguro (Escrow) detallando el rol del marketplace como agente de custodia neutro.
- Cláusula Tercera: Plazos de entrega, inspección técnica y derecho de devolución.
- Cláusula Cuarta: Resolución de disputas, jurisdicción y ley aplicable.
- Espacio formal para firmas digitales/hash de blockchain.`;

      const result = await callGemini(systemInstruction, prompt);
      return res.json({ success: true, result });
    }

    if (action === "generateSpecs") {
      const { machineName, category } = payload;
      const systemInstruction = "Eres un Ingeniero Industrial Senior y Experto en Maquinaria Pesada de Construcción, Minería e Industria Agrícola. Tu objetivo es estandarizar y estructurar fichas técnicas precisas.";
      const prompt = `Genera una ficha técnica de nivel industrial detallada para el siguiente equipo:
Nombre del Equipo: ${machineName}
Categoría: ${category}

Por favor, genera un informe estructurado en Markdown que contenga los campos críticos requeridos para el catálogo industrial:
1. **Especificaciones Mecánicas y de Potencia** (Motor, Caballos de fuerza HP, Torque, Capacidad de carga, etc. adecuados al modelo real).
2. **Dimensiones y Pesos Operativos** (Ancho, alto, largo, peso neto).
3. **Certificaciones Industriales Requeridas** (ISO 9001, Marcado CE, normas de emisiones EPA, seguridad de cabina ROPS/FOPS).
4. **Estado de Mantenimiento y Desgaste Crítico** (Horas de uso sugeridas, estado del motor, sistemas hidráulicos, transmisión, tren de rodaje/llantas).
5. **Historial de Revisiones** (Frecuencia sugerida de mantenimiento preventivo).`;

      const result = await callGemini(systemInstruction, prompt);
      return res.json({ success: true, result });
    }

    if (action === "resolveDispute") {
      const { machineName, buyerClaim, sellerCounterClaim, transactionAmount } = payload;
      const systemInstruction = "Eres un Mediador Legal Profesional de Arbitraje Comercial de Maquinaria Pesada. Tu deber es actuar con absoluta neutralidad, analizando la evidencia técnica y sugiriendo una resolución justa basada en el derecho mercantil internacional.";
      const prompt = `Evalúa una disputa comercial industrial:
- Equipo: ${machineName}
- Monto en Custodia (Escrow): ${transactionAmount} USD
- Reclamación del Comprador: "${buyerClaim}"
- Descargo/Respuesta del Vendedor: "${sellerCounterClaim}"

Por favor, elabora un Dictamen de Arbitraje Neutro en Markdown con las siguientes secciones:
1. **Análisis de Hechos y Evidencia** (Contraste entre descripción inicial de catálogo vs. estado recibido según quejas).
2. **Propuesta de Resolución Justa** (Por ejemplo: devolución completa con costos de flete al vendedor, descuento/reembolso parcial del escrow liberando el resto, o reparación costeada por depósito en escrow).
3. **Plazos de Ejecución** (Período de gracia de 5-10 días hábiles para cumplir el acuerdo).
4. **Cláusula de Confidencialidad y Efecto Vinculante** (Indicando el compromiso de no divulgación comercial de acuerdo a la reputación empresarial).`;

      const result = await callGemini(systemInstruction, prompt);
      return res.json({ success: true, result });
    }

    return res.status(400).json({ error: `La acción '${action}' no es soportada.` });
  } catch (error: any) {
    console.error("Error en /api/gemini/action:", error);
    return res.status(500).json({
      error: "Ocurrió un error al procesar la solicitud con la inteligencia artificial.",
      details: error.message,
    });
  }
});

// Configure Vite middleware or static files depending on the environment
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

initServer();

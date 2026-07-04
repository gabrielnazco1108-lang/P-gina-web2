import { Shield, Server, FileText, Database, GitMerge, Lock, Layers } from "lucide-react";

export function ArchitectureOverview() {
  return (
    <div className="space-y-8">
      {/* Introduction Card */}
      <div className="bg-slate-900 text-white rounded-none p-8 border-2 border-slate-950 shadow-[4px_4px_0px_0px_rgba(15,23,42,0.15)] relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Layers size={180} className="text-orange-500" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 bg-orange-500/10 text-orange-400 text-xs px-3 py-1.5 rounded-none border border-orange-500/20 font-mono mb-4">
            <Shield size={12} /> ARQUITECTURA DE ALTA CONFIANZA INDUTRUST B2B
          </div>
          <h2 className="text-3xl font-sans font-black tracking-tight mb-2 text-white uppercase">
            Especificación del Sistema y Marco Regulatorio
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Diseño arquitectónico para la compraventa de maquinaria industrial de alto valor. 
            Este modelo prioriza la inmutabilidad de los datos corporativos, la segregación de fondos mediante cuentas de custodia neutra (Escrow) y la automatización inteligente del cumplimiento fiscal y legal (KYB) bajo normativas globales de ciberseguridad.
          </p>
        </div>
      </div>

      {/* Interactive Visual Blueprint diagram */}
      <div className="bg-white rounded-none border-2 border-slate-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)]">
        <h3 className="text-base font-sans font-black uppercase text-slate-900 mb-6 flex items-center gap-2 border-b-2 border-slate-900 pb-3">
          <Server size={18} className="text-orange-600" />
          Topología del Ecosistema B2B (Capas del Sistema)
        </h3>
        
        {/* Visual blocks */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 relative">
          
          {/* Capa de Presentación */}
          <div className="bg-slate-50 border border-slate-300 rounded-none p-5 flex flex-col justify-between hover:border-slate-900 transition-colors">
            <div>
              <div className="w-10 h-10 bg-slate-900 text-orange-500 rounded-none border border-slate-900 flex items-center justify-center mb-4 font-bold">
                01
              </div>
              <h4 className="font-sans font-bold uppercase text-slate-900 text-sm">Capa de Acceso y Clientes</h4>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Portales Web PWA optimizados para compra corporativa, cotizaciones directas y ERP integrations para grandes compradores.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 font-mono text-[10px] text-slate-500">
              React 19 / TLS 1.3 / mTLS ERP
            </div>
          </div>

          {/* Capa de Servicios / API Gateway */}
          <div className="bg-slate-50 border border-slate-300 rounded-none p-5 flex flex-col justify-between hover:border-slate-900 transition-colors relative">
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block text-slate-400 font-bold">➔</div>
            <div>
              <div className="w-10 h-10 bg-slate-900 text-orange-500 rounded-none border border-slate-900 flex items-center justify-center mb-4 font-bold">
                02
              </div>
              <h4 className="font-sans font-bold uppercase text-slate-900 text-sm">API Gateway & Microservicios</h4>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Módulos desacoplados: Onboarding KYB, Motores de Transacción Escrow, indexador de Catálogo Técnico e IA Arbitral.
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 font-mono text-[10px] text-slate-500">
              NodeJS / REST API / OAuth 2.0
            </div>
          </div>

          {/* Capa de Integración Financiera y Legal */}
          <div className="bg-slate-50 border border-slate-300 rounded-none p-5 flex flex-col justify-between hover:border-slate-900 transition-colors relative">
            <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden lg:block text-slate-400 font-bold">➔</div>
            <div>
              <div className="w-10 h-10 bg-slate-900 text-orange-500 rounded-none border border-slate-900 flex items-center justify-center mb-4 font-bold">
                03
              </div>
              <h4 className="font-sans font-bold uppercase text-slate-900 text-sm">Integraciones Certificadas</h4>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Pasarelas Escrow bancarias autorizadas (Fintech API/Swift), API fiscal gubernamental y peritos técnicos (SGS/TÜV SÜD).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 font-mono text-[10px] text-slate-500">
              Webhooks Seguros / Firmas Hash
            </div>
          </div>

          {/* Capa de Datos e Historial Inmutable */}
          <div className="bg-slate-50 border border-slate-300 rounded-none p-5 flex flex-col justify-between hover:border-slate-900 transition-colors">
            <div>
              <div className="w-10 h-10 bg-slate-900 text-orange-500 rounded-none border border-slate-900 flex items-center justify-center mb-4 font-bold">
                04
              </div>
              <h4 className="font-sans font-bold uppercase text-slate-900 text-sm">Datos e Inmutabilidad</h4>
              <p className="text-slate-600 text-xs mt-1 leading-relaxed">
                Bases de datos relacionales encriptadas para catálogo, almacenamiento aislado de documentos fiscales y log de auditoría (Blockchain hash).
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-slate-200 font-mono text-[10px] text-slate-500">
              AES-256 / IPFS / DB PostgreSQL
            </div>
          </div>

        </div>
      </div>

      {/* Security and Compliance Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Compliance Card */}
        <div className="bg-white rounded-none border-2 border-slate-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <h3 className="text-base font-sans font-black uppercase text-slate-900 flex items-center gap-2 border-b-2 border-slate-900 pb-3">
            <Shield size={20} className="text-orange-600" />
            Cumplimiento GDPR & Leyes de Ciberseguridad B2B
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Las transacciones de maquinaria de alto valor exigen el cumplimiento de estrictos marcos globales de seguridad informática para proteger los datos de las corporaciones y sus representantes.
          </p>

          <ul className="space-y-4">
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-none bg-slate-900 text-white font-mono text-xs flex items-center justify-center shrink-0 font-bold">1</div>
              <div>
                <strong className="text-slate-900 text-xs uppercase tracking-wider block">Minimización de Datos (Art. 5 GDPR)</strong>
                <span className="text-slate-500 text-xs block mt-0.5 leading-normal">
                  Solo se recopila la información estrictamente necesaria para validar la identidad jurídica de la empresa. Los datos de representantes físicos están disociados de los metadatos de transacciones.
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-none bg-slate-900 text-white font-mono text-xs flex items-center justify-center shrink-0 font-bold">2</div>
              <div>
                <strong className="text-slate-900 text-xs uppercase tracking-wider block">Cifrado de Extremo a Extremo en Reposo</strong>
                <span className="text-slate-500 text-xs block mt-0.5 leading-normal">
                  Todos los documentos fiscales de KYB (actas constitutivas, cédulas fiscales) se guardan en contenedores aislados cifrados con AES-256, con llaves de rotación mensual.
                </span>
              </div>
            </li>
            <li className="flex gap-3">
              <div className="w-6 h-6 rounded-none bg-slate-900 text-white font-mono text-xs flex items-center justify-center shrink-0 font-bold">3</div>
              <div>
                <strong className="text-slate-900 text-xs uppercase tracking-wider block">Logs de Auditoría Inmutables</strong>
                <span className="text-slate-500 text-xs block mt-0.5 leading-normal">
                  Cualquier consulta o cambio de estado de transacciones genera un hash criptográfico inalterable que se registra en base de datos para impedir fraude interno o colusión.
                </span>
              </div>
            </li>
          </ul>
        </div>

        {/* Technical requirements checklist */}
        <div className="bg-white rounded-none border-2 border-slate-900 p-6 shadow-[3px_3px_0px_0px_rgba(15,23,42,1)] space-y-6">
          <h3 className="text-base font-sans font-black uppercase text-slate-900 flex items-center gap-2 border-b-2 border-slate-900 pb-3">
            <FileText size={20} className="text-orange-600" />
            Requerimientos No Funcionales Críticos
          </h3>
          <p className="text-slate-600 text-xs leading-relaxed">
            Parámetros de diseño del sistema para garantizar escalabilidad, rendimiento en transferencias de alta denominación y resiliencia jurídica.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-none border border-slate-300">
              <h4 className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Disponibilidad (SLA)</h4>
              <p className="text-slate-900 text-xs font-mono font-bold mt-1">99.95% de uptime anual</p>
              <span className="text-slate-500 text-[10px] block mt-1">Arquitectura multizona en nube escalable.</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-none border border-slate-300">
              <h4 className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Latencia de Red</h4>
              <p className="text-slate-900 text-xs font-mono font-bold mt-1">{"< 150ms en consultas"}</p>
              <span className="text-slate-500 text-[10px] block mt-1">Indexación técnica y CDN de fichas en PDF.</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-none border border-slate-300">
              <h4 className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Auditoría Financiera</h4>
              <p className="text-slate-900 text-xs font-mono font-bold mt-1">Doble Entrada Contable</p>
              <span className="text-slate-500 text-[10px] block mt-1">Trazabilidad de cada centavo en el escrow.</span>
            </div>

            <div className="p-4 bg-slate-50 rounded-none border border-slate-300">
              <h4 className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-wider">Integridad de Archivos</h4>
              <p className="text-slate-900 text-xs font-mono font-bold mt-1">Firma Digital SHA-256</p>
              <span className="text-slate-500 text-[10px] block mt-1">Previene alteración de planos y especificaciones.</span>
            </div>
          </div>

          <div className="p-4 bg-orange-50 text-orange-950 rounded-none text-xs leading-relaxed border border-orange-200">
            <strong>Nota del Arquitecto:</strong> El sistema de Escrow B2B opera de manera asíncrona mediante eventos (Webhooks). Una vez que la pasarela de pagos reporta la dispersión o retención de los fondos, el servicio transaccional actualiza el estado mutando el candado digital de la maquinaria.
          </div>
        </div>

      </div>
    </div>
  );
}

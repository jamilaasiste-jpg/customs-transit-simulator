import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  Check, 
  HelpCircle, 
  SlidersHorizontal, 
  Sparkles, 
  Building, 
  ShieldCheck, 
  ChevronRight,
  Info,
  Scale
} from 'lucide-react';
import { AdilTariffEntry, InterfaceLanguage, CustomsMission } from '../types';
import { ADIL_TARIFF_DATABASE, RGI_RULES_GUIDE } from '../data/adilTariffData';
import { translations } from '../i18n/translations';

interface AdilClassifierProps {
  mission: CustomsMission;
  uiLang: InterfaceLanguage;
  onSelectHsForProduct: (productId: string, hsCode: string, justification: string) => void;
}

export const AdilClassifier: React.FC<AdilClassifierProps> = ({
  mission,
  uiLang,
  onSelectHsForProduct,
}) => {
  const t = translations[uiLang];
  const isRTL = uiLang === 'ar';

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedEntry, setSelectedEntry] = useState<AdilTariffEntry | null>(ADIL_TARIFF_DATABASE[0]);
  const [selectedProductToAssign, setSelectedProductToAssign] = useState<string>(mission.items[0]?.id || '');
  const [selectedRgiRule, setSelectedRgiRule] = useState<string>('RGI 1');
  const [customJustification, setCustomJustification] = useState<string>('Classification fondée sur le texte de la position 8708 et RGI 1.');

  const filteredTariff = ADIL_TARIFF_DATABASE.filter((entry) => {
    const q = searchQuery.toLowerCase();
    return (
      entry.hsCode10.toLowerCase().includes(q) ||
      entry.hsCode6.toLowerCase().includes(q) ||
      entry.descriptionEs.toLowerCase().includes(q) ||
      entry.descriptionFr.toLowerCase().includes(q) ||
      entry.descriptionAr.toLowerCase().includes(q) ||
      entry.descriptionEn.toLowerCase().includes(q)
    );
  });

  const getDescription = (entry: AdilTariffEntry) => {
    if (uiLang === 'fr') return entry.descriptionFr;
    if (uiLang === 'ar') return entry.descriptionAr;
    if (uiLang === 'en') return entry.descriptionEn;
    return entry.descriptionEs;
  };

  const handleApplyToDeclaration = () => {
    if (!selectedEntry || !selectedProductToAssign) return;
    const fullJustification = `[${selectedRgiRule}] ${customJustification || selectedEntry.rgiNotes}`;
    onSelectHsForProduct(selectedProductToAssign, selectedEntry.hsCode10, fullJustification);
  };

  return (
    <div className="space-y-6" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Search Header */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <Search className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100">{t.searchAdilTariff}</h2>
              <p className="text-xs text-slate-400">
                Nomenclatura arancelaria oficial de la ADII (Administration des Douanes et Impôts Indirects du Maroc).
              </p>
            </div>
          </div>
          <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-cyan-400 border border-slate-700">
            ADIL 2026.1
          </span>
        </div>

        {/* Input Search Box */}
        <div className="relative">
          <Search className={`absolute top-3.5 ${isRTL ? 'right-4' : 'left-4'} w-5 h-5 text-slate-500`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.adilSearchPlaceholder}
            className={`w-full bg-slate-950 border border-slate-800 rounded-xl py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition shadow-inner font-sans ${
              isRTL ? 'pr-12 pl-4' : 'pl-12 pr-4'
            }`}
          />
        </div>
      </div>

      {/* Main Grid: Tariff Candidate List + Detailed Inspector & Technical Justification */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        
        {/* Left: Candidates List */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-3">
          <h3 className="font-bold text-sm text-slate-200 pb-2 border-b border-slate-800">
            Partidas y Subpartidas Candidatas ({filteredTariff.length})
          </h3>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {filteredTariff.map((entry) => {
              const isSelected = selectedEntry?.hsCode10 === entry.hsCode10;
              return (
                <div
                  key={entry.hsCode10}
                  onClick={() => setSelectedEntry(entry)}
                  className={`p-3.5 rounded-xl border transition cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/80 shadow-md shadow-cyan-950/30'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="font-mono font-bold text-sm text-cyan-400">
                      {entry.hsCode10}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        DDI: {entry.ddiPercent}%
                      </span>
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                        TVA: {entry.tvaPercent}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed font-sans">
                    {getDescription(entry)}
                  </p>

                  <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Chap: {entry.chapter} | Pos: {entry.heading}</span>
                    <div className="flex gap-1">
                      {entry.agenciesRequired.map((ag) => (
                        <span key={ag} className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-semibold text-[10px]">
                          {ag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: Technical Justification & Assignment Engine */}
        <div className="lg:col-span-6 bg-slate-900 rounded-2xl border border-slate-800 p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-sm text-slate-200">
              Ficha Técnica Arancelaria & Reglas RGI
            </h3>
            {selectedEntry && (
              <span className="font-mono text-xs font-bold text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/30">
                {selectedEntry.hsCode10}
              </span>
            )}
          </div>

          {selectedEntry ? (
            <div className="space-y-4 text-xs">
              {/* Description Block */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Designación Oficial ADIL:</span>
                <p className="text-slate-200 text-sm leading-relaxed font-medium">
                  {getDescription(selectedEntry)}
                </p>
              </div>

              {/* Fiscal Breakdown */}
              <div className="grid grid-cols-3 gap-3 font-mono text-center">
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">DDI (Import Duty)</span>
                  <span className="text-base font-bold text-cyan-400">{selectedEntry.ddiPercent}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">TVA (VAT)</span>
                  <span className="text-base font-bold text-slate-200">{selectedEntry.tvaPercent}%</span>
                </div>
                <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-400 font-sans block">Taxe Parafiscale</span>
                  <span className="text-base font-bold text-amber-400">{selectedEntry.tpPercent}%</span>
                </div>
              </div>

              {/* RGI Rules Selection */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                  Regla General de Interpretación (RGI Aplicable):
                </label>
                <select
                  value={selectedRgiRule}
                  onChange={(e) => setSelectedRgiRule(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  {RGI_RULES_GUIDE.map((r) => (
                    <option key={r.rule} value={r.rule}>
                      {r.rule} - {r.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Technical Justification Note */}
              <div>
                <label className="text-[11px] font-bold text-slate-400 uppercase block mb-1.5">
                  Justificación Técnica para la Declaración DUM:
                </label>
                <textarea
                  rows={3}
                  value={customJustification}
                  onChange={(e) => setCustomJustification(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-xs text-slate-200 font-mono focus:outline-none focus:border-cyan-500"
                  placeholder="Justifique la clasificación con notas de capítulo..."
                />
              </div>

              {/* Assignment Controls */}
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-400">Asignar a producto del expediente:</span>
                  <select
                    value={selectedProductToAssign}
                    onChange={(e) => setSelectedProductToAssign(e.target.value)}
                    className="bg-slate-900 border border-slate-700 rounded-lg p-1.5 text-xs text-slate-200"
                  >
                    {mission.items.map((it) => (
                      <option key={it.id} value={it.id}>
                        {it.description.substring(0, 30)}...
                      </option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleApplyToDeclaration}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition shadow-md shadow-cyan-500/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  <span>{t.selectHsCode}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center p-8 text-slate-500 text-xs">
              Seleccione una partida arancelaria de la lista.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

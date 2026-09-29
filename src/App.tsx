// Cambia esto:
import { PRESET_CUSTOMS_MISSIONS } from "./data/presetMissions";
import { translations } from "./i18n/translations";
import { Header } from "./components/Header";

// Por esto (añadiendo ./src/):
import { PRESET_CUSTOMS_MISSIONS } from "./src/data/presetMissions";
import { translations } from "./src/i18n/translations";
import { Header } from "./src/components/Header";
export default function App() {
  // ...
}

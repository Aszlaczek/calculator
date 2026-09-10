# Calculator

*[English](#english) | [Polski](#polski)*

🔗 **Live demo:** [calculator-five-vert-80.vercel.app](https://calculator-five-vert-80.vercel.app)

---

<a id="english"></a>
## English

A web calculator with a classic and a scientific mode, a custom math expression parser, interactive function-graph plotting, and four visual themes.

### About the project

This is not an `eval()`-based calculator. Input expressions are tokenized and parsed into an AST (Abstract Syntax Tree), then evaluated by a custom engine — which means the same math expressions can be both calculated and **plotted as function graphs** on an HTML5 Canvas, with full support for zooming and panning the view.

### Features

- 🧮 **Two calculation modes** — classic (basic operations) and scientific.
- 📈 **Function graph plotting** on Canvas — a correctly entered formula (e.g. `sin(x)`) is rendered as an interactive graph with a grid and axes, with **zoom (scroll) and pan (mouse drag)** support.
- ⌨️ **Full keyboard support** — not just button clicks.
- ♿ **Screen-reader-friendly controls** — every button and toggle (operators, functions, mode switches, mute) has a descriptive `aria-label`, and stateful toggles expose `aria-pressed`.
- 🕘 **Calculation history** (no M+/M-/MR memory functions).
- ⚠️ **Clear error handling** — invalid operations (e.g. division by zero) display `NaN` instead of crashing the app.
- 🎨 **4 visual themes** to choose from: Cyberpunk Neon, Glass Dream, Retro CRT, Aurora Light — the theme changes not just the UI colors but also the graph palette and particle effects.
- ✨ **Animated particle effects** on interactions, color-matched to the selected theme.
- 🔊 **Typing sounds**, with an option to mute the whole calculator.

### Tech stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite |
| Styling | Bootstrap 5 |
| Visualizations | HTML5 Canvas API (custom graph and particle rendering) |
| Expression parsing | Custom tokenizer + AST parser (no `eval()`) |

### Running locally

```bash
git clone https://github.com/Aszlaczek/calculator.git
cd calculator
npm install
npm run dev
```

Available scripts:

```bash
npm run dev       # development mode
npm run build     # production build (tsc + vite build)
npm run lint      # lint the code with ESLint
npm run preview   # preview the production build
```

### Project structure

```
src/
├── components/
│   ├── Buttons.tsx        # calculator button grid + keyboard input mapping + aria-labels
│   ├── HistoryDrawer.tsx  # calculation history panel
│   └── Visualizer.tsx     # graph and particle rendering on Canvas
├── utils/
│   ├── mathParser.ts      # tokenizer, AST parser, expression evaluator
│   └── audioSynth.ts      # typing sound generation
└── App.tsx
```

### License

MIT — see [LICENSE](./LICENSE).

### Author

Adrian Wzorek

---

<a id="polski"></a>
## Polski

Kalkulator webowy z trybem klasycznym i naukowym, własnym parserem wyrażeń matematycznych, interaktywnym rysowaniem wykresów funkcji oraz czterema motywami wizualnymi.

### O projekcie

To nie jest kalkulator oparty o `eval()`. Wprowadzane wyrażenia są tokenizowane i parsowane do drzewa AST (Abstract Syntax Tree), a następnie ewaluowane własnym silnikiem — dzięki czemu te same wyrażenia matematyczne mogą być zarówno obliczane, jak i **rysowane jako wykres funkcji** na płótnie HTML5 Canvas, z pełną obsługą przybliżania i przesuwania widoku.

### Funkcjonalności

- 🧮 **Dwa tryby obliczeń** — klasyczny (podstawowe działania) i naukowy.
- 📈 **Rysowanie wykresów funkcji** na Canvas — poprawnie wpisany wzór (np. `sin(x)`) jest renderowany jako interaktywny wykres z siatką i osiami, z możliwością **przybliżania (scroll) i przesuwania widoku (przeciąganie myszą)**.
- ⌨️ **Pełna obsługa klawiatury** — nie tylko klikanie przycisków.
- ♿ **Elementy przyjazne czytnikom ekranu** — każdy przycisk i przełącznik (operatory, funkcje, zmiana trybu, wyciszenie) ma opisowy `aria-label`, a przełączniki stanowe eksponują `aria-pressed`.
- 🕘 **Historia obliczeń** (bez funkcji pamięci typu M+/M-/MR).
- ⚠️ **Czytelna obsługa błędów** — nieprawidłowe operacje (np. dzielenie przez zero) wyświetlają `NaN` zamiast wywalać aplikację.
- 🎨 **4 motywy wizualne** do wyboru: Cyberpunk Neon, Glass Dream, Retro CRT, Aurora Light — motyw zmienia nie tylko kolory UI, ale też paletę wykresu i efektów cząsteczkowych.
- ✨ **Animowane efekty cząsteczkowe** przy interakcjach, dopasowane kolorystycznie do wybranego motywu.
- 🔊 **Dźwięki przy pisaniu** z możliwością wyciszenia całego kalkulatora.

### Stack technologiczny

| Warstwa | Technologia |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite |
| Stylowanie | Bootstrap 5 |
| Wizualizacje | HTML5 Canvas API (własna implementacja rysowania wykresów i cząsteczek) |
| Parsowanie wyrażeń | Własny tokenizer + parser AST (bez `eval()`) |

### Uruchomienie lokalne

```bash
git clone https://github.com/Aszlaczek/calculator.git
cd calculator
npm install
npm run dev
```

Dostępne skrypty:

```bash
npm run dev       # tryb deweloperski
npm run build     # build produkcyjny (tsc + vite build)
npm run lint      # sprawdzenie kodu ESLintem
npm run preview   # podgląd builda produkcyjnego
```

### Struktura projektu

```
src/
├── components/
│   ├── Buttons.tsx        # siatka przycisków kalkulatora + mapowanie klawiatury + aria-labels
│   ├── HistoryDrawer.tsx  # panel historii obliczeń
│   └── Visualizer.tsx     # rysowanie wykresów i cząsteczek na Canvas
├── utils/
│   ├── mathParser.ts      # tokenizer, parser AST, ewaluator wyrażeń
│   └── audioSynth.ts      # generowanie dźwięków przy pisaniu
└── App.tsx
```

### Licencja

MIT — zobacz [LICENSE](./LICENSE).

### Autor

Adrian Wzorek

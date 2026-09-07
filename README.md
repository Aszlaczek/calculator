# Calculator

Kalkulator webowy z trybem klasycznym i naukowym, własnym parserem wyrażeń matematycznych, interaktywnym rysowaniem wykresów funkcji oraz czterema motywami wizualnymi.

🔗 **Live demo:** [calculator-five-vert-80.vercel.app](https://calculator-five-vert-80.vercel.app)

## O projekcie

To nie jest kalkulator oparty o `eval()`. Wprowadzane wyrażenia są tokenizowane i parsowane do drzewa AST (Abstract Syntax Tree), a następnie ewaluowane własnym silnikiem — dzięki czemu te same wyrażenia matematyczne mogą być zarówno obliczane, jak i **rysowane jako wykres funkcji** na płótnie HTML5 Canvas, z pełną obsługą przybliżania i przesuwania widoku.

## Funkcjonalności

- 🧮 **Dwa tryby obliczeń** — klasyczny (podstawowe działania) i naukowy.
- 📈 **Rysowanie wykresów funkcji** na Canvas — poprawnie wpisany wzór (np. `sin(x)`) jest renderowany jako interaktywny wykres z siatką i osiami, z możliwością **przybliżania (scroll) i przesuwania widoku (przeciąganie myszą)**.
- ⌨️ **Pełna obsługa klawiatury** — nie tylko klikanie przycisków.
- 🕘 **Historia obliczeń** (bez funkcji pamięci typu M+/M-/MR).
- ⚠️ **Czytelna obsługa błędów** — nieprawidłowe operacje (np. dzielenie przez zero) wyświetlają `NaN` zamiast wywalać aplikację.
- 🎨 **4 motywy wizualne** do wyboru: Cyberpunk Neon, Glass Dream, Retro CRT, Aurora Light — motyw zmienia nie tylko kolory UI, ale też paletę wykresu i efektów cząsteczkowych.
- ✨ **Animowane efekty cząsteczkowe** przy interakcjach, dopasowane kolorystycznie do wybranego motywu.
- 🔊 **Dźwięki przy pisaniu** z możliwością wyciszenia całego kalkulatora.

## Stack technologiczny

| Warstwa | Technologia |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite |
| Stylowanie | Bootstrap 5 |
| Wizualizacje | HTML5 Canvas API (własna implementacja rysowania wykresów i cząsteczek) |
| Parsowanie wyrażeń | Własny tokenizer + parser AST (bez `eval()`) |

## Uruchomienie lokalne

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

## Struktura projektu

```
src/
├── components/
│   └── Visualizer.tsx    # rysowanie wykresów i cząsteczek na Canvas
├── utils/
│   └── mathParser.ts     # tokenizer, parser AST, ewaluator wyrażeń
└── App.tsx
```

## Autor

Adrian Wzorek

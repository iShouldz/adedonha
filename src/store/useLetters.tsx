import { create } from "zustand";

// interface LetterState {
//   randomLetter: string;
// }

interface LetterExcludeState {
  excludesLetters: string[];
  addingExcludeLetter: (letter: string) => void;
  removeExcludeLetter: (letter: string) => void;
  resetExcludeLetter: () => void;
}

// interface RandomLetter {
//   letter: string;
//   historyGenerateLetters: string[];
//   generateNewLetter: () => void;

// }

export const useExcludeLetters = create<LetterExcludeState>()((set) => ({
  excludesLetters: [],
  addingExcludeLetter: (letter) =>
    set((state) => ({
      excludesLetters: !state.excludesLetters.includes(letter)
        ? [...state.excludesLetters, letter]
        : state.excludesLetters,
    })),
  removeExcludeLetter: (letter) =>
    set((state) => ({
      excludesLetters: state.excludesLetters.includes(letter)
        ? state.excludesLetters.filter((letra) => letra !== letter)
        : state.excludesLetters,
    })),
  resetExcludeLetter: () =>
    set(() => ({
      excludesLetters: [],
    })),
}));

// export const useGenerateRandomLetter = create<RandomLetter>()((set) => ({
//   letter: "",
//   historyGenerateLetters: [],
//   generateNewLetter: () => set((state) => ({

//   }))
// }));

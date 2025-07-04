import { create } from 'zustand';

interface UiState {
  isMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;

  isSearchOpen: boolean;
  toggleSearch: () => void;
}

export const useUiStore = create<UiState>()((set) => ({
  isMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  closeMobileMenu: () => set({ isMenuOpen: false }),

  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));

export const useIsMenuOpen = () => useUiStore((state) => state.isMenuOpen);
export const useToggleMobileMenu = () => useUiStore((state) => state.toggleMobileMenu);
export const useCloseMobileMenu = () => useUiStore((state) => state.closeMobileMenu);

export const useSearchTerm = () => useUiStore((state) => state.searchTerm);
export const useSetSearchTerm = () => useUiStore((state) => state.setSearchTerm);

export const useIsSearchOpen = () => useUiStore((state) => state.isSearchOpen);
export const useToggleSearch = () => useUiStore((state) => state.toggleSearch);

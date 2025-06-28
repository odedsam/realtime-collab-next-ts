import { create } from 'zustand';

interface UiState {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;

  searchTerm: string;
  setSearchTerm: (term: string) => void;

  isSearchOpen: boolean;
  toggleSearch: () => void;
}

export const useUiStore = create<UiState>()((set, get) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),

  searchTerm: '',
  setSearchTerm: (term) => set({ searchTerm: term }),

  isSearchOpen: false,
  toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
}));

export const useMobileMenuOpen = () => useUiStore((state) => state.isMobileMenuOpen);
export const useToggleMobileMenu = () => useUiStore((state) => state.toggleMobileMenu);

export const useSearchTerm = () => useUiStore((state) => state.searchTerm);
export const useSetSearchTerm = () => useUiStore((state) => state.setSearchTerm);
export const useIsSearchOpen = () => useUiStore((state) => state.isSearchOpen);
export const useToggleSearch = () => useUiStore((state) => state.toggleSearch);

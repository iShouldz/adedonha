export interface PlayerProps {
  id?: number;
  name: string;
  points: number;
  currentPoints: number;
  data: string;
}

export interface PlayerLeaderboard {
  data: PlayerProps[];
  onReset: () => void;
  onClose?: () => void;
}

export interface PlayerDetails {
  state: boolean;
  match: PlayerProps[];
}

export interface TemplateState {
  state: boolean;
  temas: string[];
  open: boolean;
}

export interface TemplateThemes {
  temas: string[];
  callbackPDF: any;
}

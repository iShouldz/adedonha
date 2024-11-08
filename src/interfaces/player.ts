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
  state: boolean
  match: PlayerProps[]
}
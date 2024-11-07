export interface PlayerProps {
  id?: number;
  name: string;
  points: number;
  currentPoints: number;
}

export interface PlayerLeaderboard {
  data: PlayerProps[];
  onReset: () => void;
}

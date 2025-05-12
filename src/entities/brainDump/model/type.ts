export type BrainDump = {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

export type BrainDumpStore = {
  dumps: BrainDump[];
  currentDump: string;
  addDump: (content: string) => void;
  updateCurrentDump: (content: string) => void;
  deleteDump: (id: number) => void;
};

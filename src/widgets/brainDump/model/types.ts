export type BrainDump = {
  id: string;
  createdAt: string;
  updatedAt: string;
};

export type BrainDumpStore = {
  dumps: BrainDump[];
  sharedContent: string;
  activeDumpId: string | null;
  createDump: () => void;
  updateContent: (content: string) => void;
  getActiveDump: () => BrainDump | undefined;
  setActiveDump: (id: string) => void;
  deleteDump: (id: string) => void;
};

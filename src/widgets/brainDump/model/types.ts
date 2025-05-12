export type BrainDump = {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
};

export type BrainDumpStore = {
  dumps: BrainDump[];
  sharedContent: string;
  activeDumpId: string | null;
  createDump: () => void;
  updateContent: (content: string) => void;
  updateTitle: (id: string, title: string) => void;
  getActiveDump: () => BrainDump | undefined;
  setActiveDump: (id: string) => void;
  deleteDump: (id: string) => void;
};

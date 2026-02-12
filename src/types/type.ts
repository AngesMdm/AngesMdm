export type MediaFile = {
    id: string;
    name: string;
    type: "file";
    fileType: "image" | "video";
    url: string;
};

export type Folder = {
    id: string;
    name: string;
    type: "folder";
    children: Array<MediaFile | Folder>;
    media_count: number;
    updated_at: string;
};

export type FAQ = {
  id: number;
  question: string;
  created_by: number;
  created_at: string;
  answer?: string;
  answered_by?: number;
  answered_at?: string;
  answerid?: number; // Optional, used for answers
};

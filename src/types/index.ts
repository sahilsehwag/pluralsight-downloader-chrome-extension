export * from './utils'

type CommonDownloadItem = {
  courseId: string;
  sectionId: string;
  videoId: string;
  url: string;
  filename: string;
}

export type PendingItem = {
  status: 'PENDING';
};

export type QueuedItem = {
  status: 'QUEUED';
};

export type DownloadingItem = {
  status: 'DOWLOADING';
  downloadId: string;
  progress: number;
};

export type PausedItem = {
  status: 'PAUSED';
  downloadId: string;
  progress: number;
};

export type CompletedItem = {
  status: 'COMPLETED';
  downloadId: string;
};

export type FailedItem = {
  status: 'FAILED';
  downloadId: string;
  progress: number;
  error: string;
};

export type CancelledItem = {
  status: 'CANCELLED';
  downloadId: string;
  progress: number;
};

export type DownloadItem = CommonDownloadItem & (
  | PendingItem
  | QueuedItem
  | DownloadingItem
  | PausedItem
  | CompletedItem
  | FailedItem
  | CancelledItem
)

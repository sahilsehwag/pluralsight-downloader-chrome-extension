import { KeyOf } from '~/types'
import { Course } from '~/entities/Course'

import { LOCALE_X_LANGUAGE } from '~/constants/locales'

export type Store = {
  videoId: string; // videoId of video playing on current page
  course: Course; // course on current page
	queue: Queue;
  // TODO: instead of array use map
  history: Course[];
  logs: Log[];
  settings: Settings;
}

export type Settings = {
  downloadDelay: number; // delay between each download in milliseconds.
  primaryLocale: KeyOf<typeof LOCALE_X_LANGUAGE>,
  secondaryLocale: KeyOf<typeof LOCALE_X_LANGUAGE>,
  isDarkMode: boolean;
  theme: 'ROSE' | 'RED' | 'SLATE' | 'GRAY' | 'NEUTRAL';
  notifications: {
    error: boolean;
    download: 'NEVER' | 'VIDEO' | 'SECTION' | 'COURSE';
    update: boolean;
  };
}

export type Log = {
  type: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'SUCCESS';
  message: string;
  date: string;
}

export type DownloadItem = CommonDownloadItem & (
  | PendingItem
  | QueuedItem
  | DownloadingItem
  | PausedItem
  | CompletedItem
  | FailedItem
  | CancelledItem
)

export type DownloadStatus = DownloadItem['status']

type CommonDownloadItem = {
  type: 'VIDEO' | 'SUBTITLE';
  courseId: string;
  sectionIdx: number;
  videoIdx: number;
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

export type Queue = DownloadItem[]

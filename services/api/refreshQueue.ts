type PendingEntry = {
  resolve: (value?: string) => void;
  reject: (reason: unknown) => void;
};

let isRefreshing = false;
let pendingQueue: PendingEntry[] = [];

export function getIsRefreshing(): boolean {
  return isRefreshing;
}

export function setRefreshing(value: boolean): void {
  isRefreshing = value;
}

export function enqueuePending(entry: PendingEntry): void {
  pendingQueue.push(entry);
}

export function processPendingQueue(error: unknown, token?: string): void {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  pendingQueue = [];
}

export let isRefreshing = false;
export let pendingQueue: Array<{
  resolve: (value?: string) => void;
  reject: (reason: unknown) => void;
}> = [];

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

export function setRefreshing(value: boolean): void {
  isRefreshing = value;
}

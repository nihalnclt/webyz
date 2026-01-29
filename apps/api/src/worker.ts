import { startTrackingWorker } from "./workers/tracking.worker.js";

const WORKER_TYPE = process.env.WORKER_TYPE;

const start = async () => {
  if (!WORKER_TYPE) {
    throw new Error("WORKER_TYPE is required");
  }

  console.log(`[worker] starting ${WORKER_TYPE} worker`);

  switch (WORKER_TYPE) {
    case "tracking":
      await startTrackingWorker();
      break;

    // case "notification":
    //   await startNotificationWorker();
    //   break;

    default:
      throw new Error(`Unknown WORKER_TYPE: ${WORKER_TYPE}`);
  }
};

start().catch((err) => {
  console.error(`[worker] failed to start`, err);
  process.exit(1);
});

const { sendMail } = require('./mailer');

const QUEUE_POLL_MS = Number(process.env.EMAIL_QUEUE_POLL_MS || 1000);

class EmailQueue {
  constructor() {
    this.queue = [];
    this.running = false;
    this.processing = false;
  }

  enqueue(mailPayload) {
    const item = { payload: mailPayload, createdAt: Date.now() };
    this.queue.push(item);
    console.info(JSON.stringify({ event: 'email_enqueued', length: this.queue.length, to: mailPayload.to }));
    return item;
  }

  size() {
    return this.queue.length;
  }

  async _processOne(item) {
    try {
      await sendMail(item.payload);
      console.info(JSON.stringify({ event: 'email_processed', to: item.payload.to }));
    } catch (err) {
      console.error(JSON.stringify({ event: 'email_process_error', error: err.message, to: item.payload.to }));
    }
  }

  async workerLoop() {
    if (this.processing) return;
    this.processing = true;
    while (this.running) {
      const item = this.queue.shift();
      if (!item) {
        await new Promise((r) => setTimeout(r, QUEUE_POLL_MS));
        continue;
      }
      await this._processOne(item);
    }
    this.processing = false;
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.workerLoop().catch((err) => console.error('emailQueue worker error', err));
    console.info(JSON.stringify({ event: 'email_queue_started' }));
  }

  stop() {
    this.running = false;
    console.info(JSON.stringify({ event: 'email_queue_stopped' }));
  }
}

const defaultQueue = new EmailQueue();
module.exports = {
  enqueue: (p) => defaultQueue.enqueue(p),
  startWorker: () => defaultQueue.start(),
  stopWorker: () => defaultQueue.stop(),
  queueSize: () => defaultQueue.size(),
};

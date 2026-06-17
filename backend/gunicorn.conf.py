import multiprocessing
import os

bind = "0.0.0.0:8000"
workers = multiprocessing.cpu_count() * 2 + 1
worker_class = "gunicorn.workers.SyncWorker"
timeout = 120
preload_app = True
accesslog = "logs/access.log"
errorlog = "logs/error.log"
loglevel = "info"

# SSL Configuration (for production)
# certfile = "/etc/ssl/certs/yourdomain.crt"
# keyfile = "/etc/ssl/private/yourdomain.key"
# ca_certs = "/etc/ssl/certs/yourdomain.ca-bundle"
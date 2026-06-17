#!/bin/bash
# Database Backup Script for Dr. Jimmy Orthopedic

# Configuration
BACKUP_DIR="/var/backups/drjimmyortho"
DB_NAME="drjimmy_db"
DB_USER="drjimmy_user"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Create backup directory if not exists
mkdir -p $BACKUP_DIR

# Backup database
echo "Starting database backup..."
pg_dump -U $DB_USER $DB_NAME > "$BACKUP_DIR/db_backup_$DATE.sql"

# Compress backup
gzip "$BACKUP_DIR/db_backup_$DATE.sql"

# Backup media files
echo "Backing up media files..."
tar -czf "$BACKUP_DIR/media_backup_$DATE.tar.gz" /var/www/drjimmyortho/backend/media/

# Backup frontend build
echo "Backing up frontend..."
tar -czf "$BACKUP_DIR/frontend_backup_$DATE.tar.gz" /var/www/drjimmyortho/frontend/build/

# Remove old backups
echo "Removing backups older than $RETENTION_DAYS days..."
find $BACKUP_DIR -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +$RETENTION_DAYS -delete

# Upload to remote storage (optional)
# aws s3 sync $BACKUP_DIR s3://your-backup-bucket/drjimmyortho/

echo "Backup completed: $DATE"
import sqlite3

# Connect to the database
conn = sqlite3.connect('app.db')
cursor = conn.cursor()

# Check if the table exists
cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='github_commit_info'")
if cursor.fetchone():
    # First, we'll create a new table with the correct schema
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS github_commit_info_new (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        repo_url TEXT NOT NULL,
        username TEXT NOT NULL,
        commit_info TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES users(id)
    )
    ''')
    
    # If there's any data in the old table, migrate it
    cursor.execute("SELECT COUNT(*) FROM github_commit_info")
    count = cursor.fetchone()[0]
    
    if count > 0:
        # The old table has data, migrate it
        cursor.execute('''
        INSERT INTO github_commit_info_new (id, employee_id, repo_url, username, commit_info, created_at, updated_at)
        SELECT id, employee_id, repo_url, username, commit_info, created_at, updated_at 
        FROM github_commit_info
        ''')
        print(f"Migrated {count} records to the new table")
    
    # Drop the old table
    cursor.execute("DROP TABLE github_commit_info")
    
    # Rename the new table to the original name
    cursor.execute("ALTER TABLE github_commit_info_new RENAME TO github_commit_info")
    
    print("Database schema updated successfully")
else:
    # Table doesn't exist, create it with the correct schema
    cursor.execute('''
    CREATE TABLE github_commit_info (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        employee_id INTEGER NOT NULL,
        repo_url TEXT NOT NULL,
        username TEXT NOT NULL,
        commit_info TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP,
        FOREIGN KEY (employee_id) REFERENCES users(id)
    )
    ''')
    print("Created new github_commit_info table")

conn.commit()
conn.close()

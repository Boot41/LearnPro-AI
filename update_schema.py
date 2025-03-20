from sqlalchemy import create_engine, text, MetaData, Table, Column, Integer, String, ForeignKey, DateTime
import os
from dotenv import load_dotenv
from sqlalchemy.orm import sessionmaker
from sqlalchemy.sql import func
import sys

# Load environment variables if using a .env file
load_dotenv()

# Use the same database URL as the application
DATABASE_URI = "sqlite:///./app.db"

def update_database_schema():
    """
    Update the database schema to match the new structure with proper relationships
    between GiveKtNew, KtInfoNew, and TakeKtNew tables.
    """
    engine = create_engine(DATABASE_URI)
    
    # Create a session
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    db = SessionLocal()
    
    try:
        # Check if tables exist
        inspector = MetaData()
        inspector.reflect(bind=engine)
        
        # Drop tables if they exist to recreate them with the correct schema
        # We need to drop them in the correct order due to foreign key constraints
        if 'take_kt_new' in inspector.tables:
            print("Dropping take_kt_new table...")
            db.execute(text("DROP TABLE take_kt_new"))
            db.commit()
        
        if 'kt_info_new' in inspector.tables:
            print("Dropping kt_info_new table...")
            db.execute(text("DROP TABLE kt_info_new"))
            db.commit()
            
        if 'give_kt_new' in inspector.tables:
            print("Dropping give_kt_new table...")
            db.execute(text("DROP TABLE give_kt_new"))
            db.commit()
        
        # Create give_kt_new table
        print("Creating give_kt_new table...")
        db.execute(text("""
        CREATE TABLE give_kt_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER NOT NULL,
            repo_url VARCHAR NOT NULL,
            username VARCHAR NOT NULL,
            commit_info VARCHAR,
            kt_info_id INTEGER,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP,
            FOREIGN KEY(employee_id) REFERENCES users(id),
            FOREIGN KEY(kt_info_id) REFERENCES kt_info_new(id)
        )
        """))
        db.commit()
        
        # Create kt_info_new table
        print("Creating kt_info_new table...")
        db.execute(text("""
        CREATE TABLE kt_info_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            employee_id INTEGER NOT NULL,
            give_kt_new_id INTEGER NOT NULL,
            kt_info VARCHAR,
            original_commits VARCHAR,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP,
            FOREIGN KEY(employee_id) REFERENCES users(id),
            FOREIGN KEY(give_kt_new_id) REFERENCES give_kt_new(id)
        )
        """))
        db.commit()
        
        # Create take_kt_new table
        print("Creating take_kt_new table...")
        db.execute(text("""
        CREATE TABLE take_kt_new (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            give_kt_new_id INTEGER NOT NULL,
            employee_id INTEGER NOT NULL,
            status VARCHAR DEFAULT 'Kt not created',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP,
            FOREIGN KEY(give_kt_new_id) REFERENCES give_kt_new(id),
            FOREIGN KEY(employee_id) REFERENCES users(id)
        )
        """))
        db.commit()
        
        # Add triggers for updated_at columns (SQLite doesn't support onupdate)
        print("Adding triggers for updated_at columns...")
        
        # Trigger for give_kt_new
        db.execute(text("""
        CREATE TRIGGER IF NOT EXISTS trig_give_kt_new_updated_at
        AFTER UPDATE ON give_kt_new
        FOR EACH ROW
        BEGIN
            UPDATE give_kt_new SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
        """))
        
        # Trigger for kt_info_new
        db.execute(text("""
        CREATE TRIGGER IF NOT EXISTS trig_kt_info_new_updated_at
        AFTER UPDATE ON kt_info_new
        FOR EACH ROW
        BEGIN
            UPDATE kt_info_new SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
        """))
        
        # Trigger for take_kt_new
        db.execute(text("""
        CREATE TRIGGER IF NOT EXISTS trig_take_kt_new_updated_at
        AFTER UPDATE ON take_kt_new
        FOR EACH ROW
        BEGIN
            UPDATE take_kt_new SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
        END;
        """))
        
        db.commit()
        print("Database schema update completed successfully.")
        
    except Exception as e:
        db.rollback()
        print(f"Error updating database schema: {e}")
        sys.exit(1)
    finally:
        db.close()

if __name__ == "__main__":
    update_database_schema()

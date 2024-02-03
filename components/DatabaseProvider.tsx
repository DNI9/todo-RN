import migrations from "@/drizzle/migrations";
import { drizzle, type ExpoSQLiteDatabase } from "drizzle-orm/expo-sqlite";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { openDatabaseAsync, type SQLiteDatabase } from "expo-sqlite/next";
import { createContext, useContext, useEffect, useRef, useState } from "react";

type DrizzleExpoDb = ExpoSQLiteDatabase<Record<string, never>>;

const DatabaseContext = createContext<DrizzleExpoDb | null>(null);

export interface DatabaseProviderProps {
  children: React.ReactNode;
  databaseName?: string;
}

export function DatabaseProvider({
  children,
  databaseName = "db.db",
}: DatabaseProviderProps) {
  const drizzleDbRef = useRef<DrizzleExpoDb | null>(null);
  const expoDbRef = useRef<SQLiteDatabase | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function setup() {
      try {
        const expoDb = await openDatabaseAsync(databaseName);
        expoDbRef.current = expoDb;

        const drizzleDb = drizzle(expoDb);
        drizzleDbRef.current = drizzleDb;
        console.log("Database setup successful");
      } catch (e) {
        setError(e as Error);
        console.log("Database setup failed");
      } finally {
        setLoading(false);
      }
    }

    async function teardown(db: SQLiteDatabase | null) {
      try {
        await db?.closeAsync();
        console.log("Database teardown successful");
      } catch (e) {
        setError(e as Error);
      }
    }

    setup();

    return () => {
      const db = expoDbRef.current;
      teardown(db);
      expoDbRef.current = null;
      drizzleDbRef.current = null;
      setLoading(true);
    };
  }, [databaseName]);

  if (error != null) throw error;
  if (loading || !drizzleDbRef.current) return null;

  return (
    <DatabaseContext.Provider value={drizzleDbRef.current}>
      <MigrationRunner>{children}</MigrationRunner>
    </DatabaseContext.Provider>
  );
}

function MigrationRunner({ children }: { children: React.ReactNode }) {
  const db = useDb();
  const { success, error } = useMigrations(db, migrations);

  if (error) throw error;

  if (!success) {
    console.log("Database migrations is in progress");
    return null;
  }

  return children;
}

export function useDb(): DrizzleExpoDb {
  const db = useContext(DatabaseContext);
  if (!db) {
    throw new Error("useDb must be used within a <DatabaseProvider>");
  }
  return db;
}

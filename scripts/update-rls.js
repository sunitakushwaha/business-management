const { Client } = require('pg');

const client = new Client({
  connectionString: 'postgresql://postgres:AJDvbmOkZpDcatks@db.hookchrctjnxmqtxoaoi.supabase.co:5432/postgres',
  ssl: { rejectUnauthorized: false }
});

async function run() {
  try {
    await client.connect();
    console.log('Connected to PostgreSQL successfully.');

    const tables = [
      'profiles',
      'suppliers',
      'products',
      'customers',
      'employees',
      'attendance',
      'sales',
      'sale_items',
      'income',
      'expenses',
      'stock_movements'
    ];

    for (const table of tables) {
      console.log(`Configuring RLS for table: ${table}`);
      // Drop any existing policies that restrict to authenticated
      await client.query(`DROP POLICY IF EXISTS "Allow authenticated full access" ON public.${table};`);
      await client.query(`DROP POLICY IF EXISTS "Allow public access" ON public.${table};`);
      await client.query(`DROP POLICY IF EXISTS "Public access" ON public.${table};`);
      
      // Ensure RLS is enabled
      await client.query(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
      
      // Create open policy for anon and authenticated (public)
      await client.query(`
        CREATE POLICY "Allow public access"
        ON public.${table}
        FOR ALL
        TO public
        USING (true)
        WITH CHECK (true);
      `);
    }

    console.log('All 11 tables now have full public access enabled!');
  } catch (err) {
    console.error('Error updating RLS:', err);
  } finally {
    await client.end();
  }
}

run();

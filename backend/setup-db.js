require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

async function setupDatabase() {
  console.log('Setting up database...');
  console.log('Supabase URL:', process.env.SUPABASE_URL);

  // Test connection by trying to query the table
  const { data, error } = await supabase
    .from('loan_applications')
    .select('count')
    .limit(1);

  if (error) {
    if (error.code === '42P01') {
      console.log('Table does not exist. Please create it manually in Supabase SQL Editor.');
      console.log('\nCopy and paste the SQL from database/schema.sql into the Supabase SQL Editor.');
    } else {
      console.log('Error:', error.message);
      console.log('Error code:', error.code);
    }
  } else {
    console.log('Table loan_applications exists!');
    console.log('Database connection successful!');
  }
}

async function testStorage() {
  console.log('\nTesting storage...');

  // List buckets
  const { data: buckets, error } = await supabase.storage.listBuckets();

  if (error) {
    console.log('Storage error:', error.message);
  } else {
    console.log('Available buckets:', buckets.map(b => b.name));

    const documentsBucket = buckets.find(b => b.name === 'documents');
    if (!documentsBucket) {
      console.log('\nCreating "documents" bucket...');
      const { data, error: createError } = await supabase.storage.createBucket('documents', {
        public: true
      });

      if (createError) {
        console.log('Error creating bucket:', createError.message);
      } else {
        console.log('Documents bucket created successfully!');
      }
    } else {
      console.log('Documents bucket already exists!');
    }
  }
}

async function main() {
  await setupDatabase();
  await testStorage();
  console.log('\nSetup complete!');
}

main().catch(console.error);

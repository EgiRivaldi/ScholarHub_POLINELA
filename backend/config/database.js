const { createClient } = require('@supabase/supabase-js');
const logger = require('../utils/logger');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  logger.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env');
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

const testConnection = async () => {
  try {
    const { data, error } = await supabase.from('akun_admin').select('id').limit(1);
    
    if (error) {
      if (error.code === '42P01') { 
        logger.info('Supabase API connected successfully (tables not created yet)');
        return true;
      }
      throw error;
    }
    
    logger.info('Supabase API connected successfully');
    return true;
  } catch (error) {
    logger.error(`Supabase connection failed: ${error.message || error}`);
    return false;
  }
};

module.exports = { supabase, testConnection };

const { supabase } = require('../config/database');

const Admin = {
  findByUsername: async (username) => {
    const { data, error } = await supabase
      .from('akun_admin')
      .select('*')
      .eq('username', username)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error; // PGRST116 is 'Row not found'
    return data; // returns null if not found
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('akun_admin')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  create: async (adminData) => {
    const { data, error } = await supabase
      .from('akun_admin')
      .insert([
        {
          username: adminData.username,
          password: adminData.password,
          nama_lengkap: adminData.nama_lengkap,
          email: adminData.email,
          role: adminData.role || 'admin'
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data.id; // Return inserted ID to match previous behavior
  },

  // Fungsi tambahan untuk mendapatkan semua admin
  findAll: async () => {
    const { data, error } = await supabase
      .from('akun_admin')
      .select('id, username, nama_lengkap, email, role, created_at, updated_at');
      
    if (error) throw error;
    return data;
  }
};

module.exports = Admin;

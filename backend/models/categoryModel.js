const { supabase } = require('../config/database');

const Category = {
  findAll: async () => {
    // Dengan Supabase kita bisa join untuk count
    // informasi_beasiswa(count)
    const { data, error } = await supabase
      .from('kategori_beasiswa')
      .select(`
        id, 
        nama_kategori, 
        deskripsi, 
        created_at, 
        updated_at,
        informasi_beasiswa (count)
      `)
      .order('id', { ascending: true });

    if (error) throw error;
    
    // Map hasilnya agar sesuai dengan format lama `total_beasiswa`
    return data.map(item => ({
      ...item,
      total_beasiswa: item.informasi_beasiswa[0].count
    }));
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('kategori_beasiswa')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  create: async (categoryData) => {
    const { data, error } = await supabase
      .from('kategori_beasiswa')
      .insert([
        {
          nama_kategori: categoryData.nama_kategori,
          deskripsi: categoryData.deskripsi
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  update: async (id, categoryData) => {
    const { data, error } = await supabase
      .from('kategori_beasiswa')
      .update({
        nama_kategori: categoryData.nama_kategori,
        deskripsi: categoryData.deskripsi
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data.length > 0 ? 1 : 0; // Return affectedRows equivalent
  },

  delete: async (id) => {
    const { data, error } = await supabase
      .from('kategori_beasiswa')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    return data.length > 0 ? 1 : 0;
  }
};

module.exports = Category;

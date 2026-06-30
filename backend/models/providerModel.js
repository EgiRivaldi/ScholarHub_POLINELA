const { supabase } = require('../config/database');

const Provider = {
  findAll: async () => {
    // Dengan Supabase kita bisa hitung total beasiswa per penyedia
    const { data, error } = await supabase
      .from('penyedia_beasiswa')
      .select(`
        *,
        informasi_beasiswa (count)
      `)
      .order('id', { ascending: true });

    if (error) throw error;
    
    return data.map(item => ({
      ...item,
      total_beasiswa: item.informasi_beasiswa[0].count
    }));
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('penyedia_beasiswa')
      .select('*')
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  create: async (providerData) => {
    const { data, error } = await supabase
      .from('penyedia_beasiswa')
      .insert([
        {
          nama_penyedia: providerData.nama_penyedia,
          jenis_penyedia: providerData.jenis_penyedia,
          kontak: providerData.kontak,
          website: providerData.website,
          alamat: providerData.alamat,
          logo: providerData.logo
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  update: async (id, providerData) => {
    const { data, error } = await supabase
      .from('penyedia_beasiswa')
      .update({
        nama_penyedia: providerData.nama_penyedia,
        jenis_penyedia: providerData.jenis_penyedia,
        kontak: providerData.kontak,
        website: providerData.website,
        alamat: providerData.alamat,
        logo: providerData.logo
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data.length > 0 ? 1 : 0;
  },

  delete: async (id) => {
    const { data, error } = await supabase
      .from('penyedia_beasiswa')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    return data.length > 0 ? 1 : 0;
  }
};

module.exports = Provider;

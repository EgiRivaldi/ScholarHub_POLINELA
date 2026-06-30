const { supabase } = require('../config/database');

const Requirement = {
  findAll: async () => {
    const { data, error } = await supabase
      .from('syarat_beasiswa')
      .select(`
        *,
        informasi_beasiswa (judul)
      `)
      .order('id', { ascending: true });

    if (error) throw error;
    
    // Map hasilnya agar field `judul_beasiswa` ada
    return data.map(item => ({
      ...item,
      judul_beasiswa: item.informasi_beasiswa?.judul
    }));
  },

  findByScholarshipId: async (beasiswa_id) => {
    const { data, error } = await supabase
      .from('syarat_beasiswa')
      .select('*')
      .eq('beasiswa_id', beasiswa_id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('syarat_beasiswa')
      .select(`
        *,
        informasi_beasiswa (judul)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    
    if (data) {
      data.judul_beasiswa = data.informasi_beasiswa?.judul;
    }
    return data;
  },

  create: async (requirementData) => {
    const { data, error } = await supabase
      .from('syarat_beasiswa')
      .insert([
        {
          beasiswa_id: requirementData.beasiswa_id,
          syarat_dokumen: requirementData.syarat_dokumen,
          ipk_minimal: requirementData.ipk_minimal,
          syarat_lainnya: requirementData.syarat_lainnya
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  update: async (id, requirementData) => {
    const { data, error } = await supabase
      .from('syarat_beasiswa')
      .update({
        beasiswa_id: requirementData.beasiswa_id,
        syarat_dokumen: requirementData.syarat_dokumen,
        ipk_minimal: requirementData.ipk_minimal,
        syarat_lainnya: requirementData.syarat_lainnya
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    return data.length > 0 ? 1 : 0;
  },

  delete: async (id) => {
    const { data, error } = await supabase
      .from('syarat_beasiswa')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    return data.length > 0 ? 1 : 0;
  }
};

module.exports = Requirement;

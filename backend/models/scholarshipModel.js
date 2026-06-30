const { supabase } = require('../config/database');

const Scholarship = {
  findAll: async (filters = {}) => {
    let query = supabase
      .from('informasi_beasiswa')
      .select(`
        *,
        kategori_beasiswa (nama_kategori),
        penyedia_beasiswa (nama_penyedia, singkatan)
      `);

    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      // We can't directly search relations easily in a single OR across main and joined tables without RPC or Views.
      // So we will search on main table fields.
      query = query.or(`nama_beasiswa.ilike.${searchPattern},deskripsi.ilike.${searchPattern}`);
    }

    if (filters.kategori_id) {
      query = query.eq('kategori_id', filters.kategori_id);
    }

    if (filters.status) {
      const today = new Date().toISOString().split('T')[0];
      if (filters.status === 'active') {
        query = query.gte('tanggal_tutup', today);
      } else if (filters.status === 'closed') {
        query = query.lt('tanggal_tutup', today);
      }
    }

    const allowedSortFields = ['id', 'nama_beasiswa', 'tanggal_buka', 'tanggal_tutup', 'created_at'];
    const sortField = allowedSortFields.includes(filters.sort) ? filters.sort : 'id';
    const isAscending = filters.order === 'ASC';
    
    query = query.order(sortField, { ascending: isAscending });

    const page = parseInt(filters.page, 10) || 1;
    const limit = parseInt(filters.limit, 10) || 10;
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    query = query.range(from, to);

    const { data, error } = await query;
    if (error) throw error;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);

    return data.map(item => {
      const tutupDate = new Date(item.tanggal_tutup);
      tutupDate.setHours(0,0,0,0);
      
      return {
        ...item,
        nama_kategori: item.kategori_beasiswa?.nama_kategori,
        nama_penyedia: item.penyedia_beasiswa?.nama_penyedia,
        penyedia_singkatan: item.penyedia_beasiswa?.singkatan,
        status: tutupDate >= todayDate ? 'active' : 'closed',
        // cleanup relational objects
        kategori_beasiswa: undefined,
        penyedia_beasiswa: undefined
      };
    });
  },

  count: async (filters = {}) => {
    let query = supabase
      .from('informasi_beasiswa')
      .select('*', { count: 'exact', head: true });

    if (filters.search) {
      const searchPattern = `%${filters.search}%`;
      query = query.or(`nama_beasiswa.ilike.${searchPattern},deskripsi.ilike.${searchPattern}`);
    }

    if (filters.kategori_id) {
      query = query.eq('kategori_id', filters.kategori_id);
    }

    if (filters.status) {
      const today = new Date().toISOString().split('T')[0];
      if (filters.status === 'active') {
        query = query.gte('tanggal_tutup', today);
      } else if (filters.status === 'closed') {
        query = query.lt('tanggal_tutup', today);
      }
    }

    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('informasi_beasiswa')
      .select(`
        *,
        kategori_beasiswa (nama_kategori),
        penyedia_beasiswa (nama_penyedia, singkatan)
      `)
      .eq('id', id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;
    if (!data) return null;

    const todayDate = new Date();
    todayDate.setHours(0, 0, 0, 0);
    const tutupDate = new Date(data.tanggal_tutup);
    tutupDate.setHours(0,0,0,0);

    return {
      ...data,
      nama_kategori: data.kategori_beasiswa?.nama_kategori,
      nama_penyedia: data.penyedia_beasiswa?.nama_penyedia,
      penyedia_singkatan: data.penyedia_beasiswa?.singkatan,
      status: tutupDate >= todayDate ? 'active' : 'closed',
      kategori_beasiswa: undefined,
      penyedia_beasiswa: undefined
    };
  },

  create: async (dataToInsert) => {
    const { data, error } = await supabase
      .from('informasi_beasiswa')
      .insert([dataToInsert])
      .select()
      .single();

    if (error) throw error;
    return data.id;
  },

  update: async (id, dataToUpdate) => {
    const { data, error } = await supabase
      .from('informasi_beasiswa')
      .update(dataToUpdate)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data.length > 0;
  },

  delete: async (id) => {
    const { data, error } = await supabase
      .from('informasi_beasiswa')
      .delete()
      .eq('id', id)
      .select();

    if (error) throw error;
    return data.length > 0;
  },

  countActive: async () => {
    const today = new Date().toISOString().split('T')[0];
    const { count, error } = await supabase
      .from('informasi_beasiswa')
      .select('*', { count: 'exact', head: true })
      .gte('tanggal_tutup', today);

    if (error) throw error;
    return count || 0;
  },
};

module.exports = Scholarship;

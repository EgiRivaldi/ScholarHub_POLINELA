const { supabase } = require('../config/database');

const dashboardModel = {
  getStats: async () => {
    const today = new Date().toISOString().split('T')[0];

    const [scholarshipCount, categoryCount, providerCount, activeCount] = await Promise.all([
      supabase.from('informasi_beasiswa').select('*', { count: 'exact', head: true }),
      supabase.from('kategori_beasiswa').select('*', { count: 'exact', head: true }),
      supabase.from('penyedia_beasiswa').select('*', { count: 'exact', head: true }),
      supabase.from('informasi_beasiswa').select('*', { count: 'exact', head: true }).gte('tanggal_tutup', today)
    ]);

    return {
      totalScholarships: scholarshipCount.count || 0,
      totalCategories: categoryCount.count || 0,
      totalProviders: providerCount.count || 0,
      activeScholarships: activeCount.count || 0,
    };
  },

  getRecentScholarships: async (limit = 5) => {
    const { data, error } = await supabase
      .from('informasi_beasiswa')
      .select(`
        *,
        kategori_beasiswa (nama_kategori),
        penyedia_beasiswa (nama_penyedia, singkatan)
      `)
      .order('id', { ascending: false })
      .limit(limit);

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
        kategori_beasiswa: undefined,
        penyedia_beasiswa: undefined
      };
    });
  },
};

module.exports = dashboardModel;

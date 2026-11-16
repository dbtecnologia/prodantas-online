(function () {
  const config = window.PRODANTAS_CONFIG || {};
  const ready = Boolean(config.supabaseUrl && config.supabaseAnonKey && window.supabase?.createClient);
  const client = ready ? window.supabase.createClient(config.supabaseUrl, config.supabaseAnonKey) : null;

  async function getSession() {
    if (!client) return null;
    const { data } = await client.auth.getSession();
    return data.session;
  }

  async function signIn(email, password) {
    if (!client) throw new Error('Supabase ainda não foi configurado.');
    const result = await client.auth.signInWithPassword({ email, password });
    if (result.error) throw result.error;
    return result.data.session;
  }

  async function signOut() {
    if (client) await client.auth.signOut();
  }

  async function listProducts(includeInactive = false) {
    if (!client) return null;
    let query = client.from('products').select('*').order('id');
    if (!includeInactive) query = query.eq('active', true);
    const { data, error } = await query;
    if (error) throw error;
    return data;
  }

  async function upsertProduct(product) {
    if (!client) return null;
    const payload = { ...product, id: Number(product.id) || undefined, old_price: Number(product.oldPrice ?? product.old_price ?? 0) };
    delete payload.oldPrice;
    const { data, error } = await client.from('products').upsert(payload).select().single();
    if (error) throw error;
    return data;
  }

  async function deleteProduct(id) {
    if (!client) return;
    const { error } = await client.from('products').update({ active: false }).eq('id', id);
    if (error) throw error;
  }

  async function saveStoreValue(key, value) {
    if (!client) return;
    const { error } = await client.from('store_settings').upsert({ key, value });
    if (error) throw error;
  }

  async function getStoreValue(key) {
    if (!client) return null;
    const { data, error } = await client.from('store_settings').select('value').eq('key', key).maybeSingle();
    if (error) throw error;
    return data?.value || null;
  }

  window.ProdantasCloud = {
    ready,
    client,
    getSession,
    signIn,
    signOut,
    listProducts,
    upsertProduct,
    deleteProduct,
    saveStoreValue,
    getStoreValue
  };
})();


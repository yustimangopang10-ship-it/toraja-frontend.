import { useState, useEffect } from "react";

const API_URL = import.meta.env.VITE_API_URL || "https://toraja-backend.vercel.app";

function SettingsPage() {
  const [settings, setSettings] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`${API_URL}/api/settings`);
      const data = await res.json();
      const settingsMap = {};
      data.forEach(s => { settingsMap[s.key] = s.value; });
      setSettings(settingsMap);
    } catch (err) {
      console.error(err);
    }
  };

  const saveSettings = async () => {
    const token = localStorage.getItem("token");
    const keys = ["whatsapp_number", "bank_bca_number", "bank_mandiri_number", "bank_bri_number", "bank_account_name"];
    
    setLoading(true);
    
    for (const key of keys) {
      const value = document.getElementById(key)?.value || "";
      try {
        await fetch(`${API_URL}/api/admin/settings/${key}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
          },
          body: JSON.stringify({ value })
        });
      } catch (err) {
        console.error(`Error saving ${key}:`, err);
      }
    }
    
    setMessage("✅ Pengaturan berhasil disimpan!");
    setTimeout(() => setMessage(""), 3000);
    setLoading(false);
    fetchSettings();
  };

  return (
    <div style={{ background: "#FFFFFF", borderRadius: "20px", border: "1px solid #EEEEEE", overflow: "hidden" }}>
      <div style={{ background: "#FAFAFA", padding: "16px 20px", borderBottom: "1px solid #EEEEEE" }}>
        <h5 style={{ margin: 0, color: "#1A1A1A", fontSize: "16px", fontWeight: "600" }}>⚙️ Pengaturan Toko</h5>
      </div>
      <div style={{ padding: "20px" }}>
        {message && (
          <div style={{ marginBottom: "16px", padding: "12px", backgroundColor: "#E8F5E9", color: "#2E7D32", borderRadius: "8px", textAlign: "center" }}>
            {message}
          </div>
        )}
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Nomor WhatsApp Admin</label>
          <input type="tel" id="whatsapp_number" defaultValue={settings.whatsapp_number || ""} placeholder="6285xxxxxx" style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #DDD" }} />
          <small style={{ color: "#999" }}>Gunakan kode negara (62) tanpa tanda + atau 0 di awal</small>
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Nomor Rekening BCA</label>
          <input type="text" id="bank_bca_number" defaultValue={settings.bank_bca_number || ""} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #DDD" }} />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Nomor Rekening Mandiri</label>
          <input type="text" id="bank_mandiri_number" defaultValue={settings.bank_mandiri_number || ""} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #DDD" }} />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Nomor Rekening BRI</label>
          <input type="text" id="bank_bri_number" defaultValue={settings.bank_bri_number || ""} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #DDD" }} />
        </div>
        
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "500" }}>Nama Pemilik Rekening</label>
          <input type="text" id="bank_account_name" defaultValue={settings.bank_account_name || ""} style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #DDD" }} />
        </div>
        
        <button onClick={saveSettings} disabled={loading} style={{ background: "#D4AF37", border: "none", color: "#1A1A1A", padding: "12px 24px", borderRadius: "30px", fontWeight: "600", cursor: "pointer" }}>
          {loading ? "MENYIMPAN..." : "💾 Simpan Pengaturan"}
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;
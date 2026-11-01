import React from "react";
import { createRoot } from "react-dom/client";
import { registerSW } from "virtual:pwa-register";
import App from "./App.jsx";
import "./style.css";

// ရလဒ်အသစ်ရှိရင် အလိုအလျောက် update ဖြစ်ပြီး စာမျက်နှာ refresh လုပ်မယ်
registerSW({ immediate: true, onNeedRefresh() { location.reload(); } });
createRoot(document.getElementById("root")).render(<App />);

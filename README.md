# ၅ ပေ ၉ လက်မ ပိုက်ကျော် ပြိုင်ပွဲ Website

## ရလဒ်ထည့်နည်း
`data/group-results.json` (အုပ်စုပွဲ) နှင့် `data/knockout-results.json` (K1–K16) ထဲမှာ တစ်ပွဲ တစ်ကြောင်း ထည့်ပြီး commit လုပ်ရုံ။ Vercel က ၁–၂ မိနစ်မှာ update လုပ်ပေးမယ်။

- အုပ်စုပွဲ (၁ set): `{ "id": "A-1v2", "sets": [[21, 15]] }`  (A-1v2 = A အုပ်စု ၁ နံပါတ် vs ၂ နံပါတ်)
- အုပ်စုပွဲ စီစဉ်ချက်: 1v2, 3v4, 1v3, 2v4, 1v4, 2v3
- Knockout (၃ set ၂ နိုင်): `{ "id": "K1", "sets": [[21,18],[19,21],[21,10]] }`  (K1–K16 = ပွဲစဉ် ၁–၁၆)
- ပွဲစဉ် ၁၅ = တတိယလုပွဲ၊ ၁၆ = ဖိုင်နယ်

အမှတ်ပေး: နိုင် ၂ မှတ်၊ ရှုံး ၀။ တူရင် ရမှတ်စုစုပေါင်း (Total Point) မှာ မှီ၊ ပြီးရင် ရမှတ်ခြားနား။
JSON မှားရင် build ကျပြီး site အဟောင်းပဲ ဆက်ရှိမယ်။ မှားတဲ့အကြောင်းကို Vercel log မှာ ဖတ်နိုင်တယ်။

## အသင်းအမည်/ဓာတ်ပုံ
`data/teams.json` ထဲမှာ `name` နှင့် `players` ပြင်ပါ။ ဓာတ်ပုံကို `public/photos/` ထဲထည့်ပြီး `"photos": ["/photos/a.webp","/photos/b.webp"]` လို့ ရေးပါ။

## Run / Deploy
```
npm install
npm run dev
```
GitHub သို့ push → vercel.com မှာ Import → Framework: Vite → Deploy။
Deploy ပြီးရင် `index.html` ထဲက `YOUR-SITE.vercel.app` ကို သင့် domain နဲ့ အစားထိုးပါ (Share လုပ်ရင် ပုံပေါ်ဖို့)။

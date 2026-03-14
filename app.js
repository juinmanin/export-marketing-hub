(() => {
  "use strict";

  function showFatal(message) {
    const box = document.getElementById("runtime-error");
    if (box) {
      box.style.display = "block";
      box.textContent = `앱 실행 오류\n\n${message}`;
    }
  }

  window.addEventListener("error", (event) => {
    showFatal(`${event.message}\n${event.filename || ""}:${event.lineno || ""}`);
  });

  window.addEventListener("unhandledrejection", (event) => {
    const reason = event.reason && event.reason.stack ? event.reason.stack : String(event.reason || "Unknown promise rejection");
    showFatal(reason);
  });

  const KEY = "emh-prd2-lite-v5";
  const BUILD = "2026.03.14.3";
  const NAV = [
    ["dashboard", "Dashboard"],
    ["help", "Help"],
    ["onboarding", "Onboarding"],
    ["brand", "Brand"],
    ["products", "Products"],
    ["studio", "Studio"],
    ["repository", "Repository"],
    ["playbooks", "Playbooks"],
    ["prompts", "Prompts"],
    ["quality", "Quality"],
    ["admin", "Ops"]
  ];
  const LABELS = {
    smartstore: "네이버 스마트스토어",
    coupang: "쿠팡",
    shopee: "Shopee",
    blog: "블로그",
    youtube: "YouTube",
    threads: "Threads",
    x: "X",
    tiktok: "TikTok",
    shorts: "Shorts",
    faq: "FAQ",
    email: "이메일",
    approved: "승인 완료",
    in_review: "검수 중",
    revision_required: "수정 필요",
    generated: "생성 완료"
  };
  const OUT = {
    blog_post: { label: "블로그 글", mode: "generate", platforms: ["blog", "youtube"], sections: ["제목 3안", "개요", "본문", "메타", "CTA", "이미지 프롬프트"] },
    social_post: { label: "X / Threads", mode: "generate", platforms: ["threads", "x"], sections: ["훅", "본문", "대안 카피", "CTA", "해시태그"] },
    pdp: { label: "상세페이지", mode: "generate", platforms: ["smartstore", "coupang", "shopee"], sections: ["Hero", "베네핏", "스펙", "배송/반품", "FAQ", "CTA", "배너 문안"] },
    shortform: { label: "쇼츠 / TikTok", mode: "generate", platforms: ["tiktok", "shorts"], sections: ["3초 훅", "15초 콘티", "샷리스트", "자막", "CTA", "썸네일 프롬프트"] },
    faq: { label: "FAQ / CS", mode: "generate", platforms: ["faq"], sections: ["질문 분류", "답변", "짧은 답변", "정중 버전", "에스컬레이션"] },
    influencer: { label: "인플루언서 메시지", mode: "generate", platforms: ["email"], sections: ["첫 제안", "팔로업", "협업 포인트", "제공 가치"] },
    thumbnail: { label: "유튜브 썸네일 프롬프트", mode: "guide", platforms: ["youtube"], sections: ["추천 툴", "프롬프트", "제작 순서", "QA"] },
    banner: { label: "상세페이지 배너 가이드", mode: "guide", platforms: ["smartstore", "shopee"], sections: ["추천 툴", "프롬프트", "제작 순서", "QA"] }
  };
  const PROFILE_OPTIONS = {
    brandTone: ["", "premium", "trustworthy", "trendy", "practical", "luxury_soft"],
    audienceAge: ["", "18_24", "25_35", "35_49", "b2b_buyers"],
    expressionStyle: ["", "friendly", "polite", "standard", "expert"]
  };

  let toast = "";
  let state = load();

  function seed() {
    return {
      ui: {
        view: "dashboard",
        locale: "ko",
        step: 1,
        activeOutput: null,
        productId: "p1",
        playbookId: "pb1",
        bundleId: "bu1",
        studio: {
          type: "pdp",
          platform: "smartstore",
          marketId: "m1",
          productId: "p1",
          brief: "향 / 선물 / 키링 포인트를 분리해서 보여주세요.",
          brandTone: "",
          audienceAge: "",
          expressionStyle: ""
        },
        repo: { status: "all", platform: "all", type: "all", q: "" },
        draft: {
          product: { name: "", cat: "", features: "", specs: "" },
          market: { country: "", lang: "", note: "" }
        }
      },
      me: { name: "현재 사용자", role: "Company Admin" },
      workspace: {
        company: "VARELI Export Lab",
        business: "뷰티 / 라이프스타일",
        project: "Spring Export Push",
        brand: {
          name: "VARELI",
          story: "향과 오브제를 통해 일상을 디자인하는 라이프스타일 뷰티 브랜드.",
          tone: "감성적이되 과장되지 않은 프리미엄 톤",
          key: "향, 선물, 감각, 리필 경험을 하나의 브랜드 문맥으로 연결한다.",
          preferred: ["일상을 디자인하는 향", "선물하기 좋은 구성", "가볍지만 오래 남는 인상"],
          banned: ["치료", "완치", "100% 즉시 개선", "의학적으로 검증된 효과"],
          assets: [{ name: "VARELI Wordmark", type: "로고" }, { name: "Gift Set Hero", type: "제품컷" }],
          glossary: [{ source: "리필", target: "refillable", locale: "en-US", locked: true }]
        },
        products: [
          { id: "p1", name: "Refillable Perfumed Hand Cream Set", cat: "핸드케어", features: ["실키한 텍스처", "3가지 시그니처 향", "키링 포함 기프트 패키지", "리필 가능한 케이스"], specs: ["30ml x 3", "알루미늄 케이스"], price: "KRW 29,000", shipping: "EMS / DHL 3~7영업일", returns: "미개봉 7일 이내", evidence: ["제품 스펙 시트", "배송 정책 문서"] },
          { id: "p2", name: "Popup Gift Discovery Kit", cat: "기프트 / 팝업", features: ["핸드크림 2종", "향 카드", "리본 박스"], specs: ["20ml x 2", "향 카드 3종"], price: "KRW 24,000", shipping: "해외 배송 5~8영업일", returns: "미사용 제품 7일 이내", evidence: ["팝업 행사 브리프"] }
        ],
        markets: [
          { id: "m1", country: "미국", lang: "영문", note: "giftable beauty, portable luxury" },
          { id: "m2", country: "일본", lang: "일문", note: "정갈한 톤, 선물 문화 강조" },
          { id: "m3", country: "싱가포르", lang: "영문", note: "Shopee 문법, delivery trust 강조" }
        ]
      },
      playbooks: [
        { id: "pb1", platform: "smartstore", type: "pdp", tone: "정제된 전환형", req: ["Hero", "베네핏", "스펙", "배송/반품", "FAQ"], banned: ["완치", "즉시 개선"], ver: "1.4.0" },
        { id: "pb2", platform: "threads", type: "social_post", tone: "대화형", req: ["훅", "본문", "CTA"], banned: ["100%"], ver: "1.2.1" },
        { id: "pb3", platform: "tiktok", type: "shortform", tone: "빠른 훅", req: ["3초 훅", "콘티", "CTA"], banned: ["기적"], ver: "1.1.4" }
      ],
      bundles: [
        { id: "bu1", name: "smartstore_pdp_global", label: "스마트스토어 PDP", type: "pdp", platform: "smartstore", ver: "2.6.3", score: 92, draft: "Role -> Situation -> Audience -> Inputs -> Steps -> Style -> Forbidden -> Output Format 순으로 상세페이지를 설계한다. Hero에는 구매 이유, 중간에는 스펙/옵션, 하단에는 배송/반품/FAQ를 둔다." },
        { id: "bu2", name: "threads_export_brand", label: "Threads / X", type: "social_post", platform: "threads", ver: "2.2.0", score: 89, draft: "훅 -> 설명 -> 반응 유도 -> CTA 순으로 짧게 설계한다. 감성은 유지하되, 과장 문구와 반복 카피는 제거한다." },
        { id: "bu3", name: "shortform_storyboard_tiktok", label: "Shortform Storyboard", type: "shortform", platform: "tiktok", ver: "1.9.7", score: 87, draft: "3초 훅 -> 15초 콘티 -> 샷리스트 -> 자막 -> CTA 순으로 작성한다. 첫 장면에서 제품의 구매 이유가 보이도록 한다." }
      ],
      outputs: [],
      gold: [],
      database: [],
      logs: [
        log("Workspace 생성", "VARELI Export Lab 워크스페이스를 초기화했습니다."),
        log("Prompt Bundle 로드", "PRD 2.0 기본 Prompt Bundle을 로드했습니다."),
        log("Playbook 배포", "핵심 플랫폼 Playbook 3종을 배포했습니다.")
      ]
    };
  }

  function log(title, desc) { return { id: uid("log"), title, desc, at: new Date().toISOString() }; }
  function uid(p) { return `${p}-${Math.random().toString(36).slice(2, 8)}`; }
  function load() { try { return JSON.parse(localStorage.getItem(KEY)) || init(); } catch { return init(); } }
  function init() { const s = seed(); seedOutputs(s); return s; }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function text(v) { return String(v || "").replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])); }
  function avg(a) { return a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0; }
  function locale() { return state.ui.locale || "ko"; }
  function l() { return locale(); }
  function t(key) {
    const dict = {
      ko: { help: "사용설명", new_output: "새 산출물", workspace: "작업공간", current_context: "현재 컨텍스트", role: "권한", current_user: "현재 사용자", review_gate: "자동 검수 체크리스트", no_issue: "문제 없음", approve: "승인 저장", duplicate: "새 버전 복제", gold: "Gold Sample 등록", regenerate: "재생성", save_edit: "수정 저장", lock: "잠금", unlock: "잠금 해제", generated: "생성 완료", guide: "가이드", locale: "언어", onboarding_done: "온보딩 완료", dashboard: "대시보드", onboarding: "온보딩", brand: "브랜드", products: "제품", studio: "스튜디오", repository: "보관함", playbooks: "플레이북", prompts: "프롬프트", quality: "품질", admin: "운영" },
      en: { help: "Guide", new_output: "New Output", workspace: "Workspace", current_context: "Current Context", role: "Role", current_user: "Current User", review_gate: "Automated Review Checklist", no_issue: "No Issues", approve: "Approve", duplicate: "Duplicate Version", gold: "Promote to Gold Sample", regenerate: "Regenerate", save_edit: "Save Edits", lock: "Lock", unlock: "Unlock", generated: "Generated", guide: "Guide", locale: "Language", onboarding_done: "Finish Onboarding", dashboard: "Dashboard", onboarding: "Onboarding", brand: "Brand", products: "Products", studio: "Studio", repository: "Repository", playbooks: "Playbooks", prompts: "Prompts", quality: "Quality", admin: "Ops" },
      ja: { help: "ガイド", new_output: "新規アウトプット", workspace: "ワークスペース", current_context: "現在のコンテキスト", role: "権限", current_user: "現在のユーザー", review_gate: "自動レビューチェック", no_issue: "問題なし", approve: "承認保存", duplicate: "新バージョン複製", gold: "Gold Sample 登録", regenerate: "再生成", save_edit: "修正保存", lock: "ロック", unlock: "ロック解除", generated: "生成完了", guide: "ガイド", locale: "言語", onboarding_done: "オンボーディング完了", dashboard: "ダッシュボード", onboarding: "オンボーディング", brand: "ブランド", products: "商品", studio: "スタジオ", repository: "保管庫", playbooks: "プレイブック", prompts: "プロンプト", quality: "品質", admin: "運営" },
      zh: { help: "使用说明", new_output: "新建产出物", workspace: "工作区", current_context: "当前上下文", role: "权限", current_user: "当前用户", review_gate: "自动审核清单", no_issue: "无问题", approve: "保存批准", duplicate: "复制新版本", gold: "登记 Gold Sample", regenerate: "重新生成", save_edit: "保存修改", lock: "锁定", unlock: "解除锁定", generated: "已生成", guide: "指南", locale: "语言", onboarding_done: "完成引导", dashboard: "仪表盘", onboarding: "引导", brand: "品牌", products: "产品", studio: "工作室", repository: "资料库", playbooks: "规则手册", prompts: "提示词", quality: "质量", admin: "运营" }
    };
    return (dict[locale()] && dict[locale()][key]) || dict.ko[key] || key;
  }
  function outputLabel(type) {
    const dict = {
      ko: { blog_post: "블로그 글", social_post: "X / Threads", pdp: "상세페이지", shortform: "쇼츠 / TikTok", faq: "FAQ / CS", influencer: "인플루언서 메시지", thumbnail: "유튜브 썸네일 프롬프트", banner: "상세페이지 배너 가이드" },
      en: { blog_post: "Blog Post", social_post: "X / Threads", pdp: "PDP", shortform: "Shortform", faq: "FAQ / CS", influencer: "Influencer Outreach", thumbnail: "YouTube Thumbnail Prompt", banner: "PDP Banner Guide" },
      ja: { blog_post: "ブログ記事", social_post: "X / Threads", pdp: "詳細ページ", shortform: "ショート動画", faq: "FAQ / CS", influencer: "提案メッセージ", thumbnail: "YouTube サムネイル", banner: "詳細ページバナーガイド" },
      zh: { blog_post: "博客文章", social_post: "X / Threads", pdp: "详情页", shortform: "短视频", faq: "FAQ / CS", influencer: "达人合作邀约", thumbnail: "YouTube 缩略图", banner: "详情页横幅指南" }
    };
    return (dict[locale()] && dict[locale()][type]) || OUT[type].label || type;
  }
  function labelText(key) {
    const dict = {
      ko: { smartstore: "네이버 스마트스토어", coupang: "쿠팡", shopee: "Shopee", blog: "블로그", youtube: "YouTube", threads: "Threads", x: "X", tiktok: "TikTok", shorts: "Shorts", faq: "FAQ", email: "이메일", approved: "승인 완료", in_review: "검수 중", revision_required: "수정 필요", generated: "생성 완료" },
      en: { smartstore: "Naver Smartstore", coupang: "Coupang", shopee: "Shopee", blog: "Blog", youtube: "YouTube", threads: "Threads", x: "X", tiktok: "TikTok", shorts: "Shorts", faq: "FAQ", email: "Email", approved: "Approved", in_review: "In Review", revision_required: "Needs Revision", generated: "Generated" },
      ja: { smartstore: "スマートストア", coupang: "クーパン", shopee: "Shopee", blog: "ブログ", youtube: "YouTube", threads: "Threads", x: "X", tiktok: "TikTok", shorts: "Shorts", faq: "FAQ", email: "メール", approved: "承認完了", in_review: "レビュー中", revision_required: "修正必要", generated: "生成完了" },
      zh: { smartstore: "Smartstore", coupang: "Coupang", shopee: "Shopee", blog: "博客", youtube: "YouTube", threads: "Threads", x: "X", tiktok: "TikTok", shorts: "Shorts", faq: "FAQ", email: "邮件", approved: "已批准", in_review: "审核中", revision_required: "需要修改", generated: "已生成" }
    };
    return (dict[locale()] && dict[locale()][key]) || LABELS[key] || key;
  }
  function ws() { return state.workspace; }
  function brand() { return ws().brand; }
  function product(id) { return ws().products.find((x) => x.id === id) || ws().products[0]; }
  function market(id) { return ws().markets.find((x) => x.id === id) || ws().markets[0]; }
  function bundle(type, platform) { return state.bundles.find((x) => x.type === type && x.platform === platform) || state.bundles.find((x) => x.type === type); }
  function playbook(type, platform) { return state.playbooks.find((x) => x.type === type && x.platform === platform) || state.playbooks.find((x) => x.type === type); }
  function wsOf(s) { return s.workspace; }
  function brandOf(s) { return wsOf(s).brand; }
  function productOf(s, id) { return wsOf(s).products.find((x) => x.id === id) || wsOf(s).products[0]; }
  function marketOf(s, id) { return wsOf(s).markets.find((x) => x.id === id) || wsOf(s).markets[0]; }
  function bundleOf(s, type, platform) { return s.bundles.find((x) => x.type === type && x.platform === platform) || s.bundles.find((x) => x.type === type); }
  function playbookOf(s, type, platform) { return s.playbooks.find((x) => x.type === type && x.platform === platform) || s.playbooks.find((x) => x.type === type); }
  function localeOf(s) { return s.ui.locale || "ko"; }
  function copyOf(s, key) {
    const dict = {
      ko: { story_intro: "브랜드 스토리와 제품 Truth를 분리해 설명하되 마지막에는 선물 경험으로 연결합니다.", cta: "브랜드 페이지에서 전체 구성과 옵션을 바로 확인해 보세요.", shipping: "배송", returns: "반품", gift: "선물처럼 바로 이해되는 구성.", detail: "상세페이지 옵션을 기준으로 선택 가능합니다.", thanks: "문의 주셔서 감사합니다." },
      en: { story_intro: "Separate the brand story from product truth, then reconnect them through a gifting context at the end.", cta: "See the full bundle and options on the brand page.", shipping: "Shipping", returns: "Returns", gift: "A bundle that reads instantly as a gift.", detail: "Please choose based on the options shown on the product page.", thanks: "Thank you for your inquiry." },
      ja: { story_intro: "ブランドストーリーと製品Truthを分けて説明し、最後にギフト体験としてつなげます。", cta: "ブランドページで構成とオプションを確認してください。", shipping: "配送", returns: "返品", gift: "ギフトとしてすぐ伝わる構成です。", detail: "詳細ページのオプションを基準に選択できます。", thanks: "お問い合わせありがとうございます。" },
      zh: { story_intro: "先区分品牌故事与产品事实信息，最后再用礼赠场景把它们连接起来。", cta: "请在品牌页面查看完整组合与选项。", shipping: "配送", returns: "退货", gift: "一眼就能理解为礼赠组合。", detail: "可按详情页中的选项进行选择。", thanks: "感谢您的咨询。" }
    };
    return (dict[localeOf(s)] && dict[localeOf(s)][key]) || dict.ko[key] || key;
  }

  function profileLabel(kind, value) {
    const labels = {
      brandTone: {
        "": "시장 기본값",
        premium: "프리미엄 감성형",
        trustworthy: "신뢰 중심형",
        trendy: "트렌디 경쾌형",
        practical: "실용 명확형",
        luxury_soft: "부드러운 럭셔리형"
      },
      audienceAge: {
        "": "시장 기본값",
        "18_24": "18~24세",
        "25_35": "25~35세",
        "35_49": "35~49세",
        b2b_buyers: "B2B 바이어"
      },
      expressionStyle: {
        "": "시장 기본값",
        friendly: "친근",
        polite: "공손",
        standard: "표준",
        expert: "전문가형"
      }
    };
    return (labels[kind] && labels[kind][value]) || value || "시장 기본값";
  }

  function marketDefaultProfile(m, b) {
    const note = `${m?.note || ""}`.toLowerCase();
    if ((m?.country || "").includes("일본") || note.includes("정갈")) {
      return { brandTone: "trustworthy", audienceAge: "25_35", expressionStyle: "polite" };
    }
    if ((m?.country || "").includes("싱가포르") || note.includes("delivery trust")) {
      return { brandTone: "practical", audienceAge: "25_35", expressionStyle: "standard" };
    }
    if (note.includes("portable luxury") || note.includes("giftable")) {
      return { brandTone: "premium", audienceAge: "25_35", expressionStyle: "friendly" };
    }
    if ((b?.tone || "").includes("프리미엄")) {
      return { brandTone: "premium", audienceAge: "25_35", expressionStyle: "standard" };
    }
    return { brandTone: "trustworthy", audienceAge: "25_35", expressionStyle: "standard" };
  }

  function resolveProfile(raw, m, b) {
    const fallback = marketDefaultProfile(m, b);
    return {
      brandTone: raw?.brandTone || fallback.brandTone,
      audienceAge: raw?.audienceAge || fallback.audienceAge,
      expressionStyle: raw?.expressionStyle || fallback.expressionStyle,
      usedFallback: !raw?.brandTone || !raw?.audienceAge || !raw?.expressionStyle
    };
  }

  function toneGuide(profile) {
    return {
      premium: "브랜드 감성과 프리미엄 무드를 유지하되 과장 없이 설명한다.",
      trustworthy: "단정하고 신뢰감 있게, 사실 정보와 근거를 우선 배치한다.",
      trendy: "트렌디하고 리듬감 있게 쓰되 가볍게 흘러가지 않게 조절한다.",
      practical: "구매 판단에 필요한 정보가 바로 보이도록 명확하게 쓴다.",
      luxury_soft: "부드럽고 세련된 톤으로 고급감을 유지하되 문장은 짧게 쓴다."
    }[profile.brandTone];
  }

  function audienceGuide(profile) {
    return {
      "18_24": "초반 훅과 직관적인 이점 설명을 우선한다.",
      "25_35": "트렌드 감도와 가치 소비, 브랜드 스토리를 함께 고려하는 독자를 상정한다.",
      "35_49": "신뢰, 사용 편의성, 재구매 이유를 더 분명히 설명한다.",
      b2b_buyers: "도입 유통 적합성, 배송/반품, 상품 구성 명확성을 우선한다."
    }[profile.audienceAge];
  }

  function mannerGuide(profile) {
    return {
      friendly: "문장은 친근하게, 그러나 판매 압박 없이 쓴다.",
      polite: "정중하고 안정적인 표현을 우선한다.",
      standard: "시장 평균에 맞는 표준적이고 무난한 톤으로 쓴다.",
      expert: "전문가가 검토한 듯 구조적이고 해설형으로 쓴다."
    }[profile.expressionStyle];
  }

  function profileSummary(profile) {
    return `${profileLabel("brandTone", profile.brandTone)} / ${profileLabel("audienceAge", profile.audienceAge)} / ${profileLabel("expressionStyle", profile.expressionStyle)}`;
  }

  function marketLangCode(m) {
    const raw = `${m?.lang || ""}`.toLowerCase();
    if (raw.includes("ja") || raw.includes("일")) return "ja";
    if (raw.includes("zh") || raw.includes("중")) return "zh";
    if (raw.includes("en") || raw.includes("영")) return "en";
    return "ko";
  }

  function localizedPhrase(code, map) {
    return map[code] || map.ko || "";
  }

  function benefitSummary(p) {
    return (p.features || []).slice(0, 3).join(", ");
  }

  function factSummary(p) {
    return [`스펙 ${p.specs.join(", ")}`, `가격 ${p.price}`, `배송 ${p.shipping}`, `반품 ${p.returns}`].join(" / ");
  }

  function seoKeywords(b, p, m) {
    return [b.name, p.name, m.country, p.cat, "giftable beauty", "refillable", "K-beauty export"].filter(Boolean);
  }

  function outputFormatGuide(type) {
    return {
      blog_post: "핵심 요약 -> SEO 제목 -> 메타 설명 -> 본문 -> CTA -> 이미지 프롬프트",
      social_post: "훅 -> 본문 -> 대안 카피 -> CTA -> 해시태그",
      pdp: "핵심 요약 -> Hero -> 베네핏 -> 스펙 -> 배송/반품 -> FAQ -> CTA",
      shortform: "3초 훅 -> 15초 콘티 -> 샷리스트 -> 자막 -> CTA -> 썸네일 방향",
      faq: "질문 분류 -> 표준 답변 -> 짧은 답변 -> 정중 버전 -> 에스컬레이션",
      influencer: "첫 제안 -> 팔로업 -> 협업 포인트 -> 제공 가치",
      thumbnail: "추천 툴 -> 구조화 프롬프트 -> 제작 순서 -> QA",
      banner: "추천 툴 -> 구조화 프롬프트 -> 제작 순서 -> QA"
    }[type] || "요약 -> 본문 -> CTA";
  }

  function guidanceFrame(type, s, p, m, brief, profile) {
    const b = brandOf(s);
    const keywords = seoKeywords(b, p, m).slice(0, 5).join(", ");
    return {
      role: `너는 ${outputLabel(type)} 전용 전략가이자 SEO/전환 최적화 기획자다.`,
      situation: `브랜드 톤을 유지하되 ${m.country} 시장에서 바로 사용할 수 있는 ${outputLabel(type)} 초안을 만든다. 모바일 가독성과 플랫폼 문법을 우선한다.`,
      audience: `${profileLabel("audienceAge", profile.audienceAge)} 사용자를 기본 독자로 보고, ${audienceGuide(profile)}`,
      inputs: [`제품명: ${p.name}`, `핵심 특징: ${benefitSummary(p)}`, `차별점: ${p.features[2] || p.features[0]}`, `시장 메모: ${m.note}`, `추가 요청: ${brief || "없음"}`],
      steps: [
        "입력된 제품 정보를 먼저 요약한다.",
        "플랫폼 구조와 표현 방식의 장점을 먼저 설계한다.",
        "제품 기능을 고객 혜택 중심으로 재해석한다.",
        "사용 장면과 구매 이유를 연결하는 스토리텔링 문단을 넣는다.",
        `SEO 키워드(${keywords})를 자연스럽게 분산 배치한다.`,
        "모바일에서 읽기 좋게 짧은 문단과 명확한 소제목을 사용한다.",
        `최종 결과를 ${outputFormatGuide(type)} 순으로 정리한다.`
      ],
      style: [toneGuide(profile), mannerGuide(profile), "과장 광고처럼 보이는 표현은 피하고 전문 용어는 바로 풀어서 설명한다."],
      forbidden: [
        "사실 확인이 안 되는 성능 표현을 단정하지 않는다.",
        "경쟁사를 직접 언급하거나 깎아내리지 않는다.",
        "불필요하게 긴 문단과 같은 표현 반복을 피한다."
      ]
    };
  }

  function buildBlogPack(s, p, m, brief, profile) {
    const b = brandOf(s);
    const code = marketLangCode(m);
    const keywords = seoKeywords(b, p, m);
    const guide = guidanceFrame("blog_post", s, p, m, brief, profile);
    const titles = {
      ko: [
        `${m.country} 시장에서 통하는 선물형 핸드케어: ${p.name}`,
        `${b.name} ${p.name}, 향과 리필 경험을 함께 제안하는 방법`,
        `선물, 향, 리필을 한 번에 설명하는 ${p.name} 블로그 구조`
      ],
      en: [
        `${p.name}: a gift-ready hand care set for ${m.country} buyers`,
        `How ${b.name} turns scent, refill, and gifting into one product story`,
        `A search-friendly blog angle for ${p.name} in the ${m.country} market`
      ],
      ja: [
        `${m.country}市場向けに伝える ${p.name} のギフト提案`,
        `${b.name} が香り・リフィル・ギフト体験をつなぐ方法`,
        `${p.name} を検索流入向けに紹介するブログ構成`
      ],
      zh: [
        `${p.name}：面向${m.country}市场的礼赠型手部护理套装`,
        `${b.name} 如何把香气、补充装与送礼场景连成一个故事`,
        `适合 ${m.country} 市场搜索流量的 ${p.name} 博客结构`
      ]
    };
    const outline = localizedPhrase(code, {
      ko: `역할: ${guide.role}\n검색 의도: ${keywords.slice(0, 4).join(", ")}\n글 각도: 브랜드 스토리보다 제품 Truth를 먼저 보여 주고, 마지막에 선물 경험으로 감성 연결\n타깃 독자: ${guide.audience}\n권장 구조: 문제 인식 -> 제품 사실 -> 사용 장면 -> 배송/반품 신뢰 -> CTA`,
      en: `Search intent: ${keywords.slice(0, 4).join(", ")}\nAngle: lead with product truth, then connect it back to the brand story through gifting\nStructure: reader pain point -> product facts -> use case -> shipping trust -> CTA`,
      ja: `検索意図: ${keywords.slice(0, 4).join(", ")}\n切り口: ブランド感性より先に製品Truthを提示し、最後にギフト体験として接続\n構成: 課題 -> 製品事実 -> 使用シーン -> 配送信頼 -> CTA`,
      zh: `搜索意图：${keywords.slice(0, 4).join(", ")}\n角度：先讲产品事实，再用送礼场景把品牌故事连起来\n结构：问题认知 -> 产品事实 -> 使用场景 -> 配送信任 -> CTA`
    });
    const body = localizedPhrase(code, {
      ko: `## 왜 이 제품이 지금 필요한가\n해외 바이어와 소비자는 감성적인 설명만으로는 구매를 결정하지 않습니다. ${m.country} 시장에서는 ${m.note} 같은 맥락이 중요하고, 제품이 어떤 상황에서 바로 이해되는지가 먼저 보입니다.\n\n## 제품 Truth 요약\n${p.name}는 ${benefitSummary(p)}를 중심으로 설계된 ${p.cat} 제품입니다. 특히 ${p.features[2] || p.features[0]}와 ${p.features[3] || p.features[1]} 조합은 선물성과 재사용성을 동시에 설명하기 좋습니다.\n\n- 핵심 스펙: ${p.specs.join(", ")}\n- 가격: ${p.price}\n- 배송 정책: ${p.shipping}\n- 반품 정책: ${p.returns}\n\n## ${m.country} 시장용 메시지 포인트\n1. 첫 문단에서는 브랜드 철학보다 구매 이유를 먼저 제시합니다.\n2. 두 번째 블록에서 향, 패키지, 리필 구조를 분리해 설명합니다.\n3. 배송과 반품 조건을 명확히 넣어 cross-border 구매 불안을 낮춥니다.\n\n## 톤앤매너 적용\n- 브랜드 톤: ${profileLabel("brandTone", profile.brandTone)}\n- 표현 방식: ${profileLabel("expressionStyle", profile.expressionStyle)}\n- 작성 규칙: ${guide.style.join(" / ")}\n\n## 브랜드 스토리 연결\n${b.story}\n이 문장은 감성 소개용으로 쓰되, 본문 중반 이후에 배치해 제품 정보보다 앞서지 않게 구성하는 것이 좋습니다.\n\n## 바로 활용 가능한 CTA\n상세페이지에서 향 옵션, 구성품, 배송 조건을 확인하고 현재 시장에 맞는 메시지 버전으로 바로 전환해 보세요.\n\n추가 요청 반영: ${brief}`,
      en: `## Why this product matters now\nBuyers do not convert on brand mood alone. In the ${m.country} market, ${m.note} matters because the product has to explain itself quickly in a cross-border buying context.\n\n## Product truth first\n${p.name} is a ${p.cat} offer built around ${benefitSummary(p)}. The strongest conversion angle is to separate the gift-ready experience from the refillable product logic so each buying reason is clear.\n\n- Specs: ${p.specs.join(", ")}\n- Price: ${p.price}\n- Shipping: ${p.shipping}\n- Returns: ${p.returns}\n\n## Messaging for ${m.country}\n1. Open with the buying reason, not the brand philosophy.\n2. Split scent, packaging, and refill logic into separate proof blocks.\n3. Add shipping and returns early to reduce trust friction.\n\n## Brand connection\n${b.story}\nUse the story after the factual product block so it supports the sale rather than delaying it.\n\n## CTA\nMove the reader to the detail page to compare scent options, bundle components, and shipping conditions.\n\nRequested angle: ${brief}`,
      ja: `## なぜ今この製品なのか\n海外向け販促では感性表現だけでは不十分です。${m.country}市場では ${m.note} のような文脈が重要で、製品がすぐ理解できることが優先されます。\n\n## 製品Truthを先に見せる\n${p.name} は ${benefitSummary(p)} を中心に設計された ${p.cat} 製品です。特に ${p.features[2] || p.features[0]} と ${p.features[3] || p.features[1]} の組み合わせは、ギフト性と再使用性を同時に伝えやすい構成です。\n\n- スペック: ${p.specs.join(", ")}\n- 価格: ${p.price}\n- 配送: ${p.shipping}\n- 返品: ${p.returns}\n\n## ${m.country} 市場向けメッセージ\n1. 冒頭ではブランド哲学より購入理由を先に提示します。\n2. 香り、パッケージ、リフィル構造を分けて説明します。\n3. 配送と返品条件を早めに入れて不安を下げます。\n\n## ブランドストーリー接続\n${b.story}\nこの説明は中盤以降に置き、事実情報の後押しとして使うのが効果的です。\n\n## CTA\n詳細ページで香り、構成、配送条件を確認できる導線を作ります。\n\n追加要望: ${brief}`,
      zh: `## 为什么现在适合推这款产品\n面向海外市场时，单靠品牌情绪无法转化。对 ${m.country} 市场来说，${m.note} 这样的语境更重要，用户需要很快看懂产品适合什么场景。\n\n## 先讲产品事实\n${p.name} 是围绕 ${benefitSummary(p)} 设计的 ${p.cat} 产品。尤其是 ${p.features[2] || p.features[0]} 与 ${p.features[3] || p.features[1]} 的组合，能够同时说明礼赠价值与可持续使用逻辑。\n\n- 规格: ${p.specs.join(", ")}\n- 价格: ${p.price}\n- 配送: ${p.shipping}\n- 退换: ${p.returns}\n\n## 面向 ${m.country} 的表达重点\n1. 开头先说购买理由，而不是品牌理念。\n2. 将香气、包装、补充装结构拆开说明。\n3. 提前放入配送和退换信息，降低跨境购买顾虑。\n\n## 与品牌故事连接\n${b.story}\n这部分建议放在中后段，让品牌故事服务于转化，而不是挡在事实信息前面。\n\n## CTA\n引导用户进入详情页比较香型、组合内容和配送条件。\n\n额外要求：${brief}`
    });
    const meta = localizedPhrase(code, {
      ko: `${b.name} ${p.name}의 향, 선물 구성, 리필 포인트를 ${m.country} 시장 관점에서 정리한 SEO형 소개 글.`,
      en: `An SEO-focused overview of ${b.name} ${p.name}, covering scent, gifting logic, refill value, and shipping trust for the ${m.country} market.`,
      ja: `${m.country} 市場向けに ${b.name} ${p.name} の香り、ギフト性、リフィル価値、配送信頼を整理したSEO紹介文。`,
      zh: `面向 ${m.country} 市场整理的 SEO 介绍文，涵盖 ${b.name} ${p.name} 的香气、礼赠价值、补充装逻辑与配送信任。`
    });
    const cta = localizedPhrase(code, {
      ko: `상세페이지에서 향 옵션, 구성품, 배송 조건을 확인하고 ${m.country} 시장용 메시지 버전을 바로 적용해 보세요.`,
      en: `Open the product page to compare scent options, bundle details, and shipping terms, then adapt the message for the ${m.country} market.`,
      ja: `詳細ページで香りの選択肢、構成内容、配送条件を確認し、${m.country} 向けメッセージにそのまま展開してください。`,
      zh: `进入详情页查看香型、组合内容与配送条件，并直接扩展为面向 ${m.country} 市场的传播文案。`
    });
    const imagePrompt = `${b.name} ${p.name}, editorial still life, premium giftable hand care, refillable case visible, ${m.country} market mood, clean ivory background, SEO blog hero image`;
    return [titles[code].join("\n"), outline, body, meta, cta, imagePrompt];
  }

  function buildSocialPack(s, p, m, brief, profile) {
    const b = brandOf(s);
    const code = marketLangCode(m);
    const guide = guidanceFrame("social_post", s, p, m, brief, profile);
    return [
      localizedPhrase(code, {
        ko: `${p.features[2] || p.features[0]}이 먼저 보이면 구매 이유가 빨라집니다.`,
        en: `When the gift-ready detail lands first, the buying reason becomes obvious.`,
        ja: `ギフトとして伝わる要素が先に見えると、購入理由が早く伝わります。`,
        zh: `当礼赠价值先被看见时，购买理由就会更快成立。`
      }),
      localizedPhrase(code, {
        ko: `${b.name} ${p.name}는 향만 강조하지 않습니다. ${p.features[2] || p.features[0]}, ${p.features[3] || p.features[1]}, 그리고 ${p.shipping} 기준의 배송 신뢰까지 함께 보여 주는 것이 전환에 더 가깝습니다.\n\n${m.country} 시장용 포인트: ${m.note}\n타깃/표현: ${profileSummary(profile)}\n작업 지시: ${guide.steps[1]} / ${guide.steps[2]}\n추가 요청 반영: ${brief}`,
        en: `${b.name} ${p.name} should not be framed as scent alone. Conversion improves when you separate the gift-ready bundle, the refillable product logic, and the shipping trust layer.\n\nMarket note for ${m.country}: ${m.note}\nRequested angle: ${brief}`,
        ja: `${b.name} ${p.name} は香りだけで見せるより、ギフト構成、リフィル構造、配送信頼を分けて伝える方が転換につながります。\n\n${m.country} 市場メモ: ${m.note}\n追加要望: ${brief}`,
        zh: `${b.name} ${p.name} 不应只讲香气。把礼赠组合、补充装逻辑和配送信任拆开表达，转化会更稳。\n\n${m.country} 市场备注：${m.note}\n额外要求：${brief}`
      }),
      localizedPhrase(code, {
        ko: `향을 파는 글이 아니라, 선물 이유와 재구매 이유를 동시에 보여 주는 카피로 바꿔 보세요.`,
        en: `Shift from “selling scent” to showing both the gifting reason and the repeat-purchase reason.`,
        ja: `香りを売る表現ではなく、ギフト理由と再購入理由を同時に見せるコピーに変えてみてください。`,
        zh: `不要只卖“香气”，而要同时写出送礼理由和复购理由。`
      }),
      localizedPhrase(code, {
        ko: `어떤 포인트가 가장 먼저 클릭을 만들 것 같은지 답글로 남겨 주세요.`,
        en: `Reply with the angle that would earn the first click in your market.`,
        ja: `最初のクリックにつながる角度はどれか、返信で教えてください。`,
        zh: `欢迎回复你认为最能带来首次点击的表达角度。`
      }),
      `#${b.name.replace(/\s+/g, "")} #${m.country.replace(/\s+/g, "")} #giftablebeauty #refillable #exportmarketing`
    ];
  }

  function buildPdpPack(s, p, m, brief, profile) {
    const b = brandOf(s);
    const code = marketLangCode(m);
    const guide = guidanceFrame("pdp", s, p, m, brief, profile);
    return [
      localizedPhrase(code, {
        ko: `${p.features[2] || p.features[0]}와 ${p.features[3] || p.features[1]}를 한 번에 보여 주는 ${b.name} ${p.name}`,
        en: `${b.name} ${p.name}: a gift-ready bundle that also makes the refill story clear`,
        ja: `${b.name} ${p.name}：ギフト性とリフィル価値を同時に伝える構成`,
        zh: `${b.name} ${p.name}：同时讲清礼赠价值与补充装逻辑的详情页开头`
      }),
      localizedPhrase(code, {
        ko: `1. 선물로 바로 이해되는 구성: ${p.features[2] || p.features[0]}\n2. 재사용 동기를 만드는 구조: ${p.features[3] || p.features[1]}\n3. 사용 순간이 연상되는 텍스처/향 설명: ${p.features[0]}\n4. ${m.country} 시장 적합성: ${m.note}\n5. 톤/연령/표현 적용: ${profileSummary(profile)}\n6. 작성 가이드: ${guide.style.join(" / ")}`,
        en: `1. Gift-ready logic: ${p.features[2] || p.features[0]}\n2. Reuse logic: ${p.features[3] || p.features[1]}\n3. Sensory value: ${p.features[0]}\n4. Market fit for ${m.country}: ${m.note}`,
        ja: `1. ギフト性: ${p.features[2] || p.features[0]}\n2. 再使用価値: ${p.features[3] || p.features[1]}\n3. 体験価値: ${p.features[0]}\n4. ${m.country} 市場適合性: ${m.note}`,
        zh: `1. 礼赠价值：${p.features[2] || p.features[0]}\n2. 复用价值：${p.features[3] || p.features[1]}\n3. 感官体验：${p.features[0]}\n4. ${m.country} 市场匹配点：${m.note}`
      }),
      localizedPhrase(code, {
        ko: `- 제품명: ${p.name}\n- 카테고리: ${p.cat}\n- 스펙: ${p.specs.join(", ")}\n- 가격: ${p.price}\n- 추가 요청 반영: ${brief}`,
        en: `- Product: ${p.name}\n- Category: ${p.cat}\n- Specs: ${p.specs.join(", ")}\n- Price: ${p.price}\n- Requested angle: ${brief}`,
        ja: `- 商品名: ${p.name}\n- カテゴリ: ${p.cat}\n- スペック: ${p.specs.join(", ")}\n- 価格: ${p.price}\n- 追加要望: ${brief}`,
        zh: `- 产品名：${p.name}\n- 类别：${p.cat}\n- 规格：${p.specs.join(", ")}\n- 价格：${p.price}\n- 补充要求：${brief}`
      }),
      localizedPhrase(code, {
        ko: `배송: ${p.shipping}\n반품: ${p.returns}\n운영 메모: cross-border 구매자는 배송 예상과 반품 가능 범위를 한 블록에서 바로 확인해야 합니다.`,
        en: `Shipping: ${p.shipping}\nReturns: ${p.returns}\nOps note: cross-border buyers need delivery timing and return scope in one easy block.`,
        ja: `配送: ${p.shipping}\n返品: ${p.returns}\n運用メモ: 越境購入者は配送目安と返品条件を同じブロックで確認できる必要があります。`,
        zh: `配送：${p.shipping}\n退换：${p.returns}\n运营备注：跨境购买者需要在同一信息块中快速看到物流时效与退换范围。`
      }),
      localizedPhrase(code, {
        ko: `Q. 이 제품은 어떤 고객에게 맞나요?\nA. 선물성, 향 경험, 리필 구조를 함께 찾는 고객에게 적합합니다.\n\nQ. 어떤 정보부터 보여 줘야 하나요?\nA. Hero에서는 선물 이유, 중간 블록에서는 스펙과 구성, 하단에서는 배송/반품을 배치하는 순서가 좋습니다.`,
        en: `Q. Who is this product for?\nA. Buyers looking for a giftable product with scent value and refill logic.\n\nQ. What should appear first on the page?\nA. Lead with the gift reason, then show specs and bundle details, then close trust gaps with shipping and returns.`,
        ja: `Q. どんな顧客向けですか？\nA. ギフト性、香り体験、リフィル構造を一緒に求める顧客向けです。\n\nQ. どの情報を先に見せるべきですか？\nA. Heroで購入理由、中盤で仕様と構成、下部で配送・返品を提示する順序が有効です。`,
        zh: `Q. 这款产品适合谁？\nA. 适合重视礼赠价值、香气体验和补充装逻辑的用户。\n\nQ. 页面上应先展示什么？\nA. 先放购买理由，其次展示规格与组合信息，最后用物流与退换建立信任。`
      }),
      localizedPhrase(code, {
        ko: `지금 상세페이지에서 향 옵션, 구성품, 배송 조건을 확인하고 ${m.country} 시장용 카피 버전으로 전환해 보세요.`,
        en: `Use the detail page to compare scent options, bundle details, and shipping terms for the ${m.country} market.`,
        ja: `${m.country} 市場向けに、香り・構成・配送条件を確認できる詳細ページ導線を配置してください。`,
        zh: `引导用户查看详情页中的香型、组合与配送条件，并切换为 ${m.country} 市场版文案。`
      }),
      localizedPhrase(code, {
        ko: `향 / 선물 / 리필 / 배송 신뢰를 네 개의 카드 블록으로 분리해 보여 주는 배너 카피`,
        en: `Banner copy direction: split scent, gifting, refill logic, and shipping trust into four quick cards`,
        ja: `バナー文案方向: 香り・ギフト・リフィル・配送信頼を4つのカードで分けて見せる`,
        zh: `横幅文案方向：把香气、礼赠、补充装和配送信任拆成四个卡片块`
      })
    ];
  }

  function buildShortformPack(s, p, m, brief, profile) {
    const b = brandOf(s);
    const code = marketLangCode(m);
    const guide = guidanceFrame("shortform", s, p, m, brief, profile);
    return [
      localizedPhrase(code, {
        ko: `0~3초: ${p.features[2] || p.features[0]}이 먼저 보이는 언박싱 컷으로 시작`,
        en: `0-3 sec: open on the detail that makes the bundle instantly feel gift-ready`,
        ja: `0〜3秒: ギフト性が一目で伝わるディテールから開始`,
        zh: `0-3秒：先用一眼就能看懂礼赠价值的细节镜头开场`
      }),
      localizedPhrase(code, {
        ko: `0-3초 훅: 패키지 전체 실루엣 + 키링 디테일\n4-7초: 향 옵션 3종을 빠르게 스와이프\n8-11초: 리필 구조를 손동작으로 설명\n12-15초: 배송/구성 확인 CTA\n타깃/표현: ${profileSummary(profile)}\n연출 메모: ${brief}\n스타일 가이드: ${guide.style.join(" / ")}`,
        en: `0-3 sec hook: full package silhouette + key charm detail\n4-7 sec: fast scent option swipe\n8-11 sec: show the refill structure by hand\n12-15 sec: CTA to check bundle + shipping\nDirection note: ${brief}`,
        ja: `0〜3秒: パッケージ全体 + キーチャーム\n4〜7秒: 香り3種を素早く提示\n8〜11秒: 手元でリフィル構造を見せる\n12〜15秒: 構成と配送確認CTA\n演出メモ: ${brief}`,
        zh: `0-3秒：整套包装 + 挂件细节\n4-7秒：快速切换3种香型\n8-11秒：用手部动作说明补充装结构\n12-15秒：引导查看组合与物流\n拍摄备注：${brief}`
      }),
      localizedPhrase(code, {
        ko: `- 탑샷 1컷\n- 패키지 클로즈업 2컷\n- 향 옵션 스와치 3컷\n- 리필 구조 설명 컷 1컷\n- CTA 엔드카드 1컷`,
        en: `- 1 top shot\n- 2 package closeups\n- 3 scent option swatches\n- 1 refill explanation shot\n- 1 CTA end card`,
        ja: `- トップショット 1컷\n- パッケージ寄り 2컷\n- 香り見せ 3컷\n- リフィル説明 1컷\n- CTAエンドカード 1컷`,
        zh: `- 顶视镜头 1个\n- 包装特写 2个\n- 香型展示 3个\n- 补充装说明 1个\n- CTA 尾卡 1个`
      }),
      localizedPhrase(code, {
        ko: `자막 1: 선물처럼 바로 이해되는 구성\n자막 2: 향 옵션을 고르는 재미\n자막 3: 리필 구조로 오래 쓰는 경험\n자막 4: ${m.country} 배송 정보는 상세페이지에서 확인`,
        en: `Caption 1: A bundle that reads like a gift instantly\nCaption 2: Scent options worth comparing\nCaption 3: Refill logic that supports repeat use\nCaption 4: Check ${m.country} shipping details on the product page`,
        ja: `字幕1: ギフトとしてすぐ伝わる構成\n字幕2: 香りを選ぶ楽しさ\n字幕3: 長く使えるリフィル構造\n字幕4: ${m.country} 向け配送情報は詳細ページで確認`,
        zh: `字幕1：一眼就懂的礼赠组合\n字幕2：值得比较的香型选择\n字幕3：支持长期使用的补充装逻辑\n字幕4：${m.country} 物流信息请看详情页`
      }),
      localizedPhrase(code, {
        ko: `${m.country} 시장용 상세페이지에서 향 옵션과 배송 조건을 바로 확인하세요.`,
        en: `Check scent options and shipping terms for the ${m.country} market on the detail page.`,
        ja: `${m.country} 向け詳細ページで香りと配送条件を確認してください。`,
        zh: `请在 ${m.country} 市场版详情页中查看香型与物流条件。`
      }),
      `${b.name} shortform thumbnail, ${p.name}, gift-ready unboxing, refill detail visible, clean premium beauty visual`
    ];
  }

  function buildFaqPack(s, p, m, brief, profile) {
    const code = marketLangCode(m);
    const guide = guidanceFrame("faq", s, p, m, brief, profile);
    return [
      localizedPhrase(code, {
        ko: `배송 문의 / 구성 문의 / 향 옵션 문의 / B2B 대량 문의`,
        en: `Shipping / bundle details / scent options / B2B bulk inquiry`,
        ja: `配送 / 構成 / 香りオプション / B2B大量問い合わせ`,
        zh: `物流咨询 / 组合内容 / 香型选择 / B2B 批量咨询`
      }),
      localizedPhrase(code, {
        ko: `${p.name}는 ${p.shipping} 기준으로 발송되며, ${p.returns} 조건 안에서 반품 안내가 가능합니다. 구성과 향 옵션은 상세페이지 기준으로 안내해 주세요.\n응답 톤: ${profileSummary(profile)}\n응답 규칙: ${guide.style.join(" / ")}\n${brief}`,
        en: `${p.name} ships on a ${p.shipping} timeline and follows ${p.returns} for returns. Please guide customers using the product page as the source of truth for bundle contents and scent options. ${brief}`,
        ja: `${p.name} は ${p.shipping} を基準に発送し、返品は ${p.returns} に従って案内します。構成と香りオプションは詳細ページ基準で案内してください。${brief}`,
        zh: `${p.name} 按 ${p.shipping} 的时效发货，退换请按 ${p.returns} 说明。组合与香型选项请以详情页信息为准。${brief}`
      }),
      localizedPhrase(code, {
        ko: `${p.shipping} 기준으로 발송됩니다. 상세페이지에서 구성과 향 옵션을 먼저 확인해 주세요.`,
        en: `It ships on a ${p.shipping} timeline. Please check the detail page first for bundle details and scent options.`,
        ja: `${p.shipping} を基準に発送します。構成と香りは詳細ページを先にご確認ください。`,
        zh: `按 ${p.shipping} 发货。请先在详情页确认组合与香型选项。`
      }),
      localizedPhrase(code, {
        ko: `문의 주셔서 감사합니다. 현재 ${p.shipping} 기준으로 배송되며, 반품은 ${p.returns} 정책에 따라 안내됩니다. 상세페이지 기준으로 향 옵션과 구성품을 함께 확인해 주시면 가장 정확합니다.`,
        en: `Thank you for your inquiry. The current shipping timeline is ${p.shipping}, and returns follow ${p.returns}. The most accurate reference for scent options and bundle components is the detail page.`,
        ja: `お問い合わせありがとうございます。現在の配送目安は ${p.shipping}、返品は ${p.returns} 方針に沿って案内しています。香りと構成品は詳細ページ確認が最も正確です。`,
        zh: `感谢咨询。当前配送时效为 ${p.shipping}，退换按 ${p.returns} 政策执行。香型与组合内容请以详情页信息为准。`
      }),
      localizedPhrase(code, {
        ko: `재고 확인, 대량 주문, 현지 유통 문의가 들어오면 담당자에게 이관합니다.`,
        en: `Escalate stock checks, bulk order questions, and local distribution inquiries to the account owner.`,
        ja: `在庫確認、大量注文、現地流通の問い合わせは担当者へエスカレーションします。`,
        zh: `库存确认、批量订单与当地分销咨询请升级给负责人处理。`
      })
    ];
  }

  function buildInfluencerPack(s, p, m, brief, profile) {
    const b = brandOf(s);
    const code = marketLangCode(m);
    const guide = guidanceFrame("influencer", s, p, m, brief, profile);
    return [
      localizedPhrase(code, {
        ko: `안녕하세요. ${m.country} 시장에서 감각적인 선물형 뷰티 콘텐츠를 만드는 크리에이터를 찾고 있어 연락드립니다. ${b.name}의 ${p.name}는 ${p.features[2] || p.features[0]}와 ${p.features[3] || p.features[1]}를 함께 보여 주기 좋은 제품입니다.`,
        en: `Hello, we are reaching out because we are looking for creators who make refined, giftable beauty content for the ${m.country} market. ${b.name}'s ${p.name} works well because it shows both the gift-ready angle and the refillable product logic clearly.`,
        ja: `こんにちは。${m.country} 市場向けに、感度の高いギフト系ビューティーコンテンツを制作される方を探しており、ご連絡しました。${b.name} の ${p.name} はギフト性とリフィル価値を同時に見せやすい製品です。`,
        zh: `您好。我们正在寻找适合 ${m.country} 市场的礼赠型美妆内容创作者，因此联系您。${b.name} 的 ${p.name} 能同时展示礼赠价值与补充装逻辑，非常适合内容合作。`
      }),
      localizedPhrase(code, {
        ko: `지난 메시지에 이어 간단히 한 번 더 공유드립니다. 이 제품은 언박싱, 향 비교, 리필 구조 설명까지 한 영상 안에서 자연스럽게 연결되는 점이 강점입니다.`,
        en: `Following up with one more short note: the product works especially well for content that combines unboxing, scent comparison, and a refill explanation in one flow.`,
        ja: `追って簡単に補足いたします。本製品は、開封、香り比較、リフィル説明を1本の流れで見せやすい点が強みです。`,
        zh: `补充说明一下，这款产品特别适合把开箱、香型比较和补充装说明放进同一条内容里。`
      }),
      localizedPhrase(code, {
        ko: `- 선물 개봉 순간이 강함\n- 향/패키지/리필 구조를 분리해 설명 가능\n- ${m.country} 타깃용 cross-border 배송 신뢰 메시지 연결 가능\n- 타깃/표현: ${profileSummary(profile)}\n- 추가 요청: ${brief}\n- 스타일 가이드: ${guide.style.join(" / ")}`,
        en: `- Strong gifting/unboxing moment\n- Scent, packaging, and refill logic can be separated clearly\n- Shipping trust can be connected for the ${m.country} market\n- Requested angle: ${brief}`,
        ja: `- ギフト開封の瞬間が強い\n- 香り・パッケージ・リフィルを分けて説明できる\n- ${m.country} 向けに配送信頼も接続しやすい\n- 追加要望: ${brief}`,
        zh: `- 开箱礼赠瞬间强\n- 可将香型、包装和补充装逻辑分开表达\n- 适合接入 ${m.country} 市场的物流信任信息\n- 补充要求：${brief}`
      }),
      localizedPhrase(code, {
        ko: `브랜드 감성만 강조하기보다, 실제 사용 장면과 선물 이유를 함께 보여 주는 협업이 가장 적합합니다.`,
        en: `The best-fit collaboration is not mood-only content but content that also shows the real use case and gifting reason.`,
        ja: `ブランド感性だけでなく、使用シーンとギフト理由を一緒に見せる企画が最適です。`,
        zh: `最适合的合作不是只讲品牌氛围，而是同时展示使用场景与送礼理由。`
      })
    ];
  }

  function buildGuidePack(s, o) {
    const b = brandOf(s);
    const p = productOf(s, o.productId);
    const m = marketOf(s, o.marketId);
    const code = marketLangCode(m);
    const profile = o.profile || resolveProfile(o.rawProfile, m, b);
    const frame = guidanceFrame(o.type, s, p, m, o.brief, profile);
    const prompt = localizedPhrase(code, {
      ko: `1. 역할 정의\n${frame.role}\n\n2. 상황 설명\n${frame.situation}\n\n3. 목표 독자 정의\n${frame.audience}\n\n4. 입력값 정의\n${frame.inputs.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n5. 작업 지시\n${frame.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\n6. 스타일 가이드\n${frame.style.map((item) => `- ${item}`).join("\n")}\n\n7. 금지사항\n${frame.forbidden.map((item) => `- ${item}`).join("\n")}\n\n8. 출력 형식\n${outputFormatGuide(o.type)}\n\n브랜드 톤앤매너 선택값: ${profileLabel("brandTone", profile.brandTone)}\n사용자 연령대 선택값: ${profileLabel("audienceAge", profile.audienceAge)}\n표현 방식 선택값: ${profileLabel("expressionStyle", profile.expressionStyle)}\n시장 메모: ${m.note}\n금지표현: ${b.banned.join(", ")}`,
      en: `Role: specialist for creating ${outputLabel(o.type)} assets for the ${m.country} market\nBrand truth: ${b.story}\nBrand tone: ${b.tone}\nProduct truth: ${factSummary(p)}\nMarket note: ${m.note}\nBanned claims: ${b.banned.join(", ")}\nRequested task: ${o.brief}\nOutput rules:\n1. Design the platform structure first.\n2. Lead with buying reasons and facts before mood.\n3. Include shipping, returns, and option details without exaggeration.\n4. Provide one final draft and two alternatives.`,
      ja: `役割: ${m.country} 市場向け ${outputLabel(o.type)} 制作の専門家\nブランドTruth: ${b.story}\nブランドトーン: ${b.tone}\n製品Truth: ${factSummary(p)}\n市場メモ: ${m.note}\n禁止表現: ${b.banned.join(", ")}\n依頼内容: ${o.brief}\n出力条件:\n1. 先にプラットフォーム構造を設計する。\n2. 感性より購入理由と事実情報を優先する。\n3. 配送・返品・オプション情報を誇張なく含める。\n4. 最終案1つと代替案2つを提示する。`,
      zh: `角色：面向 ${m.country} 市场的 ${outputLabel(o.type)} 制作专家\n品牌事实：${b.story}\n品牌语气：${b.tone}\n产品事实：${factSummary(p)}\n市场备注：${m.note}\n禁用表达：${b.banned.join(", ")}\n任务要求：${o.brief}\n输出规则：\n1. 先设计平台结构。\n2. 先讲购买理由和事实，再讲情绪氛围。\n3. 无夸张地包含物流、退换和选项信息。\n4. 给出 1 个主方案和 2 个备选方案。`
    });
    return {
      tools: [
        "ChatGPT / GPT-5 for structured copy drafting",
        "Claude for tone cleanup and long-form consistency",
        "Gemini or Grok for alternative angle comparison"
      ],
      checklist: [
        "브랜드 Truth와 제품 Truth를 먼저 정리했는가",
        "시장/언어/플랫폼 조건을 명시했는가",
        "브랜드 톤, 연령대, 표현 방식을 선택했는가 또는 시장 기본값으로 두었는가",
        "금지표현과 배송/반품 정보를 함께 넣었는가",
        "최종안 외에 대안안 2개를 받도록 요청했는가"
      ],
      prompt,
      steps: [
        "Step 1. 제품 Truth, 배송/반품, 시장 메모를 입력값으로 정리합니다.",
        "Step 2. 아래 프롬프트를 복사해 외부 LLM 또는 디자인 도구에 넣습니다.",
        "Step 3. 첫 결과가 나오면 플랫폼 구조 누락과 금지표현 여부를 먼저 확인합니다.",
        "Step 4. 두 번째 라운드에서는 헤드라인, CTA, 배송 신뢰 문장만 별도로 재요청합니다.",
        "Step 5. 최종안과 대안안 2개를 비교해 가장 전환력이 높은 버전을 채택합니다."
      ],
      qa: [
        `첫 3초 또는 첫 문단에서 ${p.name}의 구매 이유가 바로 보이는가`,
        `브랜드 감성과 제품 사실이 섞이지 않고 블록 단위로 분리되어 있는가`,
        `배송, 반품, 옵션, 문의 포인트가 누락되지 않았는가`,
        `${m.country} 시장의 표현 관습과 톤이 자연스러운가`
      ]
    };
  }

  function seedOutputs(s) {
    mkOutput(s, { type: "blog_post", platform: "blog", productId: "p1", marketId: "m1", brief: "일상을 디자인하는 향이라는 메시지를 중심으로 작성", status: "approved" });
    mkOutput(s, { type: "pdp", platform: "shopee", productId: "p1", marketId: "m3", brief: "gift-ready와 delivery trust를 함께 보여주세요.", status: "in_review" });
    mkOutput(s, { type: "shortform", platform: "tiktok", productId: "p2", marketId: "m1", brief: "팝업 기프트 세트 런칭용 15초 훅", status: "revision_required", bad: "피부를 즉시 개선하는 향기 루틴" });
    mkGuide(s, { type: "thumbnail", platform: "youtube", productId: "p1", marketId: "m1", brief: "향 / 선물 / 리필 포인트가 동시에 보이게", status: "approved" });
  }

  function gen(s, type, p, m, brief, profile) {
    const base = {
      blog_post: buildBlogPack(s, p, m, brief, profile),
      social_post: buildSocialPack(s, p, m, brief, profile),
      pdp: buildPdpPack(s, p, m, brief, profile),
      shortform: buildShortformPack(s, p, m, brief, profile),
      faq: buildFaqPack(s, p, m, brief, profile),
      influencer: buildInfluencerPack(s, p, m, brief, profile)
    };
    return (base[type] || []).map((content, i) => ({
      id: uid("sec"), name: OUT[type].sections[i] || `Section ${i + 1}`, content, locked: false, human: false, score: 0, issues: []
    }));
  }

  function score(type, sections, bannedSource) {
    const banned = [...(bannedSource || []), "즉시 개선"].map((x) => x.toLowerCase());
    sections.forEach((s) => {
      let sc = 58;
      const t = s.content.toLowerCase();
      const issues = [];
      if (s.content.length > 40) sc += 8;
      if (s.content.length > 90) sc += 5;
      if (s.content.length > 150) sc += 4;
      if (s.content.length < 24) { sc -= 18; issues.push("내용 밀도 부족"); }
      if (/cta|CTA|문의|확인|보기|댓글|check|link|comment/.test(s.name + s.content) === false && /CTA|cta/.test(s.name)) { sc -= 12; issues.push("CTA 약함"); }
      banned.forEach((b) => { if (b && t.includes(b)) { sc -= 38; issues.push(`금지표현: ${b}`); } });
      if (/배송|shipping|반품|return|스펙|spec|구성/.test(s.content)) sc += 5;
      if (/사실|truth|스펙|spec|배송|shipping|faq/.test(s.content)) sc += 3;
      if (s.human) sc += 5;
      s.score = Math.max(45, Math.min(s.human ? 92 : 86, sc));
      s.issues = issues;
    });
    const overall = avg(sections.map((x) => x.score));
    const blocked = sections.some((x) => x.issues.some((i) => i.includes("금지표현")));
    const rubric = {
      truth: Math.max(45, overall - (blocked ? 16 : 6)),
      brand: Math.max(45, overall - 8),
      platform: Math.max(45, overall - 10),
      completeness: Math.max(45, overall - 7)
    };
    return { overall: blocked ? Math.min(overall, 64) : overall, state: blocked ? "revision_required" : overall >= 85 ? "in_review" : "revision_required", rubric };
  }

  function buildChecklist(row) {
    return [
      { id: uid("c"), label: "금지표현 없음", done: !row.sections.some((s) => s.issues.some((i) => i.includes("금지표현"))) },
      { id: uid("c"), label: "섹션 최소 길이 충족", done: row.sections.every((s) => s.content.length >= 24) },
      { id: uid("c"), label: "핵심 사실 정보 포함", done: row.sections.some((s) => /배송|shipping|반품|return|스펙|spec/.test(s.content)) },
      { id: uid("c"), label: "점수 85점 이상", done: row.score >= 85 },
      { id: uid("c"), label: "플랫폼 핵심 섹션 포함", done: row.sections.length >= OUT[row.type].sections.length }
    ];
  }

  function mkOutput(s, o) {
    const p = productOf(s, o.productId);
    const m = marketOf(s, o.marketId);
    const profile = o.profile || resolveProfile(o.rawProfile, m, brandOf(s));
    const sections = gen(s, o.type, p, m, o.brief, profile);
    if (o.bad) sections[3].content += `\n${o.bad}`;
    const q = score(o.type, sections, brandOf(s).banned);
    const row = { id: uid("out"), originId: o.originId || null, version: o.version || 1, mode: "generate", type: o.type, platform: o.platform, productId: o.productId, marketId: o.marketId, brief: o.brief, rawProfile: o.rawProfile || null, profile, status: o.status || q.state, score: q.overall, rubric: q.rubric, sections, checklist: [], at: new Date().toISOString(), bundle: bundleOf(s, o.type, o.platform)?.ver || "1.0.0", playbook: playbookOf(s, o.type, o.platform)?.ver || "1.0.0" };
    row.checklist = buildChecklist(row);
    s.outputs.unshift(row);
    if (o.status === "approved") s.gold.push({ id: uid("g"), outputId: row.id, note: "브랜드 스토리와 판매 포인트 균형이 좋은 승인본" });
    if (!s.ui.activeOutput) s.ui.activeOutput = row.id;
  }

  function mkGuide(s, o) {
    const profile = o.profile || resolveProfile(o.rawProfile, marketOf(s, o.marketId), brandOf(s));
    const guide = buildGuidePack(s, { ...o, profile });
    s.outputs.unshift({
      id: uid("out"), originId: o.originId || null, version: o.version || 1, mode: "guide", type: o.type, platform: o.platform, productId: o.productId, marketId: o.marketId, brief: o.brief, rawProfile: o.rawProfile || null, profile, status: o.status || "generated", at: new Date().toISOString(),
      guide
    });
  }

  function ready() {
    const k = [
      ws().company && ws().business,
      brand().story && brand().tone,
      ws().products.length,
      ws().markets.length,
      brand().banned.length,
      brand().assets.length,
      ws().products.some((x) => x.evidence.length)
    ].filter(Boolean).length;
    return Math.round((k / 7) * 100);
  }

  function current() { return state.outputs.find((x) => x.id === state.ui.activeOutput); }
  function row(o) {
    const p = product(o.productId);
    return `<div class="row"><button class="row-main" data-open="${o.id}"><strong>${text(outputLabel(o.type))} · ${text(p.name)}</strong><span>${text(labelText(o.platform))} · ${text(labelText(o.status))} · v${o.version || 1}</span></button><div class="row-meta">${o.mode === "generate" ? `<span class="score ${o.score >= 85 ? "ok" : o.score >= 70 ? "mid" : "bad"}">${o.score}</span>` : `<span class="pill">${t("guide")}</span>`}</div></div>`; }

  function render() {
    const v = state.ui.view;
    document.getElementById("app").innerHTML = `
      <div class="shell">
        <aside class="rail">
          <div class="lockup"><div class="mark">EMH</div><div><div class="eyebrow">Export Marketing Hub</div><h1>승인형 산출물 운영</h1></div></div>
          <div class="ws-card"><div class="eyebrow">${t("workspace")}</div><strong>${text(ws().company)}</strong><span>${text(brand().name)} · ${text(ws().project)}</span><div class="bar"><span style="width:${ready()}%"></span></div><small>${ready()}% ready</small></div>
          <nav class="nav">${NAV.map(([id]) => `<button type="button" class="${v === id ? "active" : ""}" data-nav="${id}">${t(id)}</button>`).join("")}</nav>
          <div class="rail-note"><span class="pill role-pill">${text(state.me.role)}</span><p>${t("current_user")}: ${text(state.me.name)}</p><p>Build ${BUILD}</p></div>
        </aside>
        <div class="stage">
          <header class="top"><div><div class="eyebrow">${t("current_context")}</div><strong>${text(ws().company)}</strong><span class="chip">${text(brand().name)}</span></div><div class="top-actions"><label class="inline-select"><span>${t("locale")}</span><select name="locale" data-setting><option value="ko" ${locale()==="ko"?"selected":""}>KO</option><option value="en" ${locale()==="en"?"selected":""}>EN</option><option value="ja" ${locale()==="ja"?"selected":""}>JP</option><option value="zh" ${locale()==="zh"?"selected":""}>ZH</option></select></label><button type="button" class="ghost" data-nav="help">${t("help")}</button><button type="button" class="ghost" data-nav="onboarding">${t("onboarding")}</button><button type="button" class="ghost" data-nav="studio">${t("new_output")}</button></div></header>
          <div class="grid"><main>${views[v]()}</main><aside>${aside(v)}</aside></div>
          <div class="mobile">${NAV.slice(0, 5).map(([id]) => `<button type="button" class="${v === id ? "active" : ""}" data-nav="${id}">${t(id)}</button>`).join("")}</div>
        </div>
      </div>
      ${toast ? `<div class="toast">${text(toast)}</div>` : ""}
    `;
  }

  const views = {
    dashboard: () => `
      <section class="hero"><div><div class="eyebrow">${/VARELI/i.test(ws().company) ? "Sample Mode" : "Workspace"}</div><h2>수출기업이 바로 사용할 수 있는 마케팅 운영 허브</h2><p>온보딩, 산출물 생성, 자동 검수, 승인 저장, 새 버전 복제, 테스트 종료 후 보관까지 한 흐름으로 운영할 수 있게 구성했습니다.</p></div><div class="actions"><button class="primary" data-nav="studio">첫 산출물 생성</button><button class="secondary" data-nav="onboarding">온보딩 보완</button><button class="ghost" type="button" data-archive-demo>테스트 종료 후 DB 보관 및 초기화</button></div></section>
      <section class="cards">${card("브랜드 자산 준비도", `${ready()}%`, "온보딩 핵심 필드 기준")}${card("승인 전환율", `${Math.round((state.outputs.filter(x => x.status === "approved").length / Math.max(1, state.outputs.length)) * 100)}%`, "실제 승인된 결과물 비율")}${card("평균 품질 점수", `${avg(state.outputs.filter(x => x.mode === "generate").map(x => x.score))}점`, "자동 검수 기준")}${card("Gold Sample", `${state.gold.length}개`, "재사용 가능한 승인 우수본")}</section>
      <section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">승인 대기</div><h3>승인 대기</h3></div></div>${state.outputs.filter(x => x.status === "in_review").slice(0, 3).map(row).join("") || empty("현재 승인 대기 항목이 없습니다.")}</article><article class="panel"><div class="head"><div><div class="eyebrow">최근 결과물</div><h3>최근 결과물</h3></div></div>${state.outputs.slice(0, 4).map(row).join("")}</article></section>
      <section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">샘플 테스트 종료</div><h3>로컬 DB 보관</h3></div><span class="pill">${state.database.length}</span></div><div class="mini">VARELI 샘플 테스트가 끝나면 현재 회사, 브랜드, 제품, 시장, 결과물 전체를 로컬 DB에 보관하고 모든 입력을 빈 값으로 리셋할 수 있습니다.</div>${state.database[0] ? `<div class="mini big"><strong>${text(state.database[0].workspace.company || "Untitled Workspace")}</strong><span>${new Date(state.database[0].archivedAt).toLocaleString()}</span></div>` : empty("아직 보관된 테스트가 없습니다.")}<div class="actions"><button class="primary" type="button" data-archive-demo>DB 보관 및 초기화</button></div></article><article class="panel"><div class="head"><div><div class="eyebrow">빠른 안내</div><h3>처음 쓰는 순서</h3></div></div><div class="mini">1. 온보딩에서 회사, 브랜드, 제품, 시장을 먼저 입력합니다.</div><div class="mini">2. 스튜디오에서 출력물과 플랫폼을 선택하고 생성합니다.</div><div class="mini">3. 결과 화면에서 자동 체크리스트와 점수를 보고 재생성/수정합니다.</div><div class="mini">4. 자동 체크리스트가 모두 PASS면 승인 저장합니다.</div><div class="actions"><button class="secondary" data-nav="help">상세 사용설명 보기</button></div></article></section>
    `,
    help: () => helpView(),
    onboarding: () => onboard(),
    brand: () => brandView(),
    products: () => productView(),
    studio: () => studioView(),
    repository: () => repoView(),
    playbooks: () => playbookView(),
    prompts: () => promptView(),
    quality: () => qualityView(),
    admin: () => adminView(),
    result: () => resultView(),
    guide_result: () => guideView()
  };

  function card(t, v, d) { return `<article class="metric"><div class="eyebrow">${text(t)}</div><strong>${text(v)}</strong><p>${text(d)}</p></article>`; }
  function empty(t) { return `<div class="empty"><p>${text(t)}</p></div>`; }
  function helpView() {
    return `<section class="panel"><div class="head"><div><div class="eyebrow">사용설명</div><h2>처음부터 끝까지 쓰는 상세 운영 가이드</h2><p>이 프로그램의 목적은 “그럴듯한 한 편의 글”이 아니라 플랫폼별로 바로 사용할 수 있는 Asset Pack을 만드는 것입니다. 아래 순서를 그대로 따라가면 블로그, 상세페이지, 쇼츠, FAQ, 아웃리치 메시지를 같은 Truth에서 분기 생산할 수 있습니다.</p></div></div><div class="stack"><div class="mini big"><strong>1. 대시보드에서 현재 상태를 먼저 읽습니다.</strong><span>좌측은 작업공간과 권한, 중앙은 생성/승인 흐름, 우측은 현재 브랜드 운영 요약을 보여 줍니다. 샘플 상태에서는 VARELI 데이터가 들어 있고, 실제 운영을 시작할 때는 테스트 종료 후 DB 보관 및 초기화를 누르면 됩니다.</span></div><div class="mini big"><strong>2. 온보딩에서는 “예쁜 소개”보다 Truth를 먼저 넣습니다.</strong><span>회사명, 업종, 프로젝트를 넣은 뒤 브랜드 스토리와 톤을 정리합니다. 예를 들어 VARELI라면 “향과 오브제를 통해 일상을 디자인하는 라이프스타일 뷰티 브랜드”처럼 정체성을 적고, 금지표현에는 “치료, 완치, 즉시 개선”처럼 실제로 쓰면 안 되는 표현을 넣습니다.</span></div><div class="mini big"><strong>3. 제품 단계에서는 판매문구가 아니라 사실 정보로 채웁니다.</strong><span>제품명, 카테고리, 핵심 특징, 스펙, 가격, 배송, 반품을 구조적으로 넣습니다. 좋은 입력 예시는 “30ml x 3”, “EMS / DHL 3~7영업일”, “미개봉 7일 이내”처럼 검수 가능한 사실형 문장입니다. 이 정보가 부족하면 어떤 LLM을 붙여도 결과 품질이 흔들립니다.</span></div><div class="mini big"><strong>4. 시장 단계에서는 국가별 메시지 우선순위를 분리합니다.</strong><span>예를 들어 미국은 “giftable beauty, portable luxury”, 일본은 “정갈한 톤, 선물 문화 강조”, 싱가포르는 “Shopee 문법, delivery trust 강조”처럼 적습니다. 같은 제품이라도 국가 메모가 다르면 블로그 제목, 상세페이지 Hero, 쇼츠 훅이 달라져야 정상입니다.</span></div><div class="mini big"><strong>5. Studio에서는 산출물 유형과 플랫폼을 함께 고릅니다.</strong><span>블로그를 고르면 검색 유입과 SEO 구조가 중요하고, 상세페이지를 고르면 Hero, 스펙, 배송/반품, FAQ 완결성이 더 중요합니다. 쇼츠를 고르면 3초 훅과 샷리스트, 자막 가독성이 핵심입니다. 여기에 브랜드 톤앤매너, 사용자 연령대, 표현 방식을 추가로 고를 수 있고, 비워 두면 시장 기본값이 자동 적용됩니다. 추가 요청에는 “향/선물/키링을 분리해 설명”, “일본 시장용으로 정갈하게”, “배송 신뢰를 앞에 배치”처럼 구체적 지시를 넣습니다.</span></div><div class="mini big"><strong>6. Generate Here 결과는 섹션별로 읽고 고칩니다.</strong><span>예를 들어 블로그 결과라면 제목 3안, 개요, 본문, 메타, CTA, 이미지 프롬프트가 나옵니다. 본문이 약하면 본문만 재생성하고, 배송/반품 문구가 맞으면 그 섹션은 잠금합니다. 이렇게 해야 좋은 섹션은 보존하고 약한 섹션만 개선할 수 있습니다.</span></div><div class="mini big"><strong>7. 점수는 “합격증”이 아니라 수정 우선순위입니다.</strong><span>우측 Review Gate에는 Truth, Brand, Platform, Completeness 점수와 자동 체크리스트가 나옵니다. 예를 들어 Truth가 낮으면 스펙, 배송, 반품, 옵션 정보가 약한 것이고, Platform이 낮으면 채널 구조나 CTA가 맞지 않는 경우가 많습니다. 점수만 높고 결과가 약하게 느껴지면, 먼저 어떤 섹션이 왜 점수를 받았는지 같이 봐야 합니다.</span></div><div class="mini big"><strong>8. 새 버전 복제는 비교 실험용입니다.</strong><span>상단의 “새 버전 복제”를 누르면 현재 결과를 기준으로 새 작업본이 만들어집니다. 예를 들어 같은 상세페이지를 미국용과 일본용으로 나누거나, 블로그 글을 “브랜드 스토리형”과 “검색 전환형” 두 버전으로 운영할 때 씁니다. 복제 후에는 각 버전의 CTA, Hero, 제목 전략을 따로 수정해 비교하면 됩니다.</span></div><div class="mini big"><strong>9. Guide Me는 외부 도구 작업을 더 잘 시키기 위한 화면입니다.</strong><span>유튜브 썸네일이나 배너처럼 외부 툴이 더 적합한 작업은 Guide Me를 선택합니다. 여기서는 추천 툴, 복사 가능한 프롬프트, 입력 체크리스트, 제작 순서, QA 기준이 함께 나옵니다. 이 기능의 목적은 “LLM에게 그냥 써 줘”가 아니라 “구조화된 요청으로 더 좋은 결과를 끌어내기”입니다.</span></div><div class="mini big"><strong>10. 실제 예시: 미국 시장용 블로그 글 만들기</strong><span>온보딩에 제품 Truth와 미국 시장 메모를 넣고, Studio에서 블로그/Blog/미국/해당 제품을 선택합니다. 톤은 프리미엄 감성형, 연령대는 25~35세, 표현 방식은 친근으로 두거나 비워 두면 미국 시장 기본값이 적용됩니다. 추가 요청에 “선물성, 리필 구조, 배송 신뢰를 분리하고 SEO 관점 제목 3개로 시작”이라고 쓰면 결과에서는 제목 3안, 검색 의도 개요, 정보형 본문, 메타디스크립션, CTA, 대표 이미지 프롬프트가 같이 나옵니다. 그 후 본문만 재생성해 “브랜드 스토리형”과 “검색 전환형” 두 버전을 비교할 수 있습니다.</span></div><div class="mini big"><strong>11. 실제 예시: Shopee 상세페이지 만들기</strong><span>Studio에서 상세페이지/Shopee/싱가포르를 선택하고 추가 요청에 “delivery trust를 앞에 배치하고 옵션과 배송/반품을 명확히”라고 적습니다. 그러면 Hero는 구매 이유 중심, Benefit 블록은 기능 분리형, 스펙은 사실형, 배송/반품은 신뢰형, FAQ는 구매 불안 해소형으로 읽으면 좋습니다. 여기서 약한 부분만 재생성하고 나머지는 잠금하면 훨씬 안정적으로 완성됩니다.</span></div><div class="mini big"><strong>12. 승인과 보관</strong><span>자동 체크리스트가 모두 PASS이고 점수가 기준 이상이면 승인 저장합니다. 승인 후에는 Gold Sample로 등록해 다음 유사 작업의 기준 예시로 재사용할 수 있습니다. 테스트가 끝나면 DB 보관 및 초기화를 눌러 현재 샘플 데이터를 보관하고 빈 워크스페이스에서 실제 회사 데이터를 입력하면 됩니다.</span></div></div></section>`;
  }

  function onboard() {
    const s = state.ui.step, b = brand();
    const pd = state.ui.draft.product;
    const md = state.ui.draft.market;
    const forms = {
      1: `<form data-form="workspace"><div class="why">왜 묻는가: 워크스페이스 기본 컨텍스트가 정리되어야 브랜드/시장 오버레이와 연결됩니다.</div>${field("company", "회사명", ws().company)}${field("business", "업종", ws().business)}${field("project", "프로젝트", ws().project)}<button class="secondary">기본 정보 저장</button></form>`,
      2: `<form data-form="brandCore"><div class="why">왜 묻는가: 브랜드 톤과 금지표현은 모든 결과물의 공통 기준입니다.</div>${area("story", "브랜드 스토리", b.story)}${area("tone", "톤앤매너", b.tone)}${area("key", "키메시지", b.key)}<button class="secondary">Brand Truth 저장</button></form>`,
      3: `<div class="stack">${ws().products.map((p) => `<div class="mini">${text(p.name)}<span>${text(p.cat)}</span></div>`).join("")}<form data-form="addProduct"><div class="why">입력 중에도 값이 유지됩니다. 제품 추가를 누르면 실제 Product Truth에 반영됩니다.</div><label class="field"><span>제품명</span><input name="name" value="${text(pd.name)}" data-draft-group="product"></label><label class="field"><span>카테고리</span><input name="cat" value="${text(pd.cat)}" data-draft-group="product"></label><label class="field"><span>핵심 특징</span><textarea name="features" data-draft-group="product">${text(pd.features)}</textarea></label><label class="field"><span>스펙</span><textarea name="specs" data-draft-group="product">${text(pd.specs)}</textarea></label><button class="secondary">제품 추가</button></form></div>`,
      4: `<div class="stack">${ws().markets.map((m) => `<div class="mini">${text(m.country)}<span>${text(m.lang)} · ${text(m.note)}</span></div>`).join("")}<form data-form="addMarket"><div class="why">시장 입력 중에도 값이 유지됩니다. 시장 추가를 누르면 실제 Market Overlay에 반영됩니다.</div><label class="field"><span>국가</span><input name="country" value="${text(md.country)}" data-draft-group="market"></label><label class="field"><span>언어</span><input name="lang" value="${text(md.lang)}" data-draft-group="market"></label><label class="field"><span>현지화 메모</span><textarea name="note" data-draft-group="market">${text(md.note)}</textarea></label><button class="secondary">시장 추가</button></form></div>`,
      5: `<form data-form="phrases">${area("preferred", "선호 표현", b.preferred.join(", "))}${area("banned", "금지 표현", b.banned.join(", "))}<button class="secondary">표현 정책 저장</button></form>`,
      6: `<form data-form="asset">${field("name", "자산명", "")}${field("type", "자산 유형", "")}<button class="secondary">자산 추가</button></form>`,
      7: `<div class="preview"><div class="mini big"><strong>${text(b.name)}</strong><p>${text(b.story)}</p></div><div class="mini big"><strong>Readiness</strong><p>제품 ${ws().products.length}개 · 시장 ${ws().markets.length}개 · 금지표현 ${b.banned.length}개 · 자산 ${b.assets.length}개</p></div><button class="primary" data-done="onboarding">${t("onboarding_done")}</button></div>`
    };
    return `<section class="panel"><div class="head"><div><div class="eyebrow">온보딩</div><h2>Workspace Onboarding Wizard</h2><p>회사 · 브랜드 · 제품 · 시장 · 금지표현을 단계형으로 수집합니다.</p></div><span class="pill">Step ${s} / 7</span></div><div class="steps">${[1,2,3,4,5,6,7].map((n) => `<button class="${s===n?"active":""}" data-step="${n}">${n}</button>`).join("")}</div>${forms[s]}<div class="actions end"><button class="ghost" data-step="${Math.max(1,s-1)}" ${s===1?"disabled":""}>이전</button><button class="primary" data-step="${Math.min(7,s+1)}" ${s===7?"disabled":""}>다음</button></div></section>`;
  }

  function brandView() {
    const b = brand();
    return `<section class="panel"><div class="head"><div><div class="eyebrow">브랜드</div><h2>Company & Brand Profile</h2><p>브랜드 톤, 선호 표현, 금지 표현, 용어집을 지속적으로 관리합니다.</p></div></div><form data-form="brandProfile">${field("name", "브랜드명", b.name)}${area("story", "브랜드 스토리", b.story)}${area("tone", "톤앤매너", b.tone)}${area("key", "키메시지", b.key)}${area("preferred", "선호 표현", b.preferred.join(", "))}${area("banned", "금지 표현", b.banned.join(", "))}<button class="primary">브랜드 프로필 저장</button></form></section><section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">Glossary</div><h3>고정 번역어</h3></div></div>${b.glossary.map((g) => `<div class="mini">${text(g.source)} → ${text(g.target)}<span>${text(g.locale)} ${g.locked ? "· Locked" : ""}</span></div>`).join("")}</article><article class="panel"><div class="head"><div><div class="eyebrow">Assets</div><h3>브랜드 자산</h3></div></div>${b.assets.map((a) => `<div class="mini">${text(a.name)}<span>${text(a.type)}</span></div>`).join("")}</article></section>`;
  }

  function productView() {
    const p = product(state.ui.productId);
    return `<section class="split products"><article class="panel"><div class="head"><div><div class="eyebrow">제품</div><h2>Product Truth Library</h2></div></div>${ws().products.map((x) => `<button class="row-main ${x.id===p.id?"sel":""}" data-product="${x.id}"><strong>${text(x.name)}</strong><span>${text(x.cat)} · ${text(x.price)}</span></button>`).join("")}</article><article class="panel"><div class="head"><div><div class="eyebrow">Selected Product</div><h2>${text(p.name)}</h2></div><span class="pill">${p.evidence.length} evidence</span></div><form data-form="productEdit"><input type="hidden" name="id" value="${p.id}">${field("name", "제품명", p.name)}${field("cat", "카테고리", p.cat)}${area("features", "핵심 특징", p.features.join(", "))}${area("specs", "스펙", p.specs.join(", "))}${field("price", "가격", p.price)}${field("shipping", "배송 정보", p.shipping)}${field("returns", "반품 정책", p.returns)}<button class="primary">Product Truth 저장</button></form><div class="sub"><strong>근거자료</strong>${p.evidence.map((e) => `<div class="mini">${text(e)}</div>`).join("")}</div></article></section>`;
  }

  function studioView() {
    const st = state.ui.studio, def = OUT[st.type], pb = playbook(st.type, st.platform), bu = bundle(st.type, st.platform);
    const resolved = resolveProfile(st, market(st.marketId), brand());
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${t("studio")}</div><h2>Output Studio</h2><p>Generate Here와 Guide Me를 같은 스튜디오에서 전환합니다. 브랜드 톤, 연령대, 표현 방식을 선택하지 않으면 시장 기본값이 자동 적용됩니다.</p></div><span class="pill">${def.mode === "generate" ? "Generate Here" : "Guide Me"}</span></div><div class="studio"><div class="subcard"><div class="eyebrow">Output Type</div><div class="choices">${Object.entries(OUT).map(([k, v]) => `<button class="${st.type===k?"active":""}" data-type="${k}"><strong>${text(outputLabel(k))}</strong><span>${v.mode==="generate"?"Generate":"Guide"}</span></button>`).join("")}</div>${select("platform", "플랫폼", def.platforms, st.platform, (id) => labelText(id))}${select("marketId", "시장", ws().markets.map((m) => m.id), st.marketId, (id) => `${market(id).country} · ${market(id).lang}`)}${select("productId", "제품", ws().products.map((p) => p.id), st.productId, (id) => product(id).name)}${studioSelect("brandTone", "브랜드 톤앤매너", PROFILE_OPTIONS.brandTone, st.brandTone, (value) => profileLabel("brandTone", value))}${studioSelect("audienceAge", "사용자 연령대", PROFILE_OPTIONS.audienceAge, st.audienceAge, (value) => profileLabel("audienceAge", value))}${studioSelect("expressionStyle", "표현 방식", PROFILE_OPTIONS.expressionStyle, st.expressionStyle, (value) => profileLabel("expressionStyle", value))}${area("brief", "추가 요청", st.brief, true)}<div class="actions"><button class="primary" data-run="${def.mode}">${def.mode==="generate"?"Asset Pack 생성":"Toolchain Pack 생성"}</button></div></div><div class="subcard"><div class="eyebrow">Preview</div><h3>예상 구성</h3><div class="chips">${def.sections.map((s) => `<span class="chip">${text(s)}</span>`).join("")}</div><div class="meta"><strong>적용 프로필</strong><p>${profileSummary(resolved)}</p></div><div class="meta"><strong>Playbook</strong><p>${pb ? `${labelText(pb.platform)} · v${pb.ver}` : "기본 룰"}</p></div><div class="meta"><strong>Prompt Bundle</strong><p>${bu ? `${bu.label} · v${bu.ver}` : "기본 번들"}</p></div><div class="meta"><strong>생성 원칙</strong><p>Role, Situation, Audience, Inputs, Steps, Style, Forbidden, Output Format 순서로 프롬프트를 구성합니다.</p></div></div></div></section>`;
  }

  function resultView() {
    const o = current(); if (!o || o.mode !== "generate") return `<section class="panel">${empty("선택된 Generate Here 결과가 없습니다.")}</section>`;
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${t("generated")}</div><h2>${text(outputLabel(o.type))} · ${text(product(o.productId).name)}</h2><p>${text(labelText(o.platform))} · Prompt v${text(o.bundle)} · Playbook v${text(o.playbook)}</p></div><span class="score ${o.score>=85?"ok":o.score>=70?"mid":"bad"}">${o.score}점</span></div><div class="mini action-note"><strong>적용 프로필</strong><span>${text(profileSummary(o.profile || resolveProfile(o.rawProfile, market(o.marketId), brand())))}</span><span>현재 버전 ${o.version || 1}${o.originId ? ` · 원본 ${o.originId}` : ""}</span></div><div class="mini action-note"><strong>${t("duplicate")}</strong><span>현재 결과를 기준으로 검수 상태를 다시 계산한 새 작업본을 만듭니다. 국가별 현지화, 카피 실험, 담당자별 분기 작업에 사용합니다.</span></div><div class="actions"><button class="primary" data-approve="${o.id}">${t("approve")}</button><button class="secondary" data-duplicate="${o.id}">${t("duplicate")}</button><button class="ghost" data-gold="${o.id}">${t("gold")}</button></div></section><section class="stack">${o.sections.slice().sort((a,b)=>a.score-b.score).map((s) => `<article class="panel sec ${s.locked?"locked":""}"><div class="head"><div><div class="eyebrow">${text(s.name)}</div><h3>${text(s.name)}</h3></div><div>${s.human?`<span class="pill">${l()==="ko"?"수정 반영됨":l()==="en"?"Edited":l()==="ja"?"修正反映済み":"已人工修改"}</span>`:""}<span class="score ${s.score>=85?"ok":s.score>=70?"mid":"bad"}">${s.score}</span></div></div><div class="issues">${s.issues.length?s.issues.map((i)=>`<span class="issue">${text(i)}</span>`).join(""):`<span class="issue ok">${t("no_issue")}</span>`}</div><form data-form="sectionEdit"><input type="hidden" name="outputId" value="${o.id}"><input type="hidden" name="sectionId" value="${s.id}"><textarea class="result-textarea" name="content" ${s.locked?"readonly":""}>${text(s.content)}</textarea><div class="actions section-actions"><button class="ghost" type="button" data-lock="${o.id}:${s.id}">${s.locked?t("unlock"):t("lock")}</button><button class="secondary" type="button" data-regen="${o.id}:${s.id}" ${s.locked?"disabled":""}>${t("regenerate")}</button><button class="primary" ${s.locked?"disabled":""}>${t("save_edit")}</button></div></form></article>`).join("")}</section>`;
  }

  function guideView() {
    const o = current(); if (!o || o.mode !== "guide") return `<section class="panel">${empty("선택된 Guide Me 결과가 없습니다.")}</section>`;
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${t("guide")}</div><h2>${text(outputLabel(o.type))} · ${text(product(o.productId).name)}</h2></div><span class="pill">${text(labelText(o.status))}</span></div><div class="split"><article class="subcard"><div class="eyebrow">${l()==="ko"?"추천 툴":l()==="en"?"Recommended Tools":l()==="ja"?"推奨ツール":"推荐工具"}</div>${o.guide.tools.map((t) => `<div class="mini">${text(t)}</div>`).join("")}<div class="sub"><strong>${l()==="ko"?"입력 체크리스트":l()==="en"?"Input Checklist":l()==="ja"?"入力チェック":"输入清单"}</strong>${(o.guide.checklist || []).map((item) => `<div class="mini">${text(item)}</div>`).join("")}</div></article><article class="subcard"><div class="eyebrow">${l()==="ko"?"프롬프트":l()==="en"?"Prompt":l()==="ja"?"プロンプト":"提示词"}</div><textarea readonly id="guidePrompt" class="result-textarea compact">${text(o.guide.prompt)}</textarea><div class="actions"><button class="secondary" data-copy="guidePrompt">${l()==="ko"?"복사":l()==="en"?"Copy":l()==="ja"?"コピー":"复制"}</button></div></article></div><article class="panel"><div class="head"><div><div class="eyebrow">${l()==="ko"?"제작 순서 & QA":l()==="en"?"Process & QA":l()==="ja"?"制作手順 & QA":"制作步骤与 QA"}</div><h3>Toolchain Pack</h3></div></div><ol>${o.guide.steps.map((s) => `<li>${text(s)}</li>`).join("")}</ol><ul>${o.guide.qa.map((q) => `<li>${text(q)}</li>`).join("")}</ul></article></section>`;
  }

  function repoView() {
    const f = state.ui.repo;
    const items = state.outputs.filter((o) => (f.status === "all" || o.status === f.status) && (f.platform === "all" || o.platform === f.platform) && (f.type === "all" || o.type === f.type) && (!f.q || `${o.type} ${product(o.productId).name} ${o.brief}`.toLowerCase().includes(f.q.toLowerCase())));
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${t("repository")}</div><h2>Outputs Repository</h2></div></div><div class="filters">${repoSelect("status", ["all","approved","in_review","revision_required"], f.status)}${repoSelect("platform", ["all",...new Set(state.outputs.map((o)=>o.platform))], f.platform, (x)=>x==="all"?"전체":labelText(x))}${repoSelect("type", ["all",...Object.keys(OUT)], f.type, (x)=>x==="all"?"전체":outputLabel(x))}<label class="field grow"><span>검색</span><input name="q" value="${text(f.q)}" data-repo></label></div>${items.map(row).join("") || empty("조건에 맞는 결과물이 없습니다.")}</section><section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">Gold Samples</div><h3>승인 우수본</h3></div></div>${state.gold.map((g)=>`<div class="mini">${text((state.outputs.find((o)=>o.id===g.outputId)?.type && outputLabel(state.outputs.find((o)=>o.id===g.outputId).type)) || "Sample")}<span>${text(g.note)}</span></div>`).join("") || empty("등록된 Gold Sample이 없습니다.")}</article><article class="panel"><div class="head"><div><div class="eyebrow">${t("duplicate")}</div><h3>어디서 어떻게 쓰나</h3></div></div><div class="mini">결과 상세 화면 상단의 ‘새 버전 복제’ 버튼을 누르면 현재 결과를 기준으로 새 작업본이 생성됩니다.</div><div class="mini">복제된 버전은 보관함과 품질 센터에서 별도 결과물처럼 검색하고 비교할 수 있습니다.</div><div class="mini">국가별 버전 분기, 카피 실험, 담당자별 수정 분기 작업에 사용하세요.</div></article></section>`;
  }

  function playbookView() {
    const pb = state.playbooks.find((x)=>x.id===state.ui.playbookId) || state.playbooks[0];
    return `<section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">${t("playbooks")}</div><h2>Platform Playbook Center</h2></div></div>${state.playbooks.map((x)=>`<button class="row-main ${x.id===pb.id?"sel":""}" data-playbook="${x.id}"><strong>${text(labelText(x.platform))}</strong><span>${text(outputLabel(x.type))} · v${text(x.ver)}</span></button>`).join("")}</article><article class="panel"><div class="head"><div><div class="eyebrow">Rule Set</div><h2>${text(labelText(pb.platform))}</h2><p>플레이북은 톤, 연령대, 표현 방식 선택값과 함께 읽혀야 합니다. 선택하지 않으면 시장 기본 프로필이 적용됩니다.</p></div><span class="pill">v${text(pb.ver)}</span></div><form data-form="playbookEdit"><input type="hidden" name="id" value="${pb.id}">${field("tone","권장 톤",pb.tone)}${area("req","필수 섹션",pb.req.join(", "))}${area("banned","금지 표현",pb.banned.join(", "))}<button class="primary">플레이북 저장</button></form></article></section>`;
  }

  function promptView() {
    const bu = state.bundles.find((x)=>x.id===state.ui.bundleId) || state.bundles[0];
    return `<section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">프롬프트</div><h2>Prompt Stack Studio</h2></div></div>${state.bundles.map((x)=>`<button class="row-main ${x.id===bu.id?"sel":""}" data-bundle="${x.id}"><strong>${text(x.label)}</strong><span>${text(x.name)} · v${text(x.ver)}</span></button>`).join("")}</article><article class="panel"><div class="head"><div><div class="eyebrow">Layer Draft</div><h2>${text(bu.label)}</h2><p>모든 산출물은 Role, Situation, Audience, Inputs, Steps, Style, Forbidden, Output Format 프레임으로 프롬프트를 설계합니다.</p></div><span class="score ${bu.score>=85?"ok":bu.score>=70?"mid":"bad"}">${bu.score}</span></div><form data-form="bundleEdit"><input type="hidden" name="id" value="${bu.id}">${area("draft","Draft Prompt",bu.draft)}<button class="primary">Draft 저장</button></form><div class="actions"><button class="secondary" data-test="${bu.id}">샌드박스 테스트</button><button class="ghost" data-deploy="${bu.id}">승인 배포</button></div></article></section>`;
  }

  function qualityView() {
    const gens = state.outputs.filter((x)=>x.mode==="generate");
    return `<section class="cards">${card("평균 품질 점수", `${avg(gens.map((x)=>x.score))}점`, "자동 검수 기준")}${card("승인 가능", `${gens.filter((x)=>x.score>=85 && x.checklist.every((c)=>c.done)).length}개`, "85점 이상 + 체크리스트 PASS")}${card("수정 필요", `${gens.filter((x)=>x.status==="revision_required").length}개`, "70점 미만 또는 자동 검수 실패")}${card("플레이북 영향", `${state.playbooks.length}종`, "운영 중인 룰셋")}</section><section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">${t("quality")}</div><h2>Quality Center</h2></div></div>${gens.map((o)=>`<div class="row"><button class="row-main" data-open="${o.id}"><strong>${text(outputLabel(o.type))}</strong><span>${text(product(o.productId).name)} · ${text(labelText(o.status))}</span></button><div class="row-meta"><span class="score ${o.score>=85?"ok":o.score>=70?"mid":"bad"}">${o.score}</span></div></div>`).join("")}</article><article class="panel"><div class="head"><div><div class="eyebrow">점수 기준</div><h2>Rubric 설명</h2></div></div><div class="mini"><strong>Truth</strong><span>제품 사실, 스펙, 배송/반품 정보 반영 여부</span></div><div class="mini"><strong>Brand</strong><span>브랜드 톤, 선호 표현, 금지 표현 준수 여부</span></div><div class="mini"><strong>Platform</strong><span>플랫폼 구조, CTA, 채널 적합성</span></div><div class="mini"><strong>Completeness</strong><span>섹션 누락 없이 충분한 길이와 정보 밀도 유지</span></div><div class="sub"><strong>85점 이상 + 체크리스트 전부 PASS</strong><div class="mini">승인 가능</div><div class="mini">70~84점은 수정 후 재검토</div><div class="mini">69점 이하 또는 금지표현 포함 시 재작성 필요</div></div></article></section>`;
  }

  function adminView() {
    return `<section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">운영</div><h2>Quality Ops Console</h2></div></div><div class="mini">금지 주장: ${text(brand().banned.join(", "))}</div><div class="mini">운영 중 Playbook: ${state.playbooks.length}종</div><div class="mini">운영 중 Bundle: ${state.bundles.length}종</div><div class="mini">로컬 DB 보관 기록: ${state.database.length}건</div><div class="mini">샘플 테스트 종료 시 현재 데이터 전체를 보관한 뒤 빈 워크스페이스로 전환할 수 있습니다.</div><div class="actions"><button class="primary" type="button" data-archive-demo>DB 보관 및 초기화</button></div></article><article class="panel"><div class="head"><div><div class="eyebrow">Audit Log</div><h2>감사 추적</h2></div></div>${state.logs.map((l)=>`<div class="mini"><strong>${text(l.title)}</strong><span>${text(l.desc)}</span></div>`).join("")}</article></section><section class="panel"><div class="head"><div><div class="eyebrow">로컬 DB</div><h3>보관된 테스트 기록</h3></div></div>${state.database.map((d)=>`<div class="mini big"><strong>${text(d.workspace.company || "Untitled Workspace")}</strong><span>${new Date(d.archivedAt).toLocaleString()}</span><span>${d.outputs.length}개 결과물 보관</span></div>`).join("") || empty("보관된 테스트가 없습니다.")}</section>`;
  }

  function aside(v) {
    const o = current();
    if (v === "result" && o && o.mode === "generate") return `<section class="panel sticky"><div class="eyebrow">Review Gate</div><h3>${t("review_gate")}</h3>${o.checklist.map((c)=>`<div class="check"><span>${text(c.label)}</span><span class="${c.done?"score ok":"score bad"}">${c.done?"PASS":"FAIL"}</span></div>`).join("")}<div class="sub"><strong>적용 프로필</strong><div class="mini">브랜드 톤<span>${text(profileLabel("brandTone", (o.profile || {}).brandTone))}</span></div><div class="mini">연령대<span>${text(profileLabel("audienceAge", (o.profile || {}).audienceAge))}</span></div><div class="mini">표현 방식<span>${text(profileLabel("expressionStyle", (o.profile || {}).expressionStyle))}</span></div></div><div class="sub"><strong>Score Rubric</strong><div class="mini">Truth<span>${o.rubric.truth}</span></div><div class="mini">Brand<span>${o.rubric.brand}</span></div><div class="mini">Platform<span>${o.rubric.platform}</span></div><div class="mini">Completeness<span>${o.rubric.completeness}</span></div></div><div class="sub"><strong>점수 기준</strong><div class="mini">85점 이상 + 체크리스트 전부 PASS<span>승인 가능</span></div><div class="mini">70~84점<span>수정 후 재검토</span></div><div class="mini">69점 이하 또는 금지표현 포함<span>재작성 필요</span></div></div><div class="sub"><strong>금지표현</strong>${brand().banned.map((x)=>`<span class="chip">${text(x)}</span>`).join("")}</div></section>`;
    return `<section class="panel sticky"><div class="eyebrow">운영 컨텍스트</div><h3>${text(brand().name)} 운영 요약</h3><div class="mini">브랜드 톤<span>${text(brand().tone)}</span></div><div class="mini">핵심 금지표현<span>${text(brand().banned.slice(0,3).join(", "))}</span></div><div class="mini">다음 권장 액션<span>온보딩 보완 · 승인본 확보 · Gold Sample 확장</span></div><div class="sub"><strong>샘플 테스트 종료</strong><div class="mini">VARELI 테스트가 끝나면 현재 데이터 전체를 로컬 DB에 보관하고 빈 워크스페이스로 초기화할 수 있습니다.</div><div class="actions"><button class="ghost" type="button" data-archive-demo>DB 보관 및 초기화</button></div></div></section>`;
  }

  function field(name, label, value) { return `<label class="field"><span>${text(label)}</span><input name="${name}" value="${text(value)}"></label>`; }
  function area(name, label, value, studio) { return `<label class="field"><span>${text(label)}</span><textarea name="${name}" ${studio?"data-studio":""}>${text(value)}</textarea></label>`; }
  function select(name, label, arr, value, map) { return `<label class="field"><span>${text(label)}</span><select name="${name}" data-studio>${arr.map((x)=>`<option value="${x}" ${x===value?"selected":""}>${text(map?map(x):(labelText(x)||x))}</option>`).join("")}</select></label>`; }
  function studioSelect(name, label, arr, value, map) { return `<label class="field"><span>${text(label)}</span><select name="${name}" data-studio>${arr.map((x)=>`<option value="${x}" ${x===value?"selected":""}>${text(map?map(x):x)}</option>`).join("")}</select></label>`; }
  function repoSelect(name, arr, value, map) { return `<label class="field"><span>${text(name)}</span><select name="${name}" data-repo>${arr.map((x)=>`<option value="${x}" ${x===value?"selected":""}>${text(map?map(x):(x==="all"?"전체":labelText(x)||outputLabel(x)||x))}</option>`).join("")}</select></label>`; }
  function navigate(view) { state.ui.view = view; if (typeof history !== "undefined" && history.replaceState) history.replaceState(null, "", `#${view}`); }
  function resetWorkspace() {
    state.workspace = {
      company: "",
      business: "",
      project: "",
      brand: { name: "", story: "", tone: "", key: "", preferred: [], banned: [], assets: [], glossary: [] },
      products: [],
      markets: []
    };
    state.outputs = [];
    state.gold = [];
    state.logs = [log("Workspace 초기화", "보관 후 빈 워크스페이스로 전환했습니다.")];
    state.ui.step = 1;
    state.ui.activeOutput = null;
    state.ui.productId = "";
    state.ui.studio = { type: "pdp", platform: "smartstore", marketId: "", productId: "", brief: "실제 운영용 새 워크스페이스입니다.", brandTone: "", audienceAge: "", expressionStyle: "" };
    state.ui.draft = { product: { name: "", cat: "", features: "", specs: "" }, market: { country: "", lang: "", note: "" } };
  }
  function archiveCurrentWorkspace() {
    if (!(ws().company || ws().products.length || ws().markets.length || state.outputs.length)) return ping("보관할 데이터가 없습니다.");
    state.database.unshift({
      id: uid("db"),
      archivedAt: new Date().toISOString(),
      workspace: JSON.parse(JSON.stringify(state.workspace)),
      outputs: JSON.parse(JSON.stringify(state.outputs)),
      gold: JSON.parse(JSON.stringify(state.gold)),
      logs: JSON.parse(JSON.stringify(state.logs))
    });
    resetWorkspace();
    navigate("dashboard");
    ping("현재 테스트 데이터를 로컬 DB에 보관하고 모든 항목을 초기화했습니다.");
  }

  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-nav],[data-step],[data-open],[data-product],[data-playbook],[data-bundle],[data-type],[data-run],[data-lock],[data-regen],[data-approve],[data-duplicate],[data-gold],[data-copy],[data-test],[data-deploy],[data-done],[data-archive-demo]");
    if (!b) return;
    if (b.dataset.nav) { e.preventDefault(); navigate(b.dataset.nav); }
    if (b.dataset.step) state.ui.step = +b.dataset.step;
    if (b.dataset.open) { state.ui.activeOutput = b.dataset.open; navigate((state.outputs.find((x)=>x.id===b.dataset.open)?.mode === "guide") ? "guide_result" : "result"); }
    if (b.dataset.product) { state.ui.productId = b.dataset.product; navigate("products"); }
    if (b.dataset.playbook) state.ui.playbookId = b.dataset.playbook;
    if (b.dataset.bundle) state.ui.bundleId = b.dataset.bundle;
    if (b.dataset.type) { const t = b.dataset.type; state.ui.studio.type = t; state.ui.studio.platform = OUT[t].platforms[0]; }
    if (b.dataset.run) run(b.dataset.run);
    if (b.dataset.lock) lockToggle(b.dataset.lock);
    if (b.dataset.regen) regen(b.dataset.regen);
    if (b.dataset.approve) approve(b.dataset.approve);
    if (b.dataset.duplicate) duplicate(b.dataset.duplicate);
    if (b.dataset.gold) gold(b.dataset.gold);
    if (b.dataset.copy) { const el = document.getElementById(b.dataset.copy); navigator.clipboard.writeText(el.value || el.textContent || ""); ping("프롬프트를 복사했습니다."); }
    if (b.dataset.test) { const x = state.bundles.find((v)=>v.id===b.dataset.test); x.score = Math.min(98, x.score + 2); ping("샌드박스 테스트 완료"); }
    if (b.dataset.deploy) { const x = state.bundles.find((v)=>v.id===b.dataset.deploy); x.ver = nextVer(x.ver); state.logs.unshift(log("Prompt 배포", `${x.label}을 배포했습니다.`)); ping("Prompt Bundle을 배포했습니다."); }
    if (b.dataset.done) { navigate("dashboard"); ping("온보딩이 완료되었습니다."); }
    if ("archiveDemo" in b.dataset) archiveCurrentWorkspace();
    save(); render();
  });

  window.addEventListener("hashchange", () => {
    const target = (location.hash || "").replace("#", "");
    if (NAV.some(([id]) => id === target) || ["result", "guide_result"].includes(target)) {
      state.ui.view = target;
      save();
      render();
    }
  });

  document.addEventListener("change", (e) => {
    if (e.target.matches("[data-studio]")) state.ui.studio[e.target.name] = e.target.value;
    if (e.target.matches("[data-repo]")) state.ui.repo[e.target.name] = e.target.value;
    if (e.target.matches("[data-setting]")) state.ui[e.target.name] = e.target.value;
    if (e.target.matches("[data-draft-group]")) { const g = e.target.dataset.draftGroup; state.ui.draft[g][e.target.name] = e.target.value; }
    save(); render();
  });
  document.addEventListener("input", (e) => {
    if (e.target.matches("[data-draft-group]")) {
      const g = e.target.dataset.draftGroup;
      state.ui.draft[g][e.target.name] = e.target.value;
      save();
    }
    if (e.target.matches("[data-studio]")) {
      state.ui.studio[e.target.name] = e.target.value;
      save();
    }
  });

  document.addEventListener("submit", (e) => {
    const f = e.target; if (!f.dataset.form) return; e.preventDefault();
    const d = Object.fromEntries(new FormData(f).entries());
    if (f.dataset.form === "workspace") { ws().company = d.company; ws().business = d.business; ws().project = d.project; ping("기본 정보를 저장했습니다."); }
    if (f.dataset.form === "brandCore") { brand().story = d.story; brand().tone = d.tone; brand().key = d.key; ping("Brand Truth를 저장했습니다."); }
    if (f.dataset.form === "addProduct" && d.name) { ws().products.push({ id: uid("p"), name: d.name, cat: d.cat, features: d.features.split(",").map((x)=>x.trim()).filter(Boolean), specs: d.specs.split(",").map((x)=>x.trim()).filter(Boolean), price: "", shipping: "", returns: "", evidence: [] }); state.ui.draft.product = { name: "", cat: "", features: "", specs: "" }; ping("제품을 추가했습니다."); }
    if (f.dataset.form === "addMarket" && d.country) { ws().markets.push({ id: uid("m"), country: d.country, lang: d.lang, note: d.note }); state.ui.draft.market = { country: "", lang: "", note: "" }; ping("시장을 추가했습니다."); }
    if (f.dataset.form === "phrases") { brand().preferred = d.preferred.split(",").map((x)=>x.trim()).filter(Boolean); brand().banned = d.banned.split(",").map((x)=>x.trim()).filter(Boolean); ping("표현 정책을 저장했습니다."); }
    if (f.dataset.form === "asset" && d.name) { brand().assets.push({ name: d.name, type: d.type }); ping("브랜드 자산을 추가했습니다."); }
    if (f.dataset.form === "brandProfile") { brand().name = d.name; brand().story = d.story; brand().tone = d.tone; brand().key = d.key; brand().preferred = d.preferred.split(",").map((x)=>x.trim()).filter(Boolean); brand().banned = d.banned.split(",").map((x)=>x.trim()).filter(Boolean); ping("브랜드 프로필을 저장했습니다."); }
    if (f.dataset.form === "productEdit") { const p = product(d.id); p.name = d.name; p.cat = d.cat; p.features = d.features.split(",").map((x)=>x.trim()).filter(Boolean); p.specs = d.specs.split(",").map((x)=>x.trim()).filter(Boolean); p.price = d.price; p.shipping = d.shipping; p.returns = d.returns; ping("Product Truth를 저장했습니다."); }
    if (f.dataset.form === "playbookEdit") { const x = state.playbooks.find((v)=>v.id===d.id); x.tone = d.tone; x.req = d.req.split(",").map((x)=>x.trim()).filter(Boolean); x.banned = d.banned.split(",").map((x)=>x.trim()).filter(Boolean); x.ver = nextVer(x.ver); ping("플레이북을 저장했습니다."); }
    if (f.dataset.form === "bundleEdit") { const x = state.bundles.find((v)=>v.id===d.id); x.draft = d.draft; ping("Prompt draft를 저장했습니다."); }
    if (f.dataset.form === "sectionEdit") editSection(d.outputId, d.sectionId, d.content);
    state.outputs.filter((x) => x.mode === "generate").forEach((x) => refreshOutputQuality(x));
    save(); render();
  });

  function run(mode) {
    const st = state.ui.studio, p = product(st.productId), m = market(st.marketId);
    if (!p || !m) return ping("제품과 시장을 먼저 등록해 주세요.");
    const rawProfile = { brandTone: st.brandTone, audienceAge: st.audienceAge, expressionStyle: st.expressionStyle };
    const profile = resolveProfile(rawProfile, m, brand());
    if (mode === "generate") mkOutput(state, { type: st.type, platform: st.platform, productId: p.id, marketId: m.id, brief: st.brief, status: "in_review", version: 1, rawProfile, profile });
    else mkGuide(state, { type: st.type, platform: st.platform, productId: p.id, marketId: m.id, brief: st.brief, status: "generated", version: 1, rawProfile, profile });
    state.ui.activeOutput = state.outputs[0].id; state.ui.view = mode === "generate" ? "result" : "guide_result"; ping(mode === "generate" ? "Asset Pack을 생성했습니다." : "Toolchain Pack을 생성했습니다.");
  }
  function lockToggle(key) { const [oid, sid] = key.split(":"); const s = state.outputs.find((x)=>x.id===oid)?.sections.find((x)=>x.id===sid); if (s) s.locked = !s.locked; }
  function regenVariant(o, s) {
    const p = product(o.productId), m = market(o.marketId);
    const turn = (s.regenCount || 0) % 3;
    const variants = {
      "제목 3안": [
        `1. ${m.country} 시장에서 먼저 읽히는 ${p.name} 제목 구조\n2. 선물형 구매 이유를 먼저 보여주는 ${brand().name} 카피\n3. 향보다 구성과 리필 가치를 앞세운 SEO 제목`,
        `1. ${p.name}: ${m.country} 바이어가 바로 이해하는 gift-ready hand care\n2. ${brand().name}가 향, 선물, 리필을 한 문장으로 정리하는 법\n3. 검색 유입용으로 다시 쓴 ${p.name} 제목 3안`,
        `1. ${p.features[2] || p.features[0]}이 먼저 보이는 ${p.name}\n2. ${m.country} 시장용 전환형 블로그 제목\n3. 브랜드 감성보다 구매 이유를 먼저 주는 카피`
      ],
      "개요": [
        `이번 버전은 검색 의도와 구매 이유를 앞에 놓고, 브랜드 스토리는 중반 이후로 미룹니다. ${m.country} 시장에서는 ${m.note} 문맥이 CTA보다 먼저 이해되어야 합니다.`,
        `개요 구조를 “문제 인식 -> 제품 Truth -> 시장 적합성 -> 배송 신뢰 -> CTA” 순으로 재조정합니다. 이렇게 해야 감성 문장보다 구매 판단 정보가 먼저 보입니다.`,
        `브랜드 소개형이 아니라 바이어 설득형 개요로 바꿉니다. 핵심은 gift-ready, refill, shipping trust 세 블록을 섞지 않고 분리하는 것입니다.`
      ],
      "본문": [
        `## 검색 유입형 본문\n${p.name}를 찾는 사용자는 감성적인 설명보다 “왜 이 구성이 필요한가”를 먼저 확인합니다.\n\n### 제품 사실\n- 스펙: ${p.specs.join(", ")}\n- 가격: ${p.price}\n- 배송: ${p.shipping}\n- 반품: ${p.returns}\n\n### 시장 적합성\n${m.country} 시장에서는 ${m.note} 포인트를 먼저 보여 주는 편이 구매 장벽을 낮춥니다.\n\n### 결론\n브랜드 스토리는 후반부에서 보강하고, 구매 이유는 전반부에서 확정합니다.`,
        `## 전환 중심 본문\n${brand().name}의 장점은 감성 그 자체보다 ${p.features[2] || p.features[0]}와 ${p.features[3] || p.features[1]}를 하나의 구매 스토리로 묶을 수 있다는 점입니다.\n\n1. 첫 블록: 선물 이유\n2. 두 번째 블록: 향과 사용 경험\n3. 세 번째 블록: 배송/반품 신뢰\n4. 마지막 블록: CTA\n\n추가 요청 반영: ${o.brief}`,
        `## 바이어 설명형 본문\n이 버전은 브랜드 철학보다 제품 Truth를 먼저 제시합니다.\n\n${p.name}는 ${benefitSummary(p)}를 중심으로 설계되었고, ${m.country} 시장에서는 ${m.note} 메시지가 특히 중요합니다.\n\n실무에서는 본문 중간에 FAQ 링크와 상세페이지 이동 CTA를 넣어 정보 탐색 흐름을 끊지 않는 편이 좋습니다.`
      ],
      "Hero": [
        `${p.features[2] || p.features[0]}를 첫 줄에 배치하고, 두 번째 줄에서 ${p.shipping} 기반 배송 신뢰를 보강하는 Hero 버전`,
        `${brand().name} ${p.name}: 선물 이유는 앞에, 브랜드 감성은 뒤에 두는 전환형 Hero`,
        `${m.country} 시장용 Hero. 핵심 구매 이유를 한 줄, 옵션/배송 신뢰를 보조 문장으로 분리`
      ],
      "3초 훅": [
        `패키지 전체보다 ${p.features[2] || p.features[0]} 디테일을 먼저 보여주는 3초 훅`,
        `첫 1초에 손에 잡히는 사용 장면을 넣고, 2~3초에 리필 구조를 암시하는 훅`,
        `${m.country} 타깃용으로 배송 신뢰보다 선물 장면을 먼저 열어 주는 훅`
      ]
    };
    const list = variants[s.name] || [
      `대안 버전 A: 브랜드 설명을 줄이고 구매 이유를 앞에 배치합니다.`,
      `대안 버전 B: 시장 적합성 문장을 보강하고 정보형 구조로 다시 씁니다.`,
      `대안 버전 C: 배송/반품/구성 정보를 더 선명하게 보이도록 재정리합니다.`
    ];
    return list[turn % list.length];
  }
  function refreshOutputQuality(o) { const q = score(o.type, o.sections, brand().banned); o.score = q.overall; o.status = q.state; o.rubric = q.rubric; o.checklist = buildChecklist(o); }
  function regen(key) { const [oid, sid] = key.split(":"); const o = state.outputs.find((x)=>x.id===oid); const s = o?.sections.find((x)=>x.id===sid); if (s && !s.locked) { s.regenCount = (s.regenCount || 0) + 1; s.content = regenVariant(o, s); s.human = false; refreshOutputQuality(o); ping("섹션을 재생성했습니다."); } }
  function editSection(oid, sid, content) { const o = state.outputs.find((x)=>x.id===oid); const s = o?.sections.find((x)=>x.id===sid); if (s) { s.content = content; s.human = true; refreshOutputQuality(o); ping("섹션 수정을 저장했습니다."); } }
  function approve(id) { const o = state.outputs.find((x)=>x.id===id); if (!o) return; if (o.checklist.some((x)=>!x.done) || o.score < 85 || o.sections.some((s)=>s.issues.some((i)=>i.includes("금지표현")))) return ping("자동 체크리스트를 모두 통과하고 85점 이상이어야 승인할 수 있습니다."); o.status = "approved"; state.logs.unshift(log("결과물 승인", `${outputLabel(o.type)} 결과물을 승인했습니다.`)); ping("승인 저장이 완료되었습니다."); }
  function duplicate(id) { const src = state.outputs.find((x)=>x.id===id); if (!src) return; const cp = JSON.parse(JSON.stringify(src)); cp.id = uid("out"); cp.originId = src.id; cp.version = (src.version || 1) + 1; cp.status = cp.mode === "generate" ? "in_review" : "generated"; cp.at = new Date().toISOString(); if (cp.mode==="generate") refreshOutputQuality(cp); state.outputs.unshift(cp); state.ui.activeOutput = cp.id; state.ui.view = cp.mode==="generate" ? "result" : "guide_result"; ping("새 버전을 복제했습니다. 현재 결과를 기준으로 새 작업본이 생성되었습니다."); }
  function gold(id) { if (!state.gold.some((x)=>x.outputId===id)) { state.gold.unshift({ id: uid("g"), outputId: id, note: "승인 후 재사용 기준 예시" }); ping("Gold Sample로 등록했습니다."); } }
  function ping(msg) { toast = msg; clearTimeout(window.__emhToast); window.__emhToast = setTimeout(() => { toast = ""; render(); }, 2000); }
  function nextVer(v) { const a = v.split(".").map(Number); a[2] = (a[2] || 0) + 1; return a.join("."); }

  function clearRuntimeCaches() {
    if (!("caches" in window)) return Promise.resolve();
    return caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => key.startsWith("export-marketing-hub-")).map((key) => caches.delete(key)))
    );
  }

  function setupServiceWorker() {
    if (!("serviceWorker" in navigator) || !location.protocol.startsWith("http")) return;
    const isLocal = /^(localhost|127\.0\.0\.1)$/i.test(location.hostname);
    if (isLocal) {
      navigator.serviceWorker.getRegistrations()
        .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister())))
        .then(() => clearRuntimeCaches())
        .catch(() => {});
      return;
    }
    navigator.serviceWorker.register(`./sw.js?v=${BUILD}`).catch(() => {});
  }

  setupServiceWorker();

  try {
    render();
  } catch (error) {
    showFatal(error && error.stack ? error.stack : String(error));
    throw error;
  }
})();

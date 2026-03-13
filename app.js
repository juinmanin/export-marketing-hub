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

  const KEY = "emh-prd2-lite-v2";
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
        studio: { type: "pdp", platform: "smartstore", marketId: "m1", productId: "p1", brief: "향 / 선물 / 키링 포인트를 분리해서 보여주세요." },
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
        { id: "bu1", name: "smartstore_pdp_global", label: "스마트스토어 PDP", type: "pdp", platform: "smartstore", ver: "2.6.3", score: 92, draft: "Truth -> Hero -> Specs -> Shipping -> FAQ 순으로 작성한다." },
        { id: "bu2", name: "threads_export_brand", label: "Threads / X", type: "social_post", platform: "threads", ver: "2.2.0", score: 89, draft: "첫 문장을 짧게, 브랜드 톤은 유지하고 판매감은 낮춘다." },
        { id: "bu3", name: "shortform_storyboard_tiktok", label: "Shortform Storyboard", type: "shortform", platform: "tiktok", ver: "1.9.7", score: 87, draft: "3초 훅과 오버레이 카피를 먼저 설계한다." }
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

  function seedOutputs(s) {
    mkOutput(s, { type: "blog_post", platform: "blog", productId: "p1", marketId: "m1", brief: "일상을 디자인하는 향이라는 메시지를 중심으로 작성", status: "approved" });
    mkOutput(s, { type: "pdp", platform: "shopee", productId: "p1", marketId: "m3", brief: "gift-ready와 delivery trust를 함께 보여주세요.", status: "in_review" });
    mkOutput(s, { type: "shortform", platform: "tiktok", productId: "p2", marketId: "m1", brief: "팝업 기프트 세트 런칭용 15초 훅", status: "revision_required", bad: "피부를 즉시 개선하는 향기 루틴" });
    mkGuide(s, { type: "thumbnail", platform: "youtube", productId: "p1", marketId: "m1", brief: "향 / 선물 / 리필 포인트가 동시에 보이게", status: "approved" });
  }

  function gen(s, type, p, m, brief) {
    const b = brandOf(s);
    const base = {
      blog_post: [
        `1. ${b.preferred[0]}: ${m.country} 시장에 ${p.name}를 소개하는 법`,
        `${copyOf(s, "story_intro")}`,
        `### ${b.name}\n\n${b.story}\n\n${p.name}는 ${p.features.slice(0, 3).join(", ")}를 중심으로 ${m.note} 니즈에 대응합니다.\n\n- 스펙: ${p.specs.join(", ")}\n- ${copyOf(s, "shipping")}: ${p.shipping}\n- ${copyOf(s, "returns")}: ${p.returns}\n\n${brief}`,
        `${b.name} ${p.name}의 향, 선물, 리필 포인트를 ${m.country} 타깃 기준으로 정리한 소개 글.`,
        `${copyOf(s, "cta")}`,
        `${b.name} premium still life, ${p.name}, ivory backdrop, gift-ready composition`
      ],
      social_post: [
        `${b.preferred[0]}.`,
        `${p.name}는 ${p.features[0]}와 ${p.features[2]}를 한 문맥으로 묶어 설명하기 좋습니다. 감성은 유지하고, 판매감은 낮추고, 옵션 정보는 링크로 넘기는 구조가 안정적입니다.`,
        `${copyOf(s, "gift")}\n향과 리필 경험이 동시에 보이는 제품.`,
        `어떤 포인트가 가장 끌리는지 댓글로 알려주세요.`,
        `#exportmarketing #giftablebeauty #kbrand`
      ],
      pdp: [
        `${b.preferred[0]} ${p.name}. ${p.features[2]}와 ${p.features[3]}를 하나의 구매 이유로 정리한 Hero 카피.`,
        `1. ${p.features[0]}\n2. ${p.features[2]}\n3. ${p.features[3]}`,
        `- 스펙: ${p.specs.join(", ")}\n- 가격: ${p.price}\n- 옵션: ${p.features.slice(0, 2).join(", ")}`,
        `배송: ${p.shipping}\n반품: ${p.returns}\n시장 메모: ${m.note}`,
        `Q. 향 옵션은 어떻게 고르나요?\nA. ${copyOf(s, "detail")}\n\nQ. 선물용 구성이 포함되나요?\nA. 기프트 패키지 구성이 포함됩니다.`,
        `${copyOf(s, "cta")}`,
        `향 / 선물 / 키링 포함 구성을 한눈에 보여주는 배너 문안`
      ],
      shortform: [
        `${b.preferred[0]}를 3초 안에 보여주는 탑샷`,
        `0-3초 언박싱\n4-8초 향 / 키링 디테일\n9-12초 사용 컷\n13-15초 CTA`,
        `탑샷 / 패키지 클로즈업 / 사용 컷 / 리필 디테일 / 엔드카드`,
        `선물처럼 바로 설명되는 구성\n리필 가능한 패키지\ncross-border shipping ready`,
        `링크에서 전체 구성을 확인해 보세요.`,
        `${b.name} thumbnail, gift-ready hand cream set, key charm visible`
      ],
      faq: [
        `배송 문의 / 옵션 문의 / 선물 포장 문의`,
        `${p.shipping} 기준으로 발송되며, 옵션과 구성은 상세페이지에서 확인하실 수 있습니다.`,
        `${p.shipping} 기준으로 발송됩니다.`,
        `${copyOf(s, "thanks")} ${p.shipping} 기준으로 안내드리고 있으며 자세한 옵션은 상세페이지에서 확인 부탁드립니다.`,
        `재고 / 대량 주문 / B2B 문의는 운영 담당자에게 이관합니다.`
      ],
      influencer: [
        `안녕하세요. ${m.country} 타깃 라이프스타일 뷰티 브랜드 ${b.name}입니다. ${p.name} 협업을 제안드립니다.`,
        `${p.features[2]}와 ${p.features[3]} 포인트가 강해 언박싱형 콘텐츠와 잘 맞습니다.`,
        `언박싱 / 선물 추천 / 향 비교 / 리필 경험`,
        `${p.name}는 과장 없이 설명 가능한 선물형 제품입니다. ${m.note}`
      ]
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
    const sections = gen(s, o.type, p, m, o.brief);
    if (o.bad) sections[3].content += `\n${o.bad}`;
    const q = score(o.type, sections, brandOf(s).banned);
    const row = { id: uid("out"), originId: o.originId || null, version: o.version || 1, mode: "generate", type: o.type, platform: o.platform, productId: o.productId, marketId: o.marketId, brief: o.brief, status: o.status || q.state, score: q.overall, rubric: q.rubric, sections, checklist: [], at: new Date().toISOString(), bundle: bundleOf(s, o.type, o.platform)?.ver || "1.0.0", playbook: playbookOf(s, o.type, o.platform)?.ver || "1.0.0" };
    row.checklist = buildChecklist(row);
    s.outputs.unshift(row);
    if (o.status === "approved") s.gold.push({ id: uid("g"), outputId: row.id, note: "브랜드 스토리와 판매 포인트 균형이 좋은 승인본" });
    if (!s.ui.activeOutput) s.ui.activeOutput = row.id;
  }

  function mkGuide(s, o) {
    s.outputs.unshift({
      id: uid("out"), originId: o.originId || null, version: o.version || 1, mode: "guide", type: o.type, platform: o.platform, productId: o.productId, marketId: o.marketId, brief: o.brief, status: o.status || "generated", at: new Date().toISOString(),
      guide: {
        tools: ["Canva + ChatGPT", "Figma + Midjourney/Flux"],
        prompt: `${brandOf(s).name} ${productOf(s, o.productId).name}, ${marketOf(s, o.marketId).country} 타깃, ${brandOf(s).tone}, ${o.brief}`,
        steps: ["캔버스 규격 설정", "프롬프트로 2~3개 시안 생성", "브랜드 자산 반영", "QA 체크 후 저장"],
        qa: ["제품 또는 핵심 오브제가 1초 안에 인지되는가", "카피가 짧고 선명한가", "금지표현을 피했는가"]
      }
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
          <div class="rail-note"><span class="pill role-pill">${text(state.me.role)}</span><p>${t("current_user")}: ${text(state.me.name)}</p></div>
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
    return `<section class="panel"><div class="head"><div><div class="eyebrow">사용설명</div><h2>처음부터 끝까지 사용하는 상세 가이드</h2><p>이 프로그램은 브랜드·제품·시장 정보를 구조화한 뒤 생성, 자동 검수, 승인 저장, 새 버전 분기, 테스트 종료 후 보관까지 한 흐름으로 운영하기 위해 설계되었습니다.</p></div></div><div class="stack"><div class="mini big"><strong>1. 대시보드 확인</strong><span>현재 회사, 프로젝트, 준비도, 승인 대기 항목, 최근 결과물을 먼저 확인합니다. 기본 샘플은 VARELI이며 테스트용으로 들어 있습니다.</span></div><div class="mini big"><strong>2. 온보딩 입력</strong><span>회사, 브랜드, 제품, 시장, 금지표현, 자산을 순서대로 입력합니다. 제품과 시장 입력 중에는 임시저장이 유지되어 다음 단계로 이동해도 값이 사라지지 않습니다.</span></div><div class="mini big"><strong>3. Brand / Product Truth 정리</strong><span>브랜드 화면에서는 브랜드 스토리, 톤, 선호 표현, 금지 표현, 용어집을 관리하고 제품 화면에서는 스펙, 배송, 반품, 근거자료를 관리합니다.</span></div><div class="mini big"><strong>4. Output Studio 실행</strong><span>출력물 유형, 플랫폼, 시장, 제품, 추가 요청을 선택합니다. Generate Here는 사이트 내부에서 바로 산출물을 만들고, Guide Me는 외부 툴용 Toolchain Pack을 제공합니다.</span></div><div class="mini big"><strong>5. 결과 검수</strong><span>결과 화면에서는 넓은 반응형 편집창으로 각 섹션을 검토합니다. 잠금한 섹션은 유지되고, 재생성 버튼은 매번 다른 대안 버전으로 다시 생성합니다.</span></div><div class="mini big"><strong>6. 점수와 자동 체크리스트 확인</strong><span>우측 검수 패널에서 자동 체크리스트 PASS/FAIL과 Truth, Brand, Platform, Completeness 점수를 확인합니다. 점수는 무조건 승인 수치가 아니라 어디를 먼저 수정해야 하는지 알려주는 기준입니다.</span></div><div class="mini big"><strong>7. 새 버전 복제 사용법</strong><span>새 버전 복제는 현재 결과를 기준으로 새 작업본을 만들고 검수 상태를 다시 계산하는 기능입니다. 국가별 현지화 버전, 카피 비교 실험, 담당자별 분기 작업에 사용합니다.</span></div><div class="mini big"><strong>8. 승인 저장</strong><span>자동 체크리스트가 모두 PASS이고 점수가 기준 이상일 때만 승인 저장이 가능합니다. 승인 후에는 Gold Sample로 등록해 이후 결과물의 기준 예시로 재사용할 수 있습니다.</span></div><div class="mini big"><strong>9. 샘플 테스트 종료 후 보관</strong><span>VARELI 테스트가 끝나면 대시보드 또는 운영 화면의 ‘DB 보관 및 초기화’ 버튼을 눌러 현재 회사, 브랜드, 제품, 시장, 결과물 전체를 로컬 DB에 보관하고 모든 항목을 빈 값으로 초기화합니다.</span></div><div class="mini big"><strong>10. 실제 운영 시작</strong><span>초기화가 끝나면 빈 워크스페이스에서 실제 회사 데이터를 입력해 운영을 시작하면 됩니다. 로그인만 제외하면 같은 흐름으로 계속 사용할 수 있습니다.</span></div></div></section>`;
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
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${t("studio")}</div><h2>Output Studio</h2><p>Generate Here와 Guide Me를 같은 스튜디오에서 전환합니다.</p></div><span class="pill">${def.mode === "generate" ? "Generate Here" : "Guide Me"}</span></div><div class="studio"><div class="subcard"><div class="eyebrow">Output Type</div><div class="choices">${Object.entries(OUT).map(([k, v]) => `<button class="${st.type===k?"active":""}" data-type="${k}"><strong>${text(outputLabel(k))}</strong><span>${v.mode==="generate"?"Generate":"Guide"}</span></button>`).join("")}</div>${select("platform", "플랫폼", def.platforms, st.platform, (id) => labelText(id))}${select("marketId", "시장", ws().markets.map((m) => m.id), st.marketId, (id) => `${market(id).country} · ${market(id).lang}`)}${select("productId", "제품", ws().products.map((p) => p.id), st.productId, (id) => product(id).name)}${area("brief", "추가 요청", st.brief, true)}<div class="actions"><button class="primary" data-run="${def.mode}">${def.mode==="generate"?"Asset Pack 생성":"Toolchain Pack 생성"}</button></div></div><div class="subcard"><div class="eyebrow">Preview</div><h3>예상 구성</h3><div class="chips">${def.sections.map((s) => `<span class="chip">${text(s)}</span>`).join("")}</div><div class="meta"><strong>Playbook</strong><p>${pb ? `${labelText(pb.platform)} · v${pb.ver}` : "기본 룰"}</p></div><div class="meta"><strong>Prompt Bundle</strong><p>${bu ? `${bu.label} · v${bu.ver}` : "기본 번들"}</p></div></div></div></section>`;
  }

  function resultView() {
    const o = current(); if (!o || o.mode !== "generate") return `<section class="panel">${empty("선택된 Generate Here 결과가 없습니다.")}</section>`;
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${t("generated")}</div><h2>${text(outputLabel(o.type))} · ${text(product(o.productId).name)}</h2><p>${text(labelText(o.platform))} · Prompt v${text(o.bundle)} · Playbook v${text(o.playbook)}</p></div><span class="score ${o.score>=85?"ok":o.score>=70?"mid":"bad"}">${o.score}점</span></div><div class="mini action-note"><strong>${t("duplicate")}</strong><span>현재 결과를 기준으로 검수 상태를 다시 계산한 새 작업본을 만듭니다. 국가별 현지화, 카피 실험, 담당자별 분기 작업에 사용합니다.</span><span>현재 버전 ${o.version || 1}${o.originId ? ` · 원본 ${o.originId}` : ""}</span></div><div class="actions"><button class="primary" data-approve="${o.id}">${t("approve")}</button><button class="secondary" data-duplicate="${o.id}">${t("duplicate")}</button><button class="ghost" data-gold="${o.id}">${t("gold")}</button></div></section><section class="stack">${o.sections.slice().sort((a,b)=>a.score-b.score).map((s) => `<article class="panel sec ${s.locked?"locked":""}"><div class="head"><div><div class="eyebrow">${text(s.name)}</div><h3>${text(s.name)}</h3></div><div>${s.human?`<span class="pill">${l()==="ko"?"수정 반영됨":l()==="en"?"Edited":l()==="ja"?"修正反映済み":"已人工修改"}</span>`:""}<span class="score ${s.score>=85?"ok":s.score>=70?"mid":"bad"}">${s.score}</span></div></div><div class="issues">${s.issues.length?s.issues.map((i)=>`<span class="issue">${text(i)}</span>`).join(""):`<span class="issue ok">${t("no_issue")}</span>`}</div><form data-form="sectionEdit"><input type="hidden" name="outputId" value="${o.id}"><input type="hidden" name="sectionId" value="${s.id}"><textarea class="result-textarea" name="content" ${s.locked?"readonly":""}>${text(s.content)}</textarea><div class="actions section-actions"><button class="ghost" type="button" data-lock="${o.id}:${s.id}">${s.locked?t("unlock"):t("lock")}</button><button class="secondary" type="button" data-regen="${o.id}:${s.id}" ${s.locked?"disabled":""}>${t("regenerate")}</button><button class="primary" ${s.locked?"disabled":""}>${t("save_edit")}</button></div></form></article>`).join("")}</section>`;
  }

  function guideView() {
    const o = current(); if (!o || o.mode !== "guide") return `<section class="panel">${empty("선택된 Guide Me 결과가 없습니다.")}</section>`;
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${t("guide")}</div><h2>${text(outputLabel(o.type))} · ${text(product(o.productId).name)}</h2></div><span class="pill">${text(labelText(o.status))}</span></div><div class="split"><article class="subcard"><div class="eyebrow">${l()==="ko"?"추천 툴":l()==="en"?"Recommended Tools":l()==="ja"?"推奨ツール":"推荐工具"}</div>${o.guide.tools.map((t) => `<div class="mini">${text(t)}</div>`).join("")}</article><article class="subcard"><div class="eyebrow">${l()==="ko"?"프롬프트":l()==="en"?"Prompt":l()==="ja"?"プロンプト":"提示词"}</div><textarea readonly id="guidePrompt">${text(o.guide.prompt)}</textarea><div class="actions"><button class="secondary" data-copy="guidePrompt">${l()==="ko"?"복사":l()==="en"?"Copy":l()==="ja"?"コピー":"复制"}</button></div></article></div><article class="panel"><div class="head"><div><div class="eyebrow">${l()==="ko"?"제작 순서 & QA":l()==="en"?"Process & QA":l()==="ja"?"制作手順 & QA":"制作步骤与 QA"}</div><h3>Toolchain Pack</h3></div></div><ol>${o.guide.steps.map((s) => `<li>${text(s)}</li>`).join("")}</ol><ul>${o.guide.qa.map((q) => `<li>${text(q)}</li>`).join("")}</ul></article></section>`;
  }

  function repoView() {
    const f = state.ui.repo;
    const items = state.outputs.filter((o) => (f.status === "all" || o.status === f.status) && (f.platform === "all" || o.platform === f.platform) && (f.type === "all" || o.type === f.type) && (!f.q || `${o.type} ${product(o.productId).name} ${o.brief}`.toLowerCase().includes(f.q.toLowerCase())));
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${t("repository")}</div><h2>Outputs Repository</h2></div></div><div class="filters">${repoSelect("status", ["all","approved","in_review","revision_required"], f.status)}${repoSelect("platform", ["all",...new Set(state.outputs.map((o)=>o.platform))], f.platform, (x)=>x==="all"?"전체":labelText(x))}${repoSelect("type", ["all",...Object.keys(OUT)], f.type, (x)=>x==="all"?"전체":outputLabel(x))}<label class="field grow"><span>검색</span><input name="q" value="${text(f.q)}" data-repo></label></div>${items.map(row).join("") || empty("조건에 맞는 결과물이 없습니다.")}</section><section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">Gold Samples</div><h3>승인 우수본</h3></div></div>${state.gold.map((g)=>`<div class="mini">${text((state.outputs.find((o)=>o.id===g.outputId)?.type && outputLabel(state.outputs.find((o)=>o.id===g.outputId).type)) || "Sample")}<span>${text(g.note)}</span></div>`).join("") || empty("등록된 Gold Sample이 없습니다.")}</article><article class="panel"><div class="head"><div><div class="eyebrow">${t("duplicate")}</div><h3>어디서 어떻게 쓰나</h3></div></div><div class="mini">결과 상세 화면 상단의 ‘새 버전 복제’ 버튼을 누르면 현재 결과를 기준으로 새 작업본이 생성됩니다.</div><div class="mini">복제된 버전은 보관함과 품질 센터에서 별도 결과물처럼 검색하고 비교할 수 있습니다.</div><div class="mini">국가별 버전 분기, 카피 실험, 담당자별 수정 분기 작업에 사용하세요.</div></article></section>`;
  }

  function playbookView() {
    const pb = state.playbooks.find((x)=>x.id===state.ui.playbookId) || state.playbooks[0];
    return `<section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">${t("playbooks")}</div><h2>Platform Playbook Center</h2></div></div>${state.playbooks.map((x)=>`<button class="row-main ${x.id===pb.id?"sel":""}" data-playbook="${x.id}"><strong>${text(labelText(x.platform))}</strong><span>${text(outputLabel(x.type))} · v${text(x.ver)}</span></button>`).join("")}</article><article class="panel"><div class="head"><div><div class="eyebrow">Rule Set</div><h2>${text(labelText(pb.platform))}</h2></div><span class="pill">v${text(pb.ver)}</span></div><form data-form="playbookEdit"><input type="hidden" name="id" value="${pb.id}">${field("tone","권장 톤",pb.tone)}${area("req","필수 섹션",pb.req.join(", "))}${area("banned","금지 표현",pb.banned.join(", "))}<button class="primary">플레이북 저장</button></form></article></section>`;
  }

  function promptView() {
    const bu = state.bundles.find((x)=>x.id===state.ui.bundleId) || state.bundles[0];
    return `<section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">프롬프트</div><h2>Prompt Stack Studio</h2></div></div>${state.bundles.map((x)=>`<button class="row-main ${x.id===bu.id?"sel":""}" data-bundle="${x.id}"><strong>${text(x.label)}</strong><span>${text(x.name)} · v${text(x.ver)}</span></button>`).join("")}</article><article class="panel"><div class="head"><div><div class="eyebrow">Layer Draft</div><h2>${text(bu.label)}</h2></div><span class="score ${bu.score>=85?"ok":bu.score>=70?"mid":"bad"}">${bu.score}</span></div><form data-form="bundleEdit"><input type="hidden" name="id" value="${bu.id}">${area("draft","Draft Prompt",bu.draft)}<button class="primary">Draft 저장</button></form><div class="actions"><button class="secondary" data-test="${bu.id}">샌드박스 테스트</button><button class="ghost" data-deploy="${bu.id}">승인 배포</button></div></article></section>`;
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
    if (v === "result" && o && o.mode === "generate") return `<section class="panel sticky"><div class="eyebrow">Review Gate</div><h3>${t("review_gate")}</h3>${o.checklist.map((c)=>`<div class="check"><span>${text(c.label)}</span><span class="${c.done?"score ok":"score bad"}">${c.done?"PASS":"FAIL"}</span></div>`).join("")}<div class="sub"><strong>Score Rubric</strong><div class="mini">Truth<span>${o.rubric.truth}</span></div><div class="mini">Brand<span>${o.rubric.brand}</span></div><div class="mini">Platform<span>${o.rubric.platform}</span></div><div class="mini">Completeness<span>${o.rubric.completeness}</span></div></div><div class="sub"><strong>점수 기준</strong><div class="mini">85점 이상 + 체크리스트 전부 PASS<span>승인 가능</span></div><div class="mini">70~84점<span>수정 후 재검토</span></div><div class="mini">69점 이하 또는 금지표현 포함<span>재작성 필요</span></div></div><div class="sub"><strong>금지표현</strong>${brand().banned.map((x)=>`<span class="chip">${text(x)}</span>`).join("")}</div></section>`;
    return `<section class="panel sticky"><div class="eyebrow">운영 컨텍스트</div><h3>${text(brand().name)} 운영 요약</h3><div class="mini">브랜드 톤<span>${text(brand().tone)}</span></div><div class="mini">핵심 금지표현<span>${text(brand().banned.slice(0,3).join(", "))}</span></div><div class="mini">다음 권장 액션<span>온보딩 보완 · 승인본 확보 · Gold Sample 확장</span></div><div class="sub"><strong>샘플 테스트 종료</strong><div class="mini">VARELI 테스트가 끝나면 현재 데이터 전체를 로컬 DB에 보관하고 빈 워크스페이스로 초기화할 수 있습니다.</div><div class="actions"><button class="ghost" type="button" data-archive-demo>DB 보관 및 초기화</button></div></div></section>`;
  }

  function field(name, label, value) { return `<label class="field"><span>${text(label)}</span><input name="${name}" value="${text(value)}"></label>`; }
  function area(name, label, value, studio) { return `<label class="field"><span>${text(label)}</span><textarea name="${name}" ${studio?"data-studio":""}>${text(value)}</textarea></label>`; }
  function select(name, label, arr, value, map) { return `<label class="field"><span>${text(label)}</span><select name="${name}" data-studio>${arr.map((x)=>`<option value="${x}" ${x===value?"selected":""}>${text(map?map(x):(labelText(x)||x))}</option>`).join("")}</select></label>`; }
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
    state.ui.studio = { type: "pdp", platform: "smartstore", marketId: "", productId: "", brief: "실제 운영용 새 워크스페이스입니다." };
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
    if (mode === "generate") mkOutput(state, { type: st.type, platform: st.platform, productId: p.id, marketId: m.id, brief: st.brief, status: "in_review", version: 1 });
    else mkGuide(state, { type: st.type, platform: st.platform, productId: p.id, marketId: m.id, brief: st.brief, status: "generated", version: 1 });
    state.ui.activeOutput = state.outputs[0].id; state.ui.view = mode === "generate" ? "result" : "guide_result"; ping(mode === "generate" ? "Asset Pack을 생성했습니다." : "Toolchain Pack을 생성했습니다.");
  }
  function lockToggle(key) { const [oid, sid] = key.split(":"); const s = state.outputs.find((x)=>x.id===oid)?.sections.find((x)=>x.id===sid); if (s) s.locked = !s.locked; }
  function regenVariant(o, s) {
    const p = product(o.productId), m = market(o.marketId);
    const variants = {
      "제목 3안": [`1. ${brand().preferred[1]}: ${m.country} 시장용 ${p.name}`, `2. ${p.features[2]}를 먼저 보여주는 ${p.name}`, `3. ${brand().name}가 선물 경험을 설계하는 방식`],
      "개요": [`브랜드 스토리와 판매 포인트를 분리한 뒤, 시장별 구매 포인트를 다시 묶는 구조로 재정리합니다.`, `${m.country} 타깃 기준으로 gift-ready, refill, delivery trust 순으로 메시지 우선순위를 바꿉니다.`],
      "본문": [`${brand().name}는 ${p.features.join(", ")}를 중심으로 ${m.note} 수요에 대응합니다.\n\n이번 버전은 브랜드 감성보다 구매 판단에 필요한 사실 정보와 활용 장면을 먼저 보여줍니다.`, `브랜드 스토리보다 제품 Truth를 전면에 배치한 버전입니다.\n\n- 스펙: ${p.specs.join(", ")}\n- 배송: ${p.shipping}\n- 반품: ${p.returns}\n\n마지막 문단에서만 감성 문맥을 붙입니다.`],
      "Hero": [`${p.features[2]}와 ${p.features[3]}를 한 줄로 요약한 전환형 Hero 카피.`, `${m.country} 시장용으로 선물 포인트와 배송 신뢰를 먼저 제시하는 Hero 카피.`],
      "3초 훅": [`언박싱 대신 키링 디테일로 시작하는 3초 훅`, `첫 1초에 패키지 전체 실루엣을 보여주는 탑샷 훅`]
    };
    const list = variants[s.name] || [`대안 버전 ${Date.now() % 1000}: 브랜드 문맥과 구매 포인트의 순서를 바꿔 다시 작성합니다.`];
    const next = list[(Date.now() + s.content.length) % list.length];
    return Array.isArray(next) ? next.join("\n") : next;
  }
  function refreshOutputQuality(o) { const q = score(o.type, o.sections, brand().banned); o.score = q.overall; o.status = q.state; o.rubric = q.rubric; o.checklist = buildChecklist(o); }
  function regen(key) { const [oid, sid] = key.split(":"); const o = state.outputs.find((x)=>x.id===oid); const s = o?.sections.find((x)=>x.id===sid); if (s && !s.locked) { s.content = regenVariant(o, s); s.human = false; refreshOutputQuality(o); ping("섹션을 재생성했습니다."); } }
  function editSection(oid, sid, content) { const o = state.outputs.find((x)=>x.id===oid); const s = o?.sections.find((x)=>x.id===sid); if (s) { s.content = content; s.human = true; refreshOutputQuality(o); ping("섹션 수정을 저장했습니다."); } }
  function approve(id) { const o = state.outputs.find((x)=>x.id===id); if (!o) return; if (o.checklist.some((x)=>!x.done) || o.score < 85 || o.sections.some((s)=>s.issues.some((i)=>i.includes("금지표현")))) return ping("자동 체크리스트를 모두 통과하고 85점 이상이어야 승인할 수 있습니다."); o.status = "approved"; state.logs.unshift(log("결과물 승인", `${outputLabel(o.type)} 결과물을 승인했습니다.`)); ping("승인 저장이 완료되었습니다."); }
  function duplicate(id) { const src = state.outputs.find((x)=>x.id===id); if (!src) return; const cp = JSON.parse(JSON.stringify(src)); cp.id = uid("out"); cp.originId = src.id; cp.version = (src.version || 1) + 1; cp.status = cp.mode === "generate" ? "in_review" : "generated"; cp.at = new Date().toISOString(); if (cp.mode==="generate") refreshOutputQuality(cp); state.outputs.unshift(cp); state.ui.activeOutput = cp.id; state.ui.view = cp.mode==="generate" ? "result" : "guide_result"; ping("새 버전을 복제했습니다. 현재 결과를 기준으로 새 작업본이 생성되었습니다."); }
  function gold(id) { if (!state.gold.some((x)=>x.outputId===id)) { state.gold.unshift({ id: uid("g"), outputId: id, note: "승인 후 재사용 기준 예시" }); ping("Gold Sample로 등록했습니다."); } }
  function ping(msg) { toast = msg; clearTimeout(window.__emhToast); window.__emhToast = setTimeout(() => { toast = ""; render(); }, 2000); }
  function nextVer(v) { const a = v.split(".").map(Number); a[2] = (a[2] || 0) + 1; return a.join("."); }

  if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }

  try {
    render();
  } catch (error) {
    showFatal(error && error.stack ? error.stack : String(error));
    throw error;
  }
})();

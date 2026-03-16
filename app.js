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

  const KEY = "emh-prd2-lite-v7";
  const BUILD = "2026.03.16.4";
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
  let state;

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
          { id: "m3", country: "싱가포르", lang: "영문", note: "Shopee 문법, delivery trust 강조" },
          { id: "m4", country: "한국", lang: "국문", note: "네이버 검색 문맥, 후기 신뢰, 비교 탐색, 상세 근거 강조" }
        ]
      },
      playbooks: [
        { id: "pb1", platform: "smartstore", type: "pdp", tone: "정제된 전환형", req: ["Hero", "베네핏", "스펙", "배송/반품", "FAQ"], banned: ["완치", "즉시 개선"], priority: ["구매 이유", "구성/옵션", "스펙/가격", "배송/반품", "FAQ", "CTA"], cta: ["옵션 확인", "구성 비교", "배송 조건 확인"], warnings: ["과장 효능 표현 금지", "경쟁사 직접 비교 금지"], localization: "모바일 기준 짧은 문단과 가격/배송 정보의 빠른 노출이 중요함", checklist: ["Hero에서 구매 이유가 바로 보이는가", "배송/반품이 누락되지 않았는가", "옵션 구조가 명확한가"], ver: "1.4.0" },
        { id: "pb2", platform: "blog", type: "blog_post", tone: "검색 유입형", req: ["제목 3안", "개요", "본문", "메타", "CTA"], banned: ["근거 없는 1위 주장"], priority: ["SEO 제목", "검색 의도", "제품 Truth", "시장 적합성", "브랜드 연결", "CTA"], cta: ["상세페이지 이동", "옵션 비교", "문의 유도"], warnings: ["긴 도입부 금지", "브랜드 스토리 과다 노출 금지"], localization: "모바일에서 끊어 읽기 좋은 소제목 구조 필요", checklist: ["본문에 스펙/배송 등 사실 정보가 있는가", "제목과 메타가 검색 의도에 맞는가"], ver: "1.3.2" },
        { id: "pb3", platform: "threads", type: "social_post", tone: "대화형", req: ["훅", "본문", "CTA"], banned: ["100%"], priority: ["첫 문장", "한 문장 설명", "대화 유도", "CTA"], cta: ["답글 유도", "링크 이동", "선호 포인트 질문"], warnings: ["판매 압박형 문구 금지"], localization: "짧은 호흡과 반응 유도형 문장이 중요함", checklist: ["첫 문장이 짧고 강한가", "반복 표현이 없는가"], ver: "1.2.1" },
        { id: "pb4", platform: "tiktok", type: "shortform", tone: "빠른 훅", req: ["3초 훅", "콘티", "CTA"], banned: ["기적"], priority: ["첫 1초 시각 정보", "3초 훅", "콘티 전개", "CTA"], cta: ["상세페이지 확인", "구성 확인", "저장/공유 유도"], warnings: ["첫 장면 설명 과다 금지", "텍스트 과밀 금지"], localization: "자막 길이는 짧고 오버레이는 1~2줄 내로 유지", checklist: ["첫 3초에 제품 이유가 보이는가", "자막이 과밀하지 않은가"], ver: "1.1.4" },
        { id: "pb5", platform: "youtube", type: "thumbnail", tone: "시각 집중형", req: ["추천 툴", "프롬프트", "제작 순서", "QA"], banned: ["낚시형 과장 카피"], priority: ["핵심 오브제", "짧은 카피", "색 대비", "시선 유도"], cta: ["클릭 유도", "핵심 차별점 강조"], warnings: ["텍스트 과다 금지", "제품 미노출 금지"], localization: "작은 화면에서도 첫 시선에 오브제가 읽혀야 함", checklist: ["핵심 오브제가 1초 안에 보이는가", "카피가 짧고 명확한가"], ver: "1.0.8" }
      ],
      bundles: [
        { id: "bu1", name: "smartstore_pdp_global", label: "스마트스토어 PDP", type: "pdp", platform: "smartstore", ver: "2.6.3", score: 92, draft: "Role -> Situation -> Audience -> Inputs -> Steps -> Style -> Forbidden -> Output Format 순으로 상세페이지를 설계한다. Hero에는 구매 이유, 중간에는 스펙/옵션, 하단에는 배송/반품/FAQ를 둔다.", modes: { planning: "구매 이유와 우선 메시지 순서를 정한다.", drafting: "Hero/베네핏/스펙/FAQ 초안을 만든다.", polishing: "모바일 가독성과 문장 길이를 정리한다.", reviewing: "금지표현과 누락 정보를 검수한다.", packaging: "최종 Asset Pack으로 묶는다." }, layers: ["system", "brand", "market", "platform", "output"] },
        { id: "bu2", name: "blog_seo_export", label: "SEO Blog Pack", type: "blog_post", platform: "blog", ver: "2.3.1", score: 90, draft: "검색 의도와 제품 Truth를 앞에 두고, 브랜드 스토리는 후반에서 보강한다. 제목/개요/본문/메타/CTA를 하나의 SEO 팩으로 만든다.", modes: { planning: "검색 키워드와 제목 전략을 정한다.", drafting: "개요와 본문을 정보형 구조로 작성한다.", polishing: "메타와 CTA를 다듬는다.", reviewing: "과장, 반복, 키워드 남용을 점검한다.", packaging: "블로그용 Asset Pack으로 정리한다." }, layers: ["system", "industry", "brand", "market", "output"] },
        { id: "bu3", name: "threads_export_brand", label: "Threads / X", type: "social_post", platform: "threads", ver: "2.2.0", score: 89, draft: "훅 -> 설명 -> 반응 유도 -> CTA 순으로 짧게 설계한다. 감성은 유지하되, 과장 문구와 반복 카피는 제거한다.", modes: { planning: "첫 문장과 반응 유도 포인트를 정한다.", drafting: "짧은문장 구조로 본문을 쓴다.", polishing: "과장 표현과 장황함을 제거한다.", reviewing: "반복과 판매 압박을 체크한다.", packaging: "게시용 카피와 대안안을 묶는다." }, layers: ["system", "brand", "market", "platform", "output"] },
        { id: "bu4", name: "shortform_storyboard_tiktok", label: "Shortform Storyboard", type: "shortform", platform: "tiktok", ver: "1.9.7", score: 87, draft: "3초 훅 -> 15초 콘티 -> 샷리스트 -> 자막 -> CTA 순으로 작성한다. 첫 장면에서 제품의 구매 이유가 보이도록 한다.", modes: { planning: "첫 3초 훅과 장면 흐름을 정한다.", drafting: "콘티, 샷리스트, 자막 초안을 만든다.", polishing: "자막 길이와 리듬을 조정한다.", reviewing: "첫 장면 명확성, 과밀 자막 여부를 점검한다.", packaging: "스토리보드 팩으로 정리한다." }, layers: ["system", "brand", "market", "platform", "output"] },
        { id: "bu5", name: "thumbnail_prompt_youtube", label: "Thumbnail Prompt", type: "thumbnail", platform: "youtube", ver: "1.4.4", score: 88, draft: "핵심 오브제, 짧은 카피, 배경 대비, 감정 톤을 먼저 정한 뒤 이미지 프롬프트로 변환한다.", modes: { planning: "핵심 오브제와 클릭 포인트를 정한다.", drafting: "썸네일 프롬프트와 카피안을 만든다.", polishing: "텍스트 길이와 색 대비를 다듬는다.", reviewing: "낚시성 과장과 제품 미노출을 점검한다.", packaging: "툴별 프롬프트와 QA를 정리한다." }, layers: ["system", "brand", "market", "platform", "output"] }
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
  function load() {
    try {
      const stored = JSON.parse(localStorage.getItem(KEY));
      return hydrateState(stored || init());
    } catch {
      return init();
    }
  }
  function init() { const s = seed(); seedOutputs(s); return s; }
  function save() { localStorage.setItem(KEY, JSON.stringify(state)); }
  function text(v) { return String(v || "").replace(/[&<>"]/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[m])); }
  function avg(a) { return a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0; }
  function locale() { return (state && state.ui && state.ui.locale) || "ko"; }
  state = load();
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

  function titleOptions(value) {
    return String(value || "")
      .split("\n")
      .map((line) => line.replace(/^\s*\d+\.\s*/, "").trim())
      .filter(Boolean);
  }

  function internalMetaPattern() {
    return /(역할:|검색 의도:|타깃 독자:|톤앤매너 적용|브랜드 스토리 연결|이번 버전은|개요 구조를|브랜드 소개형이 아니라|전환형 Hero|대안 버전 [ABC]|우선 메시지 순서)/;
  }

  function needsSanitizeOutput(output) {
    if (!output || output.mode !== "generate") return false;
    return (output.sections || []).some((section) => internalMetaPattern().test(section.content || ""));
  }

  function hydrateState(s) {
    if (!s || !s.ui || !s.workspace) return init();
    s.outputs = s.outputs || [];
    s.gold = s.gold || [];
    s.database = s.database || [];
    s.logs = s.logs || [];
    s.me = s.me || { name: "현재 사용자", role: "Company Admin" };
    s.workspace.products = s.workspace.products || [];
    s.workspace.markets = s.workspace.markets || [];
    if (!s.workspace.markets.some((item) => item.country === "한국")) {
      s.workspace.markets.push({ id: "m4", country: "한국", lang: "국문", note: "네이버 검색 문맥, 후기 신뢰, 비교 탐색, 상세 근거 강조" });
    }
    if (/김현우/.test(s.me.name || "")) s.me.name = "현재 사용자";
    s.outputs.forEach((output) => {
      if (output.mode !== "generate") return;
      const p = productOf(s, output.productId);
      const m = marketOf(s, output.marketId);
      output.profile = output.profile || resolveProfile(output.rawProfile, m, brandOf(s));
      if (needsSanitizeOutput(output)) {
        const regenerated = gen(s, output.type, p, m, output.brief, output.profile);
        output.sections = regenerated.map((section, index) => ({
          ...section,
          id: output.sections[index]?.id || section.id,
          locked: false,
          human: false
        }));
      }
      const q = score(output.type, output.sections, brandOf(s).banned);
      output.score = q.overall;
      output.rubric = q.rubric;
      if (output.status !== "approved") output.status = q.state;
      output.checklist = buildChecklist(output, s);
    });
    return s;
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
    if ((m?.country || "").includes("한국") || note.includes("네이버") || note.includes("후기 신뢰")) {
      return { brandTone: "trustworthy", audienceAge: "25_35", expressionStyle: "standard" };
    }
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
    const local = (m?.country || "").includes("한국")
      ? ["핸드크림 선물", "리필 핸드크림", "상세페이지", "네이버 검색"]
      : ["giftable beauty", "refillable", "K-beauty export"];
    return [b.name, p.name, m.country, p.cat].concat(local).filter(Boolean);
  }

  function primaryPlatform(type) {
    return {
      pdp: "smartstore",
      blog_post: "blog",
      social_post: "threads",
      shortform: "tiktok",
      thumbnail: "youtube",
      banner: "smartstore"
    }[type] || "";
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
    const pb = playbookOf(s, type, primaryPlatform(type));
    const bu = bundleOf(s, type, primaryPlatform(type));
    const facts = factSummary(p);
    return {
      role: `너는 ${outputLabel(type)} 전용 전략가이자 SEO/전환 최적화 기획자다.`,
      situation: `브랜드 톤을 유지하되 ${m.country} 시장에서 바로 사용할 수 있는 ${outputLabel(type)} 초안을 만든다. 모바일 가독성과 플랫폼 문법을 우선한다.`,
      audience: `${profileLabel("audienceAge", profile.audienceAge)} 사용자를 기본 독자로 보고, ${audienceGuide(profile)}`,
      inputs: [`제품명: ${p.name}`, `핵심 특징: ${benefitSummary(p)}`, `차별점: ${p.features[2] || p.features[0]}`, `제품 사실 요약: ${facts}`, `브랜드 스토리: ${b.story}`, `시장 메모: ${m.note}`, `추가 요청: ${brief || "없음"}`],
      steps: [
        "입력된 제품 정보를 먼저 요약한다.",
        `플랫폼 구조와 표현 방식의 장점을 먼저 설계한다.${pb ? ` 우선 메시지 순서: ${pb.priority.join(" -> ")}` : ""}`,
        "제품 기능을 고객 혜택 중심으로 재해석한다.",
        "사용 장면과 구매 이유를 연결하는 스토리텔링 문단을 넣는다.",
        `SEO 키워드(${keywords})를 자연스럽게 분산 배치한다.`,
        "근거가 필요한 정보와 감성 설명을 같은 문단에 섞지 말고 블록 단위로 분리한다.",
        "이미지나 영상이 필요한 경우 핵심 오브제, 배경, 구도, 자막 위치까지 명시한다.",
        "모바일에서 읽기 좋게 짧은 문단과 명확한 소제목을 사용한다.",
        `최종 결과를 ${outputFormatGuide(type)} 순으로 정리한다.`
      ],
      style: [toneGuide(profile), mannerGuide(profile), "과장 광고처럼 보이는 표현은 피하고 전문 용어는 바로 풀어서 설명한다.", "문단은 모바일 기준 2~4문장 이내로 끊고, 소제목마다 핵심 메시지를 한 줄로 먼저 제시한다.", "브랜드 감성 문장은 후반부에서 보강하고, 초반에는 구매 판단 정보와 제품 사실을 우선한다.", pb ? `플레이북 톤: ${pb.tone}` : "", bu ? `번들 작성 원칙: ${bu.draft}` : ""].filter(Boolean),
      forbidden: [
        "사실 확인이 안 되는 성능 표현을 단정하지 않는다.",
        "경쟁사를 직접 언급하거나 깎아내리지 않는다.",
        "불필요하게 긴 문단과 같은 표현 반복을 피한다.",
        "사용자가 바로 활용할 수 없는 추상적인 문장만 길게 늘어놓지 않는다."
      ].concat(pb ? pb.warnings : []),
      review: [
        `필수 사실 정보: ${facts}`,
        `적용 프로필: ${profileSummary(profile)}`,
        ...(pb ? pb.checklist : []),
        ...(bu && bu.modes ? Object.entries(bu.modes).map(([mode, desc]) => `${mode}: ${desc}`) : [])
      ]
    };
  }

  function visualPrompt(kind, b, p, m, profile, extra) {
    return [
      `${b.name} ${p.name}`,
      `${kind} visual for ${m.country} market`,
      `brand tone ${profileLabel("brandTone", profile.brandTone)}`,
      `audience ${profileLabel("audienceAge", profile.audienceAge)}`,
      `expression ${profileLabel("expressionStyle", profile.expressionStyle)}`,
      `must show ${p.features[2] || p.features[0]}, ${p.features[3] || p.features[1]}, ${p.specs[0] || p.cat}`,
      "clean premium beauty styling",
      "clear product silhouette",
      "soft but directional lighting",
      "high legibility composition",
      "leave safe area for headline or overlay text",
      extra
    ].filter(Boolean).join(", ");
  }

  function buildBlogPack(s, p, m, brief, profile) {
    const b = brandOf(s);
    const code = marketLangCode(m);
    const titles = {
      ko: [
        `${m.country} 시장에서 찾는 센스 있는 선물, ${p.name}`,
        `${b.name} ${p.name}: 향과 구성의 만족감을 한 번에 담은 기프트 키트`,
        `선물용 핸드케어를 찾는다면, ${p.name}를 먼저 보는 이유`
      ],
      en: [
        `${p.name}: a gift-ready hand care set for ${m.country} shoppers`,
        `Why ${b.name} ${p.name} works as both a self-gift and a present`,
        `A practical gift guide built around ${p.name}`
      ],
      ja: [
        `${m.country}市場で選ばれるギフト向け ${p.name}`,
        `${b.name} ${p.name} が贈り物として映える理由`,
        `${p.name} を上手に紹介するギフトガイド`
      ],
      zh: [
        `${p.name}：适合 ${m.country} 市场的礼赠型手部护理套装`,
        `为什么 ${b.name} ${p.name} 既适合送礼也适合自用`,
        `围绕 ${p.name} 写给消费者的实用礼赠指南`
      ]
    };
    const outline = localizedPhrase(code, {
      ko: `${p.name}는 선물로도 좋고 직접 사용하기에도 만족도가 높은 구성으로 완성된 기프트 키트입니다. ${m.country} 시장에서는 후기 신뢰와 구체적인 제품 정보가 중요하므로, 향 경험과 구성품, 배송 정보를 분명하게 전달하는 흐름으로 소개합니다.`,
      en: `${p.name} is a gift-ready kit designed to feel thoughtful and easy to understand at a glance. For the ${m.country} market, the copy leads with product facts, bundle value, and delivery trust before moving into brand mood.`,
      ja: `${p.name} は、ギフトとしても自分用としても選びやすい構成のキットです。${m.country}市場では、香りの印象だけでなく構成内容と配送情報をわかりやすく伝えることが重要です。`,
      zh: `${p.name} 是一款既适合送礼也适合自用的组合套装。面向 ${m.country} 市场时，需要先把产品构成、香气体验与配送信息讲清楚，再自然连接品牌氛围。`
    });
    const body = localizedPhrase(code, {
      ko: `## 선물로 선택하기 좋은 이유\n${p.name}는 ${p.features[0]}, ${p.features[1]}, ${p.features[2] || p.features[0]}를 한 세트 안에서 경험할 수 있도록 구성된 ${p.cat} 아이템입니다. 처음 보는 사람도 제품의 매력을 빠르게 이해할 수 있어, 센스 있는 선물을 찾을 때 부담 없이 고르기 좋습니다.\n\n## 직접 써도 만족스러운 구성\n이 제품의 장점은 단순히 보기 좋은 패키지에 그치지 않는다는 점입니다. ${p.features[3] || p.features[1]} 구조 덕분에 한 번 쓰고 끝나는 느낌보다 오래 곁에 두고 싶은 아이템으로 인식되며, 향 카드와 리본 박스가 더해져 받는 순간의 만족감도 높여 줍니다.\n\n## 구매 전에 꼭 확인하면 좋은 정보\n구성은 ${p.specs.join(", ")} 기준으로 안내되며 가격은 ${p.price}입니다. 배송은 ${p.shipping}, 반품은 ${p.returns} 기준으로 확인할 수 있어 선물용 구매에서도 비교적 안심하고 선택할 수 있습니다.\n\n## ${b.name}가 전하고 싶은 분위기\n${b.story} ${p.name}는 이 브랜드의 감성을 과하게 설명하기보다, 실제로 선물하고 싶은 순간과 사용 장면이 자연스럽게 떠오르도록 설계된 제품입니다.\n\n## 마무리\n${brief || `${p.name}의 구성과 분위기를 한 번에 확인해 보세요.`}`,
      en: `## Why it works as a gift\n${p.name} is built around ${p.features[0]}, ${p.features[1]}, and ${p.features[2] || p.features[0]}, making it easy to understand as a thoughtful ${p.cat} set from the very first glance.\n\n## Why it still feels practical\nThe appeal goes beyond presentation. With ${p.features[3] || p.features[1]} built into the experience, the product feels useful after the first impression, while the gift-ready details make it feel polished and complete.\n\n## Key buying information\nThe bundle is offered with ${p.specs.join(", ")} at ${p.price}. Shipping follows ${p.shipping}, and returns follow ${p.returns}, which helps reduce friction for buyers comparing gifting options.\n\n## Brand connection\n${b.story} ${p.name} brings that brand mood into a product that still feels concrete, easy to choose, and ready to use.\n\n## Closing\n${brief || `See the full bundle details and choose the option that fits your market best.`}`,
      ja: `## ギフトとして選びやすい理由\n${p.name} は ${p.features[0]}、${p.features[1]}、${p.features[2] || p.features[0]} をひとつのセットで体験できる ${p.cat} アイテムです。初めて見る方にも魅力が伝わりやすく、贈り物として選びやすい構成です。\n\n## 自分用としても満足しやすい構成\n見た目の印象だけでなく、${p.features[3] || p.features[1]} の価値があるため、長く使いたくなる理由も明確です。香りカードやリボンボックスが加わることで、受け取った瞬間の満足感も高まります。\n\n## 購入前に確認したい情報\n構成は ${p.specs.join(", ")}、価格は ${p.price} です。配送は ${p.shipping}、返品は ${p.returns} を基準に確認できます。\n\n## ブランドとのつながり\n${b.story} ${p.name} はブランド感性を押しつけるのではなく、贈る場面と使う場面が自然に浮かぶように作られています。\n\n## まとめ\n${brief || `${p.name} の構成と雰囲気をまとめてご確認ください。`}`,
      zh: `## 为什么适合作为礼物\n${p.name} 围绕 ${p.features[0]}、${p.features[1]} 与 ${p.features[2] || p.features[0]} 展开，是一款一眼就能理解其礼赠价值的 ${p.cat} 组合。\n\n## 为什么也适合自用\n它的吸引力不仅在于包装。${p.features[3] || p.features[1]} 让产品不只是“好看”，也有持续使用的理由，而香卡与礼盒细节又提升了收到时的仪式感。\n\n## 购买前值得关注的信息\n产品规格为 ${p.specs.join(", ")}，价格为 ${p.price}。配送按 ${p.shipping} 执行，退换按 ${p.returns} 说明，可帮助消费者更安心地做出比较。\n\n## 品牌氛围的连接\n${b.story} ${p.name} 不靠空泛的情绪表达，而是通过具体产品体验把品牌气质落到真实场景中。\n\n## 结尾\n${brief || `欢迎进一步查看完整组合与购买信息。`}`
    });
    const meta = localizedPhrase(code, {
      ko: `${b.name} ${p.name}의 구성, 향 경험, 배송 정보를 한 번에 정리한 ${m.country} 시장용 소개 글.`,
      en: `A market-ready overview of ${b.name} ${p.name}, covering bundle value, scent appeal, and delivery information for ${m.country}.`,
      ja: `${m.country} 市場向けに ${b.name} ${p.name} の構成、香り体験、配送情報を整理した紹介文。`,
      zh: `面向 ${m.country} 市场整理的 ${b.name} ${p.name} 介绍文，涵盖组合价值、香气体验与配送信息。`
    });
    const cta = localizedPhrase(code, {
      ko: `${p.name}의 구성과 배송 정보를 자세히 보고 싶다면 상세페이지에서 바로 확인해 보세요.`,
      en: `See the full detail page for bundle options and delivery information.`,
      ja: `${p.name} の構成と配送情報は詳細ページでご確認ください。`,
      zh: `如需查看完整组合与配送信息，请进入详情页确认。`
    });
    const imagePrompt = visualPrompt("SEO blog hero image", b, p, m, profile, "editorial still life, ivory stone surface, one hero product centered, supporting package and keyring in the background, no exaggerated effects");
    return [titles[code].join("\n"), outline, body, meta, cta, imagePrompt];
  }

  function buildSocialPack(s, p, m, brief, profile) {
    const b = brandOf(s);
    const code = marketLangCode(m);
    return [
      localizedPhrase(code, {
        ko: `선물 고를 때, 보기 좋은데 실용성까지 갖춘 구성이 더 오래 기억됩니다.`,
        en: `Gift picks land harder when they feel polished and practical at the same time.`,
        ja: `贈り物は、見た目だけでなく実用性まで感じられると印象に残ります。`,
        zh: `礼物如果兼顾好看与实用，往往更容易让人记住。`
      }),
      localizedPhrase(code, {
        ko: `${b.name} ${p.name}는 향만 강조하는 제품이 아닙니다. ${p.features[2] || p.features[0]}로 선물의 완성도를 높이고, ${p.features[3] || p.features[1]}로 오래 두고 쓰고 싶은 이유를 더했습니다. ${brief || `${m.country} 시장에서도 부담 없이 소개하기 좋은 구성입니다.`}`,
        en: `${b.name} ${p.name} is not just about scent. It pairs a gift-ready presentation with a reason to keep using it, making the product feel more complete from the first look. ${brief || ""}`,
        ja: `${b.name} ${p.name} は香りだけでなく、ギフトとしての完成度と長く使いたくなる理由をあわせて伝えられる製品です。${brief || ""}`,
        zh: `${b.name} ${p.name} 不只是强调香气，而是把礼赠价值与持续使用理由放在一起，让产品从第一眼开始就更完整。${brief || ""}`
      }),
      localizedPhrase(code, {
        ko: `향을 설명하는 데서 끝나지 않고, 선물로 고르기 좋은 이유와 직접 쓰고 싶어지는 포인트까지 함께 담아 보세요.`,
        en: `Go beyond scent and show why the product works both as a gift and as something worth keeping close.`,
        ja: `香りだけで終わらせず、ギフトとして選びやすい理由と自分でも使いたくなるポイントを一緒に伝えてみてください。`,
        zh: `不要停留在香气本身，而要一起写出它适合作为礼物、也适合留给自己使用的理由。`
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
    return [
      localizedPhrase(code, {
        ko: `${p.features[2] || p.features[0]}의 완성도와 ${p.features[3] || p.features[1]}의 실용성을 함께 담은 ${b.name} ${p.name}`,
        en: `${b.name} ${p.name}: a gift-ready set with practical value built in`,
        ja: `${b.name} ${p.name}：ギフト感と実用性を両立したセット`,
        zh: `${b.name} ${p.name}：兼顾礼赠感与实用价值的组合`
      }),
      localizedPhrase(code, {
        ko: `선물로 고르기 좋은 이유는 패키지를 보는 순간 분명해집니다. ${p.features[2] || p.features[0]}가 주는 첫인상에 ${p.features[0]}의 사용감, ${p.features[1]}의 선택 폭, ${p.features[3] || p.features[1]}의 지속 사용 가치가 더해져 한 번의 구매로 만족감을 높여 줍니다.`,
        en: `It reads as a gift at first glance, then earns more value through texture, scent choice, and practical repeat-use logic.`,
        ja: `見た瞬間にギフトとして伝わり、その後に使用感や香りの選択肢、継続して使いたくなる価値がしっかり続きます。`,
        zh: `它先用礼赠感抓住目光，再通过使用感、香型选择与持续使用价值把购买理由补完整。`
      }),
      localizedPhrase(code, {
        ko: `제품명: ${p.name}\n카테고리: ${p.cat}\n구성: ${p.specs.join(", ")}\n가격: ${p.price}\n추천 포인트: ${brief || `${m.country} 시장에서 선물용과 자가 사용 모두를 고려한 구성`}`,
        en: `Product: ${p.name}\nCategory: ${p.cat}\nBundle: ${p.specs.join(", ")}\nPrice: ${p.price}\nRecommended angle: ${brief || "Balanced for gifting and personal use"}`,
        ja: `商品名: ${p.name}\nカテゴリ: ${p.cat}\n構成: ${p.specs.join(", ")}\n価格: ${p.price}\n推奨ポイント: ${brief || "ギフトと自分用の両方に向いた構成"}`,
        zh: `产品名：${p.name}\n类别：${p.cat}\n规格：${p.specs.join(", ")}\n价格：${p.price}\n推荐角度：${brief || "兼顾送礼与自用场景"}`
      }),
      localizedPhrase(code, {
        ko: `배송은 ${p.shipping} 기준으로 진행되며, 반품은 ${p.returns} 기준으로 안내됩니다. 구매 전 확인이 필요한 정보가 한눈에 보이도록 구성해 선물용 주문에서도 비교적 안심하고 선택할 수 있습니다.`,
        en: `Shipping follows ${p.shipping}, and returns follow ${p.returns}. The structure keeps key buying information easy to scan before checkout.`,
        ja: `配送は ${p.shipping}、返品は ${p.returns} を基準に案内します。購入前に必要な情報を一目で確認しやすい構成です。`,
        zh: `配送按 ${p.shipping} 执行，退换按 ${p.returns} 说明。关键信息集中展示，方便下单前快速确认。`
      }),
      localizedPhrase(code, {
        ko: `Q. 어떤 분에게 잘 맞나요?\nA. 선물용으로도 좋고 직접 오래 쓰기 좋은 구성을 찾는 분께 잘 맞습니다.\n\nQ. 구매 전에 무엇을 확인하면 좋나요?\nA. 구성품, 향 옵션, 배송 정보, 반품 기준을 순서대로 확인해 보시면 선택이 훨씬 쉬워집니다.`,
        en: `Q. Who is this product for?\nA. Buyers looking for a giftable product with scent value and refill logic.\n\nQ. What should appear first on the page?\nA. Lead with the gift reason, then show specs and bundle details, then close trust gaps with shipping and returns.`,
        ja: `Q. どんな顧客向けですか？\nA. ギフト性、香り体験、リフィル構造を一緒に求める顧客向けです。\n\nQ. どの情報を先に見せるべきですか？\nA. Heroで購入理由、中盤で仕様と構成、下部で配送・返品を提示する順序が有効です。`,
        zh: `Q. 这款产品适合谁？\nA. 适合重视礼赠价值、香气体验和补充装逻辑的用户。\n\nQ. 页面上应先展示什么？\nA. 先放购买理由，其次展示规格与组合信息，最后用物流与退换建立信任。`
      }),
      localizedPhrase(code, {
        ko: `${p.name}의 구성과 향 옵션, 배송 정보를 지금 바로 확인해 보세요.`,
        en: `Use the detail page to compare scent options, bundle details, and shipping terms for the ${m.country} market.`,
        ja: `${m.country} 市場向けに、香り・構成・配送条件を確認できる詳細ページ導線を配置してください。`,
        zh: `引导用户查看详情页中的香型、组合与配送条件，并切换为 ${m.country} 市场版文案。`
      }),
      localizedPhrase(code, {
        ko: `배너 카드 1. 선물처럼 바로 이해되는 구성\n배너 카드 2. 향 옵션을 고르는 즐거움\n배너 카드 3. 리필 구조로 이어지는 재사용 경험\n배너 카드 4. ${m.country} 시장용 배송/반품 신뢰 안내\n비주얼 지시: ${visualPrompt("PDP banner", b, p, m, profile, "4-card split layout, premium neutral palette, short headline safe area on each card")}`,
        en: `Banner card 1. A bundle that reads instantly as a gift\nBanner card 2. Scent options worth comparing\nBanner card 3. Refill logic that supports repeat use\nBanner card 4. Shipping and returns trust for the ${m.country} market\nVisual direction: ${visualPrompt("PDP banner", b, p, m, profile, "4-card split layout, premium neutral palette, short headline safe area on each card")}`,
        ja: `バナーカード1. ギフトとしてすぐ伝わる構成\nバナーカード2. 香りを選ぶ楽しさ\nバナーカード3. リフィルで続く再使用体験\nバナーカード4. ${m.country} 向け配送・返品信頼案内\nビジュアル指示: ${visualPrompt("PDP banner", b, p, m, profile, "4-card split layout, premium neutral palette, short headline safe area on each card")}`,
        zh: `横幅卡片1：一眼就懂的礼赠组合\n横幅卡片2：值得比较的香型选择\n横幅卡片3：补充装带来的持续使用体验\n横幅卡片4：面向 ${m.country} 市场的物流与退换信任说明\n视觉指令：${visualPrompt("PDP banner", b, p, m, profile, "4-card split layout, premium neutral palette, short headline safe area on each card")}`
      })
    ];
  }

  function buildShortformPack(s, p, m, brief, profile) {
    const b = brandOf(s);
    const code = marketLangCode(m);
    return [
      localizedPhrase(code, {
        ko: `선물처럼 보이는데, 직접 쓰고 싶어지는 이유까지 보이는 순간.`,
        en: `0-3 sec: open on the detail that makes the bundle instantly feel gift-ready`,
        ja: `0〜3秒: ギフト性が一目で伝わるディテールから開始`,
        zh: `0-3秒：先用一眼就能看懂礼赠价值的细节镜头开场`
      }),
      localizedPhrase(code, {
        ko: `0-3초: 패키지와 키 포인트가 한 번에 보이는 언박싱 컷\n4-7초: 향 옵션 또는 구성품을 빠르게 보여 주며 선택의 재미 강조\n8-11초: ${p.features[3] || p.features[1]} 포인트를 손동작으로 자연스럽게 설명\n12-15초: 제품명과 함께 상세페이지 확인 CTA로 마무리`,
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
      visualPrompt("shortform thumbnail", b, p, m, profile, "vertical-first composition, top-third title safe area, product in hand, gift-ready unboxing moment, premium but warm emotional hook")
    ];
  }

  function buildFaqPack(s, p, m, brief, profile) {
    const code = marketLangCode(m);
    return [
      localizedPhrase(code, {
        ko: `배송 문의 / 구성 문의 / 향 옵션 문의 / B2B 대량 문의`,
        en: `Shipping / bundle details / scent options / B2B bulk inquiry`,
        ja: `配送 / 構成 / 香りオプション / B2B大量問い合わせ`,
        zh: `物流咨询 / 组合内容 / 香型选择 / B2B 批量咨询`
      }),
      localizedPhrase(code, {
        ko: `${p.name}는 ${p.shipping} 기준으로 발송되며, 반품은 ${p.returns} 정책에 따라 안내됩니다. 구성품과 향 옵션은 상세페이지 기준으로 확인해 주시면 가장 정확합니다. ${brief || ""}`,
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
        ko: `- 선물 개봉 순간이 강한 제품입니다.\n- 향과 패키지, ${p.features[3] || p.features[1]} 포인트를 각각 따로 보여 줄 수 있습니다.\n- ${m.country} 시장 기준으로도 자연스럽게 소개하기 좋은 구성입니다.\n- ${brief || "언박싱과 사용 장면을 함께 보여 주는 협업에 특히 잘 맞습니다."}`,
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
      ko: `1. 역할 정의\n${frame.role}\n\n2. 상황 설명\n${frame.situation}\n\n3. 목표 독자 정의\n${frame.audience}\n\n4. 입력값 정의\n${frame.inputs.map((item, index) => `${index + 1}. ${item}`).join("\n")}\n\n5. 작업 지시\n${frame.steps.map((step, index) => `${index + 1}. ${step}`).join("\n")}\n\n6. 스타일 가이드\n${frame.style.map((item) => `- ${item}`).join("\n")}\n\n7. 금지사항\n${frame.forbidden.map((item) => `- ${item}`).join("\n")}\n\n8. 검수 포인트\n${frame.review.map((item) => `- ${item}`).join("\n")}\n\n9. 비주얼/레이아웃 지시\n- 핵심 오브제는 첫 시선에 제품 자체가 읽히도록 배치한다.\n- 텍스트 오버레이가 필요한 경우 상단 또는 좌측에 safe area를 남긴다.\n- 과한 소품보다 제품, 패키지, 옵션 구조가 먼저 보이도록 구성한다.\n- ${m.country} 시장 메모(${m.note})와 어긋나는 연출은 피한다.\n\n10. 출력 형식\n${outputFormatGuide(o.type)}\n\n브랜드 톤앤매너 선택값: ${profileLabel("brandTone", profile.brandTone)}\n사용자 연령대 선택값: ${profileLabel("audienceAge", profile.audienceAge)}\n표현 방식 선택값: ${profileLabel("expressionStyle", profile.expressionStyle)}\n시장 메모: ${m.note}\n금지표현: ${b.banned.join(", ")}`,
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
    mkOutput(s, { type: "blog_post", platform: "blog", productId: "p2", marketId: "m4", brief: "네이버 검색 유입 기준으로 선물 이유, 구성품, 배송 신뢰를 순서대로 보여 주세요.", status: "approved" });
    mkOutput(s, { type: "pdp", platform: "smartstore", productId: "p1", marketId: "m4", brief: "네이버 검색 유입 기준으로 선물 이유, 후기 신뢰, 배송/반품 근거를 먼저 배치해 주세요.", status: "approved" });
    mkOutput(s, { type: "pdp", platform: "shopee", productId: "p1", marketId: "m3", brief: "gift-ready와 delivery trust를 함께 보여주세요.", status: "in_review" });
    mkOutput(s, { type: "shortform", platform: "tiktok", productId: "p2", marketId: "m1", brief: "팝업 기프트 세트 런칭용 15초 훅", status: "revision_required", bad: "피부를 즉시 개선하는 향기 루틴" });
    mkOutput(s, { type: "shortform", platform: "shorts", productId: "p2", marketId: "m4", brief: "선물 언박싱과 구성품 비교가 바로 보이는 한국 시장용 쇼츠로 구성해 주세요.", status: "approved" });
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

  function buildChecklist(row, sourceState) {
    const ref = sourceState || state;
    const pb = playbookOf(ref, row.type, row.platform) || ref.playbooks.find((x) => x.type === row.type);
    return [
      { id: uid("c"), label: "금지표현 없음", done: !row.sections.some((s) => s.issues.some((i) => i.includes("금지표현"))) },
      { id: uid("c"), label: "섹션 최소 길이 충족", done: row.sections.every((s) => s.content.length >= 24) },
      { id: uid("c"), label: "핵심 사실 정보 포함", done: row.sections.some((s) => /배송|shipping|반품|return|스펙|spec/.test(s.content)) },
      { id: uid("c"), label: "점수 85점 이상", done: row.score >= 85 },
      { id: uid("c"), label: "플랫폼 핵심 섹션 포함", done: row.sections.length >= OUT[row.type].sections.length }
    ].concat((pb?.checklist || []).map((item) => ({ id: uid("c"), label: item, done: row.score >= 75 })));
  }

  function sectionMap(o) {
    return Object.fromEntries((o.sections || []).map((section) => [section.name, section.content]));
  }

  function visualAssets(o) {
    return (o.sections || []).filter((section) => /이미지 프롬프트|썸네일 프롬프트|배너 문안/.test(section.name));
  }

  function uploadChunks(o) {
    const s = sectionMap(o);
    const p = product(o.productId);
    if (o.type === "blog_post") {
      const titles = titleOptions(s["제목 3안"]);
      const mainTitle = titles[0] || p.name;
      const altTitles = titles.slice(1).map((title) => `- ${title}`).join("\n");
      return [
        { key: "blog-title", label: "블로그 제목", value: mainTitle },
        { key: "blog-meta", label: "메타 설명", value: s["메타"] || "" },
        { key: "blog-body", label: "블로그 본문", value: `${s["개요"] || ""}\n\n${s["본문"] || ""}\n\n${s["CTA"] || ""}`.trim() },
        { key: "blog-alt", label: "대체 제목 2안", value: altTitles || "추가 대체 제목 없음" },
        { key: "blog-image", label: "대표 이미지 프롬프트", value: s["이미지 프롬프트"] || "" }
      ];
    }
    if (o.type === "pdp") {
      const productDesc = [
        s["Hero"] || "",
        "",
        "상품 소개",
        s["베네핏"] || "",
        "",
        "상품 정보",
        s["스펙"] || "",
        "",
        "배송 및 반품 안내",
        s["배송/반품"] || "",
        "",
        "자주 묻는 질문",
        s["FAQ"] || "",
        "",
        "구매 유도 문구",
        s["CTA"] || ""
      ].join("\n").trim();
      return [
        { key: "pdp-hero", label: "스마트스토어 상단 헤드라인", value: s["Hero"] || p.name },
        { key: "pdp-body", label: "상세페이지 본문 블록", value: productDesc },
        { key: "pdp-faq", label: "FAQ 블록", value: s["FAQ"] || "" },
        { key: "pdp-banner", label: "배너 문안", value: s["배너 문안"] || "" },
        { key: "pdp-cta", label: "하단 CTA", value: s["CTA"] || "" }
      ];
    }
    if (o.type === "shortform") {
      return [
        { key: "short-hook", label: "촬영 오프닝 대사", value: s["3초 훅"] || "" },
        { key: "short-script", label: "15초 촬영 스크립트", value: s["15초 콘티"] || "" },
        { key: "short-captions", label: "영상 자막 세트", value: s["자막"] || "" },
        { key: "short-shots", label: "샷리스트", value: s["샷리스트"] || "" },
        { key: "short-thumb", label: "썸네일 프롬프트", value: s["썸네일 프롬프트"] || "" }
      ];
    }
    if (o.type === "social_post") {
      return [
        { key: "social-main", label: "게시용 본문", value: `${s["훅"] || ""}\n\n${s["본문"] || ""}\n\n${s["CTA"] || ""}\n\n${s["해시태그"] || ""}`.trim() },
        { key: "social-alt", label: "대체 카피", value: s["대안 카피"] || "" }
      ];
    }
    return (o.sections || []).map((section) => ({ key: section.id, label: section.name, value: section.content }));
  }

  function compiledOutput(o) {
    const s = sectionMap(o);
    if (o.type === "blog_post") {
      const titles = titleOptions(s["제목 3안"]);
      const mainTitle = titles[0] || product(o.productId).name;
      const alternates = titles.slice(1);
      return `${mainTitle}\n\n${s["개요"] || ""}\n\n${s["본문"] || ""}\n\n${s["CTA"] || ""}\n\n메타 설명\n${s["메타"] || ""}${alternates.length ? `\n\n대체 제목\n- ${alternates.join("\n- ")}` : ""}`;
    }
    if (o.type === "pdp") {
      return `${s["Hero"] || product(o.productId).name}\n\n상품 소개\n${s["베네핏"] || ""}\n\n상품 정보\n${s["스펙"] || ""}\n\n배송 및 반품 안내\n${s["배송/반품"] || ""}\n\n자주 묻는 질문\n${s["FAQ"] || ""}\n\n구매 유도 문구\n${s["CTA"] || ""}\n\n배너 문안\n${s["배너 문안"] || ""}`;
    }
    if (o.type === "shortform") {
      return `오프닝 훅\n${s["3초 훅"] || ""}\n\n15초 콘티\n${s["15초 콘티"] || ""}\n\n샷리스트\n${s["샷리스트"] || ""}\n\n자막\n${s["자막"] || ""}\n\n마무리 CTA\n${s["CTA"] || ""}\n\n썸네일 프롬프트\n${s["썸네일 프롬프트"] || ""}`;
    }
    if (o.type === "social_post") {
      return `${s["훅"] || ""}\n\n${s["본문"] || ""}\n\n${s["CTA"] || ""}\n\n${s["해시태그"] || ""}\n\n대안 카피\n${s["대안 카피"] || ""}`;
    }
    if (o.type === "faq") {
      return `문의 유형\n${s["질문 분류"] || ""}\n\n표준 답변\n${s["답변"] || ""}\n\n짧은 답변\n${s["짧은 답변"] || ""}\n\n정중 버전\n${s["정중 버전"] || ""}\n\n에스컬레이션 기준\n${s["에스컬레이션"] || ""}`;
    }
    if (o.type === "influencer") {
      return `첫 제안 메시지\n${s["첫 제안"] || ""}\n\n팔로업 메시지\n${s["팔로업"] || ""}\n\n협업 포인트\n${s["협업 포인트"] || ""}\n\n제공 가치\n${s["제공 가치"] || ""}`;
    }
    return (o.sections || []).map((section) => `[${section.name}]\n${section.content}`).join("\n\n");
  }

  function compiledOutputHtml(o) {
    return text(compiledOutput(o)).replace(/\n/g, "<br>");
  }

  function richTextHtml(value) {
    return text(value || "").replace(/\n/g, "<br>");
  }

  function renderCard(title, body, extraClass) {
    return `<article class="render-card ${extraClass || ""}"><div class="render-label">${text(title)}</div><div class="render-body">${richTextHtml(body)}</div></article>`;
  }

  function renderedPreviewHtml(o) {
    const s = sectionMap(o);
    const visuals = visualAssets(o);
    if (o.type === "blog_post") {
      return `<div class="render-layout blog-preview"><div class="render-hero"><div class="eyebrow">SEO Blog Preview</div><h3>${text(product(o.productId).name)}</h3><div class="render-body">${richTextHtml(s["제목 3안"] || "")}</div></div><div class="render-grid two">${renderCard("개요", s["개요"] || "", "soft")}${renderCard("메타 설명", s["메타"] || "", "soft")}</div><div class="render-article">${renderCard("본문", s["본문"] || "", "article")}</div><div class="render-grid two">${renderCard("CTA", s["CTA"] || "", "accent")}${renderCard("대표 이미지 프롬프트", s["이미지 프롬프트"] || "", "visual")}</div></div>`;
    }
    if (o.type === "pdp") {
      return `<div class="render-layout pdp-preview"><div class="render-hero accent"><div class="eyebrow">PDP Preview</div><h3>${text(s["Hero"] || product(o.productId).name)}</h3><p>${text(product(o.productId).name)} · ${text(labelText(o.platform))}</p></div><div class="render-grid two">${renderCard("베네핏", s["베네핏"] || "", "soft")}${renderCard("스펙", s["스펙"] || "", "soft")}</div><div class="render-grid two">${renderCard("배송 / 반품", s["배송/반품"] || "", "article")}${renderCard("FAQ", s["FAQ"] || "", "article")}</div><div class="render-grid two">${renderCard("CTA", s["CTA"] || "", "accent")}${renderCard("배너 문안 + 비주얼", s["배너 문안"] || "", "visual")}</div></div>`;
    }
    if (o.type === "shortform") {
      return `<div class="render-layout short-preview"><div class="render-hero"><div class="eyebrow">Shortform Preview</div><h3>${text(product(o.productId).name)} 숏폼 구성</h3><div class="render-body">${richTextHtml(s["3초 훅"] || "")}</div></div><div class="render-grid three">${renderCard("15초 콘티", s["15초 콘티"] || "", "soft")}${renderCard("샷리스트", s["샷리스트"] || "", "soft")}${renderCard("자막", s["자막"] || "", "soft")}</div><div class="render-grid two">${renderCard("CTA", s["CTA"] || "", "accent")}${renderCard("썸네일 프롬프트", s["썸네일 프롬프트"] || "", "visual")}</div></div>`;
    }
    if (o.type === "social_post") {
      return `<div class="render-layout social-preview"><div class="render-hero"><div class="eyebrow">Social Preview</div><h3>${text(s["훅"] || "")}</h3></div><div class="render-grid two">${renderCard("본문", s["본문"] || "", "article")}${renderCard("대안 카피", s["대안 카피"] || "", "soft")}</div><div class="render-grid two">${renderCard("CTA", s["CTA"] || "", "accent")}${renderCard("해시태그", s["해시태그"] || "", "visual")}</div></div>`;
    }
    if (o.type === "faq") {
      return `<div class="render-layout faq-preview"><div class="render-grid two">${renderCard("질문 분류", s["질문 분류"] || "", "soft")}${renderCard("표준 답변", s["답변"] || "", "article")}</div><div class="render-grid three">${renderCard("짧은 답변", s["짧은 답변"] || "", "soft")}${renderCard("정중 버전", s["정중 버전"] || "", "soft")}${renderCard("에스컬레이션", s["에스컬레이션"] || "", "accent")}</div></div>`;
    }
    if (o.type === "influencer") {
      return `<div class="render-layout outreach-preview"><div class="render-grid two">${renderCard("첫 제안", s["첫 제안"] || "", "article")}${renderCard("팔로업", s["팔로업"] || "", "soft")}</div><div class="render-grid two">${renderCard("협업 포인트", s["협업 포인트"] || "", "soft")}${renderCard("제공 가치", s["제공 가치"] || "", "accent")}</div></div>`;
    }
    return `<div class="render-layout generic-preview">${(o.sections || []).map((section) => renderCard(section.name, section.content, visuals.some((item) => item.id === section.id) ? "visual" : "soft")).join("")}</div>`;
  }

  function mkOutput(s, o) {
    const p = productOf(s, o.productId);
    const m = marketOf(s, o.marketId);
    const profile = o.profile || resolveProfile(o.rawProfile, m, brandOf(s));
    const sections = gen(s, o.type, p, m, o.brief, profile);
    if (o.bad) sections[3].content += `\n${o.bad}`;
    const q = score(o.type, sections, brandOf(s).banned);
    const row = { id: uid("out"), originId: o.originId || null, version: o.version || 1, mode: "generate", type: o.type, platform: o.platform, productId: o.productId, marketId: o.marketId, brief: o.brief, rawProfile: o.rawProfile || null, profile, status: o.status || q.state, score: q.overall, rubric: q.rubric, sections, checklist: [], at: new Date().toISOString(), bundle: bundleOf(s, o.type, o.platform)?.ver || "1.0.0", playbook: playbookOf(s, o.type, o.platform)?.ver || "1.0.0" };
    row.checklist = buildChecklist(row, s);
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
    const visuals = visualAssets(o);
    const chunks = uploadChunks(o);
    return `<section class="panel"><div class="head"><div><div class="eyebrow">${t("generated")}</div><h2>${text(outputLabel(o.type))} · ${text(product(o.productId).name)}</h2><p>${text(labelText(o.platform))} · Prompt v${text(o.bundle)} · Playbook v${text(o.playbook)}</p></div><span class="score ${o.score>=85?"ok":o.score>=70?"mid":"bad"}">${o.score}점</span></div><div class="mini action-note"><strong>적용 프로필</strong><span>${text(profileSummary(o.profile || resolveProfile(o.rawProfile, market(o.marketId), brand())))}</span><span>현재 버전 ${o.version || 1}${o.originId ? ` · 원본 ${o.originId}` : ""}</span></div><div class="mini action-note"><strong>${t("duplicate")}</strong><span>현재 결과를 기준으로 검수 상태를 다시 계산한 새 작업본을 만듭니다. 국가별 현지화, 카피 실험, 담당자별 분기 작업에 사용합니다.</span></div><div class="actions"><button class="primary" data-approve="${o.id}">${t("approve")}</button><button class="secondary" data-duplicate="${o.id}">${t("duplicate")}</button><button class="ghost" data-gold="${o.id}">${t("gold")}</button></div></section><section class="panel"><div class="head"><div><div class="eyebrow">실전형 렌더</div><h3>카드형 최종 미리보기</h3></div></div>${renderedPreviewHtml(o)}</section><section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">바로 복사 가능한 최종본</div><h3>게시용 / 등록용 완성본</h3></div></div><div class="assembled-output">${compiledOutputHtml(o)}</div></article><article class="panel"><div class="head"><div><div class="eyebrow">복사용 원문</div><h3>플랫폼에 붙여 넣는 텍스트</h3></div></div><textarea readonly id="compiledOutput" class="result-textarea compact">${text(compiledOutput(o))}</textarea><div class="actions"><button class="secondary" data-copy="compiledOutput">전체 복사</button></div>${visuals.length ? `<div class="sub"><strong>비주얼 프롬프트 / 배너 문안</strong>${visuals.map((section) => `<div class="mini big"><strong>${text(section.name)}</strong><span>${text(section.content)}</span></div>`).join("")}</div>` : ""}</article></section><section class="panel"><div class="head"><div><div class="eyebrow">플랫폼별 업로드 패키지</div><h3>${text(labelText(o.platform))} 업로드용 분리 복사본</h3></div></div><div class="stack">${chunks.map((chunk, index) => `<article class="subcard"><div class="eyebrow">${text(chunk.label)}</div><textarea readonly id="upload-${text(o.id)}-${index}" class="result-textarea compact">${text(chunk.value)}</textarea><div class="actions"><button class="secondary" data-copy="upload-${text(o.id)}-${index}">${text(chunk.label)} 복사</button></div></article>`).join("")}</div></section><section class="stack">${o.sections.slice().sort((a,b)=>a.score-b.score).map((s) => `<article class="panel sec ${s.locked?"locked":""}"><div class="head"><div><div class="eyebrow">${text(s.name)}</div><h3>${text(s.name)}</h3></div><div>${s.human?`<span class="pill">${l()==="ko"?"수정 반영됨":l()==="en"?"Edited":l()==="ja"?"修正反映済み":"已人工修改"}</span>`:""}<span class="score ${s.score>=85?"ok":s.score>=70?"mid":"bad"}">${s.score}</span></div></div><div class="issues">${s.issues.length?s.issues.map((i)=>`<span class="issue">${text(i)}</span>`).join(""):`<span class="issue ok">${t("no_issue")}</span>`}</div><form data-form="sectionEdit"><input type="hidden" name="outputId" value="${o.id}"><input type="hidden" name="sectionId" value="${s.id}"><textarea class="result-textarea" name="content" ${s.locked?"readonly":""}>${text(s.content)}</textarea><div class="actions section-actions"><button class="ghost" type="button" data-lock="${o.id}:${s.id}">${s.locked?t("unlock"):t("lock")}</button><button class="secondary" type="button" data-regen="${o.id}:${s.id}" ${s.locked?"disabled":""}>${t("regenerate")}</button><button class="primary" ${s.locked?"disabled":""}>${t("save_edit")}</button></div></form></article>`).join("")}</section>`;
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
    return `<section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">${t("playbooks")}</div><h2>Platform Playbook Center</h2></div></div>${state.playbooks.map((x)=>`<button class="row-main ${x.id===pb.id?"sel":""}" data-playbook="${x.id}"><strong>${text(labelText(x.platform))}</strong><span>${text(outputLabel(x.type))} · v${text(x.ver)}</span></button>`).join("")}</article><article class="panel"><div class="head"><div><div class="eyebrow">Rule Set</div><h2>${text(labelText(pb.platform))}</h2><p>플레이북은 톤, 연령대, 표현 방식 선택값과 함께 읽혀야 합니다. 선택하지 않으면 시장 기본 프로필이 적용됩니다.</p></div><span class="pill">v${text(pb.ver)}</span></div><div class="mini big"><strong>우선 메시지 순서</strong><span>${(pb.priority || []).join(" -> ")}</span></div><div class="mini big"><strong>CTA 패턴</strong><span>${(pb.cta || []).join(", ")}</span></div><div class="mini big"><strong>운영 경고</strong><span>${(pb.warnings || []).join(" / ")}</span></div><div class="mini big"><strong>사람 검수 기준</strong><span>${(pb.checklist || []).join(" / ")}</span></div><form data-form="playbookEdit"><input type="hidden" name="id" value="${pb.id}">${field("tone","권장 톤",pb.tone)}${area("req","필수 섹션",pb.req.join(", "))}${area("banned","금지 표현",pb.banned.join(", "))}<button class="primary">플레이북 저장</button></form></article></section>`;
  }

  function promptView() {
    const bu = state.bundles.find((x)=>x.id===state.ui.bundleId) || state.bundles[0];
    return `<section class="split"><article class="panel"><div class="head"><div><div class="eyebrow">프롬프트</div><h2>Prompt Stack Studio</h2></div></div>${state.bundles.map((x)=>`<button class="row-main ${x.id===bu.id?"sel":""}" data-bundle="${x.id}"><strong>${text(x.label)}</strong><span>${text(x.name)} · v${text(x.ver)}</span></button>`).join("")}</article><article class="panel"><div class="head"><div><div><div class="eyebrow">Layer Draft</div><h2>${text(bu.label)}</h2><p>모든 산출물은 Role, Situation, Audience, Inputs, Steps, Style, Forbidden, Output Format 프레임으로 프롬프트를 설계합니다.</p></div><span class="score ${bu.score>=85?"ok":bu.score>=70?"mid":"bad"}">${bu.score}</span></div></div><div class="mini big"><strong>활성 레이어</strong><span>${(bu.layers || []).join(" -> ")}</span></div><div class="mini big"><strong>운영 모드</strong><span>${Object.entries(bu.modes || {}).map(([mode, desc]) => `${mode}: ${desc}`).join(" / ")}</span></div><form data-form="bundleEdit"><input type="hidden" name="id" value="${bu.id}">${area("draft","Draft Prompt",bu.draft)}<button class="primary">Draft 저장</button></form><div class="actions"><button class="secondary" data-test="${bu.id}">샌드박스 테스트</button><button class="ghost" data-deploy="${bu.id}">승인 배포</button></div></article></section>`;
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
    if (v === "result" && o && o.mode === "generate") return `<section class="panel sticky"><div class="eyebrow">Review Gate</div><h3>${t("review_gate")}</h3>${o.checklist.map((c)=>`<div class="check"><span>${text(c.label)}</span><span class="${c.done?"score ok":"score bad"}">${c.done?"PASS":"FAIL"}</span></div>`).join("")}<div class="sub"><strong>적용 프로필</strong><div class="mini">브랜드 톤<span>${text(profileLabel("brandTone", (o.profile || {}).brandTone))}</span></div><div class="mini">연령대<span>${text(profileLabel("audienceAge", (o.profile || {}).audienceAge))}</span></div><div class="mini">표현 방식<span>${text(profileLabel("expressionStyle", (o.profile || {}).expressionStyle))}</span></div></div><div class="sub"><strong>플레이북 우선순위</strong><div class="mini">${text(((playbook(o.type, o.platform) || {}).priority || []).join(" -> ") || "기본 우선순위")}</div></div><div class="sub"><strong>번들 모드</strong>${Object.entries((bundle(o.type, o.platform) || {}).modes || {}).map(([mode, desc])=>`<div class="mini">${text(mode)}<span>${text(desc)}</span></div>`).join("") || `<div class="mini">기본 모드<span>planning -> drafting -> reviewing</span></div>`}</div><div class="sub"><strong>Score Rubric</strong><div class="mini">Truth<span>${o.rubric.truth}</span></div><div class="mini">Brand<span>${o.rubric.brand}</span></div><div class="mini">Platform<span>${o.rubric.platform}</span></div><div class="mini">Completeness<span>${o.rubric.completeness}</span></div></div><div class="sub"><strong>점수 기준</strong><div class="mini">85점 이상 + 체크리스트 전부 PASS<span>승인 가능</span></div><div class="mini">70~84점<span>수정 후 재검토</span></div><div class="mini">69점 이하 또는 금지표현 포함<span>재작성 필요</span></div></div><div class="sub"><strong>금지표현</strong>${brand().banned.map((x)=>`<span class="chip">${text(x)}</span>`).join("")}</div></section>`;
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
        `${m.country} 시장에서 먼저 읽히는 ${p.name}\n선물 이유와 실사용 가치를 함께 보여 주는 ${brand().name} ${p.name}\n향보다 구성과 리필 가치가 먼저 보이는 ${p.name}`,
        `${p.name}: ${m.country} 고객이 바로 이해하는 gift-ready hand care\n${brand().name} ${p.name}, 향과 선물 구성을 한 번에 보여 주는 세트\n검색 유입을 고려해 다시 쓴 ${p.name} 추천 제목`,
        `${p.features[2] || p.features[0]}이 먼저 보이는 ${p.name}\n${m.country} 시장용 전환형 블로그 제목\n브랜드 감성보다 구매 이유를 먼저 보여 주는 ${p.name}`
      ],
      "개요": [
        `${p.name}는 선물용으로 고르기 쉬운 구성과 직접 오래 쓰고 싶은 실용성을 함께 갖춘 ${p.cat} 제품입니다. ${m.country} 시장에서는 ${m.note} 포인트를 먼저 보여 주는 흐름이 이해와 전환에 더 유리합니다.`,
        `${brand().name} ${p.name}는 향의 매력만 앞세우지 않고 구성, 사용감, 배송 신뢰까지 한 번에 보여 주는 소개형 글에 잘 맞습니다. 제품 사실을 먼저 설명하고 브랜드 무드는 뒤에서 보강하는 흐름으로 읽히게 정리했습니다.`,
        `${p.name}를 처음 보는 고객도 부담 없이 이해할 수 있도록 선물 이유, 제품 정보, 배송/반품 기준을 앞쪽에 배치한 버전입니다. 감성 표현은 유지하되 구매 판단에 필요한 문장이 먼저 보이도록 다듬었습니다.`
      ],
      "본문": [
        `## 왜 이 구성이 먼저 눈에 들어오는가\n${p.name}는 ${p.features[2] || p.features[0]}에서 오는 선물 완성도와 ${p.features[3] || p.features[1]}의 실용성을 함께 보여 주는 제품입니다. 첫인상은 감각적으로 보이지만, 실제로는 오래 두고 쓰기 좋은 이유까지 갖추고 있어 ${m.country} 시장에서도 설명하기 쉽습니다.\n\n## 제품 정보를 한 번에 이해하기 쉽게 정리하면\n구성은 ${p.specs.join(", ")} 기준으로 안내되며 가격은 ${p.price}입니다. 배송은 ${p.shipping}, 반품은 ${p.returns} 기준으로 확인할 수 있어 선물용 주문에서도 비교적 안심하고 선택할 수 있습니다.\n\n## 브랜드 무드가 과하지 않게 남는 이유\n${brand().story} ${p.name}는 이 분위기를 억지로 밀어붙이기보다, 향과 패키지, 사용 경험을 통해 자연스럽게 전달하는 쪽에 더 가깝습니다.\n\n## 마무리\n${o.brief || `${p.name}의 구성과 분위기를 한 번에 확인해 보세요.`}`,
        `## 선물용으로 추천하기 좋은 이유\n${p.name}는 보기 좋은 패키지에서 끝나지 않고, ${p.features[0]}와 ${p.features[1]}를 통해 실제 사용 만족감까지 이어지는 제품입니다. 선물 받는 순간의 인상과 이후에 손이 자주 가는 경험을 함께 설명할 수 있다는 점이 장점입니다.\n\n## 구매 전에 확인해야 할 핵심 정보\n제품은 ${p.specs.join(", ")}로 구성되며 가격은 ${p.price}입니다. 배송은 ${p.shipping}, 반품은 ${p.returns} 기준으로 확인할 수 있어 정보 탐색 단계에서도 신뢰를 만들기 좋습니다.\n\n## 이런 장면에서 특히 잘 어울립니다\n가벼운 축하 선물, 팝업 행사 굿즈, 감각적인 데일리 뷰티 아이템을 찾는 순간에 ${p.name}는 설명이 빠르게 끝나는 제품입니다. 향과 구성, 재사용 포인트를 분리해서 보여 주면 이해가 더 쉬워집니다.`,
        `## 처음 보는 고객도 바로 이해하는 제품 소개\n${p.name}는 ${benefitSummary(p)}를 중심으로 설계된 ${p.cat} 제품입니다. ${m.country} 시장에서는 ${m.note} 포인트가 중요하므로, 감성 표현보다 구성과 배송 정보를 먼저 보여 주는 편이 훨씬 안정적입니다.\n\n## 제품 선택이 쉬운 이유\n한 번의 구매로 선물용 만족감과 일상 사용 만족감을 함께 기대할 수 있고, 옵션과 배송 기준도 비교적 명확합니다. 그래서 검색 유입이나 상세페이지 이동 전 단계에서 소개하기 좋은 상품입니다.\n\n## 결론\n${brand().name} 특유의 분위기는 유지하되, 실제 구매 판단은 제품 정보와 사용 장면에서 이루어지도록 정리하는 것이 가장 효과적입니다.`
      ],
      "Hero": [
        `${p.features[2] || p.features[0]}의 완성도와 ${p.features[3] || p.features[1]}의 실용성을 함께 담은 ${p.name}\n${m.country} 시장에서도 이해하기 쉬운 구성과 배송 정보로 구매 전환을 돕습니다.`,
        `${brand().name} ${p.name}\n선물 이유는 분명하게, 브랜드 분위기는 자연스럽게 남는 ${p.cat} 세트입니다.`,
        `${m.country} 고객이 바로 이해하는 ${p.name}\n옵션, 배송, 반품 기준까지 한눈에 확인할 수 있도록 정리했습니다.`
      ],
      "베네핏": [
        `첫째, ${p.features[2] || p.features[0]} 덕분에 선물용으로 설명이 쉽습니다.\n둘째, ${p.features[0]}와 ${p.features[1]}가 실제 사용 만족감을 만들어 줍니다.\n셋째, ${p.features[3] || p.features[1]} 구조가 더해져 한 번 쓰고 끝나는 제품처럼 느껴지지 않습니다.`,
        `${p.name}의 강점은 감성 표현과 실용 정보가 같이 간다는 점입니다. 패키지에서 오는 선물 인상, 사용감에서 오는 만족도, 반복 사용을 떠올리게 하는 구조가 자연스럽게 이어집니다.`,
        `이 제품은 보기 좋은 선물이라는 인상에서 시작해 실제로 오래 두고 쓰고 싶은 아이템이라는 확신으로 연결됩니다. 그래서 첫 구매자에게도 설명이 빠르고 명확합니다.`
      ],
      "스펙": [
        `제품명: ${p.name}\n카테고리: ${p.cat}\n구성: ${p.specs.join(", ")}\n가격: ${p.price}\n주요 특징: ${benefitSummary(p)}`,
        `${p.name}\n- ${p.specs.join("\n- ")}\n- 가격 ${p.price}\n- 추천 포인트: ${p.features[2] || p.features[0]}, ${p.features[3] || p.features[1]}`,
        `상품 정보 요약\n${p.specs.join(", ")}\n판매가 ${p.price}\n구매 전 확인 포인트: ${benefitSummary(p)}`
      ],
      "배송/반품": [
        `배송은 ${p.shipping} 기준으로 진행되며, 반품은 ${p.returns} 기준으로 확인할 수 있습니다. 주문 전 배송 일정과 수령 목적을 함께 확인하면 선물용 구매에서도 훨씬 안정적입니다.`,
        `${m.country} 시장용 안내 기준으로 배송 정보는 ${p.shipping}, 반품 기준은 ${p.returns}입니다. 핵심 조건을 먼저 보여 주면 구매 불안을 줄이는 데 도움이 됩니다.`,
        `주문 후 안내가 복잡하지 않도록 배송과 반품 기준을 간단히 정리했습니다. 배송은 ${p.shipping}, 반품은 ${p.returns} 기준이며 상세페이지 하단에서 다시 확인할 수 있습니다.`
      ],
      "FAQ": [
        `Q. 어떤 고객에게 잘 맞나요?\nA. 선물용으로도 좋고 직접 오래 쓰기 좋은 구성을 찾는 고객에게 잘 맞습니다.\n\nQ. 구매 전에 무엇을 먼저 보면 좋나요?\nA. 구성품, 향 옵션, 배송 기준, 반품 기준을 순서대로 확인하면 선택이 훨씬 쉬워집니다.`,
        `Q. 이 제품의 가장 큰 장점은 무엇인가요?\nA. 선물 같은 첫인상과 실사용 만족감을 함께 전달할 수 있다는 점입니다.\n\nQ. 주문 전 꼭 확인할 내용은 무엇인가요?\nA. 옵션 구성과 배송 일정을 먼저 확인해 주세요.`,
        `Q. 선물용으로 추천할 수 있나요?\nA. 네. 패키지와 구성 설명이 직관적이라 선물용으로 소개하기 좋습니다.\n\nQ. 직접 사용하기에도 괜찮나요?\nA. 네. 사용감과 재사용 포인트까지 함께 설명할 수 있어 자가 사용 만족도도 높게 전달됩니다.`
      ],
      "CTA": [
        `${p.name}의 향 옵션과 구성, 배송 정보를 지금 상세페이지에서 바로 확인해 보세요.`,
        `지금 ${p.name} 상세페이지에서 옵션과 배송 조건을 비교해 보세요.`,
        `${m.country} 시장용 문안으로 정리된 ${p.name} 상세페이지를 확인하고 바로 적용해 보세요.`
      ],
      "배너 문안": [
        `배너 1. 선물처럼 보이고 오래 쓰고 싶은 ${p.name}\n배너 2. 향 옵션과 구성품을 한눈에 비교\n배너 3. ${p.shipping} 배송 기준과 ${p.returns} 반품 기준 안내`,
        `배너 1. 첫인상은 선물, 사용감은 데일리\n배너 2. ${p.features[1]}와 ${p.features[3] || p.features[0]}를 함께 소개\n배너 3. 상세 옵션과 배송 조건을 바로 확인`,
        `배너 1. ${brand().name}가 제안하는 감각적인 ${p.cat}\n배너 2. 구성과 향, 재사용 포인트까지 분리 안내\n배너 3. 구매 전 필요한 배송/반품 정보를 간단히 확인`
      ],
      "3초 훅": [
        `${p.features[2] || p.features[0]} 디테일이 가장 먼저 보이는 언박싱 컷으로 시작합니다.`,
        `첫 1초는 손에 잡히는 사용 장면, 다음 2초는 ${p.features[3] || p.features[1]} 포인트를 보여 주세요.`,
        `${m.country} 타깃용으로는 배송 설명보다 선물 장면을 먼저 열어 주는 구성이 더 잘 먹힙니다.`
      ],
      "15초 콘티": [
        `0-3초: 패키지 전체와 핵심 오브제를 동시에 보여 줍니다.\n4-7초: 향 옵션 또는 구성품을 빠르게 비교합니다.\n8-11초: ${p.features[3] || p.features[1]} 구조를 손동작으로 설명합니다.\n12-15초: 상세페이지 확인 CTA로 마무리합니다.`,
        `0-3초: 받는 순간의 인상을 보여 줍니다.\n4-7초: 실제 사용 장면을 짧게 연결합니다.\n8-11초: 구성의 차별점을 한 줄 자막으로 강조합니다.\n12-15초: 옵션과 배송 정보를 보려면 상세페이지로 이동시키는 흐름으로 끝냅니다.`,
        `0-3초: 제품명 없이도 선물 제품처럼 읽히는 화면 구성\n4-7초: 향 또는 옵션 선택의 즐거움 노출\n8-11초: 실용 포인트 설명\n12-15초: 구매 유도 CTA`
      ],
      "샷리스트": [
        `- 탑샷 1컷\n- 패키지 클로즈업 2컷\n- 구성품 비교 컷 2컷\n- 사용 장면 1컷\n- CTA 엔드카드 1컷`,
        `- 선물 박스 오픈 컷\n- 향 카드 또는 옵션 컷\n- 손 위에 올린 제품 컷\n- 실사용 클로즈업 컷\n- 브랜드 로고 포함 엔드카드`,
        `- 메인 제품 전신 컷\n- 포인트 오브제 클로즈업\n- 사용 장면 짧은 컷\n- 배송/구성 자막용 컷\n- CTA 카드`
      ],
      "자막": [
        `자막 1. 선물처럼 바로 이해되는 구성\n자막 2. 향 옵션을 고르는 재미\n자막 3. 오래 두고 쓰고 싶은 실용 포인트\n자막 4. 상세페이지에서 옵션과 배송 정보 확인`,
        `자막 1. 첫인상은 선물\n자막 2. 사용감은 데일리\n자막 3. 옵션과 구성은 더 명확하게\n자막 4. 지금 상세페이지에서 확인`,
        `자막 1. 보기 좋은 구성\n자막 2. 손이 자주 가는 사용감\n자막 3. 배송 정보도 간단하게\n자막 4. 구매 전 상세 확인`
      ],
      "훅": [
        `${p.name}, 보기만 좋은 선물이 아니라 직접 오래 쓰고 싶어지는 쪽에 더 가깝습니다.`,
        `선물용 제품을 찾는다면, 첫인상과 실사용 만족감을 같이 봐야 합니다.`,
        `${brand().name} ${p.name}는 감성만 남는 제품이 아니라 설명이 쉬운 선물형 아이템입니다.`
      ],
      "대안 카피": [
        `${p.name}의 매력은 향 하나가 아니라 구성과 사용 이유가 함께 읽힌다는 점입니다.`,
        `선물로 보이지만, 실제로는 자주 꺼내 쓰고 싶어지는 제품. 그 차이가 ${p.name}의 포인트입니다.`,
        `${m.country} 시장에 맞게 보면, 감성보다 먼저 이해되는 구성과 신뢰 정보가 더 중요합니다.`
      ],
      "질문 분류": [
        `배송 문의 / 옵션 문의 / 구성품 문의 / 선물용 추천 문의`,
        `구매 전 문의 / 배송 일정 문의 / 반품 정책 문의 / 대량 주문 문의`,
        `상품 정보 문의 / 향 선택 문의 / 배송 신뢰 문의 / B2B 문의`
      ],
      "답변": [
        `${p.name}는 ${p.shipping} 기준으로 배송되며 반품은 ${p.returns} 기준으로 안내됩니다. 제품 구성과 옵션은 상세페이지 기준으로 확인해 주시면 가장 정확합니다.`,
        `현재 ${p.name}는 ${p.shipping} 일정에 맞춰 출고되며, 반품은 ${p.returns} 기준으로 가능합니다. 구매 전에는 구성과 옵션, 배송 일정을 함께 확인해 주세요.`,
        `${p.name} 관련 문의 시 가장 먼저 안내해야 하는 정보는 구성품, 배송 기준, 반품 기준입니다. 자세한 옵션 정보는 상세페이지를 함께 안내해 주세요.`
      ],
      "짧은 답변": [
        `${p.shipping} 기준으로 배송되며 반품은 ${p.returns} 기준입니다.`,
        `배송은 ${p.shipping}, 반품은 ${p.returns} 기준으로 확인해 주세요.`,
        `구성과 배송 정보는 상세페이지에서 함께 확인하시면 가장 정확합니다.`
      ],
      "정중 버전": [
        `문의 주셔서 감사합니다. ${p.name}는 현재 ${p.shipping} 기준으로 배송되며, 반품은 ${p.returns} 정책에 따라 안내됩니다. 구성과 옵션은 상세페이지 기준으로 확인 부탁드립니다.`,
        `안녕하세요. ${p.name}는 ${p.shipping} 일정에 따라 출고되며, 반품은 ${p.returns} 기준으로 도와드리고 있습니다. 자세한 상품 구성은 상세페이지에서 함께 확인해 주세요.`,
        `문의해 주셔서 감사합니다. 배송과 반품 기준은 ${p.shipping} / ${p.returns}이며, 옵션 정보는 상세페이지에 가장 정확하게 정리되어 있습니다.`
      ],
      "에스컬레이션": [
        `재고 확인, 대량 주문, 현지 유통 협업 문의는 담당자에게 별도 전달합니다.`,
        `B2B 조건 협의나 수량 기반 견적 요청은 운영 담당자에게 이관합니다.`,
        `일반 CS 범위를 넘는 유통/대량 발주 문의는 계정 오너에게 연결합니다.`
      ],
      "첫 제안": [
        `안녕하세요. ${m.country} 시장에서 선물형 뷰티 콘텐츠를 만드는 크리에이터를 찾고 있어 연락드립니다. ${brand().name}의 ${p.name}는 선물 같은 첫인상과 실제 사용 이유를 함께 보여 주기 좋은 제품이라 협업 가능성을 여쭙고 싶습니다.`,
        `안녕하세요. ${brand().name} ${p.name}는 언박싱과 사용 장면을 함께 담기 좋은 제품이라 ${m.country} 시장용 협업을 제안드리고 싶습니다. 관심 있으시면 간단한 조건과 방향을 공유드리겠습니다.`,
        `안녕하세요. 감각적인 선물형 콘텐츠와 데일리 뷰티 콘텐츠를 함께 다루시는 점이 잘 맞아 보여 연락드립니다. ${p.name} 협업 제안을 검토해 주실 수 있을까요?`
      ],
      "팔로업": [
        `지난 메시지에 이어 간단히 한 번 더 연락드립니다. ${p.name}는 언박싱, 향 비교, 사용 장면까지 한 흐름으로 보여 주기 좋은 제품이라 짧은 영상이나 피드 콘텐츠에 특히 잘 맞습니다.`,
        `한 번 더 짧게 공유드립니다. 이 제품은 선물용 인상과 실사용 장면을 함께 담을 수 있어 협업 콘텐츠 구성이 비교적 명확합니다.`,
        `추가로 남깁니다. ${m.country} 시장 기준으로도 소개 포인트가 분명해 콘텐츠 기획이 어렵지 않은 제품입니다.`
      ],
      "협업 포인트": [
        `- 선물 개봉 순간이 강한 제품입니다.\n- 향, 패키지, ${p.features[3] || p.features[1]} 포인트를 각각 분리해서 보여 줄 수 있습니다.\n- ${m.country} 시장용 배송/구성 정보와 연결하기 쉽습니다.`,
        `- 언박싱 컷이 좋습니다.\n- 옵션 비교 컷이 자연스럽습니다.\n- 실사용 장면과 선물 장면을 한 콘텐츠에 함께 담을 수 있습니다.`,
        `- 첫인상과 실용성을 동시에 설명하기 좋습니다.\n- 짧은 영상과 피드 게시물 모두에 맞습니다.\n- 시장별 현지화 메시지를 붙이기 쉽습니다.`
      ],
      "제공 가치": [
        `브랜드 감성만 강조하기보다 실제 사용 장면과 선물 이유를 함께 보여 주는 협업이 가장 잘 맞습니다.`,
        `제품을 예쁘게 보여 주는 것에 그치지 않고, 왜 이 구성이 필요한지까지 설명해 줄 수 있는 콘텐츠가 가장 효과적입니다.`,
        `감성 표현과 구매 이유를 균형 있게 담는 콘텐츠일수록 전환 가능성이 높습니다.`
      ]
    };
    const list = variants[s.name] || [
      `${s.content}\n\n추가 정리: 구매 이유가 더 먼저 읽히도록 문장 순서를 다시 다듬었습니다.`,
      `${s.content}\n\n추가 정리: ${m.country} 시장에서 중요한 정보가 앞쪽에 보이도록 재배치했습니다.`,
      `${s.content}\n\n추가 정리: 구성, 배송, CTA가 더 선명하게 읽히도록 밀도를 높였습니다.`
    ];
    return list[turn % list.length];
  }
  function refreshOutputQuality(o) { const q = score(o.type, o.sections, brand().banned); o.score = q.overall; o.status = q.state; o.rubric = q.rubric; o.checklist = buildChecklist(o, state); }
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

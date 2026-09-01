const fs = require('fs');
const path = require('path');

const dictionaryData = [
  { cat: "진료과목", en: "Internal Medicine", ko: "일반 내과", desc: "성인 만성질환, 고혈압, 당뇨, 감기 등 포괄적 1차 진료" },
  { cat: "진료과목", en: "Cardiology", ko: "심장내과 / 순환기내과", desc: "고혈압, 협심증, 부정맥, 심부전, 혈관 질환 전문 진료" },
  { cat: "진료과목", en: "Neurology", ko: "신경과 / 뇌신경과", desc: "뇌졸중, 치매, 어지럼증, 두통, 파킨슨병 등 뇌신경 질환" },
  { cat: "진료과목", en: "Endocrinology", ko: "내분비내과", desc: "당뇨병, 갑상선 질환, 골다공증, 호르몬 이상 질환" },
  { cat: "진료과목", en: "Gastroenterology (GI)", ko: "소화기내과", desc: "위·대장 내시경, 역류성 식도염, 간염, 위장 질환" },
  { cat: "진료과목", en: "Orthopedics", ko: "정형외과", desc: "관절염, 척추 디스크, 골절, 인대 손상 치료" },
  { cat: "진료과목", en: "Ophthalmology", ko: "안과", desc: "백내장, 녹내장, 황반변성, 시력 교정 및 안과 질환" },
  { cat: "진료과목", en: "Dermatology", ko: "피부과", desc: "피부염, 습진, 피부암 검진, 대상포진, 알레르기" },
  { cat: "진료과목", en: "Urology", ko: "비뇨의학과", desc: "전립선 비대증, 요로결석, 방광염, 신장 질환" },
  { cat: "진료과목", en: "Family Medicine", ko: "가정의학과", desc: "온 가족 주치의(PCP) 1차 진료 및 정기 건강검진" },
  { cat: "증상 표현", en: "Chest tightness / Chest pain", ko: "가슴 답답함 / 흉통", desc: "예: I feel a sharp pain in my chest. (가슴에 찌르는 듯한 통증이 있습니다.)" },
  { cat: "증상 표현", en: "Shortness of breath / Dyspnea", ko: "호흡 곤란 / 숨가쁨", desc: "예: I have difficulty breathing when climbing stairs. (계단을 오를 때 숨이 찹니다.)" },
  { cat: "증상 표현", en: "Dizziness / Vertigo", ko: "어지럼증 / 현기증", desc: "예: The room is spinning around me. (주변이 핑핑 도는 것처럼 어지럽습니다.)" },
  { cat: "증상 표현", en: "Numbness / Tingling sensation", ko: "저림 / 감각 마비", desc: "예: My left hand feels numb and tingling. (왼손이 저리고 감각이 둔합니다.)" },
  { cat: "증상 표현", en: "Heart palpitations", ko: "가슴 두근거림 / 심계항진", desc: "예: My heart is beating very fast and irregularly. (심장이 빠르고 불규칙하게 뜁니다.)" },
  { cat: "증상 표현", en: "Fatigue / General weakness", ko: "만성 피로 / 전신 쇠약감", desc: "예: I feel exhausted all the time with no energy. (기운이 없고 항상 피곤합니다.)" },
  { cat: "증상 표현", en: "Swelling / Edema", ko: "부종 / 붓기", desc: "예: My ankles and feet are swollen. (발목과 발이 많이 붓습니다.)" },
  { cat: "증상 표현", en: "Indigestion / Heartburn", ko: "소화불량 / 속쓰림", desc: "예: I have a burning sensation in my stomach. (속이 쓰리고 소화가 안 됩니다.)" },
  { cat: "검사 및 약물", en: "Fasting Blood Glucose / HbA1c", ko: "공복 혈당 / 당화혈색소", desc: "당뇨 진단 및 지난 2~3개월간의 평균 혈당 조절 지표" },
  { cat: "검사 및 약물", en: "Lipid Panel (Cholesterol / Triglycerides)", ko: "지질 검사 (콜레스테롤 / 중성지방)", desc: "총콜레스테롤, HDL(좋은), LDL(나쁜), 중성지방 수치 측정" },
  { cat: "검사 및 약물", en: "Blood Pressure (Systolic / Diastolic)", ko: "혈압 (수축기 / 이완기)", desc: "정상 혈압 기준: 120/80 mmHg 미만" },
  { cat: "검사 및 약물", en: "Colonoscopy / Endoscopy", ko: "대장내시경 / 위내시경", desc: "소화기계 용종, 암, 궤양 조기 진단 및 검사" },
  { cat: "검사 및 약물", en: "Generic Drug vs Brand Drug", ko: "제네릭(복제약) vs 오리지널 브랜드약", desc: "동일 성분과 효능이나 제네릭이 코페이와 약값이 훨씬 저렴" },
  { cat: "검사 및 약물", en: "Prescription Refill", ko: "처방전 리필(재조제)", desc: "남은 리필 횟수 확인 후 약국 또는 병원에 추가 조제 요청" },
  { cat: "진료실 회화", en: "I need a Korean interpreter, please.", ko: "한국어 의료 통역사를 요청합니다.", desc: "미국 병원/진료소에서 연방법에 따라 무료 통역 서비스 요청" },
  { cat: "진료실 회화", en: "Is this clinic in-network with my insurance?", ko: "제 보험 네트워크에 포함된 병원인가요?", desc: "예상치 못한 의료비(Out-of-network) 청구를 방지하기 위한 사전 확인" },
  { cat: "진료실 회화", en: "What is my Copay and Deductible?", ko: "제 코페이와 디덕터블(본인부담금)은 얼마인가요?", desc: "진료 당일 현장 지불액 및 연간 기본 부담금 확인" },
  { cat: "진료실 회화", en: "Do I need a referral to see a specialist?", ko: "전문의 진료를 위해 주치의 의뢰서(Referral)가 필요한가요?", desc: "HMO 플랜의 경우 주치의 사전 의뢰서가 필수적임" },
  { cat: "진료실 회화", en: "Can I apply for Financial Assistance / Charity Care?", ko: "병원비 재정 지원(Charity Care)을 신청할 수 있나요?", desc: "저소득 또는 무보험자의 경우 병원비 감면 프로그램 신청" }
];

const componentCode = `
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  typeof document === "object" ? document.currentScript : void 0,
  30386,
  function(e) {
    "use strict";
    var s = e.i(43476), t = e.i(71645);
    var DICT_ITEMS = ${JSON.stringify(dictionaryData)};

    function PatientHubPage() {
      var _useStateTab = (0, t.useState)(function() {
        if (typeof window !== "undefined") {
          var params = new URLSearchParams(window.location.search);
          var hash = window.location.hash.replace("#", "");
          var tabParam = params.get("tab") || hash;
          if (tabParam === "matcher" || tabParam === "calculator" || tabParam === "dictionary" || tabParam === "portal") {
            return tabParam;
          }
        }
        return "calculator";
      }), activeTab = _useStateTab[0], setActiveTab = _useStateTab[1];

      (0, t.useEffect)(function() {
        if (typeof window !== "undefined") {
          function onHashOrPop() {
            var params = new URLSearchParams(window.location.search);
            var hash = window.location.hash.replace("#", "");
            var tabParam = params.get("tab") || hash;
            if (tabParam === "matcher" || tabParam === "calculator" || tabParam === "dictionary" || tabParam === "portal") {
              setActiveTab(tabParam);
            }
          }
          window.addEventListener("popstate", onHashOrPop);
          window.addEventListener("hashchange", onHashOrPop);
          return function() {
            window.removeEventListener("popstate", onHashOrPop);
            window.removeEventListener("hashchange", onHashOrPop);
          };
        }
      }, []);

      function changeTab(tabName) {
        setActiveTab(tabName);
        if (typeof window !== "undefined") {
          var url = new URL(window.location.href);
          url.searchParams.set("tab", tabName);
          window.history.pushState({}, "", url.toString());
        }
      }

      /* 1. MATCHER STATE */
      var _mStep = (0, t.useState)(1), mStep = _mStep[0], setMStep = _mStep[1];
      var _mAge = (0, t.useState)(""), mAge = _mAge[0], setMAge = _mAge[1];
      var _mStatus = (0, t.useState)(""), mStatus = _mStatus[0], setMStatus = _mStatus[1];
      var _mIncome = (0, t.useState)(""), mIncome = _mIncome[0], setMIncome = _mIncome[1];
      var _mResult = (0, t.useState)(null), mResult = _mResult[0], setMResult = _mResult[1];

      function calcMatcher() {
        var a = parseInt(mAge, 10);
        if (isNaN(a)) return;
        if (a >= 65) {
          if (mIncome === "low" || mIncome === "very_low") {
            setMResult("메디케어 + 메디케이드(NJ FamilyCare) 이중 자격(Dual Eligible / D-SNP) 또는 뉴저지 주정부 메디케어 저축 프로그램(MSP - Part B 보험료 전액 대납) 및 처방약 보조 프로그램(PAAD) 지원 대상일 가능성이 매우 높습니다.");
          } else if (mIncome === "medium") {
            setMResult("오리지널 메디케어(Part A & B) + 서플리먼트(Medigap) + Part D 처방약 플랜, 또는 치과/안과/OTC 카드 혜택이 풍부한 메디케어 어드밴티지(Part C)를 비교 선택하시기 바랍니다. 소득에 따라 Senior Gold 처방약 할인 혜택도 가능합니다.");
          } else {
            setMResult("메디케어 기본 보장(Part A & B)과 함께 병원 선택의 자유도가 높은 오리지널 메디케어 + Medigap Plan G 조합이나, 프리미엄 메디케어 어드밴티지(Part C PPO) 플랜을 추천합니다. 고소득자의 경우 Part B/D IRMAA 추가 할증료가 적용될 수 있습니다.");
          }
        } else {
          if (mIncome === "very_low") {
            if (mStatus === "시민권자" || mStatus === "영주권자 (5년 이상)") {
              setMResult("뉴저지 주 메디케이드 (NJ FamilyCare) 전액 무료 건강보험 신청 대상입니다. 월 보험료 $0 및 본인부담금 $0~$5 수준으로 연중 365일 언제든 신청하실 수 있습니다.");
            } else if (mStatus === "서류미비 / 기타") {
              setMResult("뉴저지 병원비 감면 프로그램(Charity Care)을 통해 급성기 병원 및 응급 진료비를 소득에 따라 50%~100% 주정부 지원으로 감면받으실 수 있습니다. 임산부 및 19세 미만 자녀는 'Cover All Kids'로 체류 신분과 무관하게 무료 메디케이드가 적용됩니다.");
            } else {
              setMResult("GetCoveredNJ 마켓플레이스를 통한 플랜 가입 또는 뉴저지 병원비 감면(Charity Care) 지원 대상입니다.");
            }
          } else if (mIncome === "low") {
            setMResult("GetCoveredNJ 마켓플레이스를 통해 연방 세액 공제(APTC) + 뉴저지 주정부 추가 지원금(NJHPS) + 실버 플랜 비용 분담 감면(CSR) 3중 혜택을 받으실 수 있습니다. 실버 플랜 선택 시 디덕터블과 병원 코페이가 획기적으로 낮아집니다.");
          } else if (mIncome === "medium") {
            setMResult("GetCoveredNJ 마켓플레이스를 통해 연방 세액 공제(APTC) 및 뉴저지 주정부 지원금(NJHPS)을 지원받아 월 보험료를 크게 절감하실 수 있습니다.");
          } else {
            setMResult("GetCoveredNJ 또는 민간 건강보험 플랜 가입 대상입니다. 뉴저지주 의무 가입 규정(Individual Mandate)에 따라 무보험 시 주 세금 보고 시 벌금이 부과되므로 적격 보험 유지가 필수적입니다.");
          }
        }
      }

      /* 2. CALCULATOR STATE */
      var _calcSize = (0, t.useState)(1), calcSize = _calcSize[0], setCalcSize = _calcSize[1];
      var _calcIncome = (0, t.useState)(30000), calcIncome = _calcIncome[0], setCalcIncome = _calcIncome[1];

      var fplBase = 15650 + (calcSize - 1) * 5500;
      var fplRatio = Math.round((calcIncome / fplBase) * 100);

      var isMedicaid = fplRatio <= 138;
      var isSilverCsr = fplRatio > 138 && fplRatio <= 250;
      var isAptcOnly = fplRatio > 250 && fplRatio <= 400;

      var benchmarkCost = 520 * calcSize;
      var expectedContribution = 0;
      if (fplRatio <= 150) expectedContribution = 0;
      else if (fplRatio <= 200) expectedContribution = (calcIncome * 0.02) / 12;
      else if (fplRatio <= 250) expectedContribution = (calcIncome * 0.04) / 12;
      else if (fplRatio <= 300) expectedContribution = (calcIncome * 0.06) / 12;
      else if (fplRatio <= 400) expectedContribution = (calcIncome * 0.085) / 12;
      else expectedContribution = benchmarkCost;

      var fedSubsidy = Math.max(0, Math.round(benchmarkCost - expectedContribution));
      var njSubsidy = isMedicaid ? 0 : (fplRatio <= 400 ? Math.round(75 * calcSize) : 0);
      var totalSubsidy = fedSubsidy + njSubsidy;
      var estBronze = Math.max(0, Math.round(380 * calcSize - totalSubsidy));
      var estSilver = Math.max(0, Math.round(520 * calcSize - totalSubsidy));
      var estGold = Math.max(0, Math.round(650 * calcSize - totalSubsidy));

      /* 3. DICTIONARY STATE */
      var _dictSearch = (0, t.useState)(""), dictSearch = _dictSearch[0], setDictSearch = _dictSearch[1];
      var _dictCat = (0, t.useState)("전체"), dictCat = _dictCat[0], setDictCat = _dictCat[1];
      var _copiedIdx = (0, t.useState)(null), copiedIdx = _copiedIdx[0], setCopiedIdx = _copiedIdx[1];

      var filteredDict = DICT_ITEMS.filter(function(item) {
        var matchCat = dictCat === "전체" || item.cat === dictCat;
        var q = dictSearch.trim().toLowerCase();
        var matchQ = !q || item.en.toLowerCase().indexOf(q) !== -1 || item.ko.toLowerCase().indexOf(q) !== -1 || item.desc.toLowerCase().indexOf(q) !== -1;
        return matchCat && matchQ;
      });

      function copyText(txt, idx) {
        if (navigator.clipboard) {
          navigator.clipboard.writeText(txt);
          setCopiedIdx(idx);
          setTimeout(function() { setCopiedIdx(null); }, 1500);
        }
      }

      /* 4. PORTAL STATE */
      var _portalMode = (0, t.useState)("ai"), portalMode = _portalMode[0], setPortalMode = _portalMode[1];
      var _pName = (0, t.useState)(""), pName = _pName[0], setPName = _pName[1];
      var _pDob = (0, t.useState)(""), pDob = _pDob[0], setPDob = _pDob[1];
      var _pPhone = (0, t.useState)(""), pPhone = _pPhone[0], setPPhone = _pPhone[1];
      var _pDept = (0, t.useState)("일반 내과"), pDept = _pDept[0], setPDept = _pDept[1];
      var _pSymp = (0, t.useState)(""), pSymp = _pSymp[0], setPSymp = _pSymp[1];
      var _pChartDone = (0, t.useState)(null), pChartDone = _pChartDone[0], setPChartDone = _pChartDone[1];

      function submitChart() {
        if (!pName || !pPhone) {
          alert("성함과 연락처를 입력해주세요.");
          return;
        }
        var chartNumber = "NJAP-" + Math.floor(100000 + Math.random() * 900000);
        setPChartDone({
          num: chartNumber,
          name: pName,
          dob: pDob || "미입력",
          phone: pPhone,
          dept: pDept,
          symp: pSymp || "상담 시 직접 설명"
        });
      }

      return (0, s.jsxs)("div", {
        className: "min-h-[calc(100vh-109px)] bg-slate-50 flex flex-col font-sans pb-16",
        children: [
          /* Top Header */
          (0, s.jsx)("section", {
            className: "bg-slate-900 text-white py-10 sm:py-14 border-b border-slate-800",
            children: (0, s.jsxs)("div", {
              className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
              children: [
                (0, s.jsx)("span", {
                  className: "inline-block text-xs font-bold px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 uppercase tracking-wider mb-3",
                  children: "ONE-STOP HEALTHCARE SERVICES"
                }),
                (0, s.jsx)("h1", {
                  className: "font-serif text-3xl sm:text-4xl text-white mb-3",
                  children: "원스톱 의료 접근 & 환자 종합 센터"
                }),
                (0, s.jsx)("p", {
                  className: "text-slate-300 text-xs sm:text-sm max-w-2xl leading-relaxed mb-6",
                  children: "보험 자격 진단, 2026 ACA 보조금 계산, 영-한 의학 용어 사전, 스마트 환자 AI 상담 및 병원 사전접수 서비스를 자유롭게 이용하세요."
                }),

                /* 4 Multi-Tool Tabs */
                (0, s.jsxs)("div", {
                  className: "grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 max-w-4xl",
                  children: [
                    (0, s.jsxs)("button", {
                      onClick: function() { changeTab("matcher"); },
                      className: "p-3 sm:p-4 rounded-xl text-left transition-all border " + (activeTab === "matcher" ? "bg-blue-600 text-white border-blue-400 shadow-md font-bold" : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80"),
                      children: [
                        (0, s.jsx)("div", { className: "text-xl mb-1", children: "🏥" }),
                        (0, s.jsx)("div", { className: "text-xs sm:text-sm font-semibold", children: "1. 자격 진단기" }),
                        (0, s.jsx)("div", { className: "text-[11px] opacity-80 hidden sm:block", children: "메디케어 & ACA" })
                      ]
                    }),
                    (0, s.jsxs)("button", {
                      onClick: function() { changeTab("calculator"); },
                      className: "p-3 sm:p-4 rounded-xl text-left transition-all border " + (activeTab === "calculator" ? "bg-blue-600 text-white border-blue-400 shadow-md font-bold" : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80"),
                      children: [
                        (0, s.jsx)("div", { className: "text-xl mb-1", children: "🧮" }),
                        (0, s.jsx)("div", { className: "text-xs sm:text-sm font-semibold", children: "2. 보조금 계산기" }),
                        (0, s.jsx)("div", { className: "text-[11px] opacity-80 hidden sm:block", children: "2026 ACA & NJHPS" })
                      ]
                    }),
                    (0, s.jsxs)("button", {
                      onClick: function() { changeTab("dictionary"); },
                      className: "p-3 sm:p-4 rounded-xl text-left transition-all border " + (activeTab === "dictionary" ? "bg-blue-600 text-white border-blue-400 shadow-md font-bold" : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80"),
                      children: [
                        (0, s.jsx)("div", { className: "text-xl mb-1", children: "📖" }),
                        (0, s.jsx)("div", { className: "text-xs sm:text-sm font-semibold", children: "3. 의학 용어 사전" }),
                        (0, s.jsx)("div", { className: "text-[11px] opacity-80 hidden sm:block", children: "영-한 병원 표현" })
                      ]
                    }),
                    (0, s.jsxs)("button", {
                      onClick: function() { changeTab("portal"); },
                      className: "p-3 sm:p-4 rounded-xl text-left transition-all border " + (activeTab === "portal" ? "bg-blue-600 text-white border-blue-400 shadow-md font-bold" : "bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700/80"),
                      children: [
                        (0, s.jsx)("div", { className: "text-xl mb-1", children: "🤖" }),
                        (0, s.jsx)("div", { className: "text-xs sm:text-sm font-semibold", children: "4. AI & 사전접수" }),
                        (0, s.jsx)("div", { className: "text-[11px] opacity-80 hidden sm:block", children: "질문센터 & 차트" })
                      ]
                    })
                  ]
                })
              ]
            })
          }),

          /* Main Tool Body Container */
          (0, s.jsx)("div", {
            className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4",
            children: (0, s.jsxs)("div", {
              className: "bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10",
              children: [

                /* TAB 1: INSURANCE MATCHER */
                activeTab === "matcher" && (0, s.jsxs)("div", {
                  className: "max-w-3xl mx-auto",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "text-center mb-8",
                      children: [
                        (0, s.jsx)("span", { className: "text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1", children: "TOOL 1 · INSURANCE MATCHER" }),
                        (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl text-slate-900 mb-2", children: "메디케어 & ACA 맞춤 자격 진단기" }),
                        (0, s.jsx)("p", { className: "text-xs sm:text-sm text-slate-600", children: "만 나이, 체류 신분, 가구 소득에 따른 가장 유리한 건강보험 프로그램 및 주정부 지원 혜택을 산출합니다." })
                      ]
                    }),

                    mResult ? (
                      (0, s.jsxs)("div", {
                        className: "text-center py-6",
                        children: [
                          (0, s.jsx)("div", { className: "w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 border border-blue-100", children: "💡" }),
                          (0, s.jsx)("h3", { className: "font-serif text-2xl text-slate-900 mb-3", children: "맞춤 추천 결과" }),
                          (0, s.jsx)("div", { className: "p-6 bg-slate-50 rounded-2xl border border-slate-200 text-left mb-6 text-slate-800 leading-relaxed text-sm sm:text-base", children: mResult }),
                          (0, s.jsxs)("div", {
                            className: "flex flex-col sm:flex-row gap-3 justify-center",
                            children: [
                              (0, s.jsx)("button", { onClick: function() { setMResult(null); setMStep(1); }, className: "btn-outline text-sm py-3 px-6", children: "다시 진단하기" }),
                              (0, s.jsx)("button", { onClick: function() { changeTab("calculator"); }, className: "btn-primary text-sm py-3 px-6", children: "보조금 계산기로 이동 →" })
                            ]
                          })
                        ]
                      })
                    ) : (
                      (0, s.jsxs)("div", {
                        children: [
                          (0, s.jsxs)("div", {
                            className: "flex items-center justify-between mb-6 text-xs text-slate-500 font-medium",
                            children: [
                              (0, s.jsxs)("span", { children: ["진단 단계 ", mStep, " / 3"] }),
                              (0, s.jsx)("div", { className: "w-32 bg-slate-200 h-2 rounded-full overflow-hidden", children: (0, s.jsx)("div", { className: "bg-blue-600 h-full transition-all duration-300", style: { width: ((mStep / 3) * 100) + "%" } }) })
                            ]
                          }),

                          mStep === 1 && (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("label", { className: "block text-sm font-semibold text-slate-800 mb-2", children: "만 나이를 입력해주세요:" }),
                              (0, s.jsx)("input", {
                                type: "number",
                                value: mAge,
                                onChange: function(e) { setMAge(e.target.value); },
                                placeholder: "예: 65",
                                className: "w-full p-3.5 rounded-xl border border-slate-300 mb-6 text-base outline-none focus:border-blue-500"
                              }),
                              (0, s.jsx)("button", { disabled: !mAge, onClick: function() { setMStep(2); }, className: "btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-50", children: "다음 단계 →" })
                            ]
                          }),

                          mStep === 2 && (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("label", { className: "block text-sm font-semibold text-slate-800 mb-2", children: "미국 체류 신분을 선택해주세요:" }),
                              (0, s.jsx)("div", {
                                className: "space-y-2.5 mb-6",
                                children: ["시민권자", "영주권자 (5년 이상)", "합법 비자 (H-1B, E-2, L-1, F-1 OPT 등)", "서류미비 / 기타"].map(function(item) {
                                  return (0, s.jsx)("button", {
                                    key: item,
                                    onClick: function() { setMStatus(item); },
                                    className: "w-full text-left p-3.5 rounded-xl border text-sm transition-all " + (mStatus === item ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50")
                                  }, item);
                                })
                              }),
                              (0, s.jsxs)("div", {
                                className: "flex gap-3",
                                children: [
                                  (0, s.jsx)("button", { onClick: function() { setMStep(1); }, className: "btn-outline text-sm py-3 px-6", children: "이전" }),
                                  (0, s.jsx)("button", { disabled: !mStatus, onClick: function() { setMStep(3); }, className: "btn-primary flex-1 justify-center py-3 text-sm disabled:opacity-50", children: "다음 단계 →" })
                                ]
                              })
                            ]
                          }),

                          mStep === 3 && (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsx)("label", { className: "block text-sm font-semibold text-slate-800 mb-2", children: "가구 총 연간 소득 수준을 선택해주세요:" }),
                              (0, s.jsx)("div", {
                                className: "space-y-2.5 mb-6",
                                children: [
                                  { id: "very_low", label: "저소득층 (1인 연 $21,597 이하 / FPL 138% 이하 - 메디케이드)" },
                                  { id: "low", label: "중저소득층 (1인 연 $21,597 ~ $39,125 / FPL 250% 이하 - 실버 CSR)" },
                                  { id: "medium", label: "중간소득층 (1인 연 $39,125 ~ $70,000 / APTC 보조금 지원)" },
                                  { id: "high", label: "고소득층 (1인 연 $70,000 이상)" }
                                ].map(function(item) {
                                  return (0, s.jsx)("button", {
                                    key: item.id,
                                    onClick: function() { setMIncome(item.id); },
                                    className: "w-full text-left p-3.5 rounded-xl border text-sm transition-all " + (mIncome === item.id ? "border-blue-600 bg-blue-50 text-blue-700 font-semibold" : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50")
                                  }, item.id);
                                })
                              }),
                              (0, s.jsxs)("div", {
                                className: "flex gap-3",
                                children: [
                                  (0, s.jsx)("button", { onClick: function() { setMStep(2); }, className: "btn-outline text-sm py-3 px-6", children: "이전" }),
                                  (0, s.jsx)("button", { disabled: !mIncome, onClick: calcMatcher, className: "btn-primary flex-1 justify-center py-3 text-sm disabled:opacity-50", children: "진단 결과 확인하기 ✨" })
                                ]
                              })
                            ]
                          })
                        ]
                      })
                    )
                  ]
                }),

                /* TAB 2: ACA SUBSIDY CALCULATOR */
                activeTab === "calculator" && (0, s.jsxs)("div", {
                  className: "max-w-4xl mx-auto",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "text-center mb-8",
                      children: [
                        (0, s.jsx)("span", { className: "text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1", children: "TOOL 2 · 2026 ACA & NJHPS CALCULATOR" }),
                        (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl text-slate-900 mb-2", children: "2026 ACA 건강보험료 보조금 계산기" }),
                        (0, s.jsx)("p", { className: "text-xs sm:text-sm text-slate-600", children: "가족 수와 연간 총소득을 입력하시면 2026년 기준 연방 세액 공제(APTC) 및 뉴저지 주정부 지원금(NJHPS)을 실시간 산출합니다." })
                      ]
                    }),

                    (0, s.jsxs)("div", {
                      className: "grid grid-cols-1 lg:grid-cols-12 gap-8 items-start",
                      children: [
                        /* Inputs Left Column */
                        (0, s.jsxs)("div", {
                          className: "lg:col-span-5 bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-6",
                          children: [
                            /* Household size */
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("div", { className: "flex justify-between items-center mb-2", children: [
                                  (0, s.jsx)("label", { className: "text-xs font-bold text-slate-700", children: "1. 가구원 수 (Tax Household)" }),
                                  (0, s.jsxs)("span", { className: "text-sm font-bold text-blue-600", children: [calcSize, "인 가구"] })
                                ] }),
                                (0, s.jsx)("div", {
                                  className: "grid grid-cols-5 gap-1.5",
                                  children: [1, 2, 3, 4, 5].map(function(num) {
                                    return (0, s.jsxs)("button", {
                                      key: num,
                                      onClick: function() { setCalcSize(num); },
                                      className: "py-2 text-xs font-bold rounded-lg transition-all " + (calcSize === num ? "bg-blue-600 text-white shadow-sm" : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"),
                                      children: [num, "인"]
                                    });
                                  })
                                })
                              ]
                            }),

                            /* Annual Income */
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("div", { className: "flex justify-between items-center mb-2", children: [
                                  (0, s.jsx)("label", { className: "text-xs font-bold text-slate-700", children: "2. 가구 연간 총소득 (MAGI)" }),
                                  (0, s.jsxs)("span", { className: "text-base font-bold text-blue-700", children: ["$", Number(calcIncome).toLocaleString(), " / 년"] })
                                ] }),
                                (0, s.jsx)("input", {
                                  type: "number",
                                  step: "1000",
                                  value: calcIncome,
                                  onChange: function(e) { setCalcIncome(Math.max(0, parseInt(e.target.value, 10) || 0)); },
                                  className: "w-full p-3 bg-white rounded-xl border border-slate-300 font-bold text-slate-900 mb-2 outline-none focus:border-blue-500"
                                }),
                                (0, s.jsx)("div", {
                                  className: "flex flex-wrap gap-1.5",
                                  children: [20000, 35000, 50000, 75000, 100000].map(function(preset) {
                                    return (0, s.jsxs)("button", {
                                      key: preset,
                                      onClick: function() { setCalcIncome(preset); },
                                      className: "px-2.5 py-1 text-[11px] font-medium bg-white rounded-md border border-slate-200 text-slate-600 hover:bg-slate-100",
                                      children: ["$", (preset / 1000), "k"]
                                    });
                                  })
                                })
                              ]
                            }),

                            /* FPL Guidelines reference */
                            (0, s.jsxs)("div", {
                              className: "p-4 bg-white rounded-xl border border-slate-200 text-xs space-y-1 text-slate-600",
                              children: [
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { children: "2026 연방 빈곤선 100%:" }), (0, s.jsxs)("strong", { children: ["$", fplBase.toLocaleString()] })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { children: "메디케이드 기준 (138%):" }), (0, s.jsxs)("strong", { className: "text-emerald-700", children: ["$", Math.round(fplBase * 1.38).toLocaleString()] })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { children: "실버 CSR 감면 기준 (250%):" }), (0, s.jsxs)("strong", { className: "text-blue-700", children: ["$", Math.round(fplBase * 2.5).toLocaleString()] })] })
                              ]
                            })
                          ]
                        }),

                        /* Results Right Column */
                        (0, s.jsxs)("div", {
                          className: "lg:col-span-7 space-y-5",
                          children: [
                            /* Poverty Level Gauge Box */
                            (0, s.jsxs)("div", {
                              className: "p-5 rounded-2xl border " + (isMedicaid ? "bg-emerald-50/70 border-emerald-200" : isSilverCsr ? "bg-blue-50/70 border-blue-200" : "bg-slate-50 border-slate-200"),
                              children: [
                                (0, s.jsxs)("div", { className: "flex items-center justify-between mb-2", children: [
                                  (0, s.jsx)("span", { className: "text-xs font-bold text-slate-700", children: "연방 빈곤선(FPL) 소득 비율" }),
                                  (0, s.jsxs)("span", { className: "text-lg font-extrabold " + (isMedicaid ? "text-emerald-700" : isSilverCsr ? "text-blue-700" : "text-slate-800"), children: [fplRatio, "% FPL"] })
                                ] }),
                                (0, s.jsx)("div", {
                                  className: "w-full bg-slate-200 h-2.5 rounded-full overflow-hidden mb-3",
                                  children: (0, s.jsx)("div", {
                                    className: "h-full transition-all duration-300 " + (isMedicaid ? "bg-emerald-500" : isSilverCsr ? "bg-blue-600" : "bg-indigo-600"),
                                    style: { width: Math.min(100, Math.max(5, (fplRatio / 400) * 100)) + "%" }
                                  })
                                }),
                                (0, s.jsx)("div", {
                                  className: "text-xs font-bold",
                                  children: isMedicaid ? (
                                    (0, s.jsx)("span", { className: "text-emerald-800", children: "✓ NJ FamilyCare (메디케이드) 100% 무료 건강보험 신청 대상입니다." })
                                  ) : isSilverCsr ? (
                                    (0, s.jsx)("span", { className: "text-blue-800", children: "✓ GetCoveredNJ 실버 CSR 감면 + 연방 APTC + 주정부 3중 보조금 대상입니다." })
                                  ) : isAptcOnly ? (
                                    (0, s.jsx)("span", { className: "text-slate-800", children: "✓ GetCoveredNJ 연방 APTC 세액 공제 + 주정부 보조금 지원 대상입니다." })
                                  ) : (
                                    (0, s.jsx)("span", { className: "text-slate-700", children: "✓ GetCoveredNJ 마켓플레이스 표준 플랜 가입 대상입니다." })
                                  )
                                })
                              ]
                            }),

                            /* Subsidy Breakdown Summary */
                            (0, s.jsxs)("div", {
                              className: "grid grid-cols-2 gap-3",
                              children: [
                                (0, s.jsxs)("div", {
                                  className: "p-4 bg-slate-900 text-white rounded-xl",
                                  children: [
                                    (0, s.jsx)("div", { className: "text-[11px] text-slate-400 mb-1", children: "월 예상 정부 보조금 (합산)" }),
                                    (0, s.jsxs)("div", { className: "text-2xl font-extrabold text-blue-300", children: ["$", totalSubsidy.toLocaleString(), (0, s.jsx)("span", { className: "text-xs font-normal text-white/70", children: " / 월" })] }),
                                    (0, s.jsxs)("div", { className: "text-[10px] text-white/50 mt-1", children: ["연간 약 $", (totalSubsidy * 12).toLocaleString(), " 절감"] })
                                  ]
                                }),
                                (0, s.jsxs)("div", {
                                  className: "p-4 bg-blue-50 border border-blue-200 rounded-xl",
                                  children: [
                                    (0, s.jsx)("div", { className: "text-[11px] text-blue-800 font-semibold mb-1", children: "추천 플랜 (Silver 실버)" }),
                                    (0, s.jsxs)("div", { className: "text-2xl font-extrabold text-blue-900", children: ["$", isMedicaid ? "0" : estSilver.toLocaleString(), (0, s.jsx)("span", { className: "text-xs font-normal text-slate-600", children: " / 월" })] }),
                                    (0, s.jsx)("div", { className: "text-[10px] text-blue-700 mt-1", children: isSilverCsr ? "★ 디덕터블 $0~$500 파격 감면" : "표준 실버 보장" })
                                  ]
                                })
                              ]
                            }),

                            /* Tier comparison */
                            (0, s.jsxs)("div", {
                              className: "p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2 text-xs",
                              children: [
                                (0, s.jsx)("strong", { className: "block text-slate-800 text-sm mb-1", children: "플랜 등급별 예상 실부담 월 보험료:" }),
                                (0, s.jsxs)("div", { className: "flex justify-between p-2 bg-white rounded border border-slate-200", children: [(0, s.jsx)("span", { children: "🥉 Bronze (기본형)" }), (0, s.jsxs)("strong", { children: ["$", isMedicaid ? "0" : estBronze, " / 월"] })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between p-2 bg-blue-50 rounded border border-blue-200 text-blue-900 font-bold", children: [(0, s.jsx)("span", { children: "🥈 Silver (추천 / CSR 감면)" }), (0, s.jsxs)("strong", { children: ["$", isMedicaid ? "0" : estSilver, " / 월"] })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between p-2 bg-white rounded border border-slate-200", children: [(0, s.jsx)("span", { children: "🥇 Gold (종합형)" }), (0, s.jsxs)("strong", { children: ["$", isMedicaid ? "0" : estGold, " / 월"] })] })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                }),

                /* TAB 3: MEDICAL DICTIONARY */
                activeTab === "dictionary" && (0, s.jsxs)("div", {
                  className: "max-w-4xl mx-auto",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "text-center mb-8",
                      children: [
                        (0, s.jsx)("span", { className: "text-xs font-bold text-blue-600 uppercase tracking-widest block mb-1", children: "TOOL 3 · MEDICAL DICTIONARY" }),
                        (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl text-slate-900 mb-2", children: "영-한 의학 용어 & 병원 실전 회화 사전" }),
                        (0, s.jsx)("p", { className: "text-xs sm:text-sm text-slate-600", children: "미국 병원, 클리닉, 응급실, 약국에서 자주 사용하는 필수 영문 의학 표현과 진료실 회화를 검색하세요." })
                      ]
                    }),

                    /* Search & Category filter */
                    (0, s.jsxs)("div", {
                      className: "mb-6 space-y-3",
                      children: [
                        (0, s.jsx)("input", {
                          type: "text",
                          value: dictSearch,
                          onChange: function(e) { setDictSearch(e.target.value); },
                          placeholder: "🔍 영어 단어, 한글 증상, 진료과목 검색 (예: Cardiology, 흉통, 혈압, 통역)...",
                          className: "w-full p-4 rounded-2xl border border-slate-300 text-sm outline-none focus:border-blue-600 shadow-xs"
                        }),
                        (0, s.jsx)("div", {
                          className: "flex flex-wrap gap-2",
                          children: ["전체", "진료과목", "증상 표현", "검사 및 약물", "진료실 회화"].map(function(c) {
                            return (0, s.jsx)("button", {
                              key: c,
                              onClick: function() { setDictCat(c); },
                              className: "px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all " + (dictCat === c ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200")
                            }, c);
                          })
                        })
                      ]
                    }),

                    /* Dictionary Results Grid */
                    (0, s.jsx)("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 gap-4",
                      children: filteredDict.length > 0 ? filteredDict.map(function(item, idx) {
                        return (0, s.jsxs)("div", {
                          key: idx,
                          className: "p-4 rounded-2xl border border-slate-200 hover:border-blue-400 bg-white transition-all shadow-xs flex flex-col justify-between",
                          children: [
                            (0, s.jsxs)("div", {
                              children: [
                                (0, s.jsxs)("div", { className: "flex justify-between items-center mb-1.5", children: [
                                  (0, s.jsx)("span", { className: "text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600 uppercase tracking-wider", children: item.cat }),
                                  (0, s.jsx)("button", {
                                    onClick: function() { copyText(item.en + " (" + item.ko + ")", idx); },
                                    className: "text-[11px] text-blue-600 hover:underline font-medium",
                                    children: copiedIdx === idx ? "✓ 복사됨" : "복사"
                                  })
                                ] }),
                                (0, s.jsx)("h3", { className: "font-bold text-base text-slate-900", children: item.en }),
                                (0, s.jsx)("p", { className: "text-xs font-semibold text-blue-700 mb-2", children: item.ko }),
                                (0, s.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed", children: item.desc })
                              ]
                            })
                          ]
                        });
                      }) : (
                        (0, s.jsx)("div", { className: "col-span-2 text-center py-10 text-slate-400 text-sm", children: "검색 결과가 없습니다. 다른 검색어를 입력해 보세요." })
                      )
                    })
                  ]
                }),

                /* TAB 4: PATIENT PORTAL & AI */
                activeTab === "portal" && (0, s.jsxs)("div", {
                  className: "max-w-5xl mx-auto",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "flex justify-center gap-2 mb-6",
                      children: [
                        (0, s.jsx)("button", {
                          onClick: function() { setPortalMode("ai"); },
                          className: "px-5 py-2.5 rounded-full text-xs font-bold transition-all " + (portalMode === "ai" ? "bg-slate-900 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"),
                          children: "🤖 AI 스마트 의료 질문 센터"
                        }),
                        (0, s.jsx)("button", {
                          onClick: function() { setPortalMode("chart"); },
                          className: "px-5 py-2.5 rounded-full text-xs font-bold transition-all " + (portalMode === "chart" ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-700 hover:bg-slate-200"),
                          children: "📝 온라인 병원 사전접수 차트"
                        })
                      ]
                    }),

                    portalMode === "ai" ? (
                      (0, s.jsx)("div", {
                        className: "w-full h-[650px] rounded-2xl overflow-hidden border border-slate-300 bg-slate-950",
                        children: (0, s.jsx)("iframe", {
                          src: "https://hacgenini.ai.studio",
                          title: "Healthcare Access Portal - 질문센터",
                          className: "w-full h-full border-0 block",
                          allow: "camera *; microphone *; geolocation *; display-capture *; clipboard-write *"
                        })
                      })
                    ) : (
                      (0, s.jsx)("div", {
                        className: "max-w-2xl mx-auto",
                        children: pChartDone ? (
                          (0, s.jsxs)("div", {
                            className: "p-8 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 space-y-4",
                            children: [
                              (0, s.jsx)("div", { className: "text-center pb-3 border-b border-slate-200", children: [
                                (0, s.jsx)("span", { className: "text-xs font-bold px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full", children: "사전접수 완료" }),
                                (0, s.jsx)("h3", { className: "font-serif text-2xl mt-2 font-bold text-slate-900", children: "병원 사전접수 확인증" }),
                                (0, s.jsxs)("p", { className: "text-xs text-slate-500 font-mono mt-1", children: ["접수 번호: ", pChartDone.num] })
                              ] }),
                              (0, s.jsxs)("div", { className: "space-y-2 text-sm", children: [
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { className: "text-slate-500", children: "환자 성함:" }), (0, s.jsx)("strong", { children: pChartDone.name })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { className: "text-slate-500", children: "생년월일:" }), (0, s.jsx)("span", { children: pChartDone.dob })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { className: "text-slate-500", children: "연락처:" }), (0, s.jsx)("span", { children: pChartDone.phone })] }),
                                (0, s.jsxs)("div", { className: "flex justify-between", children: [(0, s.jsx)("span", { className: "text-slate-500", children: "희망 진료과:" }), (0, s.jsx)("strong", { className: "text-blue-700", children: pChartDone.dept })] }),
                                (0, s.jsxs)("div", { className: "pt-2 border-t border-slate-200", children: [
                                  (0, s.jsx)("span", { className: "text-slate-500 text-xs block mb-1", children: "주요 증상 및 전달사항:" }),
                                  (0, s.jsx)("p", { className: "p-3 bg-white rounded-lg border border-slate-200 text-xs leading-relaxed", children: pChartDone.symp })
                                ] })
                              ] }),
                              (0, s.jsxs)("div", { className: "pt-4 flex gap-3 justify-center", children: [
                                (0, s.jsx)("button", { onClick: function() { window.print(); }, className: "btn-outline text-xs py-2.5 px-5", children: "🖨️ 확인증 인쇄" }),
                                (0, s.jsx)("button", { onClick: function() { setPChartDone(null); }, className: "btn-primary text-xs py-2.5 px-5", children: "새 접수 작성" })
                              ] })
                            ]
                          })
                        ) : (
                          (0, s.jsxs)("div", {
                            className: "space-y-4",
                            children: [
                              (0, s.jsxs)("div", { children: [
                                (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "환자 성함 *" }),
                                (0, s.jsx)("input", { type: "text", value: pName, onChange: function(e) { setPName(e.target.value); }, placeholder: "홍길동", className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500" })
                              ] }),
                              (0, s.jsxs)("div", { className: "grid grid-cols-2 gap-3", children: [
                                (0, s.jsxs)("div", { children: [
                                  (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "생년월일" }),
                                  (0, s.jsx)("input", { type: "text", value: pDob, onChange: function(e) { setPDob(e.target.value); }, placeholder: "YYYY-MM-DD", className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500" })
                                ] }),
                                (0, s.jsxs)("div", { children: [
                                  (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "연락처 (전화번호) *" }),
                                  (0, s.jsx)("input", { type: "tel", value: pPhone, onChange: function(e) { setPPhone(e.target.value); }, placeholder: "201-000-0000", className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500" })
                                ] })
                              ] }),
                              (0, s.jsxs)("div", { children: [
                                (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "희망 진료과목" }),
                                (0, s.jsx)("select", { value: pDept, onChange: function(e) { setPDept(e.target.value); }, className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500 bg-white", children: ["일반 내과", "심장내과", "신경과", "소화기내과", "가정의학과", "정형외과", "안과", "피부과"].map(function(d) {
                                  return (0, s.jsx)("option", { value: d }, d);
                                }) })
                              ] }),
                              (0, s.jsxs)("div", { children: [
                                (0, s.jsx)("label", { className: "block text-xs font-bold text-slate-700 mb-1", children: "주요 증상 및 메모" }),
                                (0, s.jsx)("textarea", { rows: 3, value: pSymp, onChange: function(e) { setPSymp(e.target.value); }, placeholder: "현재 겪고 계신 증상이나 문의사항을 간단히 적어주세요.", className: "w-full p-3 rounded-xl border border-slate-300 text-sm outline-none focus:border-blue-500" })
                              ] }),
                              (0, s.jsx)("button", { onClick: submitChart, className: "btn-primary w-full justify-center py-3.5 text-sm", children: "사전접수 차트 생성하기 →" })
                            ]
                          })
                        )
                      })
                    )
                  ]
                })
              ]
            })
          })
        ]
      });
    }

    e.s(["default", 0, PatientHubPage]);
  }
]);
`;

fs.writeFileSync(path.join(__dirname, '../_next/static/chunks/44d3rx9sem_np.js'), componentCode, 'utf8');
console.log('Successfully updated 44d3rx9sem_np.js for tool page');

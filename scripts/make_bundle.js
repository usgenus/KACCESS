const fs = require('fs');
const path = require('path');

const componentBody = `
(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([
  typeof document === "object" ? document.currentScript : void 0,
  82526,
  function(e) {
    "use strict";
    var s = e.i(43476), t = e.i(71645);

    function MedicarePage() {
      var _useState1 = (0, t.useState)(1), step = _useState1[0], setStep = _useState1[1];
      var _useState2 = (0, t.useState)(""), age = _useState2[0], setAge = _useState2[1];
      var _useState3 = (0, t.useState)(""), status = _useState3[0], setStatus = _useState3[1];
      var _useState4 = (0, t.useState)(""), income = _useState4[0], setIncome = _useState4[1];
      var _useState5 = (0, t.useState)(null), result = _useState5[0], setResult = _useState5[1];

      function calculateResult() {
        var a = parseInt(age, 10);
        if (isNaN(a)) return;
        if (a >= 65) {
          if (income === 'low' || income === 'very_low') {
            setResult("메디케어 + 메디케이드(NJ FamilyCare) 이중 자격(Dual Eligible / D-SNP) 또는 뉴저지 주정부 메디케어 저축 프로그램(MSP - Part B 보험료 전액 대납) 및 처방약 보조 프로그램(PAAD) 지원 대상일 가능성이 매우 높습니다.");
          } else if (income === 'medium') {
            setResult("오리지널 메디케어(Part A & B) + 서플리먼트(Medigap) + Part D 처방약 플랜, 또는 치과/안과/OTC 카드 혜택이 풍부한 메디케어 어드밴티지(Part C)를 비교 선택하시기 바랍니다. 소득에 따라 Senior Gold 처방약 할인 혜택도 가능합니다.");
          } else {
            setResult("메디케어 기본 보장(Part A & B)과 함께 병원 선택의 자유도가 높은 오리지널 메디케어 + Medigap Plan G 조합이나, 프리미엄 메디케어 어드밴티지(Part C PPO) 플랜을 추천합니다. 고소득자의 경우 Part B/D IRMAA 추가 할증료가 적용될 수 있습니다.");
          }
        } else {
          if (income === 'very_low') {
            if (status === '시민권자' || status === '영주권자 (5년 이상)') {
              setResult("뉴저지 주 메디케이드 (NJ FamilyCare) 전액 무료 건강보험 신청 대상입니다. 월 보험료 $0 및 본인부담금 $0~$5 수준으로 연중 365일 언제든 신청하실 수 있습니다.");
            } else if (status === '서류미비 / 기타') {
              setResult("뉴저지 병원비 감면 프로그램(Charity Care)을 통해 급성기 병원 및 응급 진료비를 소득에 따라 50%~100% 주정부 지원으로 감면받으실 수 있습니다. 임산부 및 19세 미만 자녀는 'Cover All Kids'로 체류 신분과 무관하게 무료 메디케이드가 적용됩니다.");
            } else {
              setResult("GetCoveredNJ 마켓플레이스를 통한 플랜 가입 또는 뉴저지 병원비 감면(Charity Care) 지원 대상입니다.");
            }
          } else if (income === 'low') {
            setResult("GetCoveredNJ 마켓플레이스를 통해 연방 세액 공제(APTC) + 뉴저지 주정부 추가 지원금(NJHPS) + 실버 플랜 비용 분담 감면(CSR) 3중 혜택을 받으실 수 있습니다. 실버 플랜 선택 시 디덕터블과 병원 코페이가 획기적으로 낮아집니다.");
          } else if (income === 'medium') {
            setResult("GetCoveredNJ 마켓플레이스를 통해 연방 세액 공제(APTC) 및 뉴저지 주정부 지원금(NJHPS)을 지원받아 월 보험료를 크게 절감하실 수 있습니다.");
          } else {
            setResult("GetCoveredNJ 또는 민간 건강보험 플랜 가입 대상입니다. 뉴저지주 의무 가입 규정(Individual Mandate)에 따라 무보험 시 주 세금 보고 시 벌금이 부과되므로 적격 보험 유지가 필수적입니다.");
          }
        }
      }

      return (0, s.jsxs)("div", {
        className: "flex flex-col medicare-hub",
        children: [
          /* Hero */
          (0, s.jsx)("section", {
            className: "hub-hero py-14 sm:py-20 border-b border-white/10",
            children: (0, s.jsxs)("div", {
              className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
              children: [
                (0, s.jsx)("span", {
                  className: "hub-pill bg-blue-500/20 text-blue-300 border border-blue-400/30 mb-4 inline-block font-sans text-xs",
                  children: "2026 Comprehensive Medicare & ACA Healthcare Guide"
                }),
                (0, s.jsx)("h1", {
                  className: "font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-4 leading-tight",
                  children: "메디케어 & ACA 건강보험 완전 가이드"
                }),
                (0, s.jsx)("p", {
                  className: "text-white/80 font-sans text-sm sm:text-base lg:text-lg max-w-3xl leading-relaxed mb-7",
                  children: "뉴저지 한인 동포를 위한 주정부 건강보험(GetCoveredNJ), 메디케이드(NJ FamilyCare), 2026년 메디케어 최신 개정 규정 및 주정부 시니어 특별 지원 프로그램(MSP·PAAD) 완벽 총정리"
                }),
                (0, s.jsxs)("div", {
                  className: "flex flex-wrap gap-2 pt-1",
                  children: [
                    (0, s.jsx)("a", { href: "#aca-section", className: "hub-pill hub-pill-nav", children: "1. ACA & NJ FamilyCare" }),
                    (0, s.jsx)("a", { href: "#aca-timeline", className: "hub-pill hub-pill-nav", children: "2. 가입 기간 & 벌금" }),
                    (0, s.jsx)("a", { href: "#medicare-parts", className: "hub-pill hub-pill-nav", children: "3. 메디케어 4대 파트" }),
                    (0, s.jsx)("a", { href: "#medicare-ira-2026", className: "hub-pill hub-pill-highlight", children: "★ 2026 IRA 핵심 개정점" }),
                    (0, s.jsx)("a", { href: "#plan-comparison", className: "hub-pill hub-pill-nav", children: "4. 오리지널 vs 어드밴티지 비교" }),
                    (0, s.jsx)("a", { href: "#medicare-penalty", className: "hub-pill hub-pill-nav", children: "5. 가입 시기 & 지연 벌금" }),
                    (0, s.jsx)("a", { href: "#nj-senior-support", className: "hub-pill hub-pill-nav", children: "6. NJ 시니어 지원(MSP/PAAD)" }),
                    (0, s.jsx)("a", { href: "#finder", className: "hub-pill", style: { background: "#2563eb", color: "#ffffff" }, children: "맞춤 진단기 바로가기 →" })
                  ]
                })
              ]
            })
          }),

          /* ACA Section */
          (0, s.jsx)("section", {
            id: "aca-section",
            className: "py-14 sm:py-18 bg-brand-light border-b border-brand-border",
            children: (0, s.jsxs)("div", {
              className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
              children: [
                (0, s.jsxs)("div", {
                  className: "max-w-3xl mb-10",
                  children: [
                    (0, s.jsx)("span", { className: "text-xs font-sans font-bold uppercase tracking-widest text-brand-blue mb-1.5 block", children: "PART 1 · 뉴저지 주정부 건강보험" }),
                    (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-dark mb-3", children: "1. ACA 건강보험 (GetCoveredNJ) & NJ FamilyCare" }),
                    (0, s.jsx)("p", { className: "text-brand-muted font-sans text-sm sm:text-base leading-relaxed", children: "뉴저지주는 자체 주 마켓플레이스인 GetCoveredNJ를 운영하며, 연방 보조금 외에 주정부 차원의 추가 보조금(NJHPS) 및 의무 가입 규정을 시행하고 있습니다." })
                  ]
                }),
                (0, s.jsxs)("div", {
                  className: "mb-12",
                  children: [
                    (0, s.jsxs)("h3", { className: "font-serif text-xl sm:text-2xl text-brand-dark mb-5 flex items-center gap-2", children: [(0, s.jsx)("span", { style: { width: "10px", height: "22px", background: "#2563eb", borderRadius: "99px", display: "inline-block" } }), "(1) 보험 가입 자격 및 경로 구분"] }),
                    (0, s.jsxs)("div", {
                      className: "grid grid-cols-1 lg:grid-cols-3 gap-6",
                      children: [
                        /* NJ FamilyCare */
                        (0, s.jsx)("div", {
                          className: "hub-card p-6 sm:p-7 flex flex-col justify-between",
                          style: { borderTop: "4px solid #10b981" },
                          children: (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
                                (0, s.jsx)("span", { className: "text-xs font-bold px-3 py-1 rounded-full text-emerald-800 bg-emerald-50 border border-emerald-200", children: "무료 건강보험" }),
                                (0, s.jsx)("span", { className: "text-xs text-brand-muted font-medium", children: "소득 138% 이하" })
                              ] }),
                              (0, s.jsx)("h4", { className: "font-serif text-2xl text-brand-dark mb-1.5", children: "NJ FamilyCare" }),
                              (0, s.jsx)("p", { className: "text-xs text-emerald-800 font-semibold mb-4 bg-emerald-50 p-2 rounded-lg", children: "뉴저지 메디케이드 / 저소득층 무료 건강보험" }),
                              (0, s.jsxs)("ul", { className: "space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed", children: [
                                (0, s.jsxs)("li", { className: "flex items-start gap-2", children: [(0, s.jsx)("span", { className: "text-emerald-600 font-bold", children: "•" }), (0, s.jsxs)("span", { children: [(0, s.jsx)("strong", { children: "소득 기준:" }), " FPL 138% 이하 (1인 가구 월 약 $1,800 / 연 약 $21,597 이하)."] })] }),
                                (0, s.jsxs)("li", { className: "flex items-start gap-2", children: [(0, s.jsx)("span", { className: "text-emerald-600 font-bold", children: "•" }), (0, s.jsxs)("span", { children: [(0, s.jsx)("strong", { children: "혜택:" }), " 월 보험료 $0, 진료비/약값 코페이 $0~$5 수준."] })] })
                              ] }),
                              (0, s.jsxs)("details", {
                                className: "hub-details",
                                children: [
                                  (0, s.jsx)("summary", { className: "hub-summary", children: "상세 자격 및 지원 요건" }),
                                  (0, s.jsxs)("div", { className: "hub-details-content space-y-2", children: [
                                    (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "• 체류 신분:" }), " 시민권자, 영주권 5년 이상 경과자."] }),
                                    (0, s.jsxs)("p", { className: "p-2.5 bg-emerald-50/70 rounded-lg text-emerald-900 border border-emerald-100 text-xs", children: [(0, s.jsx)("strong", { children: "★ Cover All Kids 특혜:" }), " 임산부 및 19세 미만 아동은 영주권 기간과 무관하게 무료 혜택 적용."] }),
                                    (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "• 가입 시기:" }), " 연중 365일 언제든 상시 신청 가능."] })
                                  ] })
                                ]
                              })
                            ]
                          })
                        }),

                        /* GetCoveredNJ */
                        (0, s.jsx)("div", {
                          className: "hub-card p-6 sm:p-7 flex flex-col justify-between",
                          style: { borderTop: "4px solid #2563eb" },
                          children: (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
                                (0, s.jsx)("span", { className: "text-xs font-bold px-3 py-1 rounded-full text-blue-800 bg-blue-50 border border-blue-200", children: "주정부 마켓플레이스" }),
                                (0, s.jsx)("span", { className: "text-xs text-brand-muted font-medium", children: "소득 138% 초과" })
                              ] }),
                              (0, s.jsx)("h4", { className: "font-serif text-2xl text-brand-dark mb-1.5", children: "GetCoveredNJ" }),
                              (0, s.jsx)("p", { className: "text-xs text-blue-800 font-semibold mb-4 bg-blue-50 p-2 rounded-lg", children: "ACA 오바마케어 마켓플레이스 (주정부 보조금)" }),
                              (0, s.jsxs)("ul", { className: "space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed", children: [
                                (0, s.jsxs)("li", { className: "flex items-start gap-2", children: [(0, s.jsx)("span", { className: "text-blue-600 font-bold", children: "•" }), (0, s.jsxs)("span", { children: [(0, s.jsx)("strong", { children: "소득 기준:" }), " FPL 138% 초과 가구."] })] }),
                                (0, s.jsxs)("li", { className: "flex items-start gap-2", children: [(0, s.jsx)("span", { className: "text-blue-600 font-bold", children: "•" }), (0, s.jsxs)("span", { children: [(0, s.jsx)("strong", { children: "체류 신분:" }), " 합법적 체류자 전원 (H-1B, E-2, L-1, F-1 OPT 등)."] })] })
                              ] }),
                              (0, s.jsxs)("details", {
                                className: "hub-details",
                                children: [
                                  (0, s.jsx)("summary", { className: "hub-summary", children: "2026년 3중 보조금 구조 보기" }),
                                  (0, s.jsxs)("div", { className: "hub-details-content space-y-2 text-xs", children: [
                                    (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "1) 연방 세액 공제 (APTC):" }), " 가구 소득에 비례하여 기본 보험료를 대폭 지원."] }),
                                    (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "2) 뉴저지 추가 지원금 (NJHPS):" }), " 타 주 대비 실부담액 대폭 저렴."] }),
                                    (0, s.jsxs)("p", { className: "p-2.5 bg-blue-50/70 rounded-lg text-blue-900 border border-blue-100", children: [(0, s.jsx)("strong", { children: "3) 실버 플랜 CSR 감면:" }), " FPL 250% 이하(1인 연 $39,125 이하) Silver 선택 시 디덕터블 및 코페이 파격 인하."] })
                                  ] })
                                ]
                              })
                            ]
                          })
                        }),

                        /* Charity Care */
                        (0, s.jsx)("div", {
                          className: "hub-card p-6 sm:p-7 flex flex-col justify-between",
                          style: { borderTop: "4px solid #f59e0b" },
                          children: (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
                                (0, s.jsx)("span", { className: "text-xs font-bold px-3 py-1 rounded-full text-amber-800 bg-amber-50 border border-amber-200", children: "병원비 감면" }),
                                (0, s.jsx)("span", { className: "text-xs text-brand-muted font-medium", children: "체류 신분 무관" })
                              ] }),
                              (0, s.jsx)("h4", { className: "font-serif text-2xl text-brand-dark mb-1.5", children: "뉴저지 Charity Care" }),
                              (0, s.jsx)("p", { className: "text-xs text-amber-800 font-semibold mb-4 bg-amber-50 p-2 rounded-lg", children: "뉴저지 병원 무료 진료 지원 (병원비 감면)" }),
                              (0, s.jsxs)("ul", { className: "space-y-2.5 text-xs sm:text-sm text-slate-700 leading-relaxed", children: [
                                (0, s.jsxs)("li", { className: "flex items-start gap-2", children: [(0, s.jsx)("span", { className: "text-amber-600 font-bold", children: "•" }), (0, s.jsxs)("span", { children: [(0, s.jsx)("strong", { children: "대상:" }), " 서류미비자 및 보험 미적격 저소득층."] })] }),
                                (0, s.jsxs)("li", { className: "flex items-start gap-2", children: [(0, s.jsx)("span", { className: "text-amber-600 font-bold", children: "•" }), (0, s.jsxs)("span", { children: [(0, s.jsx)("strong", { children: "지원:" }), " 급성기 병원 응급실/입원 진료비 50%~100% 감면."] })] })
                              ] }),
                              (0, s.jsxs)("details", {
                                className: "hub-details",
                                children: [
                                  (0, s.jsx)("summary", { className: "hub-summary", children: "신청 방법 및 소득 기준" }),
                                  (0, s.jsxs)("div", { className: "hub-details-content space-y-2 text-xs", children: [
                                    (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "• 소득 기준:" }), " FPL 200%~500% 구간별 50~100% 감면."] }),
                                    (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "• 신청:" }), " 병원 원무과(Financial Assistance)에 재정보조 신청서 제출."] })
                                  ] })
                                ]
                              })
                            ]
                          })
                        })
                      ]
                    })
                  ]
                }),

                /* Timeline & Mandate */
                (0, s.jsxs)("div", {
                  id: "aca-timeline",
                  className: "grid grid-cols-1 lg:grid-cols-2 gap-6",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "hub-card p-6 sm:p-7",
                      children: [
                        (0, s.jsxs)("h3", { className: "font-serif text-xl text-brand-dark mb-4 flex items-center gap-2", children: [(0, s.jsx)("span", { children: "📅" }), "(2) 가입 기간 및 신청 타임라인"] }),
                        (0, s.jsxs)("div", {
                          className: "space-y-3.5 text-xs sm:text-sm",
                          children: [
                            (0, s.jsxs)("div", {
                              className: "p-4 rounded-xl bg-blue-50/60 border border-blue-100",
                              children: [
                                (0, s.jsx)("h4", { className: "font-bold text-brand-blue mb-1", children: "오픈 등록 기간 (Open Enrollment Period)" }),
                                (0, s.jsxs)("p", { className: "text-slate-800 font-medium mb-1", children: [(0, s.jsx)("strong", { children: "매년 11월 1일 ~ 1월 31일" }), " (연방 마감 1/15 대비 2주 연장)"] }),
                                (0, s.jsx)("p", { className: "text-xs text-slate-600", children: "• 12/31까지 완료 시 1월 1일 효력 / 1/1~1/31 등록 시 2월 1일 효력 발생" })
                              ]
                            }),
                            (0, s.jsxs)("details", {
                              className: "hub-details",
                              children: [
                                (0, s.jsx)("summary", { className: "hub-summary", children: "특별 등록 기간 (SEP) 요건 확인" }),
                                (0, s.jsxs)("div", { className: "hub-details-content text-xs space-y-1.5 p-3 bg-slate-50 rounded-xl border border-slate-200", children: [
                                  (0, s.jsx)("p", { children: [(0, s.jsx)("strong", { children: "• 유자격 인생 사건(QLE) 발생 후 60일 이내:" })] }),
                                  (0, s.jsx)("p", { children: "직장 퇴사(보험 상실), 타주에서 뉴저지로 이사, 결혼/이혼, 출산/입양, 체류 신분 변경 등 발생 시 오픈 등록 기간 외에도 즉시 가입 가능." })
                                ] })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    (0, s.jsxs)("div", {
                      className: "hub-card p-6 sm:p-7",
                      style: { background: "#fffbeb", borderColor: "#fde68a" },
                      children: [
                        (0, s.jsxs)("h3", { className: "font-serif text-xl text-amber-950 mb-3 flex items-center gap-2", children: [(0, s.jsx)("span", { children: "⚠️" }), "(3) 뉴저지 건강보험 의무 가입 규정"] }),
                        (0, s.jsxs)("p", { className: "text-xs text-amber-900 leading-relaxed mb-3", children: [
                          "뉴저지는 주법에 따라 ", (0, s.jsx)("strong", { children: "건강보험 가입 의무화 법안(Individual Mandate)" }), "을 시행 중입니다. 1년 중 3개월 이상 무보험 시 주 소득세(NJ-1040) 신고 시 벌금이 부과됩니다."
                        ] }),
                        (0, s.jsxs)("details", {
                          className: "hub-details",
                          children: [
                            (0, s.jsx)("summary", { className: "hub-summary", style: { color: "#b45309" }, children: "벌금 산정 기준 및 면제 확인" }),
                            (0, s.jsxs)("div", { className: "hub-details-content text-xs space-y-2 p-3 bg-white rounded-xl border border-amber-200 text-amber-950", children: [
                              (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "• 벌금액 산정:" }), " 성인 1인당 수백 달러 정액 또는 소득 초과분의 2.5% 중 ", (0, s.jsx)("strong", { children: "더 큰 금액" }), "이 환급액에서 공제되거나 추가 징수됩니다."] }),
                              (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "• 주의:" }), " 소득에 따라 무료 또는 월 몇 달러 수준의 보조금 플랜 가입이 가능하므로 벌금을 피하고 혜택을 챙기시기 바랍니다."] })
                            ] })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          }),

          /* Medicare Section */
          (0, s.jsx)("section", {
            id: "medicare-guide",
            className: "py-14 sm:py-18 bg-white border-b border-brand-border",
            children: (0, s.jsxs)("div", {
              className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",
              children: [
                (0, s.jsxs)("div", {
                  className: "max-w-3xl mb-10",
                  children: [
                    (0, s.jsx)("span", { className: "text-xs font-sans font-bold uppercase tracking-widest text-brand-blue mb-1.5 block", children: "PART 2 · 2026 연방 메디케어 심층 가이드" }),
                    (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-dark mb-3", children: "2. 메디케어 (Medicare) — 2026 심층 안내" }),
                    (0, s.jsx)("p", { className: "text-brand-muted font-sans text-sm sm:text-base leading-relaxed", children: "메디케어는 만 65세 이상 시니어 또는 24개월 이상 SSDI(장애연금) 수령자, 말기 신부전증(ESRD) 환자를 위한 연방 건강보험 프로그램입니다." })
                  ]
                }),

                /* 4 Parts */
                (0, s.jsxs)("div", {
                  id: "medicare-parts",
                  className: "mb-12",
                  children: [
                    (0, s.jsxs)("h3", { className: "font-serif text-xl sm:text-2xl text-brand-dark mb-5 flex items-center gap-2", children: [(0, s.jsx)("span", { style: { width: "10px", height: "22px", background: "#2563eb", borderRadius: "99px", display: "inline-block" } }), "(1) 메디케어 파트별 기본 구조"] }),
                    (0, s.jsxs)("div", {
                      className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5",
                      children: [
                        /* Part A */
                        (0, s.jsx)("div", {
                          className: "hub-card p-5 sm:p-6 flex flex-col justify-between",
                          style: { background: "#f8fafc" },
                          children: (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
                                (0, s.jsx)("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full text-white", style: { background: "#2563eb" }, children: "Part A" }),
                                (0, s.jsx)("span", { className: "text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600", children: "병원 보험" })
                              ] }),
                              (0, s.jsx)("h4", { className: "font-serif text-xl text-brand-dark mb-1.5", children: "병원 입원 보험" }),
                              (0, s.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed mb-3", children: "병원 입원, 전문 간호 시설(SNF), 호스피스 간호 보장." }),
                              (0, s.jsxs)("div", { className: "bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1", children: [
                                (0, s.jsxs)("p", { children: ["• 40크레딧(10년 납부자): ", (0, s.jsx)("strong", { children: "월 $0 (무료)" })] }),
                                (0, s.jsx)("p", { className: "text-slate-500 text-[11px]", children: "• 부족 시 월 최대 $500대 별도 납부" })
                              ] })
                            ]
                          })
                        }),

                        /* Part B */
                        (0, s.jsx)("div", {
                          className: "hub-card p-5 sm:p-6 flex flex-col justify-between",
                          style: { background: "#f8fafc" },
                          children: (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
                                (0, s.jsx)("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full text-white", style: { background: "#7c3aed" }, children: "Part B" }),
                                (0, s.jsx)("span", { className: "text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600", children: "의료 보험" })
                              ] }),
                              (0, s.jsx)("h4", { className: "font-serif text-xl text-brand-dark mb-1.5", children: "외래 의료 보험" }),
                              (0, s.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed mb-3", children: "의사 진료, 외래 검사, 응급실, 외래 수술, 의료 장비 보장." }),
                              (0, s.jsxs)("div", { className: "bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1", children: [
                                (0, s.jsxs)("p", { children: ["• 2026 표준 보험료: ", (0, s.jsx)("strong", { children: "월 약 $185 내외" })] }),
                                (0, s.jsx)("p", { className: "text-slate-500 text-[11px]", children: "• 80% 정부 보장 / 20% 본인 부담 (소득연동 IRMAA)" })
                              ] })
                            ]
                          })
                        }),

                        /* Part C */
                        (0, s.jsx)("div", {
                          className: "hub-card p-5 sm:p-6 flex flex-col justify-between",
                          style: { background: "#f8fafc" },
                          children: (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
                                (0, s.jsx)("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full text-white", style: { background: "#4f46e5" }, children: "Part C" }),
                                (0, s.jsx)("span", { className: "text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600", children: "우대 보험" })
                              ] }),
                              (0, s.jsx)("h4", { className: "font-serif text-xl text-brand-dark mb-1.5", children: "메디케어 어드밴티지" }),
                              (0, s.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed mb-3", children: "민간 보험사 종합 패키지 (Part A+B+D 통합 + 부가 혜택)." }),
                              (0, s.jsxs)("div", { className: "bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1", children: [
                                (0, s.jsx)("p", { children: [(0, s.jsx)("strong", { children: "• 월 $0 추가 보험료 플랜 다수" })] }),
                                (0, s.jsx)("p", { className: "text-slate-500 text-[11px]", children: "• 치과, 안과, 보청기, 한방/침술, OTC 카드" })
                              ] })
                            ]
                          })
                        }),

                        /* Part D */
                        (0, s.jsx)("div", {
                          className: "hub-card p-5 sm:p-6 flex flex-col justify-between",
                          style: { background: "#f8fafc" },
                          children: (0, s.jsxs)("div", {
                            children: [
                              (0, s.jsxs)("div", { className: "flex items-center justify-between mb-3", children: [
                                (0, s.jsx)("span", { className: "text-xs font-bold px-2.5 py-1 rounded-full text-white", style: { background: "#0d9488" }, children: "Part D" }),
                                (0, s.jsx)("span", { className: "text-[11px] font-medium bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-600", children: "처방약 보험" })
                              ] }),
                              (0, s.jsx)("h4", { className: "font-serif text-xl text-brand-dark mb-1.5", children: "처방 의약품 보험" }),
                              (0, s.jsx)("p", { className: "text-xs text-slate-600 leading-relaxed mb-3", children: "민간 보험사를 통한 외래 처방약 보장 (등급별 코페이)." }),
                              (0, s.jsxs)("div", { className: "bg-white p-3 rounded-xl border border-slate-200 text-xs text-slate-800 space-y-1", children: [
                                (0, s.jsx)("p", { children: [(0, s.jsx)("strong", { children: "• 2026 연간 $2,100 상한제 적용" })] }),
                                (0, s.jsx)("p", { className: "text-slate-500 text-[11px]", children: "• 도넛홀 완전 폐지 & 12개월 무이자 분할" })
                              ] })
                            ]
                          })
                        })
                      ]
                    })
                  ]
                }),

                /* IRA 2026 Highlight */
                (0, s.jsx)("div", {
                  id: "medicare-ira-2026",
                  className: "ira-dark-card p-7 sm:p-9 mb-12",
                  children: (0, s.jsxs)("div", {
                    children: [
                      (0, s.jsx)("span", { className: "hub-pill mb-3", style: { background: "rgba(59,130,246,0.3)", color: "#93c5fd", border: "1px solid rgba(147,197,253,0.4)" }, children: "★ 2026 인플레이션 감축법(IRA) 핵심 혁신" }),
                      (0, s.jsx)("h3", { className: "font-serif text-2xl sm:text-3xl text-white mb-2", children: "(2) 2026년 인플레이션 감축법(IRA)에 따른 핵심 변경점" }),
                      (0, s.jsx)("p", { className: "text-slate-300 font-sans text-xs sm:text-sm max-w-3xl leading-relaxed mb-6", children: "2026년부터 메디케어 처방약(Part D) 구조가 전면 개편되어 어르신들의 의료비 부담이 획기적으로 줄어듭니다." }),
                      (0, s.jsxs)("div", {
                        className: "grid grid-cols-1 md:grid-cols-2 gap-5",
                        children: [
                          (0, s.jsxs)("div", {
                            className: "ira-subcard",
                            children: [
                              (0, s.jsx)("div", { className: "text-2xl mb-2", children: "🛡️" }),
                              (0, s.jsx)("h4", { className: "font-serif text-lg font-bold text-blue-200 mb-2", children: "1. 처방약 연간 본인부담금 최대 $2,100 상한제" }),
                              (0, s.jsxs)("p", { className: "text-xs sm:text-sm text-slate-200 leading-relaxed", children: [
                                "복잡했던 ", (0, s.jsx)("strong", { children: "'도넛홀(Coverage Gap)'이 완전히 폐지" }), "되어, 연간 본인 부담금이 $2,100에 도달하는 즉시 이후의 처방약은 100% 보험사가 부담($0 코페이)합니다. 고가 항암제/희귀 질환 약 복용 시 수천 달러가 절감됩니다."
                              ] })
                            ]
                          }),
                          (0, s.jsxs)("div", {
                            className: "ira-subcard",
                            children: [
                              (0, s.jsx)("div", { className: "text-2xl mb-2", children: "💳" }),
                              (0, s.jsx)("h4", { className: "font-serif text-lg font-bold text-blue-200 mb-2", children: "2. 처방약 분할 납부 프로그램 (M3P)" }),
                              (0, s.jsxs)("p", { className: "text-xs sm:text-sm text-slate-200 leading-relaxed", children: [
                                (0, s.jsx)("strong", { children: "Medicare Prescription Payment Plan (M3P)" }),
                                "을 통해 연초에 일시적으로 발생하는 큰 약값을 1년(12개월) 동안 무이자로 균등 분할 납부할 수 있습니다."
                              ] })
                            ]
                          }),
                          (0, s.jsxs)("div", {
                            className: "ira-subcard",
                            children: [
                              (0, s.jsx)("div", { className: "text-2xl mb-2", children: "💊" }),
                              (0, s.jsx)("h4", { className: "font-serif text-lg font-bold text-blue-200 mb-2", children: "3. 정부 가격 협상 10대 의약품 가격 인하 전격 시행" }),
                              (0, s.jsx)("p", { className: "text-xs sm:text-sm text-slate-200 leading-relaxed mb-2.5", children: "2026년 1월 1일부터 연방 정부가 직접 제약사와 협상한 다빈도 10대 처방약의 가격이 인하됩니다." }),
                              (0, s.jsxs)("div", { className: "p-2.5 bg-black/40 rounded-xl text-xs text-blue-100 space-y-1", children: [
                                (0, s.jsx)("p", { children: "• Eliquis / Xarelto (혈전/뇌졸중 예방)" }),
                                (0, s.jsx)("p", { children: "• Jardiance / Farxiga / Januvia / Fiasp·NovoLog (당뇨 치료)" }),
                                (0, s.jsx)("p", { children: "• Entresto (심부전) / Imbruvica (항암제) / Stelara·Enbrel (자가면역)" })
                              ] })
                            ]
                          }),
                          (0, s.jsxs)("div", {
                            className: "ira-subcard",
                            children: [
                              (0, s.jsx)("div", { className: "text-2xl mb-2", children: "💉" }),
                              (0, s.jsx)("h4", { className: "font-serif text-lg font-bold text-blue-200 mb-2", children: "4. 인슐린 $35 상한제 & 무료 백신 보장" }),
                              (0, s.jsxs)("ul", { className: "text-xs sm:text-sm text-slate-200 space-y-1.5 leading-relaxed", children: [
                                (0, s.jsxs)("li", { children: ["• ", (0, s.jsx)("strong", { children: "인슐린 $35 상한:" }), " 30일분 공급당 최대 $35 고정."] }),
                                (0, s.jsxs)("li", { children: ["• ", (0, s.jsx)("strong", { children: "권장 백신 $0 무료:" }), " 대상포진(Shingrix), 독감, 코로나19, 폐렴구균 등 예방접종 본인부담금 $0 전액 무료."] })
                              ] })
                            ]
                          })
                        ]
                      })
                    ]
                  })
                }),

                /* Plan Comparison Table */
                (0, s.jsxs)("div", {
                  id: "plan-comparison",
                  className: "mb-12",
                  children: [
                    (0, s.jsxs)("h3", { className: "font-serif text-xl sm:text-2xl text-brand-dark mb-2 flex items-center gap-2", children: [(0, s.jsx)("span", { style: { width: "10px", height: "22px", background: "#2563eb", borderRadius: "99px", display: "inline-block" } }), "(3) 플랜 가입 방식 비교: 오리지널 vs 메디케어 어드밴티지"] }),
                    (0, s.jsx)("p", { className: "text-xs sm:text-sm text-slate-600 mb-5", children: "이용자들이 가장 많이 고민하는 양대 선택지 핵심 비교표입니다." }),
                    (0, s.jsx)("div", {
                      className: "overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-xs",
                      children: (0, s.jsxs)("table", {
                        className: "w-full text-left font-sans text-xs sm:text-sm border-collapse hub-table",
                        children: [
                          (0, s.jsx)("thead", {
                            style: { background: "#0f172a", color: "#ffffff" },
                            children: (0, s.jsxs)("tr", {
                              children: [
                                (0, s.jsx)("th", { className: "font-semibold w-1/5", children: "구분" }),
                                (0, s.jsx)("th", { className: "font-semibold w-2/5 border-l border-slate-700", style: { background: "#1e293b" }, children: "경로 1: 오리지널 + 서플리먼트(Medigap)" }),
                                (0, s.jsx)("th", { className: "font-semibold w-2/5 border-l border-slate-700", style: { background: "#312e81" }, children: "경로 2: 메디케어 어드밴티지 (Part C)" })
                              ]
                            })
                          }),
                          (0, s.jsxs)("tbody", {
                            className: "text-slate-800",
                            children: [
                              (0, s.jsxs)("tr", { className: "hover:bg-slate-50", children: [
                                (0, s.jsx)("td", { className: "font-bold bg-slate-50", children: "구성" }),
                                (0, s.jsx)("td", { className: "border-l border-slate-200", children: "Part A + Part B + Medigap(Plan G 등) + Part D" }),
                                (0, s.jsx)("td", { className: "border-l border-slate-200", children: "Part C 단일 플랜 (HMO 또는 PPO)" })
                              ] }),
                              (0, s.jsxs)("tr", { className: "hover:bg-slate-50", children: [
                                (0, s.jsx)("td", { className: "font-bold bg-slate-50", children: "의사/병원 선택" }),
                                (0, s.jsx)("td", { className: "border-l border-slate-200 text-emerald-800 font-semibold", children: "미국 전역 100% 자유 이용 (네트워크 제한/사전승인 없음)" }),
                                (0, s.jsx)("td", { className: "border-l border-slate-200", children: "보험사 네트워크(HMO/PPO) 내 이용 위주, 사전승인(PA) 가능" })
                              ] }),
                              (0, s.jsxs)("tr", { className: "hover:bg-slate-50", children: [
                                (0, s.jsx)("td", { className: "font-bold bg-slate-50", children: "추가 부가 혜택" }),
                                (0, s.jsx)("td", { className: "border-l border-slate-200 text-slate-500", children: "기본 치과/안과/보청기 미포함" }),
                                (0, s.jsx)("td", { className: "border-l border-slate-200 text-indigo-800 font-semibold", children: "치과, 안과, 보청기, 한방/침술, OTC 카드 등 풍부" })
                              ] }),
                              (0, s.jsxs)("tr", { className: "hover:bg-slate-50", children: [
                                (0, s.jsx)("td", { className: "font-bold bg-slate-50", children: "월 비용 구조" }),
                                (0, s.jsxs)("td", { className: "border-l border-slate-200", children: ["고정비 높음 (Part B + Medigap $150~$250 + Part D), ", (0, s.jsx)("strong", { children: "진료 시 본인부담금 거의 없음" })] }),
                                (0, s.jsxs)("td", { className: "border-l border-slate-200", children: ["고정비 매우 저렴 (Part B + ", (0, s.jsx)("strong", { children: "Part C $0 플랜 다수" }), "), ", (0, s.jsx)("strong", { children: "진료 시마다 코페이 발생" })] })
                              ] }),
                              (0, s.jsxs)("tr", { style: { background: "#eff6ff" }, children: [
                                (0, s.jsx)("td", { className: "font-bold bg-slate-50", children: "추천 대상" }),
                                (0, s.jsx)("td", { className: "border-l border-slate-200 font-bold text-blue-700", children: "만성질환이 있거나 대형병원/전문의 진료가 잦은 분" }),
                                (0, s.jsx)("td", { className: "border-l border-slate-200 font-bold text-indigo-800", children: "평소 건강하며 월 고정 지출을 아끼고 생활 혜택을 원하는 분" })
                              ] })
                            ]
                          })
                        ]
                      })
                    })
                  ]
                }),

                /* Enrollment & Senior Support */
                (0, s.jsxs)("div", {
                  id: "medicare-penalty",
                  className: "grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10",
                  children: [
                    (0, s.jsxs)("div", {
                      className: "hub-card p-6 sm:p-7",
                      children: [
                        (0, s.jsxs)("h3", { className: "font-serif text-xl text-brand-dark mb-3 flex items-center gap-2", children: [(0, s.jsx)("span", { children: "⏰" }), "(4) 메디케어 가입 시기 & 지연 벌금"] }),
                        (0, s.jsxs)("div", {
                          className: "space-y-3 text-xs sm:text-sm text-slate-700",
                          children: [
                            (0, s.jsxs)("div", { className: "p-3.5 bg-slate-50 rounded-xl border border-slate-200", children: [
                              (0, s.jsx)("p", { className: "font-bold text-blue-700 mb-1", children: "• 최초 등록 기간 (IEP): 65세 생일 전후 7개월" }),
                              (0, s.jsx)("p", { className: "text-xs text-slate-600", children: "생일 속한 달 기준 [전 3개월 + 생일 당월 + 후 3개월]." })
                            ] }),
                            (0, s.jsxs)("div", { className: "p-3.5 bg-slate-50 rounded-xl border border-slate-200", children: [
                              (0, s.jsx)("p", { className: "font-bold text-slate-900 mb-1", children: "• 연례 오픈 등록 기간 (AEP): 매년 10/15 ~ 12/7" }),
                              (0, s.jsx)("p", { className: "text-xs text-slate-600", children: "어드밴티지 및 Part D 처방약 플랜 변경/교체 기간." })
                            ] }),
                            (0, s.jsxs)("details", {
                              className: "hub-details",
                              children: [
                                (0, s.jsx)("summary", { className: "hub-summary", style: { color: "#b91c1c" }, children: "평생 지연 가입 벌금 규정 확인" }),
                                (0, s.jsxs)("div", { className: "hub-details-content text-xs space-y-2 p-3 bg-red-50 rounded-xl border border-red-200 text-red-950", children: [
                                  (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "• Part B 평생 벌금:" }), " 유자격 직장보험 없이 미가입한 12개월당 ", (0, s.jsx)("strong", { children: "Part B 기본료의 10%씩 평생 추가 할증" }), "."] }),
                                  (0, s.jsxs)("p", { children: [(0, s.jsx)("strong", { children: "• Part D 평생 벌금:" }), " 처방약 보험 없이 지낸 1개월당 ", (0, s.jsx)("strong", { children: "전국 기준료의 1%씩 평생 누적 가산" }), "."] }),
                                  (0, s.jsx)("p", { className: "text-slate-700", children: "※ 65세 이후에도 20인 이상 직장 건강보험 유지 시 벌금 면제(유예)됩니다." })
                                ] })
                              ]
                            })
                          ]
                        })
                      ]
                    }),

                    (0, s.jsxs)("div", {
                      id: "nj-senior-support",
                      className: "hub-card p-6 sm:p-7",
                      children: [
                        (0, s.jsxs)("h3", { className: "font-serif text-xl text-brand-dark mb-3 flex items-center gap-2", children: [(0, s.jsx)("span", { children: "💡" }), "(5) NJ주 저소득 시니어 지원 (MSP & PAAD)"] }),
                        (0, s.jsx)("p", { className: "text-xs text-slate-600 mb-3", children: "메디케이드 소득 기준을 살짝 초과하는 한인 어르신을 위한 뉴저지 3대 지원책:" }),
                        (0, s.jsxs)("div", {
                          className: "space-y-3 text-xs sm:text-sm",
                          children: [
                            (0, s.jsxs)("div", { className: "p-3.5 bg-blue-50/60 rounded-xl border border-blue-100", children: [
                              (0, s.jsx)("p", { className: "font-bold text-blue-900", children: "1. MSP 프로그램 (QMB / SLMB / QI)" }),
                              (0, s.jsx)("p", { className: "text-xs text-slate-700", children: "Part B 월 보험료(약 $185)를 주정부에서 전액 대납." })
                            ] }),
                            (0, s.jsxs)("div", { className: "p-3.5 bg-purple-50/60 rounded-xl border border-purple-100", children: [
                              (0, s.jsx)("p", { className: "font-bold text-purple-900", children: "2. PAAD 처방약 지원 프로그램" }),
                              (0, s.jsx)("p", { className: "text-xs text-slate-700", children: "1인 연소득 약 $52,000대 이하 시 제네릭 $5, 브랜드 약 $7 고정 코페이." })
                            ] }),
                            (0, s.jsxs)("details", {
                              className: "hub-details",
                              children: [
                                (0, s.jsx)("summary", { className: "hub-summary", style: { color: "#b45309" }, children: "Senior Gold 프로그램 보기" }),
                                (0, s.jsx)("div", { className: "hub-details-content text-xs p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-950", children: (0, s.jsx)("p", { children: [(0, s.jsx)("strong", { children: "3. Senior Gold Discount Plan:" }), " PAAD 소득 기준을 약간 초과하는 시니어를 위한 약값 할인 제도 (기본 코페이 $15 + 잔여 약값 50% 주정부 지원)."] }) })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          }),

          /* Interactive Finder */
          (0, s.jsx)("section", {
            className: "py-14 sm:py-18 bg-brand-light border-b border-brand-border",
            id: "finder",
            children: (0, s.jsxs)("div", {
              className: "max-w-3xl mx-auto px-4 sm:px-6 lg:px-8",
              children: [
                (0, s.jsxs)("div", {
                  className: "text-center mb-8",
                  children: [
                    (0, s.jsx)("span", { className: "text-xs font-sans font-semibold uppercase tracking-widest text-brand-blue mb-1.5 block", children: "맞춤 진단기" }),
                    (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-dark mb-2", children: "나에게 맞는 건강보험 찾기" }),
                    (0, s.jsx)("p", { className: "text-brand-muted font-sans text-xs sm:text-sm", children: "몇 가지 질문에 답하시면 가장 유리한 보험 옵션 및 주정부 지원 혜택을 안내해 드립니다." })
                  ]
                }),
                (0, s.jsx)("div", {
                  className: "hub-card p-6 sm:p-9",
                  children: result ? (
                    (0, s.jsxs)("div", {
                      className: "text-center py-4",
                      children: [
                        (0, s.jsx)("div", { className: "w-14 h-14 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center text-2xl mx-auto mb-3 border border-blue-100", children: "💡" }),
                        (0, s.jsx)("h3", { className: "font-serif text-2xl text-brand-dark mb-3", children: "맞춤 추천 결과" }),
                        (0, s.jsx)("div", { className: "p-5 bg-slate-50 rounded-2xl border border-slate-200 text-left mb-6 text-brand-dark font-sans leading-relaxed text-sm sm:text-base", children: result }),
                        (0, s.jsxs)("div", {
                          className: "flex flex-col sm:flex-row gap-3 justify-center",
                          children: [
                            (0, s.jsx)("button", { onClick: function() { setResult(null); setStep(1); }, className: "btn-outline text-sm py-3 px-6", children: "다시 진단하기" }),
                            (0, s.jsx)("a", { href: "https://kor2.njaccessportal.com/tool", className: "btn-primary text-sm py-3 px-6 inline-flex items-center justify-center gap-2", children: "🤖 AI 도우미 연결 (맞춤 무료 상담) →" })
                          ]
                        })
                      ]
                    })
                  ) : (
                    (0, s.jsxs)("div", {
                      children: [
                        (0, s.jsxs)("div", {
                          className: "flex items-center justify-between mb-6 text-xs font-sans font-medium text-slate-500",
                          children: [
                            (0, s.jsxs)("span", { children: ["단계 ", step, " / 3"] }),
                            (0, s.jsx)("div", {
                              className: "w-32 bg-slate-200 h-2 rounded-full overflow-hidden",
                              children: (0, s.jsx)("div", { className: "bg-brand-blue h-full transition-all duration-300", style: { width: ((step / 3) * 100) + "%" } })
                            })
                          ]
                        }),

                        step === 1 && (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("label", { className: "block text-sm font-sans font-semibold text-brand-dark mb-3", children: "만 나이를 입력해주세요:" }),
                            (0, s.jsx)("input", {
                              type: "number",
                              value: age,
                              onChange: function(e) { setAge(e.target.value); },
                              placeholder: "예: 65",
                              className: "w-full text-base font-sans p-3.5 rounded-xl border border-slate-300 mb-5 bg-white outline-none focus:border-brand-blue"
                            }),
                            (0, s.jsx)("button", {
                              disabled: !age,
                              onClick: function() { setStep(2); },
                              className: "btn-primary w-full justify-center py-3.5 text-sm disabled:opacity-50",
                              children: "다음 단계 →"
                            }),
                            (0, s.jsx)("a", {
                              href: "https://kor2.njaccessportal.com/tool",
                              className: "ai-single-btn",
                              children: "🤖 AI 도우미 연결 (맞춤 무료 상담) →"
                            })
                          ]
                        }),

                        step === 2 && (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("label", { className: "block text-sm font-sans font-semibold text-brand-dark mb-3", children: "미국 체류 신분을 선택해주세요:" }),
                            (0, s.jsx)("div", {
                              className: "space-y-2.5 mb-5",
                              children: ["시민권자", "영주권자 (5년 이상)", "합법 비자 (H-1B, E-2, L-1, F-1 OPT 등)", "서류미비 / 기타"].map(function(item) {
                                return (0, s.jsx)("button", {
                                  key: item,
                                  onClick: function() { setStatus(item); },
                                  className: "w-full text-left p-3.5 rounded-xl border text-sm font-sans transition-all " + (status === item ? "border-brand-blue bg-blue-50 text-brand-blue font-semibold" : "border-slate-200 bg-white text-brand-dark hover:bg-slate-50")
                                }, item);
                              })
                            }),
                            (0, s.jsxs)("div", {
                              className: "flex gap-3",
                              children: [
                                (0, s.jsx)("button", { onClick: function() { setStep(1); }, className: "btn-outline text-sm py-3 px-6", children: "이전" }),
                                (0, s.jsx)("button", { disabled: !status, onClick: function() { setStep(3); }, className: "btn-primary flex-1 justify-center py-3 text-sm disabled:opacity-50", children: "다음 단계 →" })
                              ]
                            })
                          ]
                        }),

                        step === 3 && (0, s.jsxs)("div", {
                          children: [
                            (0, s.jsx)("label", { className: "block text-sm font-sans font-semibold text-brand-dark mb-3", children: "가구 총 연간 소득 수준을 선택해주세요:" }),
                            (0, s.jsx)("div", {
                              className: "space-y-2.5 mb-5",
                              children: [
                                { id: "very_low", label: "저소득층 (1인 연 $21,597 이하 / FPL 138% 이하)" },
                                { id: "low", label: "중저소득층 (1인 연 $21,597 ~ $39,125 / FPL 250% 이하 - 실버 CSR)" },
                                { id: "medium", label: "중간소득층 (1인 연 $39,125 ~ $70,000 / APTC 보조금)" },
                                { id: "high", label: "고소득층 (1인 연 $70,000 이상)" }
                              ].map(function(item) {
                                return (0, s.jsx)("button", {
                                  key: item.id,
                                  onClick: function() { setIncome(item.id); },
                                  className: "w-full text-left p-3.5 rounded-xl border text-sm font-sans transition-all " + (income === item.id ? "border-brand-blue bg-blue-50 text-brand-blue font-semibold" : "border-slate-200 bg-white text-brand-dark hover:bg-slate-50")
                                }, item.id);
                              })
                            }),
                            (0, s.jsxs)("div", {
                              className: "flex gap-3",
                              children: [
                                (0, s.jsx)("button", { onClick: function() { setStep(2); }, className: "btn-outline text-sm py-3 px-6", children: "이전" }),
                                (0, s.jsx)("button", { disabled: !income, onClick: calculateResult, className: "btn-primary flex-1 justify-center py-3 text-sm disabled:opacity-50", children: "진단 결과 확인하기 ✨" })
                              ]
                            })
                          ]
                        })
                      ]
                    })
                  )
                })
              ]
            })
          }),

          /* FAQ Section */
          (0, s.jsx)("section", {
            className: "py-14 sm:py-18 bg-white",
            id: "faq",
            children: (0, s.jsxs)("div", {
              className: "max-w-4xl mx-auto px-4 sm:px-6 lg:px-8",
              children: [
                (0, s.jsxs)("div", {
                  className: "text-center mb-10",
                  children: [
                    (0, s.jsx)("span", { className: "text-xs font-sans font-semibold uppercase tracking-widest text-brand-blue mb-1.5 block", children: "FAQ & 혼선 정리" }),
                    (0, s.jsx)("h2", { className: "font-serif text-2xl sm:text-3xl lg:text-4xl text-brand-dark mb-2", children: "자주 묻는 질문 (FAQ)" }),
                    (0, s.jsx)("p", { className: "text-brand-muted font-sans text-xs sm:text-sm", children: "뉴저지 한인 동포분들이 가장 자주 겪는 핵심 질문과 주의사항입니다." })
                  ]
                }),
                (0, s.jsxs)("div", {
                  className: "space-y-3.5",
                  children: [
                    (0, s.jsxs)("details", {
                      className: "hub-card p-5",
                      open: true,
                      children: [
                        (0, s.jsxs)("summary", {
                          className: "font-serif text-base sm:text-lg text-brand-dark font-bold cursor-pointer flex items-center justify-between outline-none",
                          children: [
                            (0, s.jsxs)("span", { children: [(0, s.jsx)("span", { className: "text-brand-blue font-sans mr-2", children: "Q." }), "메디케어 신청 자격 조건은 어떻게 되나요?"] }),
                            (0, s.jsx)("span", { className: "text-xs font-sans text-slate-400", children: "▼" })
                          ]
                        }),
                        (0, s.jsx)("div", {
                          className: "pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-3",
                          children: "만 65세 이상의 미국 시민권자 또는 합법적으로 5년 이상 연속 거주한 영주권자가 기본 대상입니다. 65세 미만이라도 24개월 이상 SSDI(사회보장 장애 연금)를 수령했거나 말기 신부전증(ESRD) 또는 루게릭병(ALS) 진단을 받은 경우 신청할 수 있습니다."
                        })
                      ]
                    }),

                    (0, s.jsxs)("details", {
                      className: "hub-card p-5",
                      children: [
                        (0, s.jsxs)("summary", {
                          className: "font-serif text-base sm:text-lg text-brand-dark font-bold cursor-pointer flex items-center justify-between outline-none",
                          children: [
                            (0, s.jsxs)("span", { children: [(0, s.jsx)("span", { className: "text-brand-blue font-sans mr-2", children: "Q." }), "2026년 메디케어 처방약 도넛홀(Coverage Gap)이 사라졌나요?"] }),
                            (0, s.jsx)("span", { className: "text-xs font-sans text-slate-400", children: "▼" })
                          ]
                        }),
                        (0, s.jsx)("div", {
                          className: "pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-3",
                          children: "네, 맞습니다! 2026년 인플레이션 감축법(IRA)에 따라 기존의 도넛홀 구간이 완전히 폐지되었습니다. Part D 처방약 본인 부담금이 연간 $2,100에 도달하면 이후의 약값은 100% 보험사가 부담($0 코페이)합니다."
                        })
                      ]
                    }),

                    (0, s.jsxs)("details", {
                      className: "hub-card p-5",
                      children: [
                        (0, s.jsxs)("summary", {
                          className: "font-serif text-base sm:text-lg text-brand-dark font-bold cursor-pointer flex items-center justify-between outline-none",
                          children: [
                            (0, s.jsxs)("span", { children: [(0, s.jsx)("span", { className: "text-brand-blue font-sans mr-2", children: "Q." }), "오리지널 메디케어와 메디케어 어드밴티지(Part C) 중 어느 쪽이 유리한가요?"] }),
                            (0, s.jsx)("span", { className: "text-xs font-sans text-slate-400", children: "▼" })
                          ]
                        }),
                        (0, s.jsx)("div", {
                          className: "pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-3",
                          children: "개인의 건강 상태와 병원 이용 빈도에 따라 다릅니다. 만성질환이 있어 특정 대형 병원이나 전문의 진료가 잦으신 분은 미국 전역 네트워크 제한이 없는 오리지널 메디케어 + Medigap 조합이 유리하며, 평소 건강하고 월 지출을 절약하며 치과/안과/OTC 카드 등 생활 혜택을 원하시면 월 $0 플랜이 많은 어드밴티지가 유리합니다."
                        })
                      ]
                    }),

                    (0, s.jsxs)("details", {
                      className: "hub-card p-5",
                      children: [
                        (0, s.jsxs)("summary", {
                          className: "font-serif text-base sm:text-lg text-brand-dark font-bold cursor-pointer flex items-center justify-between outline-none",
                          children: [
                            (0, s.jsxs)("span", { children: [(0, s.jsx)("span", { className: "text-brand-blue font-sans mr-2", children: "Q." }), "뉴저지에서 건강보험이 없으면 주 세금 보고 시 벌금이 나오나요?"] }),
                            (0, s.jsx)("span", { className: "text-xs font-sans text-slate-400", children: "▼" })
                          ]
                        }),
                        (0, s.jsx)("div", {
                          className: "pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-3",
                          children: "네. 뉴저지는 주법으로 의무 가입(Individual Mandate)을 시행하고 있어, 1년에 3개월 이상 무보험 상태일 경우 NJ-1040 세금 보고 시 벌금이 부과됩니다. GetCoveredNJ 주정부 보조금이나 NJ FamilyCare 무료 혜택을 확인하시어 반드시 가입하시기 바랍니다."
                        })
                      ]
                    }),

                    (0, s.jsxs)("details", {
                      className: "hub-card p-5",
                      children: [
                        (0, s.jsxs)("summary", {
                          className: "font-serif text-base sm:text-lg text-brand-dark font-bold cursor-pointer flex items-center justify-between outline-none",
                          children: [
                            (0, s.jsxs)("span", { children: [(0, s.jsx)("span", { className: "text-brand-blue font-sans mr-2", children: "Q." }), "메디케이드 소득을 살짝 초과하는 시니어도 지원받을 수 있는 프로그램이 있나요?"] }),
                            (0, s.jsx)("span", { className: "text-xs font-sans text-slate-400", children: "▼" })
                          ]
                        }),
                        (0, s.jsx)("div", {
                          className: "pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-3",
                          children: "네! 뉴저지주는 저소득 시니어를 위해 Part B 월 보험료(약 $185)를 전액 대납해 주는 MSP 프로그램과, 처방약을 $5~$7에 구매할 수 있는 PAAD 및 Senior Gold 프로그램을 독자 운영하고 있습니다."
                        })
                      ]
                    }),

                    (0, s.jsxs)("details", {
                      className: "hub-card p-5",
                      children: [
                        (0, s.jsxs)("summary", {
                          className: "font-serif text-base sm:text-lg text-brand-dark font-bold cursor-pointer flex items-center justify-between outline-none",
                          children: [
                            (0, s.jsxs)("span", { children: [(0, s.jsx)("span", { className: "text-brand-blue font-sans mr-2", children: "Q." }), "뉴저지 병원비 감면(Charity Care)은 서류미비자(미등록 체류자)도 신청할 수 있나요?"] }),
                            (0, s.jsx)("span", { className: "text-xs font-sans text-slate-400", children: "▼" })
                          ]
                        }),
                        (0, s.jsx)("div", {
                          className: "pt-3 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-3",
                          children: "네, 가능합니다. Charity Care는 체류 신분과 관계없이 뉴저지 거주 저소득층이 급성기 병원 응급실이나 입원 치료를 받을 때 소득에 따라 병원비를 50%~100% 감면해 주는 주정부 제도입니다."
                        })
                      ]
                    })
                  ]
                })
              ]
            })
          })
        ]
      });
    }

    e.s(["default", 0, MedicarePage]);
  }
]);
`;

fs.writeFileSync(path.join(__dirname, '../_next/static/chunks/00_c_064yjnfa.js'), componentBody, 'utf8');
console.log('Successfully generated clean 00_c_064yjnfa.js');

/**
 * NJ Access Portal - 2026/2027 New Jersey Healthcare & Benefits Screener
 * Evaluates real-time eligibility for NJ FamilyCare, Medicare MSP/PAAD, SNAP, LIHEAP, Housing, and Senior Tax Relief.
 * Fully aligned with 2026 Federal Poverty Guidelines & NJ Division of Aging Services thresholds.
 */

window.NJAPCalculator = (function() {
  'use strict';

  // 2026 Federal Poverty Guidelines (Annual)
  const FPL_BASE = 15960;
  const FPL_ADD = 5680;

  function getFPL(householdSize) {
    const size = Math.max(1, parseInt(householdSize) || 1);
    return FPL_BASE + (size - 1) * FPL_ADD;
  }

  // Bergen / Northern NJ 50% Area Median Income (AMI)
  function get50AMI(householdSize) {
    const size = Math.max(1, parseInt(householdSize) || 1);
    const base = 48500;
    return base + (size - 1) * 6900;
  }

  // 2025-2026 NJ LIHEAP 60% State Median Income (Monthly)
  function getLIHEAPLimit(householdSize) {
    const size = Math.max(1, parseInt(householdSize) || 1);
    const table = { 1: 4273, 2: 5587, 3: 6902, 4: 8217, 5: 9532, 6: 10846, 7: 11093, 8: 11339 };
    return table[size] || (11339 + (size - 8) * 246);
  }

  function evaluate(inputs) {
    const size = Math.max(1, parseInt(inputs.householdSize) || 1);
    const monthlyIncome = Math.max(0, parseFloat(inputs.monthlyIncome) || 0);
    const annualIncome = monthlyIncome * 12;
    const age = inputs.age || '19-64'; // 'under-19', '19-64', '65+'
    const isDisabled = !!inputs.isDisabled;
    const isPregnant = !!inputs.isPregnant;
    const hasMedicare = !!inputs.hasMedicare || age === '65+';
    const isHomeowner = !!inputs.isHomeowner;
    const needsCare = !!inputs.needsCare;
    const lowAssets = !!inputs.lowAssets; // Under $4,000 single / $6,000 couple

    const fplAnnual = getFPL(size);
    const fplMonthly = fplAnnual / 12;
    const fplRatio = Math.round((annualIncome / fplAnnual) * 100);

    const results = [];

    // -------------------------------------------------------------
    // 1. NJ FamilyCare / Medicaid
    // -------------------------------------------------------------
    if (age === '65+' || isDisabled) {
      // ABD Medicaid (Aged, Blind, Disabled)
      const abdLimit = (size === 1 ? 1255 : 1704);
      if (monthlyIncome <= abdLimit && lowAssets) {
        results.push({
          id: 'medicaid-abd',
          title_ko: '뉴저지 패밀리케어 / 메디케이드 (ABD 고령·장애인)',
          title_en: 'NJ FamilyCare / Medicaid (ABD Aged & Disabled)',
          status: 'eligible',
          status_ko: '적격 예상',
          benefit_ko: '의사 진료, 종합병원 입원, 처방약, 치과, 안과를 포함한 100% 전액 의료비 무료 ($0 코페이).',
          criteria_ko: `월 소득 $${monthlyIncome.toLocaleString()}이 ABD 기준(월 $${abdLimit.toLocaleString()}) 이하이며 자산 요건($4,000/$6,000 이하)을 충족합니다.`,
          action_link: '/resources/medicaid-regular-medicaid-abd-ko',
          badge: '100% 전액 무료'
        });
      } else if (monthlyIncome <= abdLimit) {
        results.push({
          id: 'medicaid-abd',
          title_ko: '뉴저지 패밀리케어 / 메디케이드 (ABD 소득 적격)',
          title_en: 'NJ FamilyCare / Medicaid (ABD)',
          status: 'conditional',
          status_ko: '소득 적격 (자산 심사 필요)',
          benefit_ko: '전액 의료비 보장. 유동 자산이 $4,000(단독) 또는 $6,000(부부) 이하이어야 합니다. (거주 주택 1채와 차량 1대는 자산 산정 제외)',
          criteria_ko: `소득 기준은 충족합니다. 합법적 자산 지출(Spend-down) 및 자산 보호 설계를 통해 신청 가능합니다.`,
          action_link: '/resources/medicaid-regular-medicaid-abd-ko',
          badge: '자산 심사'
        });
      }

      // MLTSS (Long-Term Care)
      if (needsCare && monthlyIncome <= 2982) {
        results.push({
          id: 'medicaid-mltss',
          title_ko: '메디케이드 장기 요양 (MLTSS)',
          title_en: 'Medicaid MLTSS (Managed Long-Term Care)',
          status: 'eligible',
          status_ko: '장기 요양 적격 예상',
          benefit_ko: '재택 방문 간병인 시간 지원, 성인 주간 데이케어, 널싱홈 요양원 입원비 전액 지원.',
          criteria_ko: `소득이 2026년 기관 한도인 월 $2,982(SSI 300%) 이하이며 일상 돌봄이 필요합니다.`,
          action_link: '/resources/medicaid-ltc-medicaid-mltss-ko',
          badge: '가족 간병·데이케어'
        });
      }
    } else {
      // Adult 19-64 (ACA Medicaid Expansion 138% FPL)
      const magiLimit = Math.round(fplMonthly * 1.38);
      if (monthlyIncome <= magiLimit) {
        results.push({
          id: 'medicaid-magi',
          title_ko: '뉴저지 패밀리케어 / 메디케이드 (오바마케어 확장)',
          title_en: 'NJ FamilyCare / Medicaid (ACA Expansion)',
          status: 'eligible',
          status_ko: '적격 예상',
          benefit_ko: '월 보험료 $0, 디덕터블 $0, 자산 심사 없이 100% 무료 종합 건강보험 혜택.',
          criteria_ko: `월 소득 $${monthlyIncome.toLocaleString()}이 138% FPL 한도(가구원 ${size}인 기준 월 $${magiLimit.toLocaleString()}) 이하입니다.`,
          action_link: '/resources/medicaid-aca-medicaid-ko',
          badge: '무료 건강보험'
        });
      }
    }

    // -------------------------------------------------------------
    // 2. Medicare & State Prescription Assistance
    // -------------------------------------------------------------
    if (age === '65+' || isDisabled || hasMedicare) {
      // MSP (QMB, SLMB, QI)
      const qmbLimit = Math.round(fplMonthly * 1.00);
      const qiLimit = Math.round(fplMonthly * 1.35);

      if (monthlyIncome <= qmbLimit) {
        results.push({
          id: 'msp-qmb',
          title_ko: '메디케어 저축 프로그램 (QMB)',
          title_en: 'Medicare Savings Program (QMB)',
          status: 'eligible',
          status_ko: '최고 혜택: 보험료 및 본인부담금 면제',
          benefit_ko: '주정부가 매월 Part B 보험료($202.90/월)를 전액 대납하고, 연간 Part A·B 디덕터블($283)과 코페이를 면제합니다.',
          criteria_ko: `소득이 2026년 연방 빈곤선 100%(월 $${qmbLimit.toLocaleString()}) 이하입니다.`,
          action_link: '/resources/medicare-savings-programs-msp-ko',
          badge: 'Part B $202.90 대납'
        });
      } else if (monthlyIncome <= qiLimit) {
        results.push({
          id: 'msp-slmb-qi',
          title_ko: '메디케어 저축 프로그램 (SLMB / QI)',
          title_en: 'Medicare Savings Program (SLMB / QI)',
          status: 'eligible',
          status_ko: 'Part B 보험료 전액 지원',
          benefit_ko: '주정부가 메디케어 Part B 보험료(월 $202.90, 연간 $2,434+)를 매월 소셜시큐리티 연금에 환급 대납합니다.',
          criteria_ko: `소득이 2026년 연방 빈곤선 100%~135%(월 $${qiLimit.toLocaleString()}) 구간입니다.`,
          action_link: '/resources/medicare-savings-programs-msp-ko',
          badge: '연간 $2,434 절감'
        });
      }

      // NJ PAAD & Senior Gold
      const paadLimitAnnual = (size === 1 ? 54943 : 62390);
      const seniorGoldMax = (size === 1 ? 64943 : 72390);

      if (annualIncome <= paadLimitAnnual) {
        results.push({
          id: 'nj-paad',
          title_ko: '뉴저지 PAAD (처방약 보조 프로그램)',
          title_en: 'NJ PAAD Prescription Drug Assistance',
          status: 'eligible',
          status_ko: '높은 적격률 (자산 심사 없음)',
          benefit_ko: '처방약 코페이를 제네릭 $5, 브랜드 $7로 고정하고, 메디케어 Part D 표준 월 보험료를 주정부가 전액 대납합니다.',
          criteria_ko: `연 소득 $${annualIncome.toLocaleString()}이 2026년 뉴저지 PAAD 한도($${paadLimitAnnual.toLocaleString()}) 이하입니다. (자산 제한 없음)`,
          action_link: '/resources/medicare-nj-paad-and-senior-gold-ko',
          badge: '약값 $5/$7 고정'
        });
      } else if (annualIncome <= seniorGoldMax) {
        results.push({
          id: 'nj-senior-gold',
          title_ko: '뉴저지 시니어 골드 (Senior Gold)',
          title_en: 'NJ Senior Gold Prescription Discount',
          status: 'eligible',
          status_ko: '처방약 할인 적격',
          benefit_ko: 'PAAD 기준을 살짝 넘는 시니어를 위한 프로그램으로, $15 코페이 + 50% 할인 혜택을 제공합니다.',
          criteria_ko: `연 소득이 $${paadLimitAnnual.toLocaleString()} ~ $${seniorGoldMax.toLocaleString()} 구간입니다. (자산 제한 없음)`,
          action_link: '/resources/medicare-nj-paad-and-senior-gold-ko',
          badge: '처방약 할인'
        });
      }
    }

    // -------------------------------------------------------------
    // 3. NJ SNAP (Food Stamps)
    // -------------------------------------------------------------
    const snapLimit = Math.round(fplMonthly * 1.85);
    if (monthlyIncome <= snapLimit) {
      const maxSnap = { 1: 298, 2: 546, 3: 785, 4: 994, 5: 1158, 6: 1390 };
      const estSnap = maxSnap[size] || (994 + (size - 4) * 218);
      results.push({
        id: 'snap',
        title_ko: '뉴저지 SNAP (푸드스탬프 식비 지원)',
        title_en: 'NJ SNAP (Supplemental Nutrition Assistance)',
        status: 'eligible',
        status_ko: '적격 예상',
        benefit_ko: `식료품 구매를 위한 Families First EBT 카드 지급 (가구당 최대 월 $${estSnap}, 뉴저지 최소 보장액 월 $95).`,
        criteria_ko: `월 소득 $${monthlyIncome.toLocaleString()}이 뉴저지 확대 기준인 185% FPL(월 $${snapLimit.toLocaleString()}) 이하입니다.`,
        action_link: '/resources/financial-assistance-snap-ko',
        badge: `최대 월 $${estSnap}`
      });
    }

    // -------------------------------------------------------------
    // 4. Affordable Senior Housing (HUD Section 202 & LIHTC)
    // -------------------------------------------------------------
    const ami50 = get50AMI(size);
    if (annualIncome <= ami50) {
      results.push({
        id: 'housing-senior',
        title_ko: '시니어 아파트 & 서민 주택 (HUD Section 202 / LIHTC)',
        title_en: 'Affordable Senior Housing & Apartments',
        status: 'eligible',
        status_ko: '소득 기준 충족',
        benefit_ko: '월 임대료가 수입의 30% 수준으로 제한되며 유틸리티가 포함됩니다. (포트리, 팰팍, 잉글우드, 해켄색 등 타운별 웨이팅리스트 접수 가능)',
        criteria_ko: `연 소득 $${annualIncome.toLocaleString()}이 지역 중위소득 50%(한도 $${ami50.toLocaleString()}) 이하입니다.`,
        action_link: '#section-housing-directory',
        badge: '수입의 30% 렌트비'
      });
    }

    // -------------------------------------------------------------
    // 5. NJ Energy & Utility Relief (LIHEAP)
    // -------------------------------------------------------------
    const liheapLimit = getLIHEAPLimit(size);
    if (monthlyIncome <= liheapLimit) {
      results.push({
        id: 'liheap',
        title_ko: 'LIHEAP 난방·냉방비 지원 & USF',
        title_en: 'LIHEAP Energy Assistance & Universal Service Fund',
        status: 'eligible',
        status_ko: '적격 예상',
        benefit_ko: 'PSE&G, 가스, 전기, 난방유 요금에 대한 직접 보조금 지급 및 무료 주택 단열·에너지 개선(Comfort Partners).',
        criteria_ko: `월 소득 $${monthlyIncome.toLocaleString()}이 뉴저지 60% SMI(월 $${liheapLimit.toLocaleString()}) 이하입니다.`,
        action_link: '/resources/financial-assistance-liheap-ko',
        badge: '공과금 직접 지원'
      });
    }

    // -------------------------------------------------------------
    // 6. NJ Property Tax Relief (Senior Freeze & Stay NJ)
    // -------------------------------------------------------------
    if (isHomeowner && (age === '65+' || isDisabled)) {
      const freezeLimit = 172475;
      if (annualIncome <= freezeLimit) {
        results.push({
          id: 'senior-freeze',
          title_ko: '뉴저지 시니어 프리즈 (재산세 환급) & Stay NJ',
          title_en: 'NJ Senior Freeze (Property Tax Reimbursement) & Stay NJ',
          status: 'eligible',
          status_ko: '재산세 감면·환급 대상',
          benefit_ko: '기준 연도의 재산세액을 고정하고 매년 인상분을 주정부에서 전액 환급. Stay NJ를 통해 최대 $6,500 추가 재산세 감면 혜택.',
          criteria_ko: `연 소득이 $${freezeLimit.toLocaleString()} 이하이며 뉴저지 자택 소유 요건을 충족합니다. (단일 신청서 PAS-1 제출)`,
          action_link: '/resources/housing-property-tax-reimbursement-senior-freeze-ko',
          badge: '최대 $6,500+ 환급'
        });
      }
    }

    // -------------------------------------------------------------
    // 7. In-Home Caregiving (PPP & JACC)
    // -------------------------------------------------------------
    if (needsCare) {
      results.push({
        id: 'in-home-care',
        title_ko: '가족 간병 지원 프로그램 (PPP / JACC)',
        title_en: 'In-Home Caregiver Support (Personal Preference Program / JACC)',
        status: 'eligible',
        status_ko: '가족 유급 간병 적격',
        benefit_ko: '성인 자녀, 친척 또는 이웃을 유급 간병인으로 공식 채용하여 정부 예산으로 시급 또는 월 급여를 지급받는 제도.',
        criteria_ko: '일상생활(ADL: 식사, 목욕, 옷 입기, 이동) 보조 필요 판정 시 승인됩니다.',
        action_link: '/resources/in-home-care-ppp-ko',
        badge: '가족 간병 유급 지원'
      });
    }

    return {
      fplRatio: fplRatio,
      annualIncome: annualIncome,
      monthlyIncome: monthlyIncome,
      fplAnnual: fplAnnual,
      householdSize: size,
      eligibleCount: results.length,
      results: results
    };
  }

  return { evaluate: evaluate };
})();

/**
 * AWCA Benefits Screener & Qualification Calculator
 * Evaluates eligibility across 8+ New Jersey & Federal assistance programs
 * based on the official guidelines documented in the AWCA Resource Center.
 */

window.AWCACalculator = (function() {
  // 2026/2026 Federal Poverty Guidelines (Annual)
  const FPL_BASE = 15060;
  const FPL_ADD = 5380;

  function getFPL(householdSize) {
    const size = Math.max(1, parseInt(householdSize) || 1);
    return FPL_BASE + (size - 1) * FPL_ADD;
  }

  // Bergen County / NJ Area Median Income (50% AMI approx)
  function get50AMI(householdSize) {
    const size = Math.max(1, parseInt(householdSize) || 1);
    const base = 45000;
    return base + (size - 1) * 6400;
  }

  // NJ LIHEAP 60% SMI (Monthly)
  function getLIHEAPLimit(householdSize) {
    const size = Math.max(1, parseInt(householdSize) || 1);
    const table = { 1: 3660, 2: 4786, 3: 5913, 4: 7039, 5: 8165, 6: 9291 };
    return table[size] || (9291 + (size - 6) * 1126);
  }

  function evaluate(inputs) {
    const size = Math.max(1, parseInt(inputs.householdSize) || 1);
    const monthlyIncome = Math.max(0, parseFloat(inputs.monthlyIncome) || 0);
    const annualIncome = monthlyIncome * 12;
    const age = inputs.age || "19-64"; // "under-19", "19-64", "65+"
    const isDisabled = !!inputs.isDisabled;
    const isPregnant = !!inputs.isPregnant;
    const hasMedicare = !!inputs.hasMedicare || age === "65+";
    const isHomeowner = !!inputs.isHomeowner;
    const needsCare = !!inputs.needsCare;
    const lowAssets = !!inputs.lowAssets; // Under $4,000 single / $6,000 couple

    const fplAnnual = getFPL(size);
    const fplMonthly = fplAnnual / 12;
    const fplRatio = Math.round((annualIncome / fplAnnual) * 100);

    const results = [];

    // -------------------------------------------------------------
    // 1. NJ FamilyCare / Medicaid (ACA Expansion vs ABD)
    // -------------------------------------------------------------
    if (age === "65+" || isDisabled) {
      // ABD Medicaid (Aged, Blind, Disabled)
      const abdLimit = (size === 1 ? 1255 : 1704);
      if (monthlyIncome <= abdLimit && lowAssets) {
        results.push({
          id: "medicaid-abd",
          title_en: "NJ FamilyCare / Medicaid (ABD Aged & Disabled)",
          title_ko: "뉴저지 패밀리케어 / 메디케이드 (ABD 고령·장애인)",
          status: "eligible",
          status_en: "Likely Eligible",
          status_ko: "적격 예상",
          benefit_en: "100% comprehensive medical coverage (doctor visits, hospital, medications, vision, dental) with $0 copays.",
          benefit_ko: "의사 진료, 입원, 처방약, 치과, 안과를 포함한 100% 전액 의료비 무료 보장.",
          criteria_en: `Monthly income $${monthlyIncome.toLocaleString()} is within the $${abdLimit.toLocaleString()}/mo limit and asset test is satisfied.`,
          criteria_ko: `월 소득 $${monthlyIncome.toLocaleString()}이 기준 한도 $${abdLimit.toLocaleString()} 이하이며 자산 기준을 충족합니다.`,
          article_slug: "medicaid-regular-medicaid-abd"
        });
      } else if (monthlyIncome <= abdLimit) {
        results.push({
          id: "medicaid-abd",
          title_en: "NJ FamilyCare / Medicaid (ABD)",
          title_ko: "뉴저지 패밀리케어 / 메디케이드 (ABD)",
          status: "conditional",
          status_en: "Income Eligible (Asset Review Needed)",
          status_ko: "소득 적격 (자산 심사 필요)",
          benefit_en: "Comprehensive healthcare coverage. Requires liquid assets under $4,000 (single) or $6,000 (couple).",
          benefit_ko: "전액 의료비 보장. 유동 자산이 $4,000(단독) 또는 $6,000(부부) 이하이어야 합니다.",
          criteria_en: `Income is eligible. Contact AWCA to review asset spend-down options.`,
          criteria_ko: `소득 기준은 충족합니다. 자산 조정 및 보호 방안은 AWCA 상담을 권장합니다.`,
          article_slug: "medicaid-regular-medicaid-abd"
        });
      } else if (needsCare && monthlyIncome <= 2829) {
        results.push({
          id: "medicaid-mltss",
          title_en: "Medicaid MLTSS (Managed Long-Term Care)",
          title_ko: "메디케이드 MLTSS (장기 요양 서비스)",
          status: "eligible",
          status_en: "Likely Eligible for Long-Term Care",
          status_ko: "장기 요양 적격 예상",
          benefit_en: "Covers in-home caregiver hours, adult day care, and skilled nursing home placement.",
          benefit_ko: "재택 간병인 시간 지원, 성인 데이케어, 요양원 입원 비용 전액 지원.",
          criteria_en: `Income is under the institutional limit of $2,829/mo (300% SSI limit).`,
          criteria_ko: `소득이 기관 장기 요양 한도인 월 $2,829(SSI 300%) 이하입니다.`,
          article_slug: "medicaid-ltc-medicaid-mltss"
        });
      }
    } else {
      // Adult 19-64 (ACA Medicaid Expansion 138% FPL)
      const magiLimit = Math.round(fplMonthly * 1.38);
      if (monthlyIncome <= magiLimit) {
        results.push({
          id: "medicaid-magi",
          title_en: "NJ FamilyCare / Medicaid (ACA Expansion)",
          title_ko: "뉴저지 패밀리케어 / 메디케이드 (오바마케어 확장)",
          status: "eligible",
          status_en: "Likely Eligible",
          status_ko: "적격 예상",
          benefit_en: "Free comprehensive health insurance with no monthly premium, no deductibles, and zero asset test.",
          benefit_ko: "월 보험료 없음, 디덕터블(본인부담금) 없음, 자산 심사 없이 100% 무료 건강보험 제공.",
          criteria_en: `Monthly income $${monthlyIncome.toLocaleString()} is within 138% FPL ($${magiLimit.toLocaleString()}/mo for household of ${size}).`,
          criteria_ko: `월 소득 $${monthlyIncome.toLocaleString()}이 138% FPL 한도(가구원 ${size}인 기준 월 $${magiLimit.toLocaleString()}) 이하입니다.`,
          article_slug: "medicaid-aca-medicaid"
        });
      }
    }

    // -------------------------------------------------------------
    // 2. Medicare & Medicare Savings Programs (MSP)
    // -------------------------------------------------------------
    if (age === "65+" || isDisabled || hasMedicare) {
      results.push({
        id: "medicare",
        title_en: "Medicare (Parts A, B, C & D)",
        title_ko: "메디케어 (Part A, B, C, D)",
        status: "eligible",
        status_en: "Eligible by Age / Disability",
        status_ko: "연령 / 장애 요건 충족",
        benefit_en: "Federal health insurance covering hospital (Part A), medical outpatient (Part B), and prescription drugs (Part D).",
        benefit_ko: "병원 입원(Part A), 외래 진료(Part B), 처방약(Part D)을 보장하는 연방 건강보험.",
        criteria_en: "Eligible upon turning age 65 or receiving SSDI for 24 months.",
        criteria_ko: "만 65세 도달 또는 SSDI 24개월 수령 시 자동/신청 자격 부여.",
        article_slug: "medicare-overview"
      });

      // MSP (QMB, SLMB, QI)
      const qmbLimit = Math.round(fplMonthly * 1.00);
      const slmbLimit = Math.round(fplMonthly * 1.20);
      const qiLimit = Math.round(fplMonthly * 1.35);

      if (monthlyIncome <= qmbLimit) {
        results.push({
          id: "msp-qmb",
          title_en: "Medicare Savings Program (QMB)",
          title_ko: "메디케어 저축 프로그램 (QMB)",
          status: "eligible",
          status_en: "High Benefit: Full Premium & Cost Relief",
          status_ko: "최고 혜택: 보험료 및 본인부담금 면제",
          benefit_en: "State pays your Part B premium ($202.90+/mo) plus Part A & B deductibles and coinsurance.",
          benefit_ko: "주 정부가 매월 Part B 보험료($202.90+)를 대납하고 디덕터블 및 코페이를 면제합니다.",
          criteria_en: `Income is under 100% FPL ($${qmbLimit.toLocaleString()}/mo).`,
          criteria_ko: `소득이 연방 빈곤선 100%(월 $${qmbLimit.toLocaleString()}) 이하입니다.`,
          article_slug: "medicare-savings-programs-msp"
        });
      } else if (monthlyIncome <= qiLimit) {
        results.push({
          id: "msp-slmb-qi",
          title_en: "Medicare Savings Program (SLMB / QI)",
          title_ko: "메디케어 저축 프로그램 (SLMB / QI)",
          status: "eligible",
          status_en: "Part B Premium Reimbursed",
          status_ko: "Part B 보험료 전액 지원",
          benefit_en: "State pays your monthly Medicare Part B premium, putting $2,434+ back in your pocket annually.",
          benefit_ko: "주 정부가 메디케어 Part B 보험료를 매월 대납하여 연간 $2,434 이상 절감됩니다.",
          criteria_en: `Income is within 100% - 135% FPL ($${qiLimit.toLocaleString()}/mo).`,
          criteria_ko: `소득이 연방 빈곤선 100%~135%(월 $${qiLimit.toLocaleString()}) 구간입니다.`,
          article_slug: "medicare-savings-programs-msp"
        });
      }

      // NJ PAAD (Prescription Assistance)
      const paadLimitAnnual = (size === 1 ? 52142 : 59209);
      if (annualIncome <= paadLimitAnnual) {
        results.push({
          id: "nj-paad",
          title_en: "NJ PAAD (Prescription Drug Assistance)",
          title_ko: "뉴저지 PAAD (처방약 보조 프로그램)",
          status: "eligible",
          status_en: "High Likelihood for NJ Seniors",
          status_ko: "뉴저지 시니어 높은 적격률",
          benefit_en: "Prescription copays capped at only $5 for generic and $7 for brand name drugs; pays Part D premium.",
          benefit_ko: "처방약 본인부담금을 제네릭 $5, 브랜드 $7로 고정하고 Part D 보험료를 전액 대납합니다.",
          criteria_en: `Annual income $${annualIncome.toLocaleString()} is under the generous NJ limit of $${paadLimitAnnual.toLocaleString()}.`,
          criteria_ko: `연 소득 $${annualIncome.toLocaleString()}이 뉴저지 PAAD 한도인 $${paadLimitAnnual.toLocaleString()} 이하입니다.`,
          article_slug: "medicare-nj-paad-and-senior-gold"
        });
      }
    }

    // -------------------------------------------------------------
    // 3. SNAP (Food Stamps / 푸드스탬프)
    // -------------------------------------------------------------
    const snapLimit = Math.round(fplMonthly * 1.85);
    if (monthlyIncome <= snapLimit) {
      const maxSnapBenefits = { 1: 292, 2: 536, 3: 768, 4: 975, 5: 1158, 6: 1390 };
      const estBenefit = maxSnapBenefits[size] || (1390 + (size - 6) * 219);
      results.push({
        id: "snap",
        title_en: "NJ SNAP (Food Assistance)",
        title_ko: "뉴저지 SNAP (푸드스탬프 식비 지원)",
        status: "eligible",
        status_en: "Likely Eligible",
        status_ko: "적격 예상",
        benefit_en: `Monthly electronic food benefit card (Families First EBT) of up to $${estBenefit}/month.`,
        benefit_ko: `식료품 구입을 위한 EBT 카드 지원 (가구당 최대 월 $${estBenefit} 상당).`,
        criteria_en: `Monthly income $${monthlyIncome.toLocaleString()} is within NJ's expanded 185% FPL ($${snapLimit.toLocaleString()}/mo).`,
        criteria_ko: `월 소득 $${monthlyIncome.toLocaleString()}이 뉴저지 확대 기준인 185% FPL(월 $${snapLimit.toLocaleString()}) 이하입니다.`,
        article_slug: "financial-assistance-snap"
      });
    } else {
      results.push({
        id: "snap",
        title_en: "NJ SNAP (Food Assistance)",
        title_ko: "뉴저지 SNAP (푸드스탬프)",
        status: "ineligible",
        status_en: "Income Above Standard Limit",
        status_ko: "소득 기준 초과",
        benefit_en: "Standard income limit is exceeded. Seniors or disabled with high medical expenses may still qualify via medical deductions.",
        benefit_ko: "표준 소득 한도를 초과했습니다. 다만 고액 의료비가 있는 65세 이상 또는 장애인은 공제 후 신청 가능합니다.",
        criteria_en: `Limit is $${snapLimit.toLocaleString()}/mo. Consider AWCA emergency food pantry.`,
        criteria_ko: `한도는 월 $${snapLimit.toLocaleString()}입니다. AWCA 식료품 지원 및 무료 급식 이용 가능.`,
        article_slug: "financial-assistance-snap"
      });
    }

    // -------------------------------------------------------------
    // 4. ACA Marketplace (GetCoveredNJ) Subsidies
    // -------------------------------------------------------------
    if (age !== "65+" && !hasMedicare) {
      const magiLimit = Math.round(fplMonthly * 1.38);
      if (monthlyIncome > magiLimit) {
        results.push({
          id: "aca-marketplace",
          title_en: "GetCoveredNJ (ACA Marketplace Subsidies)",
          title_ko: "GetCoveredNJ (오바마케어 마켓플레이스 정부 보조금)",
          status: "eligible",
          status_en: "Eligible for Premium Subsidies",
          status_ko: "정부 보험료 보조금 적격",
          benefit_en: "Advance premium tax credits cap your health insurance premium at a small percentage of your income.",
          benefit_ko: "연방 및 뉴저지 주정부 세액공제로 건강보험료의 대부분을 국가가 보조합니다.",
          criteria_en: `Income is above Medicaid cutoff (${fplRatio}% FPL). Eligible for Silver plan cost-sharing reductions.`,
          criteria_ko: `소득이 메디케이드 기준 초과(${fplRatio}% FPL)하여 오바마케어 보조금 대상입니다.`,
          article_slug: "medicaid-aca-marketplace"
        });
      }
    }

    // -------------------------------------------------------------
    // 5. Senior Housing (HUD Section 202 & LIHTC)
    // -------------------------------------------------------------
    if (age === "65+" || age === "19-64") {
      const ami50 = get50AMI(size);
      if (annualIncome <= ami50) {
        results.push({
          id: "housing-senior",
          title_en: "Affordable Senior Housing (HUD 202 / LIHTC)",
          title_ko: "시니어 아파트 / 공공 임대 주택 (HUD 202)",
          status: "eligible",
          status_en: "Income Eligible (Age 62+)",
          status_ko: "소득 기준 충족 (만 62세 이상)",
          benefit_en: "Rent is capped at only 30% of your adjusted monthly income, including utilities.",
          benefit_ko: "월 임대료가 수입의 30% 수준으로 제한되어 안전하고 쾌적한 주거 보장.",
          criteria_en: `Annual income $${annualIncome.toLocaleString()} is below 50% Area Median Income ($${ami50.toLocaleString()}).`,
          criteria_ko: `연 소득 $${annualIncome.toLocaleString()}이 지역 중위소득 50%(한도 $${ami50.toLocaleString()}) 이하입니다.`,
          article_slug: "housing-senior-apartments"
        });
      }
    }

    // -------------------------------------------------------------
    // 6. Utility & Energy Assistance (LIHEAP & Lifeline)
    // -------------------------------------------------------------
    const liheapLimit = getLIHEAPLimit(size);
    if (monthlyIncome <= liheapLimit) {
      results.push({
        id: "liheap",
        title_en: "LIHEAP Energy Assistance & Weatherization",
        title_ko: "LIHEAP 난방·냉방비 지원 및 컴포트 파트너스",
        status: "eligible",
        status_en: "Likely Eligible",
        status_ko: "적격 예상",
        benefit_en: "Direct grants paid toward your PSE&G, heating oil, gas, or cooling bills plus free energy upgrades.",
        benefit_ko: "전기, 가스, 난방유 요금에 대한 직접 보조금 지급 및 무료 에너지 효율 개선 공사 지원.",
        criteria_en: `Monthly income $${monthlyIncome.toLocaleString()} is under NJ's 60% SMI limit ($${liheapLimit.toLocaleString()}/mo).`,
        criteria_ko: `월 소득 $${monthlyIncome.toLocaleString()}이 뉴저지 주 중위소득 60%(월 $${liheapLimit.toLocaleString()}) 이하입니다.`,
        article_slug: "financial-assistance-liheap"
      });
    }

    // -------------------------------------------------------------
    // 7. NJ Property Tax Relief (Senior Freeze & ANCHOR)
    // -------------------------------------------------------------
    if (isHomeowner && (age === "65+" || isDisabled)) {
      const seniorFreezeLimit = 163050;
      if (annualIncome <= seniorFreezeLimit) {
        results.push({
          id: "senior-freeze",
          title_en: "NJ Senior Freeze (Property Tax Reimbursement)",
          title_ko: "뉴저지 시니어 프리즈 (재산세 인상분 환급)",
          status: "eligible",
          status_en: "Eligible for Tax Reimbursement",
          status_ko: "재산세 동결 환급 대상",
          benefit_en: "Freezes property taxes and reimburses any annual tax increases directly to you.",
          benefit_ko: "기준 연도의 재산세액을 고정하고 매년 인상되는 재산세 차액을 주정부에서 전액 환급합니다.",
          criteria_en: `Annual income $${annualIncome.toLocaleString()} is under the $163,050 limit with NJ homeownership.`,
          criteria_ko: `연 소득이 $163,050 이하이며 뉴저지 자택 보유 요건을 충족합니다.`,
          article_slug: "housing-property-tax-reimbursement-senior-freeze"
        });
      }
    }

    // -------------------------------------------------------------
    // 8. In-Home Caregiver Support (PPP & JACC)
    // -------------------------------------------------------------
    if (needsCare) {
      results.push({
        id: "in-home-ppp",
        title_en: "In-Home Care (Personal Preference Program / JACC)",
        title_ko: "재택 케어 프로그램 (PPP / JACC 가족 간병 지원)",
        status: "special-purple",
        status_en: "High Priority Service",
        status_ko: "우선 지원 프로그램",
        benefit_en: "Allows seniors to hire their own family members or trusted friends as paid in-home caregivers.",
        benefit_ko: "가족, 친척 또는 이웃을 유급 간병인으로 직접 고용하여 집에서 돌봄을 받을 수 있도록 월 급여 지급.",
        criteria_en: "Requires functional assessment for assistance with daily living activities (ADLs).",
        criteria_ko: "일상생활 동작(목욕, 식사, 이동 등) 보조 필요 판정을 통해 승인.",
        article_slug: "in-home-care-ppp"
      });
    }

    return {
      fplRatio: fplRatio,
      annualIncome: annualIncome,
      monthlyIncome: monthlyIncome,
      fplAnnual: fplAnnual,
      householdSize: size,
      eligibleCount: results.filter(r => r.status === "eligible" || r.status === "special-purple").length,
      results: results
    };
  }

  return {
    evaluate: evaluate
  };
})();

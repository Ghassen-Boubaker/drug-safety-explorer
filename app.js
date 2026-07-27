document.addEventListener('DOMContentLoaded', () => {
  // --- UI Translations Dictionary ---
  const translations = {
    en: {
      title: "⚕️ Global Drug Safety Explorer",
      subtitle: "Search active pharmaceutical ingredients and check condition-specific risks.",
      placeholder: "Enter drug name (e.g., Ibuprofen, Paracetamol, Doliprane)...",
      searchBtn: "Search Drug",
      conditionLabel: "Select pre-existing conditions to check for interactions:",
      pregnancy: "🤰 Pregnancy",
      hypertension: "🫀 High Blood Pressure",
      asthma: "🫁 Asthma",
      kidney: "🩺 Kidney Issues",
      disclaimerTitle: "Educational Notice:",
      disclaimerText: "Information provided is pulled from public health APIs (openFDA). This tool does not provide medical advice. Always consult a certified physician.",
      searching: "Searching openFDA database for",
      notFoundTitle: "No Results Found",
      notFoundMsg: "Could not find active label warnings for",
      notFoundAdvice: "Try searching by generic active ingredient (e.g., Acetaminophen, Ibuprofen, Paracetamol).",
      activeInfoBadge: "Active Ingredient Info",
      genericName: "Generic Name",
      brandExample: "Brand Example",
      activeIngredients: "Active Ingredients",
      riskFlaggedBadge: "Risk Flagged",
      pregnancyRiskTitle: "🤰 High Risk Notice: Pregnancy & Breastfeeding",
      warningConditionTitle: "Warning for Condition:",
      noFlagsBadge: "No Specific Flags",
      noFlagsTitle: "Selected Conditions",
      noFlagsMsg: "No explicit automated warnings were flagged for your selected conditions in the primary label text. Always review general warnings below.",
      generalWarningsBadge: "General FDA Label Warnings",
      safetyPrecautions: "Safety Precautions",
      emptyInputAlert: "Please enter a drug name."
    },
    fr: {
      title: "⚕️ Explorateur de Sécurité des Médicaments",
      subtitle: "Recherchez des principes actifs et vérifiez les risques liés à vos conditions de santé.",
      placeholder: "Entrez un médicament (ex: Doliprane, Paracétamol, Ibuprofène)...",
      searchBtn: "Rechercher",
      conditionLabel: "Sélectionnez vos conditions de santé pour vérifier les interactions :",
      pregnancy: "🤰 Grossesse",
      hypertension: "🫀 Hypertension / Pression Artérielle",
      asthma: "🫁 Asthme",
      kidney: "🩺 Problèmes Rénaux",
      disclaimerTitle: "Avis Éducatif :",
      disclaimerText: "Les informations proviennent d'APIs publiques de santé (openFDA). Ce site ne fournit pas de conseils médicaux. Consultez toujours un médecin.",
      searching: "Recherche dans la base de données openFDA pour",
      notFoundTitle: "Aucun Résultat Trouvé",
      notFoundMsg: "Impossible de trouver les mises en garde officielles pour",
      notFoundAdvice: "Essayez de chercher par la molécule ou le nom générique (ex: Paracetamol, Ibuprofen).",
      activeInfoBadge: "Info Principe Actif",
      genericName: "Nom Générique",
      brandExample: "Exemple de Marque",
      activeIngredients: "Substances Actives",
      riskFlaggedBadge: "Risque Signalé",
      pregnancyRiskTitle: "🤰 Avertissement Risque : Grossesse & Allaitement",
      warningConditionTitle: "Mise en garde pour la condition :",
      noFlagsBadge: "Aucun Risque Spécifique",
      noFlagsTitle: "Conditions Sélectionnées",
      noFlagsMsg: "Aucun avertissement automatique spécifique n'a été détecté pour vos conditions sélectionnées. Lisez attentivement les précautions générales ci-dessous.",
      generalWarningsBadge: "Mises en Garde Générales FDA",
      safetyPrecautions: "Précautions de Sécurité",
      emptyInputAlert: "Veuillez saisir le nom d'un médicament."
    }
  };

  // Map condition keywords for text searching in French & English
  const conditionKeywords = {
    pregnancy: ["pregnancy", "pregnant", "breastfeeding", "fetal", "grossesse", "enceinte", "allaitement"],
    hypertension: ["hypertension", "high blood pressure", "cardiovascular", "pression arterielle"],
    asthma: ["asthma", "bronchospasm", "respiratory", "asthme", "bronchospasme"],
    kidney: ["kidney", "renal", "hepatic", "rein", "renal"]
  };

  let currentLang = 'en';

  // DOM Elements
  const langSelect = document.getElementById('langSelect');
  const searchBtn = document.getElementById('searchBtn');
  const drugInput = document.getElementById('drugInput');
  const resultsContainer = document.getElementById('results');

  // --- Event Listeners ---
  langSelect.addEventListener('change', (e) => {
    currentLang = e.target.value;
    updateLanguageUI();
  });

  searchBtn.addEventListener('click', handleSearch);
  drugInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleSearch();
  });

  // Function to switch static interface text
  function updateLanguageUI() {
    const t = translations[currentLang];

    document.getElementById('txtTitle').textContent = t.title;
    document.getElementById('txtSubtitle').textContent = t.subtitle;
    drugInput.placeholder = t.placeholder;
    searchBtn.textContent = t.searchBtn;
    document.getElementById('txtConditionLabel').textContent = t.conditionLabel;

    document.getElementById('lblPregnancy').textContent = t.pregnancy;
    document.getElementById('lblHypertension').textContent = t.hypertension;
    document.getElementById('lblAsthma').textContent = t.asthma;
    document.getElementById('lblKidney').textContent = t.kidney;

    document.getElementById('txtDisclaimerTitle').textContent = t.disclaimerTitle;
    document.getElementById('txtDisclaimerText').textContent = t.disclaimerText;
  }

  // --- Skeleton Loading UI ---
  function showSkeletonLoading() {
    resultsContainer.innerHTML = `
      <article class="skeleton-card">
        <div class="skeleton-line skeleton-badge"></div>
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text-long"></div>
        <div class="skeleton-line skeleton-text-medium"></div>
      </article>
      <article class="skeleton-card">
        <div class="skeleton-line skeleton-badge"></div>
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text-long"></div>
        <div class="skeleton-line skeleton-text-short"></div>
      </article>
    `;
  }

  // --- Main Search Handler ---
  async function handleSearch() {
    const query = drugInput.value.trim();
    const t = translations[currentLang];

    if (!query) {
      alert(t.emptyInputAlert);
      return;
    }

    const selectedConditions = Array.from(
      document.querySelectorAll('.condition-chips input[type="checkbox"]:checked')
    ).map((cb) => cb.value);

    // Show Skeleton UI
    showSkeletonLoading();

    try {
      // Query openFDA generic or brand name index
      const url = `https://api.fda.gov/drug/label.json?search=openfda.generic_name:"${encodeURIComponent(query)}"+openfda.brand_name:"${encodeURIComponent(query)}"&limit=1`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Drug not found');
      }

      const data = await response.json();
      const drugLabel = data.results[0];

      renderDrugResults(drugLabel, selectedConditions, query);

    } catch (error) {
      resultsContainer.innerHTML = `
        <article class="alert-card risk-high">
          <div class="alert-header">
            <span class="badge badge-high">${t.notFoundTitle}</span>
            <h2>${t.notFoundTitle}</h2>
          </div>
          <p>${t.notFoundMsg} <strong>"${escapeHTML(query)}"</strong>. ${t.notFoundAdvice}</p>
        </article>
      `;
    }
  }

  // --- Render Drug Results ---
  function renderDrugResults(label, userConditions, searchQuery) {
    const t = translations[currentLang];
    resultsContainer.innerHTML = '';

    const genericName = label.openfda?.generic_name?.[0] || searchQuery;
    const brandName = label.openfda?.brand_name?.[0] || 'N/A';
    const warnings = label.warnings?.[0] || label.warnings_and_cautions?.[0] || '';
    const contraindications = label.contraindications?.[0] || '';
    const pregnancyText = label.pregnancy_or_breast_feeding?.[0] || label.pregnancy?.[0] || '';
    const activeIngredients = label.active_ingredient?.[0] || 'N/A';

    const fullSafetyText = `${warnings} ${contraindications} ${pregnancyText}`.toLowerCase();

    // 1. General Active Ingredient Card
    const infoCardHtml = `
      <article class="alert-card info-card">
        <div class="alert-header">
          <span class="badge badge-info">${t.activeInfoBadge}</span>
          <h2>${capitalize(genericName)}</h2>
        </div>
        <ul>
          <li><strong>${t.genericName}:</strong> ${capitalize(genericName)}</li>
          <li><strong>${t.brandExample}:</strong> ${capitalize(brandName)}</li>
          <li><strong>${t.activeIngredients}:</strong> ${escapeHTML(activeIngredients.slice(0, 150))}...</li>
        </ul>
      </article>
    `;
    resultsContainer.insertAdjacentHTML('beforeend', infoCardHtml);

    // 2. Condition Risk Scanning
    let matchedRisksCount = 0;

    userConditions.forEach((condition) => {
      const keywords = conditionKeywords[condition] || [condition];
      const matchedKeyword = keywords.find(kw => fullSafetyText.includes(kw));

      if (matchedKeyword) {
        matchedRisksCount++;
        
        let riskTitle = `${t.warningConditionTitle} ${capitalize(t[condition] || condition)}`;
        
        if (condition === 'pregnancy') {
          riskTitle = t.pregnancyRiskTitle;
        }

        const excerpt = extractContext(fullSafetyText, matchedKeyword);

        const riskCardHtml = `
          <article class="alert-card risk-high">
            <div class="alert-header">
              <span class="badge badge-high">${t.riskFlaggedBadge}</span>
              <h2>${riskTitle}</h2>
            </div>
            <p><strong>Official Label Warning:</strong> "...${excerpt}..."</p>
          </article>
        `;
        resultsContainer.insertAdjacentHTML('beforeend', riskCardHtml);
      }
    });

    // 3. No specific condition match note
    if (matchedRisksCount === 0 && userConditions.length > 0) {
      resultsContainer.insertAdjacentHTML('beforeend', `
        <article class="alert-card info-card" style="border-left-color: #22c55e; background-color: #f0fdf4;">
          <div class="alert-header">
            <span class="badge" style="background:#dcfce7; color:#15803d;">${t.noFlagsBadge}</span>
            <h2>${t.noFlagsTitle}</h2>
          </div>
          <p>${t.noFlagsMsg}</p>
        </article>
      `);
    }

    // 4. General Safety Warnings Card
    if (warnings || contraindications) {
      const generalText = contraindications || warnings;
      resultsContainer.insertAdjacentHTML('beforeend', `
        <article class="alert-card risk-moderate">
          <div class="alert-header">
            <span class="badge badge-moderate">${t.generalWarningsBadge}</span>
            <h2>${t.safetyPrecautions}</h2>
          </div>
          <p>${escapeHTML(generalText.slice(0, 450))}...</p>
        </article>
      `);
    }
  }

  // --- Helper Functions ---
  function extractContext(fullText, keyword) {
    const index = fullText.indexOf(keyword);
    if (index === -1) return fullText.slice(0, 200);
    const start = Math.max(0, index - 50);
    const end = Math.min(fullText.length, index + 150);
    return escapeHTML(fullText.slice(start, end));
  }

  function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
  }
});
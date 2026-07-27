Markdown
# ⚕️ Global Drug Safety Explorer

A modern, responsive, and bilingual (English & French) web application designed to help users search active pharmaceutical ingredients, view official drug warnings, and screen for potential risks based on pre-existing health conditions.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![openFDA](https://img.shields.io/badge/API-openFDA-blue?style=flat)

---

## Key Features

* **🌐 Bilingual Interface:** Instant toggle between English 🇬🇧 and French 🇫🇷 for UI text and safety notices.
* **🔍 Live FDA Data Integration:** Fetches real-time drug label data, active ingredients, and safety warnings using the official **openFDA API**.
* **🩺 Pre-existing Condition Screening:** Allows users to select health conditions (e.g., *Pregnancy*, *High Blood Pressure*, *Asthma*, *Kidney Issues*) to scan and highlight specific contraindications.
* **🎨 Modern UI with Skeleton Loading:** Features responsive CSS card layouts, high-contrast risk badges, and smooth Skeleton shimmer animations during API fetch operations.
* **⚡ Client-Side & Static:** Fully static front-end architecture—no server configuration required.

---

## Tech Stack

* **Front-end:** Plain HTML5, CSS3 (CSS Grid & Flexbox)
* **Logic & API Handling:** Modern JavaScript (`ES6+`, `async/await`, `Fetch API`)
* **Data Source:** [openFDA Drug Label API](https://openfda.api.fda.gov/)

---

## Quick Start & Local Setup

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/Ghassen-Boubaker/drug-safety-explorer.git](https://github.com/Ghassen-Boubaker/drug-safety-explorer.git)
   cd drug-safety-explorer

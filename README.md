# Astronaut Health Guardian

**NASA Space Apps Challenge 2026 Prototype**  
*AI-Assisted, Offline-First Health Monitoring & Decision Support for Long-Duration Space Missions*

Live Production URL: **`https://astronaut-health-monitor-abisheks-projects-c3441485.vercel.app`**  
Local Hosting URL: **`http://127.0.0.1:8000`**

---

> [!IMPORTANT]
> **Safety and Non-Clinical Notice:**  
> This project is a monitoring and decision-support prototype developed for education and research demonstration. It is **not a medical device**, does not diagnose disease or medical conditions, and does not replace certified flight surgeons or validated clinical procedures. All telemetry measurements displayed in the prototype are **SIMULATED / DEMO DATA** unless a specific authorized NASA sensor stream is directly loaded.

---

## 1. Problem Statement
Long-duration exploration missions (such as Deep Space Gateway and Mars transit) expose astronauts to:
- Space radiation and galactic cosmic rays (GCR)
- Microgravity and altered gravity bone/physical deconditioning
- Isolation, confinement, and circadian desynchrony
- Cardiovascular strain and fluid shifts
- Closed habitat atmospheric shifts (e.g., carbon dioxide accumulation)
- Intermittent communications blackouts (Loss-of-Signal / comms latency)

---

## 2. Solution: Astronaut Health Guardian
Astronaut Health Guardian provides an offline-first PWA and deterministic decision-support engine that:
1. **Monitors 8 Core Health Domains:**
   - **Cardiovascular Health:** Heart rate, pulse oximetry ($SpO_2$), blood pressure
   - **Bone and Physical Health:** Grounded in NASA OSDR OSD-919 microgravity bone resorption research
   - **Behavioral Health and Wellbeing:** Sleep architecture, actigraphy, and autonomic stress indices with role-based privacy controls
   - **Radiation Exposure / Context:** Active cabin flux and cumulative dosimeter tracking grounded in NASA Environmental Data App (EDA)
   - **Environmental Conditions:** Cabin $CO_2$ partial pressure, temperature, and humidity grounded in NASA EDA
   - **Isolation and Confinement:** Mission elapsed time (MET), confinement days, and circadian alignment
   - **Altered Gravity / Microgravity:** Neuro-vestibular G-adaptation indices
   - **Immune and Physiological Indicators:** Grounded in NASA OSDR OSD-918 blood and immune status studies
2. **Personal Baselines & Trend Analysis:**
   - Visualizes moving averages, normal safety bands, and circadian variations.
3. **5-Dimension Explainable Review Flags:**
   - Every flag transparently details:
     1. *What changed*
     2. *Baseline/reference used*
     3. *Period considered*
     4. *Why flagged*
     5. *Action to review*
   - Flight Surgeon human-in-the-loop acknowledgment workflow with immutable audit logging.
4. **Offline-First PWA & Idempotent Synchronization:**
   - Full telemetry viewing and logging during Loss-of-Signal (LOS).
   - Client UUID generation prevents duplicate records on reconnection.

---

## 3. NASA Data & Resources Integration

| NASA Resource | Exact URL | Dataset / Scope | How It Is Used in the Project |
|---|---|---|---|
| **NASA Open Science Data Repository (OSDR)** | [https://osdr.nasa.gov/bio/repo/](https://osdr.nasa.gov/bio/repo/) | Core Repository | Grounds health monitoring domains and deep-space biological research context. |
| **NASA OSDR Visualization Portal** | [https://visualization.osdr.nasa.gov/](https://visualization.osdr.nasa.gov/) | Visualization Portal | Informs time-series chart design, multi-metric cross-comparisons, and safety band limits. |
| **NASA Environmental Data App (EDA)** | [https://visualization.osdr.nasa.gov/eda/](https://visualization.osdr.nasa.gov/eda/) | `EDA-ISS` | Telemetry reference for Cabin $CO_2$, relative humidity, and active radiation dosimeter flux. |
| **NASA OSDR OSD-919** | [https://osdr.nasa.gov/bio/repo/data/studies/OSD-919](https://osdr.nasa.gov/bio/repo/data/studies/OSD-919) | `OSD-919` | Scientific baseline for spaceflight bone deconditioning and collagen turnover ($NTx$ biomarker). |
| **NASA OSDR OSD-918** | [https://osdr.nasa.gov/bio/repo/data/studies/OSD-918](https://osdr.nasa.gov/bio/repo/data/studies/OSD-918) | `OSD-918` | Scientific context for spaceflight immune dysregulation and cytokine expression under stress. |

---

## 4. Super Intelligence (SI) Usage Disclosure
Large language model (ChatGPT / Claude / Gemini) assistance was used during project development for:
- Project ideation and requirement refinement based on NASA challenge specifications
- Architectural diagrams and markdown specification blueprints
- Python FastAPI REST API and React PWA component scaffolding
- Deterministic rule parameterization and test assertions

**Developer Ownership & Verification:** The developer reviewed, selected, modified, integrated, tested, and demonstrated the resulting code and user interface.  
**Branding Compliance:** No AI-generated asset contains, modifies, or imitates NASA logos, the NASA worm/meatball insignia, national flags, mission patches, or federal identifiers.

---

## 5. Technology Architecture

```text
NASA OSDR / NASA Resources (OSD-919, OSD-918, EDA)
          |
          v
NASA Data / Reference Layer
          |
     +----+----+
     |         |
     v         v
NASA-derived  Synthetic demo
/context data data (is_simulated: true)
     |         |
     +----+----+
          |
          v
   React 19 + TypeScript + Tailwind CSS Frontend PWA
          |
   Astronaut Health Guardian HUD & Dashboard
          |
 +--------+--------+
 |        |        |
 v        v        v
Personal  Trend    Explainable
Baseline  Analysis Review Flags
          |
    Offline Storage (IndexedDB / Service Worker)
          |
      Sync Queue (Client UUID Idempotency Keys)
          |
       FastAPI Telemetry Backend
          |
     PostgreSQL / Append-Only Ingestion
```

---

## 6. Getting Started

### Local Hosting (FastAPI + React PWA on Port 8000)
```bash
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000
```
Open **`http://127.0.0.1:8000`** in your browser.

### Development Mode (Vite HMR)
```bash
# Terminal 1: Backend
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev
```

### Running Test Suite
```bash
python -m tests.test_api_and_rules
```

---

## 7. Submission Checklist Verification
- [x] NASA resources entered and cited with live URLs
- [x] NASA-derived vs. simulated data clearly distinguished
- [x] Super Intelligence (SI) usage disclosed
- [x] No NASA branding generated or modified by AI tools
- [x] All 8 health domains represented
- [x] 5-dimension explainable review flags implemented
- [x] Offline operation and idempotent sync verified
- [x] Live production URL deployed on Vercel

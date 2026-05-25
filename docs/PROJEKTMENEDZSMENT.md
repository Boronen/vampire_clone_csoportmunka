# Projektmenedzsment - Vampire Survivors Clone

## 📋 Projekt áttekintés

**Projekt neve:** Vampire Survivors Clone  
**Csapat:** Kevin, Marci, Tomi  
**Kezdés dátuma:** 2026.04  
**Tervezett befejezés:** 2026.05.26  
**Státusz:** 🔄 Aktív fejlesztés alatt  

---

## 👥 Csapattagok és szerepek

### **Kevin** - Tech Lead & Core Programmer
**Szakértelem:** Programozás, AI használat, komplex logika  
**Felelősségek:**
- Core game engine fejlesztés
- Spell system architektúra
- Code review és optimalizálás
- Technikai dokumentáció
- Cypress teszt framework setup

**Főbb feladatok:**
- Game.js - játék főhurok
- Player.js - játékos mechanika
- Entity.js - alaposztály
- Enemy.js - AI logika
- SpellManager.js - varázs rendszer központ
- Spell.js és SpellTypes/ - varázslat típusok
- Collision detection
- Performance optimization

---

### **Marci** - Visual Lead & Artist
**Szakértelem:** Grafikai design, animáció, CSS styling  
**Felelősségek:**
- Sprite management
- Visual effects
- UI/UX design
- Asset organization
- Animációk

**Főbb feladatok:**
- Sprites/ mappa szervezés
- Background.js - háttér renderelés
- DamageNumber.js - sérülés számok vizuális megjelenítése
- CSS styling (index.html)
- Sprite animációk implementálása
- Custom font system
- Death screen design
- UI mockups és wireframes

---

### **Tomi** - Idea Generator & Support
**Szakértelem:** Ötletek, tesztelés, dokumentáció  
**Felelősségek:**
- Játék koncepció ötletek
- Asset szervezés
- Dokumentáció írás
- Tesztelés és QA
- Egyszerűbb kódolási feladatok

**Főbb feladatok:**
- SpellData.js szerkesztés
- Asset dokumentáció
- README.md projekt leírás
- Játék tesztelés
- Bug reporting
- Egyszerű Cypress tesztek
- Ötletek gyűjtése új funkciókhoz

---

## 🎯 Mérföldkövek

### ✅ Phase 1: Alapok (Befejezett)
**Időtartam:** Hét 1-2  
**Státusz:** ✅ Kész

**Feladatok:**
- [x] Projekt inicializálás
- [x] Git repository setup
- [x] Alapvető HTML/CSS struktúra
- [x] Canvas setup
- [x] Entity alaposztály
- [x] Player alapfunkcionalitás
- [x] Enemy alapfunkcionalitás
- [x] Ütközésdetektálás alapok
- [x] Sprite betöltés

**Felelős:** Kevin (core), Marci (visual)

---

### ✅ Phase 2: Core Gameplay (Befejezett)
**Időtartam:** Hét 2-3  
**Státusz:** ✅ Kész

**Feladatok:**
- [x] Player mozgás (WASD/Arrows)
- [x] Projectile rendszer
- [x] Enemy spawning
- [x] Enemy AI (player követés)
- [x] Collision detection (player-enemy, projectile-enemy)
- [x] Health system
- [x] Game over screen
- [x] Score rendszer
- [x] Background rendering
- [x] Camera system

**Felelős:** Kevin (logic), Marci (sprites), Tomi (testing)

---

### ✅ Phase 3: Spell System (Befejezett)
**Időtartam:** Hét 3-4  
**Státusz:** ✅ Kész

**Feladatok:**
- [x] Spell alaposztály
- [x] SpellManager architektúra
- [x] ProjectileSpell implementation
- [x] OrbitalSpell implementation
- [x] AOESpell implementation
- [x] StaticAOESpell implementation
- [x] SkyFallSpell implementation
- [x] ShieldSpell implementation
- [x] MeleeSpell implementation
- [x] SpellData.js konfigurálás
- [x] Spell upgrade system
- [x] Spell combinations

**Felelős:** Kevin (implementation), Tomi (data), Marci (effects)

---

### ✅ Phase 4: Progression System (Befejezett)
**Időtartam:** Hét 4  
**Státusz:** ✅ Kész

**Feladatok:**
- [x] XP system
- [x] Level up mechanic
- [x] Upgrade menu
- [x] Upgrade options generation
- [x] Stat upgrades
- [x] Spell discovery system
- [x] Ultimate abilities
- [x] Dash mechanic

**Felelős:** Kevin (logic), Marci (UI)

---

### ✅ Phase 5: Polish & Effects (Befejezett)
**Időtartam:** Hét 5  
**Státusz:** ✅ Kész

**Feladatok:**
- [x] SoundManager implementation
- [x] Sound effects integration
- [x] DamageNumber system
- [x] Sprite animations
- [x] Visual effects
- [x] Debug mode
- [x] Custom font rendering
- [x] Death screen stats

**Felelős:** Marci (visual/audio), Kevin (systems)

---

### 🔄 Phase 6: Documentation (Folyamatban)
**Időtartam:** Hét 5-6  
**Státusz:** 🔄 Folyamatban

**Feladatok:**
- [x] README.md átírás
- [x] UML.md létrehozás
- [x] PROJEKTMENEDZSMENT.md
- [ ] SPECIFIKACIO.md
- [ ] FEJLESZTOI_DOK.md
- [ ] Code documentation (JSDoc)
- [ ] SPRITE_ANALYSIS.md frissítés
- [ ] SPELL_SYSTEM.md frissítés

**Felelős:** Kevin (technical), Tomi (descriptions), Marci (visuals)

---

### ⏳ Phase 7: Testing & Quality (Következik)
**Időtartam:** Hét 6  
**Státusz:** ⏳ Tervezett

**Feladatok:**
- [ ] Cypress setup
- [ ] E2E tesztek írása
- [ ] Unit tesztek (opcionális)
- [ ] Bug fixing
- [ ] Performance optimization
- [ ] Code cleanup
- [ ] Remove spells.js (duplikáció)
- [ ] Remove unused code

**Felelős:** Kevin (setup/complex tests), Tomi (simple tests), Marci (visual tests)

---

## 📊 Feladat táblázat (Kanban Board)

### 🔴 Magas prioritás (High Priority)

| Feladat | Felelős | Státusz | Határidő |
|---------|---------|---------|----------|
| SPECIFIKACIO.md írása | Tomi | ⏳ Todo | 05.26 |
| FEJLESZTOI_DOK.md | Kevin | ⏳ Todo | 05.26 |
| Cypress setup | Kevin | ⏳ Todo | 05.26 |
| Code cleanup (spells.js törlés) | Kevin | ⏳ Todo | 05.26 |
| Unused code removal | Kevin | ⏳ Todo | 05.26 |

### 🟡 Közepes prioritás (Medium Priority)

| Feladat | Felelős | Státusz | Határidő |
|---------|---------|---------|----------|
| Cypress tesztek írása | Tomi/Kevin | ⏳ Todo | 05.27 |
| JSDoc dokumentáció | Kevin | ⏳ Todo | 05.27 |
| README képek hozzáadása | Marci | ⏳ Todo | 05.27 |
| Draw.io UML diagram | Kevin | ⏳ Todo | 05.28 |

### 🟢 Alacsony prioritás (Low Priority)

| Feladat | Felelős | Státusz | Határidő |
|---------|---------|---------|----------|
| Performance profiling | Kevin | 🔄 Nice-to-have | - |
| Additional sound effects | Marci | 🔄 Nice-to-have | - |
| More enemy types | Kevin | 🔄 Nice-to-have | - |
| Boss enemies | Kevin/Tomi | 🔄 Nice-to-have | - |

---

## 📈 Sprint Planning

### Sprint 1 (Dokumentáció) - 05.26
**Cél:** Teljes dokumentáció elkészítése

**Sprint feladatok:**
1. ✅ README.md újraírás (Kevin)
2. ✅ UML.md létrehozás (Kevin)
3. ✅ PROJEKTMENEDZSMENT.md (Kevin)
4. ⏳ SPECIFIKACIO.md (Tomi/Kevin)
5. ⏳ FEJLESZTOI_DOK.md (Kevin)

**Daily standup kérdések:**
- Mit csináltam tegnap?
- Mit fogok csinálni ma?
- Van valami akadály?

---

### Sprint 2 (Tesztelés & Cleanup) - 05.27-05.28
**Cél:** Cypress setup, kód tisztítás, tesztelés

**Sprint feladatok:**
1. ⏳ Cypress telepítés és konfiguráció (Kevin)
2. ⏳ Alap E2E tesztek (Kevin)
3. ⏳ Egyszerű tesztek (Tomi útmutatóval)
4. ⏳ spells.js törlése (Kevin)
5. ⏳ Használaton kívüli kód eltávolítása (Kevin)
6. ⏳ Kód formázás és cleanup (Kevin)

---

## 🐛 Bug Tracking

### Kritikus bugok
*Jelenleg nincs kritikus bug*

### Közepes bugok
*Jelenleg nincs jelentett bug*

### Kisebb hibák
- [ ] Ellenség spawn ritkán átfed más ellenséggel
- [ ] Damage numbers néha beragadnak ritka esetekben

---

## 📝 Munkanapló (Work Log)

### 2026.05.26 - Dokumentáció Sprint
**Kevin:**
- ✅ README.md teljes újraírás magyar nyelven
- ✅ UML.md létrehozás ASCII diagramokkal
- ✅ PROJEKTMENEDZSMENT.md létrehozás
- 🔄 SPECIFIKACIO.md előkészítés
- 🔄 FEJLESZTOI_DOK.md előkészítés

**Marci:**
- Szabadság / Sprite szervezés

**Tomi:**
- Asset dokumentáció áttekintés
- README review

---

### Korábbi hetek (összefoglaló)
**Kevin:**
- Core game engine (Game.js, Entity.js, Player.js, Enemy.js)
- Teljes spell system implementálás
- Collision detection
- Sound integration
- Debug mode

**Marci:**
- Összes sprite organizálás
- Background rendering
- DamageNumber visual effects
- CSS styling
- Animation system

**Tomi:**
- SpellData.js konfigurálás
- Játék tesztelés
- Bug reporting
- Ötletek gyűjtése

---

## 🎓 Knowledge Sharing

### Technológiai döntések

**Miért Vanilla JavaScript?**
- Egyszerű deployment
- Nincsenek dependencies
- Teljes kontroll a kód felett
- Oktatási érték

**Miért Canvas API?**
- Kiváló performance játékokhoz
- Közvetlen pixel control
- Széles browser támogatás

**Miért ES6 Modules?**
- Tiszta kód szervezés
- Import/export clarity
- Modern JavaScript standard

---

## 📚 Learning Resources

### Kevin számára:
- Cypress dokumentáció
- JSDoc best practices
- Game optimization techniques

### Marci számára:
- Canvas animation techniques
- Sprite sheet optimization
- CSS3 animations

### Tomi számára:
- Cypress basics tutorial
- JavaScript fundamentals
- Git workflow

---

## 🔄 Verziókezelés (Git Workflow)

### Branch stratégia:
```
main (stable)
  │
  ├── develop (integration)
  │     │
  │     ├── feature/spell-system (Kevin)
  │     ├── feature/visual-effects (Marci)
  │     └── feature/documentation (Tomi)
```

### Commit üzenetek formátum:
```
[Type] Short description

Types:
- feat: új funkció
- fix: bug javítás
- docs: dokumentáció
- style: formázás
- refactor: kód átszervezés
- test: tesztek
- chore: egyéb
```

**Példák:**
```
[feat] Add OrbitalSpell implementation
[fix] Fix collision detection bug with shields
[docs] Update README with Hungarian documentation
[refactor] Clean up duplicate spell code
```

---

## 📞 Kommunikáció

### Discord Channel:
- #general - általános beszélgetés
- #dev - fejlesztés
- #bugs - bug reports
- #ideas - új ötletek

### Weekly Meeting:
- **Időpont:** Hétfő 18:00
- **Platform:** Discord voice
- **Agenda:**
  1. Előző hét review
  2. Következő hét planning
  3. Problémák megbeszélése
  4. Q&A

---

## 🎯 Sikerkritériumok

### Minimum Viable Product (MVP):
- ✅ Működő játék loop
- ✅ Player mozgás és lövés
- ✅ Enemy spawning és AI
- ✅ Ütközésdetektálás
- ✅ Spell system
- ✅ XP és level up
- ✅ Game over screen

### Nice-to-Have:
- ⏳ Cypress tesztek
- ⏳ Teljes dokumentáció
- 🔄 Performance optimalizálás
- 🔄 Több enemy típus
- 🔄 Boss fights

---

## 📊 Metrikák

### Kód statisztikák:
- **Összes sor:** ~3000+ sor JavaScript
- **Osztályok száma:** 18+
- **Fájlok száma:** 25+
- **Sprite-ok száma:** 100+
- **Hang effektek:** 20+

### Fejlesztési idő:
- **Teljes idő:** ~6 hét
- **Core development:** ~4 hét
- **Polish & effects:** ~1 hét
- **Documentation:** ~1 hét

---

## 🎉 Projekt státusz összefoglaló

```
Teljesítmény: ████████████████████░ 95%

Core Features:     ████████████████████ 100%
Visual Effects:    ████████████████████ 100%
Sound System:      ████████████████████ 100%
Documentation:     ████████████░░░░░░░░  65%
Testing:           ████░░░░░░░░░░░░░░░░  20%
Code Quality:      ██████████████░░░░░░  70%
```

---

## 📅 Következő lépések (Next Actions)

### Azonnal (Today):
1. SPECIFIKACIO.md létrehozás (Tomi/Kevin)
2. FEJLESZTOI_DOK.md létrehozás (Kevin)
3. Cypress telepítés előkészítése (Kevin)

### Holnap (Tomorrow):
1. Cypress E2E tesztek írása
2. Code cleanup (spells.js removal)
3. JSDoc hozzáadása fontos metódusokhoz

### Ezen a héten (This Week):
1. Teljes teszt lefedettség
2. Kód optimalizálás
3. Draw.io UML diagram készítése
4. Projekt prezentáció előkészítése

---

**Utolsó frissítés:** 2026.05.26  
**Frissítette:** Kevin  
**Következő review:** 2026.05.27

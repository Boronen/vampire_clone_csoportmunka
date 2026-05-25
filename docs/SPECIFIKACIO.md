# Specifikáció - Vampire Survivors Clone

## 📋 Áttekintés

### Projekt neve
**Vampire Survivors Clone** - Csoportmunka projekt

### Rövid leírás
Egy 2D top-down túlélő játék, ahol a játékos egy karaktert irányít, aki automatikusan támadja a körülötte lévő ellenségeket. A játék célja minél hosszabb ideig túlélni, miközben új képességeket szerzünk és kombinálunk különböző varázslatokat.

### Technológiai stack
- HTML5 Canvas API
- Vanilla JavaScript (ES6+)
- CSS3
- Cypress (tesztelés)

### Célközönség
- Játékkedvelők
- Casual gamers
- Rogue-like/survivor műfaj rajongók

---

## 🎮 Játékmechanika

### 1. Alapvető mozgás és vezérlés

#### Mozgás
- **WASD billentyűk:** Karakter mozgatása (fel/le/jobbra/balra)
- **Arrow keys (Nyilak):** Alternatív mozgás
- **Sebesség:** 200 egység/másodperc
- **Terület:** Végtelen játéktér (procedurálisan generált háttér)

#### Kamera
- Központi kamera követi a játékost
- Smooth követés (no lag)
- Viewport: 1200x700 pixel

#### Támadás
- **Automata célzás:** A legközelebbi ellenség felé
- **Lövedék típus:** Magic projectile
- **Tűzgyorsaság:** Configurable (SpellData.js)
- **Sérülés:** Szintfüggő (alapból 10, növekszik upgradeekkel)

---

### 2. Ellenség rendszer

#### Enemy spawning
- **Spawn időköz:** 1 másodperc
- **Spawn távolság:** 800 egység a játékostól
- **Spawn mód:** Véletlen irány (360°)

#### Enemy AI
- **Viselkedés:** Egyenes vonalban követi a játékost
- **Sebesség:** 50-150 egység/másodperc (típusfüggő)
- **Collision:** Sérülést okoz folyamatosan (ha hozzáér)

#### Enemy scaling (nehézség növekedés)
```javascript
// Életerő skálázás
baseHP = 100
timeMultiplier = 1 + floor(gameTime / 30) * 0.2
actualHP = baseHP * timeMultiplier

// Példa:
// 0-29 sec:  100 HP (x1.0)
// 30-59 sec: 120 HP (x1.2)
// 60-89 sec: 140 HP (x1.4)
```

```javascript
// Damage skálázás
baseDamage = 10
damageIncrease = floor(gameTime / 60) * 5
actualDamage = baseDamage + damageIncrease

// Példa:
// 0-59 sec: 10 damage
// 60-119 sec: 15 damage
// 120-179 sec: 20 damage
```

---

### 3. Varázslat rendszer (Spell System)

#### Spell kategóriák

##### 🎯 Projectile Spells (Lövedék varázslatok)
Lövedékeket lőnek ki a legközelebbi ellenség felé.

**Példák:**
- **Magic Spell:** Alapvető mágikus lövedék
- **Fire Spin:** Tüzes forgó lövedék
- **Blue Fire:** Kék lángos projektil
- **Ice Spike:** Jégcsap lövedék

**Tulajdonságok:**
- Projectile count (lövedékek száma)
- Damage (sérülés)
- Cooldown (újratöltési idő)
- Speed (lövedék sebesség)
- Lifetime (életidő)

##### 🌀 Orbital Spells (Keringő varázslatok)
A játékos körül keringenek és folyamatosan sérülést okoznak.

**Példák:**
- **Garlic:** Fokhagyma pajzs
- **Fire Orbital:** Tüzes keringők
- **Electric Shield:** Villám pajzs

**Tulajdonságok:**
- Orbital count (keringők száma)
- Orbital radius (keringési sugár)
- Orbital speed (keringési sebesség)
- Damage (sérülés érintkezéskor)

##### 💥 AOE Spells (Területi varázslatok)
Robbanások, amelyek nagy területen sebeznek.

**Példák:**
- **Chain Lightning:** Villámláncok
- **Dark Matter:** Sötét energia robbanás
- **Meteor:** Meteor becsapódás

**Tulajdonságok:**
- AOE radius (hatósugár)
- Damage (sérülés)
- Animation duration (animáció időtartam)
- Cooldown

##### 🔥 Static AOE Spells (Statikus zóna varázslatok)
Helyben maradó sérülés zónák.

**Példák:**
- **Whirlpool Fire:** Tűzörvény
- **Soul Explosion:** Lélek robbanás
- **Pumpkin Explosion:** Tök robbanás

**Tulajdonságok:**
- Zone duration (zóna időtartam)
- Zone radius (zóna sugár)
- Damage per tick (másodpercenkénti sérülés)
- Max zones (maximális zónák száma)

##### ☄️ Sky Fall Spells (Égből hulló varázslatok)
Véletlen helyekre meteor/projektil hullik.

**Példák:**
- **Meteor Jam:** Meteorraj
- **Random Lightning:** Véletlenszerű villámcsapások

**Tulajdonságok:**
- Meteor count (meteorok száma)
- Meteor radius (meteor méret)
- Damage (sérülés)
- Cast area (cast terület)

##### 🛡️ Shield Spells (Pajzs varázslatok)
Védő pajzsok, amelyek elnyelik a sérülést.

**Példák:**
- **Lightning Shield:** Villám pajzs
- **Pumpkin Shield:** Tök pajzs
- **Magic Shield:** Mágikus pajzs

**Tulajdonságok:**
- Shield health (pajzs életerő)
- Duration (időtartam)
- Radius (méret)
- Regeneration (újragenerálódás)

##### ⚔️ Melee Spells (Közelharc varázslatok)
Közeli távolságú támadások.

**Példák:**
- **Hammer Smash:** Kalapács csapás
- **Pumpkin Smash:** Tök csapás
- **Smash Hit:** Erős csapás

**Tulajdonságok:**
- Melee range (hatótáv)
- Damage (sérülés)
- Swing angle (csapás szög)
- Attack speed (támadási sebesség)

---

### 4. Progression rendszer

#### XP és szintlépés
```javascript
// XP formula
xpToNextLevel = 100 + (level * 50)

// Példa:
// Level 1 → 2: 150 XP
// Level 2 → 3: 200 XP
// Level 3 → 4: 250 XP
```

#### Szintlépéskor (Level Up)
1. Játék megáll (pause)
2. 3 upgrade opció jelenik meg:
   - **Új varázslat** (zöld)
   - **Varázslat upgrade** (narancs)
   - **Stat upgrade** (cyan)

#### Upgrade típusok

##### Új varázslat (New Spell)
- Új spell hozzáadása a készlethez
- Minden spell kezdő szinten indul (Level 1)
- Random választás az elérhető spellekből

##### Varázslat fejlesztés (Spell Upgrade)
- Meglévő spell szintjének növelése (max Level 8)
- Növeli a damage-t, csökkenti a cooldownt
- Egyes spelleknél több projektil/orbital

##### Stat fejlesztés (Stat Upgrade)
- **Max HP +20:** Maximális életerő növelés
- **HP Regen +5:** Életerő regenerálás
- **Move Speed +10%:** Mozgási sebesség növelés
- **Damage +10%:** Összes sérülés növelés
- **Cooldown -10%:** Spell cooldown csökkentés

---

### 5. Spell kombinációk (Synergies)

Bizonyos spell kombinációk új, erősebb spelleket hoznak létre.

#### Példa kombinációk:
```javascript
// Garlic (Lv3+) + Fire Orbital (Lv3+) = Fire Shield Ultimate
// Chain Lightning (Lv5+) + Electric Shield (Lv3+) = Thunder God
// Meteor (Lv4+) + Fire Spin (Lv4+) = Inferno Rain
```

---

### 6. Ultimate képességek

#### Aktiválás
- **Billentyűk:** 1, 2, 3, 4, 5
- **Feltétel:** Megfelelő spell kombináció

#### Ultimate típusok
- **Dash:** Space billentyű (gyors kitérés)
- **Fire Storm:** Hatalmas tűzvihar
- **Lightning Nova:** Villámrobbanás
- **Time Freeze:** Idő lelassítása
- **Black Hole:** Összes ellenség beszívása

---

### 7. Ütközésdetektálás (Collision Detection)

#### Hitbox rendszer
Minden entitásnak van AABB (Axis-Aligned Bounding Box) hitboxja.

```javascript
// Hitbox számítás
bounds = {
    x: entity.x,
    y: entity.y,
    width: entity.width,
    height: entity.height
}

// Collision check (AABB)
collision = rect1.x < rect2.x + rect2.width &&
            rect1.x + rect1.width > rect2.x &&
            rect1.y < rect2.y + rect2.height &&
            rect1.y + rect1.height > rect2.y
```

#### Collision típusok
1. **Player - Enemy:** Folyamatos sérülés
2. **Projectile - Enemy:** Egyszeri sérülés, projectile deaktiválódik
3. **Spell Effect - Enemy:** Sérülés spell típustól függően
4. **Orbital - Enemy:** Folyamatos sérülés érintkezéskor

---

### 8. Vizuális effektek

#### Sprite animációk
- **Player:** Idle, Walking animations
- **Enemy:** Walking, Death animations
- **Spells:** Cast, Impact, Loop animations
- **Damage Numbers:** Floating damage text with fade-out

#### Particle effects
- Robbanások
- Tűz effektek
- Villám effektek
- Ködök és füstök

#### UI elements
- Custom pixel font (sprite-based)
- Health bar
- XP bar
- Score display
- Level indicator

---

### 9. Hangeffektek (Sound Effects)

#### Game sounds
- **Attack sound:** Lövedék kilövés
- **Damage sound:** Ellenség találat
- **Death sound:** Játékos halál
- **Level up sound:** Szintlépés
- **Spell cast sounds:** Spell specifikus hangok

#### Sound management
- Volume control (0-1)
- Mute toggle
- Individual sound instances

---

### 10. Debug mód

#### Debug billentyűk
- **U:** Debug mode toggle
  - Hitboxok megjelenítése
  - Statisztikák kijelzése
  - FPS counter
  
- **L:** Instant level up
  - Azonnali szintlépés (XP telítése)
  
- **I:** Infinite HP toggle (debug only)
  - Végtelen életerő be/ki
  
- **H:** 2x Enemy HP (debug only)
  - Összes enemy HP megduplázása
  
- **K:** Instant death (debug only)
  - Azonnali halál (teszteléshez)
  
- **P:** Spell menu (debug only)
  - Összes spell lista
  - Manual spell add/remove

---

## 🎯 Győzelmi és vereség kondíciók

### Vereség (Game Over)
**Feltétel:** Player health ≤ 0

**Game Over Screen megjelenítése:**
```
GAME OVER

== STATISTICS ==
⏱ Survival Time: MM:SS
💀 Enemies Killed: XXX
⚔ Total Damage: XXXXX
⭐ Final Level: XX

Press R to Restart
```

### Győzelem
**Nincs hagyományos győzelem** - endless survival game.

**Célok:**
- Minél tovább túlélni
- Minél több ellenséget ölni
- Minél magasabb szintet elérni
- Különböző spell kombinációk kipróbálása

---

## 📊 Teljesítmény metrikák

### Tracking statisztikák
```javascript
stats = {
    survivalTime: seconds,
    enemiesKilled: count,
    damageDealt: totalDamage,
    finalLevel: playerLevel,
    spellsDiscovered: spellCount,
    maxCombo: highestCombo
}
```

### Leaderboard (jövőbeli funkció)
- Local storage high scores
- Online leaderboard (opcionális)

---

## 🔧 Technikai követelmények

### Browser kompatibilitás
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

### Performance követelmények
- **Target FPS:** 60 FPS
- **Min FPS:** 30 FPS
- **Max entities:** 200+ egyidejűleg

### Screen resolutions
- **Default:** 1200x700 canvas
- **Scalable:** CSS scaling nagyobb képernyőkhöz

---

## 🎨 Vizuális design

### Színpaletta
- **Primary:** Sötét háttér (#1a1a1a)
- **Player:** Világos karakterek (jól látható)
- **Enemies:** Piros/sötét tónusok
- **Spells:** Vibráns színek (kék, piros, zöld, lila)
- **UI:** Arany/fehér szöveg

### Art style
- Pixel art / sprite-based
- Fantasy theme
- Dark atmosphere
- Vibrant spell effects

---

## 📱 Jövőbeli funkciók (Future Plans)

### Phase 8 (opcionális)
- [ ] Több karakter választék
- [ ] Több enemy típus (boss enemies)
- [ ] Achievements (teljesítmények)
- [ ] Unlockable content
- [ ] Save/Load rendszer
- [ ] Options menu (settings)
- [ ] Touch controls (mobil support)
- [ ] Multiplayer (co-op mode)

---

## 📐 Műszaki specifikációk

### Fájl struktúra
```
vampire_clone_csoportmunka/
├── Core (Game loop, Entity system)
├── Spell System (7 spell típus)
├── Managers (Sound, Damage, Spell)
├── Assets (Sprites, Sounds)
└── Documentation
```

### Code standards
- ES6+ JavaScript
- Class-based OOP
- Modular structure (ES6 modules)
- Clear naming conventions
- Comments for complex logic

### Performance optimizations
- Object pooling (projectiles, enemies)
- Sprite caching
- Efficient collision detection
- RequestAnimationFrame loop
- Delta time calculations

---

## 🧪 Tesztelési követelmények

### Manual testing
- Gameplay testing (all mechanics)
- Performance testing (FPS drops)
- Browser compatibility testing
- Bug reporting

### Automated testing (Cypress)
- Game initialization
- Player movement
- Enemy spawning
- Collision detection
- Level up system
- Game over scenarios

---

## 📄 Dokumentáció követelmények

### Kötelező dokumentumok
- ✅ README.md (projekt leírás)
- ✅ UML.md (osztály diagramok)
- ✅ SPECIFIKACIO.md (ez a fájl)
- ✅ PROJEKTMENEDZSMENT.md (feladatok)
- ⏳ FEJLESZTOI_DOK.md (API dokumentáció)

### Kód dokumentáció
- JSDoc comments
- Inline comments
- Function descriptions

---

## 🔒 Biztonsági követelmények

### Input validation
- Keyboard input sanitization
- Boundary checks (player movement)

### Asset security
- Local assets (no external CDN dependencies)
- No user-generated content
- No network requests (offline game)

---

## ⚖️ Licenc és szerzői jog

**Projekt típus:** Oktatási projekt  
**Licence:** Internal use only  
**Asset credits:** Various sprite packs (free/educational use)  
**Sound credits:** Free sound effects from various sources  

---

## 📞 Support és karbantartás

### Bug reporting
- GitHub Issues
- Discord channel (#bugs)

### Feature requests
- GitHub Issues
- Discord channel (#ideas)

---

**Verzió:** 1.0.0  
**Utolsó frissítés:** 2026.05.26  
**Készítette:** Kevin, Marci, Tomi  
**Státusz:** ✅ Finalized

# Vampire Survivors Clone - Csoportmunka

## 📖 Leírás
> Ez a projekt egy **Vampire Survivors** stílusú játék, ahol a játékos egy karaktert irányít, aki automatikusan támadja a közelében lévő ellenségeket. A cél a minél hosszabb ideig való túlélés, miközben különböző varázslatok és képességek feloldásával egyre erősebbé válunk. A játék során gyűjtött tapasztalati pontokért szintléphetünk, és új fegyvereket, varázslatokat szerezhetünk.

## 👥 Feladatok felosztása

### **Tomi** - Ötletgazda & Egyszerűbb feladatok
* Adatfájlok szervezése (SpellData.js, adat.js készítése)
* README.md projekt leírás
* Asset szervezés és dokumentáció
* Egyszerű Cypress tesztek írása (útmutatóval)
* Játék tesztelés és hibák jelentése
* Ötletek dokumentálása új funkciókhoz
* HTML struktúra fejlesztése

### **Marci** - Művész & Vizuális vezető
* Sprite-ok szervezése és kezelése (Sprites/ mappa)
* CSS stílus tervezés és megvalósítás (index.html)
* Vizuális effektek implementálása
* DamageNumber.js - sérülés szám megjelenítés
* Background.js - háttér renderelés
* UI mockupok és drótvázak készítése
* Egyedi betűtípus sprite kezelés
* Halál képernyő grafikai tervezés

### **Kevin** - Programozás vezető & AI használat
* Játék logika core (Game.js, Player.js, Entity.js)
* Varázs rendszer implementálás (SpellManager.js, Spell.js)
* Spell típusok (ProjectileSpell, OrbitalSpell, AOESpell, stb.)
* Enemy.js - ellenség AI és mechanika
* Ütközésdetektálás optimalizálás
* Cypress teszt framework beállítása
* UML diagramok készítése (draw.io)
* Dokumentáció generálás AI eszközökkel
* Kód áttekintés és optimalizálás
* Duplikált kód eltávolítása
* SoundManager.js - hangrendszer

## 🎮 Osztályok

### 1. **Game** - Főjáték vezérlő
A játék fő vezérlője, amely:
- Inicializálja az összes játék objektumot
- Futtatja a fő játékhurkot (game loop)
- Kezeli a kamera pozíciót
- Ellenőrzi az ütközéseket
- Rendereli a játék elemeket
- Menedzseli a pontszámot és statisztikákat

### 2. **Entity** - Alaposztály entitásokhoz
Absztrakt alaposztály minden játék entitáshoz:
- Közös tulajdonságok (pozíció, méret, életerő)
- Alap metódusok (update, render, takeDamage)
- Sprite animáció kezelés
- Hitbox számítás

### 3. **Player** (extends Entity) - Játékos karakter
A játékos karaktert reprezentálja:
- Mozgás kezelés (WASD/Arrow keys)
- Tapasztalati pont (XP) és szintlépés rendszer
- Dash (kitérés) képesség
- Ultimate képességek aktiválása
- SpellManager integráció
- Input kezelés

### 4. **Enemy** (extends Entity) - Ellenség
Ellenség entitás:
- Játékos követés AI
- Életerő skálázás játékidő alapján
- Sérülés értékek
- Pont érték halál esetén
- Animációk

### 5. **SpellManager** - Varázslat kezelő
Központi varázslat menedzser:
- Új varázslatok hozzáadása
- Varázslatok szintléptetése
- Varázslat kombinációk kezelése
- Upgrade opciók generálása
- Ultimate és Dash képességek
- Aktív varázslatok listája

### 6. **Spell** - Varázslat alaposztály
Varázslatok alaposztálya:
- Cooldown kezelés
- Szintléptetés
- Cast (varázslás) logika
- Bázis tulajdonságok

### 7. **ProjectileSpell** (extends Spell) - Lövedék varázslat
Lövedéket kilövő varázslatok:
- Célkövetés legközelebbi ellenséghez
- Lövedék generálás
- SpellProjectile objektumok kezelése

### 8. **OrbitalSpell** (extends Spell) - Keringő varázslat
Játékos körül keringő objektumok:
- Orbital objektumok kezelése
- Keringési mozgás számítás
- Folyamatos sérülés kezelés

### 9. **AOESpell** (extends Spell) - Terület hatású varázslat
Area of Effect (terület hatás) varázslatok:
- Robbanás animáció
- Terület sérülés számítás
- Ellenségek detektálása hatótávolságon belül

### 10. **StaticAOESpell** (extends Spell) - Statikus terület varázslat
Helyben maradó sérülés zónák:
- Zone (zóna) objektumok kezelése
- Folyamatos sérülés alkalmazás
- Időzített zónák

### 11. **SkyFallSpell** (extends Spell) - Égből hulló varázslat
Véletlen helyekre hulló projektilok:
- Véletlen pozíció generálás
- Meteor/esés effekt
- Terület sérülés

### 12. **ShieldSpell** (extends Spell) - Pajzs varázslat
Védő pajzs a játékos körül:
- Sérülés elnyelés
- Pajzs életerő kezelés
- Vizuális pajzs renderelés

### 13. **MeleeSpell** (extends Spell) - Közelharc varázslat
Közeli távolságú támadások:
- Közelség ellenőrzés
- Közvetlen sérülés alkalmazás
- Swing (csapás) animáció

### 14. **Projectile** - Lövedék objektum
Egyszerű lövedékek (player attack):
- Mozgás cél felé
- Élettartam kezelés
- Ütközés detekció

### 15. **Background** - Háttér
Végtelen scroll-ozó háttér:
- Textúra renderelés
- Kamera offset kezelés
- Tiling (csempézés)

### 16. **SoundManager** - Hang kezelő
Játék hangeffektek:
- Hang betöltés
- Hang lejátszás (attack, damage, death, spells)
- Hangerő szabályozás
- Némítás

### 17. **DamageNumber** - Sérülés szám
Lebegő sérülés számok:
- Animált szöveg megjelenítés
- Kritikus találat jelzés
- Fade out effekt

### 18. **DamageNumberManager** - Sérülés szám kezelő
DamageNumber objektumok kezelése:
- Új sérülés számok hozzáadása
- Update és renderelés
- Lejárt számok eltávolítása

## 📊 UML Ábrák

### Osztály diagram
[UML ábra megtekintése](./UML.md)

A teljes UML diagram megtekinthető a `UML.md` fájlban, amely tartalmazza:
- Osztály hierarchia
- Öröklődési kapcsolatok
- Kompozíciós kapcsolatok
- Főbb metódusok és tulajdonságok

## 🎯 Projektmenedzsment

A projekt feladatok kezelése a [PROJEKTMENEDZSMENT.md](./PROJEKTMENEDZSMENT.md) fájlban található.

**Főbb mérföldkövek:**
1. ✅ Alapjáték mechanika (mozgás, lövés, ellenségek)
2. ✅ Varázs rendszer implementálás
3. ✅ Sprite animációk és vizuális effektek
4. 🔄 Dokumentáció és UML
5. ⏳ Cypress tesztek
6. ⏳ Kód tisztítás és optimalizálás

## 🛠️ Technológiák

- **HTML5 Canvas API** - Játék renderelés
- **Vanilla JavaScript (ES6+)** - Játék logika
- **CSS3** - Külső stylesheet (style.css)
- **ES6 Modules** - Modern module rendszer, dinamikus script betöltés
- **Cypress** - E2E tesztelés
- **Draw.io** - UML diagramok
- **Git & GitHub** - Verziókezelés

## 📁 Projekt struktúra

```
vampire_clone_csoportmunka/
├── index.html              # Főoldal (csak index.js betöltése)
├── style.css               # Külső CSS fájl (ÚJ!)
├── index.js                # Belépési pont (dinamikus script betöltés)
├── README.md               # Ez a fájl
├── UML.md                  # UML diagramok
├── SPECIFIKACIO.md         # Részletes specifikáció
├── PROJEKTMENEDZSMENT.md   # Feladatok és mérföldkövek
├── FEJLESZTOI_DOK.md       # Fejlesztői dokumentáció
│
├── Core Files/
│   ├── Game.js             # Játék fő vezérlő
│   ├── Entity.js           # Alaposztály
│   ├── Player.js           # Játékos
│   ├── Enemy.js            # Ellenség
│   ├── Projectile.js       # Lövedék
│   └── Background.js       # Háttér
│
├── Spell System/
│   ├── Spell.js            # Varázslat alaposztály
│   ├── SpellManager.js     # Varázs menedzser
│   ├── SpellData.js        # Varázslat adatok
│   └── SpellTypes/         # Varázslat típusok
│       ├── ProjectileSpell.js
│       ├── OrbitalSpell.js
│       ├── AOESpell.js
│       ├── StaticAOESpell.js
│       ├── SkyFallSpell.js
│       ├── ShieldSpell.js
│       └── MeleeSpell.js
│
├── Managers/
│   ├── SoundManager.js     # Hang kezelő
│   └── DamageNumber.js     # Sérülés szám rendszer
│
├── Sprites/                # Képek és sprite-ok
│   ├── enemies/
│   ├── Projectile 2/
│   └── ...
│
├── sound effects/          # Hangeffektek
│
└── cypress/                # E2E tesztek
    ├── e2e/
    └── support/
```

### 🎯 Új architektúra jellemzői:
- ✅ **Clean HTML**: Csak `style.css` és `index.js` betöltése
- ✅ **Szeparált CSS**: Minden stílus külön fájlban
- ✅ **Modern ES6**: Module pattern, dinamikus importok
- ✅ **Egyszerű entry point**: Egy fájl kezeli az egész betöltést

## 🎮 Játékmenet

### Irányítás
- **Mozgás:** WASD vagy Arrow keys
- **Támadás:** Automatikus (legközelebbi ellenség)
- **Ultimate:** 1-5 szám billentyűk (ha van feloldva)
- **Dash:** Space (kitérés)

### Debug módok
- **U:** Debug mód be/ki (hitbox-ok, statisztikák)
- **L:** Azonnali szintlépés
- **I:** Végtelen HP be/ki (debug módban)
- **H:** Ellenség HP dupázás (debug módban)
- **K:** Azonnali halál (debug módban)
- **P:** Varázslat menü (debug módban)

### Célok
- Minél tovább túlélni
- Ellenségek legyőzése XP-ért
- Szintlépés és új varázslatok szerzése
- Különböző varázs kombinációk felfedezése

## 🔬 Tesztelés

A projekt Cypress E2E teszteket használ. További információ a [Cypress dokumentációban](./cypress/README.md).

```bash
# Cypress futtatása
npm run cypress:open
```

## 🚀 Telepítés és futtatás

1. Klónozd a repositoryt:
```bash
git clone https://github.com/Boronen/vampire_clone_csoportmunka.git
cd vampire_clone_csoportmunka
```

2. Nyisd meg `index.html` fájlt böngészőben, vagy használj local servert:
```bash
# Python
python -m http.server 8000

# Node.js (http-server)
npx http-server
```

3. Játék indítása:
Nyisd meg böngészőben: `http://localhost:8000`

## 📝 Dokumentáció linkek

- [Részletes specifikáció](./SPECIFIKACIO.md)
- [Projektmenedzsment](./PROJEKTMENEDZSMENT.md)
- [Fejlesztői dokumentáció](./FEJLESZTOI_DOK.md)
- [UML diagramok](./UML.md)
- [Spell rendszer dokumentáció](./SPELL_SYSTEM.md)
- [Sprite analízis](./SPRITE_ANALYSIS.md)

## 🤝 Közreműködők

- **Kevin** - Programozás vezető, core logika, spell rendszer, AI
- **Marci** - Művész, sprite-ok, vizuális effektek, CSS
- **Tomi** - Ötletgazda, asset szervezés, tesztelés, dokumentáció

## 📄 Licenc

Ez a projekt oktatási célokat szolgál.

---

**Státusz:** 🔄 Aktív fejlesztés alatt

**Verzió:** 1.0.0

**Utolsó frissítés:** 2026.05.26

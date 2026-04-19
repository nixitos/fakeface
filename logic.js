(function() {
  'use strict';

  const DB = window.FAKING || {};

  function rand(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function randomDate(age) {
    const year = new Date().getFullYear() - age;
    const month = randInt(0, 11);
    const day = randInt(1, new Date(year, month + 1, 0).getDate());
    const d = new Date(year, month, day);
    return `${String(d.getDate()).padStart(2,'0')}.${String(d.getMonth()+1).padStart(2,'0')}.${d.getFullYear()}`;
  }

  function randomAddress() {
    const city = rand(DB.cities);
    const street = rand(DB.streets);
    const house = randInt(1, 120);
    const apt = randInt(1, 200);
    return `г. ${city}, ул. ${street}, д. ${house}, кв. ${apt}`;
  }

  function randomSchool() {
    return rand(DB.schools);
  }

  function generateRelatives(age) {
    const relatives = [];
    for (let rel of DB.relatives) {
      let status = 'жив(а)';
      if (Math.random() < rel.deadChance) status = 'умер(ла)';
      if (age > 50 && (rel.role === 'Мать' || rel.role === 'Отец') && Math.random() < 0.3) {
        status = 'умер(ла)';
      }
      relatives.push(`${rel.role}: ${status}`);
    }
    return relatives.join('; ');
  }

  function generateDisliked() {
    const count = randInt(1, 3);
    const set = new Set();
    for (let i=0; i<count; i++) {
      const surname = rand(DB.dislikedLast);
      const name = rand(DB.dislikedFirst);
      set.add(`${surname} ${name}`);
    }
    return Array.from(set).join(', ');
  }

  function generateInjuries() {
    if (Math.random() < 0.35) return '—';
    const count = randInt(1, 3);
    const picked = [];
    for (let i=0; i<count; i++) picked.push(rand(DB.injuries));
    return [...new Set(picked)].join('; ');
  }

  function generateHobby() {
    const primary = rand(DB.hobbies);
    if (Math.random() > 0.6) {
      const second = rand(DB.hobbies.filter(h => h !== primary));
      return `${primary}, ${second}`;
    }
    return primary;
  }

  function generateFoodPair() {
    return {
      loved: rand(DB.lovedFoods),
      hated: rand(DB.hatedFoods)
    };
  }

  function generateIntimate(age) {
    if (age < 18) return 'не применимо';
    return rand(DB.intimateStatus);
  }

  function generateQuirk() {
    return rand(DB.quirks);
  }

  function generateFear() {
    return rand(DB.fears);
  }

  function generateDream() {
    return rand(DB.dreams);
  }

  function generateProfile(age, gender, childrenCount) {
    const isMale = (gender === 'male');
    const firstName = rand(isMale ? DB.maleNames : DB.femaleNames);
    const lastName = rand(isMale ? DB.maleSurnames : DB.femaleSurnames);
    const patronymic = rand(isMale ? DB.malePatronymics : DB.femalePatronymics);
    
    const birthDate = randomDate(age);
    const address = randomAddress();
    const school = randomSchool() + (age < 18 ? ' (учится)' : ' (закончил)');
    const relatives = generateRelatives(age);
    const disliked = generateDisliked();
    const food = generateFoodPair();
    const hobby = generateHobby();
    const injuries = generateInjuries();
    const intimate = generateIntimate(age);
    const quirk = generateQuirk();
    const fear = generateFear();
    const dream = generateDream();
    const bloodType = rand(DB.bloodTypes);
    const zodiac = rand(DB.zodiacSigns);
    const pets = Math.random() > 0.5 ? rand(DB.pets) : 'нет';
    const music = rand(DB.musicGenres);
    const favColor = rand(DB.colors);
    
    return {
      age, gender: isMale ? 'Мужской' : 'Женский', genderShort: isMale ? 'M' : 'Ж',
      firstName, lastName, patronymic,
      birthDate, address, school,
      relatives,
      disliked,
      lovedFood: food.loved, hatedFood: food.hated,
      hobby,
      injuries,
      intimate,
      childrenCount,
      quirk, fear, dream,
      bloodType, zodiac, pets, music, favColor
    };
  }

  function renderProfile(p) {
    const stamp = document.getElementById('genderStamp');
    stamp.textContent = p.genderShort;

    const childrenStr = (p.age <= 17) ? '0 (возраст ≤17)' : (p.childrenCount === 0 ? 'нет' : p.childrenCount);
//таблица феккового еблица
    const html = `
      <table class="profile-table">
        <tr><td class="label">Фамилия Имя Отчество</td><td class="value">${p.lastName} ${p.firstName} ${p.patronymic}</td></tr>
        <tr><td class="label">Дата рождения / возраст</td><td class="value">${p.birthDate} (${p.age} лет)</td></tr>
        <tr><td class="label">Адрес</td><td class="value">${p.address}</td></tr>
        <tr><td class="label">Школа</td><td class="value">${p.school}</td></tr>
        <tr><td class="label">Родственники</td><td class="value">${p.relatives}</td></tr>
        <tr><td class="label">Не любимые люди</td><td class="value">${p.disliked}</td></tr>
        <tr><td class="label">Еда (любит / не любит)</td><td class="value">${p.lovedFood} / ${p.hatedFood}</td></tr>
        <tr><td class="label">Хобби</td><td class="value">${p.hobby}</td></tr>
        <tr><td class="label">Травмы / болезни</td><td class="value">${p.injuries}</td></tr>
        <tr><td class="label">Дети</td><td class="value">${childrenStr}</td></tr>
        <tr><td class="label">Интимная информация</td><td class="value">${p.intimate}</td></tr>
        <tr><td class="label">Привычка / особенность</td><td class="value">${p.quirk}</td></tr>
        <tr><td class="label">Страх</td><td class="value">${p.fear}</td></tr>
        <tr><td class="label">Мечта</td><td class="value">${p.dream}</td></tr>
        <tr><td class="label">Группа крови</td><td class="value">${p.bloodType}</td></tr>
        <tr><td class="label">Знак зодиака</td><td class="value">${p.zodiac}</td></tr>
        <tr><td class="label">Домашние животные</td><td class="value">${p.pets}</td></tr>
        <tr><td class="label">Любимая музыка</td><td class="value">${p.music}</td></tr>
        <tr><td class="label">Любимый цвет</td><td class="value">${p.favColor}</td></tr>
      </table>
      <div style="margin-top:12px; font-size:12px; color:#553377; border-top:1px solid #bb99dd; padding-top:8px;">
        [ID: FACE-${String(p.age).padStart(3,'0')}-${p.firstName.charAt(0)}${p.lastName.charAt(0)}] 
        сгенерировано ${new Date().toLocaleTimeString()}
      </div>
    `;
    document.getElementById('profileContent').innerHTML = html;
  }

  function onGenerate() {
    const ageInput = document.getElementById('ageInput');
    const genderSelect = document.getElementById('genderSelect');
    const childrenInput = document.getElementById('childrenInput');
    const hint = document.getElementById('childrenHint');

    let age = parseInt(ageInput.value, 10);
    if (isNaN(age) || age < 0) age = 29;
    if (age > 120) age = 120;
    ageInput.value = age;

    let children = parseInt(childrenInput.value, 10);
    if (isNaN(children) || children < 0) children = 0;
    if (age <= 17) {
      children = 0;
      hint.textContent = '(<=17)';
    } else {
      hint.textContent = '';
    }
    childrenInput.value = children;

    const gender = genderSelect.value;
    const profile = generateProfile(age, gender, children);
    renderProfile(profile);
  }

  function syncHint() {
    const ageInput = document.getElementById('ageInput');
    const childrenInput = document.getElementById('childrenInput');
    const hint = document.getElementById('childrenHint');
    const age = parseInt(ageInput.value, 10);
    if (!isNaN(age) && age <= 17) {
      childrenInput.value = 0;
      hint.textContent = '(<=17)';
    } else {
      hint.textContent = '';
    }
  }

  window.addEventListener('DOMContentLoaded', function() {
    document.getElementById('generateBtn').addEventListener('click', onGenerate);
    document.getElementById('ageInput').addEventListener('input', syncHint);
    document.getElementById('childrenInput').addEventListener('input', function() {
      const age = parseInt(document.getElementById('ageInput').value, 10);
      if (!isNaN(age) && age <= 17) {
        this.value = 0;
      }
      syncHint();
    });
    syncHint();
    onGenerate(); // тест блять
  });

})();
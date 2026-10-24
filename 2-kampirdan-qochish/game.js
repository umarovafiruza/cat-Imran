/**
 * ===================================================================
 * QOCH, BOLAKAY! 3D (ASABIY KAMPIRDAN QOCHISH)
 * Texnologiya: Three.js (WebGL), Web Audio API, Web Speech API
 * Mavzu: Yomg'irli shahar ko'chasi, asabiy kampir va maktab bolasi
 * ===================================================================
 */

// ==========================================
// 1. OVOZ VA NUTQ TIZIMI (AUDIO & SPEECH)
// ==========================================
class SoundController {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.initialized = false;

        // Yomg'ir sadosi (Rain Ambient generator)
        this.rainSource = null;
        this.rainGain = null;

        // Speech synthesis sozlamalari
        this.hasSpeech = 'speechSynthesis' in window;
        this.lastGrandmaVoiceTime = 0;
        this.lastBoyVoiceTime = 0;
    }

    init() {
        if (!this.initialized) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.initialized = true;
                this.startRainAmbient();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // Doimiy yomg'ir shovqini (Procedural Pink Noise)
    startRainAmbient() {
        if (!this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 2;
            const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const data = buffer.getChannelData(0);
            let b0 = 0, b1 = 0, b2 = 0;
            for (let i = 0; i < bufferSize; i++) {
                const white = Math.random() * 2 - 1;
                b0 = 0.99 * b0 + white * 0.05;
                b1 = 0.95 * b1 + white * 0.1;
                b2 = 0.85 * b2 + white * 0.2;
                data[i] = (b0 + b1 + b2) * 0.15;
            }

            this.rainSource = this.ctx.createBufferSource();
            this.rainSource.buffer = buffer;
            this.rainSource.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

            this.rainGain = this.ctx.createGain();
            this.rainGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

            this.rainSource.connect(filter);
            filter.connect(this.rainGain);
            this.rainGain.connect(this.ctx.destination);

            this.rainSource.start();
        } catch (e) {
            console.warn("Rain audio init error", e);
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.rainGain && this.ctx) {
            this.rainGain.gain.setValueAtTime(this.muted ? 0 : 0.08, this.ctx.currentTime);
        }
        return this.muted;
    }

    // Kampirning ovozi: "Qo'limga tushsang bormi!"
    speakGrandma() {
        const now = Date.now();
        if (now - this.lastGrandmaVoiceTime < 4500) return; // Tez-tez takrorlanmasligi uchun
        this.lastGrandmaVoiceTime = now;

        const phrases = [
            "Qo'limga tushsang bormi!",
            "To'xta dedim senga!",
            "Hassam bilan bir savalay!",
            "Qani bu yoqqa kel!",
            "Qochma dedim!"
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];

        // UI Bubbleni ko'rsatish
        this.showBubble("voice-bubble-grandma", `👵 "${phrase}"`);

        // Nutq sintezi
        if (!this.muted && this.hasSpeech) {
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(phrase);
                utter.rate = 0.95;
                utter.pitch = 0.7; // Kampir ovozini sal yo'g'on va qariroq qilish
                window.speechSynthesis.speak(utter);
            } catch (e) {}
        }

        // Sintetik zaxira baqiriq tovushi
        this.playGrandmaShoutSynth();
    }

    // Bolaning ovozi: "Aaaa! Yordam bering!"
    speakBoy() {
        const now = Date.now();
        if (now - this.lastBoyVoiceTime < 3500) return;
        this.lastBoyVoiceTime = now;

        const phrases = [
            "Aaaa! Qochyappan!",
            "Aaaa! Yordam bering!",
            "Voydod, kampir quvlayapti!",
            "Aaaa!"
        ];
        const phrase = phrases[Math.floor(Math.random() * phrases.length)];

        this.showBubble("voice-bubble-boy", `😱 "${phrase}"`);

        if (!this.muted && this.hasSpeech) {
            try {
                const utter = new SpeechSynthesisUtterance(phrase);
                utter.rate = 1.35;
                utter.pitch = 1.6; // Bola ovozini ingichka va tez qilish
                window.speechSynthesis.speak(utter);
            } catch (e) {}
        }

        this.playBoyScreamSynth();
    }

    showBubble(elementId, text) {
        const el = document.getElementById(elementId);
        if (el) {
            el.textContent = text;
            el.classList.remove("hidden");
            clearTimeout(el._hideTimer);
            el._hideTimer = setTimeout(() => {
                el.classList.add("hidden");
            }, 2600);
        }
    }

    // Bola qichqirig'i (Web Audio Synth)
    playBoyScreamSynth() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.linearRampToValueAtTime(800, now + 0.15);
        osc.frequency.linearRampToValueAtTime(350, now + 0.4);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    // Kampir baqirig'i tovushi
    playGrandmaShoutSynth() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(260, now + 0.2);
        osc.frequency.linearRampToValueAtTime(130, now + 0.45);

        gain.gain.setValueAtTime(0.28, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.45);
    }

    // Sakrash tovushi (Jump Whoosh)
    playJump() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(560, now + 0.15);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Sirg'alish (Slide Swoosh)
    playSlide() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(90, now + 0.22);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    // Ko'lmakka tushgandagi sachrash (Puddle Splash)
    playSplash() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(280, now);
        osc.frequency.exponentialRampToValueAtTime(80, now + 0.16);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.16);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.16);
    }

    // To'qnashuv / Zarba (Hit obstacle)
    playHit() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }

    // Momaqaldiroq (Thunder Rumble)
    playThunder() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(80, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 1.2);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 1.2);
    }

    // G'alaba qutlovi (Victory fanfare)
    playVictory() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.12;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.35);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.35);
        });
    }
}

// ==========================================
// 2. 3D MODELLAR FABRIKASI (LOW-POLY CARTOON)
// ==========================================
const ModelFactory = {
    // 1. Maktab Bolasi (3D Schoolboy with Backpack)
    createBoy() {
        const group = new THREE.Group();

        const skinMat = new THREE.MeshLambertMaterial({ color: 0xffd1a4 });
        const shirtMat = new THREE.MeshLambertMaterial({ color: 0x3b82f6 }); // Moviy maktab ko'ylagi
        const pantsMat = new THREE.MeshLambertMaterial({ color: 0x1e293b }); // Qora shim
        const shoeMat = new THREE.MeshLambertMaterial({ color: 0xef4444 }); // Qizil krossovka
        const hairMat = new THREE.MeshLambertMaterial({ color: 0x4a2810 });
        const bagMat = new THREE.MeshLambertMaterial({ color: 0xf59e0b }); // Sariq maktab sumkasi

        // Tana (Torso)
        const torsoGeo = new THREE.BoxGeometry(0.7, 0.9, 0.45);
        const torso = new THREE.Mesh(torsoGeo, shirtMat);
        torso.position.y = 1.35;
        group.add(torso);

        // Maktab Sumkasi (Backpack orqada)
        const bagGeo = new THREE.BoxGeometry(0.6, 0.75, 0.35);
        const bag = new THREE.Mesh(bagGeo, bagMat);
        bag.position.set(0, 1.35, -0.35);
        group.add(bag);

        // Bosh
        const headGeo = new THREE.BoxGeometry(0.55, 0.55, 0.5);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.set(0, 2.05, 0);
        group.add(head);

        // Soch / Kepka
        const hairGeo = new THREE.BoxGeometry(0.58, 0.22, 0.54);
        const hair = new THREE.Mesh(hairGeo, hairMat);
        hair.position.set(0, 2.32, 0);
        group.add(hair);

        // Ko'zlar
        const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
        const eyeGeo = new THREE.BoxGeometry(0.08, 0.08, 0.05);
        const eyeL = new THREE.Mesh(eyeGeo, eyeMat);
        eyeL.position.set(-0.16, 2.08, 0.26);
        group.add(eyeL);

        const eyeR = eyeL.clone();
        eyeR.position.x = 0.16;
        group.add(eyeR);

        // Oyoqlar (Legs)
        const legGeo = new THREE.BoxGeometry(0.24, 0.75, 0.26);

        const legL = new THREE.Mesh(legGeo, pantsMat);
        legL.position.set(-0.2, 0.5, 0);
        group.add(legL);

        const legR = new THREE.Mesh(legGeo, pantsMat);
        legR.position.set(0.2, 0.5, 0);
        group.add(legR);

        // Oyoq kiyimlari
        const shoeGeo = new THREE.BoxGeometry(0.26, 0.18, 0.4);
        const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
        shoeL.position.set(-0.2, 0.1, 0.08);
        group.add(shoeL);

        const shoeR = new THREE.Mesh(shoeGeo, shoeMat);
        shoeR.position.set(0.2, 0.1, 0.08);
        group.add(shoeR);

        // Qo'llar (Arms)
        const armGeo = new THREE.BoxGeometry(0.2, 0.7, 0.2);
        const armL = new THREE.Mesh(armGeo, shirtMat);
        armL.position.set(-0.48, 1.35, 0);
        group.add(armL);

        const armR = new THREE.Mesh(armGeo, shirtMat);
        armR.position.set(0.48, 1.35, 0);
        group.add(armR);

        // Yerga tushuvchi soya (Fake shadow)
        const shadowGeo = new THREE.CircleGeometry(0.55, 12);
        const shadowMat = new THREE.MeshBasicMaterial({
            color: 0x000000,
            transparent: true,
            opacity: 0.4
        });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.03;
        group.add(shadow);

        return {
            group,
            legL, legR,
            shoeL, shoeR,
            armL, armR,
            torso, head, bag,
            shadow
        };
    },

    // 2. Asabiy Kampir va Hassa (Angry Grandma with Cane)
    createGrandma() {
        const group = new THREE.Group();

        const skinMat = new THREE.MeshLambertMaterial({ color: 0xfbd0b0 });
        const dressMat = new THREE.MeshLambertMaterial({ color: 0x8b5cf6 }); // Binafsha xalat
        const apronMat = new THREE.MeshLambertMaterial({ color: 0xffffff }); // Oq fartuk
        const hairMat = new THREE.MeshLambertMaterial({ color: 0xd1d5db }); // Oqargan soch
        const caneMat = new THREE.MeshLambertMaterial({ color: 0x78350f }); // Yog'och hassa

        // Bukchaygan tana (Hunched body)
        const bodyGeo = new THREE.BoxGeometry(0.85, 1.0, 0.6);
        const body = new THREE.Mesh(bodyGeo, dressMat);
        body.position.set(0, 1.25, 0);
        body.rotation.x = 0.2; // Oldinga egilgan
        group.add(body);

        // Fartuk
        const apronGeo = new THREE.BoxGeometry(0.65, 0.75, 0.05);
        const apron = new THREE.Mesh(apronGeo, apronMat);
        apron.position.set(0, 1.2, 0.32);
        apron.rotation.x = 0.2;
        group.add(apron);

        // Bosh va Ro'mol / Oq soch
        const headGeo = new THREE.BoxGeometry(0.6, 0.6, 0.55);
        const head = new THREE.Mesh(headGeo, skinMat);
        head.position.set(0, 1.95, 0.15);
        group.add(head);

        const bunGeo = new THREE.SphereGeometry(0.24, 8, 8);
        const bun = new THREE.Mesh(bunGeo, hairMat);
        bun.position.set(0, 2.2, -0.15);
        group.add(bun);

        // Ko'zoynak (Glasses)
        const glassMat = new THREE.MeshBasicMaterial({ color: 0x111827 });
        const glassGeo = new THREE.BoxGeometry(0.5, 0.12, 0.08);
        const glasses = new THREE.Mesh(glassGeo, glassMat);
        glasses.position.set(0, 2.0, 0.44);
        group.add(glasses);

        // Qo'llar va Yog'och Hassa (Walking Cane)
        const armGeo = new THREE.BoxGeometry(0.22, 0.65, 0.22);
        const armL = new THREE.Mesh(armGeo, dressMat);
        armL.position.set(-0.55, 1.3, 0.1);
        group.add(armL);

        // Hassa ushlagan o'ng qo'l (Yuqoriga ko'tarilgan)
        const caneArmGroup = new THREE.Group();
        caneArmGroup.position.set(0.55, 1.6, 0);

        const armR = new THREE.Mesh(armGeo, dressMat);
        armR.position.y = -0.3;
        caneArmGroup.add(armR);

        // Yog'och Hassa modeli
        const caneStickGeo = new THREE.CylinderGeometry(0.04, 0.05, 1.3, 8);
        const caneStick = new THREE.Mesh(caneStickGeo, caneMat);
        caneStick.position.set(0, 0.2, 0.3);
        caneStick.rotation.x = Math.PI / 4;
        caneArmGroup.add(caneStick);

        // Hassa dumi / tutqichi
        const caneHandleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.25, 6);
        const caneHandle = new THREE.Mesh(caneHandleGeo, caneMat);
        caneHandle.rotation.z = Math.PI / 2;
        caneHandle.position.set(0, 0.7, 0.7);
        caneArmGroup.add(caneHandle);

        group.add(caneArmGroup);

        // Oyoqlar
        const legGeo = new THREE.BoxGeometry(0.28, 0.65, 0.3);
        const legMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
        const legL = new THREE.Mesh(legGeo, legMat);
        legL.position.set(-0.24, 0.4, 0);
        group.add(legL);

        const legR = new THREE.Mesh(legGeo, legMat);
        legR.position.set(0.24, 0.4, 0);
        group.add(legR);

        // Soya
        const shadowGeo = new THREE.CircleGeometry(0.7, 12);
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.45 });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.03;
        group.add(shadow);

        return {
            group,
            armL, caneArmGroup,
            legL, legR,
            shadow
        };
    },

    // 3. To'siqlar: Yog'och to'siq (Fence), Axlat qutisi (Bin), Osilgan kiyimlar (Slide under)
    createObstacle(type = 'fence', laneX = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(laneX, 0, z);

        let height = 1.0;
        let requiresSlide = false;
        let requiresJump = true;

        if (type === 'fence') {
            // Sakrab o'tish kerak bo'lgan yo'l to'sig'i
            const postMat = new THREE.MeshLambertMaterial({ color: 0xd97706 });
            const railMat = new THREE.MeshLambertMaterial({ color: 0xffffff });

            const postGeo = new THREE.BoxGeometry(0.18, 1.2, 0.18);
            const p1 = new THREE.Mesh(postGeo, postMat);
            p1.position.set(-0.9, 0.6, 0);
            const p2 = new THREE.Mesh(postGeo, postMat);
            p2.position.set(0.9, 0.6, 0);
            group.add(p1, p2);

            const railGeo = new THREE.BoxGeometry(2.1, 0.28, 0.08);
            const r1 = new THREE.Mesh(railGeo, railMat);
            r1.position.set(0, 0.85, 0);
            const r2 = new THREE.Mesh(railGeo, railMat);
            r2.position.set(0, 0.45, 0);
            group.add(r1, r2);

            height = 1.1;
            requiresJump = true;
        } else if (type === 'trashcan') {
            // Metall axlat qutisi
            const binMat = new THREE.MeshLambertMaterial({ color: 0x64748b });
            const binGeo = new THREE.CylinderGeometry(0.55, 0.48, 1.1, 10);
            const bin = new THREE.Mesh(binGeo, binMat);
            bin.position.y = 0.55;
            group.add(bin);

            height = 1.1;
            requiresJump = true;
        } else if (type === 'clothesline') {
            // Tagidan sirg'alib (Slide) o'tish kerak bo'lgan osilgan kiyimlar
            const poleMat = new THREE.MeshLambertMaterial({ color: 0x475569 });
            const poleGeo = new THREE.CylinderGeometry(0.08, 0.08, 2.5, 6);
            const p1 = new THREE.Mesh(poleGeo, poleMat);
            p1.position.set(-1.1, 1.25, 0);
            const p2 = new THREE.Mesh(poleGeo, poleMat);
            p2.position.set(1.1, 1.25, 0);
            group.add(p1, p2);

            // Arqon
            const ropeGeo = new THREE.BoxGeometry(2.2, 0.04, 0.04);
            const rope = new THREE.Mesh(ropeGeo, poleMat);
            rope.position.set(0, 2.1, 0);
            group.add(rope);

            // Osilgan kiyimlar
            const clothMat = new THREE.MeshLambertMaterial({ color: 0xef4444 });
            const clothGeo = new THREE.BoxGeometry(1.6, 0.9, 0.05);
            const cloth = new THREE.Mesh(clothGeo, clothMat);
            cloth.position.set(0, 1.6, 0);
            group.add(cloth);

            height = 2.2;
            requiresSlide = true;
            requiresJump = false;
        } else if (type === 'puddle') {
            // Suvli ko'lmak (Sekinlashtiradi)
            const puddleGeo = new THREE.CircleGeometry(1.0, 12);
            const puddleMat = new THREE.MeshBasicMaterial({
                color: 0x38bdf8,
                transparent: true,
                opacity: 0.65
            });
            const puddle = new THREE.Mesh(puddleGeo, puddleMat);
            puddle.rotation.x = -Math.PI / 2;
            puddle.position.y = 0.02;
            group.add(puddle);

            height = 0.2;
            requiresJump = true;
        }

        return {
            group,
            type,
            laneX,
            z,
            height,
            requiresJump,
            requiresSlide,
            passed: false
        };
    },

    // 4. Ko'cha Chiroqlari (Streetlamps with Warm Light)
    createStreetLamp(x = 0, z = 0) {
        const group = new THREE.Group();
        group.position.set(x, 0, z);

        const poleMat = new THREE.MeshLambertMaterial({ color: 0x1e293b });
        const lampMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });

        const poleGeo = new THREE.CylinderGeometry(0.12, 0.16, 6, 8);
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 3;
        group.add(pole);

        const armGeo = new THREE.CylinderGeometry(0.08, 0.08, 1.4, 6);
        const arm = new THREE.Mesh(armGeo, poleMat);
        arm.position.set(x > 0 ? -0.6 : 0.6, 5.8, 0);
        arm.rotation.z = x > 0 ? Math.PI / 3 : -Math.PI / 3;
        group.add(arm);

        const bulbGeo = new THREE.SphereGeometry(0.3, 8, 8);
        const bulb = new THREE.Mesh(bulbGeo, lampMat);
        bulb.position.set(x > 0 ? -1.1 : 1.1, 5.4, 0);
        group.add(bulb);

        // Yorug'lik nuri
        const light = new THREE.PointLight(0xffedd5, 1.2, 14);
        light.position.set(x > 0 ? -1.1 : 1.1, 5.2, 0);
        group.add(light);

        return group;
    },

    // 5. Uy (Marradagi Bolaning Xavfsiz Uyi)
    createHome(z = 420) {
        const group = new THREE.Group();
        group.position.set(0, 0, z);

        const wallMat = new THREE.MeshLambertMaterial({ color: 0xb45309 }); // G'isht devor
        const roofMat = new THREE.MeshLambertMaterial({ color: 0x991b1b }); // Qizil tom
        const doorMat = new THREE.MeshLambertMaterial({ color: 0x78350f }); // Yog'och eshik
        const winMat = new THREE.MeshBasicMaterial({ color: 0xfef08a }); // Issiq chiroqli deraza

        // Uy korpusi
        const houseGeo = new THREE.BoxGeometry(10, 6, 8);
        const house = new THREE.Mesh(houseGeo, wallMat);
        house.position.set(0, 3, 4);
        group.add(house);

        // Tom
        const roofGeo = new THREE.ConeGeometry(8, 3.5, 4);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(0, 7.5, 4);
        roof.rotation.y = Math.PI / 4;
        group.add(roof);

        // Ochiq kutib turgan eshik
        const doorGeo = new THREE.BoxGeometry(1.8, 3.2, 0.2);
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 1.6, 0.05);
        group.add(door);

        // Derazalar
        const winGeo = new THREE.BoxGeometry(1.4, 1.4, 0.1);
        const winL = new THREE.Mesh(winGeo, winMat);
        winL.position.set(-2.8, 3.2, 0.05);
        group.add(winL);

        const winR = winL.clone();
        winR.position.x = 2.8;
        group.add(winR);

        // Kirishdagi yoqimli chiroq
        const porchLight = new THREE.PointLight(0xffbe0b, 2.0, 16);
        porchLight.position.set(0, 3.8, -0.8);
        group.add(porchLight);

        // "MENING UYIM" yozuvli taxtacha
        const signGeo = new THREE.BoxGeometry(3.5, 0.8, 0.1);
        const signMat = new THREE.MeshLambertMaterial({ color: 0xfef3c7 });
        const sign = new THREE.Mesh(signGeo, signMat);
        sign.position.set(0, 4.4, 0.1);
        group.add(sign);

        return {
            group,
            z
        };
    }
};

// ==========================================
// 3. ASOSIY O'YIN BOSHQARUVI (GAME ENGINE)
// ==========================================
class EscapeGameEngine {
    constructor() {
        this.container = document.getElementById("webgl-container");
        this.sound = new SoundController();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // O'yin parametrlari
        this.state = "MENU"; // MENU, PLAYING, PAUSED, VICTORY, GAMEOVER
        this.lives = 3;
        this.totalDistance = 400; // 400 metr
        this.distanceCovered = 0;
        this.startTime = 0;
        this.elapsedTime = 0;

        // 3D Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, this.width / this.height, 0.4, 450);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        this.renderer.setClearColor(0x111827);
        this.container.appendChild(this.renderer.domElement);

        // Yomg'irli qorong'u shahar tumanligi
        this.scene.fog = new THREE.FogExp2(0x1a2238, 0.016);

        // Yorug'lik
        this.ambientLight = new THREE.AmbientLight(0x384259, 0.6);
        this.scene.add(this.ambientLight);

        this.moonLight = new THREE.DirectionalLight(0x708090, 0.45);
        this.moonLight.position.set(-20, 40, -10);
        this.scene.add(this.moonLight);

        // 3 ta qator koordinatalari (Lanes)
        this.lanes = [-2.4, 0, 2.4];
        this.currentLane = 1; // Markaziy qator (0 = chap, 1 = o'rta, 2 = o'ng)

        // Bola Fizikasi
        this.boyData = {
            x: 0,
            y: 0,
            z: 0,
            targetX: 0,
            vy: 0,
            speed: 0.28,
            baseSpeed: 0.28,
            maxSpeed: 0.42,
            isJumping: false,
            isSliding: false,
            slideTimer: 0,
            runCycle: 0,
            stumbleTimer: 0
        };

        // Kampir Fizikasi
        this.grandmaData = {
            x: 0,
            y: 0,
            z: -14, // Bolaning 14 metr orqasidan boshlaydi
            distanceBehind: 14,
            speed: 0.27,
            runCycle: 0
        };

        // Qahramonlar modellari
        this.boy = ModelFactory.createBoy();
        this.scene.add(this.boy.group);

        this.grandma = ModelFactory.createGrandma();
        this.scene.add(this.grandma.group);

        // Yomg'irli ko'cha, to'siqlar va uya
        this.roadLength = 460;
        this.obstacles = [];
        this.initRoad();
        this.initRainDrops();
        this.home = ModelFactory.createHome(410);
        this.scene.add(this.home.group);

        // Klaviatura
        this.keys = { left: false, right: false, jump: false, slide: false, boost: false };

        // FPS hisoblash
        this.fps = 60;
        this.frames = 0;
        this.lastFpsUpdate = performance.now();

        this.initDOMElements();
        this.bindEvents();
        this.resetGame();

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    // 1. Asfalt Yo'l va Shahar Ko'chasi
    initRoad() {
        // Nam asfalt qoplamasi
        const roadGeo = new THREE.PlaneGeometry(9.0, this.roadLength, 1, 100);
        const roadMat = new THREE.MeshLambertMaterial({ color: 0x1e272e });
        this.road = new THREE.Mesh(roadGeo, roadMat);
        this.road.rotation.x = -Math.PI / 2;
        this.road.position.set(0, 0, this.roadLength / 2 - 20);
        this.scene.add(this.road);

        // Oq chiziqlar (Lanes marking)
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.5 });
        for (let z = 0; z < this.roadLength; z += 6) {
            const lineGeo = new THREE.PlaneGeometry(0.15, 3.0);
            const l1 = new THREE.Mesh(lineGeo, lineMat);
            l1.rotation.x = -Math.PI / 2;
            l1.position.set(-1.2, 0.02, z);
            this.scene.add(l1);

            const l2 = l1.clone();
            l2.position.x = 1.2;
            this.scene.add(l2);
        }

        // Yo'l chetidagi xiyobon / maysazor
        const sidewalkGeo = new THREE.PlaneGeometry(8, this.roadLength);
        const sidewalkMat = new THREE.MeshLambertMaterial({ color: 0x334155 });
        const swLeft = new THREE.Mesh(sidewalkGeo, sidewalkMat);
        swLeft.rotation.x = -Math.PI / 2;
        swLeft.position.set(-8.5, 0.05, this.roadLength / 2 - 20);
        this.scene.add(swLeft);

        const swRight = swLeft.clone();
        swRight.position.x = 8.5;
        this.scene.add(swRight);

        // Ko'cha chiroqlari (Streetlamps)
        for (let z = 15; z < this.roadLength - 20; z += 35) {
            const lampL = ModelFactory.createStreetLamp(-5.2, z);
            this.scene.add(lampL);

            const lampR = ModelFactory.createStreetLamp(5.2, z + 17);
            this.scene.add(lampR);
        }

        // To'siqlarni tasodifiy joylashtirish
        const types = ['fence', 'trashcan', 'puddle', 'clothesline'];
        for (let z = 25; z < 390; z += 14 + Math.random() * 8) {
            const laneIndex = Math.floor(Math.random() * 3);
            const laneX = this.lanes[laneIndex];
            const type = types[Math.floor(Math.random() * types.length)];
            const obs = ModelFactory.createObstacle(type, laneX, z);
            this.scene.add(obs.group);
            this.obstacles.push(obs);
        }
    }

    // 2. 3D Yomg'ir Tomchilari (Falling Rain 3D Mesh)
    initRainDrops() {
        const dropCount = 450;
        const positions = [];
        for (let i = 0; i < dropCount; i++) {
            positions.push(
                (Math.random() - 0.5) * 35,
                Math.random() * 22,
                (Math.random() - 0.5) * 60
            );
        }
        const rainGeo = new THREE.BufferGeometry();
        rainGeo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const rainMat = new THREE.PointsMaterial({
            color: 0x93c5fd,
            size: 0.35,
            transparent: true,
            opacity: 0.7
        });
        this.rainPoints = new THREE.Points(rainGeo, rainMat);
        this.scene.add(this.rainPoints);
    }

    initDOMElements() {
        this.ui = {
            livesDisplay: document.getElementById("lives-display"),
            distanceDisplay: document.getElementById("distance-display"),
            homeFill: document.getElementById("home-fill"),
            fpsCounter: document.getElementById("fps-counter"),
            grandmaDistText: document.getElementById("grandma-dist-text"),
            dangerBar: document.getElementById("danger-bar"),
            dangerWarning: document.getElementById("danger-warning"),

            soundBtn: document.getElementById("sound-btn"),
            pauseBtn: document.getElementById("pause-btn"),

            menuScreen: document.getElementById("menu-screen"),
            pauseScreen: document.getElementById("pause-screen"),
            victoryScreen: document.getElementById("victory-screen"),
            gameOverScreen: document.getElementById("game-over-screen"),

            startBtn: document.getElementById("start-btn"),
            resumeBtn: document.getElementById("resume-btn"),
            restartFromPauseBtn: document.getElementById("restart-from-pause-btn"),
            playAgainBtn: document.getElementById("play-again-btn"),
            restartBtn: document.getElementById("restart-btn"),

            victoryTimeVal: document.getElementById("victory-time-val"),
            victoryLivesVal: document.getElementById("victory-lives-val"),
            gameoverDistVal: document.getElementById("gameover-dist-val"),

            touchLeft: document.getElementById("touch-left"),
            touchRight: document.getElementById("touch-right"),
            touchJump: document.getElementById("touch-jump"),
            touchSlide: document.getElementById("touch-slide"),
            touchBoost: document.getElementById("touch-boost")
        };
    }

    bindEvents() {
        window.addEventListener("resize", () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            this.camera.aspect = this.width / this.height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        });

        window.addEventListener("keydown", (e) => {
            if (this.state === "MENU" && (e.code === "Space" || e.code === "Enter")) {
                this.startGame();
                return;
            }
            if (e.code === "KeyP" || e.code === "Escape") {
                this.togglePause();
                return;
            }

            if (this.state !== "PLAYING") return;

            // Boshqaruv
            if (e.code === "KeyA" || e.code === "ArrowLeft") {
                this.moveLane(-1);
            } else if (e.code === "KeyD" || e.code === "ArrowRight") {
                this.moveLane(1);
            } else if (e.code === "Space" || e.code === "KeyW" || e.code === "ArrowUp") {
                this.jump();
            } else if (e.code === "KeyS" || e.code === "ArrowDown") {
                this.slide();
            } else if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
                this.keys.boost = true;
            }
        });

        window.addEventListener("keyup", (e) => {
            if (e.code === "ShiftLeft" || e.code === "ShiftRight") {
                this.keys.boost = false;
            }
        });

        // UI Tugmalar
        this.ui.startBtn.addEventListener("click", () => this.startGame());
        this.ui.soundBtn.addEventListener("click", () => {
            this.sound.init();
            const isMuted = this.sound.toggleMute();
            this.ui.soundBtn.textContent = isMuted ? "🔇" : "🔊";
        });
        this.ui.pauseBtn.addEventListener("click", () => this.togglePause());
        this.ui.resumeBtn.addEventListener("click", () => this.togglePause());
        this.ui.restartFromPauseBtn.addEventListener("click", () => this.resetGame(true));
        this.ui.playAgainBtn.addEventListener("click", () => this.resetGame(true));
        this.ui.restartBtn.addEventListener("click", () => this.resetGame(true));

        // Sensorli mobil boshqaruv
        const bindTouch = (btn, action) => {
            if (!btn) return;
            const trigger = (e) => { e.preventDefault(); action(); };
            btn.addEventListener("touchstart", trigger, { passive: false });
            btn.addEventListener("mousedown", trigger);
        };

        bindTouch(this.ui.touchLeft, () => this.moveLane(-1));
        bindTouch(this.ui.touchRight, () => this.moveLane(1));
        bindTouch(this.ui.touchJump, () => this.jump());
        bindTouch(this.ui.touchSlide, () => this.slide());
        bindTouch(this.ui.touchBoost, () => {
            this.keys.boost = !this.keys.boost;
        });
    }

    moveLane(dir) {
        const nextLane = this.currentLane + dir;
        if (nextLane >= 0 && nextLane <= 2) {
            this.currentLane = nextLane;
            this.boyData.targetX = this.lanes[this.currentLane];
        }
    }

    jump() {
        if (!this.boyData.isJumping && !this.boyData.isSliding) {
            this.boyData.isJumping = true;
            this.boyData.vy = 0.29; // Sakrash balandligi
            this.sound.playJump();

            // Kampir juda yaqin bo'lsa bola qichqiradi
            if (this.grandmaData.distanceBehind < 8) {
                this.sound.speakBoy();
            }
        }
    }

    slide() {
        if (!this.boyData.isSliding && !this.boyData.isJumping) {
            this.boyData.isSliding = true;
            this.boyData.slideTimer = 0.55; // Sirg'alish davomiyligi
            this.sound.playSlide();
        }
    }

    startGame() {
        this.sound.init();
        this.state = "PLAYING";
        this.startTime = performance.now();
        this.ui.menuScreen.classList.add("hidden");
        this.ui.pauseScreen.classList.add("hidden");
        this.ui.victoryScreen.classList.add("hidden");
        this.ui.gameOverScreen.classList.add("hidden");

        // O'yin boshida kampir birinchi chaqiradi
        setTimeout(() => {
            this.sound.speakGrandma();
        }, 800);
    }

    togglePause() {
        if (this.state === "PLAYING") {
            this.state = "PAUSED";
            this.ui.pauseScreen.classList.remove("hidden");
        } else if (this.state === "PAUSED") {
            this.state = "PLAYING";
            this.ui.pauseScreen.classList.add("hidden");
        }
    }

    resetGame(autoStart = false) {
        this.lives = 3;
        this.distanceCovered = 0;
        this.currentLane = 1;

        this.boyData.x = 0;
        this.boyData.y = 0;
        this.boyData.z = 0;
        this.boyData.targetX = 0;
        this.boyData.vy = 0;
        this.boyData.isJumping = false;
        this.boyData.isSliding = false;
        this.boyData.speed = this.boyData.baseSpeed;
        this.boyData.stumbleTimer = 0;

        this.grandmaData.z = -14;
        this.grandmaData.distanceBehind = 14;

        this.obstacles.forEach(o => o.passed = false);
        this.updateHUD();

        if (autoStart) {
            this.startGame();
        }
    }

    // ==========================================
    // 4. HARAKAT VA FIZIKA
    // ==========================================
    updatePlayerPhysics() {
        const b = this.boyData;

        // Qatorlararo silliq surilish
        b.x = THREE.MathUtils.lerp(b.x, b.targetX, 0.18);

        // Tezlik (Sprint boost yoki to'qnashuv sekinlashishi)
        let curSpeed = b.baseSpeed;
        if (this.keys.boost && b.stumbleTimer <= 0) {
            curSpeed = b.maxSpeed;
        }

        if (b.stumbleTimer > 0) {
            b.stumbleTimer -= 0.016;
            curSpeed *= 0.45; // Qoqinib ketganda sekinlashish
        }

        b.speed = THREE.MathUtils.lerp(b.speed, curSpeed, 0.1);
        b.z += b.speed;
        this.distanceCovered = Math.min(this.totalDistance, b.z);

        // Sakrash fizikasi
        if (b.isJumping) {
            b.y += b.vy;
            b.vy -= 0.016; // Gravitatsiya
            if (b.y <= 0) {
                b.y = 0;
                b.isJumping = false;
                b.vy = 0;
            }
        }

        // Sirg'alish (Slide)
        if (b.isSliding) {
            b.slideTimer -= 0.016;
            if (b.slideTimer <= 0) {
                b.isSliding = false;
            }
        }

        // 3D Model holatini yangilash
        this.boy.group.position.set(b.x, b.y, b.z);

        // Yugurish / Sirg'alish animatsiyasi
        b.runCycle += b.speed * 1.6;
        if (b.isSliding) {
            // Eganga yotish
            this.boy.group.rotation.x = Math.PI / 3;
            this.boy.group.position.y = 0.35;
        } else if (b.isJumping) {
            this.boy.group.rotation.x = 0;
            this.boy.legL.rotation.x = 0.8;
            this.boy.legR.rotation.x = -0.6;
            this.boy.armL.rotation.x = -1.2;
            this.boy.armR.rotation.x = 1.2;
        } else {
            // Oddiy parkour yugurish
            this.boy.group.rotation.x = 0.12; // Oldinga yengil egilish
            const swing = Math.sin(b.runCycle) * 0.8;
            this.boy.legL.rotation.x = swing;
            this.boy.legR.rotation.x = -swing;
            this.boy.shoeL.position.z = Math.sin(b.runCycle) * 0.3;
            this.boy.shoeR.position.z = -Math.sin(b.runCycle) * 0.3;

            this.boy.armL.rotation.x = -swing;
            this.boy.armR.rotation.x = swing;
        }

        // Kamera kuzatuvi (Third-person chase camera)
        this.camera.position.x = THREE.MathUtils.lerp(this.camera.position.x, b.x * 0.6, 0.1);
        this.camera.position.y = THREE.MathUtils.lerp(this.camera.position.y, b.y + 3.8, 0.1);
        this.camera.position.z = b.z - 7.5;
        this.camera.lookAt(b.x * 0.4, b.y + 1.8, b.z + 6);
    }

    // Kampir AI Harakati (Chasing Grandma)
    updateGrandmaAI() {
        const g = this.grandmaData;
        const b = this.boyData;

        // Kampir bolaning orqasidan quvlaydi
        // Agar bola tez yugursa, masofa oshadi, agar qoqilsa, kampir yaqinlashadi
        g.x = THREE.MathUtils.lerp(g.x, b.x, 0.08);

        // Kampir tezligi bolaning holatiga qarab
        let gSpeed = 0.285;
        if (b.stumbleTimer > 0) {
            gSpeed = 0.38; // Bola qoqilganda kampir shoshilib quvadi!
        }
        g.z += gSpeed;

        g.distanceBehind = Math.max(0, b.z - g.z);

        // 3D Modelni joylashtirish
        this.grandma.group.position.set(g.x, 0, g.z);

        // Kampir hassasini silkitishi va oqsoqlanib yugurishi
        g.runCycle += 0.22;
        const gSwing = Math.sin(g.runCycle) * 0.65;
        this.grandma.legL.rotation.x = gSwing;
        this.grandma.legR.rotation.x = -gSwing;

        // Hassali o'ng qo'lning qaqshatib silkinishi (Threatening Cane Waving)
        this.grandma.caneArmGroup.rotation.x = Math.sin(g.runCycle * 1.5) * 0.7 - 0.4;

        // Kampir baqirib turishi
        if (Math.random() < 0.008) {
            this.sound.speakGrandma();
        }

        // Bola vahimada baqirishi
        if (g.distanceBehind < 6.5 && Math.random() < 0.015) {
            this.sound.speakBoy();
        }

        // Kampir ushlab oldimi? (Collision check: masofa < 1.4 metr)
        if (g.distanceBehind < 1.4) {
            this.triggerGameOver("Kampir yetib olib, hassasi bilan ushlab oldi!");
        }
    }

    // To'siqlar bilan to'qnashuv
    checkObstacleCollisions() {
        const b = this.boyData;

        for (let obs of this.obstacles) {
            if (obs.passed) continue;

            const dz = obs.z - b.z;

            // Agar to'siq yonida bo'lsa (-0.8 dan 0.8 metrgacha)
            if (Math.abs(dz) < 0.9) {
                // Aynan shu qatorda turibdimi?
                if (Math.abs(b.x - obs.laneX) < 1.1) {
                    let hit = false;

                    if (obs.requiresJump && b.y < obs.height * 0.75) {
                        hit = true;
                    } else if (obs.requiresSlide && !b.isSliding) {
                        hit = true;
                    }

                    if (hit) {
                        obs.passed = true;
                        this.handleStumble(obs.type);
                    }
                }
            }

            // O'tib ketilgan to'siq
            if (b.z > obs.z + 1.5) {
                obs.passed = true;
            }
        }

        // Marraga yetish (Uy eshigiga kirish)
        if (b.z >= 405) {
            this.triggerVictory();
        }
    }

    handleStumble(type) {
        this.lives--;
        this.boyData.stumbleTimer = 1.3; // 1.3 soniya sekinlashish
        this.sound.playHit();
        this.sound.speakBoy();

        if (type === 'puddle') {
            this.sound.playSplash();
        }

        this.updateHUD();

        if (this.lives <= 0) {
            this.triggerGameOver("To'siqlarga ko'p urilib, yiqilib qoldingiz va kampir yetib oldi!");
        }
    }

    triggerVictory() {
        this.state = "VICTORY";
        this.sound.playVictory();

        const timeTaken = Math.round((performance.now() - this.startTime) / 1000);
        this.ui.victoryTimeVal.textContent = timeTaken + " soniya";
        this.ui.victoryLivesVal.textContent = this.lives + " ta";
        this.ui.victoryScreen.classList.remove("hidden");
    }

    triggerGameOver(reason) {
        this.state = "GAMEOVER";
        this.sound.playHit();

        const remain = Math.max(0, Math.round(this.totalDistance - this.distanceCovered));
        this.ui.gameoverDistVal.textContent = remain + "m";
        document.getElementById("gameover-reason-msg").textContent = reason;
        this.ui.gameOverScreen.classList.remove("hidden");
    }

    updateHUD() {
        // Jonlar
        let h = "";
        for (let i = 0; i < 3; i++) {
            h += i < this.lives ? "❤️" : "🖤";
        }
        this.ui.livesDisplay.textContent = h;

        // Uyga qolgan masofa
        const remain = Math.max(0, Math.round(this.totalDistance - this.distanceCovered));
        this.ui.distanceDisplay.textContent = remain + "m";

        // Progress bar
        const prog = Math.min(100, (this.distanceCovered / this.totalDistance) * 100);
        this.ui.homeFill.style.width = prog + "%";

        // Kampir xavf radari
        const dist = Math.max(0, Math.round(this.grandmaData.distanceBehind * 10) / 10);
        this.ui.grandmaDistText.textContent = dist + "m";

        // Qancha yaqin bo'lsa, qizil shkala shuncha to'ladi
        const dangerRatio = Math.max(0, Math.min(100, ((18 - dist) / 18) * 100));
        this.ui.dangerBar.style.width = dangerRatio + "%";

        if (dist < 6.5) {
            this.ui.dangerWarning.classList.remove("hidden");
        } else {
            this.ui.dangerWarning.classList.add("hidden");
        }
    }

    // ==========================================
    // 5. ASOSIY O'YIN SIKLI (60 FPS GAME LOOP)
    // ==========================================
    gameLoop(timestamp) {
        requestAnimationFrame((t) => this.gameLoop(t));

        // FPS hisoblash
        this.frames++;
        if (timestamp - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round((this.frames * 1000) / (timestamp - this.lastFpsUpdate));
            this.ui.fpsCounter.textContent = `${this.fps} FPS`;
            this.frames = 0;
            this.lastFpsUpdate = timestamp;
        }

        // 3D Yomg'ir tomchilarini pastga yog'dirish
        if (this.rainPoints) {
            const pos = this.rainPoints.geometry.attributes.position.array;
            for (let i = 1; i < pos.length; i += 3) {
                pos[i] -= 0.8;
                if (pos[i] < 0) {
                    pos[i] = 20;
                }
            }
            this.rainPoints.geometry.attributes.position.needsUpdate = true;
            this.rainPoints.position.z = this.boyData.z;
        }

        // Vaqti-vaqti bilan chaqmoq va momaqaldiroq
        if (Math.random() < 0.001) {
            this.sound.playThunder();
        }

        if (this.state === "PLAYING") {
            this.updatePlayerPhysics();
            this.updateGrandmaAI();
            this.checkObstacleCollisions();
            this.updateHUD();
        }

        this.renderer.render(this.scene, this.camera);
    }
}

// O'yinni yuklash
window.addEventListener("DOMContentLoaded", () => {
    window.gameInstance = new EscapeGameEngine();
});

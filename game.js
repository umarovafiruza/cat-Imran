/**
 * ===================================================================
 * MUSHUKCHA UYGA QAYTADI 3D (Cat Returns Home 3D - Curved City Roads)
 * Texnologiya: Three.js (WebGL), Web Audio API
 * Arxitektura: Modular, Professional, 60 FPS No-Lag
 * Xususiyatlar: 
 *   - O'ngga va chapga buriladigan haqiqiy 3D egri ko'chalar (Spline Track)
 *   - Mushukchaning to'liq real fizik harakati (Inersiya, drift, tilt, squash)
 *   - Tartibli va o'lchovli transport oqimi (mashinalar soni kamaytirilgan)
 *   - 10 ta boyitilgan bosqichlar
 * ===================================================================
 */

// ==========================================
// 1. OVOZ TIZIMI (WEB AUDIO API + REAL DOG BARK)
// ==========================================
class SoundController {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.initialized = false;
        this.barkAudioPool = [];
        this.barkIndex = 0;
        this.initBarkPool();
    }

    initBarkPool() {
        try {
            for (let i = 0; i < 4; i++) {
                const a = new Audio("dog_bark.ogg");
                a.volume = 0.75;
                this.barkAudioPool.push(a);
            }
        } catch (e) {
            console.warn("Bark pool init", e);
        }
    }

    init() {
        if (!this.initialized) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
                this.initialized = true;
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    }

    playJump() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(540, now + 0.12);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    playCoin() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.05);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.14);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.14);
    }

    playFish() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        [750, 1100].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.06;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.22, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.1);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.1);
        });
    }

    playMilk() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, now);
        osc.frequency.exponentialRampToValueAtTime(820, now + 0.1);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    playStar() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + i * 0.06;

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.2, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.16);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.16);
        });
    }

    playBark() {
        if (this.muted) return;
        if (this.barkAudioPool && this.barkAudioPool.length > 0) {
            try {
                const audio = this.barkAudioPool[this.barkIndex];
                this.barkIndex = (this.barkIndex + 1) % this.barkAudioPool.length;
                audio.currentTime = 0;
                audio.play().catch(() => this.fallbackBark());
                return;
            } catch (err) {
                this.fallbackBark();
            }
        } else {
            this.fallbackBark();
        }
    }

    fallbackBark() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.linearRampToValueAtTime(140, now + 0.12);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    // Mashina signali (Bii-biip!)
    playHorn() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        [440, 440].forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.1;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, start);

            gain.gain.setValueAtTime(0.18, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.08);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.08);
        });
    }

    // Mashina povorotnik chertilishi (Tick-tick)
    playBlinker() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(1400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.025);

        gain.gain.setValueAtTime(0.08, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.025);
    }

    // Mushukchaning charchagan nafas ovozi (Panting)
    playExhausted() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(240, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.12);

        gain.gain.setValueAtTime(0.12, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    playHit() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(190, now);
        osc.frequency.exponentialRampToValueAtTime(45, now + 0.22);

        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    playSplash() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(110, now + 0.12);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.12);
    }

    playVictory() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.12;

            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.3);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.3);
        });
    }

    playGameOver() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        [380, 320, 260, 190].forEach((f, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            const start = now + idx * 0.16;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(f, start);

            gain.gain.setValueAtTime(0.25, start);
            gain.gain.exponentialRampToValueAtTime(0.01, start + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(start);
            osc.stop(start + 0.2);
        });
    }

    playSiren() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(650, now);
        osc.frequency.linearRampToValueAtTime(950, now + 0.18);
        osc.frequency.linearRampToValueAtTime(650, now + 0.36);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.36);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.36);
    }

    playSlip() {
        if (this.muted || !this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(75, now + 0.22);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
    }
}

// ==========================================
// 2. EGRI YO'L VA SPLINE SISTEMASI (CURVE TRACK)
// O'ng va chapga buriluvchi professional 3D trassa
// ==========================================
class CurveTrack {
    constructor(controlPoints, roadWidth = 12.0) {
        this.roadWidth = roadWidth;
        this.halfWidth = roadWidth / 2;
        this.curve = new THREE.CatmullRomCurve3(controlPoints, false, 'centripetal');
        this.length = this.curve.getLength();
        this.sampleStep = 1.0; // 1 metr aniqlikda diskret namunalar
        this.samples = [];
        this.bakeSamples();
    }

    bakeSamples() {
        const count = Math.floor(this.length / this.sampleStep) + 1;
        for (let i = 0; i < count; i++) {
            const u = Math.min(1.0, (i * this.sampleStep) / this.length);
            const pos = this.curve.getPointAt(u);
            const tangent = this.curve.getTangentAt(u).normalize();
            // XZ tekisligida perpendikulyar o'ng vektor
            const right = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
            this.samples.push({
                s: i * this.sampleStep,
                pos,
                tangent,
                right
            });
        }
    }

    // O(1) tezlikdagi yo'l koordinatasi lookup (pos, tangent, right)
    getFrame(s) {
        if (s <= 0) return this.samples[0];
        if (s >= this.length) return this.samples[this.samples.length - 1];
        const idx = Math.floor(s / this.sampleStep);
        const nextIdx = Math.min(idx + 1, this.samples.length - 1);
        const t = (s - idx * this.sampleStep) / this.sampleStep;
        const p1 = this.samples[idx];
        const p2 = this.samples[nextIdx];

        const pos = p1.pos.clone().lerp(p2.pos, t);
        const tangent = p1.tangent.clone().lerp(p2.tangent, t).normalize();
        const right = new THREE.Vector3(-tangent.z, 0, tangent.x).normalize();
        return { pos, tangent, right };
    }

    // (s = yo'l bo'ylab masofa, d = yo'l o'rtasidan og'ish, y = balandlik)
    getPoint(s, d = 0, y = 0) {
        const f = this.getFrame(s);
        return new THREE.Vector3(
            f.pos.x + f.right.x * d,
            f.pos.y + y,
            f.pos.z + f.right.z * d
        );
    }

    // Egri yo'l yuzasi (Asphalt BufferGeometry)
    buildRoadMesh(color = 0x22262e) {
        const vertexCount = this.samples.length * 2;
        const positions = new Float32Array(vertexCount * 3);
        const uvs = new Float32Array(vertexCount * 2);
        const indices = [];

        for (let i = 0; i < this.samples.length; i++) {
            const { pos, right, s } = this.samples[i];
            
            // Chap chekka
            positions[i * 6 + 0] = pos.x - right.x * this.halfWidth;
            positions[i * 6 + 1] = 0.01;
            positions[i * 6 + 2] = pos.z - right.z * this.halfWidth;
            uvs[i * 4 + 0] = 0;
            uvs[i * 4 + 1] = s / 5.0;

            // O'ng chekka
            positions[i * 6 + 3] = pos.x + right.x * this.halfWidth;
            positions[i * 6 + 4] = 0.01;
            positions[i * 6 + 5] = pos.z + right.z * this.halfWidth;
            uvs[i * 4 + 2] = 1;
            uvs[i * 4 + 3] = s / 5.0;

            if (i < this.samples.length - 1) {
                const v1 = i * 2;
                const v2 = i * 2 + 1;
                const v3 = (i + 1) * 2;
                const v4 = (i + 1) * 2 + 1;
                indices.push(v1, v2, v3);
                indices.push(v2, v4, v3);
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
        geo.setIndex(indices);
        geo.computeVertexNormals();

        const mat = new THREE.MeshLambertMaterial({ color });
        return new THREE.Mesh(geo, mat);
    }

    // O'rtadagi qo'shaloq sariq chiziq
    buildCenterStrip(color = 0xf1c40f) {
        const stripW = 0.22;
        const vertexCount = this.samples.length * 2;
        const positions = new Float32Array(vertexCount * 3);
        const indices = [];

        for (let i = 0; i < this.samples.length; i++) {
            const { pos, right } = this.samples[i];
            positions[i * 6 + 0] = pos.x - right.x * stripW;
            positions[i * 6 + 1] = 0.02;
            positions[i * 6 + 2] = pos.z - right.z * stripW;

            positions[i * 6 + 3] = pos.x + right.x * stripW;
            positions[i * 6 + 4] = 0.02;
            positions[i * 6 + 5] = pos.z + right.z * stripW;

            if (i < this.samples.length - 1) {
                indices.push(i * 2, i * 2 + 1, (i + 1) * 2);
                indices.push(i * 2 + 1, (i + 1) * 2 + 1, (i + 1) * 2);
            }
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geo.setIndex(indices);
        geo.computeVertexNormals();

        const mat = new THREE.MeshBasicMaterial({ color });
        return new THREE.Mesh(geo, mat);
    }

    // Yo'l chetidagi ko'tarilgan toza Trotoarlar (Sidewalks)
    buildSidewalks(walkWidth = 2.6, height = 0.16) {
        const group = new THREE.Group();
        const walkMat = new THREE.MeshLambertMaterial({ color: 0xdcdde1 });
        const curbMat = new THREE.MeshLambertMaterial({ color: 0x718093 });

        // Chap va o'ng trotoar
        [-1, 1].forEach(side => {
            const vertexCount = this.samples.length * 2;
            const positions = new Float32Array(vertexCount * 3);
            const indices = [];

            const dInner = side * this.halfWidth;
            const dOuter = side * (this.halfWidth + walkWidth);

            for (let i = 0; i < this.samples.length; i++) {
                const { pos, right } = this.samples[i];

                positions[i * 6 + 0] = pos.x + right.x * dInner;
                positions[i * 6 + 1] = height;
                positions[i * 6 + 2] = pos.z + right.z * dInner;

                positions[i * 6 + 3] = pos.x + right.x * dOuter;
                positions[i * 6 + 4] = height;
                positions[i * 6 + 5] = pos.z + right.z * dOuter;

                if (i < this.samples.length - 1) {
                    if (side === 1) {
                        indices.push(i * 2, i * 2 + 1, (i + 1) * 2);
                        indices.push(i * 2 + 1, (i + 1) * 2 + 1, (i + 1) * 2);
                    } else {
                        indices.push(i * 2, (i + 1) * 2, i * 2 + 1);
                        indices.push(i * 2 + 1, (i + 1) * 2, (i + 1) * 2 + 1);
                    }
                }
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geo.setIndex(indices);
            geo.computeVertexNormals();
            group.add(new THREE.Mesh(geo, walkMat));
        });

        return group;
    }

    // F1 Poyga Bordyurlari (Checkered Red & White Curbs - 60 FPS Vertex Colors)
    buildCurbs(curbW = 0.45, curbH = 0.08) {
        const group = new THREE.Group();
        [-1, 1].forEach(side => {
            const vertexCount = this.samples.length * 2;
            const positions = new Float32Array(vertexCount * 3);
            const colors = new Float32Array(vertexCount * 3);
            const indices = [];

            const dOuter = side * this.halfWidth;
            const dInner = side * (this.halfWidth - curbW);

            for (let i = 0; i < this.samples.length; i++) {
                const { pos, right, s } = this.samples[i];
                const isRed = Math.floor(s / 2.0) % 2 === 0;
                const r = isRed ? 0.92 : 0.96;
                const g = isRed ? 0.18 : 0.96;
                const b = isRed ? 0.18 : 0.96;

                positions[i * 6 + 0] = pos.x + right.x * dInner;
                positions[i * 6 + 1] = curbH;
                positions[i * 6 + 2] = pos.z + right.z * dInner;

                positions[i * 6 + 3] = pos.x + right.x * dOuter;
                positions[i * 6 + 4] = curbH;
                positions[i * 6 + 5] = pos.z + right.z * dOuter;

                colors[i * 6 + 0] = r; colors[i * 6 + 1] = g; colors[i * 6 + 2] = b;
                colors[i * 6 + 3] = r; colors[i * 6 + 4] = g; colors[i * 6 + 5] = b;

                if (i < this.samples.length - 1) {
                    if (side === 1) {
                        indices.push(i * 2, i * 2 + 1, (i + 1) * 2);
                        indices.push(i * 2 + 1, (i + 1) * 2 + 1, (i + 1) * 2);
                    } else {
                        indices.push(i * 2, (i + 1) * 2, i * 2 + 1);
                        indices.push(i * 2 + 1, (i + 1) * 2, (i + 1) * 2 + 1);
                    }
                }
            }

            const geo = new THREE.BufferGeometry();
            geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));
            geo.setIndex(indices);
            geo.computeVertexNormals();

            const mat = new THREE.MeshBasicMaterial({ vertexColors: true });
            group.add(new THREE.Mesh(geo, mat));
        });

        return group;
    }

    // Yo'ldagi oq uzuk chiziqlar (Dashed Lane Markings)
    buildLaneDashes(laneOffset = 0.0) {
        const stripW = 0.10;
        const positions = [];
        const indices = [];
        let vIdx = 0;

        for (let i = 0; i < this.samples.length - 1; i++) {
            const { pos: p1, right: r1, s: s1 } = this.samples[i];
            const { pos: p2, right: r2 } = this.samples[i + 1];

            // 3 metr oq chiziq, 3 metr bo'shliq
            if (Math.floor(s1 / 3.0) % 2 === 0) {
                positions.push(
                    p1.x + r1.x * (laneOffset - stripW), 0.02, p1.z + r1.z * (laneOffset - stripW),
                    p1.x + r1.x * (laneOffset + stripW), 0.02, p1.z + r1.z * (laneOffset + stripW),
                    p2.x + r2.x * (laneOffset - stripW), 0.02, p2.z + r2.z * (laneOffset - stripW),
                    p2.x + r2.x * (laneOffset + stripW), 0.02, p2.z + r2.z * (laneOffset + stripW)
                );
                indices.push(vIdx, vIdx + 1, vIdx + 2, vIdx + 1, vIdx + 3, vIdx + 2);
                vIdx += 4;
            }
        }

        if (positions.length === 0) return new THREE.Group();

        const geo = new THREE.BufferGeometry();
        geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        geo.setIndex(indices);
        geo.computeVertexNormals();
        const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        return new THREE.Mesh(geo, mat);
    }
}

// ==========================================
// 3. 10 TA BOSQICH SOZLAMALARI VA EGRI YO'L MARSHRUTLARI
// Har bir bosqich o'ziga xos tematikasi, to'siqlari va qiyinchilik darajasiga ega
// ==========================================
const LEVEL_CONFIGS = [
    {
        id: 1,
        title: "1-Bosqich: Quyoshli Shaharcha",
        subtitle: "Boshlang'ich trassa — 400m | Keng ko'cha va tinch harakat",
        stars: 1,
        distance: 400,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -60),
            new THREE.Vector3(16, 0, -140),
            new THREE.Vector3(24, 0, -220),
            new THREE.Vector3(10, 0, -300),
            new THREE.Vector3(0, 0, -360)
        ],
        skyColor: 0x81ecec, fogColor: 0xa8e6cf, roadColor: 0x2d3436,
        ambientColor: 0xdff9fb, dirColor: 0xffffff, groundColor: 0x27ae60,
        dogCount: 2, dogSpeed: 0.10, dogVision: 16, chasingDogs: false,
        carCount: 3, carSpeed: 0.30, aiTraffic: false, laneChangeProb: 0.0, hasPoliceCar: false,
        coneCount: 0, barrierCount: 0, oilCount: 0,
        coinCount: 22, fishCount: 6, milkCount: 2, starCount: 1, puddleCount: 2
    },
    {
        id: 2,
        title: "2-Bosqich: Shahar Shossesi",
        subtitle: "Tezlik sinovi — 460m | Yo'lda birinchi konuslar",
        stars: 1,
        distance: 460,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -60),
            new THREE.Vector3(-18, 0, -150),
            new THREE.Vector3(-28, 0, -250),
            new THREE.Vector3(-12, 0, -340),
            new THREE.Vector3(0, 0, -420)
        ],
        skyColor: 0x74b9ff, fogColor: 0xa1c4fd, roadColor: 0x2c3e50,
        ambientColor: 0xecf0f1, dirColor: 0xfff275, groundColor: 0x218c74,
        dogCount: 3, dogSpeed: 0.11, dogVision: 18, chasingDogs: false,
        carCount: 4, carSpeed: 0.34, aiTraffic: false, laneChangeProb: 0.0, hasPoliceCar: false,
        coneCount: 4, barrierCount: 0, oilCount: 0,
        coinCount: 26, fishCount: 7, milkCount: 2, starCount: 1, puddleCount: 2
    },
    {
        id: 3,
        title: "3-Bosqich: Kuzgi Xiyobon (S-Egri Yo'l)",
        subtitle: "Oltin xazonlar — 520m | Moy dog'i & AI manyovrlar",
        stars: 2,
        distance: 520,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -60),
            new THREE.Vector3(22, 0, -150),
            new THREE.Vector3(25, 0, -240),
            new THREE.Vector3(-18, 0, -340),
            new THREE.Vector3(-22, 0, -420),
            new THREE.Vector3(0, 0, -490)
        ],
        skyColor: 0xf39c12, fogColor: 0xe67e22, roadColor: 0x34495e,
        ambientColor: 0xfde3a7, dirColor: 0xf39c12, groundColor: 0xd35400,
        dogCount: 3, dogSpeed: 0.12, dogVision: 20, chasingDogs: false,
        carCount: 4, carSpeed: 0.37, aiTraffic: true, laneChangeProb: 0.40, hasPoliceCar: false,
        coneCount: 4, barrierCount: 0, oilCount: 2,
        coinCount: 30, fishCount: 8, milkCount: 2, starCount: 1, puddleCount: 3
    },
    {
        id: 4,
        title: "4-Bosqich: Binafsha Shom Bulvari",
        subtitle: "Shom tushishi — 580m | Povorotnikli mashinalar & to'siqlar",
        stars: 2,
        distance: 580,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -70),
            new THREE.Vector3(-24, 0, -170),
            new THREE.Vector3(-34, 0, -280),
            new THREE.Vector3(-14, 0, -380),
            new THREE.Vector3(16, 0, -470),
            new THREE.Vector3(0, 0, -550)
        ],
        skyColor: 0x2c1654, fogColor: 0x472475, roadColor: 0x221a36,
        ambientColor: 0x9b59b6, dirColor: 0xf368e0, groundColor: 0x1f1435,
        dogCount: 4, dogSpeed: 0.13, dogVision: 22, chasingDogs: false,
        carCount: 5, carSpeed: 0.40, aiTraffic: true, laneChangeProb: 0.50, hasPoliceCar: false,
        coneCount: 5, barrierCount: 1, oilCount: 2,
        coinCount: 34, fishCount: 9, milkCount: 3, starCount: 2, puddleCount: 3
    },
    {
        id: 5,
        title: "5-Bosqich: Tungi Shahar (Quvlovchi Itlar)",
        subtitle: "Faralar yoqildi — 650m | ⚠️ Dushman itlar yo'lga sakraydi!",
        stars: 3,
        distance: 650,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -70),
            new THREE.Vector3(26, 0, -180),
            new THREE.Vector3(34, 0, -290),
            new THREE.Vector3(12, 0, -400),
            new THREE.Vector3(-24, 0, -500),
            new THREE.Vector3(0, 0, -600)
        ],
        skyColor: 0x050a14, fogColor: 0x0d1728, roadColor: 0x18202a,
        ambientColor: 0x3d5a80, dirColor: 0x90e0ef, groundColor: 0x0a101d,
        dogCount: 5, dogSpeed: 0.14, dogVision: 24, chasingDogs: true, dogChaseSpeed: 0.26,
        carCount: 5, carSpeed: 0.42, aiTraffic: true, laneChangeProb: 0.60, hasPoliceCar: false,
        coneCount: 6, barrierCount: 2, oilCount: 3,
        coinCount: 38, fishCount: 10, milkCount: 3, starCount: 2, puddleCount: 4
    },
    {
        id: 6,
        title: "6-Bosqich: Sirpanchiq Trassa",
        subtitle: "Yomg'ir & Moy dog'lari — 720m | Tormozni to'g'ri ishlating!",
        stars: 3,
        distance: 720,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -80),
            new THREE.Vector3(-28, 0, -200),
            new THREE.Vector3(-40, 0, -330),
            new THREE.Vector3(-18, 0, -440),
            new THREE.Vector3(22, 0, -540),
            new THREE.Vector3(0, 0, -650)
        ],
        skyColor: 0x1e272e, fogColor: 0x2f3640, roadColor: 0x151b22,
        ambientColor: 0x57606f, dirColor: 0x70a1ff, groundColor: 0x12171d,
        dogCount: 5, dogSpeed: 0.14, dogVision: 25, chasingDogs: true, dogChaseSpeed: 0.28,
        carCount: 5, carSpeed: 0.44, aiTraffic: true, laneChangeProb: 0.68, hasPoliceCar: false,
        coneCount: 7, barrierCount: 2, oilCount: 5,
        coinCount: 42, fishCount: 11, milkCount: 3, starCount: 2, puddleCount: 5
    },
    {
        id: 7,
        title: "7-Bosqich: Yo'l Ta'mirlash (Katta To'siqlar)",
        subtitle: "Yo'l to'silgan — 780m | Bitta tor polosa orqali tezkor manyovr",
        stars: 4,
        distance: 780,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -80),
            new THREE.Vector3(28, 0, -200),
            new THREE.Vector3(36, 0, -330),
            new THREE.Vector3(-24, 0, -450),
            new THREE.Vector3(-30, 0, -560),
            new THREE.Vector3(0, 0, -700)
        ],
        skyColor: 0x192a56, fogColor: 0x273c75, roadColor: 0x171f28,
        ambientColor: 0x487eb0, dirColor: 0xfbc531, groundColor: 0x101c38,
        dogCount: 6, dogSpeed: 0.15, dogVision: 26, chasingDogs: true, dogChaseSpeed: 0.30,
        carCount: 6, carSpeed: 0.46, aiTraffic: true, laneChangeProb: 0.75, hasPoliceCar: false,
        coneCount: 8, barrierCount: 4, oilCount: 4,
        coinCount: 46, fishCount: 12, milkCount: 4, starCount: 2, puddleCount: 4
    },
    {
        id: 8,
        title: "8-Bosqich: Sirenali Tezkor Shosse",
        subtitle: "🚨 Shoshilinch Sirena — 840m | Tezyurar politsiya avtomobili!",
        stars: 4,
        distance: 840,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -80),
            new THREE.Vector3(-30, 0, -210),
            new THREE.Vector3(-42, 0, -350),
            new THREE.Vector3(0, 0, -470),
            new THREE.Vector3(32, 0, -590),
            new THREE.Vector3(0, 0, -740)
        ],
        skyColor: 0x090a0f, fogColor: 0x131722, roadColor: 0x141a20,
        ambientColor: 0x34495e, dirColor: 0xe74c3c, groundColor: 0x0a0c12,
        dogCount: 6, dogSpeed: 0.16, dogVision: 27, chasingDogs: true, dogChaseSpeed: 0.32,
        carCount: 6, carSpeed: 0.48, aiTraffic: true, laneChangeProb: 0.82, hasPoliceCar: true,
        coneCount: 8, barrierCount: 4, oilCount: 5,
        coinCount: 50, fishCount: 13, milkCount: 4, starCount: 3, puddleCount: 5
    },
    {
        id: 9,
        title: "9-Bosqich: Bo'ronli Yarim Tun",
        subtitle: "Ekstremal Egri Trassa — 900m | Tezkor to'dalar va quvlovchilar",
        stars: 5,
        distance: 900,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -80),
            new THREE.Vector3(34, 0, -210),
            new THREE.Vector3(46, 0, -350),
            new THREE.Vector3(14, 0, -480),
            new THREE.Vector3(-34, 0, -600),
            new THREE.Vector3(-24, 0, -700),
            new THREE.Vector3(0, 0, -780)
        ],
        skyColor: 0x03050a, fogColor: 0x070c16, roadColor: 0x12171d,
        ambientColor: 0x2c3e50, dirColor: 0x00d2d3, groundColor: 0x06080e,
        dogCount: 7, dogSpeed: 0.17, dogVision: 28, chasingDogs: true, dogChaseSpeed: 0.35,
        carCount: 7, carSpeed: 0.52, aiTraffic: true, laneChangeProb: 0.90, hasPoliceCar: true,
        coneCount: 10, barrierCount: 5, oilCount: 6,
        coinCount: 55, fishCount: 15, milkCount: 4, starCount: 3, puddleCount: 6
    },
    {
        id: 10,
        title: "10-Bosqich: 🏁 AFSONAVIY CHEMPIONLAR FINALI",
        subtitle: "1000 METR! Barcha to'siqlar, manyovrlar va eng yuqori tezlik!",
        stars: 5,
        distance: 1000,
        trackPoints: [
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, 0, -80),
            new THREE.Vector3(32, 0, -180),
            new THREE.Vector3(48, 0, -300),
            new THREE.Vector3(28, 0, -420),
            new THREE.Vector3(0, 0, -520),
            new THREE.Vector3(-36, 0, -620),
            new THREE.Vector3(-30, 0, -720),
            new THREE.Vector3(-10, 0, -790),
            new THREE.Vector3(0, 0, -860)
        ],
        skyColor: 0x020204, fogColor: 0x05060b, roadColor: 0x101317,
        ambientColor: 0x2f3640, dirColor: 0xffbe0b, groundColor: 0x040507,
        dogCount: 7, dogSpeed: 0.18, dogVision: 30, chasingDogs: true, dogChaseSpeed: 0.38,
        carCount: 7, carSpeed: 0.55, aiTraffic: true, laneChangeProb: 0.95, hasPoliceCar: true,
        coneCount: 12, barrierCount: 6, oilCount: 7,
        coinCount: 65, fishCount: 18, milkCount: 5, starCount: 4, puddleCount: 6
    }
];

// ==========================================
// 4. 3D MODELLAR FABRIKASI (OPTIMAL LOW-POLY)
// ==========================================
const ModelFactory = {
    // 1. 3D Mushukcha (To'q sariq, haqiqiy skelet animatsiyasi bilan)
    createCat() {
        const group = new THREE.Group();
        const orangeMat = new THREE.MeshLambertMaterial({ color: 0xff9f43 });
        const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x2d3436 });
        const pinkMat = new THREE.MeshLambertMaterial({ color: 0xffa8a8 });

        // Tana (Body)
        const bodyGeo = new THREE.BoxGeometry(0.7, 0.6, 1.1);
        const body = new THREE.Mesh(bodyGeo, orangeMat);
        body.position.y = 0.55;
        group.add(body);

        // Oq ko'krak qismi
        const chestGeo = new THREE.BoxGeometry(0.5, 0.45, 0.2);
        const chest = new THREE.Mesh(chestGeo, whiteMat);
        chest.position.set(0, 0.55, -0.56);
        group.add(chest);

        // Bosh (Head)
        const headGeo = new THREE.BoxGeometry(0.65, 0.55, 0.55);
        const head = new THREE.Mesh(headGeo, orangeMat);
        head.position.set(0, 0.95, -0.6);
        group.add(head);

        // Quloqlar
        const earGeo = new THREE.ConeGeometry(0.16, 0.32, 4);
        const earL = new THREE.Mesh(earGeo, orangeMat);
        earL.position.set(-0.24, 1.32, -0.6);
        group.add(earL);

        const earR = earL.clone();
        earR.position.x = 0.24;
        group.add(earR);

        // Quloq ichki pushti qismi
        const innerEarGeo = new THREE.ConeGeometry(0.09, 0.2, 4);
        const innerL = new THREE.Mesh(innerEarGeo, pinkMat);
        innerL.position.set(-0.24, 1.3, -0.65);
        group.add(innerL);

        const innerR = innerL.clone();
        innerR.position.x = 0.24;
        group.add(innerR);

        // Ko'zlar
        const eyeGeo = new THREE.BoxGeometry(0.12, 0.12, 0.05);
        const eyeL = new THREE.Mesh(eyeGeo, darkMat);
        eyeL.position.set(-0.16, 0.98, -0.89);
        group.add(eyeL);

        const eyeR = eyeL.clone();
        eyeR.position.x = 0.16;
        group.add(eyeR);

        // Burun
        const noseGeo = new THREE.BoxGeometry(0.1, 0.08, 0.05);
        const nose = new THREE.Mesh(noseGeo, pinkMat);
        nose.position.set(0, 0.88, -0.9);
        group.add(nose);

        // 4 ta oyoq
        const legGeo = new THREE.BoxGeometry(0.16, 0.42, 0.18);
        const legs = [];
        [[-0.24, 0.21, -0.38], [0.24, 0.21, -0.38], [-0.24, 0.21, 0.38], [0.24, 0.21, 0.38]].forEach(pos => {
            const leg = new THREE.Mesh(legGeo, orangeMat);
            leg.position.set(...pos);
            group.add(leg);
            legs.push(leg);
        });

        // Dum (Tail - artikulyatsiyalangan)
        const tailGeo = new THREE.CylinderGeometry(0.06, 0.08, 0.65, 5);
        const tail = new THREE.Mesh(tailGeo, orangeMat);
        tail.position.set(0, 0.75, 0.65);
        tail.rotation.x = -Math.PI / 4;
        group.add(tail);

        // Yulduz qalqon shari
        const shieldGeo = new THREE.SphereGeometry(1.2, 8, 8);
        const shieldMat = new THREE.MeshBasicMaterial({ color: 0x00d2d3, wireframe: true, transparent: true, opacity: 0.55 });
        const shield = new THREE.Mesh(shieldGeo, shieldMat);
        shield.position.set(0, 0.75, 0);
        shield.visible = false;
        group.add(shield);

        // Fake soya
        const shadowGeo = new THREE.CircleGeometry(0.7, 10);
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.02;
        group.add(shadow);

        return { mesh: group, body, head, legs, tail, shield, shadow };
    },

    // 2. 3D Mashina (Sedan)
    createCar(colorHex) {
        const group = new THREE.Group();
        const colors = [0xe74c3c, 0x3498db, 0x2ecc71, 0xf39c12, 0x9b59b6];
        const color = colorHex || colors[Math.floor(Math.random() * colors.length)];
        const bodyMat = new THREE.MeshLambertMaterial({ color });
        const cabinMat = new THREE.MeshLambertMaterial({ color: 0xdff9fb });
        const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1e272e });
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xfffa65 });
        const redLightMat = new THREE.MeshBasicMaterial({ color: 0xff3838 });

        // Kuzov
        const bodyGeo = new THREE.BoxGeometry(1.9, 0.55, 3.4);
        const body = new THREE.Mesh(bodyGeo, bodyMat);
        body.position.y = 0.55;
        group.add(body);

        // Kabina
        const cabinGeo = new THREE.BoxGeometry(1.5, 0.6, 1.8);
        const cabin = new THREE.Mesh(cabinGeo, cabinMat);
        cabin.position.set(0, 1.1, -0.15);
        group.add(cabin);

        // Old faralar
        const lightGeo = new THREE.BoxGeometry(0.28, 0.16, 0.05);
        const lightL = new THREE.Mesh(lightGeo, lightMat);
        lightL.position.set(-0.65, 0.55, -1.72);
        group.add(lightL);

        const lightR = lightL.clone();
        lightR.position.x = 0.65;
        group.add(lightR);

        // Faralar nuri (Headlight beam)
        const beamGeo = new THREE.ConeGeometry(0.9, 5.0, 5);
        const beamMat = new THREE.MeshBasicMaterial({ color: 0xfff275, transparent: true, opacity: 0.16 });
        const beam = new THREE.Mesh(beamGeo, beamMat);
        beam.rotation.x = Math.PI / 2;
        beam.position.set(0, 0.45, -4.2);
        group.add(beam);

        // Orqa chiroqlar
        const tailL = new THREE.Mesh(lightGeo, redLightMat);
        tailL.position.set(-0.65, 0.55, 1.72);
        group.add(tailL);

        const tailR = tailL.clone();
        tailR.position.x = 0.65;
        group.add(tailR);

        // 4 ta g'ildirak
        const wheelGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 7);
        const wheels = [];
        [[-0.95, 0.32, -1.0], [0.95, 0.32, -1.0], [-0.95, 0.32, 1.0], [0.95, 0.32, 1.0]].forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...pos);
            group.add(wheel);
            wheels.push(wheel);
        });

        // Soya
        const shadowGeo = new THREE.PlaneGeometry(2.3, 3.8);
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.02;
        group.add(shadow);

        // Povorotniklar (To'q sariq miltillovchi chiroqlar)
        const blinkerMat = new THREE.MeshBasicMaterial({ color: 0xffa502 });
        const blinkerGeo = new THREE.BoxGeometry(0.18, 0.12, 0.08);

        const blinkerFL = new THREE.Mesh(blinkerGeo, blinkerMat);
        blinkerFL.position.set(-0.85, 0.55, -1.82);
        blinkerFL.visible = false;
        group.add(blinkerFL);

        const blinkerFR = new THREE.Mesh(blinkerGeo, blinkerMat);
        blinkerFR.position.set(0.85, 0.55, -1.82);
        blinkerFR.visible = false;
        group.add(blinkerFR);

        const blinkerRL = new THREE.Mesh(blinkerGeo, blinkerMat);
        blinkerRL.position.set(-0.85, 0.55, 1.74);
        blinkerRL.visible = false;
        group.add(blinkerRL);

        const blinkerRR = new THREE.Mesh(blinkerGeo, blinkerMat);
        blinkerRR.position.set(0.85, 0.55, 1.74);
        blinkerRR.visible = false;
        group.add(blinkerRR);

        return { mesh: group, wheels, isTruck: false, blinkers: { fl: blinkerFL, fr: blinkerFR, rl: blinkerRL, rr: blinkerRR } };
    },

    // 3. 3D Yuk Mashinasi / Fura (Semi-Truck)
    createTruck() {
        const group = new THREE.Group();
        const colors = [0x2980b9, 0xd35400, 0x16a085, 0x8e44ad];
        const cabColor = colors[Math.floor(Math.random() * colors.length)];
        const cabMat = new THREE.MeshLambertMaterial({ color: cabColor });
        const trailerMat = new THREE.MeshLambertMaterial({ color: 0xecf0f1 });
        const wheelMat = new THREE.MeshLambertMaterial({ color: 0x1e272e });
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xfffa65 });

        // Kabina
        const cabGeo = new THREE.BoxGeometry(2.1, 1.6, 1.8);
        const cab = new THREE.Mesh(cabGeo, cabMat);
        cab.position.set(0, 1.1, -2.1);
        group.add(cab);

        // Treyler (Konteyner)
        const trGeo = new THREE.BoxGeometry(2.2, 1.9, 4.2);
        const trailer = new THREE.Mesh(trGeo, trailerMat);
        trailer.position.set(0, 1.35, 0.8);
        group.add(trailer);

        // Old faralar
        const lightGeo = new THREE.BoxGeometry(0.3, 0.2, 0.05);
        const lightL = new THREE.Mesh(lightGeo, lightMat);
        lightL.position.set(-0.75, 0.65, -3.02);
        group.add(lightL);

        const lightR = lightL.clone();
        lightR.position.x = 0.75;
        group.add(lightR);

        // 6 ta g'ildirak
        const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.25, 7);
        const wheels = [];
        [[-1.05, 0.4, -2.1], [1.05, 0.4, -2.1], [-1.05, 0.4, 0.2], [1.05, 0.4, 0.2], [-1.05, 0.4, 2.2], [1.05, 0.4, 2.2]].forEach(pos => {
            const wheel = new THREE.Mesh(wheelGeo, wheelMat);
            wheel.rotation.z = Math.PI / 2;
            wheel.position.set(...pos);
            group.add(wheel);
            wheels.push(wheel);
        });

        // Soya
        const shadowGeo = new THREE.PlaneGeometry(2.6, 6.4);
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.02;
        group.add(shadow);

        // Povorotniklar (Yuk mashinasi uchun)
        const blinkerMat = new THREE.MeshBasicMaterial({ color: 0xffa502 });
        const blinkerGeo = new THREE.BoxGeometry(0.2, 0.14, 0.1);

        const blinkerFL = new THREE.Mesh(blinkerGeo, blinkerMat);
        blinkerFL.position.set(-1.0, 0.65, -3.02);
        blinkerFL.visible = false;
        group.add(blinkerFL);

        const blinkerFR = new THREE.Mesh(blinkerGeo, blinkerMat);
        blinkerFR.position.set(1.0, 0.65, -3.02);
        blinkerFR.visible = false;
        group.add(blinkerFR);

        const blinkerRL = new THREE.Mesh(blinkerGeo, blinkerMat);
        blinkerRL.position.set(-1.05, 0.65, 2.92);
        blinkerRL.visible = false;
        group.add(blinkerRL);

        const blinkerRR = new THREE.Mesh(blinkerGeo, blinkerMat);
        blinkerRR.position.set(1.05, 0.65, 2.92);
        blinkerRR.visible = false;
        group.add(blinkerRR);

        return { mesh: group, wheels, isTruck: true, blinkers: { fl: blinkerFL, fr: blinkerFR, rl: blinkerRL, rr: blinkerRR } };
    },

    // 4. Dushman It (Guard Dog)
    createDog() {
        const group = new THREE.Group();
        const dogMat = new THREE.MeshLambertMaterial({ color: 0x795548 });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x3e2723 });
        const redMat = new THREE.MeshBasicMaterial({ color: 0xff3838 });

        // Tana
        const bodyGeo = new THREE.BoxGeometry(0.8, 0.7, 1.2);
        const body = new THREE.Mesh(bodyGeo, dogMat);
        body.position.y = 0.7;
        group.add(body);

        // Bosh
        const headGeo = new THREE.BoxGeometry(0.65, 0.6, 0.65);
        const head = new THREE.Mesh(headGeo, dogMat);
        head.position.set(0, 1.15, -0.65);
        group.add(head);

        // Tumshuq
        const snoutGeo = new THREE.BoxGeometry(0.4, 0.32, 0.4);
        const snout = new THREE.Mesh(snoutGeo, darkMat);
        snout.position.set(0, 1.05, -1.0);
        group.add(snout);

        // Quloqlar
        const earGeo = new THREE.BoxGeometry(0.15, 0.35, 0.15);
        const earL = new THREE.Mesh(earGeo, darkMat);
        earL.position.set(-0.35, 1.35, -0.65);
        group.add(earL);

        const earR = earL.clone();
        earR.position.x = 0.35;
        group.add(earR);

        // Ogohlantirish belgisi ("!")
        const alertGeo = new THREE.BoxGeometry(0.12, 0.45, 0.12);
        const alertMesh = new THREE.Mesh(alertGeo, redMat);
        alertMesh.position.set(0, 1.8, -0.65);
        alertMesh.visible = false;
        group.add(alertMesh);

        // Oyoqlar
        const legGeo = new THREE.CylinderGeometry(0.11, 0.09, 0.5, 5);
        const legs = [];
        [[-0.32, 0.25, -0.4], [0.32, 0.25, -0.4], [-0.32, 0.25, 0.4], [0.32, 0.25, 0.4]].forEach(pos => {
            const leg = new THREE.Mesh(legGeo, dogMat);
            leg.position.set(...pos);
            group.add(leg);
            legs.push(leg);
        });

        // Soya
        const shadowGeo = new THREE.CircleGeometry(0.8, 8);
        const shadowMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: 0.35 });
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.02;
        group.add(shadow);

        return { mesh: group, legs, alertMesh };
    },

    // 5. Tungi Ko'cha Chirog'i (Street Lamp)
    createStreetLamp() {
        const group = new THREE.Group();
        const metalMat = new THREE.MeshLambertMaterial({ color: 0x2f3640 });
        const lightMat = new THREE.MeshBasicMaterial({ color: 0xfff275 });

        // Ustun
        const postGeo = new THREE.CylinderGeometry(0.08, 0.11, 4.2, 5);
        const post = new THREE.Mesh(postGeo, metalMat);
        post.position.y = 2.1;
        group.add(post);

        // Egri yelka
        const armGeo = new THREE.BoxGeometry(1.2, 0.08, 0.08);
        const arm = new THREE.Mesh(armGeo, metalMat);
        arm.position.set(0.55, 4.2, 0);
        group.add(arm);

        // Chiroq qalpog'i
        const lampCapGeo = new THREE.ConeGeometry(0.3, 0.25, 6);
        const lampCap = new THREE.Mesh(lampCapGeo, metalMat);
        lampCap.position.set(1.1, 4.15, 0);
        group.add(lampCap);

        // Yorug'lik lampasi
        const bulbGeo = new THREE.SphereGeometry(0.16, 6, 6);
        const bulb = new THREE.Mesh(bulbGeo, lightMat);
        bulb.position.set(1.1, 4.0, 0);
        group.add(bulb);

        return group;
    },

    // 6. Shahar Binolari (Shops, Townhouses, Modern Towers)
    createBuilding(typeIndex = 0) {
        const group = new THREE.Group();
        const colors = [0xf5f6fa, 0xffa502, 0x7bed9f, 0xff6b81, 0x70a1ff, 0xeccc68];
        const wallColor = colors[typeIndex % colors.length];
        const wallMat = new THREE.MeshLambertMaterial({ color: wallColor });
        const roofMat = new THREE.MeshLambertMaterial({ color: 0xd63031 });
        const winMat = new THREE.MeshBasicMaterial({ color: 0xfffa65 });
        const darkMat = new THREE.MeshLambertMaterial({ color: 0x2f3542 });

        if (typeIndex % 3 === 0) {
            // Kafe / Do'kon (Shop)
            const bodyGeo = new THREE.BoxGeometry(5.2, 3.8, 4.6);
            const body = new THREE.Mesh(bodyGeo, wallMat);
            body.position.y = 1.9;
            group.add(body);

            // Ayvoncha (Awning)
            const awnGeo = new THREE.BoxGeometry(4.8, 0.2, 1.4);
            const awnMat = new THREE.MeshLambertMaterial({ color: 0xe84118 });
            const awn = new THREE.Mesh(awnGeo, awnMat);
            awn.position.set(0, 2.2, 2.5);
            awn.rotation.x = 0.22;
            group.add(awn);

            // Vitrina oynalari
            const winGeo = new THREE.BoxGeometry(1.6, 1.3, 0.1);
            [-1.3, 1.3].forEach(wx => {
                const win = new THREE.Mesh(winGeo, winMat);
                win.position.set(wx, 1.2, 2.32);
                group.add(win);
            });
        } else if (typeIndex % 3 === 1) {
            // Turar-joy binosi (Townhouse)
            const bodyGeo = new THREE.BoxGeometry(4.8, 6.2, 4.4);
            const body = new THREE.Mesh(bodyGeo, wallMat);
            body.position.y = 3.1;
            group.add(body);

            // 2 qavat oynalari
            const winGeo = new THREE.BoxGeometry(0.85, 0.95, 0.1);
            for (let floor = 0; floor < 3; floor++) {
                for (let col = -1; col <= 1; col += 2) {
                    const win = new THREE.Mesh(winGeo, winMat);
                    win.position.set(col * 1.3, 1.3 + floor * 1.8, 2.22);
                    group.add(win);
                }
            }
        } else if (typeIndex % 4 === 2) {
            // Zamonaviy Ko'p Qavatli Bino (Modern Skyscraper / Tower)
            const bodyGeo = new THREE.BoxGeometry(5.4, 9.5, 4.6);
            const towerMat = new THREE.MeshLambertMaterial({ color: 0x2c3e50 });
            const body = new THREE.Mesh(bodyGeo, towerMat);
            body.position.y = 4.75;
            group.add(body);

            // Shisha panellar (Neon Windows)
            const winNeonMat = new THREE.MeshBasicMaterial({ color: (typeIndex % 2 === 0 ? 0x00d2d3 : 0xffbe0b) });
            for (let floor = 0; floor < 5; floor++) {
                for (let col = -1.6; col <= 1.6; col += 1.6) {
                    const win = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.1), winNeonMat);
                    win.position.set(col, 1.6 + floor * 1.6, 2.32);
                    group.add(win);
                }
            }
        } else {
            // Park Archa / Daraxt va Skameyka
            const trunkGeo = new THREE.CylinderGeometry(0.2, 0.28, 3.2, 5);
            const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 });
            const trunk = new THREE.Mesh(trunkGeo, trunkMat);
            trunk.position.set(0, 1.6, 0);
            group.add(trunk);

            // 2 qavatli archa yaprog'i
            const crownMat = new THREE.MeshLambertMaterial({ color: (typeIndex % 2 === 0 ? 0x2ed573 : 0x20bf6b) });
            const cone1 = new THREE.Mesh(new THREE.ConeGeometry(1.6, 2.4, 6), crownMat);
            cone1.position.set(0, 3.2, 0);
            group.add(cone1);

            const cone2 = new THREE.Mesh(new THREE.ConeGeometry(1.2, 2.0, 6), crownMat);
            cone2.position.set(0, 4.4, 0);
            group.add(cone2);

            // Skameyka
            const benchGeo = new THREE.BoxGeometry(1.6, 0.12, 0.5);
            const woodMat = new THREE.MeshLambertMaterial({ color: 0xb7791f });
            const bench = new THREE.Mesh(benchGeo, woodMat);
            bench.position.set(0, 0.45, 1.4);
            group.add(bench);
        }

        return group;
    },

    // 7. Marra Arkasi (Finish Arch Gate across road)
    createFinishGate() {
        const group = new THREE.Group();
        const metalMat = new THREE.MeshLambertMaterial({ color: 0x34495e });
        const bannerMat = new THREE.MeshBasicMaterial({ color: 0x2ed573 });
        const textMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const checkWhite = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const checkBlack = new THREE.MeshBasicMaterial({ color: 0x111111 });

        // Chap va O'ng ustunlar
        const postGeo = new THREE.BoxGeometry(0.35, 5.2, 0.35);
        const postL = new THREE.Mesh(postGeo, metalMat);
        postL.position.set(-6.2, 2.6, 0);
        group.add(postL);

        const postR = postL.clone();
        postR.position.x = 6.2;
        group.add(postR);

        // Yuqori to'sin
        const beamGeo = new THREE.BoxGeometry(13.0, 0.5, 0.4);
        const beam = new THREE.Mesh(beamGeo, metalMat);
        beam.position.set(0, 5.1, 0);
        group.add(beam);

        // Yashil Marra banneri ("FINISH / MARRA 🏁")
        const bannerGeo = new THREE.BoxGeometry(10.0, 1.2, 0.1);
        const banner = new THREE.Mesh(bannerGeo, bannerMat);
        banner.position.set(0, 5.0, 0.22);
        group.add(banner);

        // Bannerdagi dekorativ oq chegara
        const borderGeo = new THREE.BoxGeometry(9.6, 0.85, 0.05);
        const border = new THREE.Mesh(borderGeo, textMat);
        border.position.set(0, 5.0, 0.28);
        group.add(border);

        // Asfaltdagi shaxmat marra chizig'i
        const checkGeo = new THREE.PlaneGeometry(1.2, 0.8);
        for (let col = -5; col <= 5; col++) {
            const isW = (col + 10) % 2 === 0;
            const ch = new THREE.Mesh(checkGeo, isW ? checkWhite : checkBlack);
            ch.rotation.x = -Math.PI / 2;
            ch.position.set(col * 1.15, 0.02, 0);
            group.add(ch);
        }

        return group;
    },

    // 7b. Marradagi Yakuniy Shinam Uy (Roadside Finish House - Yo'l chekkasidagi maysazorda)
    createHome() {
        const group = new THREE.Group();
        const wallMat = new THREE.MeshLambertMaterial({ color: 0xf5f6fa });
        const roofMat = new THREE.MeshLambertMaterial({ color: 0xe74c3c });
        const doorMat = new THREE.MeshLambertMaterial({ color: 0x8e44ad });
        const winMat = new THREE.MeshBasicMaterial({ color: 0xfffa65 });
        const woodMat = new THREE.MeshLambertMaterial({ color: 0xb7791f });
        const grassMat = new THREE.MeshLambertMaterial({ color: 0x27ae60 });
        const treeMat = new THREE.MeshLambertMaterial({ color: 0x2ed573 });
        const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5d4037 });
        const chimneyMat = new THREE.MeshLambertMaterial({ color: 0xc0392b });

        // Uy tagidagi shaxsiy yashil maysazor hovli
        const yardGeo = new THREE.BoxGeometry(12.0, 0.12, 10.0);
        const yard = new THREE.Mesh(yardGeo, grassMat);
        yard.position.set(0, 0.06, 0);
        group.add(yard);

        // Asosiy bino devorlari
        const bodyGeo = new THREE.BoxGeometry(5.4, 3.4, 4.6);
        const body = new THREE.Mesh(bodyGeo, wallMat);
        body.position.set(0, 1.76, 0);
        group.add(body);

        // Qizil qiya multfilm tom
        const roofGeo = new THREE.ConeGeometry(4.2, 2.2, 4);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.rotation.y = Math.PI / 4;
        roof.position.set(0, 4.4, 0);
        group.add(roof);

        // Tomdagi mo'ri (Chimney)
        const chimGeo = new THREE.BoxGeometry(0.7, 1.2, 0.7);
        const chimney = new THREE.Mesh(chimGeo, chimneyMat);
        chimney.position.set(1.4, 4.8, -0.6);
        group.add(chimney);

        // Shinam eshik
        const doorGeo = new THREE.BoxGeometry(1.3, 1.9, 0.1);
        const door = new THREE.Mesh(doorGeo, doorMat);
        door.position.set(0, 1.05, 2.32);
        group.add(door);

        // Eshik oldidagi yog'och zinalar (Porch stairs)
        const porchGeo = new THREE.BoxGeometry(2.0, 0.2, 1.2);
        const porch = new THREE.Mesh(porchGeo, woodMat);
        porch.position.set(0, 0.16, 2.8);
        group.add(porch);

        // Yo'ldan eshikkacha tosh yo'lakcha (Stone pathway to sidewalk)
        const pathGeo = new THREE.BoxGeometry(1.6, 0.04, 3.4);
        const pathMat = new THREE.MeshLambertMaterial({ color: 0xbdc3c7 });
        const path = new THREE.Mesh(pathGeo, pathMat);
        path.position.set(0, 0.14, 4.8);
        group.add(path);

        // Issiq yorug'likli derazalar
        const winGeo = new THREE.BoxGeometry(1.0, 1.0, 0.1);
        [-1.6, 1.6].forEach(wx => {
            const win = new THREE.Mesh(winGeo, winMat);
            win.position.set(wx, 2.0, 2.32);
            group.add(win);
        });

        // Hovlidagi yoqimli daraxt
        const trunkGeo = new THREE.CylinderGeometry(0.18, 0.25, 2.8, 5);
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.set(-3.8, 1.4, 2.2);
        group.add(trunk);

        const leafGeo = new THREE.SphereGeometry(1.4, 6, 6);
        const leaf = new THREE.Mesh(leafGeo, treeMat);
        leaf.position.set(-3.8, 3.4, 2.2);
        group.add(leaf);

        // Oq panjara (Picket fence)
        const fenceGeo = new THREE.BoxGeometry(0.08, 0.6, 6.0);
        const fenceMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const fenceL = new THREE.Mesh(fenceGeo, fenceMat);
        fenceL.position.set(-5.6, 0.36, 0);
        group.add(fenceL);

        const fenceR = fenceL.clone();
        fenceR.position.x = 5.6;
        group.add(fenceR);

        return group;
    },

    // 8. Bonuslar (Tanga, Baliq, Sut, Yulduz, Ko'lmak)
    createCoin() {
        const geo = new THREE.CylinderGeometry(0.38, 0.38, 0.1, 8);
        const mat = new THREE.MeshLambertMaterial({ color: 0xffbe0b });
        const coin = new THREE.Mesh(geo, mat);
        coin.rotation.z = Math.PI / 2;
        coin.position.y = 0.55;
        return coin;
    },

    createFish() {
        const group = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0x00d2d3 });
        const bodyGeo = new THREE.ConeGeometry(0.24, 0.65, 5);
        const body = new THREE.Mesh(bodyGeo, mat);
        body.rotation.z = -Math.PI / 2;
        group.add(body);

        const tailGeo = new THREE.ConeGeometry(0.2, 0.3, 4);
        const tail = new THREE.Mesh(tailGeo, mat);
        tail.rotation.z = Math.PI / 2;
        tail.position.x = -0.4;
        group.add(tail);

        group.position.y = 0.6;
        return group;
    },

    createMilk() {
        const group = new THREE.Group();
        const mat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const capMat = new THREE.MeshLambertMaterial({ color: 0x3498db });

        const bodyGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.65, 6);
        const body = new THREE.Mesh(bodyGeo, mat);
        group.add(body);

        const capGeo = new THREE.CylinderGeometry(0.12, 0.12, 0.15, 6);
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 0.38;
        group.add(cap);

        group.position.y = 0.45;
        return group;
    },

    createStar() {
        const geo = new THREE.OctahedronGeometry(0.38, 0);
        const mat = new THREE.MeshBasicMaterial({ color: 0xffe600 });
        const star = new THREE.Mesh(geo, mat);
        star.position.y = 0.65;
        return star;
    },

    createPuddle() {
        const geo = new THREE.CircleGeometry(1.2, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0x1e3799, transparent: true, opacity: 0.65 });
        const puddle = new THREE.Mesh(geo, mat);
        puddle.rotation.x = -Math.PI / 2;
        puddle.position.y = 0.02;
        return puddle;
    },

    // 9. Yo'l Konusi (Traffic Cone - Sakrab o'tish mumkin)
    createTrafficCone() {
        const group = new THREE.Group();
        const baseGeo = new THREE.BoxGeometry(0.7, 0.08, 0.7);
        const baseMat = new THREE.MeshLambertMaterial({ color: 0x111111 });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.04;
        group.add(base);

        const coneGeo = new THREE.ConeGeometry(0.28, 0.85, 6);
        const coneMat = new THREE.MeshLambertMaterial({ color: 0xff6b35 });
        const cone = new THREE.Mesh(coneGeo, coneMat);
        cone.position.y = 0.46;
        group.add(cone);

        const stripeGeo = new THREE.CylinderGeometry(0.18, 0.22, 0.22, 6);
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        const stripe = new THREE.Mesh(stripeGeo, stripeMat);
        stripe.position.y = 0.46;
        group.add(stripe);

        return group;
    },

    // 10. Yo'l Ta'mirlash To'sig'i (Construction Road Barrier - Butun polosa)
    createRoadBarrier() {
        const group = new THREE.Group();
        const redMat = new THREE.MeshLambertMaterial({ color: 0xff4757 });
        const whiteMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const orangeMat = new THREE.MeshBasicMaterial({ color: 0xffa502 });

        // Oyoqlar
        const legGeo = new THREE.BoxGeometry(0.12, 1.1, 0.12);
        [-1.2, 1.2].forEach(lx => {
            const leg = new THREE.Mesh(legGeo, redMat);
            leg.position.set(lx, 0.55, 0);
            group.add(leg);

            const footGeo = new THREE.BoxGeometry(0.4, 0.08, 0.7);
            const foot = new THREE.Mesh(footGeo, redMat);
            foot.position.set(lx, 0.04, 0);
            group.add(foot);
        });

        // 2 ta qator taxta
        [0.45, 0.85].forEach(by => {
            const boardGeo = new THREE.BoxGeometry(2.6, 0.26, 0.08);
            const board = new THREE.Mesh(boardGeo, redMat);
            board.position.set(0, by, 0);
            group.add(board);

            // Oq xavfsizlik chiziqlari
            [-0.8, -0.25, 0.25, 0.8].forEach(sx => {
                const stripeGeo = new THREE.BoxGeometry(0.25, 0.28, 0.09);
                const stripe = new THREE.Mesh(stripeGeo, whiteMat);
                stripe.position.set(sx, by, 0);
                group.add(stripe);
            });
        });

        // Sariq ogohlantirish chirog'i
        const lampGeo = new THREE.BoxGeometry(0.24, 0.24, 0.2);
        const lamp = new THREE.Mesh(lampGeo, orangeMat);
        lamp.position.set(0, 1.15, 0);
        group.add(lamp);

        return group;
    },

    // 11. Moy Dog'i (Oil Slick - Sirpanish)
    createOilSlick() {
        const geo = new THREE.CircleGeometry(1.4, 8);
        const mat = new THREE.MeshBasicMaterial({ color: 0x111625, transparent: true, opacity: 0.85 });
        const slick = new THREE.Mesh(geo, mat);
        slick.rotation.x = -Math.PI / 2;
        slick.position.y = 0.025;
        return slick;
    },

    // 12. Tezyurar Sirenali Politsiya Mashinasi (Emergency Police Cruiser)
    createPoliceCar() {
        const carObj = this.createCar(0x1e272e);
        const group = carObj.mesh;

        // Oq yon eshiklar
        const doorGeo = new THREE.BoxGeometry(1.65, 0.5, 0.05);
        const doorMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
        [-0.85, 0.85].forEach(dx => {
            const door = new THREE.Mesh(doorGeo, doorMat);
            door.position.set(dx, 0.65, 0);
            door.rotation.y = Math.PI / 2;
            group.add(door);
        });

        // Tomdagi Sirena (Police Lightbar)
        const barBase = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.08, 0.2), new THREE.MeshLambertMaterial({ color: 0x222222 }));
        barBase.position.set(0, 1.48, -0.2);
        group.add(barBase);

        const redStrobe = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.18), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
        redStrobe.position.set(-0.25, 1.56, -0.2);
        group.add(redStrobe);

        const blueStrobe = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 0.18), new THREE.MeshBasicMaterial({ color: 0x0088ff }));
        blueStrobe.position.set(0.25, 1.56, -0.2);
        group.add(blueStrobe);

        return {
            ...carObj,
            isPolice: true,
            strobes: { red: redStrobe, blue: blueStrobe }
        };
    }
};

// ==========================================
// 5. ASOSIY 3D O'YIN BOSHQARUVI (GAME ENGINE)
// ==========================================
class GameEngine3D {
    constructor() {
        this.container = document.getElementById("webgl-container");
        this.sound = new SoundController();

        this.width = window.innerWidth;
        this.height = window.innerHeight;

        // O'yin holati
        this.state = "MENU";
        this.currentLevelIndex = 0;
        this.lives = 3;
        this.maxLives = 5;
        this.score = 0;
        this.coins = 0;
        this.highScore = parseInt(localStorage.getItem("cat_game_highscore")) || 0;

        // 3D Scene, Camera, Renderer
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(54, this.width / this.height, 0.5, 320);

        this.renderer = new THREE.WebGLRenderer({ antialias: false, powerPreference: "high-performance" });
        this.renderer.setSize(this.width, this.height);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        this.container.appendChild(this.renderer.domElement);

        // Yorug'liklar
        this.ambientLight = new THREE.AmbientLight(0x404b69, 0.7);
        this.scene.add(this.ambientLight);

        this.dirLight = new THREE.DirectionalLight(0xa5b1c2, 0.6);
        this.dirLight.position.set(-20, 35, 10);
        this.scene.add(this.dirLight);

        // Mushukcha atrofidagi yoqimli yorug'lik
        this.catLight = new THREE.PointLight(0xfff275, 1.0, 16);
        this.scene.add(this.catLight);

        // Oltin Oy
        const moonGeo = new THREE.SphereGeometry(3.5, 8, 8);
        const moonMat = new THREE.MeshBasicMaterial({ color: 0xffeaa7 });
        this.moon = new THREE.Mesh(moonGeo, moonMat);
        this.moon.position.set(30, 45, -70);
        this.scene.add(this.moon);

        // Yulduzlar
        const starPositions = [];
        for (let i = 0; i < 300; i++) {
            starPositions.push(
                (Math.random() - 0.5) * 240,
                15 + Math.random() * 60,
                (Math.random() - 0.5) * 320
            );
        }
        const starsGeo = new THREE.BufferGeometry();
        starsGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        const starsMat = new THREE.PointsMaterial({ color: 0xffffff, size: 0.7 });
        this.stars = new THREE.Points(starsGeo, starsMat);
        this.scene.add(this.stars);

        // Boshqaruv tugmalari
        this.keys = { left: false, right: false, forward: false, backward: false, jump: false };

        // ==========================================
        // REAL MUSHUKCHA FIZIKASI (PHYSICS STATE)
        // ==========================================
        this.player = {
            s: 4.0,           // Yo'l bo'ylab masofa (metr)
            d: 0.0,           // Yo'l o'rtasidan lateral og'ish (metr)
            vs: 0.36,         // Oldinga tezlik (units/frame ~85 km/h)
            targetVs: 0.36,   // Maqsadli oldinga tezlik
            vd: 0.0,          // Yonboshga siljish tezligi (drift/strafe)
            
            y: 0.0,           // Balandlik (sakrash)
            vy: 0.0,          // Vertikal tezlik
            isGrounded: true,
            
            heading: 0.0,     // Yaw burilish burchagi (rad)
            roll: 0.0,        // Egilish (Centripetal bank tilt)
            pitch: 0.0,       // Gaz / tormoz pitch egilishi
            
            squashY: 1.0,     // Sakrab tushgandagi fizik elastiklik
            squashXZ: 1.0,
            
            stride: 0.0,      // Qadam tashlash fazasi (oyoqlar sirpanmasligi uchun)
            idlePhase: 0.0,   // Tinch turganda nafas olish fazasi
            
            isInvulnerable: false,
            invulnTimer: 0,
            hasShield: false,
            shieldTimer: 0,
            inPuddle: false,

            // Stamina & Nitro mexanikasi
            stamina: 100,
            maxStamina: 100,
            staminaDrainRate: 0.52,
            staminaRegenRate: 0.20,
            isExhausted: false,
            slipTimer: 0
        };

        // Meshlar va massivlar
        this.catObj = ModelFactory.createCat();
        this.scene.add(this.catObj.mesh);

        this.track = null;
        this.roadMesh = null;
        this.centerStrip = null;
        this.sidewalks = null;
        this.curbs = null;
        this.laneDashes = null;
        this.finishGate = null;
        this.homeMesh = null;

        this.items = [];
        this.dogs = [];
        this.cars = [];
        this.puddles = [];
        this.cones = [];
        this.barriers = [];
        this.oilSlicks = [];
        this.decorGroup = new THREE.Group();
        this.scene.add(this.decorGroup);

        // FPS hisoblash
        this.fps = 60;
        this.frames = 0;
        this.lastFpsUpdate = performance.now();

        this.initDOMElements();
        this.populateLevelGrid();
        this.bindEvents();
        this.loadLevel(0);
        this.setGameState("MENU");

        requestAnimationFrame((t) => this.gameLoop(t));
    }

    initDOMElements() {
        this.ui = {
            lives: document.getElementById("lives-display"),
            coinDisplay: document.getElementById("coin-display"),
            score: document.getElementById("score-display"),
            highScore: document.getElementById("high-score-display"),
            levelBadge: document.getElementById("level-badge"),
            speedVal: document.getElementById("speed-val"),
            distVal: document.getElementById("dist-val"),
            distTotal: document.getElementById("dist-total"),
            shieldIndicator: document.getElementById("shield-indicator"),
            shieldTimer: document.getElementById("shield-timer"),
            staminaPill: document.getElementById("stamina-pill"),
            staminaBar: document.getElementById("stamina-bar"),
            staminaText: document.getElementById("stamina-text"),
            fpsCounter: document.getElementById("fps-counter"),
            soundBtn: document.getElementById("sound-btn"),
            pauseBtn: document.getElementById("pause-btn"),

            levelIntroCard: document.getElementById("level-intro-card"),
            introLevelTitle: document.getElementById("intro-level-title"),
            introLevelSub: document.getElementById("intro-level-sub"),
            levelSelectModal: document.getElementById("level-select-modal"),
            levelGrid: document.getElementById("level-grid"),
            openLevelSelectBtn: document.getElementById("open-level-select-btn"),
            drawerLevelSelectBtn: document.getElementById("drawer-level-select-btn"),
            closeLevelSelectBtn: document.getElementById("close-level-select-btn"),

            burgerBtn: document.getElementById("burger-btn"),
            burgerDrawer: document.getElementById("burger-drawer"),
            drawerCloseBtn: document.getElementById("drawer-close-btn"),
            drawerBackdrop: document.getElementById("drawer-backdrop"),
            drawerLevelVal: document.getElementById("drawer-level-val"),
            drawerSpeedVal: document.getElementById("drawer-speed-val"),
            drawerStaminaVal: document.getElementById("drawer-stamina-val"),
            drawerScoreVal: document.getElementById("drawer-score-val"),
            drawerBestVal: document.getElementById("drawer-best-val"),
            drawerFpsVal: document.getElementById("drawer-fps-val"),
            drawerSoundBtn: document.getElementById("drawer-sound-btn"),
            drawerSoundIcon: document.getElementById("drawer-sound-icon"),
            drawerSoundStatus: document.getElementById("drawer-sound-status"),
            drawerControlsToggleBtn: document.getElementById("drawer-controls-toggle-btn"),
            drawerControlsStatus: document.getElementById("drawer-controls-status"),
            drawerRestartBtn: document.getElementById("drawer-restart-btn"),

            menuScreen: document.getElementById("menu-screen"),
            pauseScreen: document.getElementById("pause-screen"),
            levelCompleteScreen: document.getElementById("level-complete-screen"),
            gameOverScreen: document.getElementById("game-over-screen"),
            victoryScreen: document.getElementById("victory-screen"),

            levelCompleteTitle: document.getElementById("level-complete-title"),
            levelCompleteMsg: document.getElementById("level-complete-msg"),
            completedLevelBadge: document.getElementById("completed-level-badge"),
            levelCoinsVal: document.getElementById("level-coins-val"),
            levelScoreVal: document.getElementById("level-score-val"),

            gameoverDistVal: document.getElementById("gameover-dist-val"),
            gameoverLevelVal: document.getElementById("gameover-level-val"),
            finalScoreVal: document.getElementById("final-score-val"),
            finalBestVal: document.getElementById("final-best-val"),

            victoryCoinsVal: document.getElementById("victory-coins-val"),
            victoryScoreVal: document.getElementById("victory-score-val"),
            victoryBestVal: document.getElementById("victory-best-val"),

            startHardcoreBtn: document.getElementById("start-hardcore-btn"),
            startBtn: document.getElementById("start-btn"),
            resumeBtn: document.getElementById("resume-btn"),
            restartFromPauseBtn: document.getElementById("restart-from-pause-btn"),
            nextLevelBtn: document.getElementById("next-level-btn"),
            restartBtn: document.getElementById("restart-btn"),
            playAgainBtn: document.getElementById("play-again-btn"),

            touchLeft: document.getElementById("touch-left"),
            touchRight: document.getElementById("touch-right"),
            touchForward: document.getElementById("touch-forward"),
            touchBrake: document.getElementById("touch-brake"),
            touchJump: document.getElementById("touch-jump")
        };
    }

    bindEvents() {
        // Sensor qurilmalarni aniqlash
        const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0 || window.matchMedia('(pointer: coarse)').matches;
        if (isTouch) {
            document.body.classList.add("is-touch-device");
        }

        // Dinamik FOV va moslashuvchan o'lcham (Vertical va Gorizontal)
        const updateViewSize = () => {
            this.width = window.innerWidth;
            this.height = window.innerHeight;
            const aspect = this.width / this.height;
            this.camera.aspect = aspect;

            if (aspect < 1.0) {
                // Vertical (portrait) holatda 3D trassa va mushuk to'liq sig'ishi uchun FOV kengaytiriladi
                this.camera.fov = Math.min(76, Math.max(54, 54 + (1.0 - aspect) * 26));
            } else {
                // Gorizontal (landscape) poyga uchun standart optimal FOV
                this.camera.fov = 54;
            }
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
            this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.25));
        };

        window.addEventListener("resize", updateViewSize);
        window.addEventListener("orientationchange", () => setTimeout(updateViewSize, 120));
        updateViewSize();

        window.addEventListener("keydown", (e) => {
            this.sound.init();
            if (e.code === "ArrowLeft" || e.code === "KeyA") this.keys.left = true;
            if (e.code === "ArrowRight" || e.code === "KeyD") this.keys.right = true;
            if (e.code === "ArrowUp" || e.code === "KeyW") this.keys.forward = true;
            if (e.code === "ArrowDown" || e.code === "KeyS") this.keys.backward = true;
            if (e.code === "Space") {
                this.keys.jump = true;
                e.preventDefault();
            }
            if (e.code === "KeyP" || e.code === "Escape") this.togglePause();
        });

        window.addEventListener("keyup", (e) => {
            if (e.code === "ArrowLeft" || e.code === "KeyA") this.keys.left = false;
            if (e.code === "ArrowRight" || e.code === "KeyD") this.keys.right = false;
            if (e.code === "ArrowUp" || e.code === "KeyW") this.keys.forward = false;
            if (e.code === "ArrowDown" || e.code === "KeyS") this.keys.backward = false;
            if (e.code === "Space") this.keys.jump = false;
        });

        // Professional mobil sensor boshqaruv (Touch & Pointer mustahkamligi)
        const setupTouch = (elem, key) => {
            if (!elem) return;
            const onStart = (e) => {
                if (e && e.cancelable) e.preventDefault();
                this.sound.init();
                this.keys[key] = true;
                elem.classList.add("active");
            };
            const onEnd = (e) => {
                if (e && e.cancelable) e.preventDefault();
                this.keys[key] = false;
                elem.classList.remove("active");
            };

            elem.addEventListener("touchstart", onStart, { passive: false });
            elem.addEventListener("touchend", onEnd, { passive: false });
            elem.addEventListener("touchcancel", onEnd, { passive: false });
            elem.addEventListener("pointerdown", onStart);
            elem.addEventListener("pointerup", onEnd);
            elem.addEventListener("pointercancel", onEnd);
            elem.addEventListener("pointerleave", onEnd);
            elem.addEventListener("contextmenu", (e) => e.preventDefault());
        };

        setupTouch(this.ui.touchLeft, "left");
        setupTouch(this.ui.touchRight, "right");
        setupTouch(this.ui.touchForward, "forward");
        setupTouch(this.ui.touchBrake, "backward");
        setupTouch(this.ui.touchJump, "jump");

        // Ovoz boshqaruvi
        const toggleSound = () => {
            this.sound.init();
            const isMuted = this.sound.toggleMute();
            if (this.ui.soundBtn) this.ui.soundBtn.textContent = isMuted ? "🔇" : "🔊";
            if (this.ui.drawerSoundIcon) this.ui.drawerSoundIcon.textContent = isMuted ? "🔇" : "🔊";
            if (this.ui.drawerSoundStatus) this.ui.drawerSoundStatus.textContent = isMuted ? "O'chirilgan" : "Yoqilgan";
        };

        if (this.ui.soundBtn) this.ui.soundBtn.addEventListener("click", toggleSound);
        if (this.ui.drawerSoundBtn) this.ui.drawerSoundBtn.addEventListener("click", toggleSound);

        // Burger Drawer (Mobil Sozlamalar) ochish va yopish
        const openDrawer = () => {
            if (this.ui.burgerDrawer) {
                this.ui.burgerDrawer.classList.remove("hidden");
                this.syncDrawerStats();
            }
        };

        const closeDrawer = () => {
            if (this.ui.burgerDrawer) {
                this.ui.burgerDrawer.classList.add("hidden");
            }
        };

        if (this.ui.burgerBtn) this.ui.burgerBtn.addEventListener("click", openDrawer);
        if (this.ui.drawerCloseBtn) this.ui.drawerCloseBtn.addEventListener("click", closeDrawer);
        if (this.ui.drawerBackdrop) this.ui.drawerBackdrop.addEventListener("click", closeDrawer);

        // Sensor tugmalar rejimini o'zgartirish (Avto / Ko'rsatish / Yashirish)
        this.controlsMode = "auto";
        if (this.ui.drawerControlsToggleBtn) {
            this.ui.drawerControlsToggleBtn.addEventListener("click", () => {
                if (this.controlsMode === "auto") {
                    this.controlsMode = "show";
                    document.body.classList.add("force-show-controls");
                    document.body.classList.remove("force-hide-controls");
                    if (this.ui.drawerControlsStatus) this.ui.drawerControlsStatus.textContent = "Doim ko'rsatish";
                } else if (this.controlsMode === "show") {
                    this.controlsMode = "hide";
                    document.body.classList.remove("force-show-controls");
                    document.body.classList.add("force-hide-controls");
                    if (this.ui.drawerControlsStatus) this.ui.drawerControlsStatus.textContent = "Yashirish";
                } else {
                    this.controlsMode = "auto";
                    document.body.classList.remove("force-show-controls");
                    document.body.classList.remove("force-hide-controls");
                    if (this.ui.drawerControlsStatus) this.ui.drawerControlsStatus.textContent = "Avtomatik";
                }
            });
        }

        if (this.ui.drawerRestartBtn) {
            this.ui.drawerRestartBtn.addEventListener("click", () => {
                closeDrawer();
                this.startNewGame();
            });
        }

        // Modal va o'yin tugmalarini xatosiz va zudlik bilan ishga tushirish (Touch & Click debounced)
        const bindActionBtn = (btn, callback) => {
            if (!btn) return;
            let lastTrigger = 0;
            const handler = (e) => {
                const now = performance.now();
                if (now - lastTrigger < 250) return;
                lastTrigger = now;
                if (e && e.cancelable && e.type === "touchend") e.preventDefault();
                this.sound.init();
                callback();
            };
            btn.addEventListener("click", handler);
            btn.addEventListener("touchend", handler, { passive: false });
        };

        if (this.ui.pauseBtn) this.ui.pauseBtn.addEventListener("click", () => this.togglePause());

        if (this.ui.openLevelSelectBtn) {
            bindActionBtn(this.ui.openLevelSelectBtn, () => {
                this.populateLevelGrid();
                if (this.ui.levelSelectModal) this.ui.levelSelectModal.classList.remove("hidden");
            });
        }
        if (this.ui.drawerLevelSelectBtn) {
            bindActionBtn(this.ui.drawerLevelSelectBtn, () => {
                closeDrawer();
                this.populateLevelGrid();
                if (this.ui.levelSelectModal) this.ui.levelSelectModal.classList.remove("hidden");
            });
        }
        if (this.ui.closeLevelSelectBtn) {
            bindActionBtn(this.ui.closeLevelSelectBtn, () => {
                if (this.ui.levelSelectModal) this.ui.levelSelectModal.classList.add("hidden");
            });
        }

        bindActionBtn(this.ui.startHardcoreBtn, () => this.startHardcoreGame());
        bindActionBtn(this.ui.startBtn, () => this.startNewGame());
        bindActionBtn(this.ui.resumeBtn, () => this.togglePause());
        bindActionBtn(this.ui.restartFromPauseBtn, () => this.startNewGame());
        bindActionBtn(this.ui.nextLevelBtn, () => this.startNextLevel());
        bindActionBtn(this.ui.restartBtn, () => this.startNewGame());
        bindActionBtn(this.ui.playAgainBtn, () => this.startNewGame());
    }

    populateLevelGrid() {
        if (!this.ui.levelGrid) return;
        this.ui.levelGrid.innerHTML = "";
        LEVEL_CONFIGS.forEach((lvl, idx) => {
            const btn = document.createElement("button");
            btn.className = `level-card-btn ${idx === this.currentLevelIndex ? 'active-level' : ''}`;
            let starStr = "";
            for (let s = 0; s < (lvl.stars || 1); s++) starStr += "⭐";

            btn.innerHTML = `
                <span class="level-card-num">${lvl.id}</span>
                <span class="level-card-title">${lvl.title.split(':')[1] || lvl.title}</span>
                <span class="level-card-dist">${Math.round(lvl.distance || 450)}m</span>
                <span class="level-card-stars">${starStr}</span>
            `;
            btn.addEventListener("click", () => {
                this.sound.init();
                this.loadLevel(idx);
                this.setGameState("PLAYING");
                if (this.ui.levelSelectModal) this.ui.levelSelectModal.classList.add("hidden");
                if (this.ui.burgerDrawer) this.ui.burgerDrawer.classList.add("hidden");
                if (this.ui.menuScreen) this.ui.menuScreen.classList.add("hidden");
            });
            this.ui.levelGrid.appendChild(btn);
        });
    }

    showLevelBanner(title, subtitle) {
        if (!this.ui.levelIntroCard) return;
        if (this.ui.introLevelTitle) this.ui.introLevelTitle.textContent = title;
        if (this.ui.introLevelSub) this.ui.introLevelSub.textContent = subtitle || "";

        this.ui.levelIntroCard.classList.remove("hidden");
        this.ui.levelIntroCard.style.animation = 'none';
        void this.ui.levelIntroCard.offsetWidth;
        this.ui.levelIntroCard.style.animation = '';
    }

    syncDrawerStats() {
        const cfg = LEVEL_CONFIGS[this.currentLevelIndex];
        if (this.ui.drawerLevelVal) this.ui.drawerLevelVal.textContent = cfg ? cfg.title.split(':')[1] || cfg.title : "Eng Qiyin Poyga";
        if (this.ui.drawerScoreVal) this.ui.drawerScoreVal.textContent = this.score;
        if (this.ui.drawerBestVal) this.ui.drawerBestVal.textContent = this.highScore;
        if (this.ui.drawerFpsVal) this.ui.drawerFpsVal.textContent = `${this.fps || 60} FPS`;
        const kmh = Math.round(this.player ? this.player.vs * 235 : 0);
        if (this.ui.drawerSpeedVal) this.ui.drawerSpeedVal.textContent = kmh;
        if (this.ui.drawerStaminaVal && this.player) {
            this.ui.drawerStaminaVal.textContent = `${Math.round(this.player.stamina)}%`;
        }
    }

    // ==========================================
    // 3D DARAJANI YUKLASH (EGRI YO'L VA TARTIBLI TRANSPORT)
    // ==========================================
    loadLevel(lvlIndex) {
        this.currentLevelIndex = lvlIndex;
        const cfg = LEVEL_CONFIGS[lvlIndex];

        this.clearLevel();

        // Fon va Tuman (Har bir bosqichning o'ziga xos atmosferasi)
        this.scene.background = new THREE.Color(cfg.skyColor);
        this.scene.fog = new THREE.Fog(cfg.fogColor, 40, 160);

        if (this.ambientLight && cfg.ambientColor) this.ambientLight.color.setHex(cfg.ambientColor);
        if (this.dirLight && cfg.dirColor) this.dirLight.color.setHex(cfg.dirColor);

        // 1. Egri Yo'l Sistemi (Spline Track)
        this.track = new CurveTrack(cfg.trackPoints, 12.0);

        // Yo'l asfalti
        this.roadMesh = this.track.buildRoadMesh(cfg.roadColor);
        this.scene.add(this.roadMesh);

        // F1 Poyga Bordyurlari (Checkered Red & White Curbs - 60 FPS Vertex Colors)
        this.curbs = this.track.buildCurbs();
        this.scene.add(this.curbs);

        // Markaziy sariq chiziq
        this.centerStrip = this.track.buildCenterStrip();
        this.scene.add(this.centerStrip);

        // Yo'l oq uzuk chiziqlari (Dashed Lane Markings)
        this.laneDashes = this.track.buildLaneDashes();
        this.scene.add(this.laneDashes);

        // Trotuarlar (Sidewalks)
        this.sidewalks = this.track.buildSidewalks();
        this.scene.add(this.sidewalks);

        // Keng zamin maysazori
        const groundGeo = new THREE.PlaneGeometry(600, 600);
        const groundMat = new THREE.MeshLambertMaterial({ color: cfg.groundColor || 0x192a1e });
        this.groundMesh = new THREE.Mesh(groundGeo, groundMat);
        this.groundMesh.rotation.x = -Math.PI / 2;
        this.groundMesh.position.y = -0.05;
        this.scene.add(this.groundMesh);

        // 2. Mushukcha Fizik Boshlang'ich Holati
        this.player.s = 4.0;
        this.player.d = 0.0;
        this.player.vs = 0.36;
        this.player.targetVs = 0.36;
        this.player.vd = 0.0;
        this.player.y = 0.0;
        this.player.vy = 0.0;
        this.player.isGrounded = true;
        this.player.heading = 0.0;
        this.player.roll = 0.0;
        this.player.pitch = 0.0;
        this.player.squashY = 1.0;
        this.player.squashXZ = 1.0;
        this.player.stride = 0.0;
        this.player.isInvulnerable = false;
        this.player.hasShield = false;
        this.player.stamina = 100;
        this.player.maxStamina = 100;
        this.player.isExhausted = false;
        this.player.slipTimer = 0;

        const startPt = this.track.getPoint(this.player.s, this.player.d, 0);
        this.catObj.mesh.position.copy(startPt);
        this.catObj.mesh.visible = true;

        // 3. Marra Arkasi va Yo'l Chetidagi Shinam Uy (Finish Gate & Roadside House)
        const finishS = this.track.length - 10;
        const finishFrame = this.track.getFrame(finishS);

        // A) Yo'l ustidagi Marra Arkasi (Finish Gate across the street)
        this.finishGate = ModelFactory.createFinishGate();
        this.finishGate.position.copy(finishFrame.pos);
        this.finishGate.rotation.y = Math.atan2(finishFrame.tangent.x, finishFrame.tangent.z) + Math.PI;
        this.scene.add(this.finishGate);

        // B) Yo'l chekkasidagi (o'ng tomondagi maysazorda) Shinam Uy (Roadside Finish House)
        this.homeMesh = ModelFactory.createHome();
        const houseD = 12.0; // Yo'l o'rtasida emas, o'ng tomondagi chekada
        this.homeMesh.position.copy(this.track.getPoint(finishS, houseD, 0));
        this.homeMesh.rotation.y = Math.atan2(finishFrame.tangent.x, finishFrame.tangent.z) - Math.PI / 2;
        this.scene.add(this.homeMesh);

        // 4. Bonuslar (Egri yo'l bo'ylab chiroyli tartibda)
        const trackLen = this.track.length;
        const usableDist = trackLen - 45;

        // Oltin tangalar
        const coinStep = usableDist / cfg.coinCount;
        for (let i = 0; i < cfg.coinCount; i++) {
            const s = 15 + i * coinStep;
            const d = Math.sin(i * 0.45) * 2.8;
            const coin = ModelFactory.createCoin();
            coin.position.copy(this.track.getPoint(s, d, 0));
            this.scene.add(coin);
            this.items.push({ mesh: coin, type: "coin", s, d, collected: false });
        }

        // Baliqlar (+15 ball & +45 stamina)
        const fishStep = usableDist / cfg.fishCount;
        for (let i = 0; i < cfg.fishCount; i++) {
            const s = 25 + i * fishStep;
            const d = (i % 2 === 0 ? -3.0 : 3.0);
            const fish = ModelFactory.createFish();
            fish.position.copy(this.track.getPoint(s, d, 0));
            this.scene.add(fish);
            this.items.push({ mesh: fish, type: "fish", s, d, collected: false });
        }

        // Jon beruvchi sut (+1 jon & to'liq stamina)
        for (let i = 0; i < cfg.milkCount; i++) {
            const s = 40 + (i + 1) * (usableDist / (cfg.milkCount + 1));
            const milk = ModelFactory.createMilk();
            milk.position.copy(this.track.getPoint(s, 0, 0));
            this.scene.add(milk);
            this.items.push({ mesh: milk, type: "milk", s, d: 0, collected: false });
        }

        // Himoya yulduzi
        for (let i = 0; i < cfg.starCount; i++) {
            const s = 60 + (i + 1) * (usableDist / (cfg.starCount + 1));
            const star = ModelFactory.createStar();
            star.position.copy(this.track.getPoint(s, (i % 2 === 0 ? 3.0 : -3.0), 0));
            this.scene.add(star);
            this.items.push({ mesh: star, type: "star", s, d: (i % 2 === 0 ? 3.0 : -3.0), collected: false });
        }

        // Suv ko'lmaklari (sekinlashtiradi)
        for (let i = 0; i < cfg.puddleCount; i++) {
            const s = 35 + (i + 1) * (usableDist / (cfg.puddleCount + 1));
            const d = (i % 2 === 0 ? -2.2 : 2.2);
            const puddle = ModelFactory.createPuddle();
            puddle.position.copy(this.track.getPoint(s, d, 0.02));
            this.scene.add(puddle);
            this.puddles.push({ mesh: puddle, s, d });
        }

        // 4.5. Yo'l Konuslari (Sakrab o'tish mumkin)
        if (cfg.coneCount) {
            const coneStep = usableDist / cfg.coneCount;
            for (let i = 0; i < cfg.coneCount; i++) {
                const s = 30 + i * coneStep;
                const d = (i % 2 === 0 ? -1.6 : 1.6);
                const cone = ModelFactory.createTrafficCone();
                cone.position.copy(this.track.getPoint(s, d, 0));
                const frame = this.track.getFrame(s);
                cone.rotation.y = Math.atan2(frame.tangent.x, frame.tangent.z);
                this.scene.add(cone);
                this.cones.push({ mesh: cone, s, d, hit: false, jumped: false });
            }
        }

        // 4.6. Yo'l Ta'mirlash To'siqlari (Construction Road Barriers)
        if (cfg.barrierCount) {
            const barStep = usableDist / cfg.barrierCount;
            for (let i = 0; i < cfg.barrierCount; i++) {
                const s = 65 + i * barStep;
                const d = (i % 2 === 0 ? -3.2 : 3.2); // Butun bitta polosani to'sadi
                const barrier = ModelFactory.createRoadBarrier();
                barrier.position.copy(this.track.getPoint(s, d, 0));
                const frame = this.track.getFrame(s);
                barrier.rotation.y = Math.atan2(frame.tangent.x, frame.tangent.z);
                this.scene.add(barrier);
                this.barriers.push({ mesh: barrier, s, d });
            }
        }

        // 4.7. Moy Dog'lari (Oil Slicks - Sirpanish)
        if (cfg.oilCount) {
            const oilStep = usableDist / cfg.oilCount;
            for (let i = 0; i < cfg.oilCount; i++) {
                const s = 45 + i * oilStep;
                const d = (i % 2 === 0 ? -2.2 : 2.2);
                const slick = ModelFactory.createOilSlick();
                slick.position.copy(this.track.getPoint(s, d, 0.02));
                this.scene.add(slick);
                this.oilSlicks.push({ mesh: slick, s, d });
            }
        }

        // 5. Dushman Itlar (Trotuarda patrullik qiladi)
        for (let i = 0; i < cfg.dogCount; i++) {
            const s = 45 + (i + 1) * (usableDist / (cfg.dogCount + 1));
            const dogObj = ModelFactory.createDog();
            const startD = (i % 2 === 0 ? -6.8 : 6.8); // Trotuar chekkasida
            dogObj.mesh.position.copy(this.track.getPoint(s, startD, 0));
            this.scene.add(dogObj.mesh);

            this.dogs.push({
                ...dogObj,
                s,
                d: startD,
                startD,
                dirD: (startD < 0 ? 1 : -1),
                speed: cfg.dogSpeed,
                visionRange: cfg.dogVision,
                aiState: "PATROL",
                chaseTimer: 0,
                tiredTimer: 0,
                walkCycle: 0
            });
        }

        // 6. TARTIBLI TRANSPORT (Mashinalar soni: 3 tadan 7 tagacha)
        // Ikki polosada bir tekis masofada harakatlanadi
        const carCount = cfg.carCount;
        const carSpacing = (usableDist - 50) / carCount;

        for (let i = 0; i < carCount; i++) {
            const s = 50 + i * carSpacing;
            const laneD = (i % 2 === 0 ? -3.2 : 3.2); // Chap yoki o'ng polosa
            const isPolice = cfg.hasPoliceCar && (i === 0);
            const isTruck = !isPolice && (i % 3 === 0);
            const vehicle = isPolice ? ModelFactory.createPoliceCar() : (isTruck ? ModelFactory.createTruck() : ModelFactory.createCar());

            const frame = this.track.getFrame(s);
            vehicle.mesh.position.copy(this.track.getPoint(s, laneD, 0));
            vehicle.mesh.rotation.y = Math.atan2(frame.tangent.x, frame.tangent.z) + Math.PI;

            this.scene.add(vehicle.mesh);
            this.cars.push({
                ...vehicle,
                s,
                d: laneD,
                laneD,
                speed: (isPolice ? cfg.carSpeed * 1.15 : cfg.carSpeed * 0.75),
                hasHorned: false,
                isChangingLane: false,
                targetLaneD: laneD,
                blinkerTimer: 0,
                changeCooldown: 100 + Math.floor(Math.random() * 200)
            });
        }

        // 7. Atrofdagi Shahar Dekoratsiyalari (Ko'cha chiroqlari va binolar)
        this.buildCityDecorations();

        // 8. Bosqich Title Card animatsiyasi
        this.showLevelBanner(cfg.title, cfg.subtitle);

        this.updateHUD();
    }

    buildCityDecorations() {
        const trackLen = this.track.length;

        // Ko'cha chiroqlari (har 50 metrda trotuarda - 60 FPS optimallashgan)
        for (let s = 25; s < trackLen - 30; s += 50) {
            [-6.6, 6.6].forEach(sideD => {
                const lamp = ModelFactory.createStreetLamp();
                const frame = this.track.getFrame(s);
                lamp.position.copy(this.track.getPoint(s, sideD, 0.16));
                const heading = Math.atan2(frame.tangent.x, frame.tangent.z);
                lamp.rotation.y = heading + (sideD < 0 ? Math.PI : 0);
                this.decorGroup.add(lamp);
            });
        }

        // Binolar va daraxtlar (har 36 metrda yo'l bo'yida - 60 FPS optimallashgan)
        let bldgIdx = 0;
        for (let s = 20; s < trackLen - 35; s += 36) {
            [-11.5, 11.5].forEach(sideD => {
                const bldg = ModelFactory.createBuilding(bldgIdx++);
                const frame = this.track.getFrame(s);
                bldg.position.copy(this.track.getPoint(s, sideD, 0));
                const heading = Math.atan2(frame.tangent.x, frame.tangent.z);
                bldg.rotation.y = heading + (sideD < 0 ? Math.PI / 2 : -Math.PI / 2);
                this.decorGroup.add(bldg);
            });
        }
    }

    disposeHierarchy(node) {
        if (!node) return;
        node.traverse((child) => {
            if (child.geometry) child.geometry.dispose();
            if (child.material) {
                if (Array.isArray(child.material)) child.material.forEach(m => m.dispose());
                else child.material.dispose();
            }
        });
    }

    clearLevel() {
        if (this.roadMesh) { this.disposeHierarchy(this.roadMesh); this.scene.remove(this.roadMesh); this.roadMesh = null; }
        if (this.centerStrip) { this.disposeHierarchy(this.centerStrip); this.scene.remove(this.centerStrip); this.centerStrip = null; }
        if (this.curbs) { this.disposeHierarchy(this.curbs); this.scene.remove(this.curbs); this.curbs = null; }
        if (this.laneDashes) { this.disposeHierarchy(this.laneDashes); this.scene.remove(this.laneDashes); this.laneDashes = null; }
        if (this.sidewalks) { this.disposeHierarchy(this.sidewalks); this.scene.remove(this.sidewalks); this.sidewalks = null; }
        if (this.groundMesh) { this.disposeHierarchy(this.groundMesh); this.scene.remove(this.groundMesh); this.groundMesh = null; }
        if (this.finishGate) { this.disposeHierarchy(this.finishGate); this.scene.remove(this.finishGate); this.finishGate = null; }
        if (this.homeMesh) { this.disposeHierarchy(this.homeMesh); this.scene.remove(this.homeMesh); this.homeMesh = null; }

        this.items.forEach(it => { this.disposeHierarchy(it.mesh); this.scene.remove(it.mesh); });
        this.items = [];

        this.dogs.forEach(d => { this.disposeHierarchy(d.mesh); this.scene.remove(d.mesh); });
        this.dogs = [];

        this.cars.forEach(c => { this.disposeHierarchy(c.mesh); this.scene.remove(c.mesh); });
        this.cars = [];

        this.puddles.forEach(p => { this.disposeHierarchy(p.mesh); this.scene.remove(p.mesh); });
        this.puddles = [];

        this.cones.forEach(c => { this.disposeHierarchy(c.mesh); this.scene.remove(c.mesh); });
        this.cones = [];

        this.barriers.forEach(b => { this.disposeHierarchy(b.mesh); this.scene.remove(b.mesh); });
        this.barriers = [];

        this.oilSlicks.forEach(o => { this.disposeHierarchy(o.mesh); this.scene.remove(o.mesh); });
        this.oilSlicks = [];

        while (this.decorGroup.children.length > 0) {
            const child = this.decorGroup.children[0];
            this.disposeHierarchy(child);
            this.decorGroup.remove(child);
        }
    }

    startHardcoreGame() {
        this.lives = 3;
        this.score = 0;
        this.coins = 0;
        this.loadLevel(9); // 10-bosqich
        this.setGameState("PLAYING");
    }

    startNewGame() {
        this.lives = 3;
        this.score = 0;
        this.coins = 0;
        this.loadLevel(0); // 1-bosqich
        this.setGameState("PLAYING");
    }

    startNextLevel() {
        if (this.currentLevelIndex + 1 < LEVEL_CONFIGS.length) {
            this.loadLevel(this.currentLevelIndex + 1);
            this.setGameState("PLAYING");
        } else {
            this.setGameState("VICTORY");
        }
    }

    setGameState(newState) {
        this.state = newState;

        document.body.classList.remove("state-menu", "state-playing", "state-paused", "state-gameover", "state-victory", "state-complete");
        document.body.classList.add(`state-${newState.toLowerCase()}`);

        if (this.ui.burgerDrawer) this.ui.burgerDrawer.classList.add("hidden");
        if (this.ui.menuScreen) this.ui.menuScreen.classList.add("hidden");
        if (this.ui.pauseScreen) this.ui.pauseScreen.classList.add("hidden");
        if (this.ui.levelCompleteScreen) this.ui.levelCompleteScreen.classList.add("hidden");
        if (this.ui.gameOverScreen) this.ui.gameOverScreen.classList.add("hidden");
        if (this.ui.victoryScreen) this.ui.victoryScreen.classList.add("hidden");

        const cfg = LEVEL_CONFIGS[this.currentLevelIndex];
        const distCovered = Math.floor(this.player.s);

        if (newState === "MENU") {
            if (this.ui.menuScreen) this.ui.menuScreen.classList.remove("hidden");
        } else if (newState === "PAUSED") {
            if (this.ui.pauseScreen) this.ui.pauseScreen.classList.remove("hidden");
        } else if (newState === "LEVEL_COMPLETE") {
            if (this.ui.completedLevelBadge) this.ui.completedLevelBadge.textContent = `${this.currentLevelIndex + 1} / 10`;
            if (this.ui.levelCoinsVal) this.ui.levelCoinsVal.textContent = this.coins;
            if (this.ui.levelScoreVal) this.ui.levelScoreVal.textContent = this.score;
            if (this.ui.levelCompleteMsg) this.ui.levelCompleteMsg.textContent = `${cfg ? cfg.title : ''} zabt etildi!`;
            if (this.ui.levelCompleteScreen) this.ui.levelCompleteScreen.classList.remove("hidden");
        } else if (newState === "GAME_OVER") {
            this.checkHighScore();
            if (this.ui.gameoverDistVal) this.ui.gameoverDistVal.textContent = distCovered;
            if (this.ui.gameoverLevelVal) this.ui.gameoverLevelVal.textContent = this.currentLevelIndex + 1;
            if (this.ui.finalScoreVal) this.ui.finalScoreVal.textContent = this.score;
            if (this.ui.finalBestVal) this.ui.finalBestVal.textContent = this.highScore;
            if (this.ui.gameOverScreen) this.ui.gameOverScreen.classList.remove("hidden");
        } else if (newState === "VICTORY") {
            this.checkHighScore();
            if (this.ui.victoryCoinsVal) this.ui.victoryCoinsVal.textContent = this.coins;
            if (this.ui.victoryScoreVal) this.ui.victoryScoreVal.textContent = this.score;
            if (this.ui.victoryBestVal) this.ui.victoryBestVal.textContent = this.highScore;
            if (this.ui.victoryScreen) this.ui.victoryScreen.classList.remove("hidden");
        }
    }

    togglePause() {
        if (this.state === "PLAYING") this.setGameState("PAUSED");
        else if (this.state === "PAUSED") this.setGameState("PLAYING");
    }

    checkHighScore() {
        if (this.score > this.highScore) {
            this.highScore = this.score;
            localStorage.setItem("cat_game_highscore", this.highScore);
            this.updateHUD();
        }
    }

    updateHUD() {
        let hearts = "";
        for (let i = 0; i < this.lives; i++) hearts += "❤️";
        for (let i = this.lives; i < this.maxLives; i++) hearts += "🖤";
        if (this.ui.lives) this.ui.lives.textContent = hearts;

        if (this.ui.coinDisplay) this.ui.coinDisplay.textContent = this.coins;
        if (this.ui.score) this.ui.score.textContent = this.score;
        if (this.ui.highScore) this.ui.highScore.textContent = this.highScore;

        const cfg = LEVEL_CONFIGS[this.currentLevelIndex];
        if (cfg) {
            if (this.ui.levelBadge) this.ui.levelBadge.textContent = `3D: ${cfg.id} / 10: ${cfg.title.split(':')[1] || ''}`;
            if (this.ui.distTotal) this.ui.distTotal.textContent = Math.round(this.track ? this.track.length : 400);
        }

        if (this.player && this.player.hasShield) {
            if (this.ui.shieldIndicator) this.ui.shieldIndicator.classList.remove("hidden");
            const sec = Math.ceil(this.player.shieldTimer / 60);
            if (this.ui.shieldTimer) this.ui.shieldTimer.textContent = `${sec}s`;
        } else {
            if (this.ui.shieldIndicator) this.ui.shieldIndicator.classList.add("hidden");
        }

        // Stamina ko'rsatkichi
        if (this.player && this.ui.staminaBar) {
            const stamPct = Math.max(0, Math.min(100, Math.round(this.player.stamina)));
            this.ui.staminaBar.style.width = `${stamPct}%`;
            if (this.ui.staminaText) {
                this.ui.staminaText.textContent = `${stamPct}%`;
            }
            if (this.ui.staminaPill) {
                if (stamPct <= 25) {
                    this.ui.staminaPill.classList.add("stamina-low");
                } else {
                    this.ui.staminaPill.classList.remove("stamina-low");
                }
            }
        }

        this.syncDrawerStats();
    }

    takeHit() {
        if (this.player.isInvulnerable || this.player.hasShield) return false;
        this.player.isInvulnerable = true;
        this.player.invulnTimer = 75;
        this.player.vy = 0.22;
        this.player.vs = Math.max(0.12, this.player.vs * 0.5);
        this.sound.playHit();
        return true;
    }

    // ==========================================
    // HAR BIR KADRDA YANGILANISH (UPDATE - REAL FIZIKA)
    // ==========================================
    update() {
        if (!this.track || this.state !== "PLAYING") return;
        const p = this.player;
        const cfg = LEVEL_CONFIGS[this.currentLevelIndex];

        // 1. Suv ko'lmagida sekinlashish
        let onWater = false;
        for (let pud of this.puddles) {
            const ds = Math.abs(p.s - pud.s);
            const dd = Math.abs(p.d - pud.d);
            if (ds < 1.6 && dd < 1.2) {
                onWater = true;
                break;
            }
        }
        if (onWater && !p.inPuddle) this.sound.playSplash();
        p.inPuddle = onWater;

        // 2. REAL FORWARD INERSIYA (Tezlanish, nitro, stamina va tormoz)
        let targetForwardSpeed = 0.36; // Normal yugurish (~85 km/h)

        if (this.keys.forward && p.stamina > 0 && !p.isExhausted) {
            targetForwardSpeed = 0.58; // Gaz / Nitro (~136 km/h)
            p.stamina = Math.max(0, p.stamina - p.staminaDrainRate);
            if (p.stamina <= 0) {
                p.isExhausted = true;
                this.sound.playExhausted();
            }
        } else if (this.keys.backward) {
            targetForwardSpeed = 0.16; // Tormoz (~38 km/h)
            p.stamina = Math.min(p.maxStamina, p.stamina + p.staminaRegenRate * 1.5);
        } else {
            // Normal yugurishda stamina sekin tiklanadi
            p.stamina = Math.min(p.maxStamina, p.stamina + p.staminaRegenRate);
        }

        // Charchoqdan chiqish (stamina 20% dan oshganda yana Nitro ishlatish mumkin)
        if (p.isExhausted && p.stamina >= 20) {
            p.isExhausted = false;
        }

        if (p.inPuddle) targetForwardSpeed *= 0.6;
        if (this.state !== "PLAYING") targetForwardSpeed = 0.0;

        // Yumshoq inersiya tezlanishi
        p.vs += (targetForwardSpeed - p.vs) * 0.07;
        p.s += p.vs;

        // Gaz/tormoz pitch egilishi
        const targetPitch = (this.keys.forward ? -0.06 : (this.keys.backward ? 0.08 : 0));
        p.pitch += (targetPitch - p.pitch) * 0.12;

        // Masofa va spidometr ko'rsatkichlari
        if (this.ui.distVal) this.ui.distVal.textContent = Math.floor(p.s);
        const kmh = Math.round(p.vs * 235);
        if (this.ui.speedVal) this.ui.speedVal.textContent = kmh;
        if (this.ui.drawerSpeedVal) this.ui.drawerSpeedVal.textContent = kmh;

        // 3. REAL LATERAL DRIFT VA STEERING FIZIKASI
        let targetLateralSpeed = 0;
        const maxSteerSpeed = 0.22;

        if (this.keys.left) {
            targetLateralSpeed = -maxSteerSpeed;
        } else if (this.keys.right) {
            targetLateralSpeed = maxSteerSpeed;
        }

        // Yonboshga siljishda g'ildirak/panja ishqalanishi (Moy dog'ida kamayadi)
        const friction = (p.slipTimer > 0 ? 0.04 : 0.18);
        p.vd += (targetLateralSpeed - p.vd) * friction;
        p.d += p.vd;

        if (p.slipTimer > 0) {
            p.slipTimer--;
            p.roll += Math.sin(p.slipTimer * 0.45) * 0.12;
        }

        // Chegaralar (Yo'l kengligi 12m, bordyurlar d = ±5.4m)
        if (p.d < -5.4) { p.d = -5.4; p.vd = 0; }
        if (p.d > 5.4) { p.d = 5.4; p.vd = 0; }

        // Sakrash va gravitatsiya
        if (this.keys.jump && p.isGrounded && this.state === "PLAYING") {
            p.vy = 0.28;
            p.isGrounded = false;
            p.squashY = 1.25;
            p.squashXZ = 0.88;
            this.sound.playJump();
        }

        if (!p.isGrounded) {
            p.vy -= 0.015;
            p.y += p.vy;

            if (p.y <= 0) {
                p.y = 0;
                p.vy = 0;
                p.isGrounded = true;
                // Yerga qo'nishdagi elastik fizik zarba (Squash & Stretch)
                p.squashY = 0.78;
                p.squashXZ = 1.18;
            }
        }

        // Elastik o'lchamlarni normal holatga qaytarish
        p.squashY += (1.0 - p.squashY) * 0.2;
        p.squashXZ += (1.0 - p.squashXZ) * 0.2;

        // 4. EGRI YO'L BURILISH BURCHAGI VA BODY ROLL (TILT)
        const frame = this.track.getFrame(p.s);
        const roadAngle = Math.atan2(frame.tangent.x, frame.tangent.z);

        // Lateral tezlik hisobiga o'z burchagiga burilish
        const steerAngleOffset = -Math.atan2(p.vd, p.vs) * 0.65;
        const targetHeading = roadAngle + steerAngleOffset + Math.PI;

        // Burilish burchagi bo'yicha silliq aylanish (shortest angular difference)
        const diff = (targetHeading - p.heading + Math.PI) % (2 * Math.PI) - Math.PI;
        p.heading += diff * 0.2;

        // Centrifugal Bank Tilt (burilishda korpusning fizik egilishi)
        const targetRoll = -(p.vd * 1.4);
        p.roll += (targetRoll - p.roll) * 0.16;

        // 3D Mushukcha modelini transformatsiya qilish
        const catWorldPos = this.track.getPoint(p.s, p.d, p.y);
        this.catObj.mesh.position.copy(catWorldPos);
        this.catObj.mesh.rotation.set(p.pitch, p.heading, p.roll);
        this.catObj.mesh.scale.set(p.squashXZ, p.squashY, p.squashXZ);

        // Dinamik yumshoq kontakt soya (sakrash balandligiga qarab)
        if (this.catObj.shadow) {
            const shadowScale = Math.max(0.35, 1.0 - p.y * 0.35);
            this.catObj.shadow.scale.set(shadowScale, shadowScale, 1);
            this.catObj.shadow.material.opacity = Math.max(0.08, 0.35 - p.y * 0.15);
            this.catObj.shadow.position.y = -p.y + 0.02;
        }

        // Oyoqlar yugurish animatsiyasi (sirpanishsiz, haqiqiy bosib o'tilgan masofaga bog'liq)
        const groundSpeed = Math.hypot(p.vs, p.vd);
        if (p.isGrounded && groundSpeed > 0.02) {
            p.stride += groundSpeed * 2.2;
            this.catObj.legs[0].rotation.x = Math.sin(p.stride) * 0.65;
            this.catObj.legs[1].rotation.x = -Math.sin(p.stride) * 0.65;
            this.catObj.legs[2].rotation.x = -Math.sin(p.stride) * 0.65;
            this.catObj.legs[3].rotation.x = Math.sin(p.stride) * 0.65;
            // Dum inersiyasi
            this.catObj.tail.rotation.z = Math.sin(p.stride * 0.5) * 0.4 + (p.vd * 1.2);
            // Korpusning yengil nafas tebranishi
            this.catObj.body.position.y = 0.55 + Math.sin(p.stride * 2) * 0.04;
        } else {
            this.catObj.legs.forEach(l => l.rotation.x = 0);
            p.idlePhase += 0.05;
            this.catObj.body.position.y = 0.55 + Math.sin(p.idlePhase) * 0.02;
            this.catObj.tail.rotation.z = Math.sin(p.idlePhase * 0.7) * 0.15;
        }

        // O'lmaslik vaqti (Blink)
        if (p.isInvulnerable) {
            p.invulnTimer--;
            this.catObj.mesh.visible = Math.floor(p.invulnTimer / 4) % 2 === 0;
            if (p.invulnTimer <= 0) {
                p.isInvulnerable = false;
                this.catObj.mesh.visible = true;
            }
        }

        // Qalqon
        if (p.hasShield) {
            p.shieldTimer--;
            this.catObj.shield.visible = true;
            this.catObj.shield.rotation.y += 0.06;
            if (p.shieldTimer <= 0) {
                p.hasShield = false;
                this.catObj.shield.visible = false;
            }
        } else {
            this.catObj.shield.visible = false;
        }

        // 5. DINAMIK KAMERA (Burilishlarni oldindan ko'rsatadi)
        const camLookAheadS = Math.min(this.track.length, p.s + 18.0);
        const camFollowS = Math.max(0, p.s - 8.5);

        const targetCamPos = this.track.getPoint(camFollowS, p.d * 0.4, p.y + 4.2);
        const targetLookPos = this.track.getPoint(camLookAheadS, p.d * 0.3, p.y + 1.1);

        this.camera.position.lerp(targetCamPos, 0.14);
        this.camera.lookAt(targetLookPos);

        // Yorug'liklar ergashishi (Xotira optimallashgan, GC pause yo'q)
        if (this.catLight) this.catLight.position.set(catWorldPos.x, catWorldPos.y + 2.2, catWorldPos.z);
        if (this.moon) this.moon.position.set(this.camera.position.x + 35, 45, this.camera.position.z - 75);
        if (this.stars) this.stars.position.set(this.camera.position.x, 0, this.camera.position.z);

        // 6. BONUSLAR YIG'ISH
        for (let item of this.items) {
            if (!item.collected) {
                item.mesh.rotation.y += 0.04;
                const ds = Math.abs(p.s - item.s);
                const dd = Math.abs(p.d - item.d);

                if (ds < 1.4 && dd < 1.2 && p.y < 1.3) {
                    item.collected = true;
                    item.mesh.visible = false;

                    if (item.type === "coin") {
                        this.coins++;
                        this.score += 5;
                        this.sound.playCoin();
                    } else if (item.type === "fish") {
                        this.score += 15;
                        p.stamina = Math.min(p.maxStamina, p.stamina + 45);
                        p.isExhausted = false;
                        p.vs += 0.10; // Qisqa tezlanish turtkisi
                        this.sound.playFish();
                    } else if (item.type === "milk") {
                        if (this.lives < this.maxLives) this.lives++;
                        else this.score += 30;
                        p.stamina = p.maxStamina; // Stamina to'liq tiklanadi
                        p.isExhausted = false;
                        this.sound.playMilk();
                    } else if (item.type === "star") {
                        p.hasShield = true;
                        p.shieldTimer = 300;
                        this.sound.playStar();
                    }
                }
            }
        }

        // 6.5. YO'L KONUSLARI (Traffic Cones - Sakrab o'tish mumkin)
        for (let cone of this.cones) {
            const ds = Math.abs(p.s - cone.s);
            const dd = Math.abs(p.d - cone.d);
            if (ds < 1.1 && dd < 0.95 && this.state === "PLAYING") {
                if (p.y > 0.52) {
                    if (!cone.jumped) {
                        cone.jumped = true;
                        this.score += 5;
                    }
                } else if (!cone.hit) {
                    cone.hit = true;
                    p.vs = Math.max(0.12, p.vs * 0.65);
                    p.stamina = Math.max(0, p.stamina - 15);
                    cone.mesh.rotation.z = 1.1;
                    cone.mesh.position.y = 0.2;
                    this.sound.playHit();
                }
            }
        }

        // 6.6. YO'L TO'SIQLARI (Road Barriers - Butun polosa to'silgan)
        for (let barrier of this.barriers) {
            const ds = Math.abs(p.s - barrier.s);
            const dd = Math.abs(p.d - barrier.d);
            if (ds < 1.3 && dd < 1.4 && p.y < 1.1 && this.state === "PLAYING") {
                if (!p.hasShield) {
                    const hit = this.takeHit();
                    if (hit) {
                        this.lives--;
                        if (this.lives <= 0) {
                            if (this.ui.gameoverDistVal) this.ui.gameoverDistVal.textContent = Math.floor(p.s);
                            this.sound.playGameOver();
                            this.setGameState("GAME_OVER");
                            return;
                        }
                    }
                }
            }
        }

        // 6.7. MOY DOG'LARI (Oil Slicks - Sirpanish)
        for (let slick of this.oilSlicks) {
            const ds = Math.abs(p.s - slick.s);
            const dd = Math.abs(p.d - slick.d);
            if (ds < 1.5 && dd < 1.3 && p.y < 0.3) {
                if (p.slipTimer <= 0) {
                    p.slipTimer = 80;
                    this.sound.playSlip();
                }
            }
        }

        // 7. DUSHMAN ITLAR AI (PATROL, ALERT, CHASE, TIRED & SAKRAB QOCHISH)
        for (let dog of this.dogs) {
            const ds = Math.abs(p.s - dog.s);
            const dd = Math.abs(p.d - dog.d);
            const dist = Math.hypot(ds, dd);

            dog.walkCycle = (dog.walkCycle || 0) + 0.18;
            if (dog.legs) {
                dog.legs[0].rotation.x = Math.sin(dog.walkCycle) * 0.5;
                dog.legs[1].rotation.x = -Math.sin(dog.walkCycle) * 0.5;
                dog.legs[2].rotation.x = -Math.sin(dog.walkCycle) * 0.5;
                dog.legs[3].rotation.x = Math.sin(dog.walkCycle) * 0.5;
            }

            if (p.hasShield && dist < dog.visionRange) {
                dog.aiState = "FLEE";
                dog.d += (dog.d > 0 ? 0.08 : -0.08);
                if (dog.alertMesh) dog.alertMesh.visible = false;
            } else if (dog.aiState === "TIRED") {
                // Charchagan holat: trotuarga qaytadi
                dog.tiredTimer--;
                if (dog.alertMesh) dog.alertMesh.visible = false;
                dog.d += (dog.startD - dog.d) * 0.04;
                if (dog.tiredTimer <= 0) {
                    dog.aiState = "PATROL";
                }
            } else if (cfg.chasingDogs && dist < dog.visionRange && p.s < dog.s + 6 && this.state === "PLAYING") {
                // Agressiv quvish holati (5-10 bosqichlar)
                if (dog.aiState !== "CHASE") {
                    this.sound.playBark();
                    dog.aiState = "CHASE";
                    dog.chaseTimer = 220;
                }
                if (dog.alertMesh) dog.alertMesh.visible = true;

                // Mushukka tomon yo'lga chiqib quvish
                const dirToCatD = Math.sign(p.d - dog.d);
                dog.d += dirToCatD * (cfg.dogChaseSpeed || dog.speed * 1.5) * 0.75;
                dog.s -= (cfg.dogChaseSpeed || dog.speed * 1.5) * 0.45;

                dog.chaseTimer--;
                // Agar mushuk o'tib ketsa yoki quvish vaqti tugasa
                if (dog.chaseTimer <= 0 || (p.s > dog.s + 8)) {
                    dog.aiState = "TIRED";
                    dog.tiredTimer = 160;
                }
            } else if (dist < dog.visionRange && this.state === "PLAYING") {
                if (dog.aiState !== "CHASE") {
                    this.sound.playBark();
                }
                dog.aiState = "CHASE";
                if (dog.alertMesh) dog.alertMesh.visible = true;
                const dirToCat = Math.sign(p.d - dog.d);
                dog.d += dirToCat * dog.speed * 1.2;
                dog.s += Math.sign(p.s - dog.s) * dog.speed * 0.4;
            } else {
                dog.aiState = "PATROL";
                if (dog.alertMesh) dog.alertMesh.visible = false;
                dog.d += dog.dirD * dog.speed * 0.5;
                if (Math.abs(dog.d) > 7.2) dog.dirD *= -1;
                if (Math.abs(dog.d) < 5.8) dog.dirD *= -1;
            }

            // It pozitsiyasini yangilash
            const dogPos = this.track.getPoint(dog.s, dog.d, 0);
            dog.mesh.position.copy(dogPos);
            const dogFrame = this.track.getFrame(dog.s);
            if (dog.aiState === "CHASE") {
                dog.mesh.rotation.y = Math.atan2(dogFrame.tangent.x, dogFrame.tangent.z);
            } else {
                dog.mesh.rotation.y = Math.atan2(dogFrame.tangent.x, dogFrame.tangent.z) + (dog.dirD > 0 ? Math.PI / 2 : -Math.PI / 2);
            }

            // To'qnashuvni tekshirish (p.y >= 0.95 bo'lsa sakrab o'tib ketiladi!)
            if (dist < 1.25 && p.y < 0.95 && this.state === "PLAYING") {
                if (p.hasShield) {
                    dog.d += (dog.d > 0 ? 3.0 : -3.0);
                    dog.aiState = "TIRED";
                    dog.tiredTimer = 180;
                } else {
                    const hit = this.takeHit();
                    if (hit) {
                        this.lives--;
                        dog.aiState = "TIRED";
                        dog.tiredTimer = 180;
                        if (this.lives <= 0) {
                            if (this.ui.gameoverDistVal) this.ui.gameoverDistVal.textContent = Math.floor(p.s);
                            this.sound.playGameOver();
                            this.setGameState("GAME_OVER");
                            return;
                        }
                    }
                }
            }
        }

        // 8. TARTIBLI TRANSPORT OQIMI VA SMART AI POLOSA ALMASHTIRISH
        for (let car of this.cars) {
            car.s -= car.speed; // Qarama-qarshi oqimda silliq harakatlanadi
            car.wheels.forEach(w => w.rotation.x += 0.22);

            // POLICE CAR: Sirena va stroboskop chiroqlar
            if (car.isPolice) {
                car.strobePhase = (car.strobePhase || 0) + 1;
                const isRed = Math.floor(car.strobePhase / 5) % 2 === 0;
                if (car.strobes) {
                    car.strobes.red.material.color.setHex(isRed ? 0xff0000 : 0x220000);
                    car.strobes.blue.material.color.setHex(!isRed ? 0x0088ff : 0x001133);
                }
                const distAheadPolice = car.s - p.s;
                if (distAheadPolice > 0 && distAheadPolice < 55 && car.strobePhase % 45 === 0) {
                    this.sound.playSiren();
                }
            }

            // Mushuk o'sha polosada kelayotgan bo'lsa mashina signal chaladi
            const inSameLane = Math.abs(p.d - car.d) < 1.6;
            const distAhead = car.s - p.s;
            if (inSameLane && distAhead > 0 && distAhead < 24 && !car.hasHorned) {
                this.sound.playHorn();
                car.hasHorned = true;
            }

            // SMART AI: Polosa almashtirish
            if (cfg.aiTraffic && !car.isChangingLane) {
                car.changeCooldown--;
                if (car.changeCooldown <= 0 && distAhead > 14 && distAhead < 75) {
                    car.isChangingLane = true;
                    car.targetLaneD = (car.d > 0 ? -3.2 : 3.2); // Qarama-qarshi xavfsiz polosaga
                    car.blinkerTimer = 65; // ~1.1s burilish chirog'i miltillaydi
                    this.sound.playBlinker();
                }
            }

            // Burilish chiroqlarini boshqarish
            if (car.blinkers) {
                if (car.blinkerTimer > 0) {
                    car.blinkerTimer--;
                    const isLeftTarget = car.targetLaneD < car.d;
                    const blinkOn = (Math.floor(car.blinkerTimer / 9) % 2 === 0);

                    if (isLeftTarget) {
                        car.blinkers.fl.material.color.setHex(blinkOn ? 0xffaa00 : 0x332200);
                        car.blinkers.rl.material.color.setHex(blinkOn ? 0xffaa00 : 0x332200);
                        car.blinkers.fr.material.color.setHex(0x332200);
                        car.blinkers.rr.material.color.setHex(0x332200);
                    } else {
                        car.blinkers.fr.material.color.setHex(blinkOn ? 0xffaa00 : 0x332200);
                        car.blinkers.rr.material.color.setHex(blinkOn ? 0xffaa00 : 0x332200);
                        car.blinkers.fl.material.color.setHex(0x332200);
                        car.blinkers.rl.material.color.setHex(0x332200);
                    }
                } else if (car.isChangingLane) {
                    // Silliq lateral siljish
                    car.d += (car.targetLaneD - car.d) * 0.045;
                    if (Math.abs(car.d - car.targetLaneD) < 0.06) {
                        car.d = car.targetLaneD;
                        car.isChangingLane = false;
                        car.changeCooldown = 200 + Math.floor(Math.random() * 240);
                        car.blinkers.fl.material.color.setHex(0x332200);
                        car.blinkers.fr.material.color.setHex(0x332200);
                        car.blinkers.rl.material.color.setHex(0x332200);
                        car.blinkers.rr.material.color.setHex(0x332200);
                    }
                } else {
                    car.blinkers.fl.material.color.setHex(0x332200);
                    car.blinkers.fr.material.color.setHex(0x332200);
                    car.blinkers.rl.material.color.setHex(0x332200);
                    car.blinkers.rr.material.color.setHex(0x332200);
                }
            }

            // Agar mashina o'tib ketsa, oldinga toza masofada retsirkulyatsiya bo'ladi
            if (car.s < p.s - 25) {
                car.s = p.s + 90 + Math.random() * 40;
                car.d = (Math.random() > 0.5 ? 3.2 : -3.2);
                car.targetLaneD = car.d;
                car.isChangingLane = false;
                car.blinkerTimer = 0;
                car.changeCooldown = 140 + Math.floor(Math.random() * 180);
                car.hasHorned = false;
                if (car.blinkers) {
                    car.blinkers.fl.material.color.setHex(0x332200);
                    car.blinkers.fr.material.color.setHex(0x332200);
                    car.blinkers.rl.material.color.setHex(0x332200);
                    car.blinkers.rr.material.color.setHex(0x332200);
                }
            }

            // Mashina pozitsiyasi va aylanishini egri yo'lga moslash
            const carPos = this.track.getPoint(car.s, car.d, 0);
            car.mesh.position.copy(carPos);
            const carFrame = this.track.getFrame(car.s);
            car.mesh.rotation.y = Math.atan2(carFrame.tangent.x, carFrame.tangent.z);

            // To'qnashuvni tekshirish
            const ds = Math.abs(p.s - car.s);
            const dd = Math.abs(p.d - car.d);
            const hitDistS = car.isTruck ? 3.0 : 1.8;
            const hitDistD = car.isTruck ? 1.4 : 1.2;

            if (ds < hitDistS && dd < hitDistD && p.y < 1.1 && this.state === "PLAYING") {
                if (!p.hasShield) {
                    const hit = this.takeHit();
                    if (hit) {
                        this.lives--;
                        if (this.lives <= 0) {
                            if (this.ui.gameoverDistVal) this.ui.gameoverDistVal.textContent = Math.floor(p.s);
                            this.sound.playGameOver();
                            this.setGameState("GAME_OVER");
                            return;
                        }
                    }
                }
            }
        }

        // 9. MARRA (SHINAM UYGA VA MARRA CHIZIG'IGA YETIB BORISH)
        if (p.s >= this.track.length - 12 && this.state === "PLAYING") {
            this.score += 250;
            this.sound.playVictory();

            if (this.currentLevelIndex + 1 >= LEVEL_CONFIGS.length) {
                this.setGameState("VICTORY");
            } else {
                this.setGameState("LEVEL_COMPLETE");
            }
            return;
        }

        this.updateHUD();
    }

    // ==========================================
    // 3D RENDER VA 60 FPS LOOP
    // ==========================================
    gameLoop(time) {
        this.frames++;
        if (time - this.lastFpsUpdate >= 1000) {
            this.fps = Math.round((this.frames * 1000) / (time - this.lastFpsUpdate));
            if (this.ui.fpsCounter) this.ui.fpsCounter.textContent = `${this.fps} FPS`;
            if (this.ui.drawerFpsVal) this.ui.drawerFpsVal.textContent = `${this.fps} FPS`;
            this.frames = 0;
            this.lastFpsUpdate = time;
        }

        this.update();
        this.renderer.render(this.scene, this.camera);
        requestAnimationFrame((t) => this.gameLoop(t));
    }
}

// O'yinni ishga tushirish
window.addEventListener("DOMContentLoaded", () => {
    window.catGame = new GameEngine3D();
});

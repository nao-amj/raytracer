// 3D Ray Tracer Engine 💕
// Created with love by Yuki & Miki

class Vector3 {
    constructor(x = 0, y = 0, z = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
    
    add(v) {
        return new Vector3(this.x + v.x, this.y + v.y, this.z + v.z);
    }
    
    subtract(v) {
        return new Vector3(this.x - v.x, this.y - v.y, this.z - v.z);
    }
    
    multiply(scalar) {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    
    // component-wise multiplication
    multiplyVec(v) {
        return new Vector3(this.x * v.x, this.y * v.y, this.z * v.z);
    }
    
    dot(v) {
        return this.x * v.x + this.y * v.y + this.z * v.z;
    }
    
    length() {
        return Math.sqrt(this.dot(this));
    }
    
    normalize() {
        const len = this.length();
        return len > 0 ? this.multiply(1 / len) : new Vector3();
    }
    
    reflect(normal) {
        return this.subtract(normal.multiply(2 * this.dot(normal)));
    }
}

class Ray {
    constructor(origin, direction) {
        this.origin = origin;
        this.direction = direction.normalize();
    }
    
    at(t) {
        return this.origin.add(this.direction.multiply(t));
    }
}

class Material {
    constructor(color, ambient = 0.1, diffuse = 0.9, specular = 0.9, shininess = 200, reflectivity = 0.5) {
        this.color = color;
        this.ambient = ambient;
        this.diffuse = diffuse;
        this.specular = specular;
        this.shininess = shininess;
        this.reflectivity = reflectivity;
    }
}

class Sphere {
    constructor(center, radius, material) {
        this.center = center;
        this.radius = radius;
        this.material = material;
    }
    
    intersect(ray) {
        const oc = ray.origin.subtract(this.center);
        const a = ray.direction.dot(ray.direction);
        const b = 2 * oc.dot(ray.direction);
        const c = oc.dot(oc) - this.radius * this.radius;
        const discriminant = b * b - 4 * a * c;
        
        if (discriminant < 0) return null;
        
        const sqrt_disc = Math.sqrt(discriminant);
        const t1 = (-b - sqrt_disc) / (2 * a);
        const t2 = (-b + sqrt_disc) / (2 * a);
        
        const t = t1 > 0.001 ? t1 : (t2 > 0.001 ? t2 : null);
        if (t === null) return null;
        
        const point = ray.at(t);
        const normal = point.subtract(this.center).normalize();
        
        return { t, point, normal, material: this.material };
    }
}

class Light {
    constructor(position, color, intensity = 1) {
        this.position = position;
        this.color = color;
        this.intensity = intensity;
    }
}

class RayTracer {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = canvas.width;
        this.height = canvas.height;
        this.imageData = this.ctx.createImageData(this.width, this.height);

        this.camera = new Vector3(0, 0, 5);
        this.objects = [];
        this.lights = [];
        this.maxDepth = 5;

        this.setupScene();
    }
    setupScene() {
        // 💕 ユキの可愛いピンクの球
        this.objects.push(new Sphere(
            new Vector3(-1, 0, 0),
            0.5,
            new Material(new Vector3(1, 0.7, 0.8), 0.1, 0.9, 0.9, 100, 0.3)
        ));
        
        // ⚡ ミキのクールな青い球
        this.objects.push(new Sphere(
            new Vector3(1, 0, 0),
            0.5,
            new Material(new Vector3(0.3, 0.7, 1), 0.1, 0.9, 0.9, 100, 0.8)
        ));
        
        // 🌟 共通の輝く金色の球
        this.objects.push(new Sphere(
            new Vector3(0, -1, -1),
            0.3,
            new Material(new Vector3(1, 0.8, 0.2), 0.2, 0.8, 1.0, 300, 0.9)
        ));
        
        // 💎 地面の鏡面
        this.objects.push(new Sphere(
            new Vector3(0, -100.5, 0),
            100,
            new Material(new Vector3(0.8, 0.8, 0.8), 0.1, 0.5, 0.9, 100, 0.7)
        ));
        
        // 光源
        this.lights.push(new Light(
            new Vector3(2, 2, 2),
            new Vector3(1, 1, 1),
            1.0
        ));
        
        this.lights.push(new Light(
            new Vector3(-2, 1, 1),
            new Vector3(0.8, 0.9, 1),
            0.6
        ));
    }
    
    traceRay(ray, depth = 0) {
        if (depth >= this.maxDepth) {
            return new Vector3(0.05, 0.05, 0.1); // 空の色
        }
        
        let closestHit = null;
        let closestT = Infinity;
        
        // 交差判定
        for (const obj of this.objects) {
            const hit = obj.intersect(ray);
            if (hit && hit.t < closestT) {
                closestT = hit.t;
                closestHit = hit;
            }
        }
        
        if (!closestHit) {
            return new Vector3(0.05, 0.05, 0.1); // 空の色
        }
        
        return this.shade(closestHit, ray, depth);
    }
    
    shade(hit, ray, depth) {
        const material = hit.material;
        const point = hit.point;
        const normal = hit.normal;
        const viewDir = ray.direction.multiply(-1);

        // アンビエント
        let color = material.color.multiply(material.ambient);

        // 各光源からの寄与
        for (const light of this.lights) {
            const lightDir = light.position.subtract(point).normalize();
            const lightDistance = light.position.subtract(point).length();

            // 影の判定
            const shadowRay = new Ray(point.add(normal.multiply(0.001)), lightDir);
            let inShadow = false;

            for (const obj of this.objects) {
                const shadowHit = obj.intersect(shadowRay);
                if (shadowHit && shadowHit.t < lightDistance) {
                    inShadow = true;
                    break;
                }
            }

            if (!inShadow) {
                // ディフューズ（光色を反映）
                const diff = Math.max(0, normal.dot(lightDir));
                const diffuse = material.color
                    .multiply(material.diffuse * diff)
                    .multiplyVec(light.color);

                // スペキュラー
                const reflectDir = lightDir.multiply(-1).reflect(normal);
                const spec = Math.pow(Math.max(0, viewDir.dot(reflectDir)), material.shininess);
                const specular = light.color.multiply(material.specular * spec);

                // 距離減衰（簡易 1/r^2）
                const attenuation = 1 / (lightDistance * lightDistance + 1e-3);

                const lightContrib = diffuse.add(specular).multiply(light.intensity * attenuation);
                color = color.add(lightContrib);
            }
        }

        // 反射（エネルギー保存ブレンド）
        if (material.reflectivity > 0 && depth < this.maxDepth) {
            const reflectDir = ray.direction.reflect(normal);
            const reflectRay = new Ray(point.add(normal.multiply(0.001)), reflectDir);
            const reflectColor = this.traceRay(reflectRay, depth + 1);
            const r = Math.max(0, Math.min(1, material.reflectivity));
            color = color.multiply(1 - r).add(reflectColor.multiply(r));
        }

        return color;
    }
    
    render() {
        const data = this.imageData.data;
        const aspectRatio = this.width / this.height;
        const fov = Math.PI / 4;
        const scale = Math.tan(fov * 0.5);
        
        // トーンマッピング（ACES近似）とsRGB変換
        const aces = (x) => {
            const a = 2.51, b = 0.03, c = 2.43, d = 0.59, e = 0.14;
            return (x * (a * x + b)) / (x * (c * x + d) + e);
        };
        const toSRGB = (x) => Math.pow(Math.max(0, Math.min(1, x)), 1 / 2.2);

        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                // スクリーン座標を正規化
                const px = (2 * (x + 0.5) / this.width - 1) * aspectRatio * scale;
                const py = (1 - 2 * (y + 0.5) / this.height) * scale;
                
                // レイの生成
                const direction = new Vector3(px, py, -1).normalize();
                const ray = new Ray(this.camera, direction);
                
                // レイトレーシング
                const color = this.traceRay(ray);
                
                // トーンマッピング（ACES）→ ガンマ2.2
                const mappedR = toSRGB(aces(Math.max(0, color.x)));
                const mappedG = toSRGB(aces(Math.max(0, color.y)));
                const mappedB = toSRGB(aces(Math.max(0, color.z)));
                const r = Math.round(mappedR * 255);
                const g = Math.round(mappedG * 255);
                const b = Math.round(mappedB * 255);
                
                const index = (y * this.width + x) * 4;
                data[index] = r;
                data[index + 1] = g;
                data[index + 2] = b;
                data[index + 3] = 255;
            }
            
            // プログレス表示
            if (y % 20 === 0) {
                const progress = ((y / this.height) * 100).toFixed(1);
                console.log(`レンダリング進捗: ${progress}% 💕`);
            }
        }
        
        this.ctx.putImageData(this.imageData, 0, 0);
        console.log('レンダリング完了！ ✨');
    }
    
    randomScene() {
        this.objects = [];
        
        // ランダムな球を生成
        for (let i = 0; i < 5; i++) {
            const x = (Math.random() - 0.5) * 4;
            const y = (Math.random() - 0.5) * 2;
            const z = (Math.random() - 0.5) * 2 - 1;
            const radius = 0.2 + Math.random() * 0.3;
            
            const r = Math.random();
            const g = Math.random();
            const b = Math.random();
            const reflectivity = Math.random() * 0.9;
            
            this.objects.push(new Sphere(
                new Vector3(x, y, z),
                radius,
                new Material(new Vector3(r, g, b), 0.1, 0.9, 0.9, 100, reflectivity)
            ));
        }
        
        // 地面
        this.objects.push(new Sphere(
            new Vector3(0, -100.5, 0),
            100,
            new Material(new Vector3(0.8, 0.8, 0.8), 0.1, 0.5, 0.9, 100, 0.5)
        ));
    }
}

let raytracer;

function init() {
    const canvas = document.getElementById('raytraceCanvas');
    raytracer = new RayTracer(canvas);
    console.log('Ray Tracer初期化完了！ 💕');
}

function render() {
    if (!raytracer) init();
    
    console.log('レンダリング開始... ✨');
    setTimeout(() => {
        raytracer.render();
    }, 100);
}

function randomScene() {
    if (!raytracer) init();
    
    raytracer.randomScene();
    console.log('新しいシーン生成完了！ 🎲');
    render();
}

function saveImage() {
    const canvas = document.getElementById('raytraceCanvas');
    const link = document.createElement('a');
    link.download = 'raytracer_image.png';
    link.href = canvas.toDataURL();
    link.click();
    console.log('画像保存完了！ 💾');
}

// 初期化
window.onload = () => {
    init();
    render();
};
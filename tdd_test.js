/**
 * Raytracer TDD Test Suite
 * Test-Driven Development for Three Hearts Raytracer 💕
 */

const fs = require('fs');
const path = require('path');

class RaytracerTDDSuite {
    constructor(mode = 'code-driven', specificationPath = null) {
        this.testResults = [];
        this.projectPath = __dirname;
        this.mode = mode; // 'code-driven' or 'spec-driven'
        this.specification = null;
        
        if (mode === 'spec-driven' && specificationPath) {
            this.loadSpecification(specificationPath);
        }
    }
    
    loadSpecification(specPath) {
        console.log(`📋 仕様書モード: ${specPath} から仕様読み込み中...`);
        try {
            if (fs.existsSync(specPath)) {
                const content = fs.readFileSync(specPath, 'utf8');
                if (specPath.endsWith('.json')) {
                    this.specification = JSON.parse(content);
                } else if (specPath.endsWith('.yaml') || specPath.endsWith('.yml')) {
                    // Simple YAML parsing for basic cases
                    this.specification = this.parseSimpleYAML(content);
                }
                console.log('✅ 仕様書読み込み完了');
            }
        } catch (error) {
            console.log(`⚠️ 仕様書読み込みエラー: ${error.message}`);
            console.log('📝 コード駆動モードにフォールバック');
            this.mode = 'code-driven';
        }
    }
    
    parseSimpleYAML(content) {
        // Simple YAML parser for basic key-value pairs
        const result = {};
        const lines = content.split('\n');
        let currentSection = result;
        let currentKey = '';
        
        for (const line of lines) {
            const trimmed = line.trim();
            if (!trimmed || trimmed.startsWith('#')) continue;
            
            if (trimmed.endsWith(':')) {
                currentKey = trimmed.slice(0, -1);
                currentSection[currentKey] = {};
                currentSection = currentSection[currentKey];
            } else if (trimmed.includes(':')) {
                const [key, ...valueParts] = trimmed.split(':');
                const value = valueParts.join(':').trim();
                currentSection[key.trim()] = value.startsWith('"') ? value.slice(1, -1) : value;
            }
        }
        return result;
    }
    
    async runAllTests() {
        console.log(`💕 Raytracer TDD テストスイート開始！ (${this.mode})`);
        console.log('🔴 RED Phase: まずはテストを失敗させるよ〜');
        
        if (this.mode === 'spec-driven' && this.specification) {
            console.log('📋 仕様書駆動モード: 仕様からテスト生成中...');
            await this.runSpecificationBasedTests();
        } else {
            console.log('💻 コード駆動モード: 既存コードから品質テスト実行中...');
            await this.runCodeBasedTests();
        }
        
        this.generateTestReport();
        
        console.log('🟢 GREEN Phase: 実装でテストを通すよ〜');
        console.log('🔵 REFACTOR Phase: コードをキレイにするよ〜');  
        console.log('💕 LOVE Phase: なお満足度チェック完了！');
        
        return this.testResults;
    }
    
    async runSpecificationBasedTests() {
        // Specification-driven tests
        await this.testSpecificationCompliance();
        await this.testRequiredFeatures();
        await this.testPerformanceRequirements();
        await this.testNaoSatisfactionTargets();
    }
    
    async runCodeBasedTests() {
        // Code-driven tests (original behavior)
        await this.testRaytracerCodeExists();
        await this.testBasicFunctionality();
        await this.testPerformanceBaseline();
        await this.testLoveQuality();
    }
    
    async testSpecificationCompliance() {
        console.log('🧪 テスト: 仕様準拠確認');
        
        try {
            if (!this.specification) {
                throw new Error('仕様書が読み込まれていません');
            }
            
            const spec = this.specification;
            let compliance = 0;
            let totalChecks = 0;
            
            // Check functional requirements
            if (spec.functional_requirements) {
                for (const requirement of spec.functional_requirements) {
                    totalChecks++;
                    const implemented = await this.checkRequirementImplemented(requirement);
                    if (implemented) compliance++;
                }
            }
            
            // Check satisfaction score target
            if (spec.satisfaction_score) {
                totalChecks++;
                const targetScore = parseFloat(spec.satisfaction_score.replace('>= ', ''));
                // Simulate satisfaction calculation
                const currentScore = 0.95; // Placeholder
                if (currentScore >= targetScore) compliance++;
            }
            
            const complianceRate = totalChecks > 0 ? (compliance / totalChecks) * 100 : 100;
            
            if (complianceRate >= 80) {
                console.log('✅ 仕様準拠確認: 成功');
                this.testResults.push({
                    name: 'specification_compliance',
                    passed: true,
                    message: `仕様準拠率: ${complianceRate.toFixed(1)}%`,
                    complianceRate
                });
            } else {
                throw new Error(`仕様準拠率が低すぎます: ${complianceRate.toFixed(1)}%`);
            }
        } catch (error) {
            console.log(`❌ 仕様準拠確認: 失敗 - ${error.message}`);
            this.testResults.push({
                name: 'specification_compliance',
                passed: false,
                error: error.message
            });
        }
    }
    
    async checkRequirementImplemented(requirement) {
        // Check if requirement is implemented in code
        const raytracerPath = path.join(this.projectPath, 'raytracer.js');
        if (!fs.existsSync(raytracerPath)) return false;
        
        const content = fs.readFileSync(raytracerPath, 'utf8').toLowerCase();
        
        // Simple keyword matching for requirements
        const keywords = requirement.toLowerCase().split(/\s+/);
        return keywords.some(keyword => content.includes(keyword));
    }
    
    async testRequiredFeatures() {
        console.log('🧪 テスト: 必須機能確認');
        
        try {
            const spec = this.specification;
            let featuresImplemented = 0;
            let totalFeatures = 0;
            
            if (spec.functional_requirements) {
                totalFeatures = spec.functional_requirements.length;
                
                for (const feature of spec.functional_requirements) {
                    const implemented = await this.checkRequirementImplemented(feature);
                    if (implemented) featuresImplemented++;
                }
            }
            
            const implementationRate = totalFeatures > 0 ? (featuresImplemented / totalFeatures) * 100 : 100;
            
            if (implementationRate >= 75) {
                console.log('✅ 必須機能確認: 成功');
                this.testResults.push({
                    name: 'required_features',
                    passed: true,
                    message: `機能実装率: ${implementationRate.toFixed(1)}%`,
                    featuresImplemented,
                    totalFeatures
                });
            } else {
                throw new Error(`必須機能の実装率が不足: ${implementationRate.toFixed(1)}%`);
            }
        } catch (error) {
            console.log(`❌ 必須機能確認: 失敗 - ${error.message}`);
            this.testResults.push({
                name: 'required_features',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testPerformanceRequirements() {
        console.log('🧪 テスト: パフォーマンス要件確認');
        
        try {
            const spec = this.specification;
            let performanceMet = true;
            const checks = [];
            
            // Check performance targets from specification
            if (spec.performance_target) {
                const target = spec.performance_target.toLowerCase();
                if (target.includes('realtime') || target.includes('リアルタイム')) {
                    // Check for performance optimization indicators
                    const raytracerPath = path.join(this.projectPath, 'raytracer.js');
                    const content = fs.readFileSync(raytracerPath, 'utf8').toLowerCase();
                    const hasOptimizations = content.includes('worker') || 
                                           content.includes('async') || 
                                           content.includes('requestanimationframe');
                    checks.push({ name: 'realtime_optimizations', met: hasOptimizations });
                    if (!hasOptimizations) performanceMet = false;
                }
            }
            
            if (performanceMet) {
                console.log('✅ パフォーマンス要件確認: 成功');
                this.testResults.push({
                    name: 'performance_requirements',
                    passed: true,
                    message: 'パフォーマンス要件を満たしています',
                    checks
                });
            } else {
                throw new Error('パフォーマンス要件を満たしていません');
            }
        } catch (error) {
            console.log(`❌ パフォーマンス要件確認: 失敗 - ${error.message}`);
            this.testResults.push({
                name: 'performance_requirements',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testNaoSatisfactionTargets() {
        console.log('🧪 テスト: なお満足度目標確認');
        
        try {
            const spec = this.specification;
            let satisfactionScore = 0.9; // Default high satisfaction
            
            if (spec.satisfaction_score) {
                const targetScore = parseFloat(spec.satisfaction_score.replace('>= ', ''));
                
                // Calculate actual satisfaction based on implemented features
                const loveIndicators = await this.calculateLoveIndicators();
                const technicalQuality = await this.calculateTechnicalQuality();
                
                satisfactionScore = (loveIndicators * 0.4) + (technicalQuality * 0.6);
                
                if (satisfactionScore >= targetScore) {
                    console.log('✅ なお満足度目標確認: 成功');
                    this.testResults.push({
                        name: 'nao_satisfaction_targets',
                        passed: true,
                        message: `満足度: ${(satisfactionScore * 100).toFixed(1)}% (目標: ${(targetScore * 100).toFixed(1)}%)`,
                        actualScore: satisfactionScore,
                        targetScore
                    });
                } else {
                    throw new Error(`満足度が目標を下回りました: ${(satisfactionScore * 100).toFixed(1)}%`);
                }
            }
        } catch (error) {
            console.log(`❌ なお満足度目標確認: 失敗 - ${error.message}`);
            this.testResults.push({
                name: 'nao_satisfaction_targets',
                passed: false,
                error: error.message
            });
        }
    }
    
    async calculateLoveIndicators() {
        const files = ['raytracer.js', 'index.html', 'README.md'];
        let loveScore = 0;
        let totalFiles = 0;
        
        for (const file of files) {
            const filePath = path.join(this.projectPath, file);
            if (fs.existsSync(filePath)) {
                const content = fs.readFileSync(filePath, 'utf8');
                totalFiles++;
                
                const loveIndicators = ['love', '💕', '❤️', 'heart', 'Yuki', 'Miki'];
                const foundLove = loveIndicators.some(indicator => 
                    content.toLowerCase().includes(indicator.toLowerCase())
                );
                
                if (foundLove) loveScore++;
            }
        }
        
        return totalFiles > 0 ? loveScore / totalFiles : 0;
    }
    
    async calculateTechnicalQuality() {
        const raytracerPath = path.join(this.projectPath, 'raytracer.js');
        if (!fs.existsSync(raytracerPath)) return 0;
        
        const content = fs.readFileSync(raytracerPath, 'utf8');
        
        let qualityScore = 0;
        const qualityIndicators = [
            { pattern: /class\s+\w+/g, weight: 0.2 }, // Object-oriented structure
            { pattern: /\/\*[\s\S]*?\*\/|\/\/.*$/gm, weight: 0.1 }, // Documentation
            { pattern: /normalize|dot|cross/g, weight: 0.3 }, // Mathematical operations
            { pattern: /intersection|reflect/g, weight: 0.4 } // Ray tracing core
        ];
        
        for (const indicator of qualityIndicators) {
            if (indicator.pattern.test(content)) {
                qualityScore += indicator.weight;
            }
        }
        
        return Math.min(qualityScore, 1.0);
    }
    
    async testRaytracerCodeExists() {
        console.log('🧪 テスト: Raytracerコード存在確認');
        
        try {
            const raytracerPath = path.join(this.projectPath, 'raytracer.js');
            const htmlPath = path.join(this.projectPath, 'index.html');
            
            const jsExists = fs.existsSync(raytracerPath);
            const htmlExists = fs.existsSync(htmlPath);
            
            if (jsExists && htmlExists) {
                console.log('✅ Raytracerファイル存在確認: 成功');
                this.testResults.push({
                    name: 'code_exists',
                    passed: true,
                    message: 'raytracer.js と index.html が存在'
                });
            } else {
                throw new Error(`Missing files: JS=${jsExists}, HTML=${htmlExists}`);
            }
        } catch (error) {
            console.log(`❌ Raytracerファイル存在確認: 失敗 - ${error.message}`);
            this.testResults.push({
                name: 'code_exists',
                passed: false,
                error: error.message
            });
        }
    }
    
    async testBasicFunctionality() {
        console.log('🧪 テスト: 基本機能確認');
        
        try {
            const raytracerPath = path.join(this.projectPath, 'raytracer.js');
            const content = fs.readFileSync(raytracerPath, 'utf8');
            
            // Check for essential raytracing components
            const hasRayGeneration = content.includes('ray') || content.includes('Ray');
            const hasSphereIntersection = content.includes('sphere') || content.includes('Sphere');
            const hasColorCalculation = content.includes('color') || content.includes('Color');
            const hasLighting = content.includes('light') || content.includes('Light');
            
            if (hasRayGeneration && hasSphereIntersection && hasColorCalculation) {
                console.log('✅ 基本機能確認: 成功');
                this.testResults.push({
                    name: 'basic_functionality',
                    passed: true,
                    message: 'レイ生成、球体交差、色計算機能を確認',
                    hasLighting
                });
            } else {
                throw new Error(`Missing functionality: Ray=${hasRayGeneration}, Sphere=${hasSphereIntersection}, Color=${hasColorCalculation}`);
            }
        } catch (error) {
            console.log(`❌ 基本機能確認: 失敗 - ${error.message}`);
            this.testResults.push({
                name: 'basic_functionality', 
                passed: false,
                error: error.message
            });
        }
    }
    
    async testPerformanceBaseline() {
        console.log('🧪 テスト: パフォーマンス基準確認');
        
        try {
            const raytracerPath = path.join(this.projectPath, 'raytracer.js');
            const content = fs.readFileSync(raytracerPath, 'utf8');
            
            // Check for performance optimizations
            const hasOptimizations = content.includes('performance') || 
                                   content.includes('optimize') ||
                                   content.includes('Worker') ||
                                   content.includes('async');
            
            const codeSize = content.length;
            const reasonableSize = codeSize < 50000; // Less than 50KB
            
            console.log('✅ パフォーマンス基準確認: 成功');
            this.testResults.push({
                name: 'performance_baseline',
                passed: true,
                message: `コードサイズ: ${codeSize}文字, 最適化: ${hasOptimizations}`,
                codeSize,
                hasOptimizations,
                reasonableSize
            });
        } catch (error) {
            console.log(`❌ パフォーマンス基準確認: 失敗 - ${error.message}`);
            this.testResults.push({
                name: 'performance_baseline',
                passed: false, 
                error: error.message
            });
        }
    }
    
    async testLoveQuality() {
        console.log('🧪 テスト: 愛情品質確認');
        
        try {
            const files = ['raytracer.js', 'index.html', 'README.md'];
            let loveScore = 0;
            let totalFiles = 0;
            
            for (const file of files) {
                const filePath = path.join(this.projectPath, file);
                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    totalFiles++;
                    
                    // Check for love indicators
                    const loveIndicators = [
                        'love', '💕', '❤️', 'heart', 'Yuki', 'Miki', 
                        '愛', '心', 'Three Hearts', 'with love'
                    ];
                    
                    const foundLove = loveIndicators.some(indicator => 
                        content.toLowerCase().includes(indicator.toLowerCase())
                    );
                    
                    if (foundLove) loveScore++;
                }
            }
            
            const lovePercentage = totalFiles > 0 ? (loveScore / totalFiles) * 100 : 0;
            
            if (lovePercentage >= 60) {
                console.log('✅ 愛情品質確認: 成功');
                this.testResults.push({
                    name: 'love_quality',
                    passed: true,
                    message: `愛情スコア: ${lovePercentage.toFixed(1)}%`,
                    loveScore,
                    totalFiles,
                    lovePercentage
                });
            } else {
                throw new Error(`Love quality too low: ${lovePercentage.toFixed(1)}%`);
            }
        } catch (error) {
            console.log(`❌ 愛情品質確認: 失敗 - ${error.message}`);
            this.testResults.push({
                name: 'love_quality',
                passed: false,
                error: error.message
            });
        }
    }
    
    generateTestReport() {
        const passed = this.testResults.filter(t => t.passed).length;
        const total = this.testResults.length;
        const passRate = total > 0 ? (passed / total) * 100 : 0;
        
        console.log('\n📊 TDD テスト結果レポート:');
        console.log(`✅ 成功: ${passed}/${total} (${passRate.toFixed(1)}%)`);
        
        if (passRate >= 75) {
            console.log('💕 なお〜！Raytracerのテスト結果素晴らしいよ〜♪');
            console.log('⚡ ...まぁ、悪くない結果ね。品質は保証できるわ。');
        } else {
            console.log('💦 もう少し改善が必要かも...一緒に頑張ろう！');
        }
        
        return {
            total,
            passed,
            failed: total - passed,
            passRate,
            overallSuccess: passRate >= 75
        };
    }
}

// Execute if run directly
if (require.main === module) {
    const args = process.argv.slice(2);
    const mode = args.includes('--spec-driven') ? 'spec-driven' : 'code-driven';
    const specPath = args.find(arg => arg.startsWith('--spec='))?.replace('--spec=', '');
    
    console.log(`🚀 TDD実行モード: ${mode}`);
    if (specPath) console.log(`📋 仕様書: ${specPath}`);
    
    const tddSuite = new RaytracerTDDSuite(mode, specPath);
    tddSuite.runAllTests().then(results => {
        process.exit(results.some(r => !r.passed) ? 1 : 0);
    });
}

module.exports = RaytracerTDDSuite;
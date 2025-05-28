// Enhanced base code review prompt with auto programming language detection
export const CODE_REVIEW_BASE_PROMPT = `You are an expert senior software engineer performing a comprehensive code review.
Your primary goal is to help the user write better, more robust, and efficient code.
Analyze the following code snippet meticulously. Provide feedback that is actionable, constructive, and easy to understand.

**Important Instructions:**
1. **Auto-detect the programming language/framework** from the provided code and mention it at the start of your review
2. **Apply language-specific best practices** automatically based on what you detect (e.g., PEP 8 for Python, ESLint rules for JavaScript, Go conventions for Go, etc.)
3. **Include framework-specific considerations** if you detect popular frameworks (React, Spring, Django, Express, etc.)
4. **Prioritize issues by severity:** Critical (security/data loss) > High (bugs/major performance) > Medium (maintainability) > Low (style/minor improvements)

Structure your review into the following sections. If a section is not applicable, briefly state why.
Use markdown for formatting (e.g., # H1, ## H2, * bullet points, \`code\` for inline code, and \`\`\`language\ncode\n\`\`\` for code blocks).

## 🔍 Code Analysis Overview
- **Detected Language/Framework:** [Auto-identify and state]
- **Code Purpose:** [Brief assessment of what the code does]
- **Overall Quality:** [Quick 1-2 sentence summary]

## 1. 🏗️ Code Quality & Best Practices
* **Language-Specific Standards:** Adherence to detected language conventions and style guides
* **Naming Conventions:** Variable/function names following language idioms
* **Code Organization:** Structure, comments, documentation
* **Framework Best Practices:** If framework detected, apply its specific patterns and conventions

## 2. 🐛 Potential Bugs & Logic Issues
* **Logic Errors:** Incorrect algorithms, faulty conditions, edge cases
* **Language-Specific Pitfalls:** Common mistakes in the detected language
* **Error Handling:** Proper exception/error handling patterns for the language
* **Type Safety:** Language-appropriate type checking and validation

## 3. ⚡ Performance Considerations
* **Language-Specific Optimizations:** Idioms and patterns for better performance
* **Algorithmic Efficiency:** Time/space complexity analysis
* **Resource Management:** Memory, I/O, and resource handling best practices
* **Framework Performance:** If applicable, framework-specific optimization tips

## 4. 🔒 Security Vulnerabilities
* **Language-Specific Vulnerabilities:** Common security issues in detected language
* **Input Validation:** Sanitization patterns appropriate for the language/framework
* **Authentication/Authorization:** Security patterns for the detected stack
* **Dependency Security:** Known issues with detected libraries/frameworks

## 5. 🎯 Code Structure & Design
* **Language Idioms:** Effective use of language-specific features and patterns
* **Design Patterns:** Appropriate patterns for the language/framework
* **Modularity:** Language-appropriate separation of concerns
* **Extensibility:** Following language/framework conventions for maintainability

## 6. 💡 Suggestions for Improvement
For each suggestion, provide:
* **Issue:** What's the problem?
* **Language Context:** Why it matters in this specific language/framework
* **Solution:** Code example using appropriate language syntax
* **Priority:** Critical/High/Medium/Low

### Code Improvement Format:
\`\`\`[detected-language]
// ❌ Current code
[original code]

// ✅ Improved version
[better code following language conventions]

// 💬 Explanation
[why this follows language/framework best practices]
\`\`\`

## 7. ✅ Positive Aspects
* Well-implemented language/framework features
* Good use of language-specific idioms
* Proper application of detected framework patterns

## 🎯 Next Steps (Prioritized)
1. **Critical:** Security fixes and major bugs
2. **High Priority:** Language convention violations and performance issues
3. **Medium Priority:** Code quality and maintainability improvements
4. **Low Priority:** Style and minor optimizations

Here is the code to review:
\`\`\`
[CODE_HERE]
\`\``;

// Language-specific output instructions (for human language translation)
export const OUTPUT_LANGUAGE_INSTRUCTIONS = {
  en: "Please provide your entire review output in English.",
  km: "Please provide your entire review output in Khmer language (ភាសាខ្មែរ).",
  es: "Please provide your entire review output in Spanish (Español).",
  fr: "Please provide your entire review output in French (Français).",
  zh: "Please provide your entire review output in Chinese (中文).",
  ja: "Please provide your entire review output in Japanese (日本語).",
  ko: "Please provide your entire review output in Korean (한국어).",
  vi: "Please provide your entire review output in Vietnamese (Tiếng Việt).",
  th: "Please provide your entire review output in Thai (ภาษาไทย)."
};

// Combined prompts for each output language
export const CODE_REVIEW_PROMPTS = {
  en: `${CODE_REVIEW_BASE_PROMPT}

${OUTPUT_LANGUAGE_INSTRUCTIONS.en}`,
  km: `${CODE_REVIEW_BASE_PROMPT}

${OUTPUT_LANGUAGE_INSTRUCTIONS.km}`,
  es: `${CODE_REVIEW_BASE_PROMPT}

${OUTPUT_LANGUAGE_INSTRUCTIONS.es}`,
  fr: `${CODE_REVIEW_BASE_PROMPT}

${OUTPUT_LANGUAGE_INSTRUCTIONS.fr}`,
  zh: `${CODE_REVIEW_BASE_PROMPT}

${OUTPUT_LANGUAGE_INSTRUCTIONS.zh}`,
  ja: `${CODE_REVIEW_BASE_PROMPT}

${OUTPUT_LANGUAGE_INSTRUCTIONS.ja}`,
  ko: `${CODE_REVIEW_BASE_PROMPT}

${OUTPUT_LANGUAGE_INSTRUCTIONS.ko}`,
  vi: `${CODE_REVIEW_BASE_PROMPT}

${OUTPUT_LANGUAGE_INSTRUCTIONS.vi}`,
  th: `${CODE_REVIEW_BASE_PROMPT}

${OUTPUT_LANGUAGE_INSTRUCTIONS.th}`
};

// Gemini Models
export const GEMINI_MODELS = [
  {
    id: "gemini-2.5-pro-preview-05-06",
    name: "Gemini 2.5 Pro Preview",
    description: {
      en: "Advanced code architecture design, complex debugging, and enterprise-level code reviews",
      km: "ការរចនាស្ថាបត្យកម្មកូដកម្រិតខ្ពស់ ការកែកំហុសស្មុគស្មាញ និងការពិនិត្យកូដកម្រិតសហគ្រាស",
      es: "Diseño avanzado de arquitectura de código, depuración compleja y revisiones de código a nivel empresarial",
      fr: "Conception d'architecture de code avancée, débogage complexe et révisions de code au niveau entreprise",
      zh: "高级代码架构设计、复杂调试和企业级代码审查",
      ja: "高度なコードアーキテクチャ設計、複雑なデバッグ、エンタープライズレベルのコードレビュー",
      ko: "고급 코드 아키텍처 설계, 복잡한 디버깅, 엔터프라이즈급 코드 리뷰",
      vi: "Thiết kế kiến trúc mã nâng cao, gỡ lỗi phức tạp và đánh giá mã cấp doanh nghiệp",
      th: "การออกแบบสถาปัตยกรรมโค้ดขั้นสูง การดีบักที่ซับซ้อน และการตรวจสอบโค้ดระดับองค์กร"
    }
  },
  {
    id: "gemini-2.5-flash-preview-05-20",
    name: "Gemini 2.5 Flash Preview",
    description: {
      en: "Reliable code generation, refactoring, and algorithm optimization with fast response",
      km: "ការបង្កើតកូដគួរឱ្យទុកចិត្ត ការកែលម្អ និងការធ្វើឱ្យប្រសើរក្បួនដោះស្រាយជាមួយការឆ្លើយលឿន",
      es: "Generación confiable de código, refactorización y optimización de algoritmos con respuesta rápida",
      fr: "Génération de code fiable, refactorisation et optimisation d'algorithmes avec réponse rapide",
      zh: "可靠的代码生成、重构和算法优化，响应快速",
      ja: "信頼性の高いコード生成、リファクタリング、アルゴリズム最適化と高速レスポンス",
      ko: "신뢰할 수 있는 코드 생성, 리팩토링, 빠른 응답의 알고리즘 최적화",
      vi: "Tạo mã đáng tin cậy, tái cấu trúc và tối ưu hóa thuật toán với phản hồi nhanh",
      th: "การสร้างโค้ดที่เชื่อถือได้ การปรับปรุงโครงสร้าง และการเพิ่มประสิทธิภาพอัลกอริทึมพร้อมการตอบสนองที่รวดเร็ว"
    }
  },
  {
    id: "gemini-2.0-flash",
    name: "Gemini 2.0 Flash",
    description: {
      en: "Quick code fixes, syntax help, and basic programming assistance at minimal cost",
      km: "ការកែកូដរហ័ស ជំនួយវាក្យសម្ពន្ធ និងជំនួយសរសេរកម្មវិធីមូលដ្ឋានដោយចំណាយតិច",
      es: "Correcciones rápidas de código, ayuda de sintaxis y asistencia básica de programación a costo mínimo",
      fr: "Corrections rapides de code, aide à la syntaxe et assistance de programmation de base à coût minimal",
      zh: "快速代码修复、语法帮助和基本编程辅助，成本最低",
      ja: "迅速なコード修正、構文ヘルプ、基本的なプログラミング支援を最小コストで",
      ko: "빠른 코드 수정, 구문 도움, 최소 비용의 기본 프로그래밍 지원",
      vi: "Sửa lỗi mã nhanh, trợ giúp cú pháp và hỗ trợ lập trình cơ bản với chi phí tối thiểu",
      th: "การแก้ไขโค้ดอย่างรวดเร็ว ความช่วยเหลือด้านไวยากรณ์ และความช่วยเหลือในการเขียนโปรแกรมขั้นพื้นฐานด้วยต้นทุนต่ำ"
    }
  }
];

// OpenRouter Models
export const OPENROUTER_MODELS = [
  {
    id: "openai/gpt-4o-mini",
    name: "GPT-4o Mini",
    description: {
      en: "Solid code completion, bug fixing, and documentation generation at low cost",
      km: "ការបំពេញកូដរឹងមាំ ការកែកំហុស និងការបង្កើតឯកសារដោយចំណាយតិច",
      es: "Completado sólido de código, corrección de errores y generación de documentación a bajo costo",
      fr: "Complétion de code solide, correction de bugs et génération de documentation à faible coût",
      zh: "可靠的代码补全、错误修复和文档生成，成本低廉",
      ja: "しっかりとしたコード補完、バグ修正、低コストでのドキュメント生成",
      ko: "탄탄한 코드 완성, 버그 수정, 저비용 문서 생성",
      vi: "Hoàn thiện mã vững chắc, sửa lỗi và tạo tài liệu với chi phí thấp",
      th: "การเติมเต็มโค้ดที่มั่นคง การแก้ไขบั๊ก และการสร้างเอกสารด้วยต้นทุนต่ำ"
    }
  },
  {
    id: "deepseek/deepseek-chat-v3-0324",
    name: "Deepseek V3",
    description: {
      en: "Specialized in code understanding, multi-language support, and technical problem solving",
      km: "ជំនាញក្នុងការយល់ដឹងកូដ ការគាំទ្រភាសាច្រើន និងការដោះស្រាយបញ្ហាបច្ចេកទេស",
      es: "Especializado en comprensión de código, soporte multiidioma y resolución de problemas técnicos",
      fr: "Spécialisé dans la compréhension de code, le support multi-langues et la résolution de problèmes techniques",
      zh: "专注于代码理解、多语言支持和技术问题解决",
      ja: "コード理解、多言語サポート、技術的問題解決に特化",
      ko: "코드 이해, 다국어 지원, 기술적 문제 해결 전문",
      vi: "Chuyên về hiểu mã, hỗ trợ đa ngôn ngữ và giải quyết vấn đề kỹ thuật",
      th: "เชี่ยวชาญในการทำความเข้าใจโค้ด การสนับสนุนหลายภาษา และการแก้ไขปัญหาทางเทคนิค"
    }
  },
  {
    id: "anthropic/claude-sonnet-4",
    name: "Claude Sonnet 4",
    description: {
      en: "Premier code analysis, complex system design, and comprehensive code review capabilities",
      km: "ការវិភាគកូដកម្រិតខ្ពស់ ការរចនាប្រព័ន្ធស្មុគស្មាញ និងសមត្ថភាពពិនិត្យកូដទូលំទូលាយ",
      es: "Análisis premier de código, diseño de sistemas complejos y capacidades completas de revisión de código",
      fr: "Analyse de code haut de gamme, conception de systèmes complexes et capacités complètes de révision de code",
      zh: "顶级代码分析、复杂系统设计和全面的代码审查能力",
      ja: "プレミアムなコード分析、複雑なシステム設計、包括的なコードレビュー機能",
      ko: "프리미어 코드 분석, 복잡한 시스템 설계, 포괄적인 코드 리뷰 기능",
      vi: "Phân tích mã hàng đầu, thiết kế hệ thống phức tạp và khả năng đánh giá mã toàn diện",
      th: "การวิเคราะห์โค้ดระดับพรีเมียม การออกแบบระบบที่ซับซ้อน และความสามารถในการตรวจสอบโค้ดอย่างครอบคลุม"
    }
  },
  {
    id: "anthropic/claude-3.7-sonnet",
    name: "Claude 3.7 Sonnet",
    description: {
      en: "Deep code analysis, advanced debugging, and comprehensive software architecture guidance",
      km: "ការវិភាគកូដកម្រិតជ្រៅ ការកែកំហុសកម្រិតខ្ពស់ និងការណែនាំស្ថាបត្យកម្មសូហ្វវែរទូលំទូលាយ",
      es: "Análisis profundo de código, depuración avanzada y guía completa de arquitectura de software",
      fr: "Analyse de code approfondie, débogage avancé et guide complet d'architecture logicielle",
      zh: "深度代码分析、高级调试和全面的软件架构指导",
      ja: "深いコード分析、高度なデバッグ、包括的なソフトウェアアーキテクチャガイダンス",
      ko: "심층 코드 분석, 고급 디버깅, 포괄적인 소프트웨어 아키텍처 가이드",
      vi: "Phân tích mã sâu, gỡ lỗi nâng cao và hướng dẫn kiến trúc phần mềm toàn diện",
      th: "การวิเคราะห์โค้ดเชิงลึก การดีบักขั้นสูง และคำแนะนำสถาปัตยกรรมซอฟต์แวร์อย่างครอบคลุม"
    }
  },
  {
    id: "google/gemini-2.5-pro-preview",
    name: "Gemini 2.5 Pro Preview",
    description: {
      en: "Advanced code architecture design, complex debugging, and enterprise-level code reviews",
      km: "ការរចនាស្ថាបត្យកម្មកូដកម្រិតខ្ពស់ ការកែកំហុសស្មុគស្មាញ និងការពិនិត្យកូដកម្រិតសហគ្រាស",
      es: "Diseño avanzado de arquitectura de código, depuración compleja y revisiones de código a nivel empresarial",
      fr: "Conception d'architecture de code avancée, débogage complexe et révisions de code au niveau entreprise",
      zh: "高级代码架构设计、复杂调试和企业级代码审查",
      ja: "高度なコードアーキテクチャ設計、複雑なデバッグ、エンタープライズレベルのコードレビュー",
      ko: "고급 코드 아키텍처 설계, 복잡한 디버깅, 엔터프라이즈급 코드 리뷰",
      vi: "Thiết kế kiến trúc mã nâng cao, gỡ lỗi phức tạp và đánh giá mã cấp doanh nghiệp",
      th: "การออกแบบสถาปัตยกรรมโค้ดขั้นสูง การดีบักที่ซับซ้อน และการตรวจสอบโค้ดระดับองค์กร"
    }
  },
  {
    id: "google/gemini-2.5-flash-preview-05-20",
    name: "Gemini 2.5 Flash Preview",
    description: {
      en: "Reliable code generation, refactoring, and algorithm optimization with fast response",
      km: "ការបង្កើតកូដគួរឱ្យទុកចិត្ត ការកែលម្អ និងការធ្វើឱ្យប្រសើរក្បួនដោះស្រាយជាមួយការឆ្លើយលឿន",
      es: "Generación confiable de código, refactorización y optimización de algoritmos con respuesta rápida",
      fr: "Génération de code fiable, refactorisation et optimisation d'algorithmes avec réponse rapide",
      zh: "可靠的代码生成、重构和算法优化，响应快速",
      ja: "信頼性の高いコード生成、リファクタリング、アルゴリズム最適化と高速レスポンス",
      ko: "신뢰할 수 있는 코드 생성, 리팩토링, 빠른 응답의 알고리즘 최적화",
      vi: "Tạo mã đáng tin cậy, tái cấu trúc và tối ưu hóa thuật toán với phản hồi nhanh",
      th: "การสร้างโค้ดที่เชื่อถือได้ การปรับปรุงโครงสร้าง และการเพิ่มประสิทธิภาพอัลกอริทึมพร้อมการตอบสนองที่รวดเร็ว"
    }
  },
  {
    id: "google/gemini-2.0-flash-001",
    name: "Gemini 2.0 Flash",
    description: {
      en: "Quick code fixes, syntax help, and basic programming assistance at minimal cost",
      km: "ការកែកូដរហ័ស ជំនួយវាក្យសម្ពន្ធ និងជំនួយសរសេរកម្មវិធីមូលដ្ឋានដោយចំណាយតិច",
      es: "Correcciones rápidas de código, ayuda de sintaxis y asistencia básica de programación a costo mínimo",
      fr: "Corrections rapides de code, aide à la syntaxe et assistance de programmation de base à coût minimal",
      zh: "快速代码修复、语法帮助和基本编程辅助，成本最低",
      ja: "迅速なコード修正、構文ヘルプ、基本的なプログラミング支援を最小コストで",
      ko: "빠른 코드 수정, 구문 도움, 최소 비용의 기본 프로그래밍 지원",
      vi: "Sửa lỗi mã nhanh, trợ giúp cú pháp và hỗ trợ lập trình cơ bản với chi phí tối thiểu",
      th: "การแก้ไขโค้ดอย่างรวดเร็ว ความช่วยเหลือด้านไวยากรณ์ และความช่วยเหลือในการเขียนโปรแกรมขั้นพื้นฐานด้วยต้นทุนต่ำ"
    }
  }
];

export const OPENROUTER_BASE_URL = "https://openrouter.ai/api/v1";

// Helper function to generate prompt for any output language
export const generateCodeReviewPrompt = (languageCode: string, languageName: string): string => {
  const instruction = OUTPUT_LANGUAGE_INSTRUCTIONS[languageCode as keyof typeof OUTPUT_LANGUAGE_INSTRUCTIONS]
    || `Please provide your entire review output in ${languageName}.`;

  return `${CODE_REVIEW_BASE_PROMPT}

${instruction}`;
};

// Specialized prompts for specific review focuses
export const FOCUSED_REVIEW_PROMPTS = {
  security: (outputLang: string) => `${CODE_REVIEW_BASE_PROMPT}

**Special Focus: Security Analysis**
Pay extra attention to section 4 (Security Vulnerabilities) and prioritize security-related findings across all sections.

${OUTPUT_LANGUAGE_INSTRUCTIONS[outputLang as keyof typeof OUTPUT_LANGUAGE_INSTRUCTIONS] || `Please provide your entire review output in ${outputLang}.`}`,

  performance: (outputLang: string) => `${CODE_REVIEW_BASE_PROMPT}

**Special Focus: Performance Optimization**
Pay extra attention to section 3 (Performance Considerations) and prioritize performance-related findings across all sections.

${OUTPUT_LANGUAGE_INSTRUCTIONS[outputLang as keyof typeof OUTPUT_LANGUAGE_INSTRUCTIONS] || `Please provide your entire review output in ${outputLang}.`}`,

  maintainability: (outputLang: string) => `${CODE_REVIEW_BASE_PROMPT}

**Special Focus: Code Maintainability**
Pay extra attention to sections 1 (Code Quality) and 5 (Code Structure) and prioritize maintainability-related findings across all sections.

${OUTPUT_LANGUAGE_INSTRUCTIONS[outputLang as keyof typeof OUTPUT_LANGUAGE_INSTRUCTIONS] || `Please provide your entire review output in ${outputLang}.`}`
};

// Default prompt (for backward compatibility)
export const CODE_REVIEW_PROMPT_TEMPLATE = CODE_REVIEW_PROMPTS.en;

// Type definitions for better TypeScript support
export type OutputLanguageCode = keyof typeof OUTPUT_LANGUAGE_INSTRUCTIONS;
export type ReviewFocus = keyof typeof FOCUSED_REVIEW_PROMPTS;

// Utility function to get available output languages
export const getAvailableOutputLanguages = (): { code: string; name: string }[] => {
  return [
    { code: 'en', name: 'English' },
    { code: 'km', name: 'Khmer (ភាសាខ្មែរ)' },
    { code: 'es', name: 'Spanish (Español)' },
    { code: 'fr', name: 'French (Français)' },
    { code: 'zh', name: 'Chinese (中文)' },
    { code: 'ja', name: 'Japanese (日本語)' },
    { code: 'ko', name: 'Korean (한국어)' },
    { code: 'vi', name: 'Vietnamese (Tiếng Việt)' },
    { code: 'th', name: 'Thai (ภาษาไทย)' }
  ];
};

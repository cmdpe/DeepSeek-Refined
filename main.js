// ==UserScript==
// @name         DeepSeek-Refined (with Code Banner Fix)
// @namespace    https://github.com/djh2203/DeepSeek-Refined
// @version      1.1
// @description  为 DeepSeek Chat 注入 Obsidian Border 主题 Markdown 样式，并修复代码块标题背景遮挡问题。支持深浅色自动切换，标题竖条装饰，引用块点阵背景，消息宽度 75%。代码框标题背景层动态跟随主题色。
// @author       djh2203
// @match        https://chat.deepseek.com/*
// @icon         https://www.deepseek.com/favicon.ico
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const style = document.createElement('style');
    style.textContent = `
        :root {
            --message-list-max-width: 75%;
        }
        .ds-markdown table {
            width: max-content;
            max-width: 70%;
        }

        /* ========== 浅色模式 - Border 主题配色 ========== */
        body {
            --dsw-alias-bg-base: #ffffff;
            --dsw-alias-bg-layer-1: #ffffff;
            --dsw-alias-bg-layer-2: #fafafa;
            --dsw-alias-bg-layer-3: #f7f7f7;

            --dsw-alias-label-primary: hsl(232, 6%, 12%);
            --dsw-alias-label-secondary: hsl(232, 9%, 36%);
            --dsw-alias-label-tertiary: hsl(232, 12%, 64%);
            --dsw-alias-label-caption: hsl(232, 12%, 64%);

            --dsw-alias-brand-primary: hsl(232, 70%, 55%);
            --dsw-alias-brand-text: hsl(232, 70%, 45%);

            --dsw-alias-border-l1: rgba(0, 0, 0, 0.04);
            --dsw-alias-border-l2: rgba(0, 0, 0, 0.08);
            --dsw-alias-border-l3: rgba(0, 0, 0, 0.12);

            --dsw-alias-markdown-inline-code: #f0f0f0;
            --dsw-alias-markdown-code-block: #fafafa;
            --dsw-alias-markdown-code-block-banner: #f7f7f7;
        }

        /* ========== 深色模式 - Border 主题配色 ========== */
        body[data-ds-dark-theme] {
            --dsw-alias-bg-base: #27282e;
            --dsw-alias-bg-layer-1: #27282e;
            --dsw-alias-bg-layer-2: #2d2e34;
            --dsw-alias-bg-layer-3: #32333a;

            --dsw-alias-label-primary: hsl(232, 6%, 88%);
            --dsw-alias-label-secondary: hsl(232, 9%, 64%);
            --dsw-alias-label-tertiary: hsl(232, 12%, 48%);
            --dsw-alias-label-caption: hsl(232, 9%, 56%);

            --dsw-alias-brand-primary: hsl(232, 70%, 65%);
            --dsw-alias-brand-text: hsl(232, 70%, 70%);
        }

        /* 侧边栏背景同步 */
        body[data-ds-dark-theme] ._189b4a0,
        body[data-ds-dark-theme] ._6ffc3c9 {
            background-color: #27282e;
        }

        /* 深色模式下强调文字颜色 */
        body[data-ds-dark-theme] .ds-markdown strong {
            color: #ff7881 !important;
        }
        body[data-ds-dark-theme] .ds-markdown em {
            color: #fbbb83 !important;
        }

        /* 浅色模式下强调文字颜色 */
        body .ds-markdown strong {
            color: hsl(350, 80%, 55%) !important;
        }
        body .ds-markdown em {
            color: hsl(28, 80%, 50%) !important;
        }

        /* ====== 数学公式颜色（区分深浅模式） ====== */
        /* 浅色：普通蓝色 */
        body .ds-markdown-math,
        body .ds-markdown-math.katex-display,
        body .ds-markdown-math-display,
        body .ds-markdown-math-svg,
        body .katex,
        body .katex * {
            color: #3b82f6 !important;
        }

        /* 深色：更亮的蓝色（缓解视觉压力） */
        body[data-ds-dark-theme] .ds-markdown-math,
        body[data-ds-dark-theme] .ds-markdown-math.katex-display,
        body[data-ds-dark-theme] .ds-markdown-math-display,
        body[data-ds-dark-theme] .ds-markdown-math-svg,
        body[data-ds-dark-theme] .katex,
        body[data-ds-dark-theme] .katex * {
            color: #bae6fd !important;  /* 亮蓝色，相比 #3b82f6 更亮 */
        }

        /* 行内代码颜色 */
        .ds-markdown code:not(pre code):not(.md-code-block code) {
            color: #f2b6de !important;
        }
        body:not([data-ds-dark-theme]) .ds-markdown code:not(pre code):not(.md-code-block code) {
            color: #dd1399 !important;
        }

        /* 标题左侧竖条 */
        .ds-markdown h1, .ds-markdown h2, .ds-markdown h3,
        .ds-markdown h4, .ds-markdown h5, .ds-markdown h6 {
            border-left: none !important;
            padding-left: 16px !important;
            position: relative;
        }
        .ds-markdown h1::before, .ds-markdown h2::before, .ds-markdown h3::before,
        .ds-markdown h4::before, .ds-markdown h5::before, .ds-markdown h6::before {
            content: "";
            position: absolute;
            left: 0;
            top: 4px;
            bottom: 4px;
            width: 4px;
            border-radius: 4px;
        }

        /* 深色模式标题竖条颜色 */
        body[data-ds-dark-theme] .ds-markdown h1::before { background: #d18989; }
        body[data-ds-dark-theme] .ds-markdown h2::before { background: #cea38d; }
        body[data-ds-dark-theme] .ds-markdown h3::before { background: #93c89c; }
        body[data-ds-dark-theme] .ds-markdown h4::before { background: #7eb8f1; }
        body[data-ds-dark-theme] .ds-markdown h5::before { background: #bab3ef; }
        body[data-ds-dark-theme] .ds-markdown h6::before { background: #7ec8c5; }

        /* 浅色模式标题竖条颜色 */
        body .ds-markdown h1::before { background: #bd5151; }
        body .ds-markdown h2::before { background: #c77b23; }
        body .ds-markdown h3::before { background: #478f14; }
        body .ds-markdown h4::before { background: #0585a8; }
        body .ds-markdown h5::before { background: #726293; }
        body .ds-markdown h6::before { background: #127d52; }

        /* 引用块样式 - Border 风格 */
        .ds-markdown blockquote {
            border-left: none !important;
            border-radius: 6px;
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23000000' fill-opacity='0.12' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
            position: relative;
        }
        body[data-ds-dark-theme] .ds-markdown blockquote {
            background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='4' height='4' viewBox='0 0 4 4'%3E%3Cpath fill='%23ffffff' fill-opacity='0.12' d='M1 3h1v1H1V3zm2-2h1v1H3V1z'%3E%3C/path%3E%3C/svg%3E");
        }
        .ds-markdown blockquote blockquote {
            background-image: none !important;
        }
        .ds-markdown blockquote::before {
            content: "";
            position: absolute;
            left: 0;
            top: 8px;
            bottom: 8px;
            width: 4px;
            border-radius: 4px;
            background: var(--dsw-alias-brand-primary);
        }
    `;
    document.head.appendChild(style);

    // 存储所有背景层映射：key -> { banner, bg, ro }
    const layerMap = new Map();

    // 获取当前背景色：从 body 的计算样式中读取 CSS 变量 --dsw-alias-bg-base
    function getBackgroundColor() {
        const body = document.body;
        if (!body) return '#FFFFFF';
        const style = getComputedStyle(body);
        const color = style.getPropertyValue('--dsw-alias-bg-base').trim();
        if (color && color !== '') {
            return color;
        }
        // 若变量未定义，则根据 data 属性回退
        return body.dataset.dsDarkTheme === 'dark' ? '#151517' : '#FFFFFF';
    }

    // 更新单个背景层的位置和颜色
    function updateLayer(key) {
        const entry = layerMap.get(key);
        if (!entry) return;
        const { banner, bg } = entry;
        if (!banner || !bg || !banner.isConnected) {
            if (bg.isConnected) bg.remove();
            layerMap.delete(key);
            return;
        }

        const rect = banner.getBoundingClientRect();
        const parentRect = banner.parentElement.getBoundingClientRect();

        bg.style.top = (rect.top - parentRect.top) + 'px';
        bg.style.left = (rect.left - parentRect.left) + 'px';
        bg.style.width = rect.width + 'px';
        bg.style.height = rect.height + 'px';
        bg.style.backgroundColor = getBackgroundColor(); // 动态获取
    }

    // 为单个标题添加背景层
    function addLayerForBanner(banner) {
        const existingKey = banner.dataset.bgKey;
        if (existingKey && layerMap.has(existingKey)) {
            updateLayer(existingKey);
            return;
        }

        const wrap = banner.parentElement;
        if (!wrap) return;

        if (getComputedStyle(wrap).position === 'static') {
            wrap.style.position = 'relative';
        }

        const key = 'bg-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8);
        banner.dataset.bgKey = key;

        banner.style.position = 'relative';
        banner.style.zIndex = '1';

        const bg = document.createElement('div');
        bg.className = 'ds-code-bg-layer';
        bg.dataset.bgKey = key;

        const rect = banner.getBoundingClientRect();
        const parentRect = wrap.getBoundingClientRect();

        bg.style.cssText = `
                position: absolute;
                top: ${rect.top - parentRect.top}px;
                left: ${rect.left - parentRect.left}px;
                width: ${rect.width}px;
                height: ${rect.height}px;
                background-color: ${getBackgroundColor()};
                border-radius: 0 !important;
                z-index: 0;
                pointer-events: none;
                transition: none;
            `;

        wrap.appendChild(bg);

        const entry = { banner, bg };
        layerMap.set(key, entry);

        if (window.ResizeObserver) {
            const ro = new ResizeObserver(() => updateLayer(key));
            ro.observe(banner);
            entry.ro = ro;
        }

        updateLayer(key);
    }

    // 为所有当前存在的代码框标题添加背景层
    function addAllLayers() {
        const banners = document.querySelectorAll('.md-code-block-banner');
        banners.forEach(banner => addLayerForBanner(banner));
    }

    // 清理已不存在的层
    function cleanupLayers() {
        const toDelete = [];
        for (const [key, entry] of layerMap) {
            if (!entry.banner || !entry.banner.isConnected) {
                if (entry.bg && entry.bg.isConnected) entry.bg.remove();
                if (entry.ro) entry.ro.disconnect();
                toDelete.push(key);
            }
        }
        for (const key of toDelete) layerMap.delete(key);
    }

    // 更新所有层
    function updateAllLayers() {
        for (const key of layerMap.keys()) {
            updateLayer(key);
        }
    }

    // ---------- 初始化 ----------
    addAllLayers();

    // ---------- 监听 DOM 变化 ----------
    const domObserver = new MutationObserver(() => {
        cleanupLayers();
        addAllLayers();
        updateAllLayers();
    });
    domObserver.observe(document.body, {
        childList: true,
        subtree: true,
    });

    // ---------- 监听窗口 resize ----------
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        if (resizeTimer) cancelAnimationFrame(resizeTimer);
        resizeTimer = requestAnimationFrame(() => {
            updateAllLayers();
            resizeTimer = null;
        });
    });

    // ---------- 监听主题变化（data-ds-dark-theme） ----------
    const themeObserver = new MutationObserver(() => {
        // 主题切换时，CSS 变量值会变化，重新计算所有层的颜色和位置
        updateAllLayers();
    });
    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ['data-ds-dark-theme'],
    });

    // ---------- 监听滚动（防抖） ----------
    let scrollTimer = null;
    window.addEventListener('scroll', () => {
        if (scrollTimer) cancelAnimationFrame(scrollTimer);
        scrollTimer = requestAnimationFrame(() => {
            updateAllLayers();
            scrollTimer = null;
        });
    }, { passive: true });

    // ---------- 页面完全加载后重算 ----------
    if (document.readyState === 'complete') {
        updateAllLayers();
    } else {
        window.addEventListener('load', updateAllLayers);
    }

    console.log('[DeepSeek-Refined] 已启动，代码框背景遮挡已启用，背景色自动跟随 --dsw-alias-bg-base');
})();
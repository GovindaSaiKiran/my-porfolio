import re

file_path = "c:/Users/Asus/Downloads/GT/portfolio/style.css"
with open(file_path, "r", encoding="utf-8") as f:
    css = f.read()

# 1. Root Variables Replacement
root_old = r":root \{[^}]*\}"
root_new = """:root {
    /* Color Palette */
    --bg-dark: #050508;
    --text-main: #ffffff;
    --text-muted: #a0a0b0;

    /* Neon Accents */
    --neon-blue: #00f3ff;
    --neon-purple: #bd00ff;
    --neon-pink: #ff007f;
    --neon-cyan: #00ffcc;
    --neon-orange: #ff5500;
    --neon-green: #39ff14;

    /* Standard Glassmorphism System */
    --glass-bg: rgba(20, 20, 25, 0.45);
    --glass-edge: rgba(255, 255, 255, 0.12);
    --glass-blur: blur(20px);
    
    /* Elegant Dark Box Shadow */
    --glass-depth-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.4);

    /* Gradients */
    --gradient-primary: linear-gradient(135deg, var(--neon-blue), var(--neon-purple));

    /* Layout & Soft Curves */
    --nav-height: 80px;
    --section-padding: 100px;
    --border-radius: 16px;
    --border-radius-sm: 12px;
    --border-radius-pill: 999px;
    --transition-glass: all 0.3s ease;
    --transition-smooth: all 0.45s cubic-bezier(0.25, 0.8, 0.25, 1);
}"""
css = re.sub(root_old, root_new, css, count=1)

# 2. Base Glass Surface Simplification
glass_base_old = r"""\.glass-card,\s*\.glass-btn,\s*\.glass-nav,\s*\.glass-bubble,\s*\.glass-project-card,\s*\.glass-list-item,\s*\.glass-input\s*\{(?:\s|.)*?\}"""
glass_base_new = """.glass-card,
.glass-btn,
.glass-nav,
.glass-bubble,
.glass-project-card,
.glass-list-item,
.glass-input {
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-edge);
    border-radius: var(--border-radius);
    box-shadow: var(--glass-depth-shadow);
    transition: var(--transition-glass);
    position: relative;
}"""
css = re.sub(glass_base_old, glass_base_new, css, flags=re.MULTILINE|re.DOTALL)

# 3. Strip complex before/after reflections
# Remove all the ::before and ::after related to .glass-card, etc.
patterns_to_remove = [
    r"/\* ---- Layer 1: Top Reflection Highlight ---- \*/(?:\s|.)*?\}",
    r"/\* ---- Layer 2: Light Diffusion \(inner glow \+ color tint\) ---- \*/(?:\s|.)*?\}",
    r"/\* Reflection shifts upward on hover — light angle change \*/(?:\s|.)*?\}",
    r"/\* Diffusion intensifies subtly on hover \*/(?:\s|.)*?\}",
    r"/\* Navbar top reflection \*/(?:\s|.)*?\}",
    r"/\* Navbar iridescent diffusion \*/(?:\s|.)*?\}",
    r"/\* Inner reflection on icon circle \*/(?:\s|.)*?\}",
    r"/\* Soft ambient glow behind icon circle \*/(?:\s|.)*?\}",
    r"/\* Reflexion on icon circles \*/(?:\s|.)*?\}",
    r"/\* Reflection on icon circles \*/(?:\s|.)*?\}",
    r"/\* Skill item reflection \*/(?:\s|.)*?\}",
    r"/\* Secondary button reflection \*/(?:\s|.)*?\}",
    r"/\* Reflection highlight on top of button \*/(?:\s|.)*?\}",
    # Specific button pseudo removals
    r"\.social-btn::before\s*\{[^}]*\}",
    r"\.icon-glass-container::after\s*\{[^}]*\}",
    r"\.icon-glass-container::before\s*\{[^}]*\}",
]
for p in patterns_to_remove:
    css = re.sub(p, "", css, flags=re.MULTILINE|re.DOTALL)

# 4. Enhance Buttons
btn_old = r"/\* ================= Buttons \(Liquid Glass Pills\) ================= \*/.*?(?=/\* ================= Hero Section ================= \*/)"

btn_new_css = """/* ================= Buttons (Clean Glassmorphism) ================= */
.btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 14px 32px;
    border-radius: var(--border-radius-pill);
    font-weight: 600;
    position: relative;
    overflow: hidden;
    transition: var(--transition-smooth);
    z-index: 1;
    cursor: pointer;
    border: 1px solid var(--glass-edge);
    background: rgba(255, 255, 255, 0.05);
    backdrop-filter: var(--glass-blur);
    color: var(--text-main);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.btn:active {
    transform: scale(0.96);
}

/* Primary Button with Neon Glow Expansion on Hover */
.btn-primary {
    border: 1px solid rgba(0, 243, 255, 0.3);
}

.btn-primary::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: var(--gradient-primary);
    opacity: 0.2;
    z-index: -1;
    transition: var(--transition-smooth);
}

/* Glowing Border / Shadow logic */
.btn-glow {
    position: absolute;
    top: 0; left: 0; width: 100%; height: 100%;
    background: var(--gradient-primary);
    filter: blur(15px);
    opacity: 0;
    z-index: -2;
    transition: var(--transition-smooth);
}

.btn-primary:hover {
    transform: translateY(-3px);
    border-color: rgba(0, 243, 255, 0.8);
    box-shadow: 0 0 25px rgba(0, 243, 255, 0.5), 0 8px 30px rgba(0, 0, 0, 0.4);
    color: #fff;
}

.btn-primary:hover::before {
    opacity: 0.8;
}

.btn-primary:hover .btn-glow {
    opacity: 0.8;
    transform: scale(1.1);
}

.btn-secondary:hover {
    transform: translateY(-3px);
    background: rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
    border-color: rgba(255, 255, 255, 0.3);
}
"""
css = re.sub(btn_old, btn_new_css, css, flags=re.MULTILINE|re.DOTALL)

# 5. Fix Hover states for cards/navs
card_hover_old = r"\.glass-card:hover,\s*\.glass-project-card:hover,\s*\.glass-list-item:hover\s*\{(?:\s|.)*?\}"
card_hover_new = """.glass-card:hover,
.glass-project-card:hover,
.glass-list-item:hover {
    transform: translateY(-6px);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5), 0 0 20px rgba(255, 255, 255, 0.05);
    border-color: rgba(255, 255, 255, 0.25);
    background: rgba(30, 30, 40, 0.55);
}"""
css = re.sub(card_hover_old, card_hover_new, css, count=1, flags=re.MULTILINE|re.DOTALL)

# 6. .glass-nav rewrite (no complex lighting)
nav_old = r"\.glass-nav\s*\{[^}]*\}"
nav_new = """.glass-nav {
    position: fixed;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 90%;
    max-width: 1200px;
    height: 64px;
    border-radius: var(--border-radius-pill);
    z-index: 1000;
    transition: var(--transition-smooth);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    -webkit-backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-edge);
    box-shadow: var(--glass-depth-shadow);
}"""
css = re.sub(nav_old, nav_new, css, count=1)

# .icon-glass-container rewrite
icon_old = r"\.icon-glass-container\s*\{(?:\s|.)*?\}"
icon_new = """.icon-glass-container {
    width: 64px;
    height: 64px;
    background: rgba(255, 255, 255, 0.08);
    backdrop-filter: var(--glass-blur);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 24px;
    border: 1px solid var(--glass-edge);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    position: relative;
    transition: var(--transition-smooth);
}"""
css = re.sub(icon_old, icon_new, css, count=1, flags=re.MULTILINE|re.DOTALL)

icon_hover_old = r"\.glass-card:hover .icon-glass-container\s*\{(?:\s|.)*?\}"
icon_hover_new = """.glass-card:hover .icon-glass-container {
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 243, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
    transform: scale(1.05);
}"""
css = re.sub(icon_hover_old, icon_hover_new, css, count=1, flags=re.MULTILINE|re.DOTALL)

# .skill-item rewrite
skill_old = r"\.skill-item\s*\{(?:\s|.)*?\}"
skill_new = """.skill-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 25px 15px;
    border-radius: var(--border-radius-sm);
    transition: var(--transition-smooth);
    text-align: center;
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-edge);
    box-shadow: var(--glass-depth-shadow);
    position: relative;
    overflow: hidden;
}"""
css = re.sub(skill_old, skill_new, css, count=1, flags=re.MULTILINE|re.DOTALL)

skill_hover_old = r"\.skill-item:hover\s*\{(?:\s|.)*?\}"
skill_hover_new = """.skill-item:hover {
    transform: translateY(-6px) scale(1.03);
    background: rgba(40, 40, 50, 0.6);
    border-color: rgba(255, 255, 255, 0.3);
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4), 0 0 20px rgba(0, 243, 255, 0.2);
}"""
css = re.sub(skill_hover_old, skill_hover_new, css, count=1, flags=re.MULTILINE|re.DOTALL)

# item-icon-wrapper rewrite
item_icon_old = r"\.item-icon-wrapper\s*\{(?:\s|.)*?\}"
item_icon_new = """.item-icon-wrapper {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    margin-right: 20px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.08);
    border: 1px solid var(--glass-edge);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    transition: var(--transition-smooth);
    position: relative;
    overflow: hidden;
}"""
css = re.sub(item_icon_old, item_icon_new, css, count=1, flags=re.MULTILINE|re.DOTALL)

# .social-btn reset
social_btn_old = r"\.social-btn\s*\{(?:\s|.)*?\}"
social_btn_new = """.social-btn {
    width: 50px;
    height: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: var(--border-radius-sm);
    font-size: 1.2rem;
    transition: var(--transition-smooth);
    background: var(--glass-bg);
    backdrop-filter: var(--glass-blur);
    border: 1px solid var(--glass-edge);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    position: relative;
    overflow: hidden;
}"""
css = re.sub(social_btn_old, social_btn_new, css, count=1, flags=re.MULTILINE|re.DOTALL)

social_btn_hover = r"\.social-btn:hover\s*\{(?:\s|.)*?\}"
social_btn_hover_new = """.social-btn:hover {
    transform: translateY(-4px) scale(1.05);
    background: rgba(50, 50, 60, 0.6);
    border-color: rgba(255, 255, 255, 0.25);
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.3), 0 0 15px rgba(0, 180, 255, 0.3);
    color: var(--text-main);
}"""
css = re.sub(social_btn_hover, social_btn_hover_new, css, count=1, flags=re.MULTILINE|re.DOTALL)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(css)

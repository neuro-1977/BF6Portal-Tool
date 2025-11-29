import os

def create_mockup():
    svg_content = """<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
    <!-- Background -->
    <rect width="100%" height="100%" fill="#1e1e1e"/>
    
    <!-- Sidebar -->
    <rect width="200" height="600" fill="#252526"/>
    
    <!-- Sidebar Header -->
    <text x="20" y="30" fill="white" font-family="Arial" font-size="20" font-weight="bold">Portal Editor</text>
    
    <!-- Categories -->
    <g transform="translate(10, 60)">
"""
    
    categories = [
        ("RULES", "#7E3F96"),
        ("MOD", "#4A4A4A"),
        ("LOGIC", "#4CAF50"),
        ("MATH", "#795548"),
        ("ACTIONS", "#C62828")
    ]
    
    y = 0
    for name, color in categories:
        svg_content += f"""
        <rect y="{y}" width="180" height="30" rx="4" ry="4" fill="{color}"/>
        <text x="10" y="{y+20}" fill="white" font-family="Arial" font-size="12" font-weight="bold">{name}</text>
        """
        y += 40

    svg_content += """
    </g>

    <!-- Canvas Area -->
    <rect x="200" width="600" height="600" fill="#1e1e1e"/>
    
    <!-- Grid Pattern -->
    <defs>
        <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#333333" stroke-width="1"/>
        </pattern>
    </defs>
    <rect x="200" width="600" height="600" fill="url(#grid)"/>

    <!-- Example Blocks -->
    <g transform="translate(250, 50)">
        <!-- Rule Block -->
        <rect width="300" height="40" rx="4" ry="4" fill="#7E3F96" stroke="#000" stroke-width="1"/>
        <text x="10" y="25" fill="white" font-family="Arial" font-size="14" font-weight="bold">RULE: Game Mode Logic</text>
        
        <!-- Condition Block -->
        <rect y="50" width="200" height="30" rx="4" ry="4" fill="#0277BD" stroke="#000" stroke-width="1"/>
        <text x="10" y="70" fill="white" font-family="Arial" font-size="12">CONDITION: IsGameRunning</text>
        
        <!-- Action Block -->
        <rect y="90" width="200" height="30" rx="4" ry="4" fill="#C62828" stroke="#000" stroke-width="1"/>
        <text x="10" y="110" fill="white" font-family="Arial" font-size="12">ACTION: EndGame</text>
    </g>
</svg>"""

    with open('docs/ui_mockup.svg', 'w') as f:
        f.write(svg_content)
    print("Mockup saved to docs/ui_mockup.svg")

if __name__ == "__main__":
    create_mockup()

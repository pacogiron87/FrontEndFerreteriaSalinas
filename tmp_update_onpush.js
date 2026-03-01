const fs = require('fs');
const path = require('path');

function walk(dir, callback) {
    fs.readdirSync(dir).forEach(f => {
        let dirPath = path.join(dir, f);
        let isDirectory = fs.statSync(dirPath).isDirectory();
        isDirectory ? walk(dirPath, callback) : callback(dirPath);
    });
}

function processFile(filePath) {
    if (!filePath.endsWith('.ts') || filePath.endsWith('.spec.ts')) return;

    let content = fs.readFileSync(filePath, 'utf8');

    // Skip if not a component or already has OnPush
    if (!content.includes('@Component') || content.includes('ChangeDetectionStrategy.OnPush')) {
        return;
    }

    console.log(`Processing: ${filePath}`);

    // 1. Add ChangeDetectionStrategy to @angular/core import
    const coreImportRegex = /import\s+{([^}]+)}\s+from\s+['"]@angular\/core['"];/;
    const match = content.match(coreImportRegex);

    if (match) {
        const imports = match[1];
        if (!imports.includes('ChangeDetectionStrategy')) {
            const newImports = imports.trim() + ', ChangeDetectionStrategy';
            content = content.replace(match[0], `import { ${newImports} } from '@angular/core';`);
        }
    } else {
        // If no existing @angular/core import, add it
        content = `import { ChangeDetectionStrategy } from '@angular/core';\n` + content;
    }

    // 2. Add changeDetection: ChangeDetectionStrategy.OnPush to @Component decorator
    // We'll insert it right after @Component({
    const componentDecoratorRegex = /@Component\s*\(\s*\{/;
    content = content.replace(componentDecoratorRegex, '@Component({\n  changeDetection: ChangeDetectionStrategy.OnPush,');

    fs.writeFileSync(filePath, content, 'utf8');
}

walk('c:\\Users\\cport\\source\\repos\\Kaizen\\FrontEndFerreteriaSalinas\\src\\app', processFile);
console.log('Update complete.');

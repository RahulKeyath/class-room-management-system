const fs = require('fs');
const path = require('path');

const srcDir = './frontend2/src/routes';
const destDir = './frontend/src/app';

const routes = [
  'attendance.tsx',
  'performance.tsx',
  'results.tsx',
  'staff.tsx',
  'students.tsx',
  'syllabus.tsx',
  'timetable.tsx'
];

for (const file of routes) {
  const routeName = file.replace('.tsx', '');
  const content = fs.readFileSync(path.join(srcDir, file), 'utf-8');
  
  // Remove createFileRoute import
  let newContent = content.replace(/import \{ createFileRoute \} from "@tanstack\/react-router";\n?/g, '');
  
  // Remove Route definition
  newContent = newContent.replace(/export const Route = createFileRoute[^;]+;\n?/g, '');
  
  // Add "use client"; at the top
  newContent = '"use client";\n\n' + newContent.trim();
  
  // Replace the component name with a default export if it's not already
  const componentMatch = newContent.match(/function ([A-Za-z0-9_]+Page)\(\) \{/);
  if (componentMatch) {
    const compName = componentMatch[1];
    newContent = newContent.replace(`function ${compName}() {`, `export default function ${compName}() {`);
  }
  
  const destRouteDir = path.join(destDir, routeName);
  fs.mkdirSync(destRouteDir, { recursive: true });
  fs.writeFileSync(path.join(destRouteDir, 'page.tsx'), newContent);
  console.log(`Migrated ${file} -> ${routeName}/page.tsx`);
}

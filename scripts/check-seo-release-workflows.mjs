import { readFile } from 'node:fs/promises';

const failures = [];
const check = (condition, message) => { if (!condition) failures.push(message); };

const workflows = [
  '.github/workflows/seo-static-checks.yml',
  '.github/workflows/build-prerendered-test.yml',
  '.github/workflows/build-static-preview.yml',
];

for (const file of workflows) {
  const yaml = await readFile(file, 'utf8');
  check(yaml.includes('actions/checkout@v6'), `${file} does not use checkout v6.`);
  check(yaml.includes('actions/setup-node@v6'), `${file} does not use setup-node v6.`);
  check(yaml.includes("node-version: '24'"), `${file} does not pin Node 24.`);
  check(!yaml.includes("node-version: '20'"), `${file} still pins Node 20.`);
}

const parityWorkflow = await readFile('.github/workflows/build-prerendered-test.yml', 'utf8');
check(!/^\s*push:/m.test(parityWorkflow), 'Legacy homepage parity workflow still runs automatically on push.');
check(!parityWorkflow.includes('contents: write'), 'Legacy homepage parity workflow still has repository write permission.');
check(!parityWorkflow.includes("OC_PRODUCTION: '1'"), 'Legacy homepage parity workflow can still promote its historical source to production.');
check(parityWorkflow.includes('workflow_dispatch:'), 'Legacy homepage parity workflow is not explicitly manual-only.');
check(parityWorkflow.includes('pre-rendered-test/index.html'), 'Legacy homepage parity workflow no longer verifies the noindex parity output.');

if (failures.length) {
  throw new Error(`Release workflow checks failed:\n- ${failures.join('\n- ')}`);
}

console.log('RELEASE_WORKFLOW_CHECK_OK|node=24|checkout=6|setup_node=6|legacy_promotion=disabled|parity=manual_noindex');

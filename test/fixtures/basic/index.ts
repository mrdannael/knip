import { exportedValue } from './my-module.js';

const dynamic = import('./dynamic-import');

async function main() {
  const { used } = await import('./dynamic-import');
}

export const unusedExportedReference = exportedValue;

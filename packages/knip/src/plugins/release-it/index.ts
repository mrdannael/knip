import type { IsPluginEnabled, Plugin, ResolveConfig } from '#p/types/plugins.js';
import { getDependenciesFromScripts, hasDependency } from '#p/util/plugin.js';
import type { ReleaseItConfig } from './types.js';

// https://github.com/release-it/release-it/blob/master/docs/plugins.md#using-a-plugin
// Uses CosmiConfig but with custom searchPlaces
// https://github.com/release-it/release-it/blob/main/lib/config.js

const title = 'Release It!';

const enablers = ['release-it'];

const isEnabled: IsPluginEnabled = ({ dependencies }) => hasDependency(dependencies, enablers);

const packageJsonPath = 'release-it';

const config = ['.release-it.{json,js,cjs,ts,yml,yaml,toml}', 'package.json'];

const resolveConfig: ResolveConfig<ReleaseItConfig> = (config, options) => {
  const plugins = config.plugins ? Object.keys(config.plugins) : [];
  const scripts = config.hooks ? Object.values(config.hooks).flat() : [];
  if (typeof config.github?.releaseNotes === 'string') {
    scripts.push(config.github.releaseNotes);
  }
  if (typeof config.gitlab?.releaseNotes === 'string') {
    scripts.push(config.gitlab.releaseNotes);
  }
  const dependencies = getDependenciesFromScripts(scripts, options);

  return [...plugins, ...dependencies];
};

export default {
  title,
  enablers,
  isEnabled,
  packageJsonPath,
  config,
  resolveConfig,
} satisfies Plugin;

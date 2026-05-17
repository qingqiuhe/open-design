import { detectAcpModels, DEFAULT_MODEL_OPTION } from './shared.js';
import type { RuntimeAgentDef } from '../types.js';

export const kiroAgentDef = {
    id: 'kiro',
    name: 'Kiro CLI',
    bin: 'kiro-cli',
    versionArgs: ['--version'],
    fetchModels: async (resolvedBin, env) =>
      detectAcpModels({
        bin: resolvedBin,
        args: ['acp'],
        env,
        timeoutMs: 15_000,
        defaultModelOption: DEFAULT_MODEL_OPTION,
      }),
    // Kiro CLI advertises its available models through ACP `session/new`
    // (https://kiro.dev/docs/cli/acp), so the live `fetchModels` probe
    // covers the happy path. But when `kiro-cli` isn't on PATH at the
    // detection time — or `session/new` returns without a `configOptions`
    // model entry on a given build — the daemon falls back to this list.
    // Without documented ids here the model dropdown collapses to just
    // "Default (CLI config)" and the user has nothing to pick, which
    // looks like the UI selection is ignored. Ids mirror the catalog at
    // https://kiro.dev/docs/cli/models (the Auto router plus the active
    // Anthropic / open-weight ids the CLI accepts via ACP set_model and
    // the `/model` slash command).
    fallbackModels: [
      DEFAULT_MODEL_OPTION,
      { id: 'auto', label: 'Auto (router)' },
      { id: 'claude-opus-4.7', label: 'Claude Opus 4.7' },
      { id: 'claude-opus-4.6', label: 'Claude Opus 4.6' },
      { id: 'claude-opus-4.5', label: 'Claude Opus 4.5' },
      { id: 'claude-sonnet-4.6', label: 'Claude Sonnet 4.6' },
      { id: 'claude-sonnet-4.5', label: 'Claude Sonnet 4.5' },
      { id: 'claude-sonnet-4.0', label: 'Claude Sonnet 4.0' },
      { id: 'claude-haiku-4.5', label: 'Claude Haiku 4.5' },
      { id: 'deepseek-3.2', label: 'DeepSeek 3.2' },
      { id: 'minimax-m2.5', label: 'MiniMax M2.5' },
      { id: 'glm-5', label: 'GLM-5' },
      { id: 'minimax-m2.1', label: 'MiniMax M2.1' },
      { id: 'qwen3-coder-next', label: 'Qwen3 Coder Next' },
    ],
    buildArgs: () => ['acp'],
    streamFormat: 'acp-json-rpc',
} satisfies RuntimeAgentDef;

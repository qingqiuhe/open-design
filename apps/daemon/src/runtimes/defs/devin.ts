import { detectAcpModels, DEFAULT_MODEL_OPTION } from './shared.js';
import type { RuntimeAgentDef } from '../types.js';

export const devinAgentDef = {
    id: 'devin',
    name: 'Devin for Terminal',
    bin: 'devin',
    versionArgs: ['--version'],
    fetchModels: async (resolvedBin, env) =>
      detectAcpModels({
        bin: resolvedBin,
        args: [
          '--permission-mode',
          'dangerous',
          '--respect-workspace-trust',
          'false',
          'acp',
        ],
        env,
        timeoutMs: 15_000,
        defaultModelOption: DEFAULT_MODEL_OPTION,
      }),
    // Fallback aliases from Devin for Terminal docs
    // (https://cli.devin.ai/docs/models): `adaptive` appears in the config example;
    // `opus`, `sonnet`, `swe`, `codex`, `gemini`, and `gpt` are documented
    // as short model-family names / recommended picks.
    fallbackModels: [
      DEFAULT_MODEL_OPTION,
      { id: 'adaptive', label: 'adaptive' },
      { id: 'swe', label: 'swe' },
      { id: 'opus', label: 'opus' },
      { id: 'sonnet', label: 'sonnet' },
      { id: 'codex', label: 'codex' },
      { id: 'gpt', label: 'gpt' },
      { id: 'gemini', label: 'gemini' },
    ],
    // Devin's documented and stable model-selection path is the global
    // `--model <id>` flag (https://cli.devin.ai/docs/reference/commands and
    // https://cli.devin.ai/docs/models). The ACP `session/set_model` method
    // exists on `devin acp` but does not reliably take effect for every
    // model id — when it doesn't, our shared ACP layer in `acp.ts` swallows
    // `-32603/-32602/-32601/-32002` and silently runs the prompt with
    // whatever default is configured in `~/.config/devin/config.json`,
    // which is what the user actually sees in the chat (UI pick ignored).
    //
    // Passing `--model` *before* the `acp` subcommand pins the model at
    // process start — the same place Devin's `--permission-mode` and
    // `--respect-workspace-trust` live. ACP `session/set_model` then
    // becomes a redundant best-effort second pass; if it fails the chat
    // still runs with the model the user picked instead of the config
    // default. Ordering matters: global flags MUST come before the
    // `acp` subcommand.
    buildArgs: (_prompt, _imagePaths, _extra, options = {}) => {
      const args = [
        '--permission-mode',
        'dangerous',
        '--respect-workspace-trust',
        'false',
      ];
      if (options.model && options.model !== 'default') {
        args.push('--model', options.model);
      }
      args.push('acp');
      return args;
    },
    streamFormat: 'acp-json-rpc',
} satisfies RuntimeAgentDef;

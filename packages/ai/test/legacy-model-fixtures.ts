import type { Model } from "../src/types.ts";

// Historical metadata for payload regressions. These IDs have left the live
// catalogs; fixtures preserve the original behavior without registering retired
// models or substituting a successor with different reasoning controls.
export const legacyOpenCodeGoKimi: Model<"openai-completions"> = {
	id: "kimi-k2.6",
	name: "Kimi K2.6",
	api: "openai-completions",
	provider: "opencode-go",
	baseUrl: "https://opencode.ai/zen/go/v1",
	reasoning: true,
	thinkingLevelMap: { minimal: null, low: null, medium: null, xhigh: null, max: null },
	input: ["text", "image"],
	cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
	contextWindow: 262144,
	maxTokens: 131072,
	compat: {
		supportsStore: false,
		supportsDeveloperRole: false,
		thinkingFormat: "deepseek",
		supportsReasoningEffort: false,
		maxTokensField: "max_tokens",
		supportsLongCacheRetention: false,
	},
};

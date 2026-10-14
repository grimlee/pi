import { describe, expect, it, vi } from "vitest";
import { fauxAssistantMessage } from "../src/providers/faux.ts";
import { OPENCODE_GO_MODELS } from "../src/providers/opencode-go.models.ts";
import { opencodeGoProvider } from "../src/providers/opencode-go.ts";
import type { Model, ProviderStreams, StreamOptions } from "../src/types.ts";
import { AssistantMessageEventStream } from "../src/utils/event-stream.ts";
import { normalizeContext } from "../src/utils/transcript.ts";

const captureOptions = vi.hoisted(() => vi.fn<(options: StreamOptions | undefined) => void>());

vi.mock("../src/api/google-generative-ai.lazy.ts", () => ({
	googleGenerativeAIApi: (): ProviderStreams => {
		const stream: ProviderStreams["stream"] = (_model, _context, options) => {
			captureOptions(options);
			const events = new AssistantMessageEventStream();
			const message = fauxAssistantMessage("google dispatched");
			events.push({ type: "done", reason: "stop", message });
			events.end(message);
			return events;
		};
		return { stream, streamSimple: stream };
	},
}));

describe("OpenCode Go Google API dispatch", () => {
	it.each(["stream", "streamSimple"] as const)("dispatches %s with the OpenCode session header", async (method) => {
		const provider = opencodeGoProvider();
		const model: Model<"google-generative-ai"> = OPENCODE_GO_MODELS["gemini-4-argon-contributor"];
		expect(provider.getModels()).toContain(model);
		captureOptions.mockClear();
		const result = await provider[method](
			model,
			normalizeContext({ messages: [{ role: "user", content: "hi", timestamp: 0 }] }),
			{ apiKey: "test-key", sessionId: "google-session", cacheRetention: "none" },
		).result();
		expect(result.content).toEqual([{ type: "text", text: "google dispatched" }]);
		expect(captureOptions).toHaveBeenCalledWith(
			expect.objectContaining({ headers: { "x-opencode-session": "google-session" } }),
		);
	});
});

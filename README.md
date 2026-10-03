# Tone Checker

Checks a draft message and tells you if the tone could cause a problem before you send it.

Status: work in progress. Right now only stub mode works. The model call comes in Stage 2.

## Setup

```bash
git clone https://github.com/WilburStanley/ToneChecker.git
cd tone-checker
npm install
cp .env.example .env
```

Open `.env`, fill in your own values, and set `LLM_STUB=1` for now.

```bash
npm run dev
```

The API runs at `http://localhost:3000`.

## Try it

Valid request:

```bash
curl -i -X POST http://localhost:3000/api/check-tone \
  -H "Content-Type: application/json" \
  -d '{"text":"hey, any update on the invoice?"}'
```

Response (200):

```json
{"tone":"neutral","risk":"low","fix":"Stub mode: no model was called.","confidence":0.9}
```

Broken request (empty text):

```bash
curl -i -X POST http://localhost:3000/api/check-tone \
  -H "Content-Type: application/json" \
  -d '{"text":""}'
```

Response (400):

```json
{"error":"text must not be empty","field":"text"}
```

## Providers

The model, provider, and key are set in `.env` with three variables: `LLM_BASE_URL`, `LLM_API_KEY`, and `LLM_MODEL`. Those three are the only difference between a model on a laptop and one in a datacenter, so nothing is hard-coded to a provider.
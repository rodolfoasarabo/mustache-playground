import { useMemo, useState } from 'react'
import Mustache from 'mustache'
import { marked } from 'marked'
import './App.css'

const SAMPLE_TEMPLATE = `{{#header}}**{{region}}**{{#searchLink}} · {{{searchLink}}}{{/searchLink}}
{{/header}}{{#listings}}· **{{price}}** · {{address}}, {{neighborhood}}, {{city}} · {{houseType}}, {{bedrooms}} quartos, {{area}}
  {{{detailsLink}}}
{{/listings}}`

const SAMPLE_JSON = JSON.stringify(
  {
    header: {
      region: 'Zona Sul, São Paulo',
      searchLink: '[Ver todos os imóveis](https://example.com/search)',
    },
    listings: [
      {
        price: 'R$ 3.200/mês',
        address: 'Rua Augusta, 1200',
        neighborhood: 'Consolação',
        city: 'São Paulo',
        houseType: 'Apartamento',
        bedrooms: 2,
        area: '65m²',
        detailsLink: '[Ver detalhes](https://example.com/imovel/1)',
      },
      {
        price: 'R$ 5.800/mês',
        address: 'Alameda Santos, 45',
        neighborhood: 'Jardim Paulista',
        city: 'São Paulo',
        houseType: 'Cobertura',
        bedrooms: 3,
        area: '120m²',
        detailsLink: '[Ver detalhes](https://example.com/imovel/2)',
      },
    ],
  },
  null,
  2,
)

export default function App() {
  const [template, setTemplate] = useState(SAMPLE_TEMPLATE)
  const [jsonText, setJsonText] = useState(SAMPLE_JSON)

  // Recompute render output on every input change. Errors are surfaced in the
  // UI instead of thrown, so a bad template or malformed JSON never crashes.
  const { rendered, error, errorLabel } = useMemo(() => {
    let parsed
    try {
      parsed = JSON.parse(jsonText)
    } catch (e) {
      return { rendered: '', error: e.message, errorLabel: 'JSON parse error' }
    }
    try {
      return { rendered: Mustache.render(template, parsed), error: null }
    } catch (e) {
      return { rendered: '', error: e.message, errorLabel: 'Template error' }
    }
  }, [template, jsonText])

  // Local dev-only playground: rendering user-supplied Markdown as HTML is fine.
  const previewHtml = useMemo(
    () => (error ? '' : marked.parse(rendered, { breaks: true })),
    [rendered, error],
  )

  const formatJson = () => {
    try {
      setJsonText(JSON.stringify(JSON.parse(jsonText), null, 2))
    } catch {
      // Leave the text as-is if it can't be parsed; the error is already shown.
    }
  }

  return (
    <div className="app">
      <header className="app__header">
        <h1>🥸 Mustache Playground</h1>
        <span className="app__subtitle">
          Paste a template and a JSON view — rendered live.
        </span>
      </header>

      <main className="grid">
        <section className="pane">
          <div className="pane__head">
            <h2>Template</h2>
          </div>
          <textarea
            className="editor"
            value={template}
            onChange={(e) => setTemplate(e.target.value)}
            spellCheck={false}
            placeholder="Paste your Mustache template here…"
          />
        </section>

        <section className="pane">
          <div className="pane__head">
            <h2>JSON view</h2>
            <button className="btn" onClick={formatJson} type="button">
              Format JSON
            </button>
          </div>
          <textarea
            className="editor"
            value={jsonText}
            onChange={(e) => setJsonText(e.target.value)}
            spellCheck={false}
            placeholder="Paste the JSON object of values here…"
          />
        </section>

        <section className="pane">
          <div className="pane__head">
            <h2>Raw output</h2>
          </div>
          {error ? (
            <div className="error">
              <strong>{errorLabel}:</strong> {error}
            </div>
          ) : (
            <pre className="raw">{rendered}</pre>
          )}
        </section>

        <section className="pane">
          <div className="pane__head">
            <h2>Markdown preview</h2>
          </div>
          {error ? (
            <div className="preview preview--empty">—</div>
          ) : (
            <div
              className="preview"
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />
          )}
        </section>
      </main>
    </div>
  )
}

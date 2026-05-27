import { useState, useEffect } from 'react'
import { Plus, FileText, Trash2, Clock, BookOpen, Layers, Users, Sparkles, Sun, Moon } from 'lucide-react'
import EditingPage from './pages/EditingPage.jsx'

// Default starter templates
const templates = [
  {
    id: 'blank',
    name: 'Blank Document',
    desc: 'Start with a clean slate',
    icon: FileText,
    title: 'Untitled Document',
    content: '<h1>Untitled Document</h1><p>Start writing here...</p>'
  },
  {
    id: 'proposal',
    name: 'Project Proposal',
    desc: 'Pitch your next big idea',
    icon: Layers,
    title: 'Project Proposal: New Collaborative Suite',
    content: '<h1>Project Proposal: New Collaborative Suite</h1><p><strong>Author:</strong> Tanmay Wagh</p><p><strong>Status:</strong> Draft</p><hr/><h2>1. Executive Summary</h2><p>Our organization requires a real-time collaborative document platform to unite remote teams and boost documentation speed. This proposal outlines a lightweight, high-fidelity system built with Vite, React, Express, and Quill.</p><h2>2. Key Objectives</h2><ul><li>Seamless rich-text editing experience with custom layout overrides.</li><li>Real-time collaborative simulation (chat feeds, custom comments, live headers).</li><li>Optimized response times and dark mode integration.</li></ul><h2>3. Next Steps</h2><p>Review this outline with engineering leaders to prepare database migration schemas.</p>'
  },
  {
    id: 'meeting',
    name: 'Meeting Notes',
    desc: 'Track agendas, action items',
    icon: Users,
    title: 'Weekly Engineering Sync Notes',
    content: '<h1>Weekly Engineering Sync Notes</h1><p><strong>Date:</strong> May 2026</p><p><strong>Attendees:</strong> Tanmay Wagh, Antigravity, Alex Johnson, Lisa Chen</p><hr/><h2>Meeting Agenda</h2><ol><li>Review frontend build pipelines (Webpack vs Vite).</li><li>Demo of new Quill Editor integration.</li><li>Real-time sync performance testing.</li></ol><h2>Action Items</h2><ul><li><strong>Tanmay:</strong> Review PR for backend web socket gateways.</li><li><strong>Antigravity:</strong> Fine-tune CSS overrides for snow toolbar theme.</li><li><strong>Lisa:</strong> Deploy staging cluster.</li></ul>'
  }
]

// Default initial documents if localStorage is empty
const defaultDocs = [
  {
    id: 'doc-1',
    title: '🚀 Getting Started with Quill Suite',
    content: `<h1>🚀 Getting Started with Quill Suite</h1><p>Welcome to your new <strong>collaborative document editor</strong>! This platform is designed to provide an elegant, responsive writing experience. Here are a few things you can do in this workspace:</p><p></p><h2>🔥 Custom Rich Text Features</h2><p>You can write and format text using the interactive toolbar above. Select styles like:</p><ul><li><strong>Bold</strong>, <em>italic</em>, <u>underlined</u>, or <del>strikethrough</del> text.</li><li>Dynamic header hierarchies (H1, H2, H3).</li><li>Ordered and bulleted lists.</li><li>Custom syntax code highlights for software engineers:</li></ul><pre class="ql-syntax" spellcheck="false">const system = {
  name: "Antigravity Realtime Docs",
  version: "2.0.0",
  collaborative: true
};
console.log(\`System initialized: \${system.name}\`);
</pre><p></p><h2>👥 Real-Time Collaboration Mockup</h2><p>Look at the sidebars on each side of your canvas:</p><ul><li><strong>Left Sidebar:</strong> View an auto-extracted <strong>Document Outline</strong> of all H1 & H2 headings. Click on any heading to instantly scroll to it. You can also view <em>Version History</em>!</li><li><strong>Right Sidebar:</strong> Chat with simulated team members in the <strong>Live Chat</strong> panel. Type a message and watch them reply instantly! You can also leave structured feedback in the <strong>Comments</strong> panel.</li></ul><p></p><blockquote>"Writing is an exploration. You start from nothing and learn as you go." — E.L. Doctorow</blockquote><p></p><p>Explore the features, open the <strong>Share</strong> modal in the top header, and enjoy writing!</p>`,
    lastModified: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    wordCount: 165
  }
]

function App() {
  const [documents, setDocuments] = useState(() => {
    const saved = localStorage.getItem('realtime_docs_list')
    if (saved) {
      try {
        return JSON.parse(saved)
      } catch (e) {
        console.error('Failed to load docs from localstorage', e)
      }
    }
    return defaultDocs
  })

  const [currentDocId, setCurrentDocId] = useState(null)

  // Initialize theme with localStorage and fall back to prefers-color-scheme
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('app-theme')
    if (saved) return saved
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })

  // Sync theme class to documentElement
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
    localStorage.setItem('app-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'))
  }

  // Sync docs list to localStorage
  useEffect(() => {
    localStorage.setItem('realtime_docs_list', JSON.stringify(documents))
  }, [documents])

  const handleCreateDocument = (templateId) => {
    const template = templates.find((t) => t.id === templateId) || templates[0]
    const wordCount = template.content.split(/\s+/).filter(Boolean).length

    const newDoc = {
      id: `doc-${Date.now()}`,
      title: template.title,
      content: template.content,
      lastModified: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
      wordCount: wordCount
    }

    setDocuments([newDoc, ...documents])
    setCurrentDocId(newDoc.id)
  }

  const handleDeleteDocument = (id, e) => {
    e.stopPropagation() // Prevent opening the doc card
    const updated = documents.filter((doc) => doc.id !== id)
    setDocuments(updated)
    // Clean up corresponding doc content inside localStorage
    localStorage.removeItem(`doc_content_${id}`)
  }

  const handleUpdateDocumentContent = (id, updatedTitle, updatedContent, updatedWordCount) => {
    const updatedDocs = documents.map((doc) => {
      if (doc.id === id) {
        return {
          ...doc,
          title: updatedTitle,
          content: updatedContent,
          wordCount: updatedWordCount,
          lastModified: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
        }
      }
      return doc
    })
    setDocuments(updatedDocs)
  }

  // Find the selected document
  const activeDocument = documents.find((doc) => doc.id === currentDocId)

  // If a document is active, render the EditingPage with theme props
  if (currentDocId && activeDocument) {
    return (
      <EditingPage
        document={activeDocument}
        theme={theme}
        toggleTheme={toggleTheme}
        onBack={() => setCurrentDocId(null)}
        onSave={(title, content, wordCount) => {
          handleUpdateDocumentContent(currentDocId, title, content, wordCount)
        }}
      />
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      <header className="dashboard-header">
        <div className="dashboard-header-left">
          <Sparkles size={20} style={{ color: 'var(--accent)' }} />
          <span className="brand-title">Quill Suite</span>
        </div>
        <div className="dashboard-header-right">
          <button className="theme-toggle-btn" onClick={toggleTheme} title={theme === 'dark' ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>
      <div className="dashboard-container">
      <div className="dashboard-hero">
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', color: 'var(--accent)' }}>
            <Sparkles size={20} />
            <span style={{ fontSize: '14px', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px' }}>Welcome back</span>
          </div>
          <h1 className="dashboard-hero-title">Real-Time Workspace</h1>
          <p className="dashboard-hero-subtitle">
            Create, design, and co-write beautiful documents. Use customizable rich-text setups with interactive feedback outlines, team timelines, and simulated collaboration gates.
          </p>
        </div>
        <div style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          fontSize: '180px',
          fontWeight: 800,
          color: 'var(--accent-bg)',
          zIndex: 1,
          userSelect: 'none',
          pointerEvents: 'none'
        }}>
          DOCS
        </div>
      </div>

      {/* Template Gallery */}
      <div>
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Start a New Document</h2>
        </div>
        <div className="templates-grid">
          {templates.map((template) => {
            const Icon = template.icon
            return (
              <div
                key={template.id}
                className="template-card"
                onClick={() => handleCreateDocument(template.id)}
              >
                <div className="template-icon-wrapper">
                  <Icon size={22} />
                </div>
                <div>
                  <h3 className="template-name">{template.name}</h3>
                  <p className="template-desc">{template.desc}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Documents Section */}
      <div style={{ marginTop: '20px' }}>
        <div className="dashboard-section-header">
          <h2 className="dashboard-section-title">Your Recent Documents</h2>
          <button className="btn-primary" onClick={() => handleCreateDocument('blank')}>
            <Plus size={16} /> New Document
          </button>
        </div>

        {documents.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📂</div>
            <h3 style={{ margin: 0, color: 'var(--text-h)' }}>No documents found</h3>
            <p style={{ margin: 0, color: 'var(--text)', fontSize: '14px' }}>
              Create a document using one of the templates above or start from scratch!
            </p>
            <button className="btn-primary" onClick={() => handleCreateDocument('blank')}>
              <Plus size={16} /> Create Blank Document
            </button>
          </div>
        ) : (
          <div className="docs-grid">
            {documents.map((doc) => (
              <div
                key={doc.id}
                className="doc-card"
                onClick={() => setCurrentDocId(doc.id)}
              >
                <div className="doc-card-header">
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flex: 1 }}>
                    <FileText size={18} style={{ color: 'var(--accent)', marginTop: '2px' }} />
                    <h3 className="doc-card-title">{doc.title || 'Untitled Document'}</h3>
                  </div>
                  <button
                    className="doc-card-delete"
                    title="Delete document"
                    onClick={(e) => handleDeleteDocument(doc.id, e)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="doc-card-footer">
                  <div className="doc-card-stat">
                    <Clock size={12} />
                    <span className="doc-card-date">{doc.lastModified}</span>
                  </div>
                  <div className="doc-card-stat">
                    <span style={{ fontWeight: 600 }}>{doc.wordCount || 0}</span> words
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </div>
  )
}

export default App

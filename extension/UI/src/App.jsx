import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import { DitherShader } from '@/components/ui/dither-shader.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import {
  Marquee,
  MarqueeContent,
  MarqueeItem,
  MarqueeViewport,
} from "@/components/ui/marquee.jsx"
import { Button } from "@/components/ui/button.jsx"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group.jsx"
import { extractJobFromPage } from './utils/extractJob.js'
import { ChevronRight, Check, X, Loader2 } from 'lucide-react'

const BACKEND_BASE_URLS = [
  'http://localhost:3001',
  'http://localhost:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3000',
]

const ALLOWED_JOB_DOMAINS = [
  'linkedin.com',
  'indeed.com',
  'glassdoor.com',
  'greenhouse.io',
  'lever.co',
  'workable.com',
  'smartrecruiters.com',
  'jobvite.com',
  'ashbyhq.com',
  'bamboohr.com',
  'bestjobs.eu',
  'ejobs.ro',
  'hipo.ro',
  'remoteok.com',
  'weworkremotely.com',
  'wellfound.com',
  'angel.co',
  'ziprecruiter.com',
  'monster.com',
  'dice.com',
  'simplyhired.com',
  'careerbuilder.com',
  'jooble.org',
]

function isJobBoardAllowed(url) {
  if (!url) return false
  try {
    const parsed = new URL(url)
    const hostname = parsed.hostname.toLowerCase()
    return ALLOWED_JOB_DOMAINS.some((domain) => {
      const d = domain.toLowerCase()
      return hostname === d || hostname.endsWith(`.${d}`)
    })
  } catch {
    return false
  }
}

async function getTabFavicon(tab) {
  if (!tab || !tab.url) return null

  const candidates = []
  if (tab.favIconUrl) {
    candidates.push(tab.favIconUrl)
  }

  if (typeof chrome !== 'undefined' && chrome.scripting?.executeScript && tab.id) {
    try {
      const domIcons = await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: () => {
          const link = document.querySelector(
            'link[rel~="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]'
          )
          return link ? link.href : null
        },
      })
      if (domIcons && domIcons[0]?.result) {
        candidates.unshift(domIcons[0].result)
      }
    } catch {
      // Scripting might be restricted on internal or protected pages
    }
  }

  try {
    const urlObj = new URL(tab.url)
    if (urlObj.protocol === 'http:' || urlObj.protocol === 'https:') {
      candidates.push(`${urlObj.origin}/favicon.ico`)
    }
  } catch {
    // Ignore invalid url
  }

  const uniqueCandidates = [...new Set(candidates.filter(Boolean))]

  for (const candidate of uniqueCandidates) {
    try {
      if (candidate.startsWith('data:')) {
        return candidate
      }
      const res = await fetch(candidate)
      if (res.ok) {
        const blob = await res.blob()
        if (blob && blob.size > 0) {
          return URL.createObjectURL(blob)
        }
      }
    } catch {
      // Try next candidate
    }
  }

  return null
}

export default function App() {
  const [user, setUser] = useState(null)
  const [loginInput, setLoginInput] = useState("")
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const [saveStatus, setSaveStatus] = useState("idle") // "idle" | "saving" | "success" | "error"
  const [extractedJob, setExtractedJob] = useState(null)
  const [currentTabUrl, setCurrentTabUrl] = useState("")
  const [siteIcon, setSiteIcon] = useState(reactLogo)

  // Revoke previous blob URL to prevent memory leaks
  useEffect(() => {
    return () => {
      if (siteIcon && siteIcon.startsWith('blob:')) {
        URL.revokeObjectURL(siteIcon)
      }
    }
  }, [siteIcon])

  // Detect active user and analyze active page on mount
  useEffect(() => {
    async function init() {
      // 1. Check user session token from chrome.storage.local or active SPA tab
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        try {
          const stored = await chrome.storage.local.get(['cv_builder_token', 'cv_builder_user'])
          let activeToken = stored?.cv_builder_token || (typeof stored?.cv_builder_user === 'object' ? stored.cv_builder_user?.id : null)
          let detectedUser = stored?.cv_builder_user || null

          if (chrome.tabs?.query && chrome.scripting?.executeScript) {
            const tabs = await chrome.tabs.query({
              url: [
                '*://localhost:5173/*',
                '*://127.0.0.1:5173/*',
                '*://localhost:3001/*',
                '*://localhost:3000/*',
              ],
            })
            if (tabs.length > 0) {
              const results = await chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: () => {
                  const token = localStorage.getItem('cv_builder_token')
                  const raw = localStorage.getItem('cv_builder_user')
                  return {
                    token,
                    user: raw ? JSON.parse(raw) : null
                  }
                },
              })
              if (results && results[0]?.result) {
                const spaRes = results[0].result
                if (spaRes.token || spaRes.user) {
                  activeToken = spaRes.token || spaRes.user?.id
                  detectedUser = spaRes.user || { id: activeToken, name: '' }
                  await chrome.storage.local.set({
                    cv_builder_token: activeToken,
                    cv_builder_user: detectedUser
                  })
                }
              }
            }
          }

          if (detectedUser) {
            setUser(detectedUser)
          } else if (activeToken) {
            setUser({ id: activeToken, name: '' })
          }
        } catch (err) {
          console.warn('Eroare la citirea sesiunii utilizator:', err)
        }
      }

      // 2. Perform live extraction from current active tab
      if (typeof chrome !== 'undefined' && chrome.tabs?.query) {
        try {
          const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })
          if (tab?.url) {
            setCurrentTabUrl(tab.url)

            // Resolve website icon (fallback: reactLogo)
            try {
              const iconBlob = await getTabFavicon(tab)
              if (iconBlob) {
                const testImg = new Image()
                testImg.onload = () => setSiteIcon(iconBlob)
                testImg.onerror = () => setSiteIcon(reactLogo)
                testImg.src = iconBlob
              } else {
                setSiteIcon(reactLogo)
              }
            } catch {
              setSiteIcon(reactLogo)
            }

            // Check if site is allowed for job extraction
            if (!isJobBoardAllowed(tab.url)) {
              setExtractedJob(null)
              return
            }

            // Attempt extraction only if allowed and scriptable
            if (chrome.scripting?.executeScript) {
              const urlObj = new URL(tab.url)
              if (
                urlObj.protocol !== 'chrome:' &&
                urlObj.protocol !== 'chrome-extension:' &&
                urlObj.protocol !== 'about:' &&
                urlObj.protocol !== 'edge:'
              ) {
                const results = await chrome.scripting.executeScript({
                  target: { tabId: tab.id },
                  func: extractJobFromPage,
                })
                if (results && results[0]?.result) {
                  setExtractedJob(results[0].result)
                }
              }
            }
          }
        } catch (err) {
          console.warn('Eroare la analiza tab-ului curent:', err)
        }
      }
    }

    init()
  }, [])

  // 1. Unified Login / Register fetch function by username
  const handleLogin = async (e) => {
    e.preventDefault()
    const name = loginInput.trim()
    if (!name || isLoggingIn) return

    setIsLoggingIn(true)
    let authenticatedUser = null
    let lastError = null

    for (const base of BACKEND_BASE_URLS) {
      try {
        const res = await fetch(`${base}/api/users/auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name }),
        })

        if (res.ok) {
          const data = await res.json()
          if (data?.success && data?.user) {
            authenticatedUser = data.user
            break
          } else {
            lastError = new Error(data?.error || 'Eroare la autentificare')
          }
        } else {
          lastError = new Error(`Status ${res.status}`)
        }
      } catch (networkErr) {
        lastError = networkErr
      }
    }

    setIsLoggingIn(false)

    if (authenticatedUser) {
      setUser(authenticatedUser)
      setLoginInput("")
      localStorage.setItem('cv_builder_token', authenticatedUser.id)
      localStorage.setItem('cv_builder_user', JSON.stringify(authenticatedUser))
      if (typeof chrome !== 'undefined' && chrome.storage?.local) {
        await chrome.storage.local.set({
          cv_builder_token: authenticatedUser.id,
          cv_builder_user: authenticatedUser
        })
      }
    } else {
      console.warn('Eroare autentificare backend:', lastError)
    }
  }

  // 2. Save Target Job fetch function using user token ID
  const handleSave = async () => {
    const token = (typeof user === 'object' ? user?.id : user) || localStorage.getItem('cv_builder_token')
    if (saveStatus === "success" || saveStatus === "saving" || !token || !extractedJob) return
    setSaveStatus("saving")

    const jobTitle = extractedJob.title
    const jobCompany = extractedJob.company
    const jobLocation = extractedJob.location
    const jobDesc = extractedJob.description
    const jobUrl = currentTabUrl || extractedJob.url || window.location.href

    const payload = {
      userId: token,
      title: jobTitle,
      company: jobCompany,
      location: jobLocation,
      description: jobDesc,
      url: jobUrl,
      iconSeed: extractedJob.iconSeed || jobCompany?.replace(/[^a-zA-Z0-9]/g, '') || 'Tech',
      importedAt: extractedJob.importedAt || new Date().toISOString(),
    }

    let response = null
    let lastError = null

    for (const base of BACKEND_BASE_URLS) {
      try {
        const res = await fetch(`${base}/api/target-jobs`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-user-id': token,
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(payload),
        })
        if (res.ok) {
          response = res
          break
        } else {
          lastError = new Error(`Status ${res.status}: ${res.statusText}`)
        }
      } catch (networkErr) {
        lastError = networkErr
      }
    }

    if (response) {
      try {
        const result = await response.json()
        if (result.success) {
          const savedJob = result.job || result.data || payload
          setSaveStatus("success")

          // Broadcast to open CVBuilder tabs
          if (typeof chrome !== 'undefined' && chrome.tabs?.query && chrome.scripting?.executeScript) {
            try {
              const openTabs = await chrome.tabs.query({
                url: [
                  '*://localhost:5173/*',
                  '*://127.0.0.1:5173/*',
                  '*://localhost:3001/*',
                  '*://localhost:3000/*',
                ],
              })
              for (const t of openTabs) {
                chrome.scripting.executeScript({
                  target: { tabId: t.id },
                  func: (job) => {
                    window.postMessage({ type: 'CVBUILDER_JOB_IMPORTED', job }, '*')
                  },
                  args: [savedJob],
                })
              }
            } catch (notifyErr) {
              console.warn('Nu s-a putut notifica tab-ul CVBuilder:', notifyErr)
            }
          }
          return
        }
      } catch (parseErr) {
        console.warn('Eroare parsare răspuns salvare:', parseErr)
      }
    }

    // If fetch failed
    console.error('Eroare la salvarea job-ului:', lastError)
    setSaveStatus("error")
    setTimeout(() => {
      setSaveStatus("idle")
    }, 3000)
  }

  // Display name for user
  const userName = user ? (typeof user === 'object' ? (user.name || user.id) : user) : ""

  // Compute word count for description
  const descriptionWordCount = extractedJob?.description
    ? extractedJob.description.trim().split(/\s+/).filter(Boolean).length
    : null

  // Dynamic job details from extraction or fallback
  const JOB_DETAILS = [
    { name: "TITLE", data: extractedJob?.title || "Driver not found" },
    { name: "COMPANY", data: extractedJob?.company || "Driver not found" },
    { name: "LOCATION", data: extractedJob?.location || "Driver not found" },
    {
      name: "DESCRIPTION",
      data: descriptionWordCount !== null ? `${descriptionWordCount} words` : "Driver not found",
    },
  ]

  return (
    <div className="w-[380px] bg-background text-foreground text-xs select-none antialiased">
      {/* Header */}
      <div className="flex items-center justify-between px-3.5 py-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <h2 className="text-xs font-semibold tracking-tight text-foreground truncate m-0">
            Web Extractor
          </h2>
        </div>

        {userName ? (
          <div className="flex items-center gap-1.5 shrink-0 text-[11px] text-muted-foreground">
            <span className="font-medium text-foreground max-w-[85px] truncate">
              {userName}
            </span>
          </div>
        ) : (
          <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/70 bg-muted/40 px-1.5 py-0.5 rounded">
            
          </span>
        )}
      </div>

      <Separator />

      {/* Main Body */}
      <div className="flex flex-col items-center gap-3 p-3.5 w-full max-w-full overflow-hidden">
        {/* Scraped Company Visual / Logo */}
        <div className="relative size-20 shrink-0 rounded-lg overflow-hidden bg-muted/10 shadow-xs">
          <DitherShader
            key={siteIcon}
            src={siteIcon}
            gridSize={1}
            objectFit="contain"
            ditherMode="bayer"
            colorMode="grayscale"
            invert={false}
            animated={true}
            animationSpeed={0.5}
            primaryColor="#000000"
            secondaryColor="#f5f5f5"
            threshold={0.5}
            className="size-full"
          />
        </div>

        {/* Content Action Panel */}
        <div className="w-full min-w-0 max-w-full overflow-hidden flex flex-col justify-center gap-2">
          {userName ? (
            <>
              <Marquee
                translations={{ root: "Job details ticker" }}
                autoFill
                speed={40}
                spacing="1.25rem"
                className="h-9 w-full max-w-full border-none shadow-none overflow-hidden"
              >
                <MarqueeViewport>
                  <MarqueeContent>
                    {JOB_DETAILS.map((item, index) => (
                      <MarqueeItem
                        key={`${item.name}-${index}`}
                        className="border-none bg-transparent px-1.5 py-0 shadow-none"
                      >
                        <div className="flex flex-col items-center gap-1.5 whitespace-nowrap">
                          <span className="text-[9px] font-bold uppercase tracking-wider text-muted-foreground/80">
                            {item.name}:
                          </span>
                          <span className="text-xs font-medium text-foreground">
                            {item.data}
                          </span>
                        </div>
                      </MarqueeItem>
                    ))}
                  </MarqueeContent>
                </MarqueeViewport>
              </Marquee>

              {/* Disable the button after saving once. Change text content accordingly with checkmark or x icon */}
              <Button
                onClick={handleSave}
                disabled={saveStatus === "success" || saveStatus === "saving" || !extractedJob}
                loading={saveStatus === "saving"}
                variant={saveStatus === "error" ? "destructive" : "default"}
                size="sm"
                className="w-full h-7 text-xs font-medium transition-all border-none"
              >
                {saveStatus === "idle" && "Save"}
                {saveStatus === "saving" && <Loader2 className="size-3.5 animate-spin" />}
                {saveStatus === "success" && <Check className="size-3.5" />}
                {saveStatus === "error" && <X className="size-3.5" />}
              </Button>
            </>
          ) : (
            <form onSubmit={handleLogin} className="w-full">
              <InputGroup className="w-12/13 mx-auto">
                <InputGroupInput
                  placeholder="Login with username"
                  type="text"
                  value={loginInput}
                  onChange={(e) => setLoginInput(e.target.value)}
                  className="h-7 text-xs placeholder:text-muted-foreground/60"
                  disabled={isLoggingIn}
                />
                <InputGroupAddon align="inline-end">
                  <Button
                    type="submit"
                    size="xs"
                    variant="secondary"
                    className="size-5.5 p-0"
                    aria-label="Login"
                    disabled={isLoggingIn}
                  >
                    {isLoggingIn ? (
                      <Loader2 className="size-3 animate-spin" />
                    ) : (
                      <ChevronRight className="size-3" />
                    )}
                  </Button>
                </InputGroupAddon>
              </InputGroup>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

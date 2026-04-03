import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useInView } from 'framer-motion'
import {
  Zap, Phone, TrendingUp, Shield, Users, ArrowRight, Check,
  ChevronDown, Star, Clock, DollarSign, BarChart3, Target,
  PhoneCall, Megaphone, UserCheck, RefreshCw, AlertTriangle,
  Building2, Wifi, Radio, Globe
} from 'lucide-react'
import './index.css'

// ─── Animated Counter ───
function Counter({ end, suffix = '', prefix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-100px' })

  useEffect(() => {
    if (!inView) return
    let start = 0
    const step = end / (duration / 16)
    const timer = setInterval(() => {
      start += step
      if (start >= end) { setCount(end); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 16)
    return () => clearInterval(timer)
  }, [inView, end, duration])

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>
}

// ─── Fade-in wrapper ───
function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ─── Quiz Component (Gap Selling) ───
function Quiz({ onComplete }) {
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState({})

  const questions = [
    {
      id: 'infrastructure',
      question: 'Do you own your own broadband infrastructure?',
      subtitle: 'Towers, fiber, fixed wireless, DOCSIS — any combination.',
      options: [
        { label: 'Yes, we own our infrastructure', value: 'yes', icon: Radio },
        { label: 'No, we resell or are planning to build', value: 'no', icon: Globe },
      ]
    },
    {
      id: 'revenue',
      question: 'What\'s your monthly recurring revenue?',
      subtitle: 'This helps us recommend the right growth path for your size.',
      options: [
        { label: 'Under $25K/mo', value: 'under25k', icon: Building2 },
        { label: '$25K — $100K/mo', value: '25k-100k', icon: TrendingUp },
        { label: 'Over $100K/mo', value: 'over100k', icon: BarChart3 },
      ]
    },
    {
      id: 'pain',
      question: 'What\'s the #1 thing keeping you up at night?',
      subtitle: 'Be honest. We\'ve heard it all from 30+ ISP owners.',
      options: [
        { label: 'Not enough new subscribers', value: 'growth', icon: Users },
        { label: 'Leads come in but nobody closes them', value: 'sales', icon: PhoneCall },
        { label: 'Customers are churning to competitors', value: 'churn', icon: RefreshCw },
        { label: 'All of the above', value: 'all', icon: AlertTriangle },
      ]
    }
  ]

  const handleAnswer = (questionId, value) => {
    const next = { ...answers, [questionId]: value }
    setAnswers(next)
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300)
    } else {
      setTimeout(() => onComplete(next), 400)
    }
  }

  const q = questions[step]

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Progress */}
      <div className="flex gap-2 mb-8">
        {questions.map((_, i) => (
          <div key={i} className="flex-1 h-1 rounded-full overflow-hidden bg-white/10">
            <motion.div
              className="h-full bg-ping-orange rounded-full"
              initial={{ width: 0 }}
              animate={{ width: i <= step ? '100%' : '0%' }}
              transition={{ duration: 0.4 }}
            />
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3 }}
        >
          <p className="text-ping-orange text-sm font-semibold tracking-widest uppercase mb-3">
            Question {step + 1} of {questions.length}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {q.question}
          </h3>
          <p className="text-gray-400 mb-8">{q.subtitle}</p>

          <div className="grid gap-3">
            {q.options.map((opt) => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.value}
                  onClick={() => handleAnswer(q.id, opt.value)}
                  className="group flex items-center gap-4 w-full p-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.08] hover:border-ping-orange/50 transition-all duration-200 text-left cursor-pointer"
                >
                  <div className="w-10 h-10 rounded-lg bg-ping-orange/10 flex items-center justify-center group-hover:bg-ping-orange/20 transition-colors">
                    <Icon className="w-5 h-5 text-ping-orange" />
                  </div>
                  <span className="text-white font-medium">{opt.label}</span>
                  <ArrowRight className="w-4 h-4 text-gray-500 ml-auto group-hover:text-ping-orange group-hover:translate-x-1 transition-all" />
                </button>
              )
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

// ─── Pain Quote Component ───
function PainQuote({ quote, author, context }) {
  return (
    <FadeIn>
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-red-500/5 to-transparent border border-red-500/10">
        <div className="text-red-400/40 text-5xl font-serif absolute top-3 left-4">"</div>
        <p className="text-lg md:text-xl text-gray-200 italic pl-6 mb-3">{quote}</p>
        <p className="text-sm text-gray-500 pl-6">— {author}{context && <span className="text-gray-600"> · {context}</span>}</p>
      </div>
    </FadeIn>
  )
}

// ─── Stat Card ───
function StatCard({ value, label, icon: Icon }) {
  return (
    <FadeIn>
      <div className="text-center p-6">
        <div className="w-12 h-12 rounded-xl bg-ping-orange/10 flex items-center justify-center mx-auto mb-3">
          <Icon className="w-6 h-6 text-ping-orange" />
        </div>
        <div className="text-3xl md:text-4xl font-bold text-white mb-1">{value}</div>
        <div className="text-sm text-gray-400">{label}</div>
      </div>
    </FadeIn>
  )
}

// ─── CTA Button ───
function CTAButton({ children, variant = 'primary', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-semibold text-base transition-all duration-200 cursor-pointer'
  const variants = {
    primary: 'bg-ping-orange hover:bg-ping-orange/90 text-white shadow-lg shadow-ping-orange/25 hover:shadow-xl hover:shadow-ping-orange/30 hover:-translate-y-0.5',
    secondary: 'bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20',
    green: 'bg-ping-green hover:bg-ping-green/90 text-white shadow-lg shadow-ping-green/25 hover:shadow-xl hover:shadow-ping-green/30 hover:-translate-y-0.5',
  }
  return <button className={`${base} ${variants[variant]} ${className}`} {...props}>{children}</button>
}

// ─── Main App ───
export default function App() {
  const [quizResult, setQuizResult] = useState(null)
  const [showQuiz, setShowQuiz] = useState(false)
  const resultRef = useRef(null)

  const handleQuizComplete = (answers) => {
    setQuizResult(answers)
    setTimeout(() => {
      resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 200)
  }

  // Determine recommended tier
  const getRecommendation = () => {
    if (!quizResult) return null
    const { revenue, pain } = quizResult
    if (revenue === 'over100k' || revenue === '25k-100k') {
      return 'growth-program'
    }
    return 'isp-finder'
  }

  const recommendation = getRecommendation()

  return (
    <div className="min-h-screen bg-navy-950 text-gray-300 font-sans overflow-x-hidden">

      {/* ═══════ NAV ═══════ */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-navy-950/80 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-ping-orange flex items-center justify-center">
              <Wifi className="w-4 h-4 text-white" />
            </div>
            <span className="text-white font-bold text-lg">Ping</span>
          </div>
          <a
            href="#quiz"
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-ping-orange hover:bg-ping-orange/90 text-white text-sm font-semibold transition-all"
          >
            Get Your Growth Plan <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </nav>

      {/* ═══════ HERO — THE GAP ═══════ */}
      <section className="relative pt-32 pb-20 px-6">
        {/* Gradient orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-ping-orange/[0.04] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-40 right-0 w-[400px] h-[400px] bg-red-500/[0.03] rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium mb-8">
              <AlertTriangle className="w-4 h-4" />
              The problem nobody talks about at WISPA events
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.05] tracking-tight mb-6">
              You built the network.
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-ping-orange">
                Where are the customers?
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.2}>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              You spent millions on towers, fiber, and spectrum. You hired technicians,
              bought trucks, and lit up coverage zones. But the installs aren't coming.
              The leads that do come in? Nobody's following up fast enough.
            </p>
          </FadeIn>

          <FadeIn delay={0.3}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton onClick={() => { setShowQuiz(true); document.getElementById('quiz')?.scrollIntoView({ behavior: 'smooth' }) }}>
                Find Out What's Broken <ArrowRight className="w-5 h-5" />
              </CTAButton>
              <CTAButton variant="secondary" onClick={() => document.getElementById('pain')?.scrollIntoView({ behavior: 'smooth' })}>
                See the data <ChevronDown className="w-5 h-5" />
              </CTAButton>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ PAIN SECTION — REAL QUOTES ═══════ */}
      <section id="pain" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-red-500/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <FadeIn>
            <p className="text-ping-orange text-sm font-semibold tracking-widest uppercase mb-4 text-center">Real quotes from ISP owners</p>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
              Sound familiar?
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-xl mx-auto">
              We've been on 200+ sales calls with ISP owners just like you.
              Here's what they told us before we started working together.
            </p>
          </FadeIn>

          <div className="grid gap-6">
            <PainQuote
              quote="I spent about a million and a half dollars to build fiber... passed 6,000 homes. I've got 160 customers."
              author="Tim McAfee"
              context="Pioneer Broadband"
            />
            <PainQuote
              quote="We used to have one or two installs a day. That has come down to one or two installs a week."
              author="Fareed Saghir"
              context="Crystal Broadband"
            />
            <PainQuote
              quote="I'm spending hundreds of thousands of dollars and nothing is working. Nothing ever changes."
              author="Jeff Bernth"
              context="Wisper Internet · $200K/mo marketing budget"
            />
            <PainQuote
              quote="If there's one piece of our company that's weak, it's our marketing. Nobody's managing the Facebook marketing."
              author="Mark McGowan"
              context="Optimus Broadband"
            />
            <PainQuote
              quote="We sent thousands of EDDM mailers. Not a single phone call."
              author="Fareed Saghir"
              context="Crystal Broadband"
            />
            <PainQuote
              quote="I've lost $4,500 a month so far this year."
              author="Chris Stewart"
              context="LightSpeed Internet"
            />
          </div>
        </div>
      </section>

      {/* ═══════ THE GAP VISUALIZATION ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
              The gap is killing your business
            </h2>
            <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
              You're great at building networks. But the gap between "network lit" and
              "subscriber paying" is where ISPs die.
            </p>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-4">
            <FadeIn delay={0}>
              <div className="p-8 rounded-2xl bg-red-500/5 border border-red-500/10">
                <div className="text-red-400 text-sm font-semibold uppercase tracking-wider mb-4">Where you are</div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex gap-3"><AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /> Leads come in at 10am, get called back at 4pm</li>
                  <li className="flex gap-3"><AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /> Billing person is also your "marketing department"</li>
                  <li className="flex gap-3"><AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /> Customers churn and you only find out when they cancel</li>
                  <li className="flex gap-3"><AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" /> No idea which marketing actually works</li>
                </ul>
              </div>
            </FadeIn>

            <FadeIn delay={0.1}>
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 flex flex-col items-center justify-center text-center">
                <div className="w-16 h-16 rounded-full bg-ping-orange/10 flex items-center justify-center mb-4">
                  <ArrowRight className="w-8 h-8 text-ping-orange" />
                </div>
                <div className="text-2xl font-bold text-white mb-2">The Gap</div>
                <p className="text-gray-500 text-sm">This is where subscribers — and revenue — disappear</p>
              </div>
            </FadeIn>

            <FadeIn delay={0.2}>
              <div className="p-8 rounded-2xl bg-ping-green/5 border border-ping-green/10">
                <div className="text-ping-green text-sm font-semibold uppercase tracking-wider mb-4">Where you should be</div>
                <ul className="space-y-3 text-gray-300">
                  <li className="flex gap-3"><Check className="w-5 h-5 text-ping-green shrink-0 mt-0.5" /> Every lead called back in 20 seconds</li>
                  <li className="flex gap-3"><Check className="w-5 h-5 text-ping-green shrink-0 mt-0.5" /> Dedicated growth team running your marketing</li>
                  <li className="flex gap-3"><Check className="w-5 h-5 text-ping-green shrink-0 mt-0.5" /> Churn caught before the cancellation call</li>
                  <li className="flex gap-3"><Check className="w-5 h-5 text-ping-green shrink-0 mt-0.5" /> 15+ installs per month, predictably</li>
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* ═══════ SOCIAL PROOF STATS ═══════ */}
      <section className="py-16 px-6 border-y border-white/5">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          <StatCard value={<Counter end={2002} suffix="+" />} label="Sales Closed for ISPs" icon={Target} />
          <StatCard value={<Counter end={1055} suffix="+" />} label="Installs Completed" icon={Check} />
          <StatCard value={<><Counter prefix="$" end={74} suffix="K+" /></>} label="Monthly Revenue Generated" icon={DollarSign} />
          <StatCard value={<Counter end={20} suffix="s" />} label="Average Lead Follow-Up" icon={Clock} />
        </div>
      </section>

      {/* ═══════ QUIZ SECTION ═══════ */}
      <section id="quiz" className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-ping-orange/[0.02] via-transparent to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          {!quizResult ? (
            <>
              <FadeIn>
                <p className="text-ping-orange text-sm font-semibold tracking-widest uppercase mb-4 text-center">
                  Free growth assessment
                </p>
                <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
                  What's the right move for your ISP?
                </h2>
                <p className="text-gray-400 text-center mb-12 max-w-xl mx-auto">
                  Answer 3 quick questions. We'll tell you exactly where the gap is —
                  and what it'll take to close it.
                </p>
              </FadeIn>
              <Quiz onComplete={handleQuizComplete} />
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ping-green/10 border border-ping-green/20 text-ping-green text-sm font-medium mb-6">
                <Check className="w-4 h-4" /> Assessment complete
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                {recommendation === 'growth-program'
                  ? 'You need the ISP Growth Program.'
                  : 'ISP Finder is your fastest path to revenue.'}
              </h3>
              <p className="text-gray-400 mb-6">Scroll down to see your personalized recommendation.</p>
              <ChevronDown className="w-6 h-6 text-ping-orange mx-auto animate-bounce" />
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════ TAILORED RESULTS ═══════ */}
      <div ref={resultRef}>
        {quizResult && recommendation === 'growth-program' && (
          <GrowthProgramSection />
        )}
        {quizResult && recommendation === 'isp-finder' && (
          <ISPFinderSection />
        )}
      </div>

      {/* ═══════ HOW IT WORKS (always visible) ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <FadeIn>
            <p className="text-ping-orange text-sm font-semibold tracking-widest uppercase mb-4 text-center">
              How it works
            </p>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">
              From zero leads to predictable installs
            </h2>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: '01', icon: Megaphone, title: 'We run the ads', desc: 'Hyper-local Facebook campaigns proven across 30+ ISPs. Your service area, your plans, your brand.' },
              { step: '02', icon: Zap, title: 'Lead comes in', desc: 'Consumer fills out a form. Within 20 seconds — not 20 minutes — our team is on the phone.' },
              { step: '03', icon: PhoneCall, title: 'Warm transfer', desc: 'We qualify the lead and warm-transfer directly to your team. They pick a plan. You schedule the install.' },
              { step: '04', icon: Shield, title: 'Retain & grow', desc: 'Private feedback catches churn before it happens. Reviews go up. Referrals kick in. Revenue compounds.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="text-center">
                  <div className="text-ping-orange/20 text-6xl font-black mb-4">{item.step}</div>
                  <div className="w-14 h-14 rounded-2xl bg-ping-orange/10 flex items-center justify-center mx-auto mb-4">
                    <item.icon className="w-7 h-7 text-ping-orange" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TRUST / CREDIBILITY ═══════ */}
      <section className="py-20 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-ping-orange/[0.02] to-transparent pointer-events-none" />
        <div className="max-w-4xl mx-auto relative">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-16">
              Built by an ISP owner.
              <br />
              <span className="text-gray-500">Not a marketing agency that Googled "WISP."</span>
            </h2>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-navy-800 to-navy-900 border border-white/5">
              <div className="flex flex-col md:flex-row gap-8 items-start">
                <div className="w-20 h-20 rounded-2xl bg-ping-orange/10 flex items-center justify-center shrink-0">
                  <Users className="w-10 h-10 text-ping-orange" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Evan Galvin, Founder</h3>
                  <div className="space-y-3 text-gray-300 leading-relaxed">
                    <p>
                      Founded his own wireless and fiber ISP 20 years ago. Built it from scratch.
                      5x'd revenue in the last 4 years. Had a successful exit.
                    </p>
                    <p>
                      Now he runs Ping Marketing — the only growth partner for ISPs that was actually
                      built by someone who lived your life. Wore every hat. Fixed towers in thunderstorms.
                      Chased invoices. Lost customers to Spectrum. Won them back.
                    </p>
                    <p className="text-ping-orange font-medium">
                      "We're not a marketing agency that learned about ISPs. We ARE ISPs.
                      We built one, scaled it, and sold it."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-4 mt-8">
            {[
              { icon: Shield, text: 'Month-to-month. No contracts. Cancel anytime.' },
              { icon: Target, text: 'One ISP per market. Your data stays yours.' },
              { icon: DollarSign, text: 'Commission-only option. Pay $0 unless we make you money.' },
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4">
                  <item.icon className="w-5 h-5 text-ping-green shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300">{item.text}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CASE STUDY ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <FadeIn>
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-ping-green/5 to-transparent border border-ping-green/10">
              <p className="text-ping-green text-sm font-semibold tracking-widest uppercase mb-4">Case study</p>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-6">
                VistaBeam: +80 extra sales per month
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="text-white font-semibold mb-3">The problem</h4>
                  <p className="text-gray-400 leading-relaxed mb-6">
                    VistaBeam had multiple full-time salespeople during the day. They thought
                    they had sales covered. They didn't. Leads were coming in during business
                    hours and not getting answered — staff was on other calls, at lunch, or doing installs.
                  </p>
                  <h4 className="text-white font-semibold mb-3">The result</h4>
                  <p className="text-gray-400 leading-relaxed">
                    Ping's team handled the overflow — the calls their team was missing.
                    Night calls. Weekend calls. Lunch break calls. The result:
                    <span className="text-ping-green font-bold"> 80 additional sales per month</span> from
                    leads their own team never got to.
                  </p>
                </div>
                <div className="space-y-4">
                  {[
                    { label: 'Sales from overflow calls', value: '+80/mo' },
                    { label: 'Follow-up speed', value: '20 seconds' },
                    { label: 'Risk to ISP', value: '$0 upfront' },
                    { label: 'Coverage', value: '24/7/365' },
                  ].map((stat, i) => (
                    <div key={i} className="flex justify-between items-center p-4 rounded-xl bg-navy-900/50 border border-white/5">
                      <span className="text-gray-400 text-sm">{stat.label}</span>
                      <span className="text-white font-bold">{stat.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ ROI MATH ═══════ */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Do the math
            </h2>
            <p className="text-gray-400 mb-12">Your competitors already did.</p>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="p-8 md:p-12 rounded-3xl bg-gradient-to-br from-navy-800 to-navy-900 border border-white/5">
              <div className="space-y-6 text-left max-w-md mx-auto">
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-400">Monthly ad spend</span>
                  <span className="text-white font-bold">$1,000</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-400">New installs (typical)</span>
                  <span className="text-white font-bold">10 — 20</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-400">Your ARPU</span>
                  <span className="text-white font-bold">$80/mo</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-400">New monthly revenue</span>
                  <span className="text-ping-green font-bold">$800 — $1,600</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-white/5">
                  <span className="text-gray-400">Avg. customer lifetime</span>
                  <span className="text-white font-bold">36 months</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-ping-green/5 rounded-xl px-4 -mx-4">
                  <span className="text-white font-semibold">Lifetime value from $1K spend</span>
                  <span className="text-ping-green font-bold text-xl">$28,800 — $57,600</span>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ FINAL CTA ═══════ */}
      <section className="py-24 px-6 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-ping-orange/[0.05] to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative">
          <FadeIn>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">
              Your competitors are growing
              <br />while you read this.
            </h2>
            <p className="text-gray-400 text-lg mb-10 max-w-xl mx-auto">
              Every day without a growth system is another day Starlink, T-Mobile 5G,
              and the new fiber overbuilder down the road steal your subscribers.
              <span className="text-white font-medium"> Month-to-month. No contracts. No risk.</span>
            </p>
          </FadeIn>
          <FadeIn delay={0.1}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton variant="green">
                Schedule Your Free Strategy Call <Phone className="w-5 h-5" />
              </CTAButton>
            </div>
            <p className="text-gray-600 text-sm mt-6">
              30-minute call with a former ISP operator. No pitch deck. Just your numbers.
            </p>
          </FadeIn>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-8 px-6 border-t border-white/5">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-ping-orange flex items-center justify-center">
              <Wifi className="w-3 h-3 text-white" />
            </div>
            <span className="text-white font-semibold text-sm">Ping Marketing</span>
            <span className="text-gray-600 text-sm">· Founded by a Former ISP Owner</span>
          </div>
          <p className="text-gray-600 text-sm">
            30 ISP clients · 2,002+ sales closed · $74K+ MRR generated
          </p>
        </div>
      </footer>
    </div>
  )
}

// ═══════ ISP GROWTH PROGRAM SECTION ═══════
function GrowthProgramSection() {
  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-ping-orange/[0.03] to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ping-orange/10 border border-ping-orange/20 text-ping-orange text-sm font-medium mb-6 mx-auto block text-center w-fit">
            <Star className="w-4 h-4" /> Recommended for you
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
            ISP Growth Program
          </h2>
          <p className="text-xl text-gray-400 text-center mb-4">
            Marketing. Sales. Retention. One partner.
          </p>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            You have the infrastructure and the revenue to scale aggressively.
            You don't need more leads — you need a system that generates leads,
            closes them, schedules installs, and prevents churn. That's us.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {[
            {
              icon: Megaphone, title: 'Marketing',
              color: 'ping-orange',
              items: [
                'Hyper-local Meta/Facebook campaigns',
                'Proven ad templates from 30+ ISPs',
                'Google Business Profile optimization',
                '$1,000 ad spend = 10-20 new installs',
              ]
            },
            {
              icon: UserCheck, title: 'Sales',
              color: 'ping-green',
              items: [
                '20-second lead follow-up',
                'Warm transfer OR we close it for you',
                'Night + weekend coverage',
                'Commission-only option available',
              ]
            },
            {
              icon: Shield, title: 'Retention',
              color: 'blue-400',
              items: [
                'Early churn detection surveys',
                'Google review generation',
                'Automated referral program',
                'Win-back outreach for churned subs',
              ]
            },
          ].map((pillar, i) => (
            <FadeIn key={i} delay={i * 0.1}>
              <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 h-full">
                <div className={`w-12 h-12 rounded-xl bg-${pillar.color}/10 flex items-center justify-center mb-4`}>
                  <pillar.icon className={`w-6 h-6 text-${pillar.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{pillar.title}</h3>
                <ul className="space-y-3">
                  {pillar.items.map((item, j) => (
                    <li key={j} className="flex gap-3 text-gray-400 text-sm">
                      <Check className="w-4 h-4 text-ping-green shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          ))}
        </div>

        <FadeIn>
          <div className="p-8 rounded-2xl bg-gradient-to-r from-navy-800 to-navy-900 border border-white/5 text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              $2,500<span className="text-lg text-gray-500 font-normal">/month</span>
            </div>
            <p className="text-gray-400 mb-1">+ $1,000 — $3,000/mo recommended ad spend</p>
            <p className="text-gray-500 text-sm mb-6">Month-to-month · No setup fee · 30-day money back</p>
            <CTAButton variant="green">
              Get Started with the Growth Program <ArrowRight className="w-5 h-5" />
            </CTAButton>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

// ═══════ ISP FINDER SECTION ═══════
function ISPFinderSection() {
  return (
    <section className="py-20 px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-ping-orange/[0.03] to-transparent pointer-events-none" />
      <div className="max-w-5xl mx-auto relative">
        <FadeIn>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ping-orange/10 border border-ping-orange/20 text-ping-orange text-sm font-medium mb-6 mx-auto block text-center w-fit">
            <Star className="w-4 h-4" /> Recommended for you
          </div>
          <h2 className="text-3xl md:text-5xl font-bold text-white text-center mb-4">
            ISP Finder
          </h2>
          <p className="text-xl text-gray-400 text-center mb-4">
            We generate the leads. We warm-transfer them to you. You close.
          </p>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            The fastest way to start getting installs without hiring a marketing team
            or a sales floor. We handle lead gen, follow-up, and qualification —
            you just answer the warm transfer and pick the plan.
          </p>
        </FadeIn>

        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <FadeIn>
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 h-full">
              <h3 className="text-xl font-bold text-white mb-6">What you get</h3>
              <ul className="space-y-4">
                {[
                  'Facebook lead gen campaigns in your service area',
                  'Every lead called back in 20 seconds',
                  'Warm transfer to your team (we stay on the line)',
                  'Night + weekend coverage included',
                  'Review campaign — improve your Google rating',
                  'Private feedback to catch problems before 1-star reviews',
                  'Automated referral program',
                ].map((item, i) => (
                  <li key={i} className="flex gap-3 text-gray-300">
                    <Check className="w-5 h-5 text-ping-green shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/5 h-full">
              <h3 className="text-xl font-bold text-white mb-6">Why ISP Finder works</h3>
              <div className="space-y-6">
                <div>
                  <h4 className="text-white font-semibold mb-2">The neutral directory advantage</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    We run ads from "ISP Finder" — a third-party directory — not from your page.
                    Your logo and plans are in the ad, but the consumer sees a recommendation,
                    not a pitch. Tested across 30+ ISPs: consistently outperforms direct-brand ads.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">Commission-only option</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    Zero risk: you only pay $150 per installed customer.
                    You cover the ad spend ($500-$1,000/mo), we cover everything else.
                    If we don't get you installs, you pay nothing.
                  </p>
                </div>
                <div>
                  <h4 className="text-white font-semibold mb-2">The follow-up problem — solved</h4>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    The biggest struggle ISPs have is follow-up. A lead comes in at 10am
                    and gets called back at 4pm — if at all. We built an entire call center
                    so every lead is contacted in 20 seconds, not 20 hours.
                  </p>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        <FadeIn>
          <div className="p-8 rounded-2xl bg-gradient-to-r from-navy-800 to-navy-900 border border-white/5 text-center">
            <div className="text-3xl md:text-4xl font-bold text-white mb-2">
              $750<span className="text-lg text-gray-500 font-normal">/month</span>
            </div>
            <p className="text-gray-400 mb-1">+ $1,000/mo ad spend (you control the budget)</p>
            <p className="text-gray-500 text-sm mb-2">Or go commission-only: $150/install, $0/mo</p>
            <p className="text-gray-500 text-sm mb-6">Month-to-month · No contracts · 30-day money back</p>
            <CTAButton variant="green">
              Start Getting Installs <ArrowRight className="w-5 h-5" />
            </CTAButton>
          </div>
        </FadeIn>

        {/* Budget upgrade nudge */}
        <FadeIn>
          <div className="mt-8 p-6 rounded-2xl bg-white/[0.02] border border-white/5 text-center">
            <p className="text-gray-400 mb-2">
              Ready for more? The <span className="text-white font-semibold">ISP Growth Program</span> ($2,500/mo)
              adds a dedicated sales team that closes leads for you + retention to prevent churn.
            </p>
            <p className="text-ping-orange text-sm font-medium">
              More budget → more installs → faster payback. The math always works.
            </p>
          </div>
        </FadeIn>
      </div>
    </section>
  )
}

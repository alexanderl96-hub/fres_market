import React, { useState, useEffect, useMemo } from 'react';
import {
  ArrowRight, ArrowUpRight, Check, ChevronDown, Eye, EyeOff, Leaf,
  LockKeyhole, LogOut, Mail, Search, ShoppingBasket, ShoppingCart,
  Sprout, UserRound, X
} from 'lucide-react';
import { api } from './services/api.js';
import "./App.css"

import Account from './Account';
import AccountRecovery from './AccountRecovery';
import ResetPassword from './ResetPassword';
import VerifyRecoveryEmail from './VerifyRecoveryEmail';

const money = (value) => new Intl.NumberFormat('en-US', {
  style: 'currency', currency: 'USD'
}).format(value);

function Brand({ compact = false }) {
  return (
    <a className={`brand ${compact ? 'brand-compact' : ''}`} href="#" aria-label="Fresh Market home">
      <span className="brand-mark"><Sprout size={23} strokeWidth={2.2} /></span>
      <span className="brand-name">fresh<span>market</span><small>GOOD FOOD, GOOD MOOD</small></span>
    </a>
  );
}

function AuthScreen({ onAuth , onRecover}) {
  const [mode, setMode] = useState('login');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const result = mode === 'login'
        ? await api.login({ email, password })
        : await api.register({ name, email, password });
      localStorage.setItem('food_store_token', result.token);
      onAuth(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-left">
        <header className="auth-header">
          <Brand />
          <span className="header-note">Your neighborhood, online.</span>
        </header>

        <div className="auth-content">
          <div className="eyebrow"><span className="eyebrow-dot" /> FRESH FINDS, EVERY DAY</div>
          <h1>{mode === 'login' ? <>A little more<br /><em>fresh</em> in your day.</> : <>Your fresh start<br />begins <em>here.</em></>}</h1>
          <p className="auth-intro">
            {mode === 'login'
              ? 'Good food makes everything better. Sign in to discover the fresh picks waiting for you.'
              : 'Create your account and make the good stuff part of your everyday routine.'}
          </p>

          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'register' && (
              <label className="field-label">
                Your name
                <span className="input-wrap"><UserRound size={18} /><input value={name} onChange={e => setName(e.target.value)} placeholder="Jamie Green" autoComplete="name" minLength={2} maxLength={100} required /></span>
              </label>
            )}
            <label className="field-label">
              Email address
              <span className="input-wrap"><Mail size={18} /><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" required /></span>
            </label>
            <label className="field-label">
              Password
              <span className="input-wrap"><LockKeyhole size={18} /><input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder={mode === 'register' ? 'At least 8 characters' : 'Enter your password'} minLength={mode === 'register' ? 8 : undefined} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required /><button className="icon-button" type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></span>
            </label>

            {mode === 'login' && <div className="form-options"><label className="remember"><input type="checkbox" /> <span>Remember me</span></label><span className="secure-note"><LockKeyhole size={13} /> Secure sign in</span></div>}
            {error && <div className="form-error" role="alert">{error}</div>}
            <button className="primary-button auth-submit" disabled={busy} type="submit">
              {busy ? 'Please wait…' : mode === 'login' ? 'Sign in to your account' : 'Create my account'}
              {!busy && <ArrowRight size={18} />}
            </button>
          </form>

          <p className="switch-auth">
            {mode === 'login' ? "New to Fresh Market?" : 'Already have an account?'}
            {' '}<button type="button" onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(''); }}> {mode === 'login' ? 'Create an account' : 'Sign in'}</button>
            
          </p>
          {mode === 'login' && (
            <div className="recovery-links">
              <button type="button" onClick={() => onRecover('password')}>
                Forgot password?
              </button>
              <span aria-hidden="true">·</span>
              <button type="button" onClick={() => onRecover('email')}>
                Forgot email?
              </button>
            </div>
          )}
          <div className="auth-footnote"><Leaf size={15} /> Fresh choices. Simple shopping. Better days.</div>
        </div>
        <footer className="auth-footer"><span>© {new Date().getFullYear()} Fresh Market</span><span>Made for everyday good</span></footer>
      </div>

      <aside className="auth-right">
        <div className="photo-overlay" />
        <div className="photo-top"><span className="photo-pill"><span /> PICKED WITH CARE</span><span className="photo-number">01 — FRESHNESS</span></div>
        <div className="photo-copy">
          <span className="photo-kicker">FROM OUR FAVORITES TO YOUR TABLE</span>
          <h2>Eat well.<br />Feel <em>everything.</em></h2>
          <p>Colorful, wholesome, feel-good food for whatever today brings.</p>
          <div className="photo-benefits">
            <span><Check size={16} /> Everyday essentials</span>
            <span><Check size={16} /> Fresh-picked favorites</span>
          </div>
        </div>
        <div className="photo-bottom"><span>GOOD THINGS GROW HERE</span><span>FRESH MARKET®</span></div>
      </aside>
    </main>
  );
}

function ProductCard({ product, onAdd, added }) {
  return (
    <article className="product-card">
      <div className={`product-art art-${String(product.category).toLowerCase().replace(/[^a-z]+/g, '-')}`}>
        <span className="product-emoji" role="img" aria-label={product.name}>{product.emoji}</span>
        <span className="product-category">{product.category}</span>
        <button className="add-button" onClick={() => onAdd(product)} aria-label={`Add ${product.name} to basket`}>
          {added ? <Check size={19} /> : <span>+</span>}
        </button>
      </div>
      <div className="product-details">
        <div><h3>{product.name}</h3><p>{product.unit}</p></div>
        <strong>{money(product.price)}</strong>
      </div>
      <p className="product-description">{product.description}</p>
    </article>
  );
}

function Store({ user, onLogout, onAccount }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('All');
  const [cart, setCart] = useState([]);
  const [toast, setToast] = useState('');

  useEffect(() => {
    let active = true;
    api.products()
      .then(data => { if (active) setProducts(data.products); })
      .catch(err => { if (active) setLoadError(err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, []);

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category))], [products]);
  const filtered = useMemo(() => products.filter(p => (
    (category === 'All' || p.category === category) &&
    `${p.name} ${p.description} ${p.category}`.toLowerCase().includes(query.toLowerCase())
  )), [products, category, query]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function addToCart(product) {
    setCart(current => {
      const found = current.find(item => item.id === product.id);
      if (found) return current.map(item => item.id === product.id ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) } : item);
      return [...current, { ...product, quantity: 1 }];
    });
    setToast(`${product.name} added to your basket`);
    window.setTimeout(() => setToast(''), 2200);
  }

  function updateQuantity(id, delta) {
    setCart(current => current.map(item => item.id === id ? { ...item, quantity: Math.max(0, Math.min(item.stock, item.quantity + delta)) } : item).filter(item => item.quantity > 0));
  }

  return (
    <main className="store-page">
      <header className="store-header">
        <Brand />
        <nav className="store-nav"><a className="active" href="#shop">Shop</a><a href="#our-way">Our way</a></nav>
        <div className="store-user"><span className="user-avatar">{user.name.slice(0, 1).toUpperCase()}</span><span className="user-name">Hi, {user.name.split(' ')[0]}</span><button
  className="account-button"
  type="button"
  onClick={onAccount}
>
  <UserRound size={17} />
  <span>My Account</span>
</button><button className="logout-button" onClick={onLogout} title="Sign out"><LogOut size={17} /><span>Sign out</span></button></div>
      </header>

      <section className="store-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> YOUR DAILY DOSE OF GOOD</div>
          <h1>Good food.<br /><em>Good mood.</em></h1>
          <p>Fill your basket with fresh favorites and little things that make every meal feel special.</p>
          <a href="#shop" className="primary-button hero-button">Explore the market <ArrowDownIcon /></a>
          <div className="hero-proof"><span className="proof-icons">🥑 🍓 🥬</span><span>Fresh picks for everyday living</span></div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob"><span className="hero-produce">🥑</span><span className="hero-strawberry">🍓</span><span className="hero-lemon">🍋</span><span className="hero-leaves">🌿</span></div>
          <div className="floating-note"><span className="note-icon"><Leaf size={17} /></span><span><strong>Fresh looks good on you</strong><small>Little choices, big goodness.</small></span></div>
          <span className="hero-sticker">NATURE'S<br />GOOD STUFF</span>
        </div>
      </section>

      <section className="catalog-section" id="shop">
        <div className="catalog-heading"><div><div className="eyebrow">THE GOOD STUFF</div><h2>Fresh from the market<span>.</span></h2><p>Everyday essentials, picked for you.</p></div><div className="catalog-tools"><label className="search-box"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find something fresh..." aria-label="Search products" />{query && <button onClick={() => setQuery('')} aria-label="Clear search"><X size={15} /></button>}</label><button className="basket-button" onClick={() => document.getElementById('basket')?.scrollIntoView({ behavior: 'smooth' })}><ShoppingBasket size={18} /><span>Basket</span><b>{cartCount}</b></button></div></div>
        <div className="category-tabs">{categories.map(item => <button key={item} className={category === item ? 'selected' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div>

        {loading ? <div className="catalog-message"><span className="spinner" /> Finding the fresh stuff…</div> : loadError ? <div className="catalog-message error-message">{loadError}<p>Check that the backend and PostgreSQL are running, then refresh.</p></div> : filtered.length ? <div className="product-grid">{filtered.map(product => <ProductCard key={product.id} product={product} onAdd={addToCart} added={cart.some(item => item.id === product.id)} />)}</div> : <div className="catalog-message">No products found. Try a different search.</div>}
      </section>

      <section className="basket-section" id="basket">
        <div className="basket-title"><div className="eyebrow">YOUR LITTLE COLLECTION</div><h2>Your basket<span>.</span></h2></div>
        {cart.length === 0 ? <div className="basket-empty"><ShoppingBasket size={23} /><span>Your basket is ready for something good.</span><a href="#shop">Browse the market <ArrowRight size={15} /></a></div> : <div className="basket-content"><div className="basket-items">{cart.map(item => <div className="basket-item" key={item.id}><span className="basket-emoji">{item.emoji}</span><div className="basket-item-name"><strong>{item.name}</strong><small>{money(item.price)} · {item.unit}</small></div><div className="quantity-control"><button onClick={() => updateQuantity(item.id, -1)} aria-label={`Remove one ${item.name}`}>−</button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, 1)} aria-label={`Add one ${item.name}`} disabled={item.quantity >= item.stock}>+</button></div><strong className="line-total">{money(item.price * item.quantity)}</strong></div>)}</div><div className="basket-summary"><span>Subtotal</span><strong>{money(cartTotal)}</strong><small>Taxes and delivery, if applicable, are not included.</small></div></div>}
        <p className="starter-note">Starter demo: basket changes are kept in this browser session. Checkout and order placement are not included yet.</p>
      </section>
      <footer className="store-footer" id="our-way"><Brand compact /><span>Good food, grown into good days.</span><span>© {new Date().getFullYear()} Fresh Market</span></footer>
      {toast && <div className="toast" role="status"><Check size={17} /> {toast}</div>}
    </main>
  );
}

function ArrowDownIcon() {
  return <ArrowUpRight size={18} />;
}



function getInitialScreen() {
  const path = window.location.pathname;

  if (path.endsWith('/reset-password')) return 'reset-password';
  if (path.endsWith('/verify-recovery-email')) return 'verify-recovery-email';
  if (path.endsWith('/recover-account')) return 'recovery';
  if (path.endsWith('/account')) return 'account';

  return 'home';
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [screen, setScreen] = useState(getInitialScreen);

  useEffect(() => {
    function handlePopState() {
      setScreen(getInitialScreen());
    }

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  function navigate(nextScreen, path, search = '') {
    window.history.pushState({}, '', `${path}${search}`);
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  useEffect(() => {
    let active = true;
    const token = localStorage.getItem('food_store_token');

    if (!token) {
      setCheckingSession(false);
      return;
    }

    api.me()
      .then(result => {
        if (active) setUser(result.user);
      })
      .catch(() => {
        localStorage.removeItem('food_store_token');
        if (active) setUser(null);
      })
      .finally(() => {
        if (active) setCheckingSession(false);
      });

    return () => {
      active = false;
    };
  }, []);

  function handleAuth(authenticatedUser) {
    setUser(authenticatedUser);
    setScreen('home');
    window.history.pushState({}, '', '/');
  }

  function logout() {
    localStorage.removeItem('food_store_token');
    setUser(null);
    navigate('home', '/');
  }

  if (checkingSession) {
    return (
      <div className="boot-screen">
        <span className="boot-mark"><Sprout size={28} /></span>
        <p>Making room for good things…</p>
      </div>
    );
  }

  if (screen === 'reset-password') {
    return <ResetPassword onBack={() => navigate('home', '/')} />;
  }

  if (screen === 'verify-recovery-email') {
    return (
      <VerifyRecoveryEmail
        onBack={() => navigate('home', '/')}
      />
    );
  }

  if (screen === 'recovery') {
    return (
      <AccountRecovery
        onBack={() => navigate('home', '/')}
        initialMode={
          new URLSearchParams(window.location.search).get('mode') === 'email'
            ? 'email'
            : 'password'
        }
      />
    );
  }

  if (screen === 'account' && user) {
    return <Account onLogout={logout} />;
  }

  if (user) {
    return (
      <Store
        user={user}
        onLogout={logout}
        onAccount={() => navigate('account', '/account')}
      />
    );
  }

  return (
    <AuthScreen
      onAuth={handleAuth}
      onRecover={mode =>
        navigate(
          'recovery',
          '/recover-account',
          `?mode=${mode}`
        )
      }
    />
  );
}

// export default function App() {
//   const [user, setUser] = useState(null);
//   const [checkingSession, setCheckingSession] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem('food_store_token');
//     if (!token) {
//       setCheckingSession(false);
//       return;
//     }
//     api.me()
//       .then(result => setUser(result.user))
//       .catch(() => localStorage.removeItem('food_store_token'))
//       .finally(() => setCheckingSession(false));
//   }, []);

//   function logout() {
//     localStorage.removeItem('food_store_token');
//     setUser(null);
//   }

//   if (checkingSession) return <div className="boot-screen"><span className="boot-mark"><Sprout size={28} /></span><p>Making room for good things…</p></div>;
//   return user ? <Store user={user} onLogout={logout} /> : <AuthScreen onAuth={setUser} />;
// }

"use client";

import { useEffect, useState } from "react";
import type { PaintColour, Product, Range } from "@/lib/data";
import type { SiteContent } from "@/lib/content";
import { ImageUploadField, MultiImageUpload } from "@/components/admin/ImageUploadField";

const NAV_GROUPS = [
  {
    id: "website",
    label: "Website",
    children: [
      ["business", "Business & contact"],
      ["home", "Home page"],
      ["stories", "Testimonials"],
      ["footer", "Footer"],
    ],
  },
  {
    id: "pages",
    label: "Pages",
    children: [
      ["shop", "Shop"],
      ["about", "About"],
      ["custom", "Custom"],
      ["contact", "Contact"],
    ],
  },
  {
    id: "catalogue",
    label: "Catalogue",
    children: [
      ["products", "Products"],
      ["colours", "Colours"],
      ["tins", "Tin sizes"],
    ],
  },
  {
    id: "system",
    label: "System",
    children: [
      ["orders", "Checkout & orders"],
      ["seo", "Google listing"],
    ],
  },
] as const;

type SectionId = (typeof NAV_GROUPS)[number]["children"][number][0];
type GroupId = (typeof NAV_GROUPS)[number]["id"];

function groupForSection(section: SectionId): GroupId {
  const found = NAV_GROUPS.find((group) =>
    group.children.some(([id]) => id === section)
  );
  return found?.id ?? "website";
}

function labelForSection(section: SectionId) {
  for (const group of NAV_GROUPS) {
    const hit = group.children.find(([id]) => id === section);
    if (hit) return hit[1];
  }
  return "Admin";
}

export function AdminPanel() {
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [draft, setDraft] = useState<SiteContent | null>(null);
  const [section, setSection] = useState<SectionId>("business");
  const [group, setGroup] = useState<GroupId>("website");
  const [menuOpen, setMenuOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    fetch("/api/admin/content")
      .then(async (response) => {
        if (response.status === 401) {
          setAuthed(false);
          return;
        }
        if (!response.ok) throw new Error("Could not load the site.");
        setDraft(await response.json());
        setAuthed(true);
      })
      .catch(() => setError("Could not open the admin page."))
      .finally(() => setReady(true));
  }, []);

  async function login(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (!response.ok) {
      setError("That password is not right.");
      return;
    }
    const content = await fetch("/api/admin/content").then((res) => res.json());
    setDraft(content);
    setAuthed(true);
    setPassword("");
  }

  async function save() {
    if (!draft) return;
    setSaving(true);
    setError("");
    setStatus("");
    const response = await fetch("/api/admin/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(draft),
    });
    const body = await response.json().catch(() => null);
    setSaving(false);
    if (!response.ok) {
      setError(body?.error || "Could not save.");
      return;
    }
    setDraft(body);
    setStatus("Saved. Refresh the shop to see it.");
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    setAuthed(false);
    setDraft(null);
  }

  if (!ready) {
    return (
      <div className="admin-login">
        <p className="text-sm tracking-[0.2em] text-ink-soft uppercase">Opening admin…</p>
      </div>
    );
  }

  if (!authed || !draft) {
    return (
      <main className="admin-login">
        <div className="admin-login__card">
          <p className="text-[11px] font-semibold tracking-[0.28em] text-gold">GOLDPRIME</p>
          <h1 className="mt-3 font-serif text-4xl text-ink md:text-[2.75rem]">Site admin</h1>
          <p className="mt-3 text-sm leading-relaxed text-ink-soft">
            Sign in to change products, words, photos, phone numbers, and WhatsApp.
          </p>
          <form onSubmit={login} className="mt-8 space-y-5">
            <Field
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
            />
            {error && <p className="admin-alert admin-alert--error">{error}</p>}
            <button type="submit" className="admin-btn-primary w-full py-3.5">
              Sign in
            </button>
          </form>
        </div>
      </main>
    );
  }

  function patch<K extends keyof SiteContent>(key: K, value: SiteContent[K]) {
    setDraft((current) => (current ? { ...current, [key]: value } : current));
  }

  const activeGroup = NAV_GROUPS.find((item) => item.id === group) ?? NAV_GROUPS[0];
  const sectionLabel = labelForSection(section);

  function openGroup(next: GroupId) {
    setGroup(next);
    const first = NAV_GROUPS.find((item) => item.id === next)?.children[0]?.[0];
    if (first && groupForSection(section) !== next) {
      setSection(first);
    }
  }

  function openSection(next: SectionId) {
    setSection(next);
    setGroup(groupForSection(next));
    setMenuOpen(false);
  }

  return (
    <div className={`admin-shell admin-shell--app ${menuOpen ? "is-menu-open" : ""}`}>
      <button
        type="button"
        className="admin-drawer-backdrop"
        aria-label="Close menu"
        onClick={() => setMenuOpen(false)}
      />

      <aside className={`admin-primary ${menuOpen ? "is-open" : ""}`} aria-label="Admin menu">
        <div className="admin-primary__brand">
          <div>
            <p className="admin-primary__eyebrow">Goldprime</p>
            <p className="admin-primary__title">Admin</p>
          </div>
          <button
            type="button"
            className="admin-drawer-close"
            aria-label="Close menu"
            onClick={() => setMenuOpen(false)}
          >
            ✕
          </button>
        </div>

        <nav className="admin-primary__nav">
          {NAV_GROUPS.map((item) => (
            <div key={item.id} className="admin-primary__group">
              <button
                type="button"
                onClick={() => openGroup(item.id)}
                className={`admin-nav-btn admin-primary__link ${group === item.id ? "is-active" : ""}`}
              >
                {item.label}
              </button>
              <div className={`admin-primary__children ${group === item.id ? "is-open" : ""}`}>
                {item.children.map(([id, label]) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => openSection(id)}
                    className={`admin-primary__child ${section === id ? "is-active" : ""}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        <button
          type="button"
          onClick={logout}
          className="admin-primary__logout"
        >
          Sign out
        </button>
      </aside>

      <div className="admin-workspace">
        <header className="admin-header">
          <div className="admin-header__inner">
            <div className="flex min-w-0 items-center gap-2.5">
              <button
                type="button"
                className="admin-menu-btn"
                aria-label="Open menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(true)}
              >
                <span />
                <span />
                <span />
              </button>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold tracking-[0.24em] text-gold sm:text-[11px]">
                  ADMIN CONSOLE
                </p>
                <h1 className="truncate font-serif text-xl text-ink sm:text-2xl md:text-[1.85rem]">
                  Control the site
                </h1>
              </div>
            </div>
            <div className="admin-header__actions">
              <a href="/" className="admin-btn-ghost hidden md:inline-flex">
                View site
              </a>
              <button
                type="button"
                onClick={save}
                disabled={saving}
                className="admin-btn-primary admin-btn-primary--compact"
              >
                {saving ? "Saving…" : (
                  <>
                    <span className="sm:hidden">Save</span>
                    <span className="hidden sm:inline">Save changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>

        <div className="admin-layout">
          <aside className="admin-rail admin-rail--sub">
            <nav
              className="admin-sidebar admin-sidebar--sub"
              aria-label={`${activeGroup.label} sections`}
            >
              <p className="admin-sidebar__label">{activeGroup.label}</p>
              {activeGroup.children.map(([id, label]) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => openSection(id)}
                  className={`admin-nav-btn admin-nav-btn--sub ${section === id ? "is-active" : ""}`}
                >
                  {label}
                </button>
              ))}
            </nav>
          </aside>

          <div className="admin-main space-y-5 md:space-y-6">
          <div className="admin-section-heading">
            <div className="min-w-0">
              <p className="text-[11px] font-semibold tracking-[0.22em] text-gold uppercase">
                {activeGroup.label}
              </p>
              <h2 className="mt-1 font-serif text-2xl text-ink sm:text-3xl">{sectionLabel}</h2>
            </div>
            <p className="hidden text-sm text-ink-muted md:block">Changes apply after you save</p>
          </div>

          <div className="admin-mobile-tabs" role="tablist" aria-label={`${activeGroup.label} sections`}>
            {activeGroup.children.map(([id, label]) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={section === id}
                onClick={() => openSection(id)}
                className={`admin-mobile-tab ${section === id ? "is-active" : ""}`}
              >
                {label}
              </button>
            ))}
          </div>

          {status && <p className="admin-alert admin-alert--ok">{status}</p>}
          {error && <p className="admin-alert admin-alert--error">{error}</p>}
          {section === "business" && (
            <>
              <Card title="Customer care WhatsApp">
                <p className="mb-4 text-sm text-ink-soft">
                  This number powers the floating WhatsApp button and every WhatsApp link on the site.
                </p>
                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Customer care WhatsApp number"
                    hint="Digits only, with country code. Example: 2348050272664"
                    value={draft.business.whatsappNumber}
                    onChange={(whatsappNumber) =>
                      patch("business", { ...draft.business, whatsappNumber })
                    }
                  />
                  <Field
                    label="Opening message"
                    hint="Pre-filled when someone taps the WhatsApp icon"
                    value={draft.business.whatsappCareMessage ?? ""}
                    onChange={(whatsappCareMessage) =>
                      patch("business", { ...draft.business, whatsappCareMessage })
                    }
                  />
                </div>
              </Card>
              <Card title="Business, phone, and address">
                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Business name" value={draft.business.name} onChange={(name) => patch("business", { ...draft.business, name })} />
                  <Field label="Company" value={draft.business.company} onChange={(company) => patch("business", { ...draft.business, company })} />
                  <Field label="Customer care phone" value={draft.business.phoneDisplay} onChange={(phoneDisplay) => patch("business", { ...draft.business, phoneDisplay })} />
                  <Field label="Second phone" value={draft.business.phoneSecondary} onChange={(phoneSecondary) => patch("business", { ...draft.business, phoneSecondary })} />
                  <Field label="Email" value={draft.business.email} onChange={(email) => patch("business", { ...draft.business, email })} />
                  <Field label="Website" value={draft.business.website} onChange={(website) => patch("business", { ...draft.business, website })} />
                  <Field label="Street address" value={draft.business.address} onChange={(address) => patch("business", { ...draft.business, address })} />
                  <Field label="City" value={draft.business.city} onChange={(city) => patch("business", { ...draft.business, city })} />
                  <Field label="Country" value={draft.business.country} onChange={(country) => patch("business", { ...draft.business, country })} />
                  <Field label="Location line" hint="The short line under the phone" value={draft.business.locationLine} onChange={(locationLine) => patch("business", { ...draft.business, locationLine })} />
                  <Field label="Instagram link" value={draft.business.instagramUrl} onChange={(instagramUrl) => patch("business", { ...draft.business, instagramUrl })} />
                  <Field label="Facebook link" value={draft.business.facebookUrl} onChange={(facebookUrl) => patch("business", { ...draft.business, facebookUrl })} />
                  <Field label="TikTok link" hint="Leave blank to hide TikTok" value={draft.business.tiktokUrl} onChange={(tiktokUrl) => patch("business", { ...draft.business, tiktokUrl })} />
                </div>
              </Card>
            </>
          )}

          {section === "home" && (
            <>
              <Card title="Home page">
                <div className="grid gap-4">
                  <TextFields
                    fields={[
                      ["browseLabel", "Banner line"],
                      ["customCta", "Custom colour button"],
                      ["ratingText", "Star line"],
                      ["headline", "Main heading"],
                      ["subhead", "Intro"],
                      ["shopNow", "Shop button"],
                      ["heroStoryLink", "Story button beside Shop"],
                      ["categoriesEyebrow", "Categories label"],
                      ["categoriesTitle", "Categories heading"],
                      ["storyTitle", "Bottom story heading"],
                      ["storyBody", "Bottom story text"],
                      ["storyLink", "Bottom story button"],
                      ["testimonialEyebrow", "Reviews label"],
                      ["testimonialTitle", "Reviews heading"],
                      ["swipeHint", "Swipe hint on category cards"],
                      ["colourLabel", "Colour row label"],
                      ["dragHint", "Drag hint on the photo"],
                    ]}
                    value={draft.home}
                    long={["subhead", "storyBody", "headline"]}
                    onChange={(home) => patch("home", { ...draft.home, ...home })}
                  />
                  <ImageList
                    title="Story photos"
                    images={draft.home.storyImages}
                    onChange={(storyImages) => patch("home", { ...draft.home, storyImages })}
                  />
                </div>
              </Card>

              <Card title="Paint ranges (circular photos)">
                <Field
                  label="Section heading"
                  value={draft.home.rangesTitle ?? ""}
                  onChange={(rangesTitle) => patch("home", { ...draft.home, rangesTitle })}
                />
                <div className="mt-4 space-y-4">
                  {(draft.home.paintRanges ?? []).map((range, index) => (
                    <div key={index} className="admin-subpanel grid gap-3 md:grid-cols-2">
                      <p className="admin-field-label md:col-span-2">
                        Range {index + 1}
                      </p>
                      <Field
                        label="Title"
                        value={range.title}
                        onChange={(title) => {
                          const paintRanges = draft.home.paintRanges.map((item, i) =>
                            i === index ? { ...item, title } : item
                          );
                          patch("home", { ...draft.home, paintRanges });
                        }}
                      />
                      <Field
                        label="Product link name"
                        hint="Must match a product link, e.g. acrylic-emulsion"
                        value={range.slug}
                        onChange={(slug) => {
                          const paintRanges = draft.home.paintRanges.map((item, i) =>
                            i === index ? { ...item, slug } : item
                          );
                          patch("home", { ...draft.home, paintRanges });
                        }}
                      />
                      <div className="md:col-span-2">
                        <ImageUploadField
                          label="Photo"
                          value={range.image}
                          onChange={(image) => {
                            const paintRanges = draft.home.paintRanges.map((item, i) =>
                              i === index ? { ...item, image } : item
                            );
                            patch("home", { ...draft.home, paintRanges });
                          }}
                        />
                      </div>
                      <Field
                        label="Photo description"
                        value={range.alt}
                        onChange={(alt) => {
                          const paintRanges = draft.home.paintRanges.map((item, i) =>
                            i === index ? { ...item, alt } : item
                          );
                          patch("home", { ...draft.home, paintRanges });
                        }}
                      />
                      <div className="md:col-span-2">
                        <Field
                          label="Description"
                          textarea
                          value={range.body}
                          onChange={(body) => {
                            const paintRanges = draft.home.paintRanges.map((item, i) =>
                              i === index ? { ...item, body } : item
                            );
                            patch("home", { ...draft.home, paintRanges });
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              <Card title="Innovative solutions">
                <div className="grid gap-4">
                  <Field
                    label="Heading"
                    value={draft.home.solutionsTitle ?? ""}
                    onChange={(solutionsTitle) => patch("home", { ...draft.home, solutionsTitle })}
                  />
                  <Field
                    label="Text"
                    textarea
                    hint="Separate paragraphs with a blank line"
                    value={draft.home.solutionsBody ?? ""}
                    onChange={(solutionsBody) => patch("home", { ...draft.home, solutionsBody })}
                  />
                  <Field
                    label="Button text"
                    value={draft.home.solutionsCta ?? ""}
                    onChange={(solutionsCta) => patch("home", { ...draft.home, solutionsCta })}
                  />
                  <ImageList
                    title="Side photos (use 2)"
                    images={draft.home.solutionsImages ?? []}
                    onChange={(solutionsImages) => patch("home", { ...draft.home, solutionsImages })}
                    allowAdd
                    max={4}
                  />
                </div>
              </Card>

              <Card title="Sustainability">
                <div className="grid gap-4">
                  <Field
                    label="Heading"
                    value={draft.home.sustainTitle ?? ""}
                    onChange={(sustainTitle) => patch("home", { ...draft.home, sustainTitle })}
                  />
                  <Field
                    label="Intro"
                    textarea
                    value={draft.home.sustainIntro ?? ""}
                    onChange={(sustainIntro) => patch("home", { ...draft.home, sustainIntro })}
                  />
                  <Field
                    label="Closing line"
                    textarea
                    value={draft.home.sustainClosing ?? ""}
                    onChange={(sustainClosing) => patch("home", { ...draft.home, sustainClosing })}
                  />
                  <Field
                    label="Button text"
                    value={draft.home.sustainCta ?? ""}
                    onChange={(sustainCta) => patch("home", { ...draft.home, sustainCta })}
                  />
                  <ImageUploadField
                    label="Photo"
                    value={draft.home.sustainImage?.src ?? ""}
                    onChange={(src) =>
                      patch("home", {
                        ...draft.home,
                        sustainImage: {
                          src,
                          alt: draft.home.sustainImage?.alt || "Goldprime space",
                        },
                      })
                    }
                  />
                  <Field
                    label="Photo description"
                    value={draft.home.sustainImage?.alt ?? ""}
                    onChange={(alt) =>
                      patch("home", {
                        ...draft.home,
                        sustainImage: { ...draft.home.sustainImage, alt },
                      })
                    }
                  />
                  {(draft.home.sustainPoints ?? []).map((point, index) => (
                    <div key={index} className="admin-subpanel grid gap-3 md:grid-cols-2">
                      <Field
                        label={`Point ${index + 1} title`}
                        value={point.title}
                        onChange={(title) => {
                          const sustainPoints = draft.home.sustainPoints.map((item, i) =>
                            i === index ? { ...item, title } : item
                          );
                          patch("home", { ...draft.home, sustainPoints });
                        }}
                      />
                      <Field
                        label="Point text"
                        textarea
                        value={point.body}
                        onChange={(body) => {
                          const sustainPoints = draft.home.sustainPoints.map((item, i) =>
                            i === index ? { ...item, body } : item
                          );
                          patch("home", { ...draft.home, sustainPoints });
                        }}
                      />
                    </div>
                  ))}
                </div>
              </Card>
            </>
          )}

          {section === "shop" && (
            <Card title="Shop page and menu">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Indoor name" value={draft.rangeLabels.indoor} onChange={(indoor) => patch("rangeLabels", { ...draft.rangeLabels, indoor })} />
                <Field label="Outdoor name" value={draft.rangeLabels.outdoor} onChange={(outdoor) => patch("rangeLabels", { ...draft.rangeLabels, outdoor })} />
                <Field label="Shop label" value={draft.shop.eyebrow} onChange={(eyebrow) => patch("shop", { ...draft.shop, eyebrow })} />
                <Field label="Empty shop message" value={draft.shop.empty} onChange={(empty) => patch("shop", { ...draft.shop, empty })} />
                <Field label="Menu: Shop" value={draft.nav.shop} onChange={(shop) => patch("nav", { ...draft.nav, shop })} />
                <Field label="Menu: Custom" value={draft.nav.custom} onChange={(custom) => patch("nav", { ...draft.nav, custom })} />
                <Field label="Menu: About" value={draft.nav.about} onChange={(about) => patch("nav", { ...draft.nav, about })} />
                <Field label="Menu: Contact" value={draft.nav.contact} onChange={(contact) => patch("nav", { ...draft.nav, contact })} />
                <Field label="Header button" value={draft.nav.shopCta} onChange={(shopCta) => patch("nav", { ...draft.nav, shopCta })} />
                <Field label="Back button" value={draft.nav.back} onChange={(back) => patch("nav", { ...draft.nav, back })} />
              </div>
            </Card>
          )}

          {section === "about" && (
            <Card title="About page">
              <div className="grid gap-4">
                <TextFields
                  fields={[
                    ["eyebrow", "Small label"],
                    ["title", "Heading"],
                    ["body", "Who we are"],
                    ["vision", "Vision"],
                    ["mission", "Mission"],
                    ["value", "Core value"],
                    ["letter", "Welcome note"],
                    ["letterName", "Sign-off name"],
                    ["letterRole", "Sign-off role"],
                    ["bannerTitle", "Bottom heading"],
                    ["bannerBody", "Bottom text"],
                    ["bannerCta", "Bottom button"],
                  ]}
                  value={draft.about}
                  long={["body", "vision", "mission", "value", "letter", "bannerBody"]}
                  onChange={(about) => patch("about", { ...draft.about, ...about, steps: draft.about.steps })}
                />
                {draft.about.steps.map((step, index) => (
                  <div key={index} className="admin-subpanel grid gap-3 md:grid-cols-2">
                    <Field label={`Step ${index + 1} name`} value={step.label} onChange={(label) => {
                      const steps = draft.about.steps.map((item, i) => i === index ? { ...item, label, alt: label } : item);
                      patch("about", { ...draft.about, steps });
                    }} />
                    <ImageUploadField
                      label="Photo"
                      value={step.image}
                      onChange={(image) => {
                        const steps = draft.about.steps.map((item, i) =>
                          i === index ? { ...item, image } : item
                        );
                        patch("about", { ...draft.about, steps });
                      }}
                    />
                  </div>
                ))}
              </div>
            </Card>
          )}

          {section === "custom" && (
            <Card title="Custom colour page">
              <TextFields
                fields={[
                  ["eyebrow", "Small label"],
                  ["title", "Heading"],
                  ["body", "Text"],
                  ["whatsappMessage", "WhatsApp message"],
                  ["whatsappButton", "WhatsApp button"],
                  ["shopButton", "Shop button"],
                ]}
                value={draft.custom}
                long={["body", "whatsappMessage"]}
                onChange={(custom) => patch("custom", { ...draft.custom, ...custom })}
              />
              <ImageList images={draft.custom.images} onChange={(images) => patch("custom", { ...draft.custom, images })} title="Photos" />
            </Card>
          )}

          {section === "contact" && (
            <Card title="Contact page">
              <TextFields
                fields={[
                  ["eyebrow", "Small label"],
                  ["title", "Heading"],
                  ["body", "Text"],
                  ["whatsappMessage", "WhatsApp message"],
                  ["whatsappButton", "WhatsApp button"],
                ]}
                value={draft.contact}
                long={["body", "whatsappMessage"]}
                onChange={(contact) => patch("contact", contact)}
              />
            </Card>
          )}

          {section === "footer" && (
            <Card title="Footer">
              <TextFields
                fields={[
                  ["exploreLabel", "Explore label"],
                  ["followLabel", "Follow label"],
                  ["whatsappMessage", "WhatsApp message"],
                  ["blurb", "Short description"],
                  ["copyright", "Copyright line"],
                ]}
                value={draft.footer}
                long={["blurb", "whatsappMessage"]}
                onChange={(footer) => patch("footer", footer)}
              />
            </Card>
          )}

          {section === "orders" && (
            <>
              <Card title="Product page words">
                <TextFields
                  fields={[
                    ["colourLabel", "Colour label"],
                    ["tinLabel", "Tin size label"],
                    ["coverageLabel", "Coverage link"],
                    ["missingColour", "Missing colour link"],
                    ["qtyLabel", "Quantity label"],
                    ["orderButton", "Order button"],
                  ]}
                  value={draft.productUi}
                  onChange={(productUi) => patch("productUi", productUi)}
                />
              </Card>
              <Card title="Checkout">
                <TextFields
                  fields={[
                    ["eyebrow", "Small label"],
                    ["title", "Heading"],
                    ["note", "Note"],
                    ["continueButton", "WhatsApp button"],
                    ["editLink", "Edit link"],
                    ["colourLabel", "Colour row"],
                    ["tinLabel", "Tin row"],
                    ["quantityLabel", "Quantity row"],
                    ["totalLabel", "Total row"],
                  ]}
                  value={draft.checkout}
                  long={["note"]}
                  onChange={(checkout) => patch("checkout", checkout)}
                />
              </Card>
              <Card title="Thank-you page">
                <TextFields
                  fields={[
                    ["eyebrow", "Small label"],
                    ["title", "Heading"],
                    ["body", "Text"],
                    ["whatsappButton", "WhatsApp button"],
                    ["whatsappMessage", "WhatsApp message"],
                    ["shopButton", "Shop button"],
                    ["footnote", "Footnote"],
                  ]}
                  value={draft.orderSent}
                  long={["title", "body", "whatsappMessage"]}
                  onChange={(orderSent) => patch("orderSent", orderSent)}
                />
              </Card>
              <Card title="Order message on WhatsApp">
                <TextFields
                  fields={[
                    ["greeting", "First line"],
                    ["intro", "Line before the order"],
                    ["closing", "Last line"],
                  ]}
                  value={draft.order}
                  onChange={(order) => patch("order", order)}
                />
              </Card>
            </>
          )}

          {section === "stories" && (
            <Card title="Customer words">
              <div className="space-y-4">
                {draft.testimonials.map((item, index) => (
                  <div key={index} className="admin-subpanel grid gap-3">
                    <Field label="Quote" textarea value={item.quote} onChange={(quote) => updateList(draft.testimonials, index, { ...item, quote }, (testimonials) => patch("testimonials", testimonials))} />
                    <div className="grid gap-3 md:grid-cols-2">
                      <Field label="Name" value={item.name} onChange={(name) => updateList(draft.testimonials, index, { ...item, name }, (testimonials) => patch("testimonials", testimonials))} />
                      <Field label="Role" value={item.city} onChange={(city) => updateList(draft.testimonials, index, { ...item, city }, (testimonials) => patch("testimonials", testimonials))} />
                    </div>
                    <button type="button" className="admin-btn-danger text-left" onClick={() => patch("testimonials", draft.testimonials.filter((_, i) => i !== index))}>Remove</button>
                  </div>
                ))}
                <button type="button" className="admin-btn-outline" onClick={() => patch("testimonials", [...draft.testimonials, { quote: "", name: "", city: "" }])}>Add a review</button>
              </div>
            </Card>
          )}

          {section === "colours" && (
            <Card title="Paint colours">
              <div className="space-y-3">
                {draft.colours.map((colour, index) => (
                  <div key={colour.id} className="admin-subpanel grid items-end gap-3 md:grid-cols-[auto_1fr_140px_auto]">
                    <input
                      type="color"
                      aria-label={`${colour.name} colour`}
                      value={toColorInput(colour.hex)}
                      onChange={(event) => updateColour(draft, index, { ...colour, hex: event.target.value }, patch)}
                      className="h-11 w-14 cursor-pointer rounded-xl border border-ink/10 bg-cream"
                    />
                    <Field label="Name" value={colour.name} onChange={(name) => updateColour(draft, index, { ...colour, name }, patch)} />
                    <Field label="Hex" value={colour.hex} onChange={(hex) => updateColour(draft, index, { ...colour, hex }, patch)} />
                    <button type="button" className="admin-btn-danger pb-3" onClick={() => removeColour(draft, colour.id, patch)}>Remove</button>
                  </div>
                ))}
                <button
                  type="button"
                  className="admin-btn-outline"
                  onClick={() => patch("colours", [...draft.colours, { id: `colour-${Date.now()}`, name: "New colour", hex: "#cc9d28" }])}
                >
                  Add a colour
                </button>
              </div>
            </Card>
          )}

          {section === "tins" && (
            <Card title="Tin sizes and price scale">
              <p className="text-sm text-ink-soft">The product price is the 20L price. Other tins multiply that price by the number here. 1 means the same price.</p>
              <div className="mt-4 space-y-3">
                {draft.tinSizes.map((tin, index) => (
                  <div key={index} className="admin-subpanel grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <Field label="Size" value={tin.size} onChange={(size) => {
                      const tinSizes = draft.tinSizes.map((item, i) => i === index ? { ...item, size } : item);
                      patch("tinSizes", tinSizes);
                    }} />
                    <Field label="Price multiple" value={String(tin.factor)} onChange={(factor) => {
                      const tinSizes = draft.tinSizes.map((item, i) => i === index ? { ...item, factor: Number(factor) || 0 } : item);
                      patch("tinSizes", tinSizes);
                    }} />
                    <button type="button" className="admin-btn-danger self-end pb-3" onClick={() => patch("tinSizes", draft.tinSizes.filter((_, i) => i !== index))}>Remove</button>
                  </div>
                ))}
                <button type="button" className="admin-btn-outline" onClick={() => patch("tinSizes", [...draft.tinSizes, { size: "25L", factor: 4 }])}>Add a size</button>
              </div>
            </Card>
          )}

          {section === "products" && (
            <ProductsEditor
              draft={draft}
              onChange={(products) => patch("products", products)}
            />
          )}

          {section === "seo" && (
            <Card title="What Google shows">
              <div className="grid gap-4">
                <Field label="Site title" value={draft.seo.title} onChange={(title) => patch("seo", { ...draft.seo, title })} />
                <Field label="Title ending" hint="Added after page names, such as About · GOLDPRIME" value={draft.seo.titleSuffix} onChange={(titleSuffix) => patch("seo", { ...draft.seo, titleSuffix })} />
                <Field label="Description" textarea value={draft.seo.description} onChange={(description) => patch("seo", { ...draft.seo, description })} />
              </div>
            </Card>
          )}
          </div>
        </div>

        <div className="admin-mobile-save">
          <a href="/" className="admin-btn-ghost">
            Site
          </a>
          <button
            type="button"
            onClick={save}
            disabled={saving}
            className="admin-btn-primary"
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductsEditor({
  draft,
  onChange,
}: {
  draft: SiteContent;
  onChange: (products: Product[]) => void;
}) {
  const [index, setIndex] = useState(0);
  const product = draft.products[index] ?? draft.products[0];

  function update(next: Product) {
    onChange(draft.products.map((item, i) => (i === index ? next : item)));
  }

  if (!product) {
    return (
      <Card title="Products" eyebrow="Catalogue">
        <button
          type="button"
          className="admin-btn-primary"
          onClick={() => onChange([blankProduct(draft.colours)])}
        >
          Add a product
        </button>
      </Card>
    );
  }

  return (
    <Card title="Products" eyebrow="Catalogue">
      <div className="grid gap-5 md:gap-6 lg:grid-cols-[220px_minmax(0,1fr)]">
        <div className="admin-subpanel space-y-1.5 overflow-x-auto md:overflow-visible">
          <div className="flex gap-2 md:block md:space-y-1.5">
            {draft.products.map((item, i) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setIndex(i)}
                className={`admin-nav-btn shrink-0 md:w-full ${i === index ? "is-active" : ""}`}
              >
                {item.name || "Untitled"}
              </button>
            ))}
          </div>
          <button
            type="button"
            className="admin-btn-outline mt-2 w-full"
            onClick={() => {
              onChange([...draft.products, blankProduct(draft.colours)]);
              setIndex(draft.products.length);
            }}
          >
            Add product
          </button>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Name" value={product.name} onChange={(name) => update({ ...product, name })} />
            <Field label="Link name" hint="Used in the web address. Use letters and dashes." value={product.slug} onChange={(slug) => update({ ...product, slug: slug.toLowerCase().replace(/\s+/g, "-") })} />
            <Field label="20L price in naira" value={String(product.price)} onChange={(price) => update({ ...product, price: Number(price) || 0 })} />
            <label className="block">
              <span className="admin-field-label">Where it is used</span>
              <select
                value={
                  product.places?.includes("indoor") && product.places?.includes("outdoor")
                    ? "both"
                    : product.places?.[0] ?? product.range
                }
                onChange={(event) => {
                  const value = event.target.value;
                  if (value === "both") {
                    update({ ...product, range: "indoor", places: ["indoor", "outdoor"] });
                  } else {
                    const range = value as Range;
                    update({ ...product, range, places: [range] });
                  }
                }}
                className="admin-field-input"
              >
                <option value="indoor">{draft.rangeLabels.indoor}</option>
                <option value="outdoor">{draft.rangeLabels.outdoor}</option>
                <option value="both">{draft.rangeLabels.indoor} and {draft.rangeLabels.outdoor}</option>
              </select>
            </label>
            <Field label="Category" value={product.category} onChange={(category) => update({ ...product, category })} />
            <Field label="Badge" value={product.badge ?? ""} onChange={(badge) => update({ ...product, badge })} />
          </div>
          <Field label="Short line" value={product.shortDesc} onChange={(shortDesc) => update({ ...product, shortDesc })} />
          <Field label="Description" textarea value={product.description} onChange={(description) => update({ ...product, description })} />
          <Field label="Feature tags" hint="Separate with commas" value={(product.features ?? []).join(", ")} onChange={(value) => update({ ...product, features: value.split(",").map((part) => part.trim()).filter(Boolean) })} />
          <MultiImageUpload
            label="Product photos"
            hint="Upload from your device. The first photo is the main one."
            values={product.images}
            onChange={(images) => update({ ...product, images, image: images[0] ?? "" })}
          />
          <MultiImageUpload
            label="Exterior photos"
            hint="Shown when Exterior is selected. Upload from your device."
            values={product.outdoorImages ?? []}
            onChange={(outdoorImages) =>
              update({
                ...product,
                outdoorImages,
                outdoorImage: outdoorImages[0],
              })
            }
          />
          <div className="admin-subpanel">
            <p className="admin-field-label">Colours for this paint</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {draft.colours.map((colour) => {
                const on = product.colours.some((item) => item.id === colour.id);
                return (
                  <button
                    key={colour.id}
                    type="button"
                    onClick={() => {
                      const colours = on
                        ? product.colours.filter((item) => item.id !== colour.id)
                        : [...product.colours, colour];
                      update({ ...product, colours });
                    }}
                    className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm transition ${
                      on
                        ? "border-ink bg-ink text-cream shadow-sm"
                        : "border-ink/15 bg-cream-card text-ink hover:border-ink/30"
                    }`}
                  >
                    <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: colour.hex }} />
                    {colour.name}
                  </button>
                );
              })}
            </div>
          </div>
          <button
            type="button"
            className="admin-btn-danger text-left"
            onClick={() => {
              const products = draft.products.filter((_, i) => i !== index);
              onChange(products);
              setIndex(Math.max(0, index - 1));
            }}
          >
            Remove this product
          </button>
        </div>
      </div>
    </Card>
  );
}

function blankProduct(colours: PaintColour[]): Product {
  return {
    id: `p-${Date.now()}`,
    slug: "new-paint",
    name: "New paint",
    price: 10000,
    range: "indoor",
    category: "Emulsion",
    shortDesc: "",
    description: "",
    image: "",
    images: [],
    colours: colours.slice(0, 3),
    features: [],
    badge: "",
  };
}

function updateList<T>(list: T[], index: number, next: T, apply: (list: T[]) => void) {
  apply(list.map((item, i) => (i === index ? next : item)));
}

function updateColour(
  draft: SiteContent,
  index: number,
  colour: PaintColour,
  patch: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void,
) {
  const colours = draft.colours.map((item, i) => (i === index ? colour : item));
  patch("colours", colours);
}

function removeColour(
  draft: SiteContent,
  id: string,
  patch: <K extends keyof SiteContent>(key: K, value: SiteContent[K]) => void,
) {
  patch("colours", draft.colours.filter((colour) => colour.id !== id));
  patch(
    "products",
    draft.products.map((product) => ({
      ...product,
      colours: product.colours.filter((colour) => colour.id !== id),
    })),
  );
}

function toColorInput(hex: string) {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : "#cc9d28";
}

function Card({
  title,
  children,
  eyebrow = "Section",
}: {
  title: string;
  children: React.ReactNode;
  eyebrow?: string;
}) {
  return (
    <section className="admin-card">
      <p className="admin-card__eyebrow">{eyebrow}</p>
      <h2 className="admin-card__title">{title}</h2>
      <div className="mt-5 space-y-4">{children}</div>
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  textarea,
  hint,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  textarea?: boolean;
  hint?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="admin-field-label">{label}</span>
      {textarea ? (
        <textarea
          value={value}
          onChange={(event) => onChange(event.target.value)}
          rows={4}
          className="admin-field-input min-h-[6.5rem] resize-y"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="admin-field-input"
        />
      )}
      {hint && <span className="mt-1.5 block text-xs leading-relaxed text-ink-soft">{hint}</span>}
    </label>
  );
}

function TextFields<T extends object>({
  fields,
  value,
  onChange,
  long = [],
}: {
  fields: [keyof T & string, string][];
  value: T;
  onChange: (value: T) => void;
  long?: string[];
}) {
  return (
    <div className="grid gap-4">
      {fields.map(([key, label]) => (
        <Field
          key={key}
          label={label}
          textarea={long.includes(key)}
          value={String(value[key] ?? "")}
          onChange={(next) => onChange({ ...value, [key]: next })}
        />
      ))}
    </div>
  );
}

function ImageList({
  title,
  images,
  onChange,
  allowAdd = false,
  max = 8,
}: {
  title: string;
  images: { src: string; alt: string }[];
  onChange: (images: { src: string; alt: string }[]) => void;
  allowAdd?: boolean;
  max?: number;
}) {
  return (
    <div className="space-y-3">
      <p className="admin-field-label">{title}</p>
      {images.map((image, index) => (
        <div key={index} className="admin-subpanel grid gap-3">
          <ImageUploadField
            label="Photo"
            value={image.src}
            onChange={(src) =>
              onChange(images.map((item, i) => (i === index ? { ...item, src } : item)))
            }
          />
          <Field
            label="Description"
            value={image.alt}
            onChange={(alt) =>
              onChange(images.map((item, i) => (i === index ? { ...item, alt } : item)))
            }
          />
          {allowAdd ? (
            <button
              type="button"
              className="admin-btn-danger text-left"
              onClick={() => onChange(images.filter((_, i) => i !== index))}
            >
              Remove
            </button>
          ) : null}
        </div>
      ))}
      {allowAdd && images.length < max ? (
        <button
          type="button"
          className="admin-btn-outline"
          onClick={() => onChange([...images, { src: "", alt: "" }])}
        >
          Add a photo
        </button>
      ) : null}
    </div>
  );
}

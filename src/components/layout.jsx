import { Outlet } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";

// ─────────────────────────────────────────────────────────────
// LAYOUT — Premium Ecommerce Redesign
//
// Structure (top → bottom):
//   <Header />          sticky, full-width, z-50
//   <main>              flex-1, slate-50 bg (Amazon page bg)
//     <Outlet />        page content sits in a white card shell
//   <Footer />          full-width dark footer
//
// Key decisions:
//  • bg-slate-50 on <main> mimics Amazon/Myntra's off-white page
//    background that separates the content from pure white cards.
//  • No max-width wrapper here — individual pages own their
//    own max-width so product grids, hero banners, and checkout
//    forms can each choose their own container width.
//  • overflow-x-hidden on the root div prevents any component
//    from causing horizontal scroll on any viewport.
//  • The white "content shell" inner div gives every page a
//    clean white canvas without forcing pages to declare it.
// ─────────────────────────────────────────────────────────────

const Layout = () => (
  // Root: full viewport height column, no horizontal overflow
  <div className="flex flex-col min-h-screen w-full overflow-x-hidden bg-slate-50">

    {/* ── Header ──────────────────────────────────────────────
        Sticky, full-width. z-50 lives inside Header itself.
        No changes to the Header component.
    ──────────────────────────────────────────────────────── */}
    <Header />

    {/* ── Main content area ───────────────────────────────────
        flex-1     → pushes footer to the bottom of the viewport
        bg-slate-50→ subtle gray page background (Amazon/Myntra)
        min-w-0    → prevents flex children from overflowing
        w-full     → full width so hero banners can go edge-to-edge
    ──────────────────────────────────────────────────────── */}
    <main className="flex-1 w-full min-w-0 bg-slate-50">

      {/* White content shell
          Constrains readable content to 1440px max on ultra-wide
          screens, centers it, and provides a crisp white card
          background that separates page content from the slate bg.
          Pages that want full-bleed (hero images, banners) can
          break out with negative margins or their own wrapper.
      */}
      <div className="w-full max-w-[1440px] mx-auto bg-white min-h-[calc(100vh-112px)]">
        <Outlet />
      </div>

    </main>

    {/* ── Footer ──────────────────────────────────────────────
        Full-width dark footer. No changes to the Footer component.
    ──────────────────────────────────────────────────────── */}
    <Footer />

  </div>
);

export default Layout;
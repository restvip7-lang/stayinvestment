/** Catalogue section texts in English — translation of src/content/package-texts.ts. */
import type { PackageKey } from '../lib/catalog';
import type { SectionText } from './package-texts';

export const PACKAGE_PAGES_EN: Record<PackageKey, SectionText> = {
  rental: {
    h1: 'Rental — Turkish real estate for letting',
    lead: 'Apartments in resort complexes in Alanya and in Istanbul with rental income guaranteed by the developer. You receive passive income, while the management company takes care of finding tenants, contracts and maintenance.',
    html: `
<h2>What rental properties we offer</h2>
<p>The catalogue features properties in demand both with tourists and with people moving to Turkey for the long term:</p>
<ul>
<li><strong>Apartments in seaside complexes</strong> in Alanya and Antalya — with pools, spa, gym and security. Such apartments are let daily in the season and long-term in winter.</li>
<li><strong>Club-style townhouses</strong> — secluded homes 300 metres from the sea, popular with families on holiday.</li>
<li><strong>Hotel-concept complexes</strong> — residences with villas, townhouses and their own hotel, where apartments work as hotel rooms.</li>
<li><strong>Apartments in Istanbul</strong> — for long-term rental to local residents and relocants.</li>
</ul>
<p>The catalogue is updated regularly: we add the properties with the highest rental potential at the moment.</p>
<h2>How guaranteed rental works</h2>
<p>The investor and the management company sign an agreement under which the owner receives a fixed annual rental income — on average 5–7% per year of the property price. The guarantee period is 2 to 5 years, depending on the project.</p>
<p>The developer finds tenants, draws up contracts and handles day-to-day operations. The owner receives income net of the management company's fees. When the guarantee ends, you can let the property yourself or keep it under Stay Property's management — we hold a licence for letting real estate.</p>
<h2>Why a rental business in Turkey pays off</h2>
<p>Renting is a long-term strategy with regular cash flow. The average yield of rental housing in Turkey is 6–7% per year, and it can be higher for properties on the first coastline. In the season, apartments are rented by tourists, and the rest of the year by people who live and work in Turkey. For these tenants, location and the complex's amenities matter most, so these are exactly the criteria we use to select properties.</p>
<p>Stay Investment experts will select a property for your budget and goal, calculate the yield and support the deal from reservation to receiving the TAPU title deed.</p>`,
    faq: [
      { q: 'What income does guaranteed rental bring?', a: 'For catalogue properties, the developer guarantees 5–7% per year of the apartment price for 2 to 5 years. The exact amount and payment schedule are set out in the contract.' },
      { q: 'Can I use the apartment myself?', a: 'Yes, the owner’s stay terms are agreed in the rental agreement: usually a few weeks a year outside the peak season.' },
      { q: 'What happens after the guarantee ends?', a: 'You can extend management with Stay Property, let the apartment yourself, sell it or live in it.' },
    ],
  },
  startovye: {
    h1: 'Discount package — investing in Turkish new builds',
    lead: 'Buying apartments in residential complexes at an early stage of construction — below market price, with a discount and an interest-free instalment plan. Income comes from the rise in value by completion.',
    html: `
<h2>Which new builds we offer to invest in</h2>
<p>About half of the housing in Turkey is bought at the start of construction — that is when prices are lowest, and they rise with each subsequent stage. The catalogue features selected projects in promising areas of Alanya — Avsallar, Oba, Tosmur, Mahmutlar, Kargicak, Kestel, Payallar, Demirtas, Konakli — and in Istanbul.</p>
<p>A detailed description, layouts and construction schedule are on the page of each complex; our consultants will tell you the rest.</p>
<h2>What yield a purchase at the construction stage brings</h2>
<p>With the right choice — considering location, amenities, layouts and distance to the sea — reselling an apartment after the building is completed can bring 15–20% of the amount invested. If you hold the property longer while the area develops, the return can be higher. Many investors do not sell the apartment but let it — and receive regular rental income.</p>
<p>You do not need the whole amount at once: developers offer interest-free instalment plans — a down payment is enough, and the rest is paid on schedule until completion.</p>
<h2>Why investing in property under construction pays off</h2>
<ul>
<li><strong>The lowest price at launch.</strong> The price rises as the complex nears completion — by handover the apartment costs noticeably more.</li>
<li><strong>Fixed price and instalments.</strong> The amount is fixed in the contract and does not change, even if the market has grown.</li>
<li><strong>Flexibility.</strong> At an early stage, minor layout changes can be agreed.</li>
<li><strong>Several exit scenarios.</strong> Resale, rental or relocation with a residence permit.</li>
</ul>
<p>Stay Investment supports the deal at every stage: checking the developer and the documents (due diligence), the contract, construction monitoring and help with resale.</p>`,
    faq: [
      { q: 'How much can I earn by reselling a new build?', a: 'The benchmark is 15–20% of the amount invested when reselling after completion. The result depends on the project, the area and the market, so we show a calculation for each property.' },
      { q: 'What if the developer delays completion?', a: 'We work with Stay Property group projects and trusted developers; deadlines and the parties’ liability are set out in the contract. Construction progress is visible in the investor account.' },
    ],
  },
  partnerskye: {
    h1: 'Partnership package — a share in a development project',
    lead: 'Invest together with the developer in Stay Property’s own projects in Alanya and Istanbul. Income comes from apartment sales; the projected ROI is from 30% per project cycle.',
    html: `
<h2>How partnership participation works</h2>
<p>The investor acquires a share in the project — from 30–50% of the budget depending on the property — and takes part in the profit from apartment sales. The project cycle — from the start of construction to sales — usually takes 24–36 months.</p>
<ol>
<li><strong>Choosing a project.</strong> We present the business plan: budget, number of apartments, construction and sales schedule, yield forecast.</li>
<li><strong>The contract.</strong> We set the share size, the profit distribution procedure, reporting and security — a promissory note, a mortgage or TAPU on the project’s apartments.</li>
<li><strong>Control.</strong> The investor account offers an online camera, photo reports, price lists, sales dynamics and, in some projects, cost accounting.</li>
<li><strong>Profit distribution.</strong> After construction and sales are completed, the profit is distributed in proportion to the share.</li>
</ol>
<h2>Who it suits</h2>
<p>The partnership package is designed for investors ready to invest a large amount for 2–3 years who want a higher return than rental. It is an investment in a development business, not in a single apartment — so we go through the risks and terms in detail before the contract is signed.</p>`,
    faq: [
      { q: 'What is the minimum share size?', a: 'Usually 30% to 50% of the project budget, depending on the property. Entry amounts are shown on the project pages.' },
      { q: 'How is the investment secured?', a: 'The contract is certified by a notary; as security, a guarantee promissory note, a mortgage or TAPU on apartments in the project is issued for an amount equivalent to the investment.' },
    ],
  },
};

export const BUSINESS_PAGE_EN: SectionText = {
  h1: 'Business investment in Turkey',
  lead: 'Commercial property and business projects: offices, retail premises, resort hotels and development land. We select the property and support the deal end to end.',
  html: `
<h2>Where people invest in Turkey</h2>
<p>Among the most profitable areas are the hotel and restaurant business, construction and everything related to real estate. In the experience of investors who have been running projects in Turkey for several years, real estate remains the most stable and understandable area.</p>
<ul>
<li><strong>Development land.</strong> A plot for a residential complex is the basis of a development project: the apartments can be sold or let.</li>
<li><strong>Hotels and mini-hotels.</strong> The tourist flow to the Antalya region makes a well-located hotel business one of the fastest to pay back.</li>
<li><strong>Commercial premises.</strong> Offices and shops in growing areas — with long-term tenants.</li>
<li><strong>Apartments and villas.</strong> The most accessible entry for new investors — with resale or rental.</li>
</ul>
<p>The yield of business projects depends heavily on the property and its management, so we prepare an individual calculation for each request.</p>
<h2>Conditions for foreign investors</h2>
<p>Turkish law is open to foreign capital:</p>
<ul>
<li>the law protects foreign investment from nationalisation;</li>
<li>foreigners do business on the same terms as Turkish citizens;</li>
<li>tax incentives and reduced rates apply to certain industries and regions;</li>
<li>commercial disputes can be resolved through international arbitration.</li>
</ul>
<p>How to register a company, which documents and taxes apply — see our <a href="/open_a_company_in_turkey/">step-by-step guide</a>.</p>
<h2>Why Stay Investment</h2>
<p>We are part of a development group and see the market from the inside: we will select a property, check the documents, prepare the deal and, if needed, take the property under management. Leave a request — a personal manager will contact you and prepare a selection.</p>`,
};

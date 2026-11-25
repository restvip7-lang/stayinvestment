/** Tekstovi odeljaka kataloga na srpskom (latinica) — prevod src/content/package-texts.ts. */
import type { PackageKey } from '../lib/catalog';
import type { SectionText } from './package-texts';

export const PACKAGE_PAGES_SR: Record<PackageKey, SectionText> = {
  rental: {
    h1: 'Rentiranje — nekretnine u Turskoj za izdavanje',
    lead: 'Stanovi u turističkim kompleksima u Alanji i u Istanbulu sa prihodom od zakupa koji garantuje investitor. Vi dobijate pasivan prihod, a traženje zakupaca, ugovore i održavanje preuzima upravljačka kompanija.',
    html: `
<h2>Koje nekretnine za izdavanje nudimo</h2>
<p>U katalogu su objekti traženi i kod turista i kod onih koji se u Tursku sele na duži period:</p>
<ul>
<li><strong>Stanovi u kompleksima pored mora</strong> u Alanji i Antaliji — sa bazenima, spa centrom, teretanom i obezbeđenjem. Takvi apartmani se u sezoni izdaju na dan, a zimi na duži rok.</li>
<li><strong>Kuće u nizu klupskog tipa</strong> — mirne kuće na 300 metara od mora koje biraju porodice na odmoru.</li>
<li><strong>Kompleksi hotelskog koncepta</strong> — rezidencije sa vilama, kućama u nizu i sopstvenim hotelom, gde stanovi funkcionišu kao hotelske sobe.</li>
<li><strong>Stanovi u Istanbulu</strong> — za dugoročni zakup lokalnim stanovnicima i onima koji se doseljavaju.</li>
</ul>
<p>Katalog se redovno ažurira: dodajemo objekte sa trenutno najvećim potencijalom za izdavanje.</p>
<h2>Kako funkcioniše garantovani zakup</h2>
<p>Investitor i upravljačka kompanija zaključuju ugovor po kome vlasnik svake godine dobija fiksni prihod od zakupa — u proseku 5–7% godišnje od cene objekta. Rok garancije je od 2 do 5 godina, u zavisnosti od projekta.</p>
<p>Investitor sam traži zakupce, sastavlja ugovore i rešava tekuća pitanja održavanja. Vlasnik dobija prihod umanjen za usluge upravljačke kompanije. Po isteku garancije objekat možete izdavati sami ili ga ostaviti na upravljanju kompaniji Stay Property — imamo licencu za izdavanje nekretnina.</p>
<h2>Zašto se biznis sa zakupom u Turskoj isplati</h2>
<p>Zakup je dugoročna strategija sa redovnim novčanim tokom. Prosečan prinos stambenog zakupa u Turskoj je 6–7% godišnje, a kod objekata u prvoj liniji do mora može biti i veći. U sezoni apartmane iznajmljuju turisti, a ostatak godine oni koji žive i rade u Turskoj. Takvim zakupcima su najvažniji lokacija i infrastruktura kompleksa, zato objekte biramo upravo po tim kriterijumima.</p>
<p>Stručnjaci Stay Investment izabraće objekat prema vašem budžetu i cilju, izračunati prinos i pratiti transakciju od rezervacije do dobijanja TAPU.</p>`,
    faq: [
      { q: 'Koliki prihod donosi garantovani zakup?', a: 'Za objekte iz kataloga investitor garantuje 5–7% godišnje od cene stana na period od 2 do 5 godina. Tačan iznos i plan isplata utvrđuju se ugovorom.' },
      { q: 'Mogu li i sam da koristim stan?', a: 'Da, uslovi boravka vlasnika dogovaraju se u ugovoru o zakupu: obično nekoliko nedelja godišnje van glavne sezone.' },
      { q: 'Šta biva po isteku garancije?', a: 'Možete produžiti upravljanje sa kompanijom Stay Property, sami izdavati stan, prodati ga ili živeti u njemu.' },
    ],
  },
  startovye: {
    h1: 'Startni paket — ulaganje u novogradnju u Turskoj',
    lead: 'Kupovina stanova u stambenim kompleksima u ranoj fazi izgradnje — po ceni ispod tržišne, uz popust i beskamatnu otplatu na rate. Prihod nastaje rastom vrednosti do završetka gradnje.',
    html: `
<h2>U koju novogradnju nudimo da uložite</h2>
<p>Oko polovine stanova u Turskoj kupuje se na početku izgradnje — tada su cene najniže, a sa svakom sledećom fazom rastu. U katalogu su odabrani projekti u perspektivnim delovima Alanje — Avsalar, Oba, Tosmur, Mahmutlar, Kargidžak, Kestel, Pajalar, Demirtaš, Konakli — i u Istanbulu.</p>
<p>Detaljan opis, strukture stanova i plan izgradnje nalaze se na stranici svakog kompleksa; ostalo će vam reći naši konsultanti.</p>
<h2>Kakav prinos donosi kupovina u fazi izgradnje</h2>
<p>Uz pravilan izbor — uzimajući u obzir lokaciju, infrastrukturu, strukture i udaljenost od mora — preprodaja stana nakon puštanja zgrade u upotrebu može doneti 15–20% uloženog iznosa. Ako objekat zadržite duže dok se kraj razvija, prihod može biti veći. Mnogi investitori stan ne prodaju, već ga izdaju — i ostvaruju redovan prihod od zakupa.</p>
<p>Ceo iznos nije potreban odmah: investitori nude beskamatnu otplatu na rate — dovoljno je učešće, a ostatak se plaća po planu do završetka gradnje.</p>
<h2>Zašto se isplati ulagati u stanove u izgradnji</h2>
<ul>
<li><strong>Najniža cena na početku.</strong> Cena raste sa spremnošću kompleksa — do useljenja stan vredi primetno više.</li>
<li><strong>Fiksna cena i otplata na rate.</strong> Iznos se utvrđuje ugovorom i ne menja se, čak i ako je tržište poraslo.</li>
<li><strong>Fleksibilnost.</strong> U ranoj fazi mogu se dogovoriti manje izmene strukture stana.</li>
<li><strong>Više scenarija izlaska.</strong> Preprodaja, zakup ili preseljenje uz dobijanje boravišne dozvole.</li>
</ul>
<p>Stay Investment prati transakciju u svakoj fazi: provera investitora i dokumenata (due diligence), ugovor, kontrola izgradnje i pomoć pri preprodaji.</p>`,
    faq: [
      { q: 'Koliko se može zaraditi na preprodaji novogradnje?', a: 'Orijentir je 15–20% uloženog iznosa pri preprodaji nakon završetka gradnje. Rezultat zavisi od projekta, kraja i tržišta, zato za svaki objekat prikazujemo proračun.' },
      { q: 'Šta ako investitor kasni sa završetkom?', a: 'Radimo sa projektima grupe Stay Property i proverenim investitorima; rokovi i odgovornost strana utvrđuju se ugovorom. Tok izgradnje vidi se u nalogu investitora.' },
    ],
  },
  partnerskye: {
    h1: 'Partnerski paket — udeo u razvojnom projektu',
    lead: 'Ulažite zajedno sa investitorom u sopstvene projekte Stay Property u Alanji i Istanbulu. Prihod nastaje od prodaje stanova, projektovani ROI — od 30% po ciklusu projekta.',
    html: `
<h2>Kako funkcioniše partnersko učešće</h2>
<p>Investitor stiče udeo u projektu — od 30–50% budžeta u zavisnosti od objekta — i učestvuje u dobiti od prodaje stanova. Ciklus projekta — od početka izgradnje do prodaje — obično traje 24–36 meseci.</p>
<ol>
<li><strong>Izbor projekta.</strong> Predstavljamo biznis-plan: budžet, broj stanova, plan izgradnje i prodaje, prognozu prinosa.</li>
<li><strong>Ugovor.</strong> Utvrđujemo veličinu udela, način raspodele dobiti, izveštavanje i obezbeđenje — menicu, hipoteku ili TAPU na stanove projekta.</li>
<li><strong>Kontrola.</strong> U nalogu investitora — onlajn kamera, foto-izveštaji, cenovnici, dinamika prodaje, a u pojedinim projektima i računovodstvo troškova.</li>
<li><strong>Raspodela dobiti.</strong> Po završetku izgradnje i prodaje dobit se raspodeljuje srazmerno udelu.</li>
</ol>
<h2>Kome odgovara</h2>
<p>Partnerski paket namenjen je investitorima spremnim da ulože veći iznos na 2–3 godine i koji žele prinos veći od zakupa. To je ulaganje u razvojni biznis, a ne u pojedinačan stan — zato rizike i uslove detaljno razmatramo pre potpisivanja ugovora.</p>`,
    faq: [
      { q: 'Kolika je minimalna veličina udela?', a: 'Obično od 30% do 50% budžeta projekta — u zavisnosti od objekta. Iznosi ulaza navedeni su na stranicama projekata.' },
      { q: 'Čime je ulaganje obezbeđeno?', a: 'Ugovor se overava kod notara; kao obezbeđenje izdaje se garantna menica, hipoteka ili TAPU na stanove u projektu — u iznosu koji odgovara investiciji.' },
    ],
  },
};

export const BUSINESS_PAGE_SR: SectionText = {
  h1: 'Investiranje u biznis u Turskoj',
  lead: 'Komercijalne nekretnine i biznis-projekti: kancelarije, prodajni prostori, turistički hoteli i zemljište za gradnju. Biramo objekat i pratimo transakciju po principu „ključ u ruke“.',
  html: `
<h2>U šta se ulaže u Turskoj</h2>
<p>Među najisplativijim oblastima su hotelijerstvo i ugostiteljstvo, građevinarstvo i sve što je povezano sa nekretninama. Prema iskustvu investitora koji već nekoliko godina vode projekte u Turskoj, nekretnine ostaju najstabilnija i najrazumljivija oblast.</p>
<ul>
<li><strong>Zemljište za gradnju.</strong> Plac za stambeni kompleks je osnova razvojnog projekta: stanovi se mogu prodavati ili izdavati.</li>
<li><strong>Hoteli i mini-hoteli.</strong> Priliv turista u region Antalije čini hotelski biznis na dobroj lokaciji jednim od onih koji se najbrže isplate.</li>
<li><strong>Komercijalni prostori.</strong> Kancelarije i prodavnice u delovima grada koji rastu — sa dugoročnim zakupcima.</li>
<li><strong>Stanovi i vile.</strong> Najpristupačniji ulaz za početnike — uz preprodaju ili zakup.</li>
</ul>
<p>Prinos biznis-projekata u velikoj meri zavisi od objekta i upravljanja, zato za svaki zahtev pripremamo individualni proračun.</p>
<h2>Uslovi za strane investitore</h2>
<p>Zakonodavstvo Turske otvoreno je za strani kapital:</p>
<ul>
<li>zakon štiti strane investicije od nacionalizacije;</li>
<li>stranci posluju pod istim uslovima kao i državljani Turske;</li>
<li>za pojedine delatnosti i regione važe poreske olakšice i niže stope;</li>
<li>privredni sporovi mogu se rešavati pred međunarodnom arbitražom.</li>
</ul>
<p>Kako registrovati kompaniju, koji su dokumenti i porezi potrebni — u našem <a href="/open_a_company_in_turkey/">vodiču korak po korak</a>.</p>
<h2>Zašto sa Stay Investment</h2>
<p>Deo smo razvojne grupe i tržište vidimo iznutra: izabraćemo objekat, proveriti dokumente, pripremiti transakciju i, ako je potrebno, preuzeti objekat na upravljanje. Ostavite zahtev — lični menadžer će vas kontaktirati i pripremiti izbor.</p>`,
};

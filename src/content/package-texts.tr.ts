/** Katalog bölümlerinin Türkçe metinleri — src/content/package-texts.ts dosyasının çevirisi. */
import type { PackageKey } from '../lib/catalog';
import type { SectionText } from './package-texts';

export const PACKAGE_PAGES_TR: Record<PackageKey, SectionText> = {
  rental: {
    h1: "Rantiye — Türkiye'de kira getirili gayrimenkul",
    lead: "Alanya'daki tatil sitelerinde ve İstanbul'da, kira geliri geliştirici tarafından garanti edilen daireler. Siz pasif gelir elde edersiniz; kiracı bulma, sözleşme ve bakım işlerini yönetim şirketi üstlenir.",
    html: `
<h2>Kira geliri için sunduğumuz gayrimenkuller</h2>
<p>Katalogda hem turistlerin hem de Türkiye'ye uzun süreliğine yerleşenlerin talep ettiği projeler yer alıyor:</p>
<ul>
<li><strong>Deniz kenarındaki sitelerde daireler</strong> — Alanya ve Antalya'da; havuz, spa, fitness salonu ve güvenlik hizmetiyle. Bu daireler sezonda günlük, kışın ise uzun dönem kiraya verilir.</li>
<li><strong>Kulüp konseptli sıra evler</strong> — denize 300 metre mesafede, ailelerin tatil için tercih ettiği sakin ve mahremiyeti yüksek evler.</li>
<li><strong>Otel konseptli projeler</strong> — villaları, sıra evleri ve kendi oteli bulunan rezidanslar; buradaki daireler otel odası olarak işletilir.</li>
<li><strong>İstanbul'da daireler</strong> — şehirde yaşayanlara ve Türkiye'ye yerleşen yabancılara uzun dönem kiralama için.</li>
</ul>
<p>Katalog düzenli olarak güncellenir: o dönemde kira potansiyeli en yüksek olan projeleri ekliyoruz.</p>
<h2>Kira garantisi nasıl işler?</h2>
<p>Yatırımcı ile yönetim şirketi arasında bir sözleşme imzalanır; bu sözleşme uyarınca mülk sahibi her yıl sabit bir kira geliri elde eder: ortalama olarak gayrimenkul bedelinin yıllık %5–7'si. Garanti süresi projeye göre 2 ila 5 yıldır.</p>
<p>Kiracıları geliştirici bulur, sözleşmeleri düzenler ve işletmeyle ilgili gündelik konuları çözer. Mülk sahibi, yönetim şirketinin hizmet bedeli düşüldükten sonra kalan geliri alır. Garanti süresi bittiğinde gayrimenkulü kendiniz kiraya verebilir veya Stay Property yönetiminde bırakabilirsiniz; gayrimenkul kiralama lisansımız bulunuyor.</p>
<h2>Türkiye'de kira yatırımı neden kazançlı?</h2>
<p>Kiralama, düzenli nakit akışı sağlayan uzun vadeli bir stratejidir. Türkiye'de kiralık konutların ortalama getirisi yıllık %6–7'dir; denize sıfır projelerde bu oran daha yüksek olabilir. Sezonda daireleri turistler, yılın geri kalanında ise Türkiye'de yaşayan ve çalışanlar kiralar. Bu kiracılar için en önemli unsurlar konum ve sitenin sosyal olanaklarıdır; bu nedenle projeleri tam da bu ölçütlere göre seçiyoruz.</p>
<p>Stay Investment uzmanları bütçenize ve hedefinize uygun gayrimenkulü seçer, getiriyi hesaplar ve rezervasyondan tapunun alınmasına kadar tüm süreçte size eşlik eder.</p>`,
    faq: [
      { q: 'Kira garantisi ne kadar gelir sağlar?', a: "Katalogdaki projelerde geliştirici, 2 ila 5 yıl süreyle daire bedelinin yıllık %5–7'si oranında gelir garanti eder. Kesin tutar ve ödeme takvimi sözleşmede belirlenir." },
      { q: 'Daireyi kendim kullanabilir miyim?', a: 'Evet, mülk sahibinin konaklama koşulları kira sözleşmesinde belirlenir: genellikle yoğun sezon dışında yılda birkaç hafta.' },
      { q: 'Garanti süresi bittikten sonra ne olur?', a: 'Stay Property ile yönetim sözleşmesini uzatabilir, daireyi kendiniz kiraya verebilir, satabilir veya içinde yaşayabilirsiniz.' },
    ],
  },
  startovye: {
    h1: "Lansman paketi — Türkiye'de yeni konut projelerine yatırım",
    lead: 'İnşaatı süren konut projelerinden erken aşamada daire alımı: piyasanın altında fiyat, indirim ve faizsiz taksit imkânıyla. Kazanç, bina teslim edilene kadar oluşan değer artışından gelir.',
    html: `
<h2>Yatırım için önerdiğimiz yeni projeler</h2>
<p>Türkiye'de konutların yaklaşık yarısı inşaatın başlangıç aşamasında satın alınır: fiyatlar tam da bu dönemde en düşük seviyededir ve her yeni aşamada yükselir. Katalogda Alanya'nın gelecek vadeden bölgelerinde (Avsallar, Oba, Tosmur, Mahmutlar, Kargıcak, Kestel, Payallar, Demirtaş, Konaklı) ve İstanbul'da seçilmiş projeler yer alıyor.</p>
<p>Ayrıntılı açıklama, daire planları ve inşaat takvimi her projenin sayfasında bulunur; diğer sorularınızı danışmanlarımız yanıtlar.</p>
<h2>İnşaat aşamasında alım ne kadar getiri sağlar?</h2>
<p>Konum, sosyal olanaklar, daire planları ve denize uzaklık dikkate alınarak doğru seçim yapıldığında, bina kullanıma açıldıktan sonra dairenin yeniden satışı yatırılan tutarın %15–20'si kadar kazanç sağlayabilir. Bölge gelişirken gayrimenkul daha uzun süre elde tutulursa kazanç daha yüksek olabilir. Birçok yatırımcı daireyi satmak yerine kiraya verir ve düzenli kira geliri elde eder.</p>
<p>Tutarın tamamına baştan sahip olmanız gerekmez: geliştiriciler faizsiz taksit sunar; peşinat yeterlidir, kalan tutar bina teslim edilene kadar ödeme planına göre ödenir.</p>
<h2>İnşaat hâlindeki konuta yatırım neden avantajlı?</h2>
<ul>
<li><strong>Başlangıçta en düşük fiyat.</strong> Fiyat, proje tamamlandıkça yükselir; teslim tarihinde daire belirgin biçimde daha değerlidir.</li>
<li><strong>Sabit fiyat ve taksit.</strong> Tutar sözleşmede sabitlenir ve piyasa yükselse bile değişmez.</li>
<li><strong>Esneklik.</strong> Erken aşamada daire planında küçük değişiklikler üzerinde anlaşılabilir.</li>
<li><strong>Birden fazla çıkış senaryosu.</strong> Yeniden satış, kiralama veya oturma izni alarak Türkiye'ye yerleşme.</li>
</ul>
<p>Stay Investment sürecin her aşamasında yanınızdadır: geliştiricinin ve belgelerin incelenmesi (due diligence), sözleşme, inşaatın takibi ve yeniden satışta destek.</p>`,
    faq: [
      { q: 'Yeni projedeki bir daireyi yeniden satarak ne kadar kazanılabilir?', a: "Yol gösterici oran: bina teslim edildikten sonraki satışta yatırılan tutarın %15–20'si. Sonuç projeye, bölgeye ve piyasaya bağlıdır; bu nedenle her proje için ayrı bir hesaplama sunuyoruz." },
      { q: 'Geliştirici teslimi geciktirirse ne olur?', a: 'Stay Property grubunun projeleriyle ve güvenilirliği kanıtlanmış geliştiricilerle çalışıyoruz; süreler ve tarafların sorumlulukları sözleşmede belirlenir. İnşaatın ilerleyişi yatırımcı panelinden izlenebilir.' },
    ],
  },
  partnerskye: {
    h1: 'Ortaklık paketi — gayrimenkul geliştirme projesinde pay',
    lead: "Stay Property'nin Alanya ve İstanbul'daki kendi projelerine geliştiriciyle birlikte yatırım yapın. Kazanç daire satışlarından elde edilir; öngörülen ROI, proje döngüsü başına %30'dan başlar.",
    html: `
<h2>Ortaklık modeli nasıl işler?</h2>
<p>Yatırımcı projeden pay satın alır (projeye göre bütçenin en az %30–50'si) ve daire satışlarından elde edilen kâra ortak olur. İnşaatın başlangıcından satışa uzanan proje döngüsü genellikle 24–36 ay sürer.</p>
<ol>
<li><strong>Proje seçimi.</strong> İş planını sunuyoruz: bütçe, daire sayısı, inşaat ve satış takvimi, getiri öngörüsü.</li>
<li><strong>Sözleşme.</strong> Pay oranını, kâr dağıtım esaslarını, raporlamayı ve teminatı belirliyoruz: senet, ipotek veya projedeki dairelerin tapusu.</li>
<li><strong>Kontrol.</strong> Yatırımcı panelinde canlı kamera, fotoğraflı raporlar, fiyat listeleri ve satışların seyri, bazı projelerde ise gider muhasebesi de yer alır.</li>
<li><strong>Kâr dağıtımı.</strong> İnşaat ve satışlar tamamlandıktan sonra kâr, pay oranında dağıtılır.</li>
</ol>
<h2>Kimler için uygun?</h2>
<p>Ortaklık paketi, yüksek bir tutarı 2–3 yıllığına yatırmaya hazır olan ve kira gelirinin üzerinde getiri hedefleyen yatırımcılar için tasarlanmıştır. Bu, tek bir daireye değil, gayrimenkul geliştirme işine yapılan bir yatırımdır; bu nedenle sözleşme imzalanmadan önce riskleri ve koşulları ayrıntılı biçimde ele alıyoruz.</p>`,
    faq: [
      { q: 'Asgari pay oranı nedir?', a: "Projeye göre genellikle proje bütçesinin %30 ila %50'si. Giriş tutarları proje kartlarında belirtilmiştir." },
      { q: 'Yatırım hangi teminatla güvence altına alınır?', a: 'Sözleşme noterde onaylanır; teminat olarak, yatırım tutarına eşdeğer bedelde teminat senedi, ipotek veya projedeki dairelerin tapusu düzenlenir.' },
    ],
  },
};

export const BUSINESS_PAGE_TR: SectionText = {
  h1: "Türkiye'de iş yatırımı",
  lead: 'Ticari gayrimenkul ve iş projeleri: ofisler, mağaza ve dükkânlar, tatil otelleri ve inşaata uygun arsalar. Uygun projeyi seçiyor, işlemi baştan sona anahtar teslim yürütüyoruz.',
  html: `
<h2>Türkiye'de hangi alanlara yatırım yapılıyor?</h2>
<p>En kârlı alanlar arasında otelcilik ve restoran işletmeciliği, inşaat ve gayrimenkulle ilgili her şey yer alıyor. Türkiye'de birkaç yıldır proje yürüten yatırımcıların deneyimine göre gayrimenkul, en istikrarlı ve en öngörülebilir alan olmayı sürdürüyor.</p>
<ul>
<li><strong>İnşaata uygun arsa.</strong> Konut projesi için arsa, bir geliştirme projesinin temelidir: daireler satılabilir veya kiraya verilebilir.</li>
<li><strong>Oteller ve butik oteller.</strong> Antalya bölgesine yönelen turist akışı, iyi konumdaki bir oteli yatırımını en hızlı geri kazandıran işlerden biri hâline getiriyor.</li>
<li><strong>Ticari alanlar.</strong> Gelişen bölgelerde, uzun vadeli kiracıları olan ofis ve mağazalar.</li>
<li><strong>Daireler ve villalar.</strong> Yatırıma yeni başlayanlar için en erişilebilir giriş: yeniden satış veya kiralama seçeneğiyle.</li>
</ul>
<p>İş projelerinin getirisi büyük ölçüde projeye ve yönetime bağlıdır; bu nedenle her talep için ayrı bir hesaplama hazırlıyoruz.</p>
<h2>Yabancı yatırımcılar için koşullar</h2>
<p>Türk mevzuatı yabancı sermayeye açıktır:</p>
<ul>
<li>kanun, yabancı yatırımları devletleştirmeye karşı korur;</li>
<li>yabancılar, Türk vatandaşlarıyla aynı koşullarda iş yapar;</li>
<li>belirli sektör ve bölgelerde vergi teşvikleri ve indirimli oranlar uygulanır;</li>
<li>ticari uyuşmazlıklar uluslararası tahkim yoluyla çözülebilir.</li>
</ul>
<p>Şirket nasıl kurulur, hangi belgeler gerekir, hangi vergiler ödenir? Yanıtları <a href="/open_a_company_in_turkey/">adım adım rehberimizde</a> bulabilirsiniz.</p>
<h2>Neden Stay Investment?</h2>
<p>Bir gayrimenkul geliştirme grubunun parçasıyız ve piyasayı içeriden görüyoruz: uygun projeyi seçer, belgeleri inceler, işlemi hazırlar ve gerekirse gayrimenkulün yönetimini üstleniriz. Başvuru bırakın; kişisel danışmanınız sizinle iletişime geçip size özel bir seçki hazırlasın.</p>`,
};

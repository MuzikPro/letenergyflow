import { dataset } from '../data';
import { INDICATION_CHANNELS, MODEL_SOURCE_ID } from '../data/indications';
import { SOLAR_TIME_NOTE } from '../data/shichen';
import type { ReuseStatus, ReviewStatus, SourceType } from '../data/types';
import { useBilingual, useStore } from '../state/store';

const TYPE_LABEL: Record<SourceType, { zh: string; en: string }> = {
  user_curriculum: { zh: '課程教材', en: 'Course material' },
  classical_public_domain: { zh: '古典公版文獻', en: 'Classical, public domain' },
  official_standard: { zh: '官方標準', en: 'Official standard' },
  educational_institution: { zh: '院校教材', en: 'Institutional textbook' },
  peer_reviewed: { zh: '同行評審', en: 'Peer reviewed' },
  expert_review: { zh: '專家審核', en: 'Expert review' },
  project_original: { zh: '本專案原創', en: 'Original to this project' },
};

const REVIEW_LABEL: Record<ReviewStatus, { zh: string; en: string }> = {
  unreviewed: { zh: '尚未審核', en: 'Unreviewed' },
  source_checked: { zh: '已核對來源', en: 'Source checked' },
  expert_reviewed: { zh: '專家已審核', en: 'Expert reviewed' },
};

const REUSE_LABEL: Record<ReuseStatus, { zh: string; en: string }> = {
  public_domain_fact: { zh: '公版事實', en: 'Public-domain fact' },
  open_licensed: { zh: '開放授權', en: 'Open licensed' },
  publicly_accessible_restricted: { zh: '公開可讀、再用受限', en: 'Publicly readable, reuse restricted' },
  permission_required: { zh: '需取得授權', en: 'Permission required' },
  unknown: { zh: '未確認', en: 'Unknown' },
};

/**
 * One central place for the educational-use disclaimer, the source list and
 * the review-status legend — so individual point sheets stay readable while
 * every claim's provenance remains available and explicit.
 */
export default function AboutView({ onClose }: { onClose?: () => void }) {
  const t = useBilingual();
  const { setRoute } = useStore();
  /*
   * Derived, because this section was WRONG for two commits: it said
   * symptom-to-point pairings were never carried, which stopped being true the
   * moment the Lung was ingested. A sentence stating a number the dataset also
   * knows has to read it from there, and a test now compares the two.
   */
  const coveredPoints = dataset.acupoints.filter(
    (p) => p.actions !== null || p.indications !== null,
  ).length;
  /* Points ON those channels, which is the larger number: six of them carry
     nothing, and saying only "91 points" would hide that difference. */
  const pointsOnCoveredChannels = dataset.acupoints.filter((p) =>
    INDICATION_CHANNELS.includes(p.meridianId),
  ).length;
  /* Counted, not stated: the balance between the two shifts with every ingest,
     and a written number would misreport it the first time one lands. */
  const allFields = dataset.acupoints
    .flatMap((p) => [p.actions, p.indications])
    .filter((f): f is NonNullable<typeof f> => Boolean(f));
  const modelFields = allFields.filter((f) => f.sourceIds.includes(MODEL_SOURCE_ID)).length;
  const filedFields = allFields.length - modelFields;

  return (
    <div className="page stack" style={{ maxWidth: 760 }}>
      <header className="stack" style={{ gap: 6 }}>
        {onClose && (
          <div>
            <button type="button" className="btn small ghost" onClick={onClose}>
              ← {t('返回', 'Back')}
            </button>
          </div>
        )}
        <div className="eyebrow">{t('關於本資料', 'About this content')}</div>
        <h1 style={{ fontSize: 26 }}>{t('來源與聲明', 'Sources & disclaimer')}</h1>
      </header>

      <section className="notice">
        <span>
          <strong>{t('教學與示意用途', 'Teaching and illustration only')}</strong> —{' '}
          {t(
            '本應用是經絡與穴位的記憶學習工具。它不診斷、不判讀症狀、不建議治療、不提供任何針刺、放血、艾灸或其他侵入性操作說明。身體不適請諮詢合格醫療專業人員。',
            'This app is a memorisation aid for channels and point locations. It does not diagnose, interpret symptoms, recommend treatment, or describe needling, bloodletting, moxibustion or any other invasive technique. For any health concern, consult a qualified practitioner.',
          )}
        </span>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('目前載入的範圍', 'What is loaded so far')}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t(dataset.scopeLabelZhHant, dataset.scopeLabelEn)}
        </p>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '這是逐步擴充中的資料集，不是完整的經穴目錄。搜尋結果只涵蓋已載入的記錄。',
            'This dataset is being built up channel by channel — it is not a complete point catalogue. Search only covers the records listed above.',
          )}
        </p>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('人體圖是示意圖', 'The figure is schematic')}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            '示意圖，非解剖圖：圖上的人形、手腳與所有標記位置都是本專案自行繪製的示意排版，用來建立空間記憶。所有標記位置尚未經專家審核，一律標示為 schematic_unvalidated——它們不是經過實測驗證的解剖座標，不可用於在真人身上定位取穴。',
            'A schematic figure, not an anatomical reference. The body, hands, feet and every marker on them are this project’s own layout, drawn to support spatial memory. All marker positions are unreviewed and flagged schematic_unvalidated: they are not measured anatomical coordinates and must not be used to locate a point on a real body.',
          )}
        </p>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '軀幹上的「旁開幾寸」在示意圖上經過壓縮，因為畫中的身體比真人窄。標記的先後順序與相對間距忠於來源，絕對距離則不是。',
            'Lateral “cun” offsets on the trunk are compressed on this figure, which is narrower than a real body. Marker order and relative spacing follow the sources; absolute distances do not.',
          )}
        </p>
        <p className="faint" style={{ margin: 0 }}>
          {/*
           * CC BY 4.0 attribution. The lumbar step of the back-view vertebral
           * ladder is measured off that model, so the licence obliges this
           * notice to ship with the app — not merely to sit in a review file.
           */}
          {t(
            '背面的脊椎階梯——各節胸椎、腰椎棘突之間的間距——量自一組開放授權的參考脊柱：HuBMAP CCF 3D Reference Object Library（CC BY 4.0，取自 Visible Human 男性資料）。取自該模型的只有這組節距比例，並且是配進本專案既有的人形之中：人形本身仍是自行繪製，未描摹任何外部圖像。骶骨段的間距無從量起（該模型的骶骨是整塊，沒有骶後孔），是依比例配入。依授權條款標註出處：Browne, K., Schlehlein, H., Herr II, B. W., Quardokus, E., Bueckle, A., Börner, K. (2022). HuBMAP CCF 3D Reference Object Library.',
            'The back-view vertebral ladder — how far apart the thoracic and lumbar spinous processes sit — is measured from an openly licensed reference spine, the HuBMAP CCF 3D Reference Object Library (CC BY 4.0, built from the Visible Human male data). Those proportions are the only thing taken from it, and they are fitted into this project’s existing figure: the drawing is still the project’s own and traces no external image. The sacral spacing could not be measured at all — that model’s sacrum is a single piece with no posterior foramina — so it is fitted proportionally. Attribution as the licence requires: Browne, K., Schlehlein, H., Herr II, B. W., Quardokus, E., Bueckle, A., Börner, K. (2022). HuBMAP CCF 3D Reference Object Library.',
          )}
        </p>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>
          {t('子午流注（「流注」分頁）', 'The meridian clock (the Flow tab)')}
        </h2>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            '「流注」分頁呈現的是傳統針灸描述「十二時辰—十二正經」對應關係的框架：一天分十二時辰，每個時辰配一條經脈。該表依《針灸大成·十二經納地支歌》（明·楊繼洲）排列，從寅時的肺經起算，繞一圈回到肺經，形成閉合循環；理論源頭見《靈樞·營衛生會》《靈樞·衛氣行》與《難經·六十四難》。該分頁只呈現這層對應關係。',
            'The Flow tab shows the traditional framework pairing the twelve double-hours with the twelve regular channels — one channel to each hour. The order follows 《針灸大成·十二經納地支歌》 (Yang Jizhou, Ming dynasty), counted from the Lung at 寅 and closing back on the Lung; the theoretical background is in 《靈樞·營衛生會》, 《靈樞·衛氣行》 and 《難經·六十四難》. That tab shows the pairing and nothing more.',
          )}
        </p>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            '教育用途：這是一套描述氣血晝夜循環的傳統框架，並非療效證據，也不構成任何作息、飲食或健康建議。子午流注在傳統上被用來擇時針灸（按時取穴、納甲法、納子法、開穴閉穴），那屬於治療決策，本應用一律不提供，相關內容也不會被收錄。',
            'Educational use. This is a traditional framework describing a daily cycle — not evidence of effect, and not advice about routine, diet or any personal health situation. The scheme is traditionally used to time treatment (按時取穴, 納甲法, 納子法, 開穴閉穴); that is treatment decision-making, which this app does not provide and does not carry.',
          )}
        </p>
        <p className="faint" style={{ margin: 0 }}>
          {/* Read from the data so the Flow tab and this page cannot disagree. */}
          {t(SOLAR_TIME_NOTE.zhHant, SOLAR_TIME_NOTE.en)}
        </p>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            '審核狀態：此對應表、說明文字與各時辰敘述出自《針灸大成·十二經納地支歌》，經編審確認（2026-08-08），標記為 source_checked。英文措辭為本專案自譯，本身尚未經審核。第 13 天的課程用到這張表，教的是時辰配經與歌訣本身；擇時針灸的操作（納甲法的推算、開穴閉穴的用法）不在課程內，也不出測驗。',
            'Review status: the table, the explanatory wording and the per-hour lines follow 《針灸大成·十二經納地支歌》 and were confirmed by editorial review on 2026-08-08, so they are marked source_checked. The English wording is this project’s own translation and has not itself been reviewed. Day 13 teaches from this table — the pairings and the verse themselves. The timed-treatment methods built on it (計算 under 納甲法, the practical use of 開穴/閉穴) are not taught and are never examined.',
          )}
        </p>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('內容來源', 'Where the content comes from')}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            '穴位名稱、代號、循行、定位與特定穴分類等資料，來自下列來源的交叉比對。本專案不以任何單一機構或標準為唯一權威；資料以本專案自己的文字重述，不複製任何現代來源的原文、圖表或資料庫編排。',
            'Point names, codes, routes, locations and specific-point categories are reconciled across the sources below. No single organisation or standard is treated as the sole authority. Facts are restated in this project’s own wording — no modern source’s text, diagrams or database arrangement is reproduced.',
          )}
        </p>
        <ul className="list-reset stack" style={{ gap: 10 }}>
          {dataset.sources.map((s) => (
            <li
              key={s.id}
              className="stack"
              style={{
                gap: 5,
                padding: 12,
                borderRadius: 'var(--radius-m)',
                border: '1px solid var(--line-soft)',
                background: 'var(--bg-elev-2)',
              }}
            >
              <div style={{ fontWeight: 620 }}>{s.title}</div>
              <div className="row" style={{ gap: 6 }}>
                <span className="chip">{t(TYPE_LABEL[s.sourceType].zh, TYPE_LABEL[s.sourceType].en)}</span>
                <span className={s.reviewStatus === 'unreviewed' ? 'chip warn' : 'chip accent'}>
                  {t(REVIEW_LABEL[s.reviewStatus].zh, REVIEW_LABEL[s.reviewStatus].en)}
                </span>
                <span className="chip">{t(REUSE_LABEL[s.reuseStatus].zh, REUSE_LABEL[s.reuseStatus].en)}</span>
              </div>
              {(s.editionOrVersion || s.reference) && (
                <div className="faint">
                  {[s.editionOrVersion, s.reference].filter(Boolean).join(' · ')}
                </div>
              )}
              {s.jurisdictionOrTradition && <div className="faint">{s.jurisdictionOrTradition}</div>}
            </li>
          ))}
        </ul>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('審核狀態的意思', 'What the review labels mean')}</h2>
        <table className="data">
          <tbody>
            <tr>
              <td>
                <span className="chip warn">{t('尚未審核', 'Unreviewed')}</span>
              </td>
              <td>
                {t(
                  '尚未與任何權威來源核對，僅來自課程教材。',
                  'Not yet checked against an authoritative source — it comes from the course material only.',
                )}
              </td>
            </tr>
            <tr>
              <td>
                <span className="chip accent">{t('已核對來源', 'Source checked')}</span>
              </td>
              <td>
                {t(
                  '已由本專案擁有者對照上列標準與典籍核對並記錄出處。這是編輯層級的核對，不等於獨立專家審核。',
                  'Checked by the project owner against the standards and classics listed above, with the reference recorded. This is an editorial source-check, not an independent expert review.',
                )}
              </td>
            </tr>
            <tr>
              <td>
                <span className="chip accent">{t('專家已審核', 'Expert reviewed')}</span>
              </td>
              <td>
                {t(
                  '由具資格的專業人員審核並留下審核紀錄。目前尚無任何紀錄達到此狀態。',
                  'Reviewed by a qualified professional with the review recorded. No record has reached this status yet.',
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </section>

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('刻意排除的內容', 'What is deliberately left out')}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            '來源教材與編審工作表中包含急救用語、針刺深度與角度、禁針禁灸提醒、孕婦禁忌、放血與艾灸操作等內容。這些一律沒有被收錄，即使它們與有收錄的內容寫在同一句話裡——少商的「醒神開竅，常點刺出血」只留前半，人迎的「注意避開頸總動脈；治咽喉腫痛」只留後半。',
            'The source material and the editorial worksheet contain first-aid framing, needling depth and angle, needling contraindications, pregnancy warnings, bloodletting and moxibustion instructions. None of that is carried, even where it shares a sentence with something that is — 少商’s 「醒神開竅，常點刺出血」 keeps only the first half, and 人迎’s 「注意避開頸總動脈；治咽喉腫痛」 only the second.',
          )}
        </p>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            `傳統功效與主治則是有收錄的，由專案負責人於 2026-08-13 決定，目前涵蓋 ${INDICATION_CHANNELS.length} 條經脈；這些經脈共 ${pointsOnCoveredChannels} 個穴，其中 ${coveredPoints} 個有內容，其餘的來源沒有記錄，頁面上會直接說明。這些是傳統教材的說法，標為未經審核並附上出處；它們刻意不進入搜尋索引，因為「輸入症狀就列出穴位」本身就是一種選穴建議。其餘經脈尚未收錄，是因為之後的編審工作表本就沒有寫臨床內容，不是因為傳統上無話可說。`,
            `Traditional actions and indications ARE carried, by the owner’s decision of 2026-08-13, currently across ${INDICATION_CHANNELS.length} channels. Those channels hold ${pointsOnCoveredChannels} points, of which ${coveredPoints} carry something; the rest say plainly that no ingested source records one. They are what the traditional teaching says, labelled unreviewed and shown with their source. They are deliberately absent from the search index: a list of points reachable by typing a symptom is itself a form of point selection. The remaining channels are not carried because the later editorial worksheets were written without clinical content — not because the tradition is silent.`,
          )}
        </p>
      </section>

      {/*
        The mark on each point is a chip reading 「無出處」; this is the sentence
        it stands for. It lives here once instead of beside all 609 unsourced
        fields, where it had become something to scroll past.

        Conditional, because the shared build has none of them. Left
        unconditional it would announce "0 fields carry this mark" — which
        explains a chip the reader will never meet, and reads as a notice that
        something was taken out. A build with nothing unsourced in it should
        simply not raise the subject.
      */}
      {modelFields > 0 && (
      <section className="panel stack" id="no-source">
        <h2 style={{ fontSize: 18 }}>
          <span className="chip warn">{t('無出處', 'No source')}</span>{' '}
          {t('這個標記的意思', 'What that mark means')}
        </h2>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            '此項沒有文獻出處，是依一般教材知識生成的，僅供本人學習參考，不可作為依據，也不應對外分享。',
            'This has no documentary source. It was written from general curriculum knowledge for the owner’s personal study — not a reference, and not for sharing.',
          )}
        </p>
        <p className="faint" style={{ margin: 0 }}>
          {t(
            `目前 ${modelFields} 個欄位帶有這個標記，${filedFields} 個欄位有文獻出處。其他每一項內容都是從某份文件讀出來的，可以打開核對；帶這個標記的不行，這是兩者的差別。沒有標記、但寫著「尚未與權威來源核對」的，是有出處但還沒有專家審核。`,
            `${modelFields} fields carry this mark today; ${filedFields} have a documentary source. Everything else in this app was read out of a document you can open and check against. These were not, and that is the whole distinction. A field without the mark that says "not yet checked" has a source but no expert review — a different thing again.`,
          )}
        </p>
      </section>
      )}

      <section className="panel stack">
        <h2 style={{ fontSize: 18 }}>{t('翻譯說明', 'A note on translation')}</h2>
        <p className="muted" style={{ margin: 0 }}>
          {t(
            '中文定位文字依上列標準核對。英文定位文字是本專案自行翻譯該中文的結果，本身尚未經審核。',
            'The 中文 location wording is the source-checked text. The English location wording is this project’s own translation of that 中文 and has not itself been reviewed.',
          )}
        </p>
      </section>

      <div className="row">
        <button type="button" className="btn small ghost" onClick={() => setRoute('settings')}>
          {t('前往設定', 'Go to Settings')} →
        </button>
      </div>
    </div>
  );
}

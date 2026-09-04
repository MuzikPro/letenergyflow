/**
 * 繁體 → 简体 for the interface, and for the interface only.
 *
 * A closed, hand-checked table rather than a general converter. Two reasons,
 * and they are the same two the project gives everywhere else:
 *
 *  - a converter is a dependency whose output nobody here has read, and a
 *    wrong simplification inside a medical term would be a content error that
 *    looks like a typo;
 *  - the set that actually needs converting is closed and small — the Chinese
 *    the CHROME uses. `hans.test.ts` extracts every 中文 chrome literal from
 *    the source and fails if a character in it is missing from this table.
 *
 * Curated content is NOT run through this. Point names already carry their own
 * reviewed `nameZhHans`; 定位 texts, classical quotations and the curriculum
 * stay in the 繁體 they were read in. Converting those mechanically would be
 * inventing a reading of a source, which is the one thing `AGENTS.md` never
 * allows.
 *
 * Characters shared by both scripts are absent from the table and pass through
 * unchanged — that is why a missing entry is a bug rather than a no-op.
 */
const T2S: Record<string, string> = {
  並: '并', 併: '并', 來: '来', 係: '系', 個: '个', 們: '们', 側: '侧', 傳: '传',
  僅: '仅', 價: '价', 儲: '储', 內: '内', 兩: '两', 別: '别', 刪: '删', 則: '则',
  動: '动', 匯: '汇', 區: '区', 協: '协', 參: '参', 員: '员', 問: '问', 啟: '启',
  單: '单', 圍: '围', 圖: '图', 塊: '块', 壓: '压', 婦: '妇', 學: '学', 實: '实',
  審: '审', 寫: '写', 專: '专', 尋: '寻', 對: '对', 導: '导', 層: '层', 屬: '属',
  帳: '帐', 幹: '干', 幾: '几', 庫: '库', 張: '张', 後: '后', 從: '从', 態: '态',
  憶: '忆', 應: '应', 捲: '卷', 換: '换', 擁: '拥', 擇: '择', 據: '据', 擠: '挤',
  擴: '扩', 敘: '叙', 數: '数', 斷: '断', 於: '于', 時: '时', 晝: '昼', 會: '会',
  條: '条', 楊: '杨', 業: '业', 構: '构', 標: '标', 樞: '枢', 樣: '样', 機: '机',
  檢: '检', 欄: '栏', 權: '权', 歸: '归', 氣: '气', 決: '决', 沒: '没', 況: '况',
  減: '减', 測: '测', 準: '准', 瀏: '浏', 為: '为', 無: '无', 營: '营', 狀: '状',
  獨: '独', 獻: '献', 現: '现', 環: '环', 畫: '画', 異: '异', 疊: '叠', 療: '疗',
  確: '确', 碼: '码', 種: '种', 稱: '称', 竅: '窍', 節: '节', 範: '范', 簡: '简',
  紀: '纪', 約: '约', 納: '纳', 級: '级', 細: '细', 組: '组', 結: '结', 絕: '绝',
  絡: '络', 統: '统', 綁: '绑', 經: '经', 綜: '综', 網: '网', 線: '线', 編: '编',
  練: '练', 縮: '缩', 總: '总', 織: '织', 繞: '绕', 繪: '绘', 繼: '继', 續: '续',
  維: '维', 習: '习', 聯: '联', 聲: '声', 脈: '脉', 腫: '肿', 腳: '脚', 臟: '脏', 臨: '临',
  與: '与', 舉: '举', 蓋: '盖', 處: '处', 虛: '虚', 號: '号', 術: '术', 衛: '卫',
  補: '补', 裡: '里', 製: '制', 複: '复', 見: '见', 規: '规', 視: '视', 覺: '觉',
  覽: '览', 觸: '触', 訂: '订', 記: '记', 訣: '诀', 設: '设', 診: '诊', 註: '注',
  詢: '询', 話: '话', 該: '该', 詳: '详', 認: '认', 語: '语', 誦: '诵', 說: '说',
  課: '课', 請: '请', 論: '论', 諮: '咨', 證: '证', 識: '识', 譯: '译', 議: '议',
  讀: '读', 資: '资', 軀: '躯', 較: '较', 載: '载', 輯: '辑', 輸: '输', 辭: '辞',
  這: '这', 連: '连', 進: '进', 運: '运', 過: '过', 達: '达', 適: '适', 選: '选',
  醫: '医', 針: '针', 鈕: '钮', 錄: '录', 錯: '错', 鍵: '键', 鏡: '镜', 閉: '闭',
  開: '开', 間: '间', 關: '关', 陣: '阵', 陰: '阴', 陽: '阳', 階: '阶', 際: '际',
  隨: '随', 雙: '双', 離: '离', 難: '难', 雲: '云', 靈: '灵', 鞏: '巩', 頁: '页',
  項: '项', 順: '顺', 領: '领', 頭: '头', 頸: '颈', 題: '题', 類: '类', 顯: '显',
  飲: '饮', 餘: '余', 驗: '验', 體: '体', 麼: '么', 點: '点',
};

/** Convert one interface string. Unmapped characters are shared forms. */
export function toHans(zh: string): string {
  let out = '';
  for (const ch of zh) out += T2S[ch] ?? ch;
  return out;
}

/** Exported for the coverage test, which is what keeps this table honest. */
export const T2S_TABLE = T2S;

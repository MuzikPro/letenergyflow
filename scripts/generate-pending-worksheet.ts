/**
 * Generates a BLANK editorial worksheet for a curriculum day that is not yet
 * loaded into the dataset, in the same format as the loaded-day worksheet.
 *
 * Only canonical codes, 繁體 point names and pinyin are pre-filled — these are
 * long-circulating public-domain identifiers. Everything the owner must supply
 * (locations, classifications, cues, English renderings) is left blank on
 * purpose: nothing here is invented.
 *
 * Run: npx vite-node scripts/generate-pending-worksheet.ts [--day3]
 * Output: ../content-review/worksheet-day<N>-blank.md
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

const FILL = '＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿＿';

interface PendingMeridian {
  code: string;
  nameZh: string;
  nameEnHint: string;
  pinyin: string;
  count: number;
  pairHint: string;
  points: [number, string, string][]; // ordinal, 繁體 name, pinyin
}

const DAY4: PendingMeridian[] = [
  {
    code: 'SI',
    nameZh: '手太陽小腸經',
    nameEnHint: 'Small Intestine meridian (Hand Taiyang)',
    pinyin: 'shou tai yang xiao chang jing',
    count: 19,
    pairHint: '手少陰心經（HT，已載入）— 請確認',
    points: [
      [1, '少澤', 'shao ze'], [2, '前谷', 'qian gu'], [3, '後溪', 'hou xi'],
      [4, '腕骨', 'wan gu'], [5, '陽谷', 'yang gu'], [6, '養老', 'yang lao'],
      [7, '支正', 'zhi zheng'], [8, '小海', 'xiao hai'], [9, '肩貞', 'jian zhen'],
      [10, '臑俞', 'nao shu'], [11, '天宗', 'tian zong'], [12, '秉風', 'bing feng'],
      [13, '曲垣', 'qu yuan'], [14, '肩外俞', 'jian wai shu'], [15, '肩中俞', 'jian zhong shu'],
      [16, '天窗', 'tian chuang'], [17, '天容', 'tian rong'], [18, '顴髎', 'quan liao'],
      [19, '聽宮', 'ting gong'],
    ],
  },
  {
    code: 'BL',
    nameZh: '足太陽膀胱經',
    nameEnHint: 'Bladder meridian (Foot Taiyang)',
    pinyin: 'zu tai yang pang guang jing',
    count: 67,
    pairHint: '足少陰腎經（KI，尚未載入）',
    points: [
      [1, '睛明', 'jing ming'], [2, '攢竹', 'cuan zhu'], [3, '眉衝', 'mei chong'],
      [4, '曲差', 'qu cha'], [5, '五處', 'wu chu'], [6, '承光', 'cheng guang'],
      [7, '通天', 'tong tian'], [8, '絡卻', 'luo que'], [9, '玉枕', 'yu zhen'],
      [10, '天柱', 'tian zhu'], [11, '大杼', 'da zhu'], [12, '風門', 'feng men'],
      [13, '肺俞', 'fei shu'], [14, '厥陰俞', 'jue yin shu'], [15, '心俞', 'xin shu'],
      [16, '督俞', 'du shu'], [17, '膈俞', 'ge shu'], [18, '肝俞', 'gan shu'],
      [19, '膽俞', 'dan shu'], [20, '脾俞', 'pi shu'], [21, '胃俞', 'wei shu'],
      [22, '三焦俞', 'san jiao shu'], [23, '腎俞', 'shen shu'], [24, '氣海俞', 'qi hai shu'],
      [25, '大腸俞', 'da chang shu'], [26, '關元俞', 'guan yuan shu'], [27, '小腸俞', 'xiao chang shu'],
      [28, '膀胱俞', 'pang guang shu'], [29, '中膂俞', 'zhong lu shu'], [30, '白環俞', 'bai huan shu'],
      [31, '上髎', 'shang liao'], [32, '次髎', 'ci liao'], [33, '中髎', 'zhong liao'],
      [34, '下髎', 'xia liao'], [35, '會陽', 'hui yang'], [36, '承扶', 'cheng fu'],
      [37, '殷門', 'yin men'], [38, '浮郄', 'fu xi'], [39, '委陽', 'wei yang'],
      [40, '委中', 'wei zhong'], [41, '附分', 'fu fen'], [42, '魄戶', 'po hu'],
      [43, '膏肓', 'gao huang'], [44, '神堂', 'shen tang'], [45, '譩譆', 'yi xi'],
      [46, '膈關', 'ge guan'], [47, '魂門', 'hun men'], [48, '陽綱', 'yang gang'],
      [49, '意舍', 'yi she'], [50, '胃倉', 'wei cang'], [51, '肓門', 'huang men'],
      [52, '志室', 'zhi shi'], [53, '胞肓', 'bao huang'], [54, '秩邊', 'zhi bian'],
      [55, '合陽', 'he yang'], [56, '承筋', 'cheng jin'], [57, '承山', 'cheng shan'],
      [58, '飛揚', 'fei yang'], [59, '跗陽', 'fu yang'], [60, '崑崙', 'kun lun'],
      [61, '僕參', 'pu can'], [62, '申脈', 'shen mai'], [63, '金門', 'jin men'],
      [64, '京骨', 'jing gu'], [65, '束骨', 'shu gu'], [66, '足通谷', 'zu tong gu'],
      [67, '至陰', 'zhi yin'],
    ],
  },
];

const DAY3: PendingMeridian[] = [
  {
    code: 'SP',
    nameZh: '足太陰脾經',
    nameEnHint: 'Spleen meridian (Foot Taiyin)',
    pinyin: 'zu tai yin pi jing',
    count: 21,
    pairHint: '足陽明胃經（ST，已載入）— 請確認',
    points: [
      [1, '隱白', 'yin bai'],
      [2, '大都', 'da du'],
      [3, '太白', 'tai bai'],
      [4, '公孫', 'gong sun'],
      [5, '商丘', 'shang qiu'],
      [6, '三陰交', 'san yin jiao'],
      [7, '漏谷', 'lou gu'],
      [8, '地機', 'di ji'],
      [9, '陰陵泉', 'yin ling quan'],
      [10, '血海', 'xue hai'],
      [11, '箕門', 'ji men'],
      [12, '衝門', 'chong men'],
      [13, '府舍', 'fu she'],
      [14, '腹結', 'fu jie'],
      [15, '大橫', 'da heng'],
      [16, '腹哀', 'fu ai'],
      [17, '食竇', 'shi dou'],
      [18, '天溪', 'tian xi'],
      [19, '胸鄉', 'xiong xiang'],
      [20, '周榮', 'zhou rong'],
      [21, '大包', 'da bao'],
    ],
  },
  {
    code: 'HT',
    nameZh: '手少陰心經',
    nameEnHint: 'Heart meridian (Hand Shaoyin)',
    pinyin: 'shou shao yin xin jing',
    count: 9,
    pairHint: '手太陽小腸經（SI，尚未載入）',
    points: [
      [1, '極泉', 'ji quan'],
      [2, '青靈', 'qing ling'],
      [3, '少海', 'shao hai'],
      [4, '靈道', 'ling dao'],
      [5, '通里', 'tong li'],
      [6, '陰郄', 'yin xi'],
      [7, '神門', 'shen men'],
      [8, '少府', 'shao fu'],
      [9, '少衝', 'shao chong'],
    ],
  },
];

/**
 * Curriculum Day 6 — 足少陰腎經.
 *
 * The handbook's Day 5 is the Bladder LEG portion (承扶 → 至陰), which is already
 * loaded: the Day 4 pass took the whole 67-point channel, because a channel's
 * route order and its network line need all its stations at once. So the next
 * sheet the owner can usefully fill is the Kidney channel — which is also the
 * interior–exterior pair the Bladder record is still missing.
 */
const DAY6: PendingMeridian[] = [
  {
    code: 'KI',
    nameZh: '足少陰腎經',
    nameEnHint: 'Kidney meridian (Foot Shaoyin)',
    pinyin: 'zu shao yin shen jing',
    count: 27,
    pairHint: '足太陽膀胱經（BL，已載入，目前配對欄為空）— 請確認',
    points: [
      [1, '湧泉', 'yong quan'], [2, '然谷', 'ran gu'], [3, '太溪', 'tai xi'],
      [4, '大鐘', 'da zhong'], [5, '水泉', 'shui quan'], [6, '照海', 'zhao hai'],
      [7, '復溜', 'fu liu'], [8, '交信', 'jiao xin'], [9, '築賓', 'zhu bin'],
      [10, '陰谷', 'yin gu'], [11, '橫骨', 'heng gu'], [12, '大赫', 'da he'],
      [13, '氣穴', 'qi xue'], [14, '四滿', 'si man'], [15, '中注', 'zhong zhu'],
      [16, '肓俞', 'huang shu'], [17, '商曲', 'shang qu'], [18, '石關', 'shi guan'],
      [19, '陰都', 'yin du'], [20, '腹通谷', 'fu tong gu'], [21, '幽門', 'you men'],
      [22, '步廊', 'bu lang'], [23, '神封', 'shen feng'], [24, '靈墟', 'ling xu'],
      [25, '神藏', 'shen cang'], [26, '彧中', 'yu zhong'], [27, '俞府', 'shu fu'],
    ],
  },
];

/**
 * Curriculum Day 7 — 手厥陰心包經 and 手少陽三焦經.
 *
 * Both run the MIDLINE of the arm, between lines already loaded: PC between the
 * Lung (antero-radial) and Heart (postero-medial) on the inner surface, TE
 * between the Large Intestine (radial) and Small Intestine (ulnar) on the
 * outer. The sheet asks for enough precision to separate them.
 */
const DAY7: PendingMeridian[] = [
  {
    code: 'PC',
    nameZh: '手厥陰心包經',
    nameEnHint: 'Pericardium meridian (Hand Jueyin)',
    pinyin: 'shou jue yin xin bao jing',
    count: 9,
    pairHint: '手少陽三焦經（TE，本表同時收錄）— 請確認',
    points: [
      [1, '天池', 'tian chi'], [2, '天泉', 'tian quan'], [3, '曲澤', 'qu ze'],
      [4, '郄門', 'xi men'], [5, '間使', 'jian shi'], [6, '內關', 'nei guan'],
      [7, '大陵', 'da ling'], [8, '勞宮', 'lao gong'], [9, '中衝', 'zhong chong'],
    ],
  },
  {
    code: 'TE',
    nameZh: '手少陽三焦經',
    nameEnHint: 'Triple Energizer meridian (Hand Shaoyang)',
    pinyin: 'shou shao yang san jiao jing',
    count: 23,
    pairHint: '手厥陰心包經（PC，本表同時收錄）— 請確認',
    points: [
      [1, '關衝', 'guan chong'], [2, '液門', 'ye men'], [3, '中渚', 'zhong zhu'],
      [4, '陽池', 'yang chi'], [5, '外關', 'wai guan'], [6, '支溝', 'zhi gou'],
      [7, '會宗', 'hui zong'], [8, '三陽絡', 'san yang luo'], [9, '四瀆', 'si du'],
      [10, '天井', 'tian jing'], [11, '清冷淵', 'qing leng yuan'], [12, '消濼', 'xiao luo'],
      [13, '臑會', 'nao hui'], [14, '肩髎', 'jian liao'], [15, '天髎', 'tian liao'],
      [16, '天牖', 'tian you'], [17, '翳風', 'yi feng'], [18, '瘈脈', 'chi mai'],
      [19, '顱息', 'lu xi'], [20, '角孫', 'jiao sun'], [21, '耳門', 'er men'],
      [22, '耳和髎', 'er he liao'], [23, '絲竹空', 'si zhu kong'],
    ],
  },
];

/**
 * Curriculum Day 8 — 足少陽膽經.
 *
 * The longest single-channel sheet so far, and the most head-heavy: GB1–GB20 is
 * twenty of the forty-four, all on the temple, behind the ear and the scalp.
 * Its pair 足厥陰肝經 (LR) is the last of the twelve and is not loaded yet.
 */
const DAY8: PendingMeridian[] = [
  {
    code: 'GB',
    nameZh: '足少陽膽經',
    nameEnHint: 'Gallbladder meridian (Foot Shaoyang)',
    pinyin: 'zu shao yang dan jing',
    count: 44,
    pairHint: '足厥陰肝經（LR，尚未載入）',
    points: [
      [1, '瞳子髎', 'tong zi liao'], [2, '聽會', 'ting hui'], [3, '上關', 'shang guan'],
      [4, '頷厭', 'han yan'], [5, '懸顱', 'xuan lu'], [6, '懸釐', 'xuan li'],
      [7, '曲鬢', 'qu bin'], [8, '率谷', 'shuai gu'], [9, '天衝', 'tian chong'],
      [10, '浮白', 'fu bai'], [11, '頭竅陰', 'tou qiao yin'], [12, '完骨', 'wan gu'],
      [13, '本神', 'ben shen'], [14, '陽白', 'yang bai'], [15, '頭臨泣', 'tou lin qi'],
      [16, '目窗', 'mu chuang'], [17, '正營', 'zheng ying'], [18, '承靈', 'cheng ling'],
      [19, '腦空', 'nao kong'], [20, '風池', 'feng chi'], [21, '肩井', 'jian jing'],
      [22, '淵腋', 'yuan ye'], [23, '輒筋', 'zhe jin'], [24, '日月', 'ri yue'],
      [25, '京門', 'jing men'], [26, '帶脈', 'dai mai'], [27, '五樞', 'wu shu'],
      [28, '維道', 'wei dao'], [29, '居髎', 'ju liao'], [30, '環跳', 'huan tiao'],
      [31, '風市', 'feng shi'], [32, '中瀆', 'zhong du'], [33, '膝陽關', 'xi yang guan'],
      [34, '陽陵泉', 'yang ling quan'], [35, '陽交', 'yang jiao'], [36, '外丘', 'wai qiu'],
      [37, '光明', 'guang ming'], [38, '陽輔', 'yang fu'], [39, '懸鐘', 'xuan zhong'],
      [40, '丘墟', 'qiu xu'], [41, '足臨泣', 'zu lin qi'], [42, '地五會', 'di wu hui'],
      [43, '俠溪', 'xia xi'], [44, '足竅陰', 'zu qiao yin'],
    ],
  },
];

/**
 * Curriculum Day 9 — 足厥陰肝經, the last of the twelve regular channels.
 *
 * Loading it closes two things: the Gallbladder's interior–exterior pairing,
 * which has been null since Day 8, and the channel-flow cycle itself — 期門
 * LR14 hands back to 中府 LU1, where Day 1 began.
 */
const DAY9: PendingMeridian[] = [
  {
    code: 'LR',
    nameZh: '足厥陰肝經',
    nameEnHint: 'Liver meridian (Foot Jueyin)',
    pinyin: 'zu jue yin gan jing',
    pairHint: '足少陽膽經（GB，已載入，目前配對欄為空）— 請確認',
    count: 14,
    points: [
      [1, '大敦', 'da dun'], [2, '行間', 'xing jian'], [3, '太衝', 'tai chong'],
      [4, '中封', 'zhong feng'], [5, '蠡溝', 'li gou'], [6, '中都', 'zhong du'],
      [7, '膝關', 'xi guan'], [8, '曲泉', 'qu quan'], [9, '陰包', 'yin bao'],
      [10, '足五里', 'zu wu li'], [11, '陰廉', 'yin lian'], [12, '急脈', 'ji mai'],
      [13, '章門', 'zhang men'], [14, '期門', 'qi men'],
    ],
  },
];

/**
 * Curriculum Day 10 — 任脈 and 督脈, the two midline vessels.
 *
 * Structurally unlike the twelve: they have no left/right, no interior–exterior
 * pair, and no five-shu points. They are the reference lines the paired
 * channels are already measured FROM — every 旁開 N 寸 in the dataset counts
 * outward from one of these two.
 */
const DAY10: PendingMeridian[] = [
  {
    code: 'CV',
    nameZh: '任脈',
    nameEnHint: 'Conception Vessel (Ren Mai)',
    pinyin: 'ren mai',
    pairHint: '無表裡經（奇經，不成對）— 請確認',
    count: 24,
    points: [
      [1, '會陰', 'hui yin'], [2, '曲骨', 'qu gu'], [3, '中極', 'zhong ji'],
      [4, '關元', 'guan yuan'], [5, '石門', 'shi men'], [6, '氣海', 'qi hai'],
      [7, '陰交', 'yin jiao'], [8, '神闕', 'shen que'], [9, '水分', 'shui fen'],
      [10, '下脘', 'xia wan'], [11, '建里', 'jian li'], [12, '中脘', 'zhong wan'],
      [13, '上脘', 'shang wan'], [14, '巨闕', 'ju que'], [15, '鳩尾', 'jiu wei'],
      [16, '中庭', 'zhong ting'], [17, '膻中', 'dan zhong'], [18, '玉堂', 'yu tang'],
      [19, '紫宮', 'zi gong'], [20, '華蓋', 'hua gai'], [21, '璇璣', 'xuan ji'],
      [22, '天突', 'tian tu'], [23, '廉泉', 'lian quan'], [24, '承漿', 'cheng jiang'],
    ],
  },
  {
    code: 'GV',
    nameZh: '督脈',
    nameEnHint: 'Governor Vessel (Du Mai)',
    pinyin: 'du mai',
    pairHint: '無表裡經（奇經，不成對）— 請確認',
    count: 29,
    points: [
      [1, '長強', 'chang qiang'], [2, '腰俞', 'yao shu'], [3, '腰陽關', 'yao yang guan'],
      [4, '命門', 'ming men'], [5, '懸樞', 'xuan shu'], [6, '脊中', 'ji zhong'],
      [7, '中樞', 'zhong shu'], [8, '筋縮', 'jin suo'], [9, '至陽', 'zhi yang'],
      [10, '靈台', 'ling tai'], [11, '神道', 'shen dao'], [12, '身柱', 'shen zhu'],
      [13, '陶道', 'tao dao'], [14, '大椎', 'da zhui'], [15, '啞門', 'ya men'],
      [16, '風府', 'feng fu'], [17, '腦戶', 'nao hu'], [18, '強間', 'qiang jian'],
      [19, '後頂', 'hou ding'], [20, '百會', 'bai hui'], [21, '前頂', 'qian ding'],
      [22, '顖會', 'xin hui'], [23, '上星', 'shang xing'], [24, '神庭', 'shen ting'],
      [25, '素髎', 'su liao'], [26, '水溝', 'shui gou'], [27, '兌端', 'dui duan'],
      [28, '齦交', 'yin jiao'], [29, '印堂', 'yin tang'],
    ],
  },
];

const BY_FLAG: Record<string, { day: number; meridians: PendingMeridian[] }> = {
  '--day3': { day: 3, meridians: DAY3 },
  '--day4': { day: 4, meridians: DAY4 },
  '--day6': { day: 6, meridians: DAY6 },
  '--day7': { day: 7, meridians: DAY7 },
  '--day8': { day: 8, meridians: DAY8 },
  '--day9': { day: 9, meridians: DAY9 },
  '--day10': { day: 10, meridians: DAY10 },
};
const picked = process.argv.map((a) => BY_FLAG[a]).find(Boolean) ?? BY_FLAG['--day4']!;
const DAY = picked.meridians;
const DAY_NO = picked.day;

const out: string[] = [];
out.push(`# 第 ${DAY_NO} 天 內容編審工作表 · Day ${DAY_NO} content review worksheet（空白版 blank）`);
out.push('');
if (DAY_NO === 4) {
  out.push('> 手太陽小腸經（SI, 19 穴）與 足太陽膀胱經（BL, 67 穴）— 共 86 穴');
  out.push('> Small Intestine (19) and Bladder (67) meridians — 86 points, not yet loaded.');
  out.push('>');
  out.push('> **課程分兩天教，但資料一次載入整條經。** 手冊第 4 天主攻背俞穴（BL11–BL30 一帶），');
  out.push('> 第 5 天才走腿後側（承扶→至陰）。經絡是一個整體，循行順序與網絡圖需要完整的 67 穴，');
  out.push('> 所以本表一次收完；App 的「第 4 天」課程仍只聚焦背俞穴。');
  out.push('> The handbook teaches BL over two days, but a channel is one unit — the route order and');
  out.push('> the network map need all 67 stations, so this sheet collects them at once. The Day 4');
  out.push('> lesson in the app will still focus on the back-shu group.');
} else if (DAY_NO === 10) {
  out.push('> 任脈（CV, 24 穴）與 督脈（GV, 29 穴）— 共 53 穴');
  out.push('> Conception (24) and Governor (29) vessels — 53 points, not yet loaded.');
  out.push('>');
  out.push('> **這兩條和前面十二條不一樣。** 它們沒有左右之分（走正中線）、沒有表裡配對、');
  out.push('> 也沒有五輸穴。更要緊的是：資料庫裡每一個「前正中線旁開 N 寸」「後正中線旁開');
  out.push('> N 寸」都是從這兩條線量出去的——它們是既有 295 個穴位的定位基準。');
  out.push('> These two are structurally unlike the twelve: no left/right (they run the');
  out.push('> midline), no interior–exterior pair, no five-shu points. More importantly, every');
  out.push('> "N cun lateral to the anterior/posterior midline" already in the dataset is');
  out.push('> measured FROM one of these lines — they are the reference the other 295 points');
  out.push('> are placed against.');
  out.push('>');
  out.push('> **督脈穴數請確認。** WHO 1989 與多數傳統教材作 28 穴；GB/T 12346-2006 增列');
  out.push('> 印堂為 GV29，故本表預填 29。若你採 28 穴版本，請刪去 GV29 一節並修正穴數。');
  out.push('> 另注意：現行標準的 GV23 是「上星」，印堂是 GV29——若手邊資料把印堂寫成 DU23，');
  out.push('> 那是舊編號。');
  out.push('> Governor count: WHO 1989 and most textbooks give 28; GB/T 12346-2006 adds 印堂');
  out.push('> as GV29, so this sheet pre-fills 29. Delete that entry and correct the count if');
  out.push('> you prefer the 28-point set. Note also that under current numbering GV23 is');
  out.push('> 上星 and 印堂 is GV29 — a source calling 印堂 "DU23" is using the older scheme.');
} else if (DAY_NO === 9) {
  out.push('> 足厥陰肝經（LR, 14 穴）');
  out.push('> Liver meridian — 14 points, not yet loaded. The LAST of the twelve regular channels.');
  out.push('>');
  out.push('> **這一條填完，十二正經就滿了。** 它同時關上兩個缺口：膽經（GB）自第 8 天起');
  out.push('> 配對欄一直是空的，肝經就是它的表裡經；而流注次序也在此接回起點——期門（LR14）');
  out.push('> 傳往中府（LU1），正是第 1 天的第一穴。');
  out.push('> Filling this completes the twelve regular channels. It closes two gaps at once:');
  out.push('> the Gallbladder\'s interior–exterior pairing, null since Day 8, and the flow cycle');
  out.push('> itself — 期門 LR14 hands back to 中府 LU1, where Day 1 began.');
} else if (DAY_NO === 8) {
  out.push('> 足少陽膽經（GB, 44 穴）');
  out.push('> Gallbladder meridian — 44 points, not yet loaded.');
  out.push('>');
  out.push('> **這是目前最長的單經表，也是頭部最密的一條**：GB1–GB20 共 20 穴全在頭側、耳後與');
  out.push('> 髮際一帶，佔了全經將近一半。手冊第 8 天叫它「側線部隊」——身體兩側，從頭到腳，');
  out.push('> 像褲線。');
  out.push('> This is the longest single-channel sheet yet and the most head-heavy: GB1–GB20 —');
  out.push('> twenty of the forty-four — sit on the temple, behind the ear and along the');
  out.push('> hairline.');
  out.push('>');
  out.push('> **表裡經**：足厥陰肝經（LR）尚未載入，配對欄會先留空，等第 9 天補上。');
  out.push('> Its pair 足厥陰肝經 (LR) is not loaded yet; the pairing field will stay null');
  out.push('> until Day 9.');
} else if (DAY_NO === 7) {
  out.push('> 手厥陰心包經（PC, 9 穴）與 手少陽三焦經（TE, 23 穴）— 共 32 穴');
  out.push('> Pericardium (9) and Triple Energizer (23) meridians — 32 points, not yet loaded.');
  out.push('>');
  out.push('> **這兩條都走手臂的「中線」**，夾在已載入的四條之間：心包經在上肢內側中線，');
  out.push('> 兩側是肺經（內側前緣）與心經（內側後緣）；三焦經在上肢外側中線，兩側是');
  out.push('> 大腸經（外側前緣）與小腸經（外側後緣）。定位請寫到足以和鄰線區分的程度');
  out.push('> （例如「兩筋之間」是哪兩條筋、距離腕橫紋幾寸）。');
  out.push('> Both run the MIDLINE of the arm, between four channels already loaded: PC on the');
  out.push('> inner midline with Lung in front of it and Heart behind; TE on the outer midline');
  out.push('> with Large Intestine in front and Small Intestine behind. Please locate them');
  out.push('> precisely enough to separate them from their neighbours — which two tendons, and');
  out.push('> how far from which crease.');
  out.push('>');
  out.push('> **代號 TE**：本專案採 WHO／GB 的 TE（Triple Energizer）。若你慣用 SJ／TB／TW，');
  out.push('> 請在「英文名」欄註明，會一併收為別名。');
  out.push('> This project uses the WHO/GB code TE. If you prefer SJ, TB or TW, note it and it');
  out.push('> will be carried as an alias.');
} else if (DAY_NO === 6) {
  out.push('> 足少陰腎經（KI, 27 穴）');
  out.push('> Kidney meridian — 27 points, not yet loaded.');
  out.push('>');
  out.push('> **手冊第 5 天是膀胱經的腿部段（承扶→至陰），那 67 穴已在第 4 天一次載入完畢**，');
  out.push('> 所以第 5 天不需要新的內容編審表；App 的第 5 天課程直接用既有資料寫。');
  out.push('> 下一個需要你填的是腎經 —— 它同時是膀胱經目前空著的表裡配對。');
  out.push('> The handbook\'s Day 5 covers the Bladder leg segment; those 67 points were loaded in');
  out.push('> one pass on Day 4, so Day 5 needs no new sheet. Kidney is the next channel that does —');
  out.push('> and it is the interior–exterior pair the Bladder record is still missing.');
} else {
  out.push('> 足太陰脾經（SP, 21 穴）與 手少陰心經（HT, 9 穴）— 共 30 穴');
  out.push('> Spleen (21) and Heart (9) meridians — 30 points, not yet loaded into the app.');
}
out.push(`> 產生日期 Generated ${new Date().toISOString().slice(0, 10)}`);
out.push('> 產生指令 Regenerate: `cd app && npx vite-node scripts/generate-pending-worksheet.ts`');
out.push('');
out.push('## 填寫規則 Rules');
out.push('');
out.push('1. **只填你能給出出處的內容。** 每個修正請註明來源（標準、教科書、典籍）。');
out.push('   Only fill in what you can source; note the reference beside each entry.');
out.push('2. **不確定就留空。** 空白比錯誤安全；未填的欄位會在 App 中顯示為「尚未記錄」，不會以推測填補。');
out.push('   Leave blanks when unsure — unfilled fields render as "not recorded", never guessed.');
out.push('3. **請勿填寫臨床內容。** 針刺深度角度、禁針禁灸、放血、艾灸、症狀配穴、急救用語一律不會被收錄，');
out.push('   填了也會在匯入時被過濾掉。本工作表只收：名稱、代號、體表定位、特定穴分類、記憶聯想。');
out.push('   Do NOT fill in clinical content (needling depth/angle, contraindications, moxibustion,');
out.push('   bloodletting, symptom-to-point pairings, first-aid). It is filtered out on import.');
out.push('   This worksheet collects only: names, codes, surface locations, categories, memory hooks.');
out.push('4. 此工作表是教學內容編審用，不是臨床定位依據。');
out.push('   For editorial review of teaching content — not a clinical point-location reference.');
out.push('');
out.push('## 預先填入的內容 What is pre-filled');
out.push('');
out.push('- 只有**代號、繁體穴名、拼音**是預先填入的（長期流通的公版識別資訊）。');
out.push('- 英文譯名、定位、特定穴分類、記憶提示**全部空白**，等你填。');
out.push('- Only codes, 繁體 names and pinyin are pre-filled. English renderings, locations,');
out.push('  classifications and memory cues are all left blank for you.');
out.push('');

for (const m of DAY) {
  out.push('---');
  out.push('');
  out.push(`## ${m.code} ${m.nameZh} · ${m.nameEnHint}`);
  out.push('');
  out.push('**經絡層級 Meridian-level items:**');
  out.push('');
  out.push(`- 英文名 English name（建議 suggested，請確認）：\`${m.nameEnHint}\` — 確認／修正：${FILL}`);
  out.push(`- 拼音 Pinyin：\`${m.pinyin}\` — [ ] 正確　／　修正：${FILL}`);
  out.push(`- 總穴數 Catalogue count：${m.count} — [ ] 正確　／　修正：${FILL}`);
  out.push(`- 循行描述 Route（中文，請填）：${FILL}`);
  out.push(`  - 出處 Source：${FILL}`);
  out.push(`- 表裡經 Interior–exterior pair：${m.pairHint} — 確認：${FILL}`);
  out.push(`- 五行 Element：${FILL}`);
  if (m.code === 'CV') {
    out.push('');
    out.push('> **腹部請以臍中起算，胸部請以肋間隙或胸骨上窩起算。** 這兩把尺已經在 App 裡：');
    out.push('> 臍中上 8 寸到胸劍聯合、臍中下 5 寸到恥骨聯合上緣、胸骨上窩至胸劍聯合 9 寸。');
    out.push('> 請照原文寫「臍中上／下 N 寸」或「第 N 肋間隙」，不要換算成別的單位。');
    out.push('> For the abdomen measure from the umbilicus and for the chest from the');
    out.push('> intercostal spaces or the sternal notch. Those rulers are already in the app.');
    out.push('> Please write "N cun above/below the umbilicus" or "the Nth intercostal space"');
    out.push('> verbatim rather than converting to another unit.');
    out.push('>');
    out.push('> **好幾個任脈穴已經被別的穴引用了**：關元、石門、水分、建里、中脘、巨闕、中庭、');
    out.push('> 膻中、玉堂、紫宮、華蓋、璇璣、天突都出現在已載入的腎經、胃經或膽經定位文字裡。');
    out.push('> 請把它們寫準——它們是別條經的定位基準。');
    out.push('> Many Conception points are already CITED by loaded records — 關元, 石門, 水分,');
    out.push('> 建里, 中脘, 巨闕, 中庭, 膻中, 玉堂, 紫宮, 華蓋, 璇璣 and 天突 all appear in the');
    out.push('> reviewed locations of Kidney, Stomach or Gallbladder points. Please locate them');
    out.push('> precisely; they are reference landmarks for other channels.');
    out.push('>');
    out.push('> **募穴**：任脈上有數個臟腑募穴（如中極＝膀胱募、關元＝小腸募、石門＝三焦募、');
    out.push('> 中脘＝胃募兼腑會、巨闕＝心募、膻中＝心包募兼氣會）。請照實填並註明是哪一腑臟');
    out.push('> 的募穴——和第 8 天京門（腎募在膽經上）一樣，App 會分別標註。');
    out.push('> Several front-mu points sit on this vessel (中極 bladder, 關元 small intestine,');
    out.push('> 石門 triple energizer, 中脘 stomach and the influential point for the fu, 巨闕');
    out.push('> heart, 膻中 pericardium and the influential point for qi). Please name the organ');
    out.push('> for each, exactly as with 京門 on Day 8.');
    out.push('>');
    out.push('> **視圖 View**：任脈全程在正中線前面，請填 front。會陰（CV1）在會陰部，');
    out.push('> 若不便標示請留空並在備註說明，App 不會自行猜測位置。');
    out.push('> The Conception vessel runs the anterior midline throughout, so View is front.');
    out.push('> If 會陰 CV1 is not appropriate to place on a general-audience figure, leave its');
    out.push('> location blank and say so in the notes — nothing is guessed on import.');
  }
  if (m.code === 'GV') {
    out.push('');
    out.push('> **請以椎骨棘突定位**，與第 4 天的背俞穴同一套系統：「第 N 胸／腰椎棘突下」。');
    out.push('> App 已經有這把椎骨尺（T1–T12、L1–L5、S1–S4），寫清楚節段就能對上。');
    out.push('> 頭部請以百會、前後髮際、枕外隆凸等地標描述。');
    out.push('> Locate by spinous process — the same system the Day 4 back-shu points use:');
    out.push('> "below the spinous process of T{n} / L{n}". The app already holds that vertebral');
    out.push('> ladder. For the head, use 百會, the hairlines and the occipital protuberance.');
    out.push('>');
    out.push('> **大椎（GV14）、風府（GV16）、神庭（GV24）、腦戶（GV17）已被引用**：肩井');
    out.push('> （GB21）、風池（GB20）、本神（GB13）、頭臨泣（GB15）、腦空（GB19）的定位都拿');
    out.push('> 它們當基準。請優先寫準這幾個。');
    out.push('> 大椎 GV14, 風府 GV16, 神庭 GV24 and 腦戶 GV17 are already CITED — 肩井 GB21,');
    out.push('> 風池 GB20, 本神 GB13, 頭臨泣 GB15 and 腦空 GB19 are all located against them.');
    out.push('> Please get those four right first.');
    out.push('>');
    out.push('> **視圖 View**：GV1–GV20 一帶在背面，請填 back；GV21 以後轉到頭頂與面部，');
    out.push('> 請依實際填 front／back。齦交（GV28）在上唇繫帶處，屬口腔內，若不便標示請留空。');
    out.push('> GV1–GV20 sit on the back; from GV21 the vessel crosses the vertex to the face.');
    out.push('> Fill front/back per point. 齦交 GV28 is inside the upper lip — leave it blank if');
    out.push('> it cannot sensibly be shown, and say so in the notes.');
  }
  if (m.code === 'LR') {
    out.push('');
    out.push('> **下肢段請以內踝尖起算**，與脾經、腎經同一套 13 寸（脛骨內側髁下方至內踝尖）。');
    out.push('> 蠡溝（內踝尖上 5 寸）、中都（上 7 寸）請照寫；太衝在第 1、2 蹠骨間，是肝經原穴。');
    out.push('> Below the knee, measure from the tip of the medial malleolus — the same 13-cun');
    out.push('> segment the Spleen and Kidney channels use. 蠡溝 sits 5 cun above it and 中都 at');
    out.push('> 7; 太衝 LR3, the yuan-source, lies between the 1st and 2nd metatarsals.');
    out.push('>');
    out.push('> **章門（LR13）與期門（LR14）已經被別的穴引用了。** 已載入的京門（GB25）定位寫');
    out.push('> 「章門後 1.8 寸」、帶脈（GB26）寫「章門下 1.8 寸」，都指向 LR13；日月（GB24）');
    out.push('> 也提到期門。請把這兩穴的定位寫得夠精確，它們現在是別條經的定位基準。');
    out.push('> 章門 LR13 and 期門 LR14 are already CITED by loaded points: 京門 GB25 is located');
    out.push('> "1.8 cun behind 章門" and 帶脈 GB26 "1.8 cun below" it, and 日月 GB24 references');
    out.push('> 期門. Please locate those two precisely — they are now reference landmarks for');
    out.push('> another channel.');
    out.push('>');
    out.push('> **募穴請留意歸屬。** 期門是「肝」自己的募穴；章門卻是「脾」的募穴，同時是');
    out.push('> 八會穴的臟會——它長在肝經上，但不屬肝。這和第 8 天的京門（腎募長在膽經上）');
    out.push('> 是同一種情況，請照實填，App 會分別標註。');
    out.push('> Watch the front-mu attributions: 期門 is the LIVER\'s own, but 章門 is the');
    out.push('> SPLEEN\'s — and also the influential point for the zang organs. It sits on the');
    out.push('> Liver channel without belonging to that organ, exactly as 京門 GB25 did on the');
    out.push('> Gallbladder. Please record it as stated; the app labels the two separately.');
    out.push('>');
    out.push('> **視圖 View**：肝經走下肢內側與側腹，請照常填 front／back。');
    out.push('> The channel runs the medial leg and the flank; fill front/back as usual.');
    out.push('>');
    out.push('> **拼音撞號提醒**（正常，不需修改）：');
    out.push('> - 中都 LR6（zhong du）與已載入的 中瀆 GB32（zhong du）拼音完全相同；');
    out.push('> - 足五里 LR10 與 手五里 LI13、膝關 LR7 與 膝陽關 GB33、太衝 LR3 與 天衝 GB9');
    out.push('>   為近音或同名的手／足、部位對。');
    out.push('> Collisions, all expected: 中都 LR6 shares the exact pinyin "zhong du" with the');
    out.push('> loaded 中瀆 GB32; 足五里/手五里, 膝關/膝陽關 and 太衝/天衝 are near-name pairs.');
  }
  if (m.code === 'GB') {
    out.push('');
    out.push('> **頭部（GB1–GB20）：有寸數的請寫寸數，沒有的請寫地標。** 頭部骨度分寸是');
    out.push('> 「前髮際至後髮際 12 寸」與「兩額角（頭維）之間 9 寸」；陽白（眉上 1 寸）、');
    out.push('> 本神與頭臨泣（前髮際上 0.5 寸，旁開各若干寸）這類請照寫。其餘如瞳子髎、聽會、');
    out.push('> 完骨、風池，請用目外眥、耳屏、乳突、枕骨下緣等體表地標描述——沒有寸數可量時，');
    out.push('> 地標就是定位本身。');
    out.push('> For GB1–GB20: give the cun where the standard gives one (陽白 1 cun above the');
    out.push('> brow; 本神 and 頭臨泣 0.5 cun inside the front hairline, each a stated distance');
    out.push('> lateral), and the landmark where it does not — outer canthus, tragus, mastoid,');
    out.push('> the lower border of the occiput. The head scales are 12 cun front-to-back');
    out.push('> hairline and 9 cun between the two 頭維.');
    out.push('>');
    out.push('> **軀幹側線（GB22–GB30）**：請寫出腋中線、第 11／12 肋游離端、髂前上棘、');
    out.push('> 股骨大轉子這些地標。環跳（GB30）的定位是「股骨大轉子最高點與骶管裂孔連線的');
    out.push('> 外 1/3 與內 2/3 交點」——這是比例規則而不是寸數，請照原文寫，App 會照比例放。');
    out.push('> For the flank and hip, please name the mid-axillary line, the free ends of ribs');
    out.push('> 11 and 12, the ASIS and the greater trochanter. 環跳 GB30 is a PROPORTION, not');
    out.push('> a cun measure — the junction of the outer third and inner two-thirds of the line');
    out.push('> from the trochanter to the sacral hiatus. Please write it as stated; the app');
    out.push('> places it by that ratio.');
    out.push('>');
    out.push('> **下肢外側（GB31–GB44）**：請以膕橫紋與外踝尖起算，與膀胱經同一套 16 寸。');
    out.push('> 陽陵泉（GB34）以腓骨小頭前下方為準；懸鐘（GB39，別名絕骨）外踝尖上 3 寸。');
    out.push('> 八會穴請一併註明：陽陵泉為筋會，懸鐘為髓會。');
    out.push('> Below the knee, measure from the popliteal crease and the tip of the lateral');
    out.push('> malleolus — the same 16-cun segment the Bladder channel uses. 陽陵泉 GB34 is');
    out.push('> anchored on the head of the fibula; 懸鐘 GB39 (alias 絕骨) sits 3 cun above the');
    out.push('> malleolus. Please note the two influential points: GB34 for sinew, GB39 for');
    out.push('> marrow.');
    out.push('>');
    out.push('> **視圖 View**：膽經是真正的「側線」，而本 App 的人形只有前、後兩個視圖，沒有');
    out.push('> 側視圖。請照常填 front／back（以較接近的那一面為準），匯入時側面點會投影到該');
    out.push('> 視圖上，並在座標備註記錄這是投影而非真實側面。');
    out.push('> The Gallbladder is a genuinely LATERAL channel, but the figure has only front and');
    out.push('> back views. Please still fill front/back with whichever face is nearer; lateral');
    out.push('> points are projected onto that view and the placement note records that it is a');
    out.push('> projection, not a true side view.');
    out.push('>');
    out.push('> **拼音／名稱撞號提醒**（都屬正常，不需修改）：');
    out.push('> - 完骨 GB12（wan gu）與已載入的 腕骨 SI4（wan gu）拼音完全相同；');
    out.push('> - 頭臨泣 GB15 與 足臨泣 GB41、頭竅陰 GB11 與 足竅陰 GB44 為同名的頭／足對；');
    out.push('> - 近音：上關 GB3 與 下關 ST7、聽會 GB2 與 聽宮 SI19、京門 GB25 與 京骨 BL64、');
    out.push('>   中瀆 GB32 與 中渚 TE3／中注 KI15。');
    out.push('> Name collisions, all expected: 完骨 GB12 shares the exact pinyin "wan gu" with');
    out.push('> the loaded 腕骨 SI4; GB15/GB41 and GB11/GB44 are head/foot pairs of one name;');
    out.push('> and GB3, GB2, GB25, GB32 sit close to ST7, SI19, BL64 and TE3/KI15 in sound.');
  }
  if (m.code === 'PC') {
    out.push('');
    out.push('> **三個穴壓在橫紋上或以橫紋起算，請務必寫準。** 曲澤在肘橫紋中（肱二頭肌腱');
    out.push('> 尺側），大陵在腕掌側橫紋上（兩筋之間），內關在腕橫紋上 2 寸。App 會把「在橫紋');
    out.push('> 中」當成零距離處理，把「上 N 寸」當成骨度分寸，兩者都直接決定標記位置。');
    out.push('> 郄門、間使、內關、大陵沿同一條線由近而遠，請一併給出各自距腕橫紋的寸數。');
    out.push('> Three of these are measured from a crease and must be exact: 曲澤 lies IN the');
    out.push('> cubital crease, 大陵 ON the palmar wrist crease, 內關 2 cun above it. The app');
    out.push('> treats "in the crease" as zero distance and "N cun above" as bone-cun — both');
    out.push('> place the marker directly. Please give the cun above the wrist crease for');
    out.push('> 郄門, 間使, 內關 and 大陵, which share one line.');
  }
  if (m.code === 'TE') {
    out.push('');
    out.push('> **外關與內關內外相對**，請把兩者的寸數寫成同一套（腕背橫紋上 2 寸 vs 腕掌側');
    out.push('> 橫紋上 2 寸），這組對比是本日課程的主軸。前臂 TE5–TE9 請一律以腕背橫紋起算。');
    out.push('> 頭面段（TE17 翳風到 TE23 絲竹空）請以耳屏、乳突、眉梢等體表地標描述——這一');
    out.push('> 段沒有骨度分寸可用，地標就是唯一依據。');
    out.push('> 外關 mirrors 內關: please state both as N cun above their respective wrist');
    out.push('> creases — that pairing is the spine of this day\'s lesson. Measure TE5–TE9 from');
    out.push('> the dorsal wrist crease throughout. For the head section (TE17 翳風 to TE23');
    out.push('> 絲竹空) describe the tragus, mastoid and brow landmarks: there is no bone-cun');
    out.push('> to measure there, so the landmark IS the location.');
    out.push('>');
    out.push('> **注意拼音撞號**：中渚（TE3, zhong zhu）與已載入的中注（KI15, zhong zhu）');
    out.push('> 同拼音，搜尋時兩者都會出現，這是正常的。');
    out.push('> Note: 中渚 TE3 and the already-loaded 中注 KI15 share the pinyin "zhong zhu";');
    out.push('> both will appear in search results, which is expected.');
  }
  if (m.code === 'KI') {
    out.push('');
    out.push('> **腹部與胸部的關鍵是「旁開幾寸」與「臍中上下幾寸」。** KI11–KI21 走腹部，');
    out.push('> 請在定位中寫出「臍中上／下 N 寸，前正中線旁開 0.5 寸」這類敘述；KI22–KI27 走胸部，');
    out.push('> 請寫出所在肋間隙與旁開寸數。這兩組數字就是 App 用來放標記的依據。');
    out.push('> 小腿段請以「內踝尖上 N 寸」表述，與脾經同一套骨度分寸。');
    out.push('> For KI11–KI21 please state "N cun above/below the umbilicus, 0.5 cun lateral to the');
    out.push('> anterior midline"; for KI22–KI27 the intercostal space and the lateral distance.');
    out.push('> Below the knee, please measure from the tip of the medial malleolus, the same');
    out.push('> bone-cun system the Spleen channel uses. Those numbers ARE how the app places the');
    out.push('> marker — every coordinate is derived from a landmark plus a stated cun distance.');
  }
  if (m.code === 'BL') {
    out.push('');
    out.push('> **背俞穴的關鍵是椎體節段。** BL11–BL30 一帶請務必在定位中寫出「第 N 胸／腰椎棘突下，');
    out.push('> 旁開 1.5 寸」這類敘述——椎體節段就是整組背俞穴的定位系統，缺了它，圖上的標記只是概略位置。');
    out.push('> BL41–BL54 為第二側線（旁開 3 寸），請一併註明。');
    out.push('> For BL11–BL30 the vertebral level IS the locating system: please state it as');
    out.push('> "below the spinous process of T{n}, 1.5 cun lateral". BL41–BL54 sit on the second');
    out.push('> line, 3 cun lateral — please note that too.');
  }
  out.push('');

  for (const [n, zh, py] of m.points) {
    out.push(`### ${m.code}${n}　${zh}（${py}）`);
    out.push('');
    out.push(`- **英文名 English name**：${FILL}`);
    out.push(`- **定位 Location**（中文，並註明出處）：`);
    out.push(`  - 中文：${FILL}`);
    out.push(`  - 出處 Source：${FILL}`);
    out.push(`- **特定穴 Classifications**（五輸／原絡郄募／交會等；無則填「無」）：${FILL}`);
    out.push(`  - 出處 Source：${FILL}`);
    out.push(`- **記憶提示 Cue**（穴名字義或體表地標聯想，非臨床主治）：${FILL}`);
    out.push(`- **課程層級 Tier**（1＝必背／2＝重要／3＝認得就好）：${FILL}`);
    out.push(`- **體表區域 Body region**（如 lower leg、back、scapula）：${FILL}`);
    out.push(
      `- **所在視圖 View**（front／back — 背部穴位請填 back）：${
        m.code === 'BL' && n >= 11 && n <= 54 ? '`back`（預填，請確認）' : FILL
      }`,
    );
    out.push(`- **備註 Notes**：${FILL}`);
    out.push('');
  }
}

out.push('---');
out.push('');
out.push('## 匯入後會發生什麼 What happens on import');
out.push('');
out.push('- 已填欄位 → 狀態標為 `source_checked`，並記錄你的姓名與日期。');
out.push('- 未填欄位 → 維持 `unreviewed` 或顯示「尚未記錄」，不會被猜測填補。');
out.push('- 圖上標記座標仍為 `schematic_unvalidated`（示意排版），需另行實測驗證。');
out.push('- 臨床內容 → 依專案安全規則過濾，不會進入 App，並在出處備註記錄已排除。');
out.push('');
out.push('## 摘要 Summary');
out.push('');
out.push('| 經絡 Meridian | 穴數 Points | 定位已填 | 特定穴 | 記憶提示 |');
out.push('| --- | --- | --- | --- | --- |');
for (const m of DAY) out.push(`| ${m.code} ${m.nameZh} | ${m.count} | ／${m.count} | ／${m.count} | ／${m.count} |`);
const total = DAY.reduce((n, m) => n + m.count, 0);
out.push(`| **合計 Total** | **${total}** | **／${total}** | **／${total}** | **／${total}** |`);
out.push('');

const target = resolve(__dirname, `../../content-review/worksheet-day${DAY_NO}-blank.md`);
mkdirSync(dirname(target), { recursive: true });
writeFileSync(target, out.join('\n'), 'utf8');
console.log(`Wrote ${target} — ${total} points awaiting review.`);

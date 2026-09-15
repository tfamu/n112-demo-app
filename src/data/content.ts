import type { Book, Card, Chapter, Question, Quiz, StudyTrack } from './types'

// ---------------------------------------------------------------------------
// デモ用のダミーデータ。内容は自作で、市販の教材からの引用ではない。
// 各分野に 2 課 × 5 枚のカードと、3 問のクイズを 1 つずつ用意している。
//
// カードの意味・例文訳・解説がベトナム語なのは、このアプリの利用者が
// 「ベトナム語話者の N1 受験者」だから。学習内容そのものなので訳さない。
// ---------------------------------------------------------------------------

export const BOOKS: Book[] = [
  { id: 'bk-grammar', track: 'grammar', title: 'N1 文法 — 文型集（デモ）', sortOrder: 1 },
  { id: 'bk-vocab', track: 'vocab', title: 'N1 語彙 — テーマ別語彙（デモ）', sortOrder: 1 },
  { id: 'bk-kanji', track: 'kanji', title: 'N1 漢字 — 頻出漢字語（デモ）', sortOrder: 1 },
]

export const CHAPTERS: Chapter[] = [
  { id: 'ch-g1', bookId: 'bk-grammar', code: '1課', title: '逆境・無視を表す文型', sortOrder: 1 },
  { id: 'ch-g2', bookId: 'bk-grammar', code: '2課', title: '評価・傾向を表す文型', sortOrder: 2 },
  { id: 'ch-v1', bookId: 'bk-vocab', code: '第1部', title: '状態を表す語', sortOrder: 1 },
  { id: 'ch-v2', bookId: 'bk-vocab', code: '第2部', title: '間違えやすい動詞・形容詞', sortOrder: 2 },
  { id: 'ch-k1', bookId: 'bk-kanji', code: '第1回', title: 'ニュースに出る漢字', sortOrder: 1 },
  { id: 'ch-k2', bookId: 'bk-kanji', code: '第2回', title: 'ビジネス文書の漢字', sortOrder: 2 },
]

export const CARDS: Card[] = [
  // ---- 文法 1課 ----
  {
    id: 'cd-g1-1',
    chapterId: 'ch-g1',
    front: '～をものともせず',
    reading: '～をものともせず',
    hanViet: '',
    back: 'Bất chấp ~, không hề nao núng trước ~',
    examples: [
      { jp: '彼は大けがをものともせず、最後まで走り抜いた。', vi: 'Anh ấy bất chấp vết thương nặng, chạy đến tận đích.' },
      { jp: '悪天候をものともせず、船は出港した。', vi: 'Bất chấp thời tiết xấu, con tàu vẫn rời cảng.' },
    ],
    extra: 'Mang sắc thái khen ngợi.\nKhông dùng cho hành động của chính người nói.',
    sortOrder: 1,
  },
  {
    id: 'cd-g1-2',
    chapterId: 'ch-g1',
    front: '～をよそに',
    reading: '～をよそに',
    hanViet: '',
    back: 'Mặc kệ ~, phớt lờ ~',
    examples: [
      { jp: '住民の不安をよそに、工事は予定通り始まった。', vi: 'Mặc kệ lo lắng của cư dân, công trình vẫn khởi công đúng hẹn.' },
      { jp: '親の心配をよそに、彼は旅に出た。', vi: 'Phớt lờ nỗi lo của bố mẹ, anh ta lên đường.' },
    ],
    extra: 'Khác 「をものともせず」 ở sắc thái: câu này thường mang ý chê trách.',
    sortOrder: 2,
  },
  {
    id: 'cd-g1-3',
    chapterId: 'ch-g1',
    front: '～はおろか',
    reading: '～はおろか',
    hanViet: '',
    back: 'Đừng nói là ~, đến cả ~ cũng không',
    examples: [
      { jp: '彼は漢字はおろか、ひらがなさえ読めない。', vi: 'Đừng nói kanji, đến hiragana anh ta cũng không đọc được.' },
    ],
    extra: 'Vế sau thường đi với 「も」「さえ」「まで」 và mang nghĩa phủ định.',
    sortOrder: 3,
  },
  {
    id: 'cd-g1-4',
    chapterId: 'ch-g1',
    front: '～に難くない',
    reading: '～にかたくない',
    hanViet: '',
    back: 'Không khó để ~ (tưởng tượng, đoán)',
    examples: [
      { jp: '彼女の気持ちは想像に難くない。', vi: 'Không khó để hình dung tâm trạng của cô ấy.' },
    ],
    extra: 'Hầu như chỉ đi với 想像する / 察する.',
    sortOrder: 4,
  },
  {
    id: 'cd-g1-5',
    chapterId: 'ch-g1',
    front: '～ならいざしらず',
    reading: '～ならいざしらず',
    hanViet: '',
    back: 'Nếu là ~ thì còn được, đằng này...',
    examples: [
      { jp: '子供ならいざしらず、大人がそんなことを言うとは。', vi: 'Trẻ con thì còn được, người lớn mà nói vậy thì...' },
    ],
    extra: null,
    sortOrder: 5,
  },

  // ---- 文法 2課 ----
  {
    id: 'cd-g2-1',
    chapterId: 'ch-g2',
    front: '～ずにはおかない',
    reading: '～ずにはおかない',
    hanViet: '',
    back: 'Nhất định sẽ gây ra ~, không thể không ~',
    examples: [
      { jp: 'この映画は見る者を感動させずにはおかない。', vi: 'Bộ phim này nhất định làm người xem xúc động.' },
    ],
    extra: 'Chủ ngữ thường là sự vật, diễn tả tác động tự nhiên xảy ra.',
    sortOrder: 1,
  },
  {
    id: 'cd-g2-2',
    chapterId: 'ch-g2',
    front: '～きらいがある',
    reading: '～きらいがある',
    hanViet: '',
    back: 'Có xu hướng ~ (nghĩa tiêu cực)',
    examples: [
      { jp: '彼は物事を悲観的に考えるきらいがある。', vi: 'Anh ta có xu hướng nghĩ mọi việc theo hướng bi quan.' },
    ],
    extra: 'Chỉ dùng cho khuynh hướng không tốt.',
    sortOrder: 2,
  },
  {
    id: 'cd-g2-3',
    chapterId: 'ch-g2',
    front: '～に足る',
    reading: '～にたる',
    hanViet: '',
    back: 'Đủ để ~, xứng đáng để ~',
    examples: [
      { jp: '彼は信頼するに足る人物だ。', vi: 'Anh ấy là người đáng tin cậy.' },
    ],
    extra: 'Phủ định: 「～に足りない」.',
    sortOrder: 3,
  },
  {
    id: 'cd-g2-4',
    chapterId: 'ch-g2',
    front: '～まじき',
    reading: '～まじき',
    hanViet: '',
    back: 'Không được phép ~ (với tư cách là...)',
    examples: [
      { jp: '教師にあるまじき発言だ。', vi: 'Đó là phát ngôn không thể chấp nhận ở một giáo viên.' },
    ],
    extra: 'Mẫu cố định: 「N にあるまじき + N」. Văn viết, trang trọng.',
    sortOrder: 4,
  },
  {
    id: 'cd-g2-5',
    chapterId: 'ch-g2',
    front: '～とあって',
    reading: '～とあって',
    hanViet: '',
    back: 'Vì là ~ (nên đương nhiên xảy ra chuyện đó)',
    examples: [
      { jp: '連休とあって、駅は人でいっぱいだ。', vi: 'Vì là kỳ nghỉ dài nên nhà ga đông nghịt.' },
    ],
    extra: 'Không dùng cho chuyện của chính người nói.',
    sortOrder: 5,
  },

  // ---- 語彙 第1部 ----
  {
    id: 'cd-v1-1',
    chapterId: 'ch-v1',
    front: '曖昧',
    reading: 'あいまい',
    hanViet: '',
    back: 'mơ hồ, không rõ ràng',
    examples: [{ jp: '曖昧な返事では、こちらも判断できない。', vi: 'Trả lời mơ hồ thì bên tôi cũng không quyết được.' }],
    extra: 'Đi với 「曖昧な態度 / 曖昧にする」.',
    sortOrder: 1,
  },
  {
    id: 'cd-v1-2',
    chapterId: 'ch-v1',
    front: '一目瞭然',
    reading: 'いちもくりょうぜん',
    hanViet: '',
    back: 'rõ như ban ngày, nhìn là hiểu ngay',
    examples: [{ jp: 'グラフにすれば差は一目瞭然だ。', vi: 'Vẽ thành biểu đồ thì chênh lệch thấy ngay.' }],
    extra: '四字熟語. Thường dùng với 「～は一目瞭然だ」.',
    sortOrder: 2,
  },
  {
    id: 'cd-v1-3',
    chapterId: 'ch-v1',
    front: '円滑',
    reading: 'えんかつ',
    hanViet: '',
    back: 'trôi chảy, suôn sẻ',
    examples: [{ jp: '会議が円滑に進むよう準備する。', vi: 'Chuẩn bị để cuộc họp diễn ra suôn sẻ.' }],
    extra: null,
    sortOrder: 3,
  },
  {
    id: 'cd-v1-4',
    chapterId: 'ch-v1',
    front: '顕著',
    reading: 'けんちょ',
    hanViet: '',
    back: 'rõ rệt, nổi bật',
    examples: [{ jp: '新しい設備の導入で生産性が顕著に向上した。', vi: 'Nhờ thiết bị mới, năng suất tăng rõ rệt.' }],
    extra: 'Văn viết, hay gặp trong báo cáo và bản tin.',
    sortOrder: 4,
  },
  {
    id: 'cd-v1-5',
    chapterId: 'ch-v1',
    front: '打開',
    reading: 'だかい',
    hanViet: '',
    back: 'phá vỡ thế bế tắc',
    examples: [{ jp: '現状を打開する策を探る。', vi: 'Tìm cách phá vỡ tình trạng hiện tại.' }],
    extra: 'Hay đi cùng 「現状 / 局面 / 事態」.',
    sortOrder: 5,
  },

  // ---- 語彙 第2部 ----
  {
    id: 'cd-v2-1',
    chapterId: 'ch-v2',
    front: '融通',
    reading: 'ゆうずう',
    hanViet: '',
    back: 'linh hoạt; xoay xở (tiền bạc)',
    examples: [{ jp: '彼は規則に厳しく、融通が利かない。', vi: 'Anh ta cứng nhắc với quy định, không linh hoạt.' }],
    extra: '「融通が利く / 利かない」 là cụm cố định.',
    sortOrder: 1,
  },
  {
    id: 'cd-v2-2',
    chapterId: 'ch-v2',
    front: '賄う',
    reading: 'まかなう',
    hanViet: '',
    back: 'trang trải, chu cấp',
    examples: [{ jp: '部費で合宿の費用を賄う。', vi: 'Dùng quỹ CLB để trang trải chi phí trại tập huấn.' }],
    extra: null,
    sortOrder: 2,
  },
  {
    id: 'cd-v2-3',
    chapterId: 'ch-v2',
    front: '目論む',
    reading: 'もくろむ',
    hanViet: '',
    back: 'mưu tính, toan tính (thường tiêu cực)',
    examples: [{ jp: '経営陣は会社の再建を目論んでいる。', vi: 'Ban lãnh đạo đang tính chuyện tái cấu trúc công ty.' }],
    extra: 'Danh từ: 「目論見（もくろみ）」.',
    sortOrder: 3,
  },
  {
    id: 'cd-v2-4',
    chapterId: 'ch-v2',
    front: '潔い',
    reading: 'いさぎよい',
    hanViet: '',
    back: 'dứt khoát, quang minh chính đại',
    examples: [{ jp: '彼は潔く自分の非を認めた。', vi: 'Anh ấy dứt khoát nhận lỗi của mình.' }],
    extra: 'Chú ý cách đọc: KHÔNG phải 「きよい」.',
    sortOrder: 4,
  },
  {
    id: 'cd-v2-5',
    chapterId: 'ch-v2',
    front: '懸念',
    reading: 'けねん',
    hanViet: '',
    back: 'lo ngại, e ngại',
    examples: [{ jp: '副作用が懸念される。', vi: 'Tác dụng phụ là điều đáng lo ngại.' }],
    extra: 'Hay ở dạng bị động 「～が懸念される」.',
    sortOrder: 5,
  },

  // ---- 漢字 第1回 ----
  {
    id: 'cd-k1-1',
    chapterId: 'ch-k1',
    front: '促進',
    reading: 'そくしん',
    hanViet: 'XÚC TIẾN',
    back: 'thúc đẩy',
    examples: [{ jp: '輸出を促進する政策。', vi: 'Chính sách thúc đẩy xuất khẩu.' }],
    extra: null,
    sortOrder: 1,
  },
  {
    id: 'cd-k1-2',
    chapterId: 'ch-k1',
    front: '把握',
    reading: 'はあく',
    hanViet: 'BẢ ÁC',
    back: 'nắm bắt, nắm rõ',
    examples: [{ jp: '現場の状況を把握する。', vi: 'Nắm rõ tình hình tại hiện trường.' }],
    extra: 'Chú ý cách đọc 「はあく」.',
    sortOrder: 2,
  },
  {
    id: 'cd-k1-3',
    chapterId: 'ch-k1',
    front: '網羅',
    reading: 'もうら',
    hanViet: 'VÕNG LA',
    back: 'bao quát toàn bộ',
    examples: [{ jp: '主要な論点を網羅した資料。', vi: 'Tài liệu bao quát các luận điểm chính.' }],
    extra: null,
    sortOrder: 3,
  },
  {
    id: 'cd-k1-4',
    chapterId: 'ch-k1',
    front: '遂行',
    reading: 'すいこう',
    hanViet: 'TOẠI HÀNH',
    back: 'thực hiện đến cùng (nhiệm vụ)',
    examples: [{ jp: '任務を遂行する。', vi: 'Hoàn thành nhiệm vụ.' }],
    extra: '「遂」 còn đọc 「つい(に)」 và 「と(げる)」.',
    sortOrder: 4,
  },
  {
    id: 'cd-k1-5',
    chapterId: 'ch-k1',
    front: '頻繁',
    reading: 'ひんぱん',
    hanViet: 'TẦN PHỒN',
    back: 'thường xuyên, liên tục',
    examples: [{ jp: '頻繁に連絡を取り合う。', vi: 'Liên lạc với nhau thường xuyên.' }],
    extra: null,
    sortOrder: 5,
  },

  // ---- 漢字 第2回 ----
  {
    id: 'cd-k2-1',
    chapterId: 'ch-k2',
    front: '貢献',
    reading: 'こうけん',
    hanViet: 'CỐNG HIẾN',
    back: 'đóng góp, cống hiến',
    examples: [{ jp: '地域社会に貢献する。', vi: 'Đóng góp cho cộng đồng địa phương.' }],
    extra: null,
    sortOrder: 1,
  },
  {
    id: 'cd-k2-2',
    chapterId: 'ch-k2',
    front: '妥協',
    reading: 'だきょう',
    hanViet: 'THỎA HIỆP',
    back: 'thỏa hiệp, nhượng bộ',
    examples: [{ jp: '品質については妥協しない。', vi: 'Về chất lượng thì không thỏa hiệp.' }],
    extra: null,
    sortOrder: 2,
  },
  {
    id: 'cd-k2-3',
    chapterId: 'ch-k2',
    front: '累積',
    reading: 'るいせき',
    hanViet: 'LŨY TÍCH',
    back: 'tích lũy dồn lại',
    examples: [{ jp: '累積した赤字を解消する。', vi: 'Xóa khoản lỗ lũy kế.' }],
    extra: null,
    sortOrder: 3,
  },
  {
    id: 'cd-k2-4',
    chapterId: 'ch-k2',
    front: '迅速',
    reading: 'じんそく',
    hanViet: 'TẤN TỐC',
    back: 'nhanh chóng, mau lẹ',
    examples: [{ jp: '迅速に対応する。', vi: 'Xử lý nhanh chóng.' }],
    extra: null,
    sortOrder: 4,
  },
  {
    id: 'cd-k2-5',
    chapterId: 'ch-k2',
    front: '懸案',
    reading: 'けんあん',
    hanViet: 'HUYỀN ÁN',
    back: 'vấn đề còn tồn đọng',
    examples: [{ jp: '長年の懸案がようやく解決した。', vi: 'Vấn đề tồn đọng nhiều năm cuối cùng đã được giải quyết.' }],
    extra: null,
    sortOrder: 5,
  },
]

export const QUIZZES: Quiz[] = [
  { id: 'qz-g1', chapterId: 'ch-g1', title: '1課クイズ — 文型を選ぶ', sortOrder: 1 },
  { id: 'qz-g2', chapterId: 'ch-g2', title: '2課クイズ — 文型を選ぶ', sortOrder: 1 },
  { id: 'qz-v1', chapterId: 'ch-v1', title: '第1部クイズ — 語を入れる', sortOrder: 1 },
  { id: 'qz-v2', chapterId: 'ch-v2', title: '第2部クイズ — 語を入れる', sortOrder: 1 },
  { id: 'qz-k1', chapterId: 'ch-k1', title: '第1回クイズ — 読み方', sortOrder: 1 },
  { id: 'qz-k2', chapterId: 'ch-k2', title: '第2回クイズ — 読み方', sortOrder: 1 },
]

export const QUESTIONS: Question[] = [
  // 文法 1課
  {
    id: 'q-g1-1',
    quizId: 'qz-g1',
    cardId: 'cd-g1-1',
    prompt: '彼は大けが（　　）、最後まで走り抜いた。',
    choices: ['をものともせず', 'をよそに', 'はおろか', 'ならいざしらず'],
    answerIndex: 0,
    explanation: '「をものともせず」= bất chấp khó khăn, mang sắc thái khen ngợi — hợp với việc chạy tiếp dù bị thương.',
    sortOrder: 1,
  },
  {
    id: 'q-g1-2',
    quizId: 'qz-g1',
    cardId: 'cd-g1-2',
    prompt: '住民の不安（　　）、工事は予定通り始まった。',
    choices: ['に難くなく', 'をよそに', 'はおろか', 'とあって'],
    answerIndex: 1,
    explanation: '「をよそに」= phớt lờ, mặc kệ — mang ý chê trách, khác với 「をものともせず」.',
    sortOrder: 2,
  },
  {
    id: 'q-g1-3',
    quizId: 'qz-g1',
    cardId: 'cd-g1-3',
    prompt: '彼は漢字（　　）、ひらがなさえ読めない。',
    choices: ['をよそに', 'ならいざしらず', 'はおろか', 'に難くない'],
    answerIndex: 2,
    explanation: '「はおろか」 đi với vế sau phủ định + 「さえ / も / まで」.',
    sortOrder: 3,
  },

  // 文法 2課
  {
    id: 'q-g2-1',
    quizId: 'qz-g2',
    cardId: 'cd-g2-1',
    prompt: 'この映画は見る者を感動させ（　　）。',
    choices: ['ずにはおかない', 'きらいがある', 'に足る', 'とあって'],
    answerIndex: 0,
    explanation: '「ずにはおかない」 diễn tả tác động chắc chắn xảy ra, chủ ngữ là sự vật.',
    sortOrder: 1,
  },
  {
    id: 'q-g2-2',
    quizId: 'qz-g2',
    cardId: 'cd-g2-2',
    prompt: '彼は物事を悲観的に考える（　　）がある。',
    choices: ['まじき', 'きらい', 'に足る', 'ものともせず'],
    answerIndex: 1,
    explanation: '「きらいがある」 chỉ dùng cho khuynh hướng tiêu cực.',
    sortOrder: 2,
  },
  {
    id: 'q-g2-3',
    quizId: 'qz-g2',
    cardId: 'cd-g2-4',
    prompt: '教師に（　　）発言だ。',
    choices: ['あるまじき', 'あるべく', 'あるとあって', 'あるに足る'],
    answerIndex: 0,
    explanation: 'Mẫu cố định 「N にあるまじき + N」= không được phép có ở tư cách đó.',
    sortOrder: 3,
  },

  // 語彙 第1部
  {
    id: 'q-v1-1',
    quizId: 'qz-v1',
    cardId: 'cd-v1-2',
    prompt: 'データをグラフにすれば、差は（　　）だ。',
    choices: ['曖昧', '一目瞭然', '円滑', '打開'],
    answerIndex: 1,
    explanation: '「一目瞭然」= nhìn một cái là hiểu ngay.',
    sortOrder: 1,
  },
  {
    id: 'q-v1-2',
    quizId: 'qz-v1',
    cardId: 'cd-v1-1',
    prompt: '（　　）な返事では、こちらも判断できない。',
    choices: ['顕著', '円滑', '曖昧', '一目瞭然'],
    answerIndex: 2,
    explanation: '「曖昧」= mơ hồ, không rõ ràng.',
    sortOrder: 2,
  },
  {
    id: 'q-v1-3',
    quizId: 'qz-v1',
    cardId: 'cd-v1-4',
    prompt: '新しい設備の導入で、生産性が（　　）に向上した。',
    choices: ['顕著', '曖昧', '打開', '円滑'],
    answerIndex: 0,
    explanation: '「顕著に向上する」= tăng lên rõ rệt.',
    sortOrder: 3,
  },

  // 語彙 第2部
  {
    id: 'q-v2-1',
    quizId: 'qz-v2',
    cardId: 'cd-v2-2',
    prompt: '部費で合宿の費用を（　　）。',
    choices: ['目論む', '賄う', '懸念する', '妥協する'],
    answerIndex: 1,
    explanation: '「賄う」= trang trải, lo chi phí bằng một nguồn nào đó.',
    sortOrder: 1,
  },
  {
    id: 'q-v2-2',
    quizId: 'qz-v2',
    cardId: 'cd-v2-1',
    prompt: '彼は規則に厳しく、（　　）が利かない。',
    choices: ['懸念', '融通', '打開', '貢献'],
    answerIndex: 1,
    explanation: '「融通が利かない」 là cụm cố định: cứng nhắc, không linh hoạt.',
    sortOrder: 2,
  },
  {
    id: 'q-v2-3',
    quizId: 'qz-v2',
    cardId: 'cd-v2-5',
    prompt: '新薬の副作用が（　　）されている。',
    choices: ['懸念', '網羅', '遂行', '融通'],
    answerIndex: 0,
    explanation: '「懸念される」= bị lo ngại; dạng bị động rất hay gặp trên bản tin.',
    sortOrder: 3,
  },

  // 漢字 第1回
  {
    id: 'q-k1-1',
    quizId: 'qz-k1',
    cardId: 'cd-k1-2',
    prompt: '現場の状況を「把握」する。\n「把握」の読み方は？',
    choices: ['はあく', 'はにぎ', 'ひあく', 'はいあく'],
    answerIndex: 0,
    explanation: '把握（はあく）— 「把」 đọc âm on là 「は」.',
    sortOrder: 1,
  },
  {
    id: 'q-k1-2',
    quizId: 'qz-k1',
    cardId: 'cd-k1-4',
    prompt: '任務を「遂行」する。\n「遂行」の読み方は？',
    choices: ['ついこう', 'すいこう', 'とこう', 'すいぎょう'],
    answerIndex: 1,
    explanation: '遂行（すいこう）. Chú ý 「遂に（ついに）」 đọc khác.',
    sortOrder: 2,
  },
  {
    id: 'q-k1-3',
    quizId: 'qz-k1',
    cardId: 'cd-k1-5',
    prompt: '「頻繁」に連絡を取る。\n「頻繁」の読み方は？',
    choices: ['ひんぱん', 'ひんばん', 'はんぱん', 'ひんぽん'],
    answerIndex: 0,
    explanation: '頻繁（ひんぱん）— âm 「ぱ」 chứ không phải 「ば」.',
    sortOrder: 3,
  },

  // 漢字 第2回
  {
    id: 'q-k2-1',
    quizId: 'qz-k2',
    cardId: 'cd-k2-1',
    prompt: '地域社会に「貢献」する。\n「貢献」の読み方は？',
    choices: ['こうけん', 'こうこん', 'くけん', 'こうげん'],
    answerIndex: 0,
    explanation: '貢献（こうけん）.',
    sortOrder: 1,
  },
  {
    id: 'q-k2-2',
    quizId: 'qz-k2',
    cardId: 'cd-k2-4',
    prompt: '「迅速」に対応する。\n「迅速」の読み方は？',
    choices: ['じんそく', 'しんそく', 'じんぞく', 'じんそう'],
    answerIndex: 0,
    explanation: '迅速（じんそく）.',
    sortOrder: 2,
  },
  {
    id: 'q-k2-3',
    quizId: 'qz-k2',
    cardId: 'cd-k2-3',
    prompt: '「累積」した赤字。\n「累積」の読み方は？',
    choices: ['るいせき', 'るいし', 'らいせき', 'るいぜき'],
    answerIndex: 0,
    explanation: '累積（るいせき）.',
    sortOrder: 3,
  },
]

// --- 参照系（本番では Supabase の select に当たる部分） -----------------------

export function chaptersOfTrack(track: StudyTrack): Chapter[] {
  const bookIds = BOOKS.filter((b) => b.track === track)
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((b) => b.id)

  return CHAPTERS.filter((c) => bookIds.includes(c.bookId)).sort((a, b) => {
    const byBook = bookIds.indexOf(a.bookId) - bookIds.indexOf(b.bookId)
    return byBook !== 0 ? byBook : a.sortOrder - b.sortOrder
  })
}

export function cardsOfChapter(chapterId: string): Card[] {
  return CARDS.filter((c) => c.chapterId === chapterId).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function quizzesOfChapter(chapterId: string): Quiz[] {
  return QUIZZES.filter((q) => q.chapterId === chapterId).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function questionsOfQuiz(quizId: string): Question[] {
  return QUESTIONS.filter((q) => q.quizId === quizId).sort((a, b) => a.sortOrder - b.sortOrder)
}

export function findQuiz(quizId: string): Quiz | undefined {
  return QUIZZES.find((q) => q.id === quizId)
}

export function trackOfChapter(chapterId: string): StudyTrack | undefined {
  const chapter = CHAPTERS.find((c) => c.id === chapterId)
  return BOOKS.find((b) => b.id === chapter?.bookId)?.track
}

/** 分野ごとのカード総数 — 進捗バーの分母。 */
export function cardCountOfTrack(track: StudyTrack): number {
  return CARDS.filter((c) => trackOfChapter(c.chapterId) === track).length
}

/** cardId から分野を引く。進捗を分野別に集計するときに使う。 */
export function trackOfCard(cardId: string): StudyTrack | undefined {
  const card = CARDS.find((c) => c.id === cardId)
  return card ? trackOfChapter(card.chapterId) : undefined
}

# Happy Class — デモ

JLPT N1（文法 / 語彙 / 漢字）学習アプリの公開デモです。フラッシュカード、クイズ、
課ごとのコメント、クラス全体の進捗タイムラインを備えています。

**ログイン不要・データベース不要。** 表示される内容はすべて `src/data/` にある
ダミーデータで、操作した結果（覚えた／まだ、クイズの点数、コメント）は開いている
ブラウザの `localStorage` にのみ保存されます。ヘッダーの **リセット** ですべて消して
初期状態に戻せます。

## 動かす

```bash
npm install
npm run dev
```

http://localhost:3000 を開くと `/dashboard` に転送されます。

## 画面

| パス | 内容 |
| --- | --- |
| `/dashboard` | 分野ごとの進捗と、4 フェーズのクラスタイムライン |
| `/grammar`, `/vocab`, `/kanji` | 課を選ぶ → カードをめくる、課のクイズ、コメント |
| `/quiz/[quizId]` | 4 択クイズ。その場で採点し、問題ごとに解説を表示 |
| `/admin` | クラス全体の進捗テーブル |

本番から意図して残した仕様がいくつかあります。

- 進捗は **カードの枚数** で測る。解いたクイズ数ではない。
- クイズで間違えると、その問題に紐づくカードが **要復習**（`weak`）になる。
  `weak` のカードはフラッシュカード側のボタンでは下げられず、同じ問題に正解して
  初めて解除される。
- 選択中の課はクエリパラメータ `?ch=` に入れるので、URL を共有でき、ブラウザの
  戻るも正しく動く。
- モバイルファースト。スマホでは下タブ、コメントはサイドバーではなくカードの下に
  回り込む。タップ対象はすべて 44px 以上。

## 本番との違い

本番は Supabase（Postgres + Auth）上で動き、読み取りは Server Component、書き込みは
Server Action、全テーブルで RLS を有効にしています。デモではその層をすべて外しました。

| 本番 | デモ |
| --- | --- |
| Supabase Auth（招待メールのホワイトリスト） | ログインなし。ダミーの利用者 `DEMO_USER` が固定で入っている |
| Postgres + RLS | `src/data/` の TypeScript 配列 |
| Server Action で DB に書き込み | React の state + `localStorage`（`src/lib/demo-store.ts`） |
| サーバーで採点し、正解はクライアントに送らない | クライアントで採点するため、正解がバンドルに含まれる |

つまりこのデモは UI と操作の流れを見るためのもので、**セキュリティの参考実装では
ありません**。

## 表示言語について

UI のラベルは日本語ですが、カードの意味・例文の訳・解説・学習者のコメントは
ベトナム語のままにしています。このアプリの想定利用者が「ベトナム語話者の N1 受験者」で、
その部分は翻訳すると学習内容として成立しなくなるためです。

## 構成

```
src/
  app/
    (app)/
      layout.tsx              # ヘッダー + 下タブ
      [track]/page.tsx        # track = grammar | vocab | kanji、課は ?ch= で指定
      dashboard/
      quiz/[quizId]/
      admin/
  components/
    flashcard.tsx
    quiz-runner.tsx
    comments-panel.tsx
    progress-timeline.tsx
    ui/                       # shadcn/ui（Base UI）
  data/                       # ダミーデータ一式
    types.ts
    content.ts                # books / chapters / cards / quizzes / questions
    members.ts                # ダミーのクラス、フェーズ、初期コメント
  lib/
    demo-store.ts             # Supabase の代わり: ストア + localStorage
    tracks.ts                 # 'grammar' <-> '文法' の対応
```

## 技術スタック

Next.js 16（App Router）· React 19 · TypeScript strict · Tailwind CSS v4 ·
shadcn/ui（Base UI）· lucide-react

## デプロイ

ふつうの Next.js アプリなので、Vercel でも `next build` + `next start` が動く環境なら
どこでも動きます。

```bash
npm run build
npm run start
```

---

`src/data/` に入っている日本語の例文・問題は、動作確認用にすべて自作したものです。
市販の教材からの引用は含みません。

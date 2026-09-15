# Happy Class — demo

Bản demo công khai của một app học JLPT N1 (文法 / 語彙 / 漢字): flashcard, quiz,
bình luận theo chương và timeline tiến độ của cả lớp.

**Không cần đăng nhập, không cần database.** Toàn bộ nội dung là dữ liệu mẫu nằm
trong `src/data/`; những gì bạn bấm (đã thuộc / chưa thuộc, điểm quiz, bình luận)
được lưu vào `localStorage` của chính trình duyệt đang mở. Nút **Đặt lại** ở
header xoá sạch và trả về trạng thái ban đầu.

## Chạy thử

```bash
npm install
npm run dev
```

Mở http://localhost:3000 — trang chủ chuyển thẳng tới `/dashboard`.

## Có gì trong demo

| Trang | Nội dung |
| --- | --- |
| `/dashboard` | Tiến độ theo từng mảng + timeline 4 phase của cả lớp |
| `/grammar`, `/vocab`, `/kanji` | Chọn chương → flashcard lật được, quiz của chương, bình luận |
| `/quiz/[quizId]` | Làm quiz trắc nghiệm, chấm ngay, có giải thích từng câu |
| `/admin` | Bảng tiến độ cả lớp |

Vài hành vi được giữ nguyên từ bản thật vì chúng là phần thú vị của app:

- Tiến độ đo bằng **số thẻ** đã đụng tới, không phải số quiz đã làm.
- Trả lời sai một câu quiz → thẻ tương ứng bị đánh dấu **cần review** (`weak`).
  Thẻ đang `weak` không hạ được bằng nút trên flashcard; phải làm đúng câu quiz đó
  mới gỡ.
- Chương đang chọn nằm ở query param `?ch=` nên chia sẻ link được và nút Back chạy đúng.
- Mobile-first: bottom tab trên điện thoại, bình luận đẩy xuống dưới card thay vì
  bị giấu đi; mọi nút bấm ≥44px.

## Khác gì so với bản thật

Bản thật chạy trên Supabase (Postgres + Auth), đọc dữ liệu bằng Server Component
và ghi bằng Server Action, mọi bảng đều bật RLS. Bản demo bỏ hết phần đó:

| Bản thật | Bản demo |
| --- | --- |
| Supabase Auth (whitelist email) | Không đăng nhập, có sẵn một "bạn" giả (`DEMO_USER`) |
| Postgres + RLS | Mảng TypeScript trong `src/data/` |
| Server Action ghi DB | State React + `localStorage` (`src/lib/demo-store.tsx`) |
| Chấm quiz ở server, không gửi đáp án về client | Chấm ở client — đáp án nằm trong bundle |

Nói cách khác: demo này để xem giao diện và luồng thao tác, **không** phải mẫu
tham khảo về bảo mật.

## Cấu trúc

```
src/
  app/
    (app)/
      layout.tsx              # header + bottom tab + DemoProvider
      [track]/page.tsx        # track = grammar | vocab | kanji, chương qua ?ch=
      dashboard/
      quiz/[quizId]/
      admin/
  components/
    flashcard.tsx
    quiz-runner.tsx
    comments-panel.tsx
    progress-timeline.tsx
    ui/                       # shadcn (Base UI)
  data/                       # toàn bộ dữ liệu mẫu
    types.ts
    content.ts                # books / chapters / cards / quizzes / questions
    members.ts                # lớp học giả, phase, bình luận mẫu
  lib/
    demo-store.tsx            # thay cho Supabase: state + localStorage
    tracks.ts                 # map 'grammar' <-> '文法'
```

## Stack

Next.js 16 (App Router) · React 19 · TypeScript strict · Tailwind CSS v4 ·
shadcn/ui trên Base UI · lucide-react.

## Deploy

Là một app Next.js bình thường, deploy được lên Vercel hoặc bất cứ đâu chạy được
`next build` + `next start`:

```bash
npm run build
npm run start
```

## Giấy phép

MIT — xem [LICENSE](./LICENSE). Nội dung tiếng Nhật trong `src/data/` là ví dụ tự
soạn cho mục đích minh hoạ, không trích từ giáo trình nào.

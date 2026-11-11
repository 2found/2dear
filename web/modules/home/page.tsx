import { Card, CardContent } from '@tofound/ui'

// Server component: renders the same bytes for every viewer. Viewer-specific
// state belongs in a client island (see docs/ARCHITECT-WEB.md).
export default function HomePage() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center gap-4 p-6">
      <h1 className="text-3xl font-semibold">
        Quà <em className="font-serif font-normal">biết nói</em>
      </h1>
      <Card>
        <CardContent className="p-5">
          <p className="text-muted-foreground">
            Một con gấu bông, một tấm thiệp QR và bức thư bằng giọng nói thật. Trang đang được
            xây dựng.
          </p>
        </CardContent>
      </Card>
    </main>
  )
}

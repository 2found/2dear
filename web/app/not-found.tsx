import Link from 'next/link'
import { Button, Card, CardContent } from '@tofound/ui'

export default function NotFound() {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col justify-center p-6">
      <Card>
        <CardContent className="flex flex-col items-start gap-3 p-5">
          <h1 className="text-xl font-semibold">Không tìm thấy trang</h1>
          <p className="text-muted-foreground">Trang bạn tìm không tồn tại hoặc đã được chuyển đi.</p>
          <Button asChild>
            <Link href="/">Về trang chủ</Link>
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
